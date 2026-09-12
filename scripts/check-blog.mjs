#!/usr/bin/env node
/**
 * Chequeo bloqueante del molde del blog (`docs/molde-blog.md`).
 *
 * Mide cada post sobre la página RENDERIZADA, en un Chromium de 375 px, porque la mitad de lo que
 * importa no se ve en el fuente: cuántas palabras hay antes del primer elemento visual, si una
 * tabla desborda la pantalla, si algo nace transparente. Y coteja cada chat del blog contra el
 * backend de `../app`, porque un chat de Neto es una afirmación sobre el producto.
 *
 *   npm run build && node scripts/check-blog.mjs            # sobre out/, con servidor propio
 *   node scripts/check-blog.mjs --base=https://neto.pe      # contra producción, después del deploy
 *   node scripts/check-blog.mjs --post=<slug>               # un solo post
 *
 * Exit 0 pasa · 1 incumple y NO se publica · 2 no se pudo medir (sin out/, sin ../app, sin
 * Chromium), que se trata igual que 1: no medir no es lo mismo que estar bien.
 *
 * QUÉ MIDE, en cuatro grupos (los números están en `U`, abajo, con su origen):
 *   PROSA       largo de oraciones, de bloques y de subtítulos; em dash y voseo.
 *   ESTRUCTURA  "En corto" primero, palabras antes del primer visual y del link a WhatsApp,
 *               largo del cuerpo y palabras por visual, un solo h1, FAQ de 3 a 5.
 *   DATOS       tablas con caption y th scope, gráficos con fuente fechada, y toda cifra en
 *               S/, US$, R$ o % del cuerpo trazable: o sale de APPS (se lee de la comparativa
 *               renderizada), o de PRO_PRECIOS del backend, o tiene un link en su mismo bloque.
 *   PRODUCTO    cada chat del registro (`src/lib/respuestas-bot.json`): su ejemplo encaja en la
 *               plantilla y cada fragmento de plantilla sigue, literal, en `../app`. Y el chat
 *               que se ve en la página es el del registro, no otro.
 *   PÁGINA      desborde horizontal a 375 px, clases de animación y opacidad < 1 en el cuerpo,
 *               y que cada bloque visual esté en el HTML inicial (los crawlers de IA no corren JS).
 *
 * QUÉ NO MIDE, dicho antes de que alguien lo suponga:
 *   - Que el post enganche. Eso lo dice el scroll depth de PostHog cuando haya tráfico.
 *   - El alto de los links: los que van dentro de un párrafo están exentos (WCAG 2.5.8), y en el
 *     cuerpo del blog son todos así. El CTA final no es parte del molde.
 *   - La "misma frase" de una cifra y su fuente: se mira el BLOQUE (el <p> o el <li>). Es una
 *     aproximación declarada; una cifra y un link ajeno en el mismo párrafo pasan.
 *   - La prueba de reemplazo (cambiar el sujeto del post y ver si sigue siendo verdad). No es de
 *     forma, así que ningún script la ve: va escrita en la bitácora de la corrida.
 *
 * Los posts que todavía no están en el molde van en LEGADO, con su motivo. El resto se mide por
 * defecto: un post nuevo cae del lado estricto sin que nadie se acuerde de agregarlo.
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(RAIZ, 'out');
const APP = process.env.NETO_APP_DIR ? path.resolve(process.env.NETO_APP_DIR) : path.resolve(RAIZ, '..', 'app');
const arg = (n) => process.argv.find((a) => a.startsWith(`--${n}=`))?.slice(n.length + 3);
const SOLO = arg('post');

/** Posts fuera del molde, con el motivo. Borrar la entrada al migrarlos. */
const LEGADO = new Map([
  ['gastos-hormiga-peru', 'reescrito el 11-sep-2026 con fuentes; todavía sin molde'],
  ['como-controlar-gastos-personales-peru', 'reescrito el 11-sep-2026 con fuentes; todavía sin molde'],
  ['en-que-gasto-mi-plata', 'reescrito el 11-sep-2026 con fuentes; todavía sin molde'],
  ['bancos-peru-rastrear-sin-contrasena', 'reescrito el 11-sep-2026 con fuentes; todavía sin molde'],
  ['asistente-financiero-whatsapp-peru', 'reescrito el 11-sep-2026 con fuentes; todavía sin molde'],
]);

