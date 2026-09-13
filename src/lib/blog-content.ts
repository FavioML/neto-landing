/**
 * Blog article HTML content, keyed by slug.
 * Keeping content in a TS file keeps the static export simple
 * and avoids MDX/remark dependencies.
 */

import { waLink } from "./constants";
import { APPS } from "./apps-comparativa";
import { barras, chatNeto, ejemplo, enCorto, enlaceExterno, nota, tabla } from "./blog-bloques";

// `[blog]`, no `[hero]`: la posición tiene que decir de dónde salió el clic. El origen de la visita
// lo agrega `<HtmlAtribuido>` en cliente, porque este HTML es un string y no pasa por un hook.
const WA_BLOG = waLink("blog");

// Mismo formato y misma hora fija en Lima que la comparativa: "2026-09-11" pelado pasaría por UTC.
const fechaLarga = (dia: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Lima",
  }).format(new Date(`${dia}T09:00:00-05:00`));

const enLista = (items: string[]) =>
  new Intl.ListFormat("es", { style: "long", type: "conjunction" }).format(items);

/*
 * Los precios del post de precios NO se escriben acá: salen de `APPS`, que es también lo que
 * muestra la comparativa. Refrescar un precio allá lo refresca en los dos lados, tabla y gráfica.
 */
const consultas = [...new Set(APPS.flatMap((a) => (a.consultado ? [a.consultado] : [])))].sort();
if (!consultas.length) throw new Error("APPS no trae ninguna fecha de consulta: la tabla de precios quedaría sin fecha");
const fuentesApps = `Precios en la moneda en que los publica cada fuente. Fuentes oficiales${
  consultas.length === 1 ? `, consultadas el ${fechaLarga(consultas[0])}` : ""
}: ${APPS.filter((a) => a.fuentes?.length)
  .map(
    (a) =>
      `${a.name} (${a.fuentes!.map((f) => enlaceExterno(f.nombre, f.url)).join(" · ")}${
        consultas.length > 1 && a.consultado ? `, ${fechaLarga(a.consultado)}` : ""
      })`
  )
  .join("; ")}.`;

const TABLA_PRECIOS = tabla({
  caption: "Precio de cada app según su fuente oficial",
  columnas: ["App", "Sin pagar", "Lo que se paga", "Detalle"],
  filas: APPS.map((app) => {
    const [gratis, pago] = app.precioCorto.split(" · ");
    if (!pago) throw new Error(`${app.name}: precioCorto ya no tiene la forma "gratis · pago"`);
    return [app.name, gratis, pago, app.precio];
  }),
  propia: APPS.findIndex((a) => a.name === "Neto"),
  pie: fuentesApps,
});

/*
 * La gráfica del costo anual. El MONTO no se escribe acá: se lee del `precio` de cada app
 * ("S/ 99.90 al año"), así que la barra y la prosa de la comparativa no pueden separarse. Lo que sí
 * se escribe es qué compra cada plan y por qué queda fuera cada una, que es criterio editorial. Si
 * una app entra o sale de la gráfica sin que alguien lo decida en estos dos mapas, el build falla.
 */
const COMPRA_ANUAL: Record<string, string> = {
  "Money Manager": "Sincronizar entre dispositivos. Quitar los anuncios es otro pago",
  Neto: "Neto Pro: dashboard, historial, score y presupuestos",
  "Wallet by BudgetBakers": "Premium, que incluye sincronizar bancos. Sus fuentes no nombran ninguno peruano",
};
const FUERA_DE_ANUAL: Record<string, string> = {
  Monefy: "no dice a qué período corresponde cada precio",
  Mobills: "publica en reales",
  Spendee: "publica en dólares",
  Fintonic: "no publica precio",
};
const ANUAL_SOLES = /S\/\s?(\d+(?:\.\d{2})?) al año/;
const anuales = APPS.flatMap((app) => {
  const m = app.precio.match(ANUAL_SOLES);
  return m ? [{ app, monto: Number(m[1]), texto: m[0].replace(/ al año$/, "") }] : [];
});
for (const { app } of anuales) {
  if (!COMPRA_ANUAL[app.name]) throw new Error(`${app.name} publica un precio anual en soles y la gráfica no dice qué compra: agrégalo a COMPRA_ANUAL`);
}
for (const nombre of Object.keys(COMPRA_ANUAL)) {
  if (!anuales.some((a) => a.app.name === nombre)) throw new Error(`${nombre} está en COMPRA_ANUAL pero su precio ya no dice "S/… al año"`);
}
for (const app of APPS) {
  if (!anuales.some((a) => a.app === app) && !FUERA_DE_ANUAL[app.name]) {
    throw new Error(`${app.name} quedó fuera de la gráfica anual sin motivo en FUERA_DE_ANUAL`);
  }
}
const consultaAnual = [...new Set(anuales.flatMap((a) => (a.app.consultado ? [a.app.consultado] : [])))].sort().pop();
if (!consultaAnual) throw new Error("la gráfica anual no tiene ninguna fecha de consulta");

const BARRAS_ANUAL = barras({
  titulo: "Un año de plan pagado, en soles",
  items: [...anuales]
    .sort((a, b) => a.monto - b.monto)
    .map(({ app, monto, texto }) => ({
      etiqueta: app.name,
      valor: monto,
      texto,
      detalle: COMPRA_ANUAL[app.name],
      propia: app.name === "Neto",
    })),
  nota: `Solo entran los planes que publican un precio anual en soles. Quedan fuera ${enLista(
    Object.entries(FUERA_DE_ANUAL).map(([nombre, motivo]) => `${nombre} (${motivo})`)
  )}.`,
  fuente: `Fuente: la ficha de cada app en la App Store de Perú y la web de Neto, consultadas el ${fechaLarga(consultaAnual)}.`,
});

// Fuentes de la pieza de Yape y Plin. Cada cifra o dato de terceros de ese post sale de acá.
const YAPE_MOVIMIENTOS = "https://www.yape.com.pe/preguntas-frecuentes/enviar-y-recibir-yapeos/98--como-veo-mis-movimientos";
const YAPE_CORREO = "https://www.yape.com.pe/preguntas-frecuentes/sobre-tu-cuenta-yape/como-recibo-un-correo-de-aviso-cada-vez-que-envie-un-yapeo";
const PLIN = "https://plin.pe/";
const BCRP_INTEROPERABILIDAD = "https://www.bcrp.gob.pe/sistema-de-pagos/interoperabilidad/estrategia-de-interoperabilidad-de-los-pagos-minoristas.html";
const CREDICORP_2T26 = "https://www.sec.gov/Archives/edgar/data/0001001290/000114036126033379/ef20080305_ex99-1.htm";
const CONSULTA_YAPE_PLIN = fechaLarga("2026-09-11");

const TABLA_DONDE_QUEDA = tabla({
  caption: "Dónde queda registrado lo que pagas",
  columnas: ["Pagas con", "Dónde queda", "Qué ves ahí"],
  filas: [
    ["Yape", "En la app de Yape", "Quién te yapeó, a quién yapeaste, la fecha y el monto, con filtros de los últimos 90 días o más. Solo tus yapeos."],
    ["Plin", "En la app de tu banco o caja: Plin no tiene app propia", "Tus plines, en el historial de ese banco."],
    ["Tarjeta", "En el estado de cuenta de tu banco", "Los consumos de esa tarjeta."],
    ["Efectivo", "En ningún lado", "Nada, salvo que lo anotes tú."],
  ],
  pie: `Fuentes: ${enlaceExterno("ayuda oficial de Yape", YAPE_MOVIMIENTOS)} y ${enlaceExterno(
    "web oficial de Plin",
    PLIN
  )}, consultadas el ${CONSULTA_YAPE_PLIN}.`,
});

