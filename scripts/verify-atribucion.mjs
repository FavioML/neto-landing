#!/usr/bin/env node
/**
 * VERIFICA EL SALTO, NO EL CÓDIGO.
 *
 * La pregunta que contesta: si alguien entra a neto.pe con un UTM y hace clic en el CTA, ¿qué
 * llega al otro lado? Se responde recorriendo el salto en un navegador real y leyendo los `href`
 * que quedan en el DOM, porque leer el código no distingue un arreglo que funciona de uno que
 * compila. De 2898 pageviews de app.neto.pe en 90 días, 10 traían `utm_`: ese es el número que
 * esto existe para que deje de ser 10.
 *
 *   node scripts/verify-atribucion.mjs                      # contra producción
 *   node scripts/verify-atribucion.mjs http://localhost:4321/ # contra el build local
 *
 * exit 0 = los cuatro casos pasan. exit 1 = el salto pierde la atribución. exit 2 = no se pudo
 * medir (la página no cargó, no hay CTA, el modal no abre), que NO es verde: un guard que no
 * encuentra qué mirar tiene que gritar, no aprobar.
 *
 * LOS CUATRO CASOS, y por qué cada uno está separado. Un solo caso feliz dejaría pasar tres
 * regresiones distintas:
 *
 *   1. CON UTM           el par llega entero a app.neto.pe y el origen entra al texto de WhatsApp
 *   2. SIN NADA          sale el par derivado (`utm_source=directo&utm_medium=landing`), porque la
 *                        alternativa es dejar sin origen al 51% de las sesiones
 *   3. POR REFERRER      llegar desde chatgpt.com sin UTM se clasifica igual. Es el canal que
 *                        mejor convierte (47% a CTA) y el que más se subcontaba
 *   4. NAVEGACIÓN INTERNA entrar con UTM, ir a otra página por un `<Link>`, y recién ahí hacer
 *                        clic. **Es el único caso que un `curl` no puede ver** y el que más se
 *                        rompe: `<Link>` de Next tira el query string, así que sin la persistencia
 *                        en sessionStorage los otros tres pasan y este pierde el UTM igual.
 *
 * El caso 2 es además la contraprueba de vacuidad del caso 1: si el hook devolviera siempre el
 * mismo valor fijo, uno de los dos falla.
 *
 * LOS CUATRO QUE SE SUMARON el 2026-09-10 (Acción 5 del audit), y ninguno pasa por el modal:
 *
 *   5. REFERIDO SIN UTM   `/r?ref=CODE` → el texto de WhatsApp EMPIEZA con `ref:CODE` (contrato con
 *                        el regex de referidos del backend) y lleva `[referido|referido]` detrás.
 *                        El origen sale de la página porque el 302 de `/r/CODE` tira el UTM.
 *   6. REFERIDO CON UTM  el UTM explícito gana sobre el que implica la página. Contraprueba del 5.
 *                        6b: y el de la página le gana al referrer (llegar desde WhatsApp).
 *
 * Además, todo link de WhatsApp que se lee se valida en su FORMA cruda (`formaWa`): número y texto
 * sin `+`. La etiqueta sola no alcanzaba (ver `formaWa`).
 *   7. BLOG              el link del CUERPO del post dice `[blog|ig]` y el del footer `[footer|ig]`.
 *                        Los dos salían `[hero]` fijo, sin origen. Se mira también el HTML crudo:
 *                        sin JS tienen que decir `[blog]`, no `[hero]`.
 *   8. FAQ               la respuesta "¿cómo empiezo?" trae un link a WhatsApp y otro a la app, los
 *                        dos dentro de un string de HTML: tienen que salir atribuidos igual.
 */

import { chromium } from 'playwright';

const base = (process.argv[2] || 'https://neto.pe/').replace(/\/?$/, '/');
const fallos = [];
const notas = [];

const fatal = (msg) => {
  console.error(`\n✗ NO SE PUDO MEDIR: ${msg}\n`);
  process.exit(2);
};