/**
 * Umbrales. Los de PROSA y ESTRUCTURA son PRESTADOS de `vortik-site/docs/guias-linea-b.md`, que
 * los calibró midiendo sus páginas: miden español leído en un celular, pero no son un hallazgo
 * sobre este blog. Si un post no entra, el número se cambia midiendo posts de este tipo, nunca
 * porque la pieza que se está escribiendo no cabe.
 */
const U = {
  medianaOracion: 18,
  pctOracionesLargas: 10, // % de oraciones de más de 30 palabras
  oracionLarga: 30,
  oracionMax: 40,
  bloqueMax: 70,
  aperturaMax: 25, // primera oración de un bloque
  bloqueMinimo: 12, // bloques más cortos son etiquetas: no entran a las métricas de prosa
  subtituloMax: 10, // h2/h3 del cuerpo
  preguntaFaqMax: 16, // una pregunta de la FAQ es la pregunta del lector, no un subtítulo
  antesDelVisual: 120,
  antesDelWhatsapp: 620,
  cuerpoMax: 780,
  porVisual: 260,
  faqMin: 3,
  faqMax: 5,
};

const VOSEO = /\b(sos|tenés|podés|querés|sabés|hacés|decís|agregá|andá|decime|mirá|fijate|contame|escribime|mandame|avisame|probá|poné|vení|ponete)\b/i;
const FECHA = /\d{1,2} de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre) de \d{4}/i;
const CIFRA = /(?:S\/|US\$|R\$)\s?\d(?:[\d.,]*\d)?|\d+(?:[.,]\d+)?\s?%/g;

const fallos = [];
const notas = [];
const falla = (donde, msg) => fallos.push(`[${donde}] ${msg}`);
const noPudo = (msg) => {
  console.error(`\n? check-blog: no se pudo medir. ${msg}\n`);
  process.exit(2);
};
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const normCifra = (c) => c.replace(/\s+/g, '');
const pal = (t) => (t.match(/\S+/g) || []).length;
const oraciones = (t) => t.split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
const mediana = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? (s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2) : 0;
};
const sinMarkdownWa = (t) => t.replace(/\*([^*\n]+)\*/g, '$1').replace(/_([^_\n]+)_/g, '$1');

// ── PRODUCTO: el registro de chats contra el backend ─────────────────────────────────────────
if (!existsSync(path.join(APP, 'lib', 'trial.js'))) {
  noPudo(`No encuentro el backend en ${APP}. Los chats se cotejan contra su código; NETO_APP_DIR cambia la ruta.`);
}
const leerApp = (rel) => {
  const abs = path.join(APP, rel);
  return existsSync(abs) ? readFileSync(abs, 'utf-8') : null;
};
const mp = leerApp('lib/config.js')?.match(/PRO_PRECIOS\s*=\s*\{\s*mensual:\s*(\d+(?:\.\d+)?),\s*anual:\s*(\d+(?:\.\d+)?)\s*\}/);
if (!mp) noPudo('No encuentro PRO_PRECIOS en app/lib/config.js: cambió de forma o de lugar.');
const PRO = { mensual: Number(mp[1]), anual: Number(mp[2]) };

const REGISTRO = JSON.parse(readFileSync(path.join(RAIZ, 'src', 'lib', 'respuestas-bot.json'), 'utf-8')).respuestas;
if (!Object.keys(REGISTRO).length) falla('antivacuidad', 'el registro de respuestas del bot está vacío');
let fragmentos = 0;
for (const [clave, r] of Object.entries(REGISTRO)) {
  const donde = `chat ${clave}`;
  if (!r.plantilla?.length) falla(donde, 'no cita ningún fragmento de plantilla del backend');
  for (const { archivo, codigo } of r.plantilla ?? []) {
    fragmentos++;
    const fuente = leerApp(archivo);
    if (fuente == null) {
      falla(donde, `${archivo} ya no existe en el backend`);
    } else if (!norm(fuente).includes(norm(codigo))) {
      falla(donde, `la plantilla cambió en ${archivo}: ya no está ${JSON.stringify(codigo.slice(0, 90))}`);
    }
  }
  const deNeto = r.mensajes.filter((m) => m.de === 'neto');
  if (!deNeto.length) falla(donde, 'no tiene ningún mensaje de Neto');
  for (const m of deNeto) {
    if (!m.patron) {
      falla(donde, 'un mensaje de Neto no trae patrón de plantilla');
      continue;
    }
    const re = new RegExp(
      m.patron.replaceAll('{PRO_MENSUAL}', String(PRO.mensual)).replaceAll('{PRO_ANUAL}', String(PRO.anual)),
      'u'
    );
    if (!re.test(m.texto)) falla(donde, `el ejemplo no encaja en la plantilla del bot: ${JSON.stringify(m.texto.slice(0, 90))}`);
  }
  r.mensajes.forEach((m, i) => {
    if (!m.captura) return;
    const sig = r.mensajes[i + 1];
    if (!sig || sig.de !== 'neto' || !sig.texto.includes(`*${m.captura.destinatario}*`) || !sig.texto.includes(m.captura.monto)) {
      falla(donde, 'la respuesta de Neto no dice el mismo comercio y monto que la captura');
    }
  });
}
notas.push(`${Object.keys(REGISTRO).length} chat(s) del registro, ${fragmentos} fragmentos cotejados contra ${APP}`);

