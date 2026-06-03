/**
 * Carousel generator using Playwright for full CSS + emoji support.
 * Generates Instagram carousel slides as 1080x1080 PNGs.
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "social");
const contentDir = join(__dirname, "..", "..", "content", "carousels");
mkdirSync(outDir, { recursive: true });
mkdirSync(contentDir, { recursive: true });

const BRAND = {
  bg: "#0E0E0C",
  green: "#1D9E75",
  greenLight: "#68dbae",
  text: "#e5e2de",
  text2: "#87948c",
  red: "#ef4444",
};

function baseHTML(bodyContent) {
  return `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:1080px; height:1080px;
    background:${BRAND.bg};
    font-family:'Manrope',sans-serif;
    display:flex; flex-direction:column;
    overflow:hidden; position:relative;
    color:${BRAND.text};
  }
  .slide { width:100%; height:100%; display:flex; flex-direction:column; padding:72px; }
  .slide.center { justify-content:center; align-items:center; text-align:center; }
  .glow {
    position:absolute; top:-120px; left:50%; transform:translateX(-50%);
    width:600px; height:400px;
    background:radial-gradient(ellipse, rgba(29,158,117,0.12) 0%, transparent 70%);
    pointer-events:none;
  }
  .logo { width:64px; height:64px; border-radius:16px; }
  .logo-sm { width:40px; height:40px; border-radius:10px; }
  .tag { color:${BRAND.green}; font-size:16px; font-weight:500; letter-spacing:2px; text-transform:uppercase; }
  .tag.red { color:${BRAND.red}; }
  .header-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
  .title { font-size:40px; font-weight:800; line-height:1.2; margin-bottom:16px; }
  .title.green { color:${BRAND.green}; }
  .title.big { font-size:64px; text-align:center; }
  .title.huge { font-size:96px; }
  .subtitle { font-size:22px; color:${BRAND.text2}; font-weight:400; line-height:1.6; }
  .subtitle.big { font-size:28px; }
  .green-text { color:${BRAND.green}; }
  .red-text { color:${BRAND.red}; }
  .icon-big { font-size:56px; margin-bottom:8px; }
  .icon-huge { font-size:72px; margin-bottom:16px; }
  .amount { font-size:96px; font-weight:800; line-height:1; }
  .amount-unit { font-size:28px; color:${BRAND.text2}; font-weight:400; margin-left:8px; }
  .progress-bar { width:100%; height:16px; background:rgba(255,255,255,0.06); border-radius:8px; overflow:hidden; margin:20px 0; }
  .progress-fill { height:100%; background:${BRAND.green}; border-radius:8px; }
  .progress-fill.red { background:${BRAND.red}; }
  .pct { color:${BRAND.green}; font-size:20px; font-weight:700; margin-top:8px; }
  .check-list { display:flex; flex-direction:column; gap:20px; margin-top:8px; }
  .check-item { display:flex; align-items:flex-start; gap:16px; }
  .check-icon {
    width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center;
    font-size:18px; font-weight:700; flex-shrink:0;
  }
  .check-icon.green { background:rgba(29,158,117,0.15); color:${BRAND.green}; }
  .check-icon.red { background:rgba(239,68,68,0.15); color:${BRAND.red}; }
  .check-text { font-size:26px; font-weight:400; line-height:1.5; }
  .btn {
    background:${BRAND.green}; color:#fff; font-size:28px; font-weight:700;
    padding:20px 56px; border-radius:100px; margin-top:12px; display:inline-block;
  }
  .step-row { display:flex; align-items:center; gap:16px; margin-bottom:16px; }
  .step-num {
    width:44px; height:44px; border-radius:50%; background:${BRAND.green};
    display:flex; align-items:center; justify-content:center;
    color:#fff; font-size:20px; font-weight:700; flex-shrink:0;
  }
  .step-text { font-size:22px; font-weight:400; }
  .divider { width:80px; height:2px; background:rgba(255,255,255,0.08); margin:16px auto; }
  .border-box {
    border:2px solid ${BRAND.green}; border-radius:16px; padding:24px 40px;
    color:${BRAND.green}; font-size:22px; font-weight:600; text-align:center;
  }
  .small { font-size:18px; color:${BRAND.text2}; font-weight:400; margin-top:8px; }
  .category-label { color:${BRAND.text2}; font-size:22px; font-weight:500; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px; }
  .detail { color:${BRAND.text2}; font-size:22px; font-weight:400; line-height:1.6; }
  .gap-12 { gap:12px; display:flex; flex-direction:column; }
  .gap-24 { gap:24px; display:flex; flex-direction:column; }
  .gap-36 { gap:36px; display:flex; flex-direction:column; }
  .mt-auto { margin-top:auto; }
  .flex-center { display:flex; align-items:center; justify-content:center; }
  .flex-row { display:flex; align-items:center; }
  .flex-col { display:flex; flex-direction:column; }
</style>
</head><body>${bodyContent}</body></html>`;
}

// ─── CAROUSEL #1: Vortik anuncia Neto ───
// Para las cuentas de Vortik (IG + LinkedIn) — "lanzamos nuestro primer producto"
const VIOLET = "#A78BFA"; // Vortik brand

const carousel01 = [
  // Slide 1: Launch hook
  `<div class="slide center" style="gap:16px">
    <div class="glow" style="background:radial-gradient(ellipse, rgba(167,139,250,0.12) 0%, transparent 70%)"></div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
      <span style="color:${VIOLET};font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase">VORTIK</span>
      <span style="color:rgba(167,139,250,0.3);font-size:13px">·</span>
      <span style="color:rgba(167,139,250,0.6);font-size:13px;font-weight:500;letter-spacing:1px">PRODUCTO PROPIO</span>
    </div>
    <img src="neto-icon.png" class="logo" style="margin:8px 0 4px 0">
    <div class="title big" style="font-size:72px;margin-bottom:8px">Neto ya existe.</div>
    <div class="subtitle big" style="max-width:720px">Lo construimos para que cualquier peruano pueda controlar su plata sin planillas, sin apps complicadas y sin excusas.</div>
    <div style="display:flex;align-items:center;gap:12px;margin-top:8px">
      <div style="background:${VIOLET};color:#09090B;font-size:18px;font-weight:700;padding:12px 28px;border-radius:100px">Gratis en neto.pe</div>
      <div style="color:rgba(255,255,255,0.4);font-size:14px">· WhatsApp +51 933 014 505</div>
    </div>
  </div>`,

  // Slide 2: Qué es Neto
  `<div class="slide" style="justify-content:center;gap:20px">
    <div class="header-row">
      <span style="color:${VIOLET};font-size:13px;font-weight:700;letter-spacing:2px">VORTIK</span>
      <span class="tag">QUÉ ES</span>
    </div>
    <div class="title" style="font-size:42px">Neto es tu asistente<br>financiero en WhatsApp.</div>
    <div class="subtitle" style="font-size:20px;max-width:800px">Le escribes tus gastos. Él los categoriza, los analiza y te da el panorama completo — sin que abras ninguna planilla.</div>
    <div style="display:flex;gap:14px;margin-top:8px">
      <div style="flex:1;background:#161614;border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:8px">
        <div style="font-size:32px">💬</div>
        <div style="color:${VIOLET};font-size:15px;font-weight:700">100% WhatsApp</div>
        <div style="color:${BRAND.text2};font-size:13px;line-height:1.5">Sin apps nuevas. Donde ya estás.</div>
      </div>
      <div style="flex:1;background:#161614;border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:8px">
        <div style="font-size:32px">🧠</div>
        <div style="color:${VIOLET};font-size:15px;font-weight:700">IA nativa</div>
        <div style="color:${BRAND.text2};font-size:13px;line-height:1.5">Entiende lenguaje natural. Categoriza solo.</div>
      </div>
      <div style="flex:1;background:#161614;border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:8px">
        <div style="font-size:32px">📊</div>
        <div style="color:${VIOLET};font-size:15px;font-weight:700">Dashboard web</div>
        <div style="color:${BRAND.text2};font-size:13px;line-height:1.5">Gráficos, score y reportes en tiempo real.</div>
      </div>
      <div style="flex:1;background:#161614;border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:8px">
        <div style="font-size:32px">🆓</div>
        <div style="color:${VIOLET};font-size:15px;font-weight:700">Freemium</div>
        <div style="color:${BRAND.text2};font-size:13px;line-height:1.5">Gratis para empezar. Pro a S/10/mes.</div>
      </div>
    </div>
  </div>`,

  // Slide 3: Feature — conversación WhatsApp
  `<div class="slide" style="justify-content:center;gap:16px">
    <div class="header-row">
      <span style="color:${VIOLET};font-size:13px;font-weight:700;letter-spacing:2px">VORTIK</span>
      <span class="tag">FEATURE 01</span>
    </div>
    <div class="title" style="font-size:40px;margin-bottom:4px">Le hablas.<br>Neto entiende. Listo.</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;justify-content:flex-end">
        <div style="background:${BRAND.green};border-radius:16px 16px 4px 16px;padding:12px 18px;color:#fff;font-size:18px;max-width:72%">"Gasté 45 soles en delivery 🍕"</div>
      </div>
      <div style="display:flex;justify-content:flex-start">
        <div style="background:#161614;border-radius:4px 16px 16px 16px;padding:12px 18px;color:${BRAND.text};font-size:17px;max-width:78%">✓ Registrado: <strong>S/45.00 · Comida</strong><br><span style="color:${BRAND.text2};font-size:13px">Hoy · 1:15pm</span></div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:4px">
        <div style="background:${BRAND.green};border-radius:16px 16px 4px 16px;padding:12px 18px;color:#fff;font-size:18px;max-width:72%">"¿Cuánto gasté en comida este mes?"</div>
      </div>
      <div style="display:flex;justify-content:flex-start">
        <div style="background:#161614;border-radius:4px 16px 16px 16px;padding:12px 18px;color:${BRAND.text};font-size:17px;max-width:78%">🍕 <strong>Comida — Abril:</strong> S/312<br><span style="color:${BRAND.text2};font-size:13px">18 transacciones · S/17.3 promedio</span><br><span style="color:${BRAND.green};font-size:14px;font-weight:600">Dentro del presupuesto ✓</span></div>
      </div>
    </div>
    <div class="small" style="text-align:center">No es un formulario. Es una conversación.</div>
  </div>`,

  // Slide 4: Feature — Dashboard y resúmenes
  `<div class="slide" style="justify-content:center;gap:16px">
    <div class="header-row">
      <span style="color:${VIOLET};font-size:13px;font-weight:700;letter-spacing:2px">VORTIK</span>
      <span class="tag">FEATURE 02</span>
    </div>
    <div class="title" style="font-size:40px;margin-bottom:4px">Todo el panorama,<br>sin hacer nada extra.</div>
    <div style="display:flex;gap:14px">
      <div style="flex:1;background:#161614;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:10px">
        <div style="font-size:36px">📋</div>
        <div style="color:${VIOLET};font-size:16px;font-weight:700">Resúmenes automáticos</div>
        <div style="color:${BRAND.text2};font-size:14px;line-height:1.6">Cada semana Neto te manda el resumen sin que lo pidas. Total, categorías, tendencia.</div>
        <div style="background:rgba(29,158,117,0.1);border-radius:10px;padding:10px 14px;color:${BRAND.green};font-size:13px;font-weight:600">📊 Total semana: S/134.30<br>Top: 🍕 Comida · 🏠 Vivienda</div>
      </div>
      <div style="flex:1;background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.2);border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:10px">
        <div style="font-size:36px">🖥️</div>
        <div style="color:${VIOLET};font-size:16px;font-weight:700">Dashboard web</div>
        <div style="color:${BRAND.text2};font-size:14px;line-height:1.6">En app.neto.pe: gráficos en tiempo real, historial completo, score y metas de ahorro.</div>
        <div style="color:${BRAND.text};font-size:13px;font-weight:600">📈 Actualizado en tiempo real<br>📄 PDF descargable al instante</div>
      </div>
    </div>
  </div>`,

  // Slide 5: Feature — Score financiero
  `<div class="slide" style="justify-content:center;gap:16px">
    <div class="header-row">
      <span style="color:${VIOLET};font-size:13px;font-weight:700;letter-spacing:2px">VORTIK</span>
      <span class="tag">FEATURE 03</span>
    </div>
    <div class="title" style="font-size:40px;margin-bottom:8px">Tu salud financiera<br>en un número.</div>
    <div style="display:flex;align-items:center;gap:32px;margin:8px 0">
      <div style="text-align:center">
        <div style="color:${VIOLET};font-size:120px;font-weight:800;line-height:1">78</div>
        <div style="color:${BRAND.text2};font-size:16px">/ 100</div>
      </div>
      <div style="flex:1;display:flex;flex-direction:column;gap:14px">
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:44px;height:44px;border-radius:50%;background:rgba(167,139,250,0.15);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">💸</div>
          <div><div style="color:${BRAND.text};font-size:15px;font-weight:600">Gastos</div><div style="color:${BRAND.text2};font-size:13px">Qué tanto respetas tus presupuestos</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:44px;height:44px;border-radius:50%;background:rgba(167,139,250,0.15);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">💰</div>
          <div><div style="color:${BRAND.text};font-size:15px;font-weight:600">Ahorro</div><div style="color:${BRAND.text2};font-size:13px">Cuánto logras guardar cada mes</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:44px;height:44px;border-radius:50%;background:rgba(167,139,250,0.15);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">🕳️</div>
          <div><div style="color:${BRAND.text};font-size:15px;font-weight:600">Fugas</div><div style="color:${BRAND.text2};font-size:13px">Gastos hormiga detectados y controlados</div></div>
        </div>
        <div style="display:flex;align-items:center;gap:12px">
          <div style="width:44px;height:44px;border-radius:50%;background:rgba(167,139,250,0.15);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">💳</div>
          <div><div style="color:${BRAND.text};font-size:15px;font-weight:600">Deudas</div><div style="color:${BRAND.text2};font-size:13px">Progreso en tus abonos mensuales</div></div>
        </div>
      </div>
    </div>
    <div class="small" style="text-align:center">El único asistente financiero por WhatsApp en Perú con score 0–100.</div>
  </div>`,

  // Slide 6: Para quién / target
  `<div class="slide" style="justify-content:center;gap:20px">
    <div class="header-row">
      <span style="color:${VIOLET};font-size:13px;font-weight:700;letter-spacing:2px">VORTIK</span>
      <span class="tag">¿PARA QUIÉN?</span>
    </div>
    <div class="title" style="font-size:42px;margin-bottom:4px">Hecho para el<br>profesional peruano.</div>
    <div style="display:flex;flex-direction:column;gap:14px">
      <div style="display:flex;align-items:center;gap:16px;background:#161614;border-radius:16px;padding:18px 22px">
        <div style="font-size:32px">🏙️</div>
        <div><div style="color:${BRAND.text};font-size:17px;font-weight:600">Lima, 25–35 años</div><div style="color:${BRAND.text2};font-size:14px">Sueldo S/2,500–5,000/mes. Trabaja, gasta, no sabe a dónde va su plata.</div></div>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#161614;border-radius:16px;padding:18px 22px">
        <div style="font-size:32px">📱</div>
        <div><div style="color:${BRAND.text};font-size:17px;font-weight:600">Yape + BCP + efectivo</div><div style="color:${BRAND.text2};font-size:14px">Usa varios medios de pago. Ninguna app lo une todo. Neto sí.</div></div>
      </div>
      <div style="display:flex;align-items:center;gap:16px;background:#161614;border-radius:16px;padding:18px 22px">
        <div style="font-size:32px">❌</div>
        <div><div style="color:${BRAND.text};font-size:17px;font-weight:600">Ya intentó el Excel</div><div style="color:${BRAND.text2};font-size:14px">Lo dejó al tercer día. No porque sea flojo — porque el sistema estaba mal diseñado.</div></div>
      </div>
    </div>
  </div>`,

  // Slide 7: Build in public / stack (credibilidad Vortik)
  `<div class="slide" style="justify-content:center;gap:16px">
    <div class="header-row">
      <span style="color:${VIOLET};font-size:13px;font-weight:700;letter-spacing:2px">VORTIK</span>
      <span class="tag">BEHIND THE BUILD</span>
    </div>
    <div class="title" style="font-size:38px;margin-bottom:8px">De 0 a producción<br>en 18 días.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="background:#161614;border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:6px">
        <div style="color:${VIOLET};font-size:13px;font-weight:700;letter-spacing:1px">STACK</div>
        <div style="color:${BRAND.text};font-size:14px;line-height:1.7">WhatsApp Cloud API<br>OpenAI GPT-4o mini<br>Next.js + Supabase<br>Railway + Vercel</div>
      </div>
      <div style="background:#161614;border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:6px">
        <div style="color:${VIOLET};font-size:13px;font-weight:700;letter-spacing:1px">EN PRODUCCIÓN</div>
        <div style="color:${BRAND.text};font-size:14px;line-height:1.7">56 tests automatizados<br>15+ tablas en Supabase<br>Usuarios reales activos<br>Freemium + Pro S/10/mes</div>
      </div>
      <div style="background:rgba(167,139,250,0.06);border:1px solid rgba(167,139,250,0.2);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:6px">
        <div style="color:${VIOLET};font-size:13px;font-weight:700;letter-spacing:1px">LO QUE APRENDIMOS</div>
        <div style="color:${BRAND.text2};font-size:13px;line-height:1.7">WhatsApp es el canal ganador en Perú. La gente prefiere conversar. El onboarding en 2 min es clave.</div>
      </div>
      <div style="background:rgba(29,158,117,0.06);border:1px solid rgba(29,158,117,0.2);border-radius:16px;padding:20px;display:flex;flex-direction:column;gap:6px">
        <div style="color:${BRAND.green};font-size:13px;font-weight:700;letter-spacing:1px">PRÓXIMO PASO</div>
        <div style="color:${BRAND.text2};font-size:13px;line-height:1.7">Crecer base de usuarios, validar Plan Pro y buscar primeras reseñas reales.</div>
      </div>
    </div>
  </div>`,

  // Slide 8: Dual CTA — usuario + cliente Vortik
  `<div class="slide center" style="gap:20px">
    <div class="glow" style="background:radial-gradient(ellipse, rgba(167,139,250,0.1) 0%, transparent 70%)"></div>
    <div style="color:${VIOLET};font-size:13px;font-weight:700;letter-spacing:3px">UN PRODUCTO DE VORTIK</div>
    <img src="neto-icon.png" class="logo">
    <div class="title" style="font-size:44px;margin-top:4px">Pruébalo gratis.</div>
    <div style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:600px;margin-top:4px">
      <div style="background:${BRAND.green};border-radius:16px;padding:18px 28px;text-align:center">
        <div style="color:#fff;font-size:20px;font-weight:700">Eres usuario → neto.pe</div>
        <div style="color:rgba(255,255,255,0.7);font-size:14px;margin-top:4px">Empieza gratis · WhatsApp +51 933 014 505</div>
      </div>
      <div style="background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.3);border-radius:16px;padding:18px 28px;text-align:center">
        <div style="color:${VIOLET};font-size:20px;font-weight:700">¿Quieres algo así? → vortik.dev</div>
        <div style="color:${BRAND.text2};font-size:14px;margin-top:4px">Construimos productos digitales desde Lima</div>
      </div>
    </div>
  </div>`,
];

// ─── CAROUSEL #3: S/3,500 al mes en Lima ───
const carousel3 = [
  // Slide 1: Hook
  `<div class="slide center">
    <div class="glow"></div>
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title big" style="margin-bottom:12px">S/3,500 al mes<br>en Lima</div>
    <div class="green-text" style="font-size:36px;font-weight:700">¿Cuánto queda real?</div>
    <div class="subtitle" style="margin-top:24px">Desliza para ver el desglose →</div>
  </div>`,

  // Slide 2: Alquiler
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">DESGLOSE MENSUAL</span></div>
    <div class="icon-big">🏠</div>
    <div class="category-label">ALQUILER</div>
    <div class="flex-row"><span class="amount">S/1,200</span><span class="amount-unit">/mes</span></div>
    <div class="progress-bar"><div class="progress-fill" style="width:34%"></div></div>
    <div class="detail">Departamento 1-2 habitaciones en distritos como Surco, Pueblo Libre o Jesús María</div>
    <div class="pct">34% de tu sueldo</div>
  </div>`,

  // Slide 3: Transporte
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">DESGLOSE MENSUAL</span></div>
    <div class="icon-big">🚌</div>
    <div class="category-label">TRANSPORTE</div>
    <div class="flex-row"><span class="amount">S/350</span><span class="amount-unit">/mes</span></div>
    <div class="progress-bar"><div class="progress-fill" style="width:10%"></div></div>
    <div class="detail">Metropolitano, taxi apps, combustible. Lima es cara para moverse.</div>
    <div class="pct">10% de tu sueldo</div>
  </div>`,

  // Slide 4: Comida
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">DESGLOSE MENSUAL</span></div>
    <div class="icon-big">🍽️</div>
    <div class="category-label">COMIDA</div>
    <div class="flex-row"><span class="amount">S/600</span><span class="amount-unit">/mes</span></div>
    <div class="progress-bar"><div class="progress-fill" style="width:17%"></div></div>
    <div class="detail">Mercado, delivery, restaurantes, almuerzo cerca del trabajo</div>
    <div class="pct">17% de tu sueldo</div>
  </div>`,

  // Slide 5: Servicios
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">DESGLOSE MENSUAL</span></div>
    <div class="icon-big">📱</div>
    <div class="category-label">SERVICIOS</div>
    <div class="flex-row"><span class="amount">S/250</span><span class="amount-unit">/mes</span></div>
    <div class="progress-bar"><div class="progress-fill" style="width:7%"></div></div>
    <div class="detail">Luz, agua, internet, celular postpago</div>
    <div class="pct">7% de tu sueldo</div>
  </div>`,

  // Slide 6: Suscripciones
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">DESGLOSE MENSUAL</span></div>
    <div class="icon-big">📺</div>
    <div class="category-label">SUSCRIPCIONES</div>
    <div class="flex-row"><span class="amount">S/120</span><span class="amount-unit">/mes</span></div>
    <div class="progress-bar"><div class="progress-fill" style="width:3%"></div></div>
    <div class="detail">Netflix, Spotify, gym, apps, seguros</div>
    <div class="pct">3% de tu sueldo</div>
  </div>`,

  // Slide 7: The reveal
  `<div class="slide center">
    <div class="subtitle" style="margin-bottom:16px">Después de todo eso, quedan...</div>
    <div class="green-text" style="font-size:120px;font-weight:800;line-height:1">S/980</div>
    <div class="title" style="font-size:32px;margin-top:16px">¿Y sabes a dónde fueron?</div>
    <div class="divider"></div>
    <div class="subtitle" style="max-width:700px">La mayoría de profesionales en Lima no tiene visibilidad de ese 29%. Ahí están los gastos hormiga, las fugas y el ahorro que no fue.</div>
  </div>`,

  // Slide 8: CTA
  `<div class="slide center">
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title" style="font-size:44px">Neto te muestra tu desglose real.</div>
    <div class="subtitle big" style="max-width:700px">Registra por WhatsApp. Ve tu panorama completo en el dashboard: gráficos, score financiero y fugas detectadas.</div>
    <div class="btn">Gratis en neto.pe</div>
    <div class="small">WhatsApp + Dashboard · 6 bancos · IA</div>
  </div>`,
];

// ─── CAROUSEL #7: La regla 50/30/20 adaptada a Lima ───
const carousel7 = [
  // Slide 1: Hook
  `<div class="slide center">
    <div class="glow"></div>
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title big" style="margin-bottom:12px">La regla<br>50/30/20</div>
    <div class="green-text" style="font-size:36px;font-weight:700">adaptada a Lima <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f1f5-1f1ea.png" style="width:36px;height:36px;vertical-align:middle;display:inline-block"></div>
    <div class="subtitle" style="margin-top:24px">¿Funciona con sueldo peruano? →</div>
  </div>`,

  // Slide 2: Explanation
  `<div class="slide" style="justify-content:center;gap:32px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">LA REGLA</span></div>
    <div class="title" style="font-size:36px">¿Qué es el 50/30/20?</div>
    <div class="check-list">
      <div class="check-item">
        <div class="check-icon green">50</div>
        <div class="flex-col"><div class="check-text"><strong>Necesidades</strong></div><div class="detail">Alquiler, comida, transporte, servicios</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">30</div>
        <div class="flex-col"><div class="check-text"><strong>Gustos</strong></div><div class="detail">Salidas, ropa, delivery, entretenimiento</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">20</div>
        <div class="flex-col"><div class="check-text"><strong>Ahorro y deudas</strong></div><div class="detail">Fondo de emergencia, inversiones, deudas</div></div>
      </div>
    </div>
  </div>`,

  // Slide 3: Applied to S/3,500
  `<div class="slide" style="justify-content:center;gap:24px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">CON S/3,500</span></div>
    <div class="title" style="font-size:32px">Así se ve con sueldo promedio en Lima</div>
    <div class="check-list">
      <div class="check-item">
        <div class="check-icon green">50%</div>
        <div class="flex-col"><div class="check-text">Necesidades: <strong class="green-text">S/1,750</strong></div><div class="detail">Alquiler S/1,200 + servicios S/250 + transporte S/300</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">30%</div>
        <div class="flex-col"><div class="check-text">Gustos: <strong class="green-text">S/1,050</strong></div><div class="detail">Comida fuera, delivery, entretenimiento, compras</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">20%</div>
        <div class="flex-col"><div class="check-text">Ahorro: <strong class="green-text">S/700</strong></div><div class="detail">Fondo emergencia, deudas, inversión</div></div>
      </div>
    </div>
  </div>`,

  // Slide 4: The reality
  `<div class="slide center">
    <div class="icon-huge">😬</div>
    <div class="title" style="font-size:44px">Pero la realidad<br>en Lima es otra</div>
    <div class="divider"></div>
    <div class="subtitle" style="max-width:700px">Solo el alquiler ya se lleva el 34%. Necesidades llegan al 61%. El 50% no alcanza.</div>
    <div class="progress-bar" style="margin-top:32px"><div class="progress-fill red" style="width:61%"></div></div>
    <div class="red-text" style="font-size:24px;font-weight:700;margin-top:8px">61% en necesidades (vs. 50% de la regla)</div>
  </div>`,

  // Slide 5: Adjusted version
  `<div class="slide" style="justify-content:center;gap:24px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">VERSIÓN LIMA</span></div>
    <div class="title" style="font-size:36px">Regla ajustada: <span class="green-text">60/25/15</span></div>
    <div class="check-list">
      <div class="check-item">
        <div class="check-icon green">60%</div>
        <div class="flex-col"><div class="check-text">Necesidades: <strong class="green-text">S/2,100</strong></div><div class="detail">Realista para Lima — cubre alquiler + servicios + transporte</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">25%</div>
        <div class="flex-col"><div class="check-text">Gustos: <strong class="green-text">S/875</strong></div><div class="detail">Delivery, salidas, ropa — controlado pero no eliminado</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">15%</div>
        <div class="flex-col"><div class="check-text">Ahorro: <strong class="green-text">S/525</strong></div><div class="detail">Alcanzable. Mejor poco constante que mucho nunca.</div></div>
      </div>
    </div>
  </div>`,

  // Slide 6: Tips
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">TIPS</span></div>
    <div class="title" style="font-size:36px">3 formas de llegar al 15% de ahorro</div>
    <div class="check-list">
      <div class="check-item">
        <div class="check-icon green">1</div>
        <div class="flex-col"><div class="check-text"><strong>Detecta fugas</strong></div><div class="detail">Suscripciones olvidadas, delivery excesivo, extras en efectivo</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">2</div>
        <div class="flex-col"><div class="check-text"><strong>Automatiza el ahorro</strong></div><div class="detail">Separa el 15% apenas cobres. Lo que no ves, no gastas.</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">3</div>
        <div class="flex-col"><div class="check-text"><strong>Mide todo</strong></div><div class="detail">Lo que no se mide, no se controla. Registra cada gasto.</div></div>
      </div>
    </div>
  </div>`,

  // Slide 7: CTA
  `<div class="slide center">
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title" style="font-size:44px">Neto mide todo por ti.</div>
    <div class="subtitle big" style="max-width:700px">Registra por WhatsApp, ve tu score financiero y detecta fugas en tu dashboard personalizado.</div>
    <div class="btn">Gratis en neto.pe</div>
    <div class="small">WhatsApp + Dashboard · 6 bancos · IA</div>
  </div>`,
];

// ─── CAROUSEL #8: Los 5 gastos hormiga que te roban S/300 al mes ───
const carousel8 = [
  // Slide 1: Hook
  `<div class="slide center">
    <div class="glow"></div>
    <div class="icon-huge">💸</div>
    <div class="title big" style="margin-bottom:12px">Los 5 gastos hormiga<br>que te roban</div>
    <div class="green-text" style="font-size:72px;font-weight:800;line-height:1">S/300 al mes</div>
    <div class="subtitle" style="margin-top:24px">Y probablemente no los estás contando →</div>
  </div>`,

  // Slide 2: Suscripciones olvidadas
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">FUGA #1</span></div>
    <div class="icon-big">🔄</div>
    <div class="title green">Suscripciones que no usas</div>
    <div class="flex-row"><span class="amount red-text">S/65</span><span class="amount-unit">/mes</span></div>
    <div class="progress-bar"><div class="progress-fill red" style="width:22%"></div></div>
    <div class="detail">Netflix que no ves, Spotify duplicado, gym al que no vas desde febrero, apps premium olvidadas. Se cobran en silencio cada mes.</div>
  </div>`,

  // Slide 3: Delivery frecuente
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">FUGA #2</span></div>
    <div class="icon-big">🛵</div>
    <div class="title green">Delivery "solo esta vez"</div>
    <div class="flex-row"><span class="amount red-text">S/95</span><span class="amount-unit">/mes</span></div>
    <div class="progress-bar"><div class="progress-fill red" style="width:32%"></div></div>
    <div class="detail">Rappi, PedidosYa, Glovo. Un pedido de S/25 tres veces a la semana = S/300. Pero solo notas cada pedido individual.</div>
  </div>`,

  // Slide 4: Café diario
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">FUGA #3</span></div>
    <div class="icon-big">☕</div>
    <div class="title green">El café de cada día</div>
    <div class="flex-row"><span class="amount red-text">S/70</span><span class="amount-unit">/mes</span></div>
    <div class="progress-bar"><div class="progress-fill red" style="width:23%"></div></div>
    <div class="detail">S/7-12 diarios en Starbucks o cafeterías. Parece poco, pero en 22 días hábiles suman. ¿Vale la pena todos los días?</div>
  </div>`,

  // Slide 5: Compras impulsivas
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">FUGA #4</span></div>
    <div class="icon-big">🛍️</div>
    <div class="title green">Compras impulsivas online</div>
    <div class="flex-row"><span class="amount red-text">S/45</span><span class="amount-unit">/mes</span></div>
    <div class="progress-bar"><div class="progress-fill red" style="width:15%"></div></div>
    <div class="detail">Amazon, Mercado Libre, Shein. "Solo estoy viendo" → terminas comprando algo que no necesitabas. Cada mes.</div>
  </div>`,

  // Slide 6: Propinas y extras en efectivo
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">FUGA #5</span></div>
    <div class="icon-big">💵</div>
    <div class="title green">Extras en efectivo</div>
    <div class="flex-row"><span class="amount red-text">S/40</span><span class="amount-unit">/mes</span></div>
    <div class="progress-bar"><div class="progress-fill red" style="width:13%"></div></div>
    <div class="detail">Propinas, snacks del Tambo, taxi en efectivo, la "colaboración". Gastos invisibles que no se registran en ningún lado.</div>
  </div>`,

  // Slide 7: Total reveal
  `<div class="slide center">
    <div class="subtitle" style="margin-bottom:8px">Estos 5 gastos suman...</div>
    <div class="red-text" style="font-size:120px;font-weight:800;line-height:1">S/315</div>
    <div class="title" style="font-size:28px;margin-top:16px;color:${BRAND.text2}">al mes — S/3,780 al año</div>
    <div class="divider"></div>
    <div class="subtitle" style="max-width:700px">No es que gastes de más. Es que no tienes visibilidad de a dónde va. Esa es la diferencia.</div>
  </div>`,

  // Slide 8: CTA
  `<div class="slide center">
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title" style="font-size:44px">Neto detecta tus fugas automáticamente.</div>
    <div class="subtitle big" style="max-width:700px">Registra por WhatsApp y ve exactamente a dónde se va tu plata en el dashboard con gráficos y alertas.</div>
    <div class="btn">Gratis en neto.pe</div>
    <div class="small">WhatsApp + Dashboard · 6 bancos · IA</div>
  </div>`,
];

// ─── CAROUSEL #5: ¿Por qué los jóvenes en Lima no ahorran? ───
const carousel5 = [
  // Slide 1: Hook
  `<div class="slide center">
    <div class="glow"></div>
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title big" style="margin-bottom:12px">¿Por qué no<br>ahorras?</div>
    <div class="green-text" style="font-size:36px;font-weight:700">No es falta de disciplina.</div>
    <div class="subtitle" style="margin-top:24px">Es falta de visibilidad →</div>
  </div>`,

  // Slide 2: Razón 1
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">RAZÓN #1</span></div>
    <div class="icon-big">📝</div>
    <div class="title green">No registras tus gastos</div>
    <div class="subtitle" style="max-width:800px">Nadie va a anotar cada gasto en un Excel después de pagar en el Tambo a las 11pm. El registro manual no funciona.</div>
    <div class="border-box" style="margin-top:16px">Neto registra todo por ti desde WhatsApp</div>
  </div>`,

  // Slide 3: Razón 2
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">RAZÓN #2</span></div>
    <div class="icon-big">🎯</div>
    <div class="title green">No tienes presupuesto real</div>
    <div class="subtitle" style="max-width:800px">La mayoría presupuesta con lo que "cree" que gasta, no con datos reales. Y el plan dura 2 semanas.</div>
    <div class="border-box" style="margin-top:16px">Neto crea presupuestos basados en tu historial real</div>
  </div>`,

  // Slide 4: Razón 3
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">RAZÓN #3</span></div>
    <div class="icon-big">🐜</div>
    <div class="title green">Gastos hormiga invisibles</div>
    <div class="subtitle" style="max-width:800px">S/7 en café, S/25 en delivery, S/15 en snacks. Cada uno es "poco". Juntos son S/300+ al mes que nunca ves.</div>
    <div class="border-box" style="margin-top:16px">Neto detecta fugas automáticamente</div>
  </div>`,

  // Slide 5: Razón 4
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">RAZÓN #4</span></div>
    <div class="icon-big">📊</div>
    <div class="title green">No sabes tu score financiero</div>
    <div class="subtitle" style="max-width:800px">Sin un número que te diga cómo vas, no hay motivación para mejorar. Es como hacer dieta sin balanza.</div>
    <div class="border-box" style="margin-top:16px">Neto calcula tu score y lo mejora contigo</div>
  </div>`,

  // Slide 6: Razón 5
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">RAZÓN #5</span></div>
    <div class="icon-big">🏔️</div>
    <div class="title green">No tienes una meta clara</div>
    <div class="subtitle" style="max-width:800px">"Ahorrar" no es una meta. "Juntar S/3,000 para emergencias en 6 meses" sí lo es. Sin meta concreta, no hay plan.</div>
    <div class="border-box" style="margin-top:16px">Neto te ayuda a crear planes de ahorro</div>
  </div>`,

  // Slide 7: CTA
  `<div class="slide center">
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title" style="font-size:44px">Las 5 razones tienen solución.</div>
    <div class="subtitle big" style="max-width:700px">Registra por WhatsApp, ve tus fugas y score en el dashboard, y crea planes de ahorro reales.</div>
    <div class="btn">Gratis en neto.pe</div>
    <div class="small">WhatsApp + Dashboard · 6 bancos · IA</div>
  </div>`,
];

// ─── CAROUSEL #9: Fondo de emergencia en Perú ───
const carousel9 = [
  // Slide 1: Hook
  `<div class="slide center">
    <div class="glow"></div>
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title big" style="margin-bottom:12px">Fondo de<br>emergencia</div>
    <div class="green-text" style="font-size:36px;font-weight:700">Guía práctica para Perú</div>
    <div class="subtitle" style="margin-top:24px">Cuánto, dónde y cómo →</div>
  </div>`,

  // Slide 2: Qué es
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">PASO 1</span></div>
    <div class="icon-big">🛡️</div>
    <div class="title" style="font-size:36px">¿Qué es y por qué lo necesitas?</div>
    <div class="subtitle" style="max-width:800px">Plata reservada para imprevistos: emergencias médicas, reparaciones, pérdida de trabajo. Sin esto, cualquier imprevisto te endeuda.</div>
    <div class="red-text" style="font-size:22px;font-weight:600;margin-top:16px">67% de peruanos no podría cubrir un gasto inesperado de S/1,000</div>
  </div>`,

  // Slide 3: Cuánto necesitas
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">PASO 2</span></div>
    <div class="icon-big">🧮</div>
    <div class="title" style="font-size:36px">¿Cuánto necesitas?</div>
    <div class="check-list">
      <div class="check-item">
        <div class="check-icon green">3x</div>
        <div class="flex-col"><div class="check-text"><strong>Mínimo: 3 meses</strong> de gastos fijos</div><div class="detail">Si ganas S/3,500 y tus fijos son S/2,100 → necesitas S/6,300</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">6x</div>
        <div class="flex-col"><div class="check-text"><strong>Ideal: 6 meses</strong> de gastos fijos</div><div class="detail">S/12,600 — te da tranquilidad real ante cualquier imprevisto</div></div>
      </div>
    </div>
  </div>`,

  // Slide 4: Dónde guardarlo
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">PASO 3</span></div>
    <div class="icon-big">🏦</div>
    <div class="title" style="font-size:36px">¿Dónde guardarlo en Perú?</div>
    <div class="check-list">
      <div class="check-item">
        <div class="check-icon green">✓</div>
        <div class="flex-col"><div class="check-text"><strong>Cuenta de ahorro</strong> (BCP, Interbank)</div><div class="detail">Liquidez inmediata, bajo interés pero acceso 24/7</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">✓</div>
        <div class="flex-col"><div class="check-text"><strong>Depósito a plazo</strong> (30-90 días)</div><div class="detail">Mejor tasa, pero no puedes sacarlo antes sin penalidad</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">✓</div>
        <div class="flex-col"><div class="check-text"><strong>Cuenta CTS</strong></div><div class="detail">Ya tienes plata ahí — cuenta como parte de tu fondo</div></div>
      </div>
    </div>
  </div>`,

  // Slide 5: Estrategia
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">PASO 4</span></div>
    <div class="icon-big">📈</div>
    <div class="title" style="font-size:36px">¿Cómo construirlo?</div>
    <div class="check-list">
      <div class="check-item">
        <div class="check-icon green">1</div>
        <div class="flex-col"><div class="check-text"><strong>Automatiza</strong></div><div class="detail">Separa el 10-15% apenas cobres. Lo que no ves, no gastas.</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">2</div>
        <div class="flex-col"><div class="check-text"><strong>Empieza pequeño</strong></div><div class="detail">S/200/mes = S/2,400 en un año. Mejor poco constante que nada.</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">3</div>
        <div class="flex-col"><div class="check-text"><strong>Detecta fugas</strong></div><div class="detail">S/300 en gastos hormiga redirigidos = fondo completo en 21 meses.</div></div>
      </div>
    </div>
  </div>`,

  // Slide 6: Timeline
  `<div class="slide center">
    <div class="title" style="font-size:36px;margin-bottom:24px">¿Cuánto tiempo toma?</div>
    <div class="check-list" style="max-width:700px;text-align:left">
      <div class="check-item">
        <div class="check-icon green" style="width:100px;border-radius:12px;font-size:14px">S/200/mes</div>
        <div class="flex-col"><div class="check-text">Meta mínima (S/6,300): <strong class="green-text">32 meses</strong></div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green" style="width:100px;border-radius:12px;font-size:14px">S/400/mes</div>
        <div class="flex-col"><div class="check-text">Meta mínima (S/6,300): <strong class="green-text">16 meses</strong></div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green" style="width:100px;border-radius:12px;font-size:14px">S/525/mes</div>
        <div class="flex-col"><div class="check-text">Meta ideal (S/12,600): <strong class="green-text">24 meses</strong></div></div>
      </div>
    </div>
    <div class="subtitle" style="margin-top:24px;max-width:600px">Parece mucho, pero cada mes que pasa sin empezar es un mes más de riesgo.</div>
  </div>`,

  // Slide 7: CTA
  `<div class="slide center">
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title" style="font-size:44px">Neto te ayuda a llegar ahí.</div>
    <div class="subtitle big" style="max-width:700px">Crea tu plan de ahorro, detecta fugas y trackea tu progreso en el dashboard. Todo empieza en WhatsApp.</div>
    <div class="btn">Gratis en neto.pe</div>
    <div class="small">WhatsApp + Dashboard · 6 bancos · IA</div>
  </div>`,
];

// ─── CAROUSEL #12: Deudas en Perú: cuáles atacar primero ───
const carousel12 = [
  // Slide 1: Hook
  `<div class="slide center">
    <div class="glow"></div>
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title big" style="margin-bottom:12px">¿Tienes<br>varias deudas?</div>
    <div class="green-text" style="font-size:36px;font-weight:700">El orden importa más de lo que crees</div>
    <div class="subtitle" style="margin-top:24px">2 métodos que funcionan →</div>
  </div>`,

  // Slide 2: El problema
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">EL PROBLEMA</span></div>
    <div class="icon-big">😰</div>
    <div class="title" style="font-size:36px">Pagar deudas sin estrategia</div>
    <div class="subtitle" style="max-width:800px">Pagas un poco a cada una, sin priorizar. Los intereses crecen más rápido de lo que abonas. Se siente como nadar contra la corriente.</div>
    <div class="red-text" style="font-size:22px;font-weight:600;margin-top:16px">Las tarjetas en Perú cobran hasta 80% TEA</div>
  </div>`,

  // Slide 3: Método avalancha
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">MÉTODO 1</span></div>
    <div class="icon-big">🏔️</div>
    <div class="title green">Avalancha: mayor interés primero</div>
    <div class="check-list">
      <div class="check-item">
        <div class="check-icon green">1°</div>
        <div class="flex-col"><div class="check-text">Tarjeta de crédito <strong class="red-text">80% TEA</strong></div><div class="detail">Paga el máximo posible aquí primero</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">2°</div>
        <div class="flex-col"><div class="check-text">Préstamo personal <strong class="red-text">35% TEA</strong></div><div class="detail">Mínimo mientras atacas la tarjeta</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">3°</div>
        <div class="flex-col"><div class="check-text">Crédito vehicular <strong class="green-text">12% TEA</strong></div><div class="detail">El interés más bajo — último en prioridad</div></div>
      </div>
    </div>
    <div class="pct">Ahorras más dinero en intereses a largo plazo</div>
  </div>`,

  // Slide 4: Método bola de nieve
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">MÉTODO 2</span></div>
    <div class="icon-big">⛄</div>
    <div class="title green">Bola de nieve: menor monto primero</div>
    <div class="check-list">
      <div class="check-item">
        <div class="check-icon green">1°</div>
        <div class="flex-col"><div class="check-text">Deuda de <strong class="green-text">S/500</strong></div><div class="detail">La eliminas rápido → motivación inmediata</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">2°</div>
        <div class="flex-col"><div class="check-text">Deuda de <strong class="green-text">S/2,000</strong></div><div class="detail">Con lo que liberaste de la primera, avanzas más rápido</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">3°</div>
        <div class="flex-col"><div class="check-text">Deuda de <strong class="green-text">S/8,000</strong></div><div class="detail">Ahora tienes toda la fuerza concentrada aquí</div></div>
      </div>
    </div>
    <div class="pct">Más motivador psicológicamente — ves resultados rápido</div>
  </div>`,

  // Slide 5: Cuál elegir
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">¿CUÁL ELEGIR?</span></div>
    <div class="title" style="font-size:36px;margin-bottom:8px">Depende de tu situación</div>
    <div class="check-list">
      <div class="check-item">
        <div class="check-icon green">🏔️</div>
        <div class="flex-col"><div class="check-text"><strong>Avalancha</strong> si tienes disciplina</div><div class="detail">Ideal cuando una deuda tiene interés muy alto (tarjetas)</div></div>
      </div>
      <div class="check-item">
        <div class="check-icon green">⛄</div>
        <div class="flex-col"><div class="check-text"><strong>Bola de nieve</strong> si necesitas motivación</div><div class="detail">Ideal cuando tienes muchas deudas pequeñas y te sientes abrumado</div></div>
      </div>
    </div>
    <div class="subtitle" style="margin-top:16px">Lo peor que puedes hacer es no elegir ninguno y pagar sin estrategia.</div>
  </div>`,

  // Slide 6: CTA
  `<div class="slide center">
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title" style="font-size:44px">Neto trackea tus deudas y abonos.</div>
    <div class="subtitle big" style="max-width:700px">Registra cada pago por WhatsApp y ve tu progreso en el dashboard. Sabe cuánto te falta y te avisa.</div>
    <div class="btn">Gratis en neto.pe</div>
    <div class="small">WhatsApp + Dashboard · 6 bancos · IA</div>
  </div>`,
];

// ─── CAROUSEL #13: ¿Por qué abandonas tu Excel de finanzas? ───
const carousel13 = [
  // Slide 1: Hook
  `<div class="slide center">
    <div class="glow" style="background:radial-gradient(ellipse, rgba(239,68,68,0.1) 0%, transparent 70%)"></div>
    <div class="icon-huge">📊❌</div>
    <div class="title big" style="margin-bottom:12px">¿Por qué abandonas<br>tu Excel de finanzas?</div>
    <div class="red-text" style="font-size:28px;font-weight:600;margin-top:12px">No es falta de disciplina.<br>Es que el sistema está mal diseñado.</div>
    <div class="subtitle" style="margin-top:24px">Te lo explico en 6 slides →</div>
  </div>`,

  // Slide 2: El ciclo
  `<div class="slide" style="justify-content:center;gap:24px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">EL CICLO</span></div>
    <div class="title" style="font-size:36px">El ciclo que todos conocemos:</div>
    <div class="check-list" style="gap:18px">
      <div class="check-item"><div class="check-icon green" style="font-size:20px">📅</div><div class="check-text" style="font-size:24px">Lunes: "Este mes sí llevo mis gastos"</div></div>
      <div class="check-item"><div class="check-icon green" style="font-size:20px">📊</div><div class="check-text" style="font-size:24px">Martes: Abres el Excel con entusiasmo</div></div>
      <div class="check-item"><div class="check-icon red" style="font-size:20px">😩</div><div class="check-text" style="font-size:24px">Jueves: Ya olvidaste 3 gastos del día</div></div>
      <div class="check-item"><div class="check-icon red" style="font-size:20px">🗓️</div><div class="check-text" style="font-size:24px">Fin de mes: Excel con 6 días de data</div></div>
      <div class="check-item"><div class="check-icon red" style="font-size:20px">🔁</div><div class="check-text" style="font-size:24px;color:#f97316;font-weight:600">Mes siguiente: "Este mes sí lo hago"</div></div>
    </div>
    <div class="small" style="font-style:italic">Si te identificas, sigue leyendo.</div>
  </div>`,

  // Slide 3: Razón 1
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">RAZÓN 01</span></div>
    <div class="icon-big">🧠</div>
    <div class="title green">El Excel no está donde está tu plata</div>
    <div class="subtitle" style="max-width:800px">Registras gastos cuando llegas a casa, no cuando gastas. Para entonces ya olvidaste el delivery, el taxi y el café.</div>
    <div class="border-box" style="border-color:#f97316;color:#f97316;margin-top:16px">73% de gastos no se recuerdan bien después de 4 horas</div>
  </div>`,

  // Slide 4: Razón 2
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">RAZÓN 02</span></div>
    <div class="icon-big">⏱️</div>
    <div class="title green">Abrir Excel tiene fricción</div>
    <div class="subtitle" style="max-width:800px">Son solo 30 segundos. Pero a las 11pm, después del trabajo, el gym y la cena... esos 30 segundos no existen.</div>
    <div class="check-list" style="margin-top:12px">
      <div class="check-item"><div class="check-icon green">💬</div><div class="flex-col"><div class="check-text"><strong>WhatsApp:</strong> ya está abierto</div><div class="detail">Siempre en tu pantalla</div></div></div>
      <div class="check-item"><div class="check-icon red">📊</div><div class="flex-col"><div class="check-text"><strong>Excel:</strong> buscar → abrir → fila → escribir</div><div class="detail">Demasiados pasos a las 11pm</div></div></div>
    </div>
  </div>`,

  // Slide 5: Razón 3
  `<div class="slide" style="justify-content:center;gap:28px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">RAZÓN 03</span></div>
    <div class="icon-big">⚠️</div>
    <div class="title green">El Excel no te avisa</div>
    <div class="subtitle" style="max-width:800px">Llevas tus gastos perfecto... hasta que revisas a fin de mes y ya te pasaste del presupuesto. El daño ya está hecho.</div>
    <div class="progress-bar" style="margin-top:16px"><div class="progress-fill red" style="width:90%"></div></div>
    <div class="red-text" style="font-size:22px;font-weight:700;margin-top:8px">+32% sobre presupuesto ⚠️</div>
    <div class="border-box" style="border-color:#8b5cf6;color:#c4b5fd;margin-top:16px">Necesitas saber MIENTRAS gastas, no después</div>
  </div>`,

  // Slide 6: Reencuadre
  `<div class="slide center">
    <div class="title" style="font-size:44px;margin-bottom:8px">No abandonaste el Excel<br>por flojo.</div>
    <div class="divider"></div>
    <div class="subtitle big" style="max-width:800px">Lo abandonaste porque fue diseñado para contadores, no para ti.</div>
    <div class="border-box" style="margin-top:24px;padding:28px 40px">
      <div style="color:${BRAND.text2};font-size:20px">15 transacciones al día × 1 min × 30 días</div>
      <div style="color:#f97316;font-size:36px;font-weight:800;margin-top:8px">= 7.5 horas al mes</div>
      <div style="color:${BRAND.text2};font-size:18px;font-style:italic;margin-top:8px">Es un segundo trabajo.</div>
    </div>
  </div>`,

  // Slide 7: Solución
  `<div class="slide" style="justify-content:center;gap:24px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">LA SOLUCIÓN</span></div>
    <div class="title" style="font-size:36px">Neto hace lo que el Excel prometía</div>
    <div class="check-list">
      <div class="check-item"><div class="check-icon green">✓</div><div class="check-text">Registras por WhatsApp — texto, voz o foto del recibo</div></div>
      <div class="check-item"><div class="check-icon green">✓</div><div class="check-text">Categoriza cada gasto automáticamente con IA</div></div>
      <div class="check-item"><div class="check-icon green">✓</div><div class="check-text">Te avisa si te estás pasando del presupuesto</div></div>
      <div class="check-item"><div class="check-icon green">✓</div><div class="check-text">Dashboard con gráficos en tiempo real</div></div>
      <div class="check-item"><div class="check-icon green">✓</div><div class="check-text">Score financiero mensual automático</div></div>
    </div>
    <div class="small" style="font-style:italic">Todo desde WhatsApp. Sin abrir ningún archivo.</div>
  </div>`,

  // Slide 8: CTA
  `<div class="slide center">
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title" style="font-size:44px">Tu Excel ya hizo su trabajo.</div>
    <div class="subtitle big" style="max-width:700px">Te enseñó que necesitas controlar tus finanzas. Neto se encarga del resto.</div>
    <div class="btn">Pruébalo gratis → neto.pe</div>
    <div class="small">WhatsApp · Texto, voz o foto · En el momento</div>
  </div>`,
];

// ─── CAROUSEL #14: Neto vs Excel: 2 formas de controlar tu plata ───
const carousel14 = [
  // Slide 1: Split hook
  `<div class="slide center">
    <div style="display:flex;gap:0;width:100%;border-radius:20px;overflow:hidden;margin-bottom:8px">
      <div style="flex:1;background:rgba(100,116,139,0.15);padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:12px">
        <div style="font-size:52px">📊</div>
        <div style="color:${BRAND.text2};font-size:20px;font-weight:700">Método<br>manual</div>
      </div>
      <div style="width:2px;background:rgba(255,255,255,0.06)"></div>
      <div style="flex:1;background:rgba(29,158,117,0.12);padding:32px 24px;display:flex;flex-direction:column;align-items:center;gap:12px">
        <img src="neto-icon.png" style="width:52px;height:52px;border-radius:14px">
        <div style="color:${BRAND.green};font-size:20px;font-weight:700">Método<br>automático</div>
      </div>
    </div>
    <div class="title" style="font-size:42px;margin-top:16px">2 formas de controlar<br>tu plata en Lima</div>
    <div class="subtitle" style="margin-top:12px">¿Cuál encaja con tu vida real? →</div>
  </div>`,

  // Slide 2: Registro
  `<div class="slide" style="justify-content:center;gap:20px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">REGISTRO</span></div>
    <div class="title" style="font-size:34px">¿Cómo registras tus gastos?</div>
    <div class="check-list" style="gap:14px">
      <div class="check-item"><div class="check-icon red" style="width:80px;border-radius:10px;font-size:13px">📊 Excel</div><div class="check-text" style="font-size:20px">Abres archivo, buscas fila, escribes</div></div>
      <div class="check-item"><div class="check-icon green" style="width:80px;border-radius:10px;font-size:13px">💬 Neto</div><div class="check-text" style="font-size:20px">WhatsApp — texto, voz o foto</div></div>
      <div class="check-item"><div class="check-icon red" style="width:80px;border-radius:10px;font-size:13px">⏱️ Tiempo</div><div class="check-text" style="font-size:20px">Excel: 2-3 min · Neto: 30 seg</div></div>
      <div class="check-item"><div class="check-icon green" style="width:80px;border-radius:10px;font-size:13px">🎯 Precisión</div><div class="check-text" style="font-size:20px">Excel: depende de memoria · Neto: 95%+</div></div>
    </div>
    <div class="small" style="font-style:italic">12-18 transacciones diarias. ¿Cuánto tiempo tienes?</div>
  </div>`,

  // Slide 3: Alertas
  `<div class="slide" style="justify-content:center;gap:20px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">ALERTAS</span></div>
    <div class="title" style="font-size:34px">¿Te avisa cuando te pasas?</div>
    <div class="check-list" style="gap:14px">
      <div class="check-item"><div class="check-icon red">❌</div><div class="check-text" style="font-size:20px">Excel: no avisa — lo ves cuando revisas</div></div>
      <div class="check-item"><div class="check-icon green">✅</div><div class="check-text" style="font-size:20px">Neto: alerta por WhatsApp en tiempo real</div></div>
      <div class="check-item"><div class="check-icon red">🔍</div><div class="check-text" style="font-size:20px">Excel: ves fugas al final del mes</div></div>
      <div class="check-item"><div class="check-icon green">⚡</div><div class="check-text" style="font-size:20px">Neto: detecta fugas automáticamente</div></div>
    </div>
    <div class="border-box" style="margin-top:12px;padding:18px 24px;text-align:left">
      <div style="color:${BRAND.text2};font-size:14px">Neto — WhatsApp</div>
      <div style="color:${BRAND.text};font-size:20px;font-weight:600;margin-top:4px">⚠️ Llevas S/450 en delivery este mes. Tu límite es S/300.</div>
    </div>
  </div>`,

  // Slide 4: Dashboard
  `<div class="slide" style="justify-content:center;gap:20px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">DASHBOARD</span></div>
    <div class="title" style="font-size:34px">¿Qué tan claro ves tu situación?</div>
    <div class="check-list" style="gap:14px">
      <div class="check-item"><div class="check-icon red">📉</div><div class="check-text" style="font-size:20px">Excel: gráficos solo si los configuras</div></div>
      <div class="check-item"><div class="check-icon green">📊</div><div class="check-text" style="font-size:20px">Neto: gráficos automáticos actualizados</div></div>
      <div class="check-item"><div class="check-icon red">❓</div><div class="check-text" style="font-size:20px">Excel: no tiene score financiero</div></div>
      <div class="check-item"><div class="check-icon green">⭐</div><div class="check-text" style="font-size:20px">Neto: score calculado cada mes</div></div>
      <div class="check-item"><div class="check-icon green">📅</div><div class="check-text" style="font-size:20px">Histórico: desde tu primer gasto en WhatsApp</div></div>
    </div>
    <div class="border-box" style="margin-top:12px;padding:16px 24px">Neto te muestra lo que realmente pasó</div>
  </div>`,

  // Slide 5: Costo real
  `<div class="slide" style="justify-content:center;gap:20px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">COSTO REAL</span></div>
    <div class="title" style="font-size:34px">El costo real de cada método</div>
    <div style="display:flex;gap:16px;margin-top:8px">
      <div style="flex:1;background:rgba(100,116,139,0.08);border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:12px">
        <div style="color:${BRAND.text2};font-size:18px;font-weight:700">📊 Excel</div>
        <div style="color:${BRAND.text};font-size:17px">⏱️ ~7.5 horas/mes</div>
        <div style="color:${BRAND.text};font-size:17px">🧠 Energía: Alta</div>
        <div style="color:${BRAND.text};font-size:17px">🎯 Precisión: 60-70%</div>
        <div style="color:${BRAND.red};font-size:17px;font-weight:600">"Gratis" — tu tiempo no lo es</div>
      </div>
      <div style="flex:1;background:rgba(29,158,117,0.08);border:1px solid ${BRAND.green};border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:12px">
        <div style="color:${BRAND.green};font-size:18px;font-weight:700">💬 Neto</div>
        <div style="color:${BRAND.text};font-size:17px">⏱️ 5 min/mes (revisar)</div>
        <div style="color:${BRAND.text};font-size:17px">🧠 Energía: Mínima</div>
        <div style="color:${BRAND.text};font-size:17px">🎯 Precisión: 95%+</div>
        <div style="color:${BRAND.green};font-size:17px;font-weight:600">Gratis o Pro S/10/mes</div>
      </div>
    </div>
  </div>`,

  // Slide 6: Para quién
  `<div class="slide" style="justify-content:center;gap:20px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">¿PARA QUIÉN?</span></div>
    <div class="title" style="font-size:34px">¿Cuál es para ti?</div>
    <div style="display:flex;gap:16px;margin-top:8px">
      <div style="flex:1;background:rgba(100,116,139,0.08);border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:10px">
        <div style="color:${BRAND.text2};font-size:18px;font-weight:700">📊 Excel es para ti si:</div>
        <div style="color:${BRAND.text2};font-size:16px;line-height:1.5">• Amas la personalización total<br>• Eres contador o financiero<br>• Tienes tiempo para mantenerlo<br>• Trabajas con datos de empresa</div>
      </div>
      <div style="flex:1;background:rgba(29,158,117,0.1);border:1px solid ${BRAND.green};border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:10px">
        <div style="color:${BRAND.green};font-size:18px;font-weight:700">💬 Neto es para ti si:</div>
        <div style="color:${BRAND.text};font-size:16px;line-height:1.5">• Quieres control sin invertir horas<br>• Prefieres registrar por WhatsApp<br>• Prefieres alertas que reportes<br>• Ya intentaste Excel y lo dejaste</div>
      </div>
    </div>
  </div>`,

  // Slide 7: CTA
  `<div class="slide center">
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title" style="font-size:44px">¿Ya intentaste el Excel?</div>
    <div class="green-text" style="font-size:30px;font-weight:700;margin-top:8px">Neto es el siguiente paso.</div>
    <div class="subtitle big" style="max-width:700px;margin-top:16px">Registra por WhatsApp — texto, voz o foto. Dashboard en tiempo real.</div>
    <div class="btn">Empieza gratis → neto.pe</div>
    <div class="small">WhatsApp · Texto, voz o foto · En el momento</div>
  </div>`,
];

// ─── CAROUSEL #15: ¿Cuánto tiempo pierdes actualizando tu Excel? ───
const carousel15 = [
  // Slide 1: Hook
  `<div class="slide center">
    <div class="glow" style="background:radial-gradient(ellipse, rgba(239,68,68,0.08) 0%, transparent 70%)"></div>
    <div class="icon-huge">⏱️</div>
    <div class="title big" style="margin-bottom:12px">¿Cuánto tiempo pierdes<br>actualizando tu Excel?</div>
    <div class="red-text" style="font-size:26px;font-weight:600;margin-top:12px">Hicimos los cálculos.<br>El resultado es incómodo.</div>
    <div class="subtitle" style="margin-top:24px">→ Desliza</div>
  </div>`,

  // Slide 2: Cálculo base
  `<div class="slide center" style="gap:24px">
    <div class="title" style="font-size:36px">El profesional promedio en Lima:</div>
    <div style="display:flex;gap:20px;margin-top:8px;width:100%">
      <div style="flex:1;background:#161614;border-radius:20px;padding:24px;display:flex;flex-direction:column;align-items:center;gap:8px">
        <div style="font-size:36px">🛒</div>
        <div style="color:${BRAND.green};font-size:42px;font-weight:800">15</div>
        <div style="color:${BRAND.text2};font-size:15px;text-align:center">transacciones al día</div>
      </div>
      <div style="flex:1;background:#161614;border-radius:20px;padding:24px;display:flex;flex-direction:column;align-items:center;gap:8px">
        <div style="font-size:36px">⏱️</div>
        <div style="color:${BRAND.green};font-size:42px;font-weight:800">2'</div>
        <div style="color:${BRAND.text2};font-size:15px;text-align:center">por registro en Excel</div>
      </div>
      <div style="flex:1;background:#161614;border-radius:20px;padding:24px;display:flex;flex-direction:column;align-items:center;gap:8px">
        <div style="font-size:36px">📅</div>
        <div style="color:${BRAND.green};font-size:42px;font-weight:800">30</div>
        <div style="color:${BRAND.text2};font-size:15px;text-align:center">días al mes</div>
      </div>
    </div>
    <div class="border-box" style="border-color:#f97316;color:#f97316;padding:24px 40px;margin-top:8px">
      <div style="color:${BRAND.text2};font-size:20px;font-weight:400">15 × 2 min × 30 días = 900 minutos</div>
      <div style="color:#f97316;font-size:48px;font-weight:800;margin-top:8px">= 15 HORAS AL MES</div>
    </div>
    <div class="small" style="font-style:italic">Eso si lo haces perfecto. Sin olvidar ninguna.</div>
  </div>`,

  // Slide 3: Costo oportunidad
  `<div class="slide" style="justify-content:center;gap:24px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">15 HORAS/MES</span></div>
    <div class="title" style="font-size:36px">15 horas al mes equivalen a...</div>
    <div class="check-list" style="gap:16px">
      <div class="check-item"><div class="check-icon green" style="background:transparent;font-size:28px">🏋️</div><div class="check-text" style="font-size:22px">60 sesiones de gym de 15 minutos</div></div>
      <div class="check-item"><div class="check-icon green" style="background:transparent;font-size:28px">📚</div><div class="check-text" style="font-size:22px">2 libros completos leídos</div></div>
      <div class="check-item"><div class="check-icon green" style="background:transparent;font-size:28px">💼</div><div class="check-text" style="font-size:22px">Un proyecto freelance con ingreso extra</div></div>
      <div class="check-item"><div class="check-icon green" style="background:transparent;font-size:28px">🍳</div><div class="check-text" style="font-size:22px">30 cenas cocinadas en casa</div></div>
      <div class="check-item"><div class="check-icon green" style="background:transparent;font-size:28px">😴</div><div class="check-text" style="font-size:22px">Media hora más de sueño cada noche</div></div>
    </div>
    <div class="small" style="font-style:italic">¿Vale la pena gastar 15h para saber que gastaste demás en delivery?</div>
  </div>`,

  // Slide 4: Imprecisión
  `<div class="slide" style="justify-content:center;gap:22px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">EL PROBLEMA OCULTO</span></div>
    <div class="title" style="font-size:36px">Y encima... no es exacto</div>
    <div class="subtitle" style="font-size:20px">Aunque dediques las 15 horas, la memoria humana siempre falla:</div>
    <div class="check-list" style="gap:12px">
      <div class="check-item"><div class="check-icon red" style="background:transparent;font-size:22px">🧠</div><div class="check-text" style="font-size:20px">Olvidamos 40% de gastos en efectivo</div></div>
      <div class="check-item"><div class="check-icon red" style="background:transparent;font-size:22px">☕</div><div class="check-text" style="font-size:20px">Gastos menores a S/20 raramente se anotan</div></div>
      <div class="check-item"><div class="check-icon red" style="background:transparent;font-size:22px">📱</div><div class="check-text" style="font-size:20px">Rappi o Yape se olvidan fácilmente</div></div>
    </div>
    <div style="background:#161614;border-radius:16px;padding:20px 24px;margin-top:8px;display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="color:${BRAND.text2};font-size:20px">📊 Excel manual</div>
        <div style="color:#64748b;font-size:28px;font-weight:800">65%</div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="color:${BRAND.green};font-size:20px;font-weight:600">💬 Con Neto</div>
        <div style="color:${BRAND.green};font-size:28px;font-weight:800">95%+</div>
      </div>
      <div style="color:${BRAND.text2};font-size:15px;font-style:italic">Precisión de registro</div>
    </div>
  </div>`,

  // Slide 5: Dinero invisible
  `<div class="slide center" style="gap:24px">
    <div class="title" style="font-size:36px">¿Cuánto dinero "invisible" tienes?</div>
    <div style="display:flex;flex-direction:column;gap:10px;width:100%;margin-top:8px">
      <div style="display:flex;justify-content:space-between;padding:14px 22px;background:#161614;border-radius:12px"><span style="color:${BRAND.text2};font-size:20px">Tu sueldo</span><span style="color:${BRAND.text};font-size:20px;font-weight:700">S/3,500</span></div>
      <div style="display:flex;justify-content:space-between;padding:14px 22px;background:#161614;border-radius:12px"><span style="color:${BRAND.text2};font-size:20px">Gastos reales</span><span style="color:${BRAND.text};font-size:20px;font-weight:700">S/3,200</span></div>
      <div style="display:flex;justify-content:space-between;padding:14px 22px;background:#161614;border-radius:12px"><span style="color:${BRAND.text2};font-size:20px">Registrado en tu Excel</span><span style="color:${BRAND.text2};font-size:20px;font-weight:700">S/2,400 (75%)</span></div>
      <div style="display:flex;justify-content:space-between;padding:18px 22px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.3);border-radius:12px"><span style="color:${BRAND.red};font-size:22px;font-weight:700">Gap invisible</span><span style="color:${BRAND.red};font-size:22px;font-weight:800">S/800/mes</span></div>
    </div>
    <div class="border-box" style="border-color:${BRAND.red};color:${BRAND.red};padding:20px 32px;margin-top:8px">
      <div style="font-size:26px;font-weight:800">S/800 × 12 = S/9,600 al año</div>
      <div style="color:${BRAND.text2};font-size:16px;margin-top:6px">que no sabes a dónde fueron.</div>
    </div>
  </div>`,

  // Slide 6: Solución
  `<div class="slide" style="justify-content:center;gap:22px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">LA SOLUCIÓN</span></div>
    <div class="title" style="font-size:36px">¿Y si el registro fuera 30 segundos?</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;justify-content:space-between;padding:14px 22px;background:#161614;border-radius:12px"><span style="color:${BRAND.text2};font-size:20px">Excel manual</span><span style="color:${BRAND.red};font-size:20px;font-weight:700">15 horas/mes</span></div>
      <div style="display:flex;justify-content:space-between;padding:14px 22px;background:rgba(29,158,117,0.1);border:1px solid ${BRAND.green};border-radius:12px"><span style="color:${BRAND.green};font-size:20px;font-weight:600">Con Neto</span><span style="color:${BRAND.green};font-size:20px;font-weight:700">~15 min/mes</span></div>
      <div style="display:flex;justify-content:space-between;padding:14px 22px;background:#161614;border-radius:12px"><span style="color:${BRAND.text};font-size:20px;font-weight:700">Diferencia</span><span style="color:${BRAND.green};font-size:20px;font-weight:800">+14h libres</span></div>
    </div>
    <div class="check-list" style="gap:12px;margin-top:8px">
      <div class="check-item"><div class="check-icon green">✓</div><div class="check-text" style="font-size:20px">Envías por WhatsApp → categoriza → guarda automáticamente</div></div>
      <div class="check-item"><div class="check-icon green">✓</div><div class="check-text" style="font-size:20px">Detecta gastos hormiga sin que lo pidas</div></div>
      <div class="check-item"><div class="check-icon green">✓</div><div class="check-text" style="font-size:20px">Te avisa si algo está fuera de control</div></div>
    </div>
    <div class="small" style="font-style:italic">Envías texto, voz o foto por WhatsApp. Menos de 30 seg por gasto.</div>
  </div>`,

  // Slide 7: CTA
  `<div class="slide center">
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title" style="font-size:52px">Recupera tus 15 horas.</div>
    <div class="subtitle big" style="max-width:700px;margin-top:16px">Neto registra tus gastos desde WhatsApp. Texto, voz o foto del recibo. En el momento.</div>
    <div class="btn">Empieza gratis → neto.pe</div>
    <div class="small">WhatsApp +51 933 014 505 · Texto, voz o foto</div>
  </div>`,
];

// ─── CAROUSEL #16: Tu Score Financiero ───
const carousel16 = [
  // Slide 1: Hook
  `<div class="slide center">
    <div class="glow"></div>
    <img src="neto-icon.png" class="logo" style="margin-bottom:16px">
    <div class="green-text" style="font-size:160px;font-weight:800;line-height:1">0–100</div>
    <div class="title big" style="margin-top:8px">¿Sabes cuánto vale<br>tu salud financiera hoy?</div>
    <div class="subtitle" style="margin-top:20px">→ Desliza para descubrirlo</div>
  </div>`,

  // Slide 2: Qué es el Score
  `<div class="slide" style="justify-content:center;gap:24px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">EL SCORE</span></div>
    <div class="title" style="font-size:40px">Tu Score Financiero</div>
    <div class="subtitle" style="font-size:22px">Un número de 0 a 100 que resume tu salud financiera, calculado con 4 componentes:</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:8px">
      <div style="background:#161614;border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:6px">
        <div style="font-size:34px">💸</div>
        <div style="color:${BRAND.green};font-size:20px;font-weight:700">Gastos</div>
        <div style="color:${BRAND.text2};font-size:15px">Qué tanto respetas tus presupuestos</div>
      </div>
      <div style="background:#161614;border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:6px">
        <div style="font-size:34px">💰</div>
        <div style="color:${BRAND.green};font-size:20px;font-weight:700">Ahorro</div>
        <div style="color:${BRAND.text2};font-size:15px">Cuánto logras guardar cada mes</div>
      </div>
      <div style="background:#161614;border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:6px">
        <div style="font-size:34px">🕳️</div>
        <div style="color:${BRAND.green};font-size:20px;font-weight:700">Fugas</div>
        <div style="color:${BRAND.text2};font-size:15px">Gastos hormiga detectados y controlados</div>
      </div>
      <div style="background:#161614;border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:6px">
        <div style="font-size:34px">💳</div>
        <div style="color:${BRAND.green};font-size:20px;font-weight:700">Deudas</div>
        <div style="color:${BRAND.text2};font-size:15px">Progreso en tus abonos mensuales</div>
      </div>
    </div>
  </div>`,

  // Slide 3: Escala
  `<div class="slide" style="justify-content:center;gap:20px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">LA ESCALA</span></div>
    <div class="title" style="font-size:36px">¿Qué significa tu número?</div>
    <div style="display:flex;flex-direction:column;gap:14px;margin-top:8px">
      <div style="background:rgba(29,158,117,0.12);border:1px solid ${BRAND.green};border-radius:16px;padding:22px 26px;display:flex;align-items:center;gap:18px">
        <div style="color:${BRAND.green};font-size:48px;font-weight:800;min-width:100px">+75</div>
        <div style="flex:1"><div style="color:${BRAND.green};font-size:22px;font-weight:700">🟢 Vas bien</div><div style="color:${BRAND.text2};font-size:16px;margin-top:4px">Tus finanzas están bajo control. Mantén el ritmo.</div></div>
      </div>
      <div style="background:rgba(249,115,22,0.12);border:1px solid #f97316;border-radius:16px;padding:22px 26px;display:flex;align-items:center;gap:18px">
        <div style="color:#f97316;font-size:48px;font-weight:800;min-width:100px">50-74</div>
        <div style="flex:1"><div style="color:#f97316;font-size:22px;font-weight:700">🟠 Hay fugas que cerrar</div><div style="color:${BRAND.text2};font-size:16px;margin-top:4px">Estás a tiempo. Detecta dónde se va tu plata.</div></div>
      </div>
      <div style="background:rgba(239,68,68,0.12);border:1px solid ${BRAND.red};border-radius:16px;padding:22px 26px;display:flex;align-items:center;gap:18px">
        <div style="color:${BRAND.red};font-size:48px;font-weight:800;min-width:100px">&lt;50</div>
        <div style="flex:1"><div style="color:${BRAND.red};font-size:22px;font-weight:700">🔴 El mes te está ganando</div><div style="color:${BRAND.text2};font-size:16px;margin-top:4px">Es momento de actuar. Neto te ayuda a salir.</div></div>
      </div>
    </div>
  </div>`,

  // Slide 4: Qué lo baja
  `<div class="slide" style="justify-content:center;gap:24px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag red">BAJA TU SCORE</span></div>
    <div class="title" style="font-size:38px">¿Qué lo baja?</div>
    <div class="check-list">
      <div class="check-item"><div class="check-icon red">↓</div><div class="check-text">Gastos que se pasan del presupuesto</div></div>
      <div class="check-item"><div class="check-icon red">↓</div><div class="check-text">Deudas sin abonar o con pagos atrasados</div></div>
      <div class="check-item"><div class="check-icon red">↓</div><div class="check-text">Fugas persistentes que no cierras</div></div>
      <div class="check-item"><div class="check-icon red">↓</div><div class="check-text">Planes de ahorro sin cumplir</div></div>
      <div class="check-item"><div class="check-icon red">↓</div><div class="check-text">No registrar gastos a tiempo</div></div>
    </div>
  </div>`,

  // Slide 5: Qué lo sube
  `<div class="slide" style="justify-content:center;gap:24px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">SUBE TU SCORE</span></div>
    <div class="title" style="font-size:38px">¿Qué lo sube?</div>
    <div class="check-list">
      <div class="check-item"><div class="check-icon green">↑</div><div class="check-text">Cumplir tus planes de ahorro mensuales</div></div>
      <div class="check-item"><div class="check-icon green">↑</div><div class="check-text">Reducir fugas detectadas (gastos hormiga)</div></div>
      <div class="check-item"><div class="check-icon green">↑</div><div class="check-text">Abonar tus deudas a tiempo</div></div>
      <div class="check-item"><div class="check-icon green">↑</div><div class="check-text">Respetar tus presupuestos por categoría</div></div>
      <div class="check-item"><div class="check-icon green">↑</div><div class="check-text">Registrar cada gasto en el momento</div></div>
    </div>
  </div>`,

  // Slide 6: Diferenciador
  `<div class="slide center" style="gap:20px">
    <div class="title big" style="font-size:42px">Único en Perú</div>
    <div class="subtitle big" style="max-width:800px">El único asistente financiero por WhatsApp en Perú que calcula tu score automáticamente.</div>
    <div style="display:flex;flex-direction:column;gap:10px;width:100%;margin-top:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 22px;background:rgba(29,158,117,0.12);border:1px solid ${BRAND.green};border-radius:12px"><span style="color:${BRAND.green};font-size:22px;font-weight:700">⭐ Neto</span><span style="color:${BRAND.green};font-size:22px;font-weight:800">✓ Score 0–100</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 22px;background:#161614;border-radius:12px"><span style="color:${BRAND.text2};font-size:20px">Otros bots</span><span style="color:${BRAND.text2};font-size:20px">✗ No lo calculan</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 22px;background:#161614;border-radius:12px"><span style="color:${BRAND.text2};font-size:20px">Excel manual</span><span style="color:${BRAND.text2};font-size:20px">✗ No existe</span></div>
    </div>
  </div>`,

  // Slide 7: CTA
  `<div class="slide center">
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title" style="font-size:48px">¿Cuál es tu score hoy?</div>
    <div class="subtitle big" style="max-width:700px;margin-top:12px">Empieza gratis. Registra tus primeros gastos por WhatsApp y Neto te da tu score en tiempo real.</div>
    <div class="btn">Empieza gratis → neto.pe</div>
    <div class="small">WhatsApp +51 933 014 505 · Score en tiempo real</div>
  </div>`,
];

// ─── CAROUSEL #17: Neto desde WhatsApp — experiencia real ───
const carousel17 = [
  // Slide 1: Hook
  `<div class="slide center">
    <div class="glow"></div>
    <img src="neto-icon.png" class="logo" style="margin-bottom:20px">
    <div class="icon-big">💬</div>
    <div class="title big" style="margin-bottom:16px">¿Y si controlar<br>tus finanzas fuera<br>tan fácil?</div>
    <div class="subtitle" style="max-width:680px">Como mandarle un mensaje a un amigo.<br>Eso es Neto en WhatsApp.</div>
    <div class="subtitle" style="margin-top:24px;color:${BRAND.green}">→ Desliza</div>
  </div>`,

  // Slide 2: Cómo funciona
  `<div class="slide" style="justify-content:center;gap:20px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">ASÍ FUNCIONA</span></div>
    <div class="title" style="font-size:38px;margin-bottom:4px">Así funciona Neto:</div>
    <div style="display:flex;gap:12px;align-items:stretch">
      <div style="flex:1;background:#161614;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:10px">
        <div style="font-size:40px">💬</div>
        <div style="color:${BRAND.green};font-size:17px;font-weight:700">Le cuentas a Neto</div>
        <div style="color:${BRAND.text2};font-size:14px;line-height:1.6">"Gasté S/45 en delivery"<br>"Taxi al aeropuerto S/80"<br>"¿Cuánto gasté esta semana?"</div>
      </div>
      <div style="display:flex;flex-direction:column;justify-content:center;color:${BRAND.green};font-size:26px;padding:0 4px">→</div>
      <div style="flex:1;background:#161614;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:10px">
        <div style="font-size:40px">🧠</div>
        <div style="color:${BRAND.green};font-size:17px;font-weight:700">Neto entiende</div>
        <div style="color:${BRAND.text2};font-size:14px;line-height:1.6">Categoría: 🍕 Comida<br>Categoría: 🚗 Transporte<br>Te lo dice al toque</div>
      </div>
      <div style="display:flex;flex-direction:column;justify-content:center;color:${BRAND.green};font-size:26px;padding:0 4px">→</div>
      <div style="flex:1;background:rgba(29,158,117,0.08);border:1px solid ${BRAND.green};border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:10px">
        <div style="font-size:40px">📊</div>
        <div style="color:${BRAND.green};font-size:17px;font-weight:700">Tu historial crece solo</div>
        <div style="color:${BRAND.text2};font-size:14px;line-height:1.6">Dashboard actualizado<br>Resumen siempre listo<br>Sin planillas</div>
      </div>
    </div>
    <div class="small" style="text-align:center">Lenguaje natural. Sin formularios. Sin fricción.</div>
  </div>`,

  // Slide 3: Resumen semanal
  `<div class="slide" style="justify-content:center;gap:16px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">CADA SEMANA</span></div>
    <div class="title" style="font-size:36px;margin-bottom:4px">Cada semana, Neto<br>te muestra el panorama.</div>
    <div style="background:#161614;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:14px">
      <div style="color:${BRAND.text2};font-size:13px;font-weight:600;letter-spacing:1px">MENSAJE DE NETO 🤖</div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="color:${BRAND.text};font-size:18px;font-weight:700">📊 Resumen semanal</span>
        <span style="color:${BRAND.text2};font-size:13px">31 mar – 6 abr</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06)">
        <span style="color:${BRAND.text2};font-size:15px">Total gastado</span>
        <span style="color:${BRAND.green};font-size:30px;font-weight:800">S/134.30</span>
      </div>
      <div style="color:${BRAND.text2};font-size:12px;font-weight:600;letter-spacing:1px">TOP CATEGORÍAS</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        <div style="display:flex;justify-content:space-between"><span style="color:${BRAND.text};font-size:16px">🍕 Comida</span><span style="color:${BRAND.text};font-size:16px;font-weight:600">S/45.00</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:${BRAND.text};font-size:16px">🏠 Vivienda</span><span style="color:${BRAND.text};font-size:16px;font-weight:600">S/63.00</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:${BRAND.text};font-size:16px">🚗 Transporte</span><span style="color:${BRAND.text};font-size:16px;font-weight:600">S/26.30</span></div>
      </div>
      <div style="background:rgba(29,158,117,0.12);border-radius:10px;padding:10px 14px;color:${BRAND.green};font-size:14px;font-weight:600">Ver gastos en vivienda →</div>
    </div>
    <div class="small" style="text-align:center">Sin pedírselo — llega cada semana.</div>
  </div>`,

  // Slide 4: Drill-down por categoría
  `<div class="slide" style="justify-content:center;gap:16px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">POR CATEGORÍA</span></div>
    <div class="title" style="font-size:36px;margin-bottom:4px">¿Quieres saber exactamente<br>en qué vas?</div>
    <div style="background:#161614;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:12px">
      <div style="color:${BRAND.text2};font-size:12px;font-weight:600;letter-spacing:1px">NETO 🤖 · Gastos en Vivienda — Mar 2026</div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
        <span style="color:${BRAND.text};font-size:18px">🔌 Luz</span>
        <span style="color:${BRAND.text};font-size:18px;font-weight:600">S/100.00</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
        <span style="color:${BRAND.text};font-size:18px">📱 Suscripciones</span>
        <span style="color:${BRAND.text};font-size:18px;font-weight:600">S/363.30</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
        <span style="color:${BRAND.text};font-size:18px">🥘 Alimentación</span>
        <span style="color:${BRAND.text};font-size:18px;font-weight:600">S/187.80</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05)">
        <span style="color:${BRAND.text};font-size:18px">🏠 Mantenimiento</span>
        <span style="color:${BRAND.text};font-size:18px;font-weight:600">S/122.00</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 0 0 0">
        <span style="color:${BRAND.green};font-size:18px;font-weight:700">Total vivienda</span>
        <span style="color:${BRAND.green};font-size:20px;font-weight:800">S/773.10</span>
      </div>
    </div>
    <div class="small" style="text-align:center">Solo escribe: "¿cuánto gasté en vivienda?" — Neto te lo dice al toque.</div>
  </div>`,

  // Slide 5: NLP en acción
  `<div class="slide" style="justify-content:center;gap:16px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">LENGUAJE NATURAL</span></div>
    <div class="title" style="font-size:40px;margin-bottom:4px">Habla normal.<br>Neto entiende.</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="display:flex;justify-content:flex-end">
        <div style="background:${BRAND.green};border-radius:16px 16px 4px 16px;padding:12px 18px;color:#fff;font-size:18px;max-width:75%">"Gasté 50 soles en taxi 🚗"</div>
      </div>
      <div style="display:flex;justify-content:flex-start">
        <div style="background:#161614;border-radius:4px 16px 16px 16px;padding:12px 18px;color:${BRAND.text};font-size:17px;max-width:80%">✓ Registrado: <strong>S/50.00 · Transporte</strong><br><span style="color:${BRAND.text2};font-size:13px">6 abr · 3:22pm</span></div>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:4px">
        <div style="background:${BRAND.green};border-radius:16px 16px 4px 16px;padding:12px 18px;color:#fff;font-size:18px;max-width:75%">"¿Cuánto gasté esta semana?"</div>
      </div>
      <div style="display:flex;justify-content:flex-start">
        <div style="background:#161614;border-radius:4px 16px 16px 16px;padding:12px 18px;color:${BRAND.text};font-size:17px;max-width:80%">📊 <strong>Esta semana:</strong> S/387<br>🍕 Comida S/145 · 🚗 Trans. S/89<br><span style="color:${BRAND.green};font-size:14px;font-weight:600">Llevas 68% del presupuesto mensual</span></div>
      </div>
    </div>
    <div class="small" style="text-align:center">No es un formulario. Es una conversación.</div>
  </div>`,

  // Slide 6: Reporte PDF + Dashboard
  `<div class="slide" style="justify-content:center;gap:16px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">ANÁLISIS COMPLETO</span></div>
    <div class="title" style="font-size:36px;margin-bottom:4px">¿Quieres el análisis<br>completo?</div>
    <div style="display:flex;gap:14px">
      <div style="flex:1;background:#161614;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:10px">
        <div style="font-size:40px">📄</div>
        <div style="color:${BRAND.green};font-size:18px;font-weight:700">Reporte PDF</div>
        <div style="color:${BRAND.text2};font-size:14px;line-height:1.6">Lo pides por WhatsApp. Neto lo genera al instante con gráficos, categorías y tendencias.</div>
        <div style="color:${BRAND.text};font-size:13px;font-weight:600;margin-top:4px">📊 84 transacciones analizadas<br>⏱️ Listo en segundos</div>
      </div>
      <div style="flex:1;background:rgba(29,158,117,0.08);border:1px solid ${BRAND.green};border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:10px">
        <div style="font-size:40px">🖥️</div>
        <div style="color:${BRAND.green};font-size:18px;font-weight:700">Dashboard web</div>
        <div style="color:${BRAND.text2};font-size:14px;line-height:1.6">En app.neto.pe: gráficos en tiempo real, historial, score y metas de ahorro.</div>
        <div style="color:${BRAND.text};font-size:13px;font-weight:600;margin-top:4px">📈 Actualizado en tiempo real<br>📱 También en móvil</div>
      </div>
    </div>
    <div class="small" style="text-align:center">Desde WhatsApp o desde el navegador — tú eliges.</div>
  </div>`,

  // Slide 7: Comparativa vs banco/Yape
  `<div class="slide" style="justify-content:center;gap:14px">
    <div class="header-row"><img src="neto-icon.png" class="logo-sm"><span class="tag">¿POR QUÉ NETO?</span></div>
    <div class="title" style="font-size:34px;margin-bottom:4px">¿Por qué no basta<br>con la app de tu banco?</div>
    <div style="background:#161614;border-radius:20px;padding:20px 24px;display:flex;flex-direction:column;gap:0">
      <div style="display:grid;grid-template-columns:1fr 92px 92px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08)">
        <span></span>
        <span style="color:${BRAND.text2};font-size:12px;font-weight:600;text-align:center">Banco / Yape</span>
        <span style="color:${BRAND.green};font-size:12px;font-weight:600;text-align:center">Neto</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 92px 92px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.04);align-items:center">
        <span style="color:${BRAND.text};font-size:15px">Entiende lenguaje natural</span>
        <span style="text-align:center;font-size:20px">❌</span><span style="text-align:center;font-size:20px">✅</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 92px 92px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.04);align-items:center">
        <span style="color:${BRAND.text};font-size:15px">Funciona con todos tus bancos</span>
        <span style="text-align:center;font-size:20px">❌</span><span style="text-align:center;font-size:20px">✅</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 92px 92px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.04);align-items:center">
        <span style="color:${BRAND.text};font-size:15px">Registra gastos en efectivo</span>
        <span style="text-align:center;font-size:20px">❌</span><span style="text-align:center;font-size:20px">✅</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 92px 92px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.04);align-items:center">
        <span style="color:${BRAND.text};font-size:15px">Presupuestos con alertas</span>
        <span style="text-align:center;font-size:20px">❌</span><span style="text-align:center;font-size:20px">✅</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 92px 92px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.04);align-items:center">
        <span style="color:${BRAND.text};font-size:15px">Resúmenes semanales/mensuales</span>
        <span style="text-align:center;font-size:20px">❌</span><span style="text-align:center;font-size:20px">✅</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 92px 92px;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.04);align-items:center">
        <span style="color:${BRAND.text};font-size:15px">Score financiero mensual</span>
        <span style="text-align:center;font-size:20px">❌</span><span style="text-align:center;font-size:20px">✅</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 92px 92px;padding:11px 0;align-items:center">
        <span style="color:${BRAND.text};font-size:15px">Vive en WhatsApp</span>
        <span style="text-align:center;font-size:20px">❌</span><span style="text-align:center;font-size:20px">✅</span>
      </div>
    </div>
    <div class="small" style="text-align:center">Tu banco ve sus transacciones. Neto ve toda tu realidad financiera.</div>
  </div>`,

  // Slide 8: CTA
  `<div class="slide center">
    <div class="glow"></div>
    <img src="neto-icon.png" class="logo" style="margin-bottom:24px">
    <div class="title" style="font-size:44px">Tu asistente financiero<br>ya está en WhatsApp.</div>
    <div class="subtitle big" style="max-width:700px;margin-top:16px">Empieza gratis. En 2 minutos ya estás registrando tus primeros gastos.</div>
    <div class="btn">Empieza gratis → neto.pe</div>
    <div class="small">WhatsApp +51 933 014 505 · Sin contraseñas bancarias</div>
  </div>`,
];

async function generateCarousel(browser, slides, folder) {
  const carouselDir = join(contentDir, folder);
  mkdirSync(carouselDir, { recursive: true });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1080 });

  for (let i = 0; i < slides.length; i++) {
    const html = baseHTML(slides[i]);
    const tempPath = join(outDir, `temp-slide.html`);
    const { writeFileSync } = await import("fs");
    writeFileSync(tempPath, html);

    await page.goto(`file:///${tempPath.replace(/\\/g, "/")}`);
    await page.waitForTimeout(500); // let fonts load

    const outPath = join(carouselDir, `slide${i + 1}.png`);
    await page.screenshot({ path: outPath, type: "png" });
    console.log(`  ✓ ${folder}/slide${i + 1}.png`);
  }

  await page.close();
}

const CAROUSELS = [
  { name: "🚀 Carrusel #1 — Vortik anuncia Neto", folder: "carousel-01", slides: carousel01 },
  { name: "📊 Carrusel #3 — S/3,500 al mes en Lima", folder: "carousel-03", slides: carousel3 },
  { name: "🙅 Carrusel #5 — ¿Por qué no ahorras?", folder: "carousel-05", slides: carousel5 },
  { name: "📐 Carrusel #7 — La regla 50/30/20 adaptada a Lima", folder: "carousel-07", slides: carousel7 },
  { name: "🐜 Carrusel #8 — Los 5 gastos hormiga", folder: "carousel-08", slides: carousel8 },
  { name: "🛡️ Carrusel #9 — Fondo de emergencia en Perú", folder: "carousel-09", slides: carousel9 },
  { name: "💳 Carrusel #12 — Deudas: cuáles atacar primero", folder: "carousel-12", slides: carousel12 },
  { name: "📊 Carrusel #13 — Abandonas tu Excel", folder: "carousel-13", slides: carousel13 },
  { name: "⚖️ Carrusel #14 — Neto vs Excel", folder: "carousel-14", slides: carousel14 },
  { name: "⏱️ Carrusel #15 — 15 horas perdidas", folder: "carousel-15", slides: carousel15 },
  { name: "⭐ Carrusel #16 — Tu Score Financiero", folder: "carousel-16", slides: carousel16 },
  { name: "💬 Carrusel #17 — Neto desde WhatsApp", folder: "carousel-17", slides: carousel17 },
];

async function main() {
  const browser = await chromium.launch();

  let total = 0;
  for (const c of CAROUSELS) {
    console.log(`\n${c.name} (Playwright)`);
    await generateCarousel(browser, c.slides, c.folder);
    total += c.slides.length;
  }

  await browser.close();

  // Clean up temp file
  const { unlinkSync } = await import("fs");
  try { unlinkSync(join(outDir, "temp-slide.html")); } catch {}

  console.log(`\n✅ ${total} slides generados en ${CAROUSELS.length} carpetas dentro de public/social/`);
}

main().catch(console.error);
