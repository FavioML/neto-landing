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
} catch (e) {
  await browser.close();
  fatal(e.message);
}
await browser.close();

console.log(`\nATRIBUCIÓN DEL SALTO — ${base}\n`);
console.log(notas.join('\n'));
if (fallos.length) {
  console.error(`\n✗ ${fallos.length} de 4 casos pierden la atribución:\n\n  ` + fallos.join('\n\n  ') + '\n');
  process.exit(1);
}
console.log('\n✓ verify-atribucion: los 4 casos conservan el origen hasta el otro lado del salto\n');
