#!/usr/bin/env node
/**
 * Medición de laboratorio de la landing, con MEDIANAS. Informativo: nunca alarma.
 *
 * Por qué existe, y por qué NO es el canary
 * ------------------------------------------
 * `tools/canary-cwv/check-cwv.mjs` produce veredicto SOLO con datos de campo
 * (CrUX) y sale exit 2 cuando no los hay, que es hoy el caso de neto.pe. Esa
 * decisión es correcta y no se toca: un canary diario que alarme con laboratorio
 * grita por ruido. Este script es lo otro — el instrumento para MEDIR cuando uno
 * cambia algo a propósito, y comparar contra la corrida anterior.
 *
 * No va al canary diario: lo que mide se rompe CON commit, no sin él.
 *
 * Dos cosas que se aprendieron midiendo el instrumento (2026-08-22) y que hay que
 * no re-descubrir:
 *
 * 1. **PSI CACHEA.** Cinco llamadas seguidas a la misma URL devolvieron el mismo
 *    resultado byte por byte, tres de ellas en 2 segundos. Una "mediana de 5
 *    corridas" sobre la URL desnuda puede ser UNA medición repetida cinco veces,
 *    y sale verde y convincente. Por eso cada corrida lleva `?cwv=<n>` distinto.
 *    Verificado que el cache-buster no distorsiona: Cloudflare Pages sirve el HTML
 *    como `cf-cache-status: DYNAMIC` (`max-age=0, must-revalidate`) con o sin query
 *    string, y el TTFB medido es el mismo (0.211s vs 0.218s).
 *
 * 2. **Las dos métricas son ruidosas, y CUÁL es la más ruidosa cambia entre tandas.**
 *    Cuatro tandas del 22-ago-2026 contra la misma build:
 *
 *      | tanda   | dispersión del score | dispersión del LCP |
 *      |---------|----------------------|--------------------|
 *      | n=6     | 16 pts (~20%)        | 150ms (~4.6%)      |
 *      | n=5     | 14 pts (~16%)        | 151ms (~4.7%)      |
 *      | n=3     | 5 pts (~5.5%)        | 300ms (~10%)       |
 *      | n=3     | 5 pts (~5.8%)        | 675ms (~23%)       |
 *
 *    Las dos primeras invitaban a la regla "el score es ruido y el LCP no", y este
 *    docblock la afirmó. Las dos siguientes la dan vuelta. **Con una tanda no se puede
 *    concluir cuál métrica es más estable**, y encima los valores absolutos se corren
 *    entre tandas (el LCP de una sola corrida fue de 2551 a 3302 en el mismo día), así que
 *    la infra de PSI se mueve según la hora.
 *
 *    Lo que sí se sostiene, y es la regla útil:
 *    - **Comparar sólo dentro de la misma tanda**: antes y después, mismo instrumento,
 *      mismo rato. Un número de hoy contra uno de la semana pasada no dice nada.
 *    - **Reportar SIEMPRE la dispersión al lado de la mediana.** Una mediana sola esconde
 *      si el rango era de 150ms o de 675ms, y con 675ms una "mejora" de 300ms es ruido.
 *    - Una diferencia que no supera la dispersión de su propia tanda **no es una
 *      diferencia**, sin importar qué métrica sea.
 *
 * Uso:
 *   PAGESPEED_API_KEY=... node scripts/measure-cwv-lab.mjs [--url=https://neto.pe/]
 *                                                          [--n=5] [--strategy=mobile|desktop|both]
 *                                                          [--out=ruta.json]
 * Exit: 0 si midió, 2 si no pudo (sin key, PSI caído). NUNCA 1 — no emite veredicto.
 */

const arg = (nombre, def) => {
  const hit = process.argv.find((a) => a.startsWith(`--${nombre}=`));
  return hit ? hit.slice(nombre.length + 3) : def;
};

const KEY = process.env.PAGESPEED_API_KEY;
if (!KEY) {
  // Mismo criterio que el canary: sin credencial NO se devuelve un resultado.
  // Ojo con el falso negativo conocido: un shell abierto ANTES de que la variable
  // se cargara no la ve, y eso es un shell viejo, no una key ausente. Comprobar con
  //   [Environment]::GetEnvironmentVariable('PAGESPEED_API_KEY','User')
  console.error(JSON.stringify({ error: 'falta PAGESPEED_API_KEY en el entorno' }, null, 2));
  process.exit(2);
}

const URL_BASE = arg('url', 'https://neto.pe/');
const N = Number(arg('n', 5));
const ESTRATEGIAS = arg('strategy', 'both') === 'both' ? ['mobile', 'desktop'] : [arg('strategy', 'mobile')];
const OUT = arg('out', null);

const mediana = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  if (!s.length) return null;
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : Number(((s[m - 1] + s[m]) / 2).toFixed(3));
};

