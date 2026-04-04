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
mkdirSync(outDir, { recursive: true });

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

async function generateCarousel(browser, slides, folder) {
  const carouselDir = join(outDir, folder);
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
  { name: "📊 Carrusel #3 — S/3,500 al mes en Lima", folder: "carousel-03", slides: carousel3 },
  { name: "🙅 Carrusel #5 — ¿Por qué no ahorras?", folder: "carousel-05", slides: carousel5 },
  { name: "📐 Carrusel #7 — La regla 50/30/20 adaptada a Lima", folder: "carousel-07", slides: carousel7 },
  { name: "🐜 Carrusel #8 — Los 5 gastos hormiga", folder: "carousel-08", slides: carousel8 },
  { name: "🛡️ Carrusel #9 — Fondo de emergencia en Perú", folder: "carousel-09", slides: carousel9 },
  { name: "💳 Carrusel #12 — Deudas: cuáles atacar primero", folder: "carousel-12", slides: carousel12 },
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
