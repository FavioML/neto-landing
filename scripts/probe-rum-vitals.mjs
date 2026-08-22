#!/usr/bin/env node
/**
 * ¿La landing REPORTA Core Web Vitals de usuarios reales, o solo dice que sí?
 *
 * Por qué existe
 * --------------
 * Los `deploy-config.json` declaran `LCP 2500 / INP 200 / CLS 0.1` desde el
 * 03-ago-2026 y durante 19 días no los evaluó NADIE: `tools/canary-cwv/check-cwv.mjs`
 * exige datos de campo de CrUX, y CrUX no publica agregado para neto.pe por tráfico
 * insuficiente. Buscando de dónde sacar campo apareció que el proyecto PostHog
 * `neto-landing` **ya tenía la autocaptura de web vitals encendida server-side**
 * (`GET https://us-assets.i.posthog.com/array/<token>/config` devuelve
 * `capturePerformance.web_vitals: true`), sin que nadie lo declarara en el código.
 *
 * Un toggle en la consola de un tercero es lo que se apaga solo y en silencio: no deja
 * diff, no deja commit, y el día que cambie el instrumento se vuelve no-op sin que nada
 * grite. Este probe no le cree ni al endpoint de config ni al código: **abre un navegador
 * real contra producción y exige ver el POST con las métricas adentro.**
 *
 * Las cuatro trampas de este probe, y son las que lo hacen no-trivial
 * ------------------------------------------------------------------
 * 1. **PostHog descarta el tráfico automatizado.** Su detector de bots termina en
 *    `return !!navigator.webdriver` (verificado leyendo `array.js`), y Playwright pone
 *    esa bandera. La PRIMERA versión de este archivo salía `NO_REPORTA` con toda
 *    confianza contra una landing que reportaba bien: un negativo que rechazaba por
 *    otra condición. Por eso acá se enmascara la bandera, y por eso el probe **exige
 *    ver el POST** en vez de tratar el silencio como respuesta.
 * 2. **Un probe que logra que PostHog lo acepte, contamina.** Sus métricas de un
 *    Chromium headless en un datacenter entrarían al mismo dataset del que después se
 *    lee la mediana. Por eso la petición se INTERCEPTA: se lee el cuerpo que el cliente
 *    compuso y no llega nada a producción. Lo que queda sin verificar es que el servidor
 *    de PostHog la acepte, que no es código nuestro.
 *
 *    Pero se responde **200 fingido, no abort**. Abortar parecía lo más limpio y dejaba
 *    el probe ciego: el `$web_vitals` sale SEGUNDO, y con la primera petición abortada
 *    el cliente de PostHog trata el envío como fallido y retiene el resto en su cola de
 *    reintento. O sea que el probe rompía el transporte que estaba tratando de medir y
 *    después reportaba `NO_REPORTA` — la misma clase de falso negativo de la trampa 1,
 *    cometida dos veces en la misma sesión.
 *
 * 3. **"Al menos una métrica" no es un verde que sirva.** La primera versión aceptaba con
 *    cualquiera de las cuatro, incluido FCP, que ni siquiera es uno de los tres umbrales
 *    declarados. En una corrida real llegan LCP y FCP y vienen null CLS e INP, así que ese
 *    verde convivía con dos de los tres umbrales sin dato. Hoy se EXIGE LCP y se listan en
 *    la salida las que no se observaron.
 *
 * 4. **El LCP no está garantizado en UNA visita.** Medido en A/B sobre el mismo servidor
 *    local y la misma build: dos corridas seguidas, una con `["LCP","FCP"]` y otra con
 *    `["FCP"]` sola. La causa es el flush diferido de PostHog, que puede salir antes de que
 *    el LCP se finalice. O sea que exigir LCP en una sola visita convierte este check en
 *    intermitente — y un canary que falla una de cada dos veces se deja de leer, que es
 *    peor que no tenerlo. Por eso el probe REINTENTA la visita hasta `INTENTOS` veces y le
 *    alcanza con verlo una vez. No es tapar la intermitencia: la pregunta es "¿el pipeline
 *    puede reportar LCP?", y una sola respuesta afirmativa la contesta.
 *
 * Qué cubre y qué NO cubre, dicho explícitamente
 * ----------------------------------------------
 * CUBRE el camino de cliente entero: autocaptura encendida → `web-vitals.js` cargado →
 * métrica medida → evento compuesto → POST emitido.
 *
 * NO cubre dos cosas, y ninguna es un descuido:
 * - **Que INP y CLS estén llegando.** El INP no existe sin interacción y el CLS puede ser 0
 *   y omitirse; exigirlos dejaría este probe rojo por el comportamiento normal de una visita
 *   de 12 segundos. Quien contesta eso es `check-cwv-rum.mjs`, que ve 28 días y reporta el
 *   `n` de cada métrica.
 * - **El volumen.** Si hay suficientes sesiones reales para que un p75 signifique algo se
 *   contesta en PostHog, no acá.
 *
 * Uso:
 *   node scripts/probe-rum-vitals.mjs [url]     # default https://neto.pe/
 * Exit:
 *   0 = el cliente emitió `$web_vitals` incluyendo LCP
 *   1 = NO lo emitió, o lo emitió sin LCP: autocaptura apagada, métrica sacada de
 *       `web_vitals_allowed_metrics`, posthog no cargó, o se rompió
 *   2 = no se pudo determinar (chromium no arrancó, la red falló)
 *
 * OJO con el alcance del enmascarado: el regex de interceptación busca `posthog.com`. Si
 * algún día se sirve PostHog por un reverse proxy propio (`api_host: 'https://neto.pe/ingest'`),
 * este probe deja de ver la ingesta y acusa a la landing de no reportar.
 */