/*
 * Revisión de los cinco posts de marzo (2026-09-11), con la misma regla que los posts nuevos: cada
 * cifra de terceros lleva fuente y fecha, y lo que no se pudo verificar se borró. Lo que estos posts
 * dicen de Neto (bancos que lee, 30 días de histórico, AES-256-GCM en los tokens de Gmail) sale del
 * código de `neto/app` (`gmail.js`, `services/gmail-scanner.js`, `lib/crypto.js`) a esa fecha.
 */
const INEI_INGRESO_LIMA = "https://www.gob.pe/institucion/inei/noticias/1430813-inei-poblacion-ocupada-aumento-7-7-en-lima-metropolitana-en-el-trimestre-movil-mayo-junio-julio-de-2026";
const SUPABASE_SEGURIDAD = "https://supabase.com/security";
const CONSULTA_REVISION = fechaLarga("2026-09-11");

/*
 * Los dos primeros posts siguen el molde (`docs/molde-blog.md`) y `scripts/check-blog.mjs` los
 * mide; los cinco de marzo todavía no, y el chequeo los declara en su lista LEGADO.
 */
export const articleContent: Record<string, string> = {
  "cuanto-cuesta-app-finanzas-personales-peru": `
${enCorto([
  "<strong>Anotar gastos cuesta S/0</strong> en casi todas las apps de finanzas que se usan en Perú.",
  "Lo que se cobra es lo de encima: reportes, quitar anuncios, sincronizar dispositivos o conectar bancos.",
  "En Neto, registrar es gratis siempre; ver tus números cuesta S/10 al mes o S/99 al año.",
  "Las demás cobran por cosas distintas y en monedas distintas.",
])}
<p>
  Este post lo escribe el equipo de Neto. Por eso los precios de las otras apps son los que cada
  una publica en su web o en la App Store de Perú.
</p>

<h2>Cuánto cuesta cada app</h2>
${TABLA_PRECIOS}

<h2>¿Por qué comparar solo el número engaña?</h2>
<p>
  Porque cada app cobra por una cosa distinta. Tres planes anuales en soles terminan casi en el
  mismo número y compran cosas que no se parecen:
</p>
${BARRAS_ANUAL}
<p>
  Money Manager cobra una vez por quitar los anuncios y aparte por sincronizar tus dispositivos. En
  Wallet se paga Premium, aunque ninguna de sus páginas oficiales nombra un banco peruano. Spendee y
  Mobills publican en dólares y en reales, y el cobro en soles lo ves recién en la App Store.
</p>
<p>
  Neto no cobra por anotar ni por la cantidad de gastos. Lo que se paga es consultarlos: el
  dashboard con gráficos, el historial completo, el score financiero, los presupuestos y los
  reportes. Qué hace cada app además del precio está en la
  <a href="/comparativas/apps-finanzas-peru">comparativa de apps de finanzas personales en Perú</a>.
</p>

<h2>Así se ve lo gratis y lo que se paga</h2>
<p>
  Esto contesta Neto cuando terminó tu prueba y no activaste Pro. Anotar sigue funcionando; pedir
  tu resumen, no.
</p>
${chatNeto("prueba-terminada")}

<h2>¿Vale la pena pagar?</h2>
<p>
  No pagues por ninguna app de finanzas antes de usarla dos o tres semanas seguidas. Si en ese
  tiempo no la abriste, la versión completa no te va a ordenar la plata. Una suscripción que no
  usas es otro gasto hormiga, como los que explicamos en
  <a href="/blog/gastos-hormiga-peru">cómo los gastos hormiga se comen tu sueldo</a>.
</p>
<p>
  Si ya anotas y te falta entender en qué se va la plata, ahí sí conviene pagar por el análisis.
</p>
${nota(
  "dato",
  "Si no quieres pagar nada",
  "<p>Una hoja de Excel o de Google Sheets sigue siendo gratis. El costo es tu tiempo, porque todo lo categorizas y lo sumas a mano.</p>"
)}

<h2>Cómo probar Neto sin pagar</h2>
<p>
  Tu primer gasto activa 14 días de Neto Pro: gráficos, categorías, reportes e historial completo.
  Después sigues anotando gratis, o activas Pro por S/10 al mes o S/99 al año. Se paga por Yape y
  no se renueva solo, así que no hay cobro sorpresa.
</p>
<p>
  Para empezar, <a href="${WA_BLOG}">escríbele a Neto por WhatsApp</a> y anota tu primer gasto
  («almuerzo 18») o mándale la captura de un yapeo.
</p>
`,

  "controlar-gastos-yape-plin": `
${enCorto([
  "<strong>Junta todos tus pagos en un solo lugar y anótalos en el momento en que pagas.</strong>",
  "Yape guarda tus yapeos y cada banco tus plines, pero ninguna ve lo que pagas en las otras.",
  "Con Neto le reenvías la captura del pago por WhatsApp y lo anota con su categoría.",
  "Una vez por semana, compáralo con tu historial de Yape.",
])}

<h2>¿Dónde queda cada pago?</h2>
<p>Cada forma de pago deja su rastro en un lugar distinto, y ninguno junta a los demás.</p>
${TABLA_DONDE_QUEDA}
<p>
  Desde marzo de 2023, además, Yape y Plin se pagan entre sí, porque el Banco Central de Reserva del
  Perú los hizo interoperables (${enlaceExterno("BCRP", BCRP_INTEROPERABILIDAD)}). Es cómodo, pero el
  mismo tipo de gasto puede terminar en una app o en la otra según cuál tenías a la mano.
</p>
<p>
  No es un problema de pocos. Yape tenía 16,7 millones de usuarios activos al mes al cierre de junio
  de 2026, según el ${enlaceExterno("reporte 2T26 de Credicorp", CREDICORP_2T26)}, el grupo dueño
  del BCP.
</p>
<p><small>Fuentes consultadas el ${CONSULTA_YAPE_PLIN}.</small></p>

<h2>Cómo controlarlo en cinco pasos</h2>
<ol>
  <li>
    <strong>Elige un solo lugar donde vive todo.</strong> Un Excel, una app o Neto. Lo que no
    funciona es la mitad en Yape, la otra mitad en el banco y el efectivo en tu cabeza.
  </li>
  <li>
    <strong>Anota en el momento en que pagas.</strong> La pantalla final del pago ya trae el monto,
    a quién le pagaste y la fecha. Lo que pagas en efectivo lo escribes («taxi 12»).
  </li>
  <li>
    <strong>Separa lo que no es gasto.</strong> Pasar plata entre tus propias cuentas no se anota.
    Si le prestaste a alguien, anótalo como deuda entre personas y no como gasto.
  </li>
  <li>
    <strong>Ponle un tope a tus categorías.</strong> Con dos semanas anotadas ya ves en qué se va
    más. En Neto Pro puedes poner un presupuesto por categoría, y Neto te avisa por WhatsApp
    cuando te acercas al límite.
  </li>
  <li>
    <strong>Revisa una vez por semana.</strong> Compara lo que anotaste con los movimientos de Yape
    y agrega el yapeo que se te olvidó mandar.
  </li>
</ol>

<h2>Así lo anota Neto</h2>
<p>Le reenvías la captura del yapeo por WhatsApp y te contesta con lo que anotó:</p>
${chatNeto("captura-yapeo")}
<p>Si el yapeo te lo hicieron a ti, lo registra como ingreso.</p>
${nota(
  "ojo",
  "Lo que Neto no hace",
  "<p>Neto no se conecta a Yape, a Plin ni a ningún banco, y no te pide contraseñas. Un yapeo que no le reenviaste no existe para Neto, por eso importa la revisión semanal del paso 5.</p>"
)}
<p>
  Yape también puede avisarte por correo de los yapeos que envías, desde el mínimo que elijas:
  S/10, S/50, S/100 o S/500 (${enlaceExterno("ayuda oficial de Yape", YAPE_CORREO)}). Sirve como
  recordatorio, pero no te arma el total por categoría.
</p>

<h2>¿Y si prefiero otra herramienta?</h2>
<p>
  Los cinco pasos sirven igual con un Excel o con cualquier app: importa el lugar único y anotar al
  pagar. Qué hace cada app está en la
  <a href="/comparativas/apps-finanzas-peru">comparativa de apps de finanzas personales en Perú</a>,
  y cuánto cuesta cada una, en <a href="/blog/cuanto-cuesta-app-finanzas-personales-peru">el post de
  precios</a>.
</p>
<p>
  Si quieres probar con Neto, <a href="${WA_BLOG}">escríbele por WhatsApp</a> y mándale la captura
  de tu último yapeo. Anotar es gratis siempre.
</p>
`,

  "gastos-hormiga-peru": `
${enCorto([
  "<strong>Un gasto hormiga es chico y frecuente:</strong> no se siente al pagarlo, pero sumado a fin de mes pesa.",
  "Cuatro de esos, repetidos durante un mes, suman más de lo que parece: abajo va la cuenta.",
  "Para saber cuánto se llevan los tuyos, hay que anotarlos.",
  "Después se decide cuáles quedan y se les pone un tope.",
])}
<p>
  El café, el taxi corto, el snack de la tarde. Ninguno duele solo. Esta es la cuenta con montos
  inventados: cambia cada uno por el tuyo y la cuenta funciona igual.
</p>
${ejemplo({
  titulo: "Cuatro gastos chicos durante un mes",
  columnas: { unitario: "Cada vez", veces: "Veces al mes", resultado: "Al mes" },
  filas: [
    { concepto: "Café, cada día hábil", unitario: 8, veces: 22, resultado: 176 },
    { concepto: "Delivery, dos por semana", unitario: 35, veces: 8, resultado: 280 },
    { concepto: "Taxi corto, tres por semana", unitario: 12, veces: 12, resultado: 144 },
    { concepto: "Snack, cada día hábil", unitario: 5, veces: 22, resultado: 110 },
  ],
  total: 710,
  anual: 8520,
  etiquetas: { total: "Total del mes" },
  como: "barras",
})}
<p>
  Para ponerlo en escala, compáralo con lo que se gana en Lima. Según el INEI, el ingreso promedio
  mensual por trabajo en Lima Metropolitana fue de S/2,312.6 entre mayo y julio de 2026
  (${enlaceExterno("INEI", INEI_INGRESO_LIMA)}, consultado el ${CONSULTA_REVISION}). Con ese
  ingreso, el total del ejemplo sería cerca del 31% de lo que entra en el mes.
</p>

<h2>¿Por qué no los notas?</h2>
<p>
  Los gastos grandes, como el alquiler o un pasaje, los piensas antes de hacerlos. Los chicos se
  aprueban solos. Y como cada uno se paga por un medio distinto (un yapeo, la tarjeta, un billete),
  no queda un lugar donde se vean juntos.
</p>

<h2>¿Cuáles revisar primero?</h2>
<p>No hay un ranking oficial de gastos hormiga en Perú. Estos se repiten muchas veces en un mes:</p>
${tabla({
  caption: "Dónde se esconden los gastos hormiga",
  columnas: ["Gasto", "Por qué se escapa", "Qué mirar"],
  filas: [
    ["Delivery", "Al plato se suman el envío y la propina", "El total que pagaste, no el precio del menú"],
    ["Café y antojos", "Es de lo que más veces se repite", "Cuántas veces fue en el mes"],
    ["Taxis cortos", "Se toman «porque es tarde» y no se cuentan", "Cuántos tomaste, no si fue caro"],
    ["Suscripciones", "Se cobran solas cada mes", "Cuáles pagas y cuáles abriste"],
    ["Compras de impulso", "Van en la caja del supermercado", "Cuántas veces por semana"],
  ],
})}
<p>
  Las suscripciones son las más traicioneras, porque no decides nada para que se cobren. En Neto
  Pro, las que reconoce entre tus gastos anotados (Netflix, Disney+, Max y otras de su catálogo)
  aparecen juntas, con cuánto suman al mes.
</p>

<h2>Cómo controlarlos, paso a paso</h2>
<ol>
  <li>
    <strong>Hazlos visibles.</strong> Como son justo los que no anotas, lo que funciona es que
    anotar casi no cueste. A Neto le escribes por WhatsApp «café 8» o le mandas la captura del
    yapeo, y él lo categoriza y lo suma.
  </li>
  <li>
    <strong>Mira sin juzgar.</strong> Con dos semanas anotadas aparecen los patrones, del tipo «se me
    va más en delivery de lo que creía». Cambiar viene después.
  </li>
  <li>
    <strong>Decide, no elimines.</strong> Tal vez el café diario vale la pena para ti y el delivery
    tres veces por semana no. Lo que importa es que sea tu decisión.
  </li>
  <li>
    <strong>Ponle un tope a cada categoría.</strong> En Neto Pro puedes poner un presupuesto mensual
    por categoría, y al anotar un gasto te dice cuánto llevas si ya pasaste el aviso.
  </li>
</ol>
${chatNeto("tope-categoria")}
<p>
  Para empezar, <a href="${WA_BLOG}">escríbele a Neto por WhatsApp</a> tu próximo gasto chico.
  Anotar es gratis siempre.
</p>

<h2>¿Cuánto suma bajarlos un poco?</h2>
<p>No hace falta dejarlos todos. Esto junta un recorte parejo, sin contar intereses:</p>
${ejemplo({
  titulo: "Un recorte parejo, acumulado",
  columnas: { unitario: "Al mes", veces: "Meses", resultado: "Acumulado" },
  filas: [
    { concepto: "Un trimestre", unitario: 200, veces: 3, resultado: 600 },
    { concepto: "Medio año", unitario: 200, veces: 6, resultado: 1200 },
    { concepto: "Un año", unitario: 200, veces: 12, resultado: 2400 },
    { concepto: "Tres años", unitario: 200, veces: 36, resultado: 7200 },
  ],
})}
${nota(
  "ojo",
  "Lo que suele fallar",
  "<p>Cortar todo de golpe, que casi nunca se sostiene. Trabajar con un «más o menos gasto tanto», que no sirve para decidir. Y esperar que un sueldo más alto lo arregle: al subir el ingreso suelen subir también los gastos chicos.</p>"
)}
<p>
  Si quieres ordenar todos tus gastos y no solo los chicos, sigue con la
  <a href="/blog/como-controlar-gastos-personales-peru">guía para controlar tus gastos personales en Perú</a>.
</p>
`,

  "como-controlar-gastos-personales-peru": `
${enCorto([
  "<strong>Primero junta en un solo lugar lo que pagas con Yape, Plin, tarjeta y efectivo</strong>, y anótalo cuando pagas.",
  "Con un mes de datos eliges un método: 50/30/20, topes por categoría, presupuesto cero o quitar tres gastos.",
  "Cualquiera sirve mientras anotar te cueste poco. Lo que hace fallar a casi todos es dejar de anotar.",
])}
<p>Abajo va cada método con una cuenta de ejemplo en soles, y un plan de 30 días para empezar.</p>
${tabla({
  caption: "Los cuatro métodos, de un vistazo",
  columnas: ["Método", "Cómo funciona", "Te sirve si"],
  filas: [
    ["50/30/20", "Divides el sueldo en necesidades, gustos y ahorro", "Quieres un marco simple para decidir"],
    ["Topes por categoría", "Cada categoría tiene un máximo al mes", "No quieres revisar cada gasto"],
    ["Presupuesto cero", "Cada sol tiene destino antes de que empiece el mes", "Quieres el mayor control y tienes tiempo para planificar"],
    ["Quitar tres gastos", "Eliges tres gastos que casi no usas y los cortas", "Todavía no quieres porcentajes ni categorías"],
  ],
})}

<h2>Primero: ¿dónde está tu plata?</h2>
<p>
  Yape para el almuerzo, tarjeta para el supermercado, efectivo para el taxi, Plin para el fin de
  semana. Cada medio guarda su propio historial y ninguno te muestra el total junto ni por
  categoría. Por eso el primer paso no es disciplina, es ver. Si no sabes por dónde empezar,
  <a href="/blog/en-que-gasto-mi-plata">aquí explicamos cómo averiguar a dónde va tu plata</a>.
</p>

<h2>Método 1: la regla 50/30/20</h2>
<p>Divides lo que ganas en tres partes: necesidades, gustos, y ahorro con deudas. Así queda con un sueldo de ejemplo:</p>
${ejemplo({
  titulo: "Un sueldo repartido en 50/30/20",
  base: { concepto: "Sueldo del ejemplo", monto: 3000 },
  filas: [
    {
      concepto: "Necesidades",
      pct: 50,
      resultado: 1500,
      partes: [
        { concepto: "alquiler", monto: 800 },
        { concepto: "comida", monto: 400 },
        { concepto: "servicios", monto: 200 },
        { concepto: "transporte", monto: 100 },
      ],
    },
    {
      concepto: "Gustos",
      pct: 30,
      resultado: 900,
      partes: [
        { concepto: "salidas", monto: 300 },
        { concepto: "delivery", monto: 200 },
        { concepto: "ropa", monto: 200 },
        { concepto: "suscripciones", monto: 200 },
      ],
    },
    {
      concepto: "Ahorro y deudas",
      pct: 20,
      resultado: 600,
      partes: [
        { concepto: "fondo de emergencia", monto: 300 },
        { concepto: "pago de deuda", monto: 300 },
      ],
    },
  ],
  total: 3000,
})}
<p>
  <strong>¿Y si no te alcanza?</strong> Si el alquiler solo ya se come casi toda la parte de
  necesidades, mueve los porcentajes. Lo que importa es separar necesidades, gustos y ahorro, no la
  cifra exacta.
</p>

<h2>Método 2: topes por categoría</h2>
<p>
  Agrupas tus gastos en categorías y le pones un máximo mensual a cada una. No revisas cada
  transacción: solo miras si te pasaste en alguna. Las que más sirven son comida en casa, comida
  fuera y delivery, transporte, entretenimiento, ropa, servicios del hogar, salud y ahorro.
</p>
<p>
  El truco es tratar el ahorro como un gasto fijo. Sepáralo el primer día del mes, igual que el
  alquiler, porque «lo que sobra» casi nunca sobra.
</p>

<h2>Método 3: el presupuesto cero</h2>
<p>
  Asignas cada sol del sueldo a una categoría antes de que empiece el mes, incluido el ahorro. No
  significa gastarlo todo: significa que nada queda sin destino.
</p>
${ejemplo({
  titulo: "Cada sol con destino",
  base: { concepto: "Sueldo del ejemplo", monto: 3000 },
  filas: [
    { concepto: "Alquiler", resultado: 900 },
    { concepto: "Comida en casa", resultado: 400 },
    { concepto: "Transporte", resultado: 200 },
    { concepto: "Servicios", resultado: 200 },
    { concepto: "Delivery y salidas", resultado: 200 },
    { concepto: "Ropa", resultado: 100 },
    { concepto: "Entretenimiento", resultado: 150 },
    { concepto: "Fondo de emergencia", resultado: 300 },
    { concepto: "Pago de deuda", resultado: 250 },
    { concepto: "Ahorro para una meta", resultado: 300 },
  ],
  total: 3000,
  etiquetas: { total: "Asignado" },
})}
<p>Pide más trabajo al inicio, pero es el método que más control te da sobre el mes.</p>

<h2>Método 4: quitar tres gastos</h2>
<p>
  Si todavía no quieres porcentajes ni categorías, revisa tu estado de cuenta del último mes, elige
  tres gastos recurrentes que casi no usas y quítalos. Una plataforma de streaming de más, el
  delivery de tres veces por semana, el café de cadena de todos los días. Anota cuánto te ahorró
  cada uno el primer mes.
</p>

<h2>¿Por qué casi todos dejan de anotar?</h2>
<p>
  Porque anotar cuesta. Ninguna de las siete apps de nuestra
  <a href="/comparativas/apps-finanzas-peru">comparativa de apps de finanzas en Perú</a> se
  sincroniza con bancos peruanos, según sus propias fuentes oficiales. Todas dependen de que
  registres, y lo que cambia es cuánto esfuerzo pide cada registro.
</p>
<p>
  Neto apuesta por el canal que ya tienes abierto. Le <a href="${WA_BLOG}">escribes el gasto por
  WhatsApp</a> en una línea o le mandas la captura del yapeo, y lo categoriza con IA.
</p>
${chatNeto("captura-yapeo")}
<p>
  Anotar es gratis siempre; los resúmenes y el dashboard son de Neto Pro. En Pro también puedes
  conectar tu Gmail para que los gastos que el banco te notifica por correo los anote Neto por ti.
  Es opcional y complementa lo que escribes, no lo reemplaza. Qué bancos lee está en
  <a href="/blog/bancos-peru-rastrear-sin-contrasena">qué bancos lee Neto sin tu contraseña</a>.
</p>

<h2>Plan de 30 días</h2>
<ol>
  <li><strong>Día 1:</strong> anota tu primer gasto en Neto, o mándale la captura de un yapeo.</li>
  <li><strong>Días 2 a 7:</strong> anota todo y solo observa, sin juzgar ni cambiar nada.</li>
  <li><strong>Semana 2:</strong> mira tus tres categorías más altas y elige una para bajar.</li>
  <li><strong>Semana 3:</strong> ponle un tope a esa categoría. En Neto Pro, Neto te avisa cuando te acercas.</li>
  <li><strong>Semana 4:</strong> revisa qué funcionó y ajusta el mes siguiente.</li>
</ol>
${nota(
  "ojo",
  "Lo que suele fallar",
  "<p>Cambiarlo todo de golpe, que genera rebote. No contar el efectivo, que no queda en ningún historial: si no puedes anotar cada gasto, anota los grandes una vez por semana. Y olvidar los irregulares, como un cumpleaños o la reparación del celular. Una categoría «extras» con un monto chico evita la sorpresa.</p>"
)}
<p>
  Antes de pagar por una herramienta, comprueba que la usas. El precio de cada app, con su fuente
  oficial, está en <a href="/blog/cuanto-cuesta-app-finanzas-personales-peru">cuánto cuesta una app
  de finanzas personales</a>.
</p>
`,

  "en-que-gasto-mi-plata": `
<p>
  <strong>Para saber en qué gastas tu plata necesitas juntar todos tus movimientos en un solo lugar
  y sumarlos por categoría.</strong> Tu banco, Yape y tu tarjeta guardan cada uno su parte, y el
  efectivo no queda en ningún lado. Puedes hacerlo a mano con tus estados de cuenta y una hoja de
  cálculo, o anotando cada gasto cuando pagas, por ejemplo en Neto por WhatsApp.
</p>

<h2>El problema: no sabes a dónde va tu sueldo</h2>
<p>
  Cobras el 15 o el 30. Pagas alquiler, servicios, alguna deuda. Y de repente es día 20 y ya no
  tienes plata. ¿En qué se fue?
</p>
<p>
  Si no puedes responder con exactitud, no es falta de interés: es que no hay un lugar donde se vea
  todo junto. Tu banco muestra sus movimientos, Yape los suyos, y ninguno te arma la foto completa
  por categoría.
</p>

<h2>Por qué es tan difícil rastrear tus gastos</h2>
<ul>
  <li>
    <strong>Varios medios de pago:</strong> Yape, débito, crédito, Plin, efectivo. Cada uno tiene su
    historial y ninguno ve a los otros.
  </li>
  <li>
    <strong>Anotar cansa:</strong> si registrar un gasto te pide abrir una app y llenar un
    formulario, tarde o temprano lo dejas.
  </li>
  <li>
    <strong>El estado de cuenta no habla claro:</strong> dice «POS WONG 12345» o «TRANSF YAPE», no
    «comida» ni «transporte». Traducirlo es trabajo.
  </li>
  <li>
    <strong>El efectivo es invisible:</strong> lo que pagas con billetes no deja rastro en ningún
    sistema, a menos que lo anotes.
  </li>
</ul>

<h2>Cinco categorías que conviene revisar primero</h2>
<p>
  No tenemos un promedio confiable de cuánto gasta un peruano en cada una, así que no te vamos a dar
  uno. Lo que sí podemos decirte es dónde mirar primero, porque son gastos que se repiten y que se
  suelen subestimar:
</p>
<ol>
  <li><strong>Delivery y comida fuera.</strong> Suma el envío y la propina al precio del plato.</li>
  <li><strong>Transporte.</strong> Los taxis «porque es tarde» se mezclan con el transporte de todos los días.</li>
  <li><strong>Suscripciones digitales.</strong> Se cobran solas: revisa cuántas pagas y cuántas usas.</li>
  <li><strong>Compras chicas e impulsivas.</strong> Las de pocos soles que parecen no contar. Son los <a href="/blog/gastos-hormiga-peru">gastos hormiga</a>.</li>
  <li><strong>Salidas.</strong> Una salida «tranquila» con amigos suele costar más de lo planeado.</li>
</ol>

<h2>Cómo lo hace Neto</h2>
<p>
  <a href="/">Neto</a> vive en el WhatsApp que ya tienes abierto: le escribes el gasto en una línea
  («almuerzo 18») o le mandas la foto del voucher o la captura del yapeo, y él lo categoriza con IA
  (comida, transporte, entretenimiento, servicios...). Sin descargar apps.
</p>
<p>
  Y en <strong>Neto Pro</strong>, si conectas tu Gmail, los gastos que el banco ya te notifica por
  correo los anota Neto por ti. Es opcional y va encima de lo que escribes, no en su lugar, porque
  no todos los pagos generan un correo: Yape, por ejemplo, te avisa por correo de los yapeos que
  envías solo si activas ese aviso, según su
  <a href="${YAPE_CORREO}" target="_blank" rel="noopener noreferrer nofollow">ayuda oficial</a>.
</p>
<p>
  ¿Quieres saber qué bancos lee y cómo? Lee
  <a href="/blog/bancos-peru-rastrear-sin-contrasena">qué bancos lee Neto sin pedirte contraseñas</a>.
</p>
<p><small>Fuente consultada el ${CONSULTA_REVISION}.</small></p>

<h2>Cómo funciona en 3 pasos</h2>
<ol>
  <li>
    <strong>Escríbele a Neto por WhatsApp.</strong> Un «Hola» al +51 933 014 505 y Neto te guía
    paso a paso.
  </li>
  <li>
    <strong>Anota cada gasto cuando pagas.</strong> Un mensaje o una captura. Registrar es gratis
    siempre.
  </li>
  <li>
    <strong>Mira tus gastos ordenados.</strong> Cuando registras tu primer gasto se activan 14 días
    de Neto Pro: tus gastos por categoría en el dashboard web y un resumen cada semana. Después, ver
    tus números es de Neto Pro (S/10 al mes o S/99 al año); anotar sigue siendo gratis.
  </li>
</ol>

<h2>¿Qué ves exactamente?</h2>
<p>
  El resumen semanal te dice cuánto gastaste en la semana, cuáles fueron tus categorías más altas y
  si gastaste más o menos que la semana anterior. En el dashboard web tienes además gráficos, el
  historial de tus movimientos y tu
  <a href="/score-financiero">score de salud financiera de 0 a 100</a>.
</p>
<p>
  Todo sale de lo que anotaste. Un gasto que no le mandaste a Neto no está en el resumen, así que
  vale la pena comparar de vez en cuando con tu estado de cuenta.
</p>

<h2>Cómo analizar tu estado de cuenta paso a paso</h2>
<p>
  Si prefieres empezar por tu cuenta antes de usar Neto, este es el proceso manual:
</p>
<ol>
  <li>
    <strong>Descarga los movimientos del mes:</strong> de cada banco y cada tarjeta, desde su app o
    su web. Yape te deja enviar tu lista de movimientos a tu correo, según su
    <a href="${YAPE_MOVIMIENTOS}" target="_blank" rel="noopener noreferrer nofollow">ayuda oficial</a>.
  </li>
  <li>
    <strong>Lista todas las transacciones en una sola tabla:</strong> fecha, comercio, monto y medio
    de pago. Excel o Google Sheets alcanzan.
  </li>
  <li>
    <strong>Asigna una categoría a cada transacción:</strong> comida, transporte, entretenimiento,
    salud, servicios. Las primeras veces toma tiempo. Con Neto, la categoría la pone él.
  </li>
  <li>
    <strong>Suma por categoría:</strong> ¿cuánto fue a comida? ¿A transporte? ¿A ocio? Los totales
    dicen mucho.
  </li>
  <li>
    <strong>Compara con tu ingreso neto:</strong> ¿qué porcentaje de tu sueldo fue a cada categoría?
    ¿Cuánto te sobró o te faltó?
  </li>
</ol>
<p>
  La primera vez toma su tiempo. Con Neto, sumar y categorizar lo hace él; lo que te toca es anotar.
</p>

<h2>El truco del «presupuesto asignado»</h2>
<p>
  Una vez que sabes en qué gastas, el paso siguiente es decidir en qué <em>quieres</em> gastar:
</p>
<ol>
  <li>Al inicio de cada mes, asigna un monto a cada categoría según tus datos reales del mes anterior.</li>
  <li>Define qué categorías quieres reducir y en cuánto.</li>
  <li>Durante el mes, revisa si te estás pasando en alguna.</li>
</ol>
<p>
  El objetivo no es restringirte, es <strong>gastar con intención</strong>. Gastar S/350 en
  delivery sabiéndolo y aceptándolo es muy distinto a gastar S/350 sin darte cuenta.
</p>

<h2>¿Qué hacer cuando encuentras un gasto que no recuerdas?</h2>
<p>
  Pasa más seguido de lo que crees. Revisas tu estado de cuenta y hay cargos que no reconoces.
  Antes de asustarte:
</p>
<ul>
  <li>
    <strong>Revisa si es un cargo recurrente:</strong> suscripciones, seguros, planes de telefonía.
    Muchos cargos son legítimos pero olvidados.
  </li>
  <li>
    <strong>Busca el nombre del comercio en Google:</strong> muchas veces un código raro es el
    nombre técnico de un servicio conocido.
  </li>
  <li>
    <strong>Si no lo reconoces después de buscar:</strong> llama a tu banco. Puede ser un cargo
    duplicado, un error o, en casos raros, fraude.
  </li>
</ul>
<p>
  En Neto Pro, las suscripciones que reconoce entre tus gastos anotados (Netflix, Disney+, Max y
  otras de su catálogo) aparecen juntas, con cuánto pagas al mes.
</p>

<h2>¿Es seguro conectar tu Gmail a Neto?</h2>
<p>
  Conectar Gmail es opcional y solo existe en Neto Pro. Neto <strong>nunca accede a tu banca en
  línea</strong> ni te pide usuario o contraseña bancaria: lee los correos de notificación que tu
  banco ya te envía, los mismos que te llegarían aunque no usaras Neto.
</p>
<p>
  La conexión se hace con OAuth de Google desde tu panel en la web de Neto. El permiso que Google te
  pide aprobar es de solo lectura sobre tu correo: Neto no puede enviar, borrar ni modificar nada.
  Qué correos abre lo limita el código de Neto, que busca solo los de remitentes de bancos y
  billeteras y algunas frases típicas de sus notificaciones, y descarta los que no son un
  movimiento.
</p>
<p>
  Puedes quitar el acceso cuando quieras desde
  <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>.
</p>

<h2>Preguntas frecuentes</h2>

<h3>¿Cuánto tiempo demora ver mi primer resumen?</h3>
<p>
  Anotar el primer gasto es un mensaje. El resumen se arma con lo que vas anotando, así que la foto
  útil aparece después de unos días de registrar todo.
</p>

<h3>¿Qué pasa con los gastos en efectivo?</h3>
<p>
  No dejan rastro en ningún banco ni correo, así que se los escribes a Neto por WhatsApp: «Gasté
  S/30 en el mercado». Neto lo registra y lo incluye en tu resumen.
</p>

<h3>¿Puedo ver gastos de meses anteriores?</h3>
<p>
  Neto parte de lo que anotas desde el primer día. Si tienes Neto Pro y conectas tu Gmail, al
  conectarlo importa los correos de notificación bancaria de los últimos 30 días (hasta 50
  correos). Y en Pro también puedes mandarle por WhatsApp un Excel o un CSV con movimientos
  anteriores.
</p>
`,

  "bancos-peru-rastrear-sin-contrasena": `
<p>
  <strong>Neto no se conecta a tu banco ni te pide su contraseña.</strong> Lo que sí puede hacer, si
  tienes Neto Pro y conectas tu Gmail, es leer los correos de notificación que tu banco o billetera
  ya te manda cuando pagas, y anotar esos movimientos por ti. Es opcional y es un complemento: la
  mayor parte de tus gastos igual los anotas tú, con un mensaje o la captura del pago por WhatsApp.
  Abajo va qué bancos lee, qué no puede ver y cómo quitarle el acceso.
</p>

<h2>¿Cómo lee tus movimientos sin tu contraseña?</h2>
<p>
  La pregunta que más nos hacen es: «¿cómo leen mi banco sin mi contraseña?». La respuesta es
  simple: <strong>no leemos tu banco, leemos tu correo</strong>, y solo si tú lo conectas.
</p>
<p>
  Muchos bancos te mandan un correo cuando haces una compra con tarjeta, una transferencia o un
  pago de servicio, según las notificaciones que tengas activadas. Neto lee esos correos, saca el
  monto, el comercio y la fecha, y los categoriza con IA. <strong>Cero acceso a tu banca en línea,
  cero contraseñas bancarias.</strong>
</p>

<h2>Pedir tu contraseña vs leer tus notificaciones</h2>
<p>
  Hay dos formas de que una app vea tus movimientos sin que los anotes, y el riesgo no se parece:
</p>
<h3>Pedirte usuario y clave (screen scraping)</h3>
<p>
  Algunas apps te piden tu usuario y clave del banco, entran simulando ser tú y copian lo que ven en
  pantalla. El problema es que le entregas tus credenciales a un tercero: si esa app sufre una
  filtración, lo que se filtra es la llave de tu cuenta. Y haber compartido tu clave puede
  complicarte un reclamo si algo sale mal, así que revisa las condiciones de tu banco antes.
</p>
<h3>Leer los correos que ya recibes (lo que hace Neto)</h3>
<ul>
  <li><strong>Sin credenciales bancarias:</strong> Neto nunca te pide usuario ni clave del banco.</li>
  <li><strong>Lo autorizas tú:</strong> das permiso con OAuth de Google, y Google te muestra qué permiso das antes de aprobarlo.</li>
  <li><strong>Revocable:</strong> puedes quitar el acceso cuando quieras desde tu cuenta de Google.</li>
  <li><strong>Solo lectura:</strong> Neto no puede enviar, borrar ni modificar correos, ni hacer ninguna operación en tu banco.</li>
</ul>

<h2>Bancos y billeteras cuyos correos lee Neto</h2>
<p>
  Esta es la lista de remitentes de notificación que Neto busca en tu Gmail, tomada de su código el
  ${CONSULTA_REVISION}. Que tu banco esté aquí no garantiza que te llegue un correo por cada
  movimiento: eso depende de las notificaciones que tengas activadas en tu banco o billetera.
</p>

<h3>Bancos</h3>
<ul>
  <li>BCP (Banco de Crédito del Perú)</li>
  <li>BBVA Perú</li>
  <li>Interbank</li>
  <li>Scotiabank Perú</li>
  <li>BanBif</li>
  <li>Banco Falabella</li>
  <li>Banco Ripley</li>
  <li>Mibanco</li>
</ul>

<h3>Billeteras digitales</h3>
<ul>
  <li>
    <strong>Yape.</strong> Yape te manda un correo por los yapeos que envías si activas ese aviso, a
    partir de un monto mínimo que eliges entre S/10, S/50, S/100 y S/500
    (<a href="${YAPE_CORREO}" target="_blank" rel="noopener noreferrer nofollow">ayuda oficial de
    Yape</a>). Ese aviso es por los que envías; para los yapeos que recibes, mándale a Neto la
    captura por WhatsApp y lo registra como ingreso.
  </li>
  <li>
    <strong>Plin.</strong> Neto lee los avisos de Plin que te lleguen por correo. Si no te llegan, la
    captura del plin por WhatsApp funciona igual.
  </li>
</ul>

<h3>Cajas municipales</h3>
<ul>
  <li>Caja Huancayo, Caja Piura, Caja Trujillo, Caja Cusco, Caja Ica y Caja Sullana</li>
</ul>

<h2>¿Tu banco no está en la lista?</h2>
<p>
  Escríbenos a <a href="mailto:hola@neto.pe">hola@neto.pe</a> con el nombre de tu banco y, si
  puedes, un ejemplo del correo de notificación que te manda (tapa tus datos). Agregar un banco
  requiere revisar cómo son sus correos, así que no te prometemos un plazo. Mientras tanto, los
  gastos de ese banco los anotas por WhatsApp con un mensaje o la captura.
</p>

<h2>¿Qué NO puede ver ni hacer Neto?</h2>
<ul>
  <li><strong>Tu contraseña o clave del banco:</strong> nunca la pedimos ni la necesitamos.</li>
  <li><strong>Tu banca en línea:</strong> Neto no entra a tu banco, así que no consulta tu saldo ni puede hacer transferencias o pagos.</li>
  <li><strong>Tu clave de Yape, tu PIN o tus datos biométricos:</strong> no tenemos acceso a ninguna autenticación de tu banco o billetera.</li>
  <li><strong>Tus correos personales o de trabajo:</strong> Neto busca solo los correos de los remitentes de la lista y algunas frases típicas de notificaciones bancarias, y descarta lo que no es un movimiento.</li>
</ul>

<h2>Cómo funciona la conexión</h2>
<ol>
  <li>Activas Neto Pro. Conectar Gmail es la única función de Pro que no está en la prueba de 14 días: se habilita cuando pagas.</li>
  <li>Desde tu panel Pro en la web de Neto eliges qué bancos quieres que lea y conectas tu Gmail.</li>
  <li>Google te muestra el permiso que estás dando: ver tus correos, sin poder enviarlos, borrarlos ni modificarlos. Tú apruebas, y Google le da a Neto un acceso limitado, nunca tu contraseña.</li>
  <li>Al conectarlo, Neto importa los movimientos de los correos de notificación de los últimos 30 días (hasta 50 correos), y después revisa los nuevos cada cierto tiempo.</li>
</ol>
<p>
  Cada cuenta de Neto admite un solo Gmail. Puedes revocar el acceso cuando quieras desde
  <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>,
  y desde ese momento Neto no puede leer correos nuevos.
</p>

<h2>¿Qué pasa si cambio de banco o de correo?</h2>
<p>
  <strong>Cambio de banco:</strong> si el banco nuevo está en la lista y sus notificaciones llegan
  al mismo Gmail, Neto las lee. Qué bancos lee lo cambias desde tu panel Pro.
</p>
<p>
  <strong>Cambio de correo:</strong> cada cuenta de Neto admite un solo Gmail. Si necesitas
  cambiarlo, escríbenos a <a href="mailto:hola@neto.pe">hola@neto.pe</a> y lo vemos contigo.
</p>

<h2>¿Cómo se protegen tus datos?</h2>
<p>
  Tus movimientos se guardan en Supabase, que cifra en reposo todos los datos de sus clientes con
  AES-256 y los transmite por TLS, según su
  <a href="${SUPABASE_SEGURIDAD}" target="_blank" rel="noopener noreferrer nofollow">página de
  seguridad</a>. Además, Neto guarda los tokens de acceso a tu Gmail cifrados con AES-256-GCM.
</p>
<p>
  La app web usa Row Level Security (RLS): cada sesión solo puede leer los datos de su propio
  usuario. Eso no quiere decir que nadie en Neto pueda ver nada. El sistema que procesa tus
  mensajes opera con acceso de administrador, y ese acceso interno se usa para operar el servicio y
  darte soporte. Tus datos no se venden a terceros. El detalle está en
  <a href="/privacidad">nuestra política de privacidad</a>.
</p>
<p><small>Fuentes consultadas el ${CONSULTA_REVISION}.</small></p>

<h2>Empieza gratis</h2>
<p>
  Si quieres probar Neto, <a href="${WA_BLOG}">escríbele por WhatsApp</a> y anota tu primer gasto
  o mándale la captura de un yapeo. Anotar es gratis siempre, sin contraseñas bancarias y sin apps
  que descargar. Si más adelante activas Pro, ahí puedes sumar tu Gmail.
</p>
<p>
  ¿Quieres entender qué hace Neto con tus gastos una vez anotados?
  <a href="/blog/asistente-financiero-whatsapp-peru">Lee aquí cómo funciona el asistente
  completo</a>.
</p>

<h2>Preguntas frecuentes sobre seguridad</h2>

<h3>¿Puede Neto hacer transferencias o pagos desde mi cuenta?</h3>
<p>
  No. Neto no tiene ningún acceso a tu banca en línea. El permiso de Gmail es de solo lectura de
  correo y no sirve para mover plata.
</p>

<h3>¿Qué pasa si Neto sufre un ataque?</h3>
<p>
  Nadie podría entrar a tu banco con lo que guarda Neto, porque Neto no guarda credenciales
  bancarias. Lo que sí está en Neto es tu historial de movimientos (montos, comercios, fechas) y, si
  conectaste Gmail, el token de acceso a tu correo, que se guarda cifrado. Si en algún momento
  tienes dudas, puedes revocar ese acceso desde tu cuenta de Google.
</p>

<h3>¿Recomienda Neto compartir contraseñas bancarias?</h3>
<p>
  Nunca. Si una app de finanzas te pide tu usuario y clave del banco, piénsalo dos veces antes de
  dársela. Hay formas de ordenar tus gastos sin entregar tus credenciales: anotarlos tú, o dejar
  que una app lea las notificaciones que ya recibes.
</p>
`,

  "asistente-financiero-whatsapp-peru": `
<p>
  <strong>Neto es un asistente financiero que vive en WhatsApp: le escribes tus gastos como a un
  amigo («almuerzo 18») o le mandas la captura de tu yapeo, y él los categoriza y te los muestra
  ordenados.</strong> Anotar es gratis siempre. Ver tus números (resúmenes, dashboard, score y
  presupuestos) es de Neto Pro, que cuesta S/10 al mes o S/99 al año y tiene 14 días de prueba.
</p>

<h2>¿Qué es un asistente financiero por WhatsApp?</h2>
<p>
  Es un asistente que te ayuda con tu plata y vive en WhatsApp. Le escribes un gasto y lo anota. Le
  preguntas cuánto gastaste en la semana y te responde. No es una app que descargas ni un Excel que
  llenas: es una conversación.
</p>
<p>
  En Perú tiene sentido por cómo pagamos: un yapeo, un plin, la tarjeta y algo de efectivo, todo
  desde el mismo celular donde ya tenemos WhatsApp abierto.
</p>

<h2>¿Por qué WhatsApp y no una app?</h2>
<p>
  Porque ya lo tienes abierto. No ocupa espacio en tu celular, no tienes que recordar otra
  contraseña ni aprender otra interfaz: si sabes mandar un WhatsApp, sabes anotar un gasto en Neto.
</p>
<p>
  Y porque lo difícil es el hábito. A una app de finanzas hay que acordarse de abrirla; el chat de
  Neto está donde ya revisas tus mensajes todos los días. Menos pasos por gasto son menos gastos que
  se te olvidan.
</p>

<h2>¿Para quién es Neto?</h2>
<ul>
  <li>
    <strong>Quien tiene ingresos fijos y no sabe a dónde se va la plata:</strong> anotar desde el
    chat le da la foto real con poco esfuerzo.
  </li>
  <li>
    <strong>Parejas que comparten gastos:</strong> los espacios compartidos de Neto Pro juntan los
    gastos del hogar de los dos, para que no haya discusiones de «quién pagó qué».
  </li>
  <li>
    <strong>Quien paga con varias cuentas y tarjetas:</strong> lo que pagas con BCP, BBVA, Yape o
    Plin lo anotas en el mismo chat, y ahí queda todo junto.
  </li>
  <li>
    <strong>Quien quiere empezar a ahorrar:</strong> la primera pregunta es «¿de dónde recorto?», y
    se responde mirando tus gastos por categoría.
  </li>
  <li>
    <strong>Freelancers y emprendedores:</strong> puedes crear tus propias categorías para separar
    los gastos del negocio de los personales.
  </li>
</ul>

<h2>Cómo funciona Neto</h2>
<h3>1. Anotas por WhatsApp</h3>
<p>
  Le mandas un mensaje («taxi 12», «almuerzo 18»), una nota de voz, la foto de un voucher o la
  captura de un yapeo o un plin. Neto lee el monto, el comercio y la fecha, y te confirma lo que
  anotó. Si la captura es de un yapeo que te hicieron, lo registra como ingreso.
</p>

<h3>2. Categoriza con IA, y tú corriges</h3>
<p>
  Cada gasto entra con una categoría (comida, transporte, entretenimiento, servicios...). Si una
  está mal, escríbele «cambia el de SmartFit a salud» y la corrige. Y si quieres que un comercio
  vaya siempre a la misma categoría, pídeselo: «todo lo de Rappi va en delivery».
</p>

<h3>3. Te muestra tus números</h3>
<p>Le puedes preguntar cosas como:</p>
<ul>
  <li>«¿Cuánto gasté esta semana?»</li>
  <li>«¿Cuánto llevo en delivery este mes?»</li>
  <li>«¿Cuáles son mis suscripciones?»</li>
  <li>«¿Cuáles son mis gastos hormiga?»</li>
  <li>«¿Cuánto me queda del presupuesto de comida?»</li>
</ul>
<p>
  Esas consultas, los resúmenes automáticos y el dashboard web son de Neto Pro. Durante los 14 días
  de prueba los tienes todos; después, anotar sigue siendo gratis y ver tus números es de Pro.
</p>

<h3>4. Opcional, en Neto Pro: tu Gmail</h3>
<p>
  Si tienes Pro, puedes conectar tu Gmail para que los gastos que tu banco te notifica por correo
  los anote Neto por ti. Es un complemento de lo que escribes, no el mecanismo principal: los pagos
  que no generan un correo los sigues anotando tú. Neto no se conecta a tu banco ni te pide
  contraseñas bancarias. Si quieres el detalle,
  <a href="/blog/bancos-peru-rastrear-sin-contrasena">aquí explicamos qué bancos lee y cómo</a>.
</p>

<h2>¿Qué puede hacer Neto?</h2>
<ul>
  <li>
    <strong>Resumen semanal:</strong> cuánto gastaste, tus categorías más altas y la comparación con
    la semana pasada.
  </li>
  <li>
    <strong>Presupuestos con alertas:</strong> pones un tope mensual por categoría y Neto te avisa
    cuando te acercas.
  </li>
  <li>
    <strong>Reglas por comercio:</strong> si fijas una categoría para un comercio, los siguientes
    gastos de ese comercio entran directo en ella.
  </li>
  <li>
    <strong>Score de salud financiera:</strong> una puntuación de 0 a 100 que te dice qué tan bien
    van tus finanzas. Aprende más sobre
    <a href="/score-financiero">cómo funciona el score financiero de Neto</a>.
  </li>
  <li>
    <strong>Dashboard web:</strong> además del chat, un dashboard con gráficos, tus categorías y el
    historial completo.
  </li>
  <li>
    <strong>Gastos hormiga:</strong> Neto junta las compras chicas del mes y te dice cuánto suman.
    <a href="/blog/gastos-hormiga-peru">¿Qué son los gastos hormiga?</a>
  </li>
  <li>
    <strong>Deudas entre personas:</strong> anotas a quién le debes y quién te debe, y Neto te lo
    recuerda.
  </li>
  <li>
    <strong>Espacios compartidos:</strong> para gastos de pareja o familia, cada uno anota lo suyo y
    ven el total juntos.
  </li>
</ul>

<h2>Un primer mes con Neto, semana a semana</h2>
<ol>
  <li><strong>Semana 1:</strong> Anotas todo y ves tus datos reales por primera vez. Lo normal es que una o dos categorías te sorprendan.</li>
  <li><strong>Semana 2:</strong> Empiezas a notar tus decisiones de gasto. No porque Neto te juzgue, sino porque ahora tienes los números.</li>
  <li><strong>Semana 3:</strong> Pones tus primeros presupuestos por categoría, y Neto te avisa si te pasas.</li>
  <li><strong>Semana 4:</strong> Comparas tu gasto con el de la semana 1 y decides qué ajustar el mes siguiente.</li>
</ol>

<h2>¿Cuánto cuesta?</h2>
<p>
  Anotar gastos es gratis para siempre y sin límite: mensajes por WhatsApp, fotos de tu Yape o
  Plin, correcciones de categoría y tu total del mes siempre a la vista. Nada de eso se corta ni se
  borra.
</p>
<p>
  Cuando registras tu primer gasto arrancan 14 días de Neto Pro con todo abierto. Después, lo que
  queda detrás de Pro (S/10 al mes o S/99 al año) es verlos ordenados: dashboard con gráficos y
  categorías, historial ilimitado, presupuestos y metas con alertas, score financiero detallado,
  espacios compartidos y reportes con export.
</p>
<p>
  Pro se paga con <strong>Yape</strong>, sin tarjeta de por medio, y no se renueva solo.
</p>

<h2>Preguntas frecuentes</h2>

<h3>¿Necesito conectar mi correo para usar Neto?</h3>
<p>
  No. Neto funciona completo anotando por WhatsApp o en la web. Conectar Gmail es opcional y es de
  Neto Pro: sirve para que los gastos que tu banco te notifica por correo entren solos, además de
  los que anotas.
</p>

<h3>¿Puedo usar Neto si solo uso Yape?</h3>
<p>
  Sí. Mándale a Neto la captura de cada yapeo por WhatsApp y él lee el monto, a quién le pagaste y
  la fecha. El paso a paso está en
  <a href="/blog/controlar-gastos-yape-plin">cómo controlar tus gastos si pagas con Yape y Plin</a>.
</p>

<h3>¿Hay una versión para negocios?</h3>
<p>
  No. Neto está hecho para finanzas personales. Si eres freelancer o tienes un negocio pequeño,
  puedes usar categorías propias para separar los gastos del negocio de los tuyos.
</p>
`,
};