async function corrida(estrategia, i) {
  // El cache-buster va en la URL medida, no en la de la API: es PSI el que cachea
  // por (url, strategy), y el static export ignora la query string.
  const objetivo = new URL(URL_BASE);
  objetivo.searchParams.set('cwv', String(i));

  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  api.searchParams.set('url', objetivo.toString());
  api.searchParams.set('strategy', estrategia);
  api.searchParams.set('category', 'performance');
  api.searchParams.set('key', KEY);

  const t0 = Date.now();
  const res = await fetch(api, { signal: AbortSignal.timeout(120_000) });
  const secs = Math.round((Date.now() - t0) / 1000);
  if (!res.ok) {
    const detalle = await res.text().catch(() => '');
    return { corrida: i, error: `PSI ${res.status}`, detalle: detalle.slice(0, 300), secs };
  }
  const d = await res.json();
  const a = d.lighthouseResult?.audits || {};
  const num = (k) => Math.round(a[k]?.numericValue ?? 0);

  return {
    corrida: i,
    score: Math.round((d.lighthouseResult?.categories?.performance?.score ?? 0) * 100),
    lcp_ms: num('largest-contentful-paint'),
    fcp_ms: num('first-contentful-paint'),
    tbt_ms: num('total-blocking-time'),
    si_ms: num('speed-index'),
    cls: Number((a['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3)),
    // `analysisUTCTimestamp` es el sello del análisis que hizo PSI. Dos corridas con el
    // MISMO sello son literalmente el mismo análisis devuelto dos veces — evidencia directa
    // de cache, en vez de inferirla de que la respuesta volvió rápido. La versión anterior
    // usaba `secs <= 4`, que mide latencia para contestar una pregunta de identidad: no
    // detecta un cache servido por una red lenta, y se dispararía con una respuesta fresca
    // y veloz. Lo señaló la revisión adversarial.
    sello: d.analysisUTCTimestamp ?? null,
    js_sin_usar_kib: Math.round((a['unused-javascript']?.details?.overallSavingsBytes ?? 0) / 1024),
    js_legacy_kib: Math.round((a['legacy-javascript']?.details?.overallSavingsBytes ?? 0) / 1024),
    peso_total_kib: Math.round((a['total-byte-weight']?.numericValue ?? 0) / 1024),
    secs,
  };
}

const salida = { medido_en: new Date().toISOString(), url: URL_BASE, n: N, instrumento: null, resultados: {} };
let fallo = false;

for (const estrategia of ESTRATEGIAS) {
  const corridas = [];
  for (let i = 1; i <= N; i++) {
    // Secuencial a propósito: en paralelo compiten por la misma infra de PSI y la
    // varianza que se mide deja de ser la de la página.
    const r = await corrida(estrategia, `${estrategia}-${i}`);
    corridas.push(r);
    console.error(`[${estrategia} ${i}/${N}] ${r.error ? r.error : `score=${r.score} lcp=${r.lcp_ms} tbt=${r.tbt_ms}`} (${r.secs}s)`);
  }
  const ok = corridas.filter((r) => !r.error);
  // Con el `?cwv=<n>` de arriba esto debería ser SIEMPRE 0. Si aparece, no es una curiosidad:
  // es que el cache-buster dejó de funcionar y las medianas de esta corrida no valen. Se
  // marca y se avisa fuerte, en vez de descartar las repetidas en silencio — descartarlas
  // escondería justo la señal de que el instrumento se rompió.
  const sellos = ok.map((r) => r.sello).filter(Boolean);
  const repetidos = sellos.length - new Set(sellos).size;
  if (!ok.length) { fallo = true; salida.resultados[estrategia] = { error: 'ninguna corrida completó', corridas }; continue; }

  const resumen = {};
  for (const k of ['score', 'lcp_ms', 'fcp_ms', 'tbt_ms', 'si_ms', 'cls', 'js_sin_usar_kib', 'js_legacy_kib', 'peso_total_kib']) {
    const v = ok.map((r) => r[k]);
    resumen[k] = { mediana: mediana(v), min: Math.min(...v), max: Math.max(...v) };
  }
  salida.resultados[estrategia] = {
    n_ok: ok.length,
    corridas_con_sello_repetido: repetidos,
    resumen,
    corridas,
  };
}

const sospechosas = Object.values(salida.resultados).reduce((a, r) => a + (r.corridas_con_sello_repetido || 0), 0);
if (sospechosas > 0) {
  salida.ADVERTENCIA = `${sospechosas} corrida(s) devolvieron el MISMO analysisUTCTimestamp que otra, o sea que PSI sirvió el mismo análisis y NO son observaciones independientes. Las medianas de abajo no valen: revisar que el cache-buster ?cwv= siga llegando a la URL medida.`;
  console.error(`
!! ${salida.ADVERTENCIA}
`);
}

console.log(JSON.stringify(salida, null, 2));
if (OUT) {
  const { writeFileSync } = await import('node:fs');
  writeFileSync(OUT, JSON.stringify(salida, null, 2));
  console.error(`\nEscrito: ${OUT}`);
}
process.exitCode = fallo ? 2 : 0;
