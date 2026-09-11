#!/usr/bin/env node
/**
 * Guard de afirmaciones de producto en la landing.
 *
 * La landing no tiene CI ni test runner: lo único que la ata a la realidad del producto
 * es `verify-hero.mjs` (las burbujas del chat) y este archivo (lo que el copy AFIRMA).
 * Las dos veces que el sitio mintió, mintió igual: una función cambió en el backend y
 * el texto se quedó describiendo el producto de hace seis meses, sin que nada avisara.
 *
 * Cinco reglas, todas sobre el árbol de fuentes (`src/`), no sobre el build. La 4ª tiene su
 * propio perímetro y por eso se explica junto a su constante, más abajo:
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
 *   3. NO SE REGISTRA SOLO. Decir "sin anotar nada" o "sin mover un dedo" es falso: solo
 *      el 9.5% de las transacciones nacen de un correo y el resto las anota la persona.
 *      Además contradice al hero de la propia landing, que vende "Anotar gastos es el piso".
 *
 *   4. GMAIL NO VA EN SUPERFICIES DE CONVERSIÓN (ver `PROMINENCIA` y `PROFUNDIZANDO`).
 *
 *   5. EL SITEMAP CUBRE LAS RUTAS. Una página nueva que no entra al sitemap es una
 *      página que Google no descubre. Se enumeran las rutas reales del App Router en
 *      vez de fijar una lista, porque una lista se desactualiza igual que el copy.
 *      Y si una página declara `const ACTUALIZADO = "YYYY-MM-DD"` (la comparativa lo hace), su
 *      <lastmod> tiene que ser esa misma fecha: el sitemap es la única copia que no la importa.
 *
 * Antivacuidad: si el escaneo no encuentra archivos, o el sitemap no parsea URLs, o los
 * patrones dejan de matchear sus propios ejemplos, el guard FALLA. Un guard que pasa
 * porque no miró nada es peor que no tener guard.
 *
 * HERMANO: `app/webapp/src/app/copy-claims.test.ts` aplica estas mismas reglas al árbol de
 * la webapp, y corre en el CI que gatea su deploy. No comparten código porque son dos
 * repositorios y el CI de cada uno solo hace checkout del suyo: las reglas están duplicadas
 * a propósito, con los `id` alineados para que el diff sea inmediato. Al agregar una regla
 * acá, agregala allá.
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
  {
    id: 'registro-sin-esfuerzo',
    patron: /(sin\s+(anotar|ingresar|escribir|hacer)\s+nada|sin\s+que\s+hagas\s+nada|se\s+registran\s+solos|sin\s+mover\s+un\s+dedo)/i,
    porque: 'Falso: solo el 9.5% de las transacciones nacen de un correo, el resto las anota la persona. Y contradice al hero, que vende justo anotar ("Anotar gastos es el piso").',
    debeMatchear: ['Ordena tu plata sin mover un dedo', 'organizados automaticamente sin anotar nada a mano', 'se registran solos'],
    noDebeMatchear: ['Sin descargar apps', 'sin contrasenas bancarias', 'los anota Neto por ti'],
  },
];

/**
 * Reglas de PROMINENCIA, y por eso tienen su propio perimetro.
 *
 * La funcion de Gmail esta VIVA: es de Pro, es opt-in y es un diferenciador real. Lo que
 * regula la regla del CLAUDE.md de Neto es DONDE aparece. Va donde alguien ya esta
 * profundizando, y no va donde todavia esta decidiendo.
 *
 * El perimetro se define por COMPLEMENTO, no enumerando las paginas de conversion: se
 * declaran las rutas donde Gmail SI puede aparecer, y todo lo demas es conversion. Asi una
 * pagina nueva entra al lado estricto por defecto, que es el que falla seguro. Enumerar la
 * conversion dejaria a cada pagina nueva sin cubrir y en silencio.
 */
const PROFUNDIZANDO = new Map([
  ['blog', 'el blog es donde alguien ya vino a leer del tema'],
  ['producto', 'la pagina de producto lista capacidades, no vende el titular'],
  ['faq', 'la FAQ responde a quien ya pregunto'],
  ['comparativas', 'comparar contra otras apps exige nombrar lo que cada una hace'],
  ['privacidad', 'divulgacion legal obligatoria de un tratamiento que si ocurre'],
  ['terminos', 'igual que privacidad: quitarlo de ahi empeora el cumplimiento'],
  ['score-financiero', 'explica la metodologia del score a quien ya entro a leerla'],
  ['como-funciona', 'explica el mecanismo completo, que es justo lo que se le pide'],
]);