// ── Servidor propio sobre out/, salvo que se mida otra base ──────────────────────────────────
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml',
};
let base = arg('base');
let server;
if (!base) {
  if (!existsSync(path.join(OUT, 'blog'))) noPudo('No hay out/blog: corre `npm run build` primero.');
  /*
   * Un out/ más viejo que el fuente no es el post que se va a publicar. Pasó el 12-sep-2026: un
   * build falló por un archivo de tipos corrupto, out/ quedó con la versión anterior y este chequeo
   * dio verde midiendo HTML de antes. Un verde sobre un build viejo no es un verde.
   */
  const fuentesBlog = ['blog.ts', 'blog-content.ts', 'blog-bloques.ts', 'respuestas-bot.json', 'apps-comparativa.ts']
    .map((f) => path.join(RAIZ, 'src', 'lib', f))
    .filter(existsSync);
  const masNuevo = Math.max(...fuentesBlog.map((f) => statSync(f).mtimeMs));
  const construidos = readFileSync(path.join(RAIZ, 'src', 'lib', 'blog.ts'), 'utf-8')
    .match(/slug:\s*"[^"]+"/g)
    .map((m) => path.join(OUT, 'blog', `${m.match(/"([^"]+)"/)[1]}.html`));
  const viejo = construidos.find((f) => !existsSync(f) || statSync(f).mtimeMs < masNuevo);
  if (viejo) noPudo(`${path.relative(RAIZ, viejo)} es más viejo que el fuente del blog (o no existe): el último build no terminó. Corre \`npm run build\`.`);
  server = createServer((req, res) => {
    const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    for (const c of [ruta, `${ruta}.html`, path.posix.join(ruta, 'index.html')]) {
      const abs = path.join(OUT, c);
      if (abs.startsWith(OUT) && existsSync(abs) && statSync(abs).isFile()) {
        res.writeHead(200, { 'content-type': TIPOS[path.extname(abs)] || 'application/octet-stream' });
        res.end(readFileSync(abs));
        return;
      }
    }
    res.writeHead(404);
    res.end('404');
  });
  await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
  base = `http://127.0.0.1:${server.address().port}`;
}
base = base.replace(/\/$/, '');