import { chromium } from 'playwright';
import { gunzipSync, inflateSync } from 'node:zlib';

const url = process.argv[2] || 'https://neto.pe/';
// Se interceptan TODOS los POST a PostHog, no una lista de rutas de ingesta. La primera
// versión enumeraba `(i/v0/e|e|batch|capture)` y dejaba escapar `https://us.i.posthog.com/s/`
// —el session recording—, así que cada corrida del probe metía a producción una grabación de
// sesión de un Chromium headless. No contaminaba las métricas, pero el docblock afirmaba que
// no llegaba NADA y eso era falso. Medido: un solo POST se escapaba, y era ese.
const POSTHOG = /posthog\.com/;

let navegador;
try {
  navegador = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled'] });
} catch (e) {
  console.error(JSON.stringify({ verdict: 'SIN_VEREDICTO', motivo: `no arrancó chromium: ${e.message}` }, null, 2));
  process.exit(2);
}

// Móvil a propósito: es la superficie que importa (la gente llega desde WhatsApp e
// Instagram, muchas veces por el navegador embebido) y es donde el LCP está fuera de
// umbral. Un probe en desktop mediría la superficie que ya pasa.
const ctx = await navegador.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
});

await ctx.addInitScript(() => {
  // Ver la trampa 1 del docblock. No es evasión de un tercero: es nuestra propiedad y
  // nuestra telemetría, y sin esto el probe mide el filtro de bots de PostHog en vez de
  // medir la landing.
  //
  // Son DOS señales, y tapar sólo la primera deja el probe igual de ciego: el detector
  // de `array.js` termina en `return !!navigator.webdriver` PERO antes recorre
  // `navigator.userAgentData.brands` contra una lista que incluye `"headlesschrome"`.
  // Chromium headless publica `brand: "HeadlessChrome"` ahí aunque se le pase un
  // userAgent de iPhone — el string de UA y `userAgentData` son cosas distintas. Con
  // sólo la bandera enmascarada este probe seguía saliendo NO_REPORTA.
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined, configurable: true });
  const uad = navigator.userAgentData;
  if (uad && Array.isArray(uad.brands)) {
    const limpias = uad.brands.filter((b) => !/headless/i.test(b.brand || ''));
    Object.defineProperty(navigator, 'userAgentData', {
      get: () => ({ ...uad, brands: limpias, mobile: uad.mobile, platform: uad.platform,
                    getHighEntropyValues: uad.getHighEntropyValues?.bind(uad),
                    toJSON: uad.toJSON?.bind(uad) }),
      configurable: true,
    });
  }
});

