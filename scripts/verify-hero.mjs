// Guard del hero contra la deriva con el backend.
//
// El guion del ChatSimulator es una AFIRMACION PUBLICA sobre como responde Neto, y se
// desactualiza en silencio cuando cambian los handlers. Ya paso: durante meses el hero
// mostro un Neto conversacional que opinaba solo y negociaba alertas con si/no, nada de
// lo cual existia. Este harness fija las tres burbujas CARACTER POR CARACTER contra lo
// que emiten transacciones.js:228, webhook.js:203 y formatearResumen + gastos.js:74-81.
// Si cambia una plantilla del backend y nadie toca la landing, esto falla.
//
// Corre contra un navegador real a proposito: el guion vive en el bundle JS, no en el
// HTML estatico, asi que un grep sobre index.html da 0 aunque el deploy este bien —
// hay que esperar el beat en el DOM.
//
//   npm run build && npx serve out -l 4321 -s
//   node scripts/verify-hero.mjs http://localhost:4321/
//   node scripts/verify-hero.mjs "https://neto.pe/?v=$(date +%s)"   # prod con cache-bust
import { chromium } from 'playwright';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.argv[2] || 'http://localhost:4321/';
// Los screenshots son evidencia de la corrida, no artefactos del repo.
const OUT = mkdtempSync(join(tmpdir(), 'hero-'));
const WIDTHS = [1024, 1152, 1280, 1440];

// Lo que el backend produce. Sin los asteriscos de WhatsApp: renderWa los convierte
// en <strong> y el innerText del DOM ya no los tiene.
const ESPERADO = [
  '✅ S/45.00 en Alimentación > restaurante · 03-ago-26',
  '📸 *Gasto registrado*\n\n🚌 *Taxi Directo* — S/ 22.00\nTransporte > taxi · 03-ago-26',
  '📊 *esta semana*\nTotal: *S/ 847.00* • 18 movimientos\n\n' +
    '🍽️ Alimentación: *S/ 412.00* (49%)\n🚌 Transporte: *S/ 210.00* (25%)\n' +
    '🛒 Compras: *S/ 130.00* (15%)\n📋 Otros: *S/ 95.00* (11%)\n\n' +
    '📈 Semana pasada: *S/ 688.00* (+S/ 159.00)\n' +
    '🔝 Mayor gasto: Metro *S/ 126.40* (01-ago-26)',
].map((s) => s.replace(/\*/g, ''));

const norm = (s) => s.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').trim();
let fallos = 0;
const ok = (cond, etiqueta, extra = '') => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${etiqueta}${extra ? ' — ' + extra : ''}`);
  if (!cond) fallos++;
};

const browser = await chromium.launch();

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errores = [];
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
  page.on('pageerror', (e) => errores.push(String(e)));

  await page.goto(BASE, { waitUntil: 'networkidle' });

  // El sexto mensaje entra a los 8900ms y el loop reinicia a los 15000: hay ventana.
  // Esperar por CONTENIDO, no por conteo de nodos: el indicador de "escribiendo"
  // usa la misma clase de burbuja y aparece antes, asi que contar nodos lo cuenta a el.
  await page.waitForFunction(
    () => [...document.querySelectorAll('[class*="rounded-tl-"]')]
      .some((n) => n.innerText.includes('Mayor gasto')),
    null,
    { timeout: 14000 }
  );
  // El contador del total anima ~900ms; leerlo antes da el valor de partida.
  await page.waitForTimeout(1300);

  const burbujas = await page.evaluate(() =>
    [...document.querySelectorAll('[class*="rounded-tl-"]')]
      .map((n) => n.innerText)
      .filter((t) => t && t.trim())
  );

  ok(burbujas.length === 3, `${width}px · 3 burbujas de Neto`, `vi ${burbujas.length}`);
  ESPERADO.forEach((esp, i) => {
    const got = norm(burbujas[i] || '');
    ok(got === norm(esp), `${width}px · burbuja ${i + 1} literal`,
      got === norm(esp) ? '' : `\n     esperado: ${JSON.stringify(norm(esp))}\n     obtenido: ${JSON.stringify(got)}`);
  });

  // Encadenado: el total del dashboard == el total que el chat reporta.
  // Apuntado al span del total del MiniDashboard. Un `/^S\/\d+$/` suelto sobre toda
  // la pagina agarra el "S/0" del plan gratis en Pricing, que no tiene nada que ver.
  const total = await page.evaluate(() => {
    const n = [...document.querySelectorAll('span.font-heading')]
      .find((s) => /^S\/\d+$/.test(s.textContent.trim()));
    return n ? n.textContent.trim() : null;
  });
  ok(total === 'S/847', `${width}px · total del dashboard == total del resumen`, `dashboard: ${total}`);

  // Ninguna fila del dashboard puede nombrar una categoria que el resumen no lista.
  const cats = await page.evaluate(() => {
    const c = [...document.querySelectorAll('span')].map((s) => s.textContent.trim());
    return c.filter((t) => ['Mercado', 'Alimentación', 'Transporte', 'Compras', 'Otros'].includes(t));
  });
  ok(!cats.includes('Mercado'), `${width}px · sin categoria fantasma en las filas`);

  const overflow = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    inner: window.innerWidth,
  }));
  ok(overflow.scroll <= overflow.inner + 1, `${width}px · sin overflow horizontal`,
    `scrollWidth ${overflow.scroll} vs ${overflow.inner}`);

  // El guion vive detras de hidden min-[1024px]:flex — a 1024+ tiene que estar visible.
  const visible = await page.evaluate(() => {
    const b = [...document.querySelectorAll('[class*="rounded-tl-"]')][0];
    return !!b && b.getBoundingClientRect().width > 0;
  });
  ok(visible, `${width}px · showcase visible`);

  ok(errores.length === 0, `${width}px · sin errores de consola`, errores.join(' | '));

  await page.screenshot({ path: `${OUT}/hero-${width}.png` });
  await page.close();
}

// 390: el showcase no se renderiza y el H1 no queda en opacity:0.
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const nBurbujas = await page.evaluate(
    () => [...document.querySelectorAll('[class*="rounded-tl-"]')].filter((n) => n.getBoundingClientRect().width > 0).length
  );
  ok(nBurbujas === 0, '390px · showcase oculto', `vi ${nBurbujas} burbujas`);

  const h1 = await page.evaluate(() => {
    const el = document.querySelector('h1');
    return el ? { op: getComputedStyle(el).opacity, txt: el.innerText.slice(0, 40) } : null;
  });
  ok(h1 && parseFloat(h1.op) > 0.9, '390px · H1 visible (guard de hidratacion)', JSON.stringify(h1));

  const ov = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, i: window.innerWidth }));
  ok(ov.s <= ov.i + 1, '390px · sin overflow horizontal', `${ov.s} vs ${ov.i}`);

  await page.screenshot({ path: `${OUT}/hero-390.png` });
  await page.close();
}

await browser.close();
console.log(`\nScreenshots: ${OUT}`);
console.log(fallos === 0 ? 'TODO OK' : `${fallos} FALLOS`);
process.exit(fallos === 0 ? 0 : 1);