/**
 * Espera a que la página esté lista para que el clic signifique algo. DOS esperas, y la
 * diferencia entre ellas costó una corrida en falso:
 *
 *   · `__reactProps$` en el nodo = React hidrató. Si esto no pasa, el `onClick` no existe, el
 *     `<a>` navega a wa.me por su href nativo y el modal no abre nunca. Es condición DURA: sin
 *     hidratación no hay nada que medir, así que tira y sale por exit 2.
 *
 *   · la clave en `sessionStorage` = el efecto que captura la atribución YA corrió. **React pega
 *     las props ANTES de correr los efectos**, medido acá: a 0 ms la prop está y el storage es
 *     `null`; a 200 ms están los dos. Con sólo la primera espera, el caso 4 navegaba antes de
 *     que se guardara nada y reportaba una pérdida de UTM que no existía.
 *
 * La segunda espera es NO FATAL a propósito. Si la captura de verdad se rompiera, tratarla como
 * precondición mandaría una regresión real al cajón de "no se pudo medir"; dejándola pasar, las
 * aserciones fallan solas y el veredicto sale por exit 1, que es donde tiene que salir.
 */
const listo = async (page) => {
  await page
    .waitForFunction(
      () => {
        const el = document.getElementById('hero-cta');
        return !!el && Object.keys(el).some((k) => k.startsWith('__reactProps$'));
      },
      { timeout: 20_000 }
    )
    .catch(() => {
      throw new Error('el CTA nunca hidrató (20s): sin React montado el clic navega a wa.me y el modal no abre');
    });
  await page
    .waitForFunction(() => sessionStorage.getItem('neto:atribucion') !== null, { timeout: 5_000 })
    .catch(() => {});
};

/**
 * Abre el modal de canales desde el CTA del hero y devuelve los dos href.
 * `pasos` permite intercalar navegación interna antes del clic (caso 4).
 */
async function hrefsDelModal(browser, url, { referer, pasos } = {}) {
  // Contexto limpio por caso: el sessionStorage es justo lo que se está midiendo, así que
  // reusar el contexto haría que el caso 2 heredara la atribución del caso 1 y diera verde
  // por contaminación.
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', referer, timeout: 45_000 });
    if (!res || !res.ok()) throw new Error(`${url} devolvió ${res ? res.status() : 'sin respuesta'}`);
    if (pasos) await pasos(page);

    const cta = page.locator('#hero-cta');
    if (!(await cta.count())) throw new Error('no hay #hero-cta en la página: cambió el ancla del CTA');
    await listo(page);
    await cta.first().click();

    const modal = page.locator('[role="dialog"]');
    await modal.waitFor({ state: 'visible', timeout: 10_000 });
    const wa = await modal.locator('a[href^="https://wa.me/"]').first().getAttribute('href');
    const app = await modal.locator('a[href*="app.neto.pe"]').first().getAttribute('href');
    if (!wa || !app) throw new Error('el modal abrió pero no tiene los dos links (WhatsApp y app)');
    return { wa: decodeURIComponent(wa), app };
  } finally {
    await ctx.close();
  }
}

/**
 * Lee `href`s de links que están en la PÁGINA (no en el modal) después de que la atribución
 * corrió. `listos` es la condición que dice que el efecto ya reescribió los links; se espera
 * NO FATAL por la misma razón que la segunda espera de `listo`: si la reescritura se rompiera,
 * las aserciones tienen que fallar solas por exit 1, no irse al cajón de "no se pudo medir".
 */
async function hrefsDePagina(browser, url, selectores, listos, { referer } = {}) {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000, referer });
    if (!res || !res.ok()) throw new Error(`${url} devolvió ${res ? res.status() : 'sin respuesta'}`);
    await page.waitForFunction(listos, { timeout: 10_000 }).catch(() => {});
    const out = {};
    for (const [k, sel] of Object.entries(selectores)) {
      const href = await page.locator(sel).first().getAttribute('href').catch(() => null);
      if (!href) throw new Error(`no hay "${sel}" en ${url}: cambió el marcado`);
      out[k] = decodeURIComponent(href);
      formaWa(`${url} → ${k}`, href);
    }
    return out;
  } finally {
    await ctx.close();
  }
}

/**
 * La FORMA del link de WhatsApp, sobre el href CRUDO (sin decodificar). Buscar la etiqueta no
 * alcanza: la revisión adversarial le hizo perder el número y codificar los espacios como `+` a la
 * reescritura, y los ocho casos seguían verdes porque la etiqueta seguía ahí. Un link sin número no
 * abre ningún chat. Los que no son de WhatsApp pasan de largo.
 */
