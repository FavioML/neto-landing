#!/usr/bin/env node
/**
 * MEDIDOR DE LA CADENA DE ATRIBUCIÓN (Acción 1 del audit SEO del 2026-09-09).
 *
 * Mide los dos números que la Acción 1 tiene que mover, y existe separado del arreglo por un
 * motivo: ninguno de los dos se mueve el día del deploy. Dependen de tráfico real y de altas
 * reales, así que la verificación del día 0 es el MECANISMO (el salto conserva el UTM, una alta
 * de prueba queda con origen) y ésta es la verificación a 30 días. Sin un medidor guardado, a
 * los 30 días nadie reconstruye la query y el número queda sin comprobar.
 *
 *   A. pageviews de app.neto.pe con `utm_` en la URL    baseline 10 / 2898 (0,3%)  →  meta >100
 *   B. reparto de canales de las sesiones de neto.pe     baseline $direct 51%       →  meta <40%
 *
 * TRES TRAMPAS DE MEDICIÓN QUE ESTE SCRIPT EVITA A PROPÓSITO, las tres ya mordieron una vez y
 * están documentadas en la memory `project_atribucion_rota_landing`:
 *
 *   1. **El denominador va filtrado por `$host`.** El proyecto de PostHog es COMPARTIDO
 *      (neto.pe, app.neto.pe, vortik.dev, danzio.app). Sin el filtro, "44% directo" salió de
 *      mezclar los 693 de neto.pe con los 697 de app.neto.pe, cuando el número real de la
 *      landing era 61%. Un porcentaje sin su `$host` en el WHERE no significa nada acá.
 *
 *   2. **ChatGPT se cuenta por las DOS vías, referrer Y utm.** Manda 64 sesiones en 90 días, no
 *      23: 23 llegan con `$referring_domain = chatgpt.com` y 41 llegan con
 *      `utm_source=chatgpt.com` y referrer vacío. Contar sólo el referrer subestima 3x el canal
 *      que más crece y mejor convierte.
 *
 *   3. **Las sondas propias no son tráfico.** `?cwv=` y `?det=` son mis propias mediciones de
 *      Core Web Vitals (25 sesiones, 3,6%) y caían dentro de `$direct`, inflando justo el
 *      bloque que la Acción 1 quiere reducir. Salen a una categoría propia, no al agregado.
 *      Y hay una segunda forma que el audit no vio: el canary diario de CWV corre PageSpeed
 *      SIN query, con el UA fijo de emulación de Lighthouse (`Android 11; moto g power
 *      (2022)`), 1-2 sesiones cada pocos días a las 10am Lima. También cuenta como sonda.
 *      Desde el 11-sep-2026 las dos formas se descartan en el cliente (`before_send` en
 *      `src/app/layout.tsx`), así que la categoría E sólo puede traer historia anterior:
 *      una sesión E posterior a esa fecha significa que la regla del cliente se rompió.
 *
 * Requiere `POSTHOG_PERSONAL_API_KEY` (scopes de lectura `query:read` y `project:read`). Ya está
 * cargada como variable de USUARIO de Windows. OJO: un shell abierto ANTES de que se cargara no
 * la ve y este script sale exit 2 diciendo que falta — eso es un shell viejo, no una key
 * ausente. Comprobarlo con [Environment]::GetEnvironmentVariable('POSTHOG_PERSONAL_API_KEY','User').
 *
 *      **Y las sondas tampoco van en el DENOMINADOR.** Hasta el 11-sep la categoría E salía
 *      aparte pero seguía sumando al total, así que el porcentaje de `$direct` quedaba medido
 *      contra tráfico que no existe (sobre 30 días al 11-sep: 132 de 349 = 37,7% con sondas,
 *      132 de 298 = 44,3% sin ellas). Hoy E se lista con su conteo y fuera del 100%.
 *
 *   node scripts/probe-atribucion.mjs [--dias=90] [--desde=2026-09-11T16:21:00]
 *
 * `--desde` reemplaza el piso de la ventana por un instante UTC. Sirve para leer sólo lo que
 * pasó después de un deploy (p.ej. que E quede en cero después de la regla del cliente).
 *
 * exit 0 = midió. exit 2 = no pudo medir (falta credencial, API caída). NUNCA da un veredicto
 * de PASS/FAIL: esto es un instrumento de medición, no un guard. El veredicto lo pone quien lee
 * los dos números contra el baseline escrito arriba.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONFIG = path.join(RAIZ, '.claude', 'deploy-config.json');

const dias = Number((process.argv.find((a) => a.startsWith('--dias=')) || '--dias=90').split('=')[1]);
if (!Number.isFinite(dias) || dias < 1) {
  console.error('--dias tiene que ser un entero positivo');
  process.exit(2);
}
const desdeArg = (process.argv.find((a) => a.startsWith('--desde=')) || '').slice('--desde='.length);
if (desdeArg && !/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/.test(desdeArg)) {
  console.error('--desde tiene que ser YYYY-MM-DD o YYYY-MM-DDTHH:MM[:SS] (UTC)');
  process.exit(2);
}
// Validado arriba contra un patrón fijo, así que interpolarlo en la HogQL no abre nada.
const PISO = desdeArg
  ? `toDateTime('${desdeArg.replace('T', ' ')}${desdeArg.length === 10 ? ' 00:00:00' : desdeArg.length === 16 ? ':00' : ''}')`
  : `now() - INTERVAL ${dias} DAY`;
const VENTANA = desdeArg ? `desde ${desdeArg} UTC` : `últimos ${dias} días`;

const KEY = process.env.POSTHOG_PERSONAL_API_KEY;
if (!KEY) {
  console.error(JSON.stringify({
    verdict: 'SIN_MEDICION',
    motivo: 'falta POSTHOG_PERSONAL_API_KEY en el entorno',
    ojo: 'Un shell abierto antes de cargar la variable no la ve y sale por acá igual. Comprobar con [Environment]::GetEnvironmentVariable("POSTHOG_PERSONAL_API_KEY","User").',
  }, null, 2));
  process.exit(2);
}

const config = JSON.parse(readFileSync(CONFIG, 'utf8'));
const token = config.integrations?.posthog?.public_token;
const host = config.integrations?.posthog?.api_host || 'https://us.posthog.com';
if (!token) {
  console.error('el deploy-config no declara integrations.posthog.public_token');
  process.exit(2);
}

const api = async (ruta, init) => {
  const res = await fetch(`${host}${ruta}`, {
    ...init,
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', ...(init?.headers || {}) },
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`${ruta} -> HTTP ${res.status}: ${(await res.text().catch(() => '')).slice(0, 300)}`);
  return res.json();
};

let proyecto;
try {
  const lista = await api('/api/projects/');
  proyecto = (lista.results || []).find((p) => p.api_token === token);
  if (!proyecto) throw new Error('ningún proyecto visible para esta key tiene el token del deploy-config');
} catch (e) {
  console.error(JSON.stringify({ verdict: 'SIN_MEDICION', motivo: `no se pudo resolver el proyecto: ${e.message}` }, null, 2));
  process.exit(2);
}

const hogql = async (query) => {
  const r = await api(`/api/projects/${proyecto.id}/query/`, {
    method: 'POST',
    body: JSON.stringify({ query: { kind: 'HogQLQuery', query } }),
  });
  return r.results || [];
};

// ── A. El salto neto.pe → app.neto.pe ──────────────────────────────────────────────────────
// Cuenta pageviews de app.neto.pe por si traen `utm_` en la URL. El baseline del audit es
// 10 / 2898. Se separa "otro querystring" porque ahí viven los links con `?ref=` y las propias
// sondas: meterlos con los utm_ haría creer que la propagación funciona cuando no.
const A = await hogql(`
  SELECT etiqueta, count() AS pv FROM (
    SELECT multiIf(
      position(properties.$current_url, 'utm_') > 0, 'A. CON utm',
      position(properties.$current_url, '?') > 0,     'B. otro querystring',
                                                      'C. sin querystring'
    ) AS etiqueta
    FROM events
    WHERE event = '$pageview'
      AND properties.$host = 'app.neto.pe'
      AND timestamp >= ${PISO}
  ) GROUP BY etiqueta ORDER BY etiqueta
`);

// ── B. Reparto de canales de la landing ────────────────────────────────────────────────────
// El orden de las ramas ES la definición de cada categoría, y dos de ellas existen por las
// trampas de arriba: las sondas salen antes que `$direct` (si no, lo inflan) y los motores de
// IA se reconocen por utm_source ADEMÁS de por referrer (si no, ChatGPT sale en un tercio).
const B = await hogql(`
  SELECT canal, count() AS sesiones FROM (
    SELECT
      any(properties.$referring_domain) AS ref,
      any(properties.$current_url)      AS url,
      any(properties.$raw_user_agent)   AS ua,
      multiIf(
        match(url, '[?&](cwv|det)=')
          OR position(ua, 'Android 11; moto g power (2022)') > 0,                'E. sonda propia de CWV',
        match(ref, 'chatgpt|openai|perplexity|gemini|copilot')
          OR match(url, 'utm_source=(chatgpt|openai|perplexity|gemini|copilot)'), 'B. motores de IA',
        match(ref, 'google|bing|duckduckgo|yahoo|ecosia|brave'),                  'A. buscadores',
        match(ref, 'instagram|facebook|tiktok|t\\\\.co|x\\\\.com|linkedin')
          OR match(url, 'utm_source=(ig|instagram|fb|facebook|tiktok)'),          'C. social',
        match(ref, 'whatsapp|wl\\\\.co'),                                          'D. whatsapp',
        position(url, 'utm_') > 0,                                               'F. otro utm',
        ref = '' OR ref = '$direct' OR ref IS NULL,                              'G. direct limpio',
                                                                                 'H. otros referrers'
      ) AS canal
    FROM events
    WHERE event = '$pageview'
      AND properties.$host = 'neto.pe'
      AND timestamp >= ${PISO}
    GROUP BY properties.$session_id
  ) GROUP BY canal ORDER BY canal
`);

// `fuera` son las categorías que se listan pero NO entran al 100%: las sondas no son tráfico,
// así que tampoco pueden ser parte del total contra el que se mide `$direct`.
const fmt = (filas, fuera = () => false) => {
  const total = filas.filter(([k]) => !fuera(k)).reduce((s, f) => s + Number(f[1]), 0) || 1;
  return filas.map(([k, v]) => `  ${String(k).padEnd(26)} ${String(v).padStart(6)}  ${
    fuera(k) ? 'fuera del total' : `${((Number(v) / total) * 100).toFixed(1)}%`
  }`).join('\n');
};

console.log(`\nATRIBUCIÓN — ${VENTANA} · proyecto ${proyecto.id} · ${new Date().toISOString().slice(0, 10)}\n`);
console.log(`A. Pageviews de app.neto.pe por querystring  (baseline audit: 10 CON utm de 2898 = 0,3% · meta >100)`);
console.log(fmt(A));
console.log(`\nB. Sesiones de neto.pe por canal  (baseline audit: direct limpio 355 de 693 = 51% · meta <40%)`);
console.log(fmt(B, (k) => String(k).startsWith('E.')));
console.log('');