const PROMINENCIA = [
  {
    id: 'gmail-de-titular',
    patron: /(lee|leer|lectura\s+de)\s+(tus\s+)?correos|correos\s+bancarios/i,
    porque: 'Gmail no va en superficies de conversion. Vive en blog, FAQ, /producto, /privacidad y /terminos.',
    debeMatchear: ['Neto lee tus correos bancarios y organiza todo', 'Lectura de tus correos bancarios'],
    noDebeMatchear: ['Neto ordena lo que anotas', 'por WhatsApp o desde la app'],
  },
  {
    id: 'bancos-prominentes',
    patron: /\b(BCP|BBVA|Interbank|Scotiabank|BanBif|Mibanco)\b/,
    porque: 'Nombrar bancos donde alguien todavia esta decidiendo insinua una integracion directa con el banco, que no existe.',
    debeMatchear: ['Yape BCP Interbank BBVA'],
    noDebeMatchear: ['foto de tu Yape o Plin', 'los correos que tu banco ya te envia'],
  },
];

/**
 * La UNICA excepcion, decidida por Favio el 2026-08-04 (auditoria M7): la tarjeta Pro del
 * Pricing puede listar la lectura de correos como UNA linea entre los beneficios, marcada
 * "beta" y con el fine print del framing obligatorio. El Pricing se renderiza en la home, o
 * sea dentro del perimetro de conversion, y por eso necesita estar declarada aca.
 *
 * **No es un pase libre: se exigen las DOS partes de la decision.** La primera version de
 * esta excepcion pedia el `badge: "beta"` en la misma linea del hallazgo, y con eso el fine
 * print —que es justamente lo que hace legitima a la excepcion— salia reportado como
 * infraccion. La condicion no es de linea, es del ARCHIVO: si desaparece el badge, o si
 * desaparece el fine print que dice que es de Pro y que es opcional, la excepcion deja de
 * aplicar y el guard vuelve a fallar. Eso es lo que la decision dijo.
 */
