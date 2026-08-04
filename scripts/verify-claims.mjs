#!/usr/bin/env node
/**
 * Guard de afirmaciones de producto en la landing.
 *
 * La landing no tiene CI ni test runner: lo único que la ata a la realidad del producto
 * es `verify-hero.mjs` (las burbujas del chat) y este archivo (lo que el copy AFIRMA).
 * Las dos veces que el sitio mintió, mintió igual: una función cambió en el backend y
 * el texto se quedó describiendo el producto de hace seis meses, sin que nada avisara.
 *
 * Tres reglas, todas sobre el árbol de fuentes (`src/`), no sobre el build:
 *
 *   1. NO HAY INTEGRACIÓN BANCARIA. Neto nunca se conecta a un banco. El dato entra
 *      porque la persona lo escribe, manda la foto del voucher, o —solo en Pro y solo
 *      si la conecta ella— porque Gmail reenvía la notificación que el banco YA le
 *      mandó. Decir "conecta tu banco" promete open banking y encima insinúa que
 *      pedimos credenciales bancarias, que es justo lo que la FAQ jura que no hacemos.
 *
 *   2. LEER CORREOS ES OPT-IN, NO INEXISTENTE. Negar en absoluto que accedemos a los
 *      correos del usuario es falso (Gmail de Pro sí los lee) y contradice al resto del
 *      sitio. La forma honesta siempre lleva calificador: "no leemos correos
 *      PERSONALES", "solo los de notificación bancaria". Esta regla protege el
 *      cumplimiento tanto como el marketing: /privacidad y /terminos son divulgación
 *      obligatoria de un tratamiento que sí ocurre, y una negación absoluta ahí es peor
 *      que un titular exagerado en el hero.
 *
 *   3. EL SITEMAP CUBRE LAS RUTAS. Una página nueva que no entra al sitemap es una
 *      página que Google no descubre. Se enumeran las rutas reales del App Router en
 *      vez de fijar una lista, porque una lista se desactualiza igual que el copy.
 *
 * Antivacuidad: si el escaneo no encuentra archivos, o el sitemap no parsea URLs, o los
 * patrones dejan de matchear sus propios ejemplos, el guard FALLA. Un guard que pasa
 * porque no miró nada es peor que no tener guard.
 *
 *   node scripts/verify-claims.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(RAIZ, 'src');
const SITEMAP = path.join(RAIZ, 'public', 'sitemap.xml');

/** Rutas deliberadamente FUERA del sitemap, con el motivo. */
const FUERA_DEL_SITEMAP = new Map([
  ['/r', 'mini-landing de referidos: sin código en la URL no tiene contenido propio, y cada código es una variante de la misma página'],
]);

const PROHIBIDO = [
  {
    id: 'integracion-bancaria',
    patron: /(conect|vincul|sincroniz|enlaz)\w*\s+(tu|su)\s+(banco|cuenta\s+bancaria)/i,
    porque: 'Neto no se conecta a ningún banco. El dato lo escribe la persona, llega por foto del voucher, o —Pro y opt-in— por el correo de notificación que el banco ya envía.',
    debeMatchear: ['Conecta tu banco en 2 minutos', 'si conectaste tu banco a Neto', 'vincula tu cuenta bancaria'],
    noDebeMatchear: ['conecta tu Gmail', 'conecta tu WhatsApp', 'los correos que tu banco ya te envía'],
  },
  {
    id: 'negacion-absoluta-correos',
    patron: /(no|nunca)\s+(accedemos|leemos|revisamos|entramos)\s+(a\s+)?(tus|sus)\s+correos(?!\s+personales)/i,
    porque: 'Con Gmail conectado (Pro, opt-in) Neto SÍ lee correos del usuario: los de notificación bancaria. La negación tiene que ir calificada.',
    debeMatchear: ['No accedemos a tus correos, mensajes ni a otra información personal', 'nunca leemos tus correos'],
    noDebeMatchear: ['No leemos tus correos personales', 'No accedemos a correos personales, laborales ni de ningún otro tipo', 'Nunca leemos correos personales'],
  },
];

function fuentes(dir) {
  const out = [];
  for (const entrada of readdirSync(dir)) {
    const abs = path.join(dir, entrada);
    if (statSync(abs).isDirectory()) { out.push(...fuentes(abs)); continue; }
    if (/\.(tsx?|mdx?)$/.test(entrada)) out.push(abs);
  }
  return out;
}