// Ver la trampa 4: se reintenta la visita hasta ver LCP. 3 es suficiente — con ~50% de
// éxito por visita medido en el peor caso (local), la probabilidad de tres fallos seguidos
// es ~12%, y contra producción no falló ninguna.
const INTENTOS = Number(process.env.PROBE_RUM_INTENTOS || 3);

const capturados = [];
let vistosIngesta = 0;
const eventosVistos = [];

// Ver la trampa 2 del docblock: se lee y se responde 200 FINGIDO (no `abort`). Nada llega a
// producción, y el cliente de PostHog sigue vaciando su cola — que es lo que hace falta para
// que el `$web_vitals`, que sale segundo, llegue a emitirse.
await ctx.route(POSTHOG, async (route) => {
  // Los GET son los assets (`array.js`, `web-vitals.js`, el remote config): tienen que pasar,
  // porque sin ellos no hay nada que medir.
  if (route.request().method() !== 'POST') return route.continue();
  vistosIngesta++;
  // El cuerpo llega en una de TRES formas y hay que probarlas todas. La versión previa
  // sólo entendía `data=<base64>` y por eso veía dos peticiones de ingesta con cero
  // eventos adentro: PostHog anuncia `supportedCompression: ["gzip","gzip-js"]` en su
  // remote config y manda gzip binario, que además hay que leer de `postDataBuffer()`
  // — `postData()` lo devuelve como string y destruye los bytes.
  const buf = route.request().postDataBuffer();
  let cuerpo = '';
  if (buf) {
    const intentos = [
      () => gunzipSync(buf).toString('utf8'),
      () => inflateSync(buf).toString('utf8'),
      () => {
        const crudo = buf.toString('utf8');
        return crudo.startsWith('data=')
          ? Buffer.from(decodeURIComponent(crudo.slice(5)), 'base64').toString('utf8')
          : crudo;
      },
    ];
    for (const intento of intentos) {
      try { const r = intento(); if (r && r.includes('"event"')) { cuerpo = r; break; } if (r && !cuerpo) cuerpo = r; } catch { /* siguiente forma */ }
    }
  }

  // Qué eventos SÍ viajaron. Sin esto, un `NO_REPORTA` no distingue "posthog manda
  // pero no vitals" de "posthog manda cualquier cosa menos lo que buscamos".
  for (const m of cuerpo.matchAll(/"event"\s*:\s*"([^"]+)"/g)) eventosVistos.push(m[1]);

  if (cuerpo.includes('$web_vitals')) {
    try {
      const json = JSON.parse(cuerpo);
      for (const ev of (Array.isArray(json) ? json : (json.batch || [json]))) {
        if (ev?.event !== '$web_vitals') continue;
        const p = ev.properties || {};
        capturados.push({
          LCP: p.$web_vitals_LCP_value ?? null,
          FCP: p.$web_vitals_FCP_value ?? null,
          CLS: p.$web_vitals_CLS_value ?? null,
          INP: p.$web_vitals_INP_value ?? null,
          pagina: p.$current_url ?? null,
        });
      }
    } catch (e) {
      // "vi el evento pero no pude parsearlo" es una respuesta DISTINTA de "no salió el
      // evento". Confundirlas es cómo un probe reporta verde por vacuidad.
      capturados.push({ sinParsear: true, motivo: String(e.message), muestra: cuerpo.slice(0, 200) });
    }
  }
  // 200 fingido y no `abort`: ver la trampa 2. Nada sale a producción igual.
  await route.fulfill({ status: 200, contentType: 'application/json', body: '{"status":1}' });
});

let motivoFallo = null;

const vistas = new Set();
const registrarVistas = () => {
  for (const c of capturados) {
    if (c.sinParsear) continue;
    for (const m of ['LCP', 'FCP', 'CLS', 'INP']) if (c[m] != null) vistas.add(m);
  }
};

// Se EXIGE sólo LCP, y la asimetría es deliberada. El LCP es la métrica de carga: existe en
// toda visita y si el pipeline está vivo tiene que poder llegar. El INP no existe sin
// interacción del usuario y el CLS puede ser 0 y omitirse, así que exigirlos dejaría este
// probe en rojo permanente por el comportamiento normal de una visita de 12 segundos. La
// contracara hay que decirla en vez de que el verde la insinúe: **este probe NO verifica que
// INP y CLS estén llegando.** Eso lo contesta `check-cwv-rum.mjs`, que ve 28 días de
// sesiones reales y reporta el `n` de cada métrica.
const EXIGIDAS = ['LCP'];
let intentosUsados = 0;