const EXCEPCIONES = [
  {
    archivo: 'src/components/landing/Pricing.tsx',
    regla: 'gmail-de-titular',
    porque: 'Favio, 2026-08-04 (M7): una linea entre los beneficios de la tarjeta Pro, marcada beta y con fine print.',
    exigeEnElArchivo: [
      { que: 'el beneficio marcado beta', patron: /Lectura de tus correos bancarios["'\s,]*badge:\s*['"]beta['"]/ },
      { que: 'el fine print: que es de Pro', patron: /se habilita al activar Pro/i },
      { que: 'el fine print: que es opt-in', patron: /Es opcional y la conectas t/i },
    ],
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
for (const regla of [...PROHIBIDO, ...PROMINENCIA]) {
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
    // Un comentario no es copy, y el que explica este bug nombra la frase mala.
    if (/^\s*(\/\/|\*|\/\*)/.test(linea)) return;
    for (const regla of PROHIBIDO) {
      const m = linea.match(regla.patron);
      if (m) fallos.push(`[${regla.id}] ${rel}:${i + 1} → ${JSON.stringify(m[0])}\n           ${regla.porque}`);
    }
  });
}
notas.push(`${archivos.length} archivos de src/ escaneados contra ${PROHIBIDO.length} reglas de copy`);

// ── 2b: prominencia de Gmail, solo en las superficies de conversion ────────────────
/** Una ruta es de conversion salvo que este declarada como pagina de profundizacion. */
function esDeConversion(rel) {
  const m = rel.match(/^src\/app\/([^/]+)\//);
  if (m && PROFUNDIZANDO.has(m[1])) return false;
  // `src/lib/blog*.ts` es el CUERPO del blog: mismo motivo que la ruta /blog.
  if (/^src\/lib\/blog/.test(rel)) return false;
  if (DATOS_DE_PROFUNDIZACION.has(rel)) return false;
  return true;
}

/**
 * Módulos de DATOS que viven en src/lib pero cuyo contenido es de una página de profundización.
 * Un módulo no es una superficie: lo es quien lo importa. Por eso la exención es condicional —
 * si un archivo de conversión lo importa, sus bancos llegan a la conversión y el guard falla.
 */
const DATOS_DE_PROFUNDIZACION = new Map([
  ['src/lib/apps-comparativa.ts', 'los datos de las siete apps: los leen la comparativa y el post de precios del blog'],
]);

const deConversion = archivos.filter((abs) =>
  esDeConversion(path.relative(RAIZ, abs).split(path.sep).join('/'))
);
for (const [modulo, porque] of DATOS_DE_PROFUNDIZACION) {
  if (!archivos.some((abs) => path.relative(RAIZ, abs).split(path.sep).join('/') === modulo)) {
    fallos.push(`[excepcion] ${modulo} está declarado como dato de profundización pero ya no existe`);
    continue;
  }
  const nombre = path.basename(modulo).replace(/\.tsx?$/, '');
  const importa = new RegExp(`from\\s+["'][^"']*\\/${nombre}["']`);
  for (const abs of deConversion) {
    const rel = path.relative(RAIZ, abs).split(path.sep).join('/');
    if (importa.test(readFileSync(abs, 'utf-8'))) {
      fallos.push(`[prominencia-por-import] ${rel} importa ${modulo}, que está fuera del perímetro de conversión (${porque}).\n           Lo que ese módulo dice (bancos, Gmail) llega a una superficie de conversión sin que nadie lo revise.`);
    }
  }
}
if (deConversion.length < 5 || deConversion.length === archivos.length) {
  fallos.push(`[antivacuidad] el perimetro de conversion son ${deConversion.length} de ${archivos.length} archivos: el filtro esta roto`);
}
for (const abs of deConversion) {
  const rel = path.relative(RAIZ, abs).split(path.sep).join('/');
  readFileSync(abs, 'utf-8').split('\n').forEach((linea, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(linea)) return; // el comentario que explica el bug no es el bug
    for (const regla of PROMINENCIA) {
      const m = linea.match(regla.patron);
      if (!m) continue;
      const amparo = EXCEPCIONES.find((e) => e.archivo === rel && e.regla === regla.id);
      if (amparo) { amparo.usada = true; continue; }
      fallos.push(`[${regla.id}] ${rel}:${i + 1} → ${JSON.stringify(m[0])}\n           ${regla.porque}`);
    }
  });
}
// Una excepcion vale mientras se cumplan los terminos con los que se concedio.
for (const e of EXCEPCIONES) {
  const abs = path.join(RAIZ, e.archivo);
  let texto;
  try {
    texto = readFileSync(abs, 'utf-8');
  } catch {
    fallos.push(`[excepcion] ${e.archivo} ya no existe, pero sigue declarada como excepcion de "${e.regla}"`);
    continue;
  }
  for (const cond of e.exigeEnElArchivo) {
    if (!cond.patron.test(texto)) {
      fallos.push(`[excepcion] ${e.archivo} está amparado para "${e.regla}", pero falta ${cond.que}\n           ${e.porque}`);
    }
  }
  if (!e.usada) {
    notas.push(`la excepcion de ${e.archivo} ya no se usa: si el copy dejo de mencionarlo, borrala`);
  }
}

notas.push(`${deConversion.length} de ${archivos.length} archivos son superficie de conversion, contra ${PROMINENCIA.length} reglas de prominencia (${EXCEPCIONES.length} excepcion declarada)`);

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

// ── 3b: la fecha visible de una página y su <lastmod> son UNA fecha ─────────────────────
// Una página que declara `const ACTUALIZADO = "YYYY-MM-DD"` saca de ahí el texto visible y el
// JSON-LD. El sitemap es estático y no puede importarla, así que es la única copia que queda;
// este chequeo es lo que impide que se quede atrás (la comparativa estuvo cuatro meses con
// "2 de mayo" escrito a mano, y ChatGPT la mostraba así en su tarjeta de citación).
const lastmodDe = new Map(
  [...sitemap.matchAll(/<loc>https:\/\/neto\.pe([^<]*)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
    .map((m) => [m[1] || '/', m[2].trim()])
);
let fechadas = 0;
for (const abs of archivos.filter((f) => path.basename(f) === 'page.tsx')) {
  const m = readFileSync(abs, 'utf-8').match(/const ACTUALIZADO = "(\d{4}-\d{2}-\d{2})"/);
  if (!m) continue;
  fechadas++;
  const ruta = '/' + path.relative(path.join(SRC, 'app'), path.dirname(abs)).split(path.sep).join('/');
  if (lastmodDe.get(ruta) !== m[1]) {
    fallos.push(`[fecha] ${ruta} declara ACTUALIZADO = ${m[1]} pero public/sitemap.xml tiene <lastmod>${lastmodDe.get(ruta) ?? '(ninguno)'}</lastmod>\n           La fecha visible, el JSON-LD y el sitemap tienen que decir lo mismo.`);
  }
}
if (fechadas === 0) {
  fallos.push('[antivacuidad] ninguna página declara `const ACTUALIZADO = "YYYY-MM-DD"`: la comparativa lo declaraba, o cambió la forma o el chequeo de fecha quedó ciego');
}
notas.push(`${fechadas} página(s) con ACTUALIZADO, cotejadas contra su <lastmod>`);

// ── Reporte ────────────────────────────────────────────────────────────────────────
for (const nota of notas) console.log('  · ' + nota);
if (fallos.length) {
  console.error('\n✗ verify-claims: ' + fallos.length + ' problema(s)\n');
  for (const f of fallos) console.error('  ' + f);
  console.error('');
  process.exit(1);
}
console.log('\n✓ verify-claims: el copy no promete lo que el producto no hace, y el sitemap está completo\n');