const slugs = [...readFileSync(path.join(RAIZ, 'src', 'lib', 'blog.ts'), 'utf-8').matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
for (const s of LEGADO.keys()) if (!slugs.includes(s)) falla('legado', `${s} está en LEGADO pero ya no existe: bórralo de la lista`);
const aMedir = slugs.filter((s) => !LEGADO.has(s) && (!SOLO || s === SOLO));
if (!aMedir.length) falla('antivacuidad', SOLO ? `${SOLO} no existe o está en LEGADO` : 'ningún post quedó para medir');

let browser;
try {
  browser = await chromium.launch();
} catch (e) {
  server?.close();
  noPudo(`No arranca Chromium: ${e.message}`);
}
const page = await (await browser.newContext({ viewport: { width: 375, height: 812 } })).newPage();

try {
  // ── Cifras permitidas: las de APPS, leídas de la comparativa renderizada, y las del backend ──
  await page.goto(`${base}/comparativas/apps-finanzas-peru`, { waitUntil: 'load' });
  const comparativa = await page.evaluate(() => document.querySelector('article')?.innerText ?? '');
  const permitidas = new Map();
  for (const c of comparativa.match(CIFRA) ?? []) permitidas.set(normCifra(c), 'sale de APPS');
  if (permitidas.size < 8) falla('antivacuidad', `la comparativa dio ${permitidas.size} cifras: el lector de cifras está roto`);
  if (!comparativa.includes(`S/${PRO.mensual} al mes o S/${PRO.anual} al año`)) {
    falla('precio-neto', `el precio de Neto en APPS no dice "S/${PRO.mensual} al mes o S/${PRO.anual} al año", que es PRO_PRECIOS del backend`);
  }
  permitidas.set(`S/${PRO.mensual}`, 'PRO_PRECIOS.mensual');
  permitidas.set(`S/${PRO.anual}`, 'PRO_PRECIOS.anual');
  permitidas.set(`S/${PRO.mensual * 12}`, 'doce meses de Pro mensual, derivado de PRO_PRECIOS');
  permitidas.set('S/0', 'registrar es gratis: lo dice el precio de Neto en APPS');

  for (const slug of aMedir) {
    const url = `${base}/blog/${slug}`;
    const crudo = await (await fetch(url)).text();
    // `networkidle` y no `load`: se mide el DOM ya hidratado, que es lo que ve quien lee. Con `load`
    // la medición caía a veces antes y a veces después de la hidratación, y React reescribe el cuerpo
    // desde su payload al hidratar. Lo que ven los crawlers (el HTML crudo) lo cubre `crudo`, abajo.
    const resp = await page.goto(url, { waitUntil: 'networkidle' });
    if (!resp || resp.status() !== 200) {
      falla(slug, `la página respondió ${resp?.status() ?? 'nada'}`);
      continue;
    }
    const m = await page.evaluate(() => {
      const VIS = '.blq-tabla, .blq-barras, .blq-chat';
      const art = document.querySelector('article');
      const cuerpo = art?.querySelector('.prose-neto');
      if (!cuerpo) return { sinCuerpo: true };
      const faq = art.querySelector('section[aria-labelledby="preguntas-frecuentes"]');
      const palabras = (t) => (t.match(/\S+/g) || []).length;

      let camino = 0;
      let antesDelVisual = null;
      let antesDelWhatsapp = null;
      const walker = document.createTreeWalker(cuerpo, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const el = n.parentElement;
        if (el.closest('details')) continue;
        if (el.closest(VIS)) {
          if (antesDelVisual === null) antesDelVisual = camino;
          continue;
        }
        if (antesDelWhatsapp === null && el.closest('a[href*="wa.me"]')) antesDelWhatsapp = camino;
        camino += palabras(n.textContent);
      }

      const bloques = [...cuerpo.querySelectorAll('p, li'), ...(faq ? faq.querySelectorAll('p') : [])]
        .filter((b) => !b.closest(VIS) && !b.closest('details') && !b.querySelector('p, li') && !b.classList.contains('blq-etiqueta'))
        .map((b) => ({ texto: b.innerText.replace(/\s+/g, ' ').trim(), link: !!b.querySelector('a[href^="http"]') }));

      const visuales = [...cuerpo.querySelectorAll(VIS)];
      const clases = (sel) => ({ dom: cuerpo.querySelectorAll(sel).length });
      return {
        h1: document.querySelectorAll('h1').length,
        primero: cuerpo.firstElementChild?.className ?? '',
        camino,
        antesDelVisual,
        antesDelWhatsapp,
        visuales: visuales.length,
        conteos: { 'blq-tabla': clases('.blq-tabla'), 'blq-barras': clases('.blq-barras'), 'blq-chat': clases('.blq-chat') },
        bloques,
        subtitulos: [...cuerpo.querySelectorAll('h2, h3')].filter((h) => !h.closest(VIS)).map((h) => h.innerText.trim()),
        preguntas: faq ? [...faq.querySelectorAll('h3')].map((h) => h.innerText.trim()) : [],
        prosaChat: [...cuerpo.querySelectorAll('.blq-chat')].map((f) => f.innerText).join(' '),
        prosa: [...cuerpo.querySelectorAll('h2, h3, p, li, figcaption, caption, td, th'), ...(faq ? faq.querySelectorAll('h3, p') : [])]
          .filter((e) => !e.closest('.blq-chat'))
          .map((e) => e.innerText)
          .join(' '),
        tablas: [...cuerpo.querySelectorAll('table')].map((t) => ({
          caption: t.querySelector('caption')?.innerText.trim() ?? '',
          sinScope: [...t.querySelectorAll('th')].filter((th) => !th.getAttribute('scope')).length,
        })),
        barras: [...cuerpo.querySelectorAll('.blq-barras')].map((f) => f.querySelector('figcaption')?.innerText ?? ''),
        chats: [...cuerpo.querySelectorAll('.blq-chat')].map((f) => ({
          clave: f.dataset.chat,
          neto: [...f.querySelectorAll('.blq-neto')].map((p) => p.innerText),
          pie: f.querySelector('figcaption')?.innerText ?? '',
        })),
        faq: faq ? faq.querySelectorAll('h3').length : 0,
        anchoDoc: document.documentElement.scrollWidth,
        anchoVista: window.innerWidth,
        desbordan: [...cuerpo.querySelectorAll('.blq-tabla, .blq-barras, .blq-chat, .blq-corto, .blq-nota, table')]
          .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1)
          .map((e) => e.className || e.tagName),
        animadas: [...art.querySelectorAll('[class]')]
          .filter((e) => /(^|\s)(animate-|fade-)/.test(e.getAttribute('class')))
          .map((e) => e.getAttribute('class')),
        transparentes: [cuerpo, ...cuerpo.querySelectorAll('*')]
          .filter((e) => parseFloat(getComputedStyle(e).opacity) < 1)
          .map((e) => `${e.tagName.toLowerCase()}.${e.className}`),
      };
    });
    if (m.sinCuerpo) {
      falla(slug, 'no encuentro el cuerpo del post (article .prose-neto): el chequeo no sabe qué medir');
      continue;
    }

    // ESTRUCTURA
    if (m.h1 !== 1) falla(slug, `${m.h1} <h1> en la página; va exactamente uno`);
    if (!/\bblq-corto\b/.test(m.primero)) falla(slug, `el cuerpo no abre con "En corto" (abre con "${m.primero || 'texto suelto'}")`);
    if (!m.visuales) falla(slug, 'ningún elemento visual (tabla, barras o chat)');
    else if (m.antesDelVisual > U.antesDelVisual) falla(slug, `${m.antesDelVisual} palabras antes del primer visual (tope ${U.antesDelVisual})`);
    if (m.camino > U.cuerpoMax) falla(slug, `${m.camino} palabras de cuerpo sin la FAQ (tope ${U.cuerpoMax})`);
    if (m.visuales && m.camino / m.visuales > U.porVisual) {
      falla(slug, `${Math.round(m.camino / m.visuales)} palabras por visual (tope ${U.porVisual}); faltan visuales o sobra prosa`);
    }
    if (m.antesDelWhatsapp === null) falla(slug, 'el cuerpo no tiene link a WhatsApp');
    else if (m.antesDelWhatsapp > U.antesDelWhatsapp) falla(slug, `${m.antesDelWhatsapp} palabras antes del link a WhatsApp (tope ${U.antesDelWhatsapp})`);
    if (m.faq && (m.faq < U.faqMin || m.faq > U.faqMax)) falla(slug, `${m.faq} preguntas frecuentes; van de ${U.faqMin} a ${U.faqMax}`);

    // PROSA
    const prosa = m.bloques.filter((b) => pal(b.texto) >= U.bloqueMinimo);
    if (prosa.length < 5) falla(slug, `solo ${prosa.length} bloques de prosa medibles: el lector de bloques está roto`);
    const largos = prosa.map((b) => oraciones(b.texto).map(pal));
    const todas = largos.flat();
    const med = mediana(todas);
    const pct = todas.length ? (100 * todas.filter((n) => n > U.oracionLarga).length) / todas.length : 0;
    const max = Math.max(0, ...todas);
    if (med > U.medianaOracion) falla(slug, `mediana de ${med} palabras por oración (tope ${U.medianaOracion})`);
    if (pct >= U.pctOracionesLargas) falla(slug, `${pct.toFixed(1)}% de oraciones de más de ${U.oracionLarga} palabras (tope < ${U.pctOracionesLargas}%)`);
    if (max > U.oracionMax) falla(slug, `una oración de ${max} palabras (tope ${U.oracionMax})`);
    prosa.forEach((b, i) => {
      const n = pal(b.texto);
      if (n > U.bloqueMax) falla(slug, `bloque de ${n} palabras (tope ${U.bloqueMax}): "${b.texto.slice(0, 60)}…"`);
      if (largos[i][0] > U.aperturaMax) falla(slug, `abre un bloque con ${largos[i][0]} palabras (tope ${U.aperturaMax}): "${b.texto.slice(0, 60)}…"`);
    });
    for (const h of m.subtitulos) if (pal(h) > U.subtituloMax) falla(slug, `subtítulo de ${pal(h)} palabras (tope ${U.subtituloMax}): "${h}"`);
    for (const q of m.preguntas) if (pal(q) > U.preguntaFaqMax) falla(slug, `pregunta frecuente de ${pal(q)} palabras (tope ${U.preguntaFaqMax}): "${q}"`);
    const dashes = (m.prosa.match(/—/g) || []).length;
    if (dashes) falla(slug, `${dashes} em dash en la prosa (el chat queda fuera: cita al backend literal)`);
    const voseo = m.prosa.match(VOSEO);
    if (voseo) falla(slug, `voseo: "${voseo[0]}"`);

    // DATOS
    for (const t of m.tablas) {
      if (!t.caption) falla(slug, 'una tabla sin <caption>');
      if (t.sinScope) falla(slug, `la tabla "${t.caption}" tiene ${t.sinScope} <th> sin scope`);
    }
    for (const pie of m.barras) if (!/fuente/i.test(pie) || !FECHA.test(pie)) falla(slug, 'un gráfico sin fuente con fecha en su pie');
    let cifras = 0;
    for (const b of m.bloques) {
      for (const c of b.texto.match(CIFRA) ?? []) {
        cifras++;
        if (!permitidas.has(normCifra(c)) && !b.link) {
          falla(slug, `la cifra ${c} no sale de APPS ni de PRO_PRECIOS y su bloque no enlaza una fuente: "${b.texto.slice(0, 70)}…"`);
        }
      }
    }

    // PRODUCTO: el chat que se ve es el del registro
    for (const c of m.chats) {
      const r = REGISTRO[c.clave];
      if (!r) {
        falla(slug, `un chat con clave "${c.clave}" que no está en el registro`);
        continue;
      }
      const esperado = r.mensajes.filter((x) => x.de === 'neto').map((x) => norm(sinMarkdownWa(x.texto)));
      const visto = c.neto.map(norm);
      if (JSON.stringify(esperado) !== JSON.stringify(visto)) falla(slug, `el chat "${c.clave}" no muestra lo que dice el registro`);
      if (!/Respuesta real de Neto/.test(c.pie)) falla(slug, `el chat "${c.clave}" no dice en su pie que es una respuesta real y qué es de ejemplo`);
    }

    // PÁGINA
    if (m.anchoDoc > m.anchoVista) falla(slug, `desborde horizontal a 375 px: la página mide ${m.anchoDoc} px`);
    for (const d of m.desbordan) falla(slug, `un bloque se sale de la pantalla a 375 px: ${d}`);
    for (const a of m.animadas) falla(slug, `clase de animación en el artículo: "${a}"`);
    for (const t of m.transparentes) falla(slug, `nace con opacidad < 1: ${t}`);
    for (const [clase, { dom }] of Object.entries(m.conteos)) {
      const enCrudo = crudo.split(`class="${clase}"`).length - 1;
      if (enCrudo < dom) falla(slug, `${dom} .${clase} en la página y ${enCrudo} en el HTML inicial: se arma en el cliente y los crawlers de IA no lo ven`);
    }

    notas.push(
      `${slug}: ${m.camino} palabras de cuerpo, ${m.visuales} visuales (${Math.round(m.camino / Math.max(1, m.visuales))} por visual), ` +
        `primer visual a ${m.antesDelVisual}, WhatsApp a ${m.antesDelWhatsapp}; ${todas.length} oraciones, mediana ${med}, ` +
        `${pct.toFixed(1)}% largas, máx ${max}; ${cifras} cifras; ${m.chats.length} chat(s)`
    );
  }
} finally {
  await browser.close();
  server?.close();
}

notas.push(`${aMedir.length} post(s) medidos contra ${base}; ${LEGADO.size} en LEGADO`);
for (const n of notas) console.log('  · ' + n);
if (fallos.length) {
  console.error(`\n✗ check-blog: ${fallos.length} problema(s)\n`);
  for (const f of fallos) console.error('  ' + f);
  console.error('');
  process.exit(1);
}
console.log('\n✓ check-blog: los posts del molde cumplen prosa, estructura, datos, producto y página\n');