/** Rutas estáticas del App Router: cada page.tsx es una ruta, salvo los segmentos dinámicos. */
function rutasEstaticas() {
  const appDir = path.join(SRC, 'app');
  return fuentes(appDir)
    .filter((f) => path.basename(f) === 'page.tsx')
    .map((f) => '/' + path.relative(appDir, path.dirname(f)).split(path.sep).join('/'))
    .map((r) => (r === '/.' ? '/' : r))
    .filter((r) => !r.includes('['));
}

/** Slugs del blog, leídos de la misma fuente que usa generateStaticParams. */
function slugsBlog() {
  const src = readFileSync(path.join(SRC, 'lib', 'blog.ts'), 'utf-8');
  return [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => '/blog/' + m[1]);
}

const fallos = [];
const notas = [];

// ── Antivacuidad: los patrones tienen que reconocer sus propios ejemplos ────────────
for (const regla of PROHIBIDO) {
  for (const ejemplo of regla.debeMatchear) {
    if (!regla.patron.test(ejemplo)) {
      fallos.push(`[contraprueba] el patrón "${regla.id}" NO matchea su propio ejemplo malo: ${JSON.stringify(ejemplo)}`);
    }
  }
  for (const ejemplo of regla.noDebeMatchear) {
    if (regla.patron.test(ejemplo)) {
      fallos.push(`[contraprueba] el patrón "${regla.id}" matchea una frase LEGÍTIMA: ${JSON.stringify(ejemplo)}`);
    }
  }
}

// ── 1 y 2: afirmaciones prohibidas en el copy ──────────────────────────────────────
const archivos = fuentes(SRC);
if (archivos.length < 20) {
  fallos.push(`[antivacuidad] solo ${archivos.length} archivos escaneados bajo src/ — el barrido está roto`);
}
for (const abs of archivos) {
  const rel = path.relative(RAIZ, abs).split(path.sep).join('/');
  const lineas = readFileSync(abs, 'utf-8').split('\n');
  lineas.forEach((linea, i) => {
    for (const regla of PROHIBIDO) {
      const m = linea.match(regla.patron);
      if (m) fallos.push(`[${regla.id}] ${rel}:${i + 1} → ${JSON.stringify(m[0])}\n           ${regla.porque}`);
    }
  });
}
notas.push(`${archivos.length} archivos de src/ escaneados contra ${PROHIBIDO.length} reglas de copy`);

// ── 3: el sitemap cubre las rutas reales ───────────────────────────────────────────
const sitemap = readFileSync(SITEMAP, 'utf-8');
const enSitemap = new Set(
  [...sitemap.matchAll(/<loc>https:\/\/neto\.pe([^<]*)<\/loc>/g)].map((m) => m[1] || '/')
);
if (enSitemap.size < 5) {
  fallos.push(`[antivacuidad] el sitemap parseó ${enSitemap.size} URLs — el parser o el archivo están rotos`);
}
const esperadas = [...rutasEstaticas(), ...slugsBlog()];
for (const ruta of esperadas) {
  if (FUERA_DEL_SITEMAP.has(ruta)) continue;
  if (!enSitemap.has(ruta)) {
    fallos.push(`[sitemap] la ruta ${ruta} existe en src/app pero no está en public/sitemap.xml`);
  }
}
for (const ruta of enSitemap) {
  if (!esperadas.includes(ruta)) {
    fallos.push(`[sitemap] public/sitemap.xml lista ${ruta}, que ya no existe en src/app (404 anunciado a Google)`);
  }
}
notas.push(`${esperadas.length} rutas reales contra ${enSitemap.size} URLs del sitemap (${FUERA_DEL_SITEMAP.size} excluida a propósito)`);

// ── Reporte ────────────────────────────────────────────────────────────────────────
for (const nota of notas) console.log('  · ' + nota);
if (fallos.length) {
  console.error('\n✗ verify-claims: ' + fallos.length + ' problema(s)\n');
  for (const f of fallos) console.error('  ' + f);
  console.error('');
  process.exit(1);
}
console.log('\n✓ verify-claims: el copy no promete lo que el producto no hace, y el sitemap está completo\n');