for (let intento = 1; intento <= INTENTOS; intento++) {
  intentosUsados = intento;
  const page = await ctx.newPage();
  try {
    await visitar(page);
  } catch (e) {
    motivoFallo = e.message;
  }
  await page.close();
  registrarVistas();
  if (EXIGIDAS.every((m) => vistas.has(m))) { motivoFallo = null; break; }
}

async function visitar(page) {
  await page.goto(url, { waitUntil: 'load', timeout: 45_000 });
  // Una interacción real: el INP no existe sin ella, y el LCP se finaliza al primer input o
  // al ocultarse la página. Se usa el TECLADO y no un click por coordenada: un
  // `mouse.click(200, 400)` es ciego, y el día que un CTA quede en ese punto el click navega
  // —matando el flush de web-vitals y dejando el probe en rojo con la landing sana— y si es
  // el CTA de WhatsApp además dispara una conversión falsa en Ads y en el píxel de Meta.
  // `Tab` cuenta como interacción para el INP y no puede activar nada (nunca se manda Enter).
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(1200);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(7000);
  // Ocultar la pestaña es lo que fuerza el flush final de web-vitals.
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(4000);
}

await ctx.close();
await navegador.close();

if (motivoFallo && !capturados.length) {
  console.error(JSON.stringify({ verdict: 'SIN_VEREDICTO', url, motivo: motivoFallo }, null, 2));
  process.exit(2);
}

const conMetrica = capturados.filter((c) => !c.sinParsear && (c.LCP != null || c.FCP != null || c.CLS != null || c.INP != null));

// `vistas` y `EXIGIDAS` se acumulan arriba, a lo largo de los reintentos: lo que se pregunta
// es si el pipeline PUEDE reportar LCP, y verlo una vez alcanza para contestar que sí.
const faltan = EXIGIDAS.filter((m) => !vistas.has(m));

if (!conMetrica.length || faltan.length) {
  console.error(JSON.stringify({
    verdict: 'NO_REPORTA',
    url,
    intentos: `${intentosUsados}/${INTENTOS}`,
    peticionesDeIngestaVistas: vistosIngesta,
    eventosQueSiViajaron: [...new Set(eventosVistos)],
    eventosConWebVitals: capturados.length,
    metricasVistas: [...vistas],
    metricasExigidasQueFaltan: faltan,
    detalle: capturados,
    queSignifica: conMetrica.length && faltan.length
      ? `Salieron eventos $web_vitals pero SIN ${faltan.join(', ')}. El pipeline está vivo, así que no es la captura: revisar que capture_performance.web_vitals_allowed_metrics en src/app/layout.tsx siga incluyendo esa métrica, y que nadie la haya sacado desde la consola de PostHog.`
      : vistosIngesta === 0
      ? 'NINGUNA petición de ingesta salió, ni siquiera un $pageview. Eso no acusa a los web vitals: o PostHog no cargó, o el enmascarado de `navigator.webdriver` dejó de funcionar y el filtro de bots está descartando todo. Comprobar lo segundo PRIMERO — es la causa que ya dio un falso negativo una vez.'
      : 'Hubo ingesta pero ningún `$web_vitals` con métricas. Revisar: (1) PostHog → proyecto neto-landing → Web vitals autocapture; (2) que `capture_performance.web_vitals` no esté en false en src/app/layout.tsx.',
  }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  verdict: 'REPORTA',
  url,
  intentos: `${intentosUsados}/${INTENTOS}`,
  peticionesDeIngestaVistas: vistosIngesta,
  eventosQueSiViajaron: [...new Set(eventosVistos)],
  metricasVistas: [...vistas],
  // Lo que este verde NO cubre, dicho en la salida y no sólo en un comentario.
  noObservadasEnEstaCorrida: ['LCP', 'FCP', 'CLS', 'INP'].filter((m) => !vistas.has(m)),
  eventos: conMetrica.length,
  metricas: conMetrica,
}, null, 2));
process.exitCode = 0;