function formaWa(donde, crudo) {
  if (!crudo.startsWith('https://wa.me/')) return;
  if (!/^https:\/\/wa\.me\/51933014505\?text=[^+&#\s]+$/.test(crudo)) {
    fallos.push(`forma del link de WhatsApp (${donde}): se esperaba wa.me/51933014505?text=<texto sin "+"> → ${crudo}`);
  }
}

/** Cada par [nombre, href, fragmento]: falla si el href no contiene el fragmento. */
const casoLinks = (nombre, pares) => {
  const problemas = pares
    .filter(([, href, frag]) => !href.includes(frag))
    .map(([que, href, frag]) => `${que} no trae "${frag}" → ${href}`);
  if (problemas.length) fallos.push(`${nombre}:\n    ` + problemas.join('\n    '));
  else notas.push(`  ✓ ${nombre.padEnd(22)} ${pares.map(([, , f]) => f).join('  ')}`);
};

const caso = (nombre, { wa, app }, { etiqueta, enApp }) => {
  const problemas = [];
  if (!wa.includes(etiqueta)) problemas.push(`el texto de WhatsApp no trae "${etiqueta}" → ${wa}`);
  for (const frag of enApp) {
    if (!app.includes(frag)) problemas.push(`el link a la app no trae "${frag}" → ${app}`);
  }
  if (problemas.length) fallos.push(`${nombre}:\n    ` + problemas.join('\n    '));
  else notas.push(`  ✓ ${nombre.padEnd(22)} wa:${etiqueta}  app:${enApp.join('&')}`);
};

const browser = await chromium.launch();
try {
  // 1. Con UTM: se propaga TAL CUAL, sin que nadie lo pise.
  caso(
    '1. con UTM',
    await hrefsDelModal(browser, `${base}?utm_source=ig&utm_medium=bio`),
    { etiqueta: '[hero|ig]', enApp: ['utm_source=ig', 'utm_medium=bio'] }
  );

  // 2. Sin UTM ni referrer: par derivado. Es la contraprueba del caso 1.
  caso(
    '2. sin nada',
    await hrefsDelModal(browser, base),
    { etiqueta: '[hero|directo]', enApp: ['utm_source=directo', 'utm_medium=landing'] }
  );

  // 3. Referrer sin UTM. `referer` en el goto sí llena `document.referrer` en Chromium.
  caso(
    '3. referrer chatgpt',
    await hrefsDelModal(browser, base, { referer: 'https://chatgpt.com/' }),
    { etiqueta: '[hero|chatgpt.com]', enApp: ['utm_source=chatgpt.com', 'utm_medium=landing'] }
  );

  // 4. Navegación interna. Se entra con UTM y se va a /faq por un <Link> del navbar, que borra el
  // query string: lo que sostiene la atribución de acá en adelante es el sessionStorage.
  caso(
    '4. tras <Link> interno',
    await hrefsDelModal(browser, `${base}?utm_source=tiktok&utm_medium=bio`, {
      pasos: async (page) => {
        // **La espera de hidratación acá NO es cosmética: es el límite real del mecanismo.** La
        // captura corre en un efecto de React, así que una navegación ANTERIOR a la hidratación
        // se lleva el UTM sin guardar nada. Escrito así porque es el camino que un humano
        // recorre: los links internos de la landing se clickean después del primer pintado, y un
        // `<Link>` de Next ni siquiera puede dispararse antes (su `onClick` no existe todavía).
        // Si algún día se quiere cubrir también la carrera, la forma es un script inline en el
        // `<head>`, no mover esto de lugar.
        await listo(page);
        await page.goto(`${base}faq`, { waitUntil: 'domcontentloaded' });
        if (new URL(page.url()).search) throw new Error('la navegación interna conservó el query string: este caso ya no prueba la persistencia');
        await page.goto(base, { waitUntil: 'domcontentloaded' });
      },
    }),
    { etiqueta: '[hero|tiktok]', enApp: ['utm_source=tiktok', 'utm_medium=bio'] }
  );

  // 5 y 6. Referido. Código inventado a propósito: el backend no lo resuelve y la página cae a la
  // invitación genérica, que es lo que se quiere (no se consulta ni se toca la cuenta de nadie).
  const REF = 'QAPROBE1';
  const refListo = () => {
    const a = document.querySelector('main a[href^="https://wa.me/"]');
    return !!a && decodeURIComponent(a.getAttribute('href')).includes('|');
  };
  const refSel = { wa: 'main a[href^="https://wa.me/"]', app: 'main a[href*="app.neto.pe"]' };
  const r5 = await hrefsDePagina(browser, `${base}r?ref=${REF}`, refSel, refListo);
  casoLinks('5. referido sin UTM', [
    ['el texto de WhatsApp', r5.wa, `text=Hola NETO ref:${REF} [referido|referido]`],
    ['el link a la app', r5.app, `ref=${REF}`],
    ['el link a la app', r5.app, 'utm_source=referido'],
  ]);
  const r6 = await hrefsDePagina(browser, `${base}r?ref=${REF}&utm_source=ig&utm_medium=story`, refSel, refListo);
  casoLinks('6. referido con UTM', [
    ['el texto de WhatsApp', r6.wa, `ref:${REF} [referido|ig]`],
    ['el link a la app', r6.app, 'utm_source=ig'],
  ]);
  // 6b. La precedencia: el origen que implica la página le gana al referrer. Quien abre un link de
  // referido casi siempre llega desde WhatsApp, y sin esto se contaría como `whatsapp` y no como
  // `referido` (la revisión movió `defecto` detrás del referrer y los ocho casos seguían verdes).
  const r6b = await hrefsDePagina(browser, `${base}r?ref=${REF}`, refSel, refListo, { referer: 'https://web.whatsapp.com/' });
  casoLinks('6b. referido vía WhatsApp', [
    ['el texto de WhatsApp', r6b.wa, `ref:${REF} [referido|referido]`],
    ['el link a la app', r6b.app, 'utm_source=referido'],
  ]);

  // 7. Blog: el cuerpo del post y el footer. Primero el HTML crudo, que es lo que ve quien no
  // corre JS y lo que queda si la hidratación falla: tiene que decir la posición correcta.
  const POST = 'blog/gastos-hormiga-peru';
  const crudo = await (await fetch(`${base}${POST}`)).text();
  const enCrudo = (s) => crudo.includes(encodeURIComponent(s));
  if (!enCrudo('[blog]') || !enCrudo('[footer]') || enCrudo('[hero]')) {
    fallos.push(`7. blog (HTML sin JS): [blog]=${enCrudo('[blog]')} [footer]=${enCrudo('[footer]')} [hero]=${enCrudo('[hero]')} — se esperaba true/true/false`);
  }
  const r7 = await hrefsDePagina(
    browser,
    `${base}${POST}?utm_source=ig&utm_medium=bio`,
    { cuerpo: '.prose-neto a[href^="https://wa.me/"]', footer: 'footer a[href^="https://wa.me/"]' },
    () => [...document.querySelectorAll('.prose-neto a[href^="https://wa.me/"], footer a[href^="https://wa.me/"]')]
      .every((a) => decodeURIComponent(a.getAttribute('href')).includes('|'))
  );
  casoLinks('7. blog con UTM', [
    ['el link del cuerpo', r7.cuerpo, '[blog|ig]'],
    ['el link del footer', r7.footer, '[footer|ig]'],
  ]);

  // 8. FAQ: links adentro de una respuesta que es un string de HTML.
  const r8 = await hrefsDePagina(
    browser,
    `${base}faq?utm_source=tiktok&utm_medium=bio`,
    { wa: 'details a[href^="https://wa.me/"]', app: 'details a[href*="app.neto.pe"]' },
    () => {
      const a = document.querySelector('details a[href*="app.neto.pe"]');
      return !!a && a.getAttribute('href').includes('utm_source');
    }
  );
  casoLinks('8. faq con UTM', [
    ['el link a WhatsApp', r8.wa, '[faq|tiktok]'],
    ['el link a la app', r8.app, 'utm_source=tiktok'],
  ]);
} catch (e) {
  await browser.close();
  fatal(e.message);
}
await browser.close();

console.log(`\nATRIBUCIÓN DEL SALTO — ${base}\n`);
console.log(notas.join('\n'));
if (fallos.length) {
  console.error(`\n✗ ${fallos.length} caso(s) pierden la atribución:\n\n  ` + fallos.join('\n\n  ') + '\n');
  process.exit(1);
}
console.log(`\n✓ verify-atribucion: los ${notas.length} casos conservan el origen hasta el otro lado del salto\n`);
