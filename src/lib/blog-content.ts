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
 * Los siete posts siguen el molde (`docs/molde-blog.md`) y `scripts/check-blog.mjs` los mide
 * todos: su lista LEGADO quedó vacía el 12-sep-2026. Las cuentas con montos inventados van en
 * `ejemplo()`, que el build y el chequeo verifican sumando; nunca sueltas en la prosa.
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
${enCorto([
  "<strong>Para saber en qué gastas, junta todos tus movimientos en un solo lugar y súmalos por categoría.</strong>",
  "Tu banco, Yape y tu tarjeta guardan cada uno su parte, y el efectivo no queda en ningún lado.",
  "Puedes hacerlo a mano con tus estados de cuenta, o anotando cada gasto cuando pagas.",
])}
<p>
  Cobras el 15 o el 30, pagas el alquiler y los servicios, y el 20 ya no tienes plata. No es falta
  de interés: cada pago dejó su rastro en un lugar distinto.
</p>
${TABLA_DONDE_QUEDA}

<h2>¿Por qué cuesta tanto rastrear?</h2>
<ul>
  <li><strong>Anotar cansa.</strong> Si registrar un gasto te pide abrir una app y llenar un formulario, tarde o temprano lo dejas.</li>
  <li><strong>El estado de cuenta no habla claro.</strong> Dice «POS WONG 12345» o «TRANSF YAPE», no «comida» ni «transporte».</li>
  <li><strong>El efectivo es invisible.</strong> Lo que pagas con billetes no deja rastro, salvo que lo anotes.</li>
</ul>

<h2>¿Por dónde empezar a mirar?</h2>
<p>
  No tenemos un promedio confiable de cuánto gasta un peruano en cada categoría, así que no te damos
  uno. Estas son las que se repiten y se suelen subestimar:
</p>
${tabla({
  caption: "Cinco categorías para revisar primero",
  columnas: ["Categoría", "Por qué se subestima"],
  filas: [
    ["Delivery y comida fuera", "Al precio del plato se suman el envío y la propina"],
    ["Transporte", "Los taxis «porque es tarde» se mezclan con el pasaje de todos los días"],
    ["Suscripciones digitales", "Se cobran solas, uses o no el servicio"],
    ["Compras chicas", 'Parecen no contar: son los <a href="/blog/gastos-hormiga-peru">gastos hormiga</a>'],
    ["Salidas", "Una salida «tranquila» suele costar más de lo planeado"],
  ],
})}

<h2>Cómo lo hace Neto</h2>
<p>
  Neto vive en el WhatsApp que ya tienes abierto. Le escribes el gasto en una línea («almuerzo 18») o
  le mandas la captura del yapeo, y lo categoriza con IA.
</p>
${chatNeto("captura-yapeo")}
<p>
  Registrar es gratis siempre. Tu primer gasto activa 14 días de Neto Pro: tus gastos por categoría
  en el dashboard web y un resumen cada semana. Después, ver tus números es de Neto Pro (S/10 al mes
  o S/99 al año). Para probar, <a href="${WA_BLOG}">escríbele a Neto por WhatsApp</a>.
</p>
<p>
  El resumen semanal te dice cuánto gastaste, tus categorías más altas y si fue más o menos que la
  semana anterior. Todo sale de lo que anotaste, así que conviene compararlo de vez en cuando con tu
  estado de cuenta.
</p>

<h2>¿Y si prefieres hacerlo a mano?</h2>
<ol>
  <li><strong>Descarga los movimientos del mes</strong> de cada banco y cada tarjeta. Yape te deja enviar tu lista a tu correo, según su ${enlaceExterno("ayuda oficial", YAPE_MOVIMIENTOS)}.</li>
  <li><strong>Júntalos en una sola tabla</strong> con fecha, comercio, monto y medio de pago.</li>
  <li><strong>Ponle una categoría a cada fila.</strong> Las primeras veces toma tiempo.</li>
  <li><strong>Suma por categoría</strong> y compara cada total con tu ingreso.</li>
</ol>
<p>
  Con los totales a la vista, decide en qué quieres gastar. Asigna un monto a cada categoría para el
  mes que viene. Gastar en delivery sabiéndolo es muy distinto a gastar lo mismo sin darte cuenta.
</p>

<h2>¿Un cargo que no reconoces?</h2>
<p>
  Pasa más seguido de lo que crees. Revisa si es un cargo recurrente, como una suscripción, un seguro
  o un plan de teléfono. Busca el nombre del comercio en Google, porque un código raro suele ser el
  nombre técnico de algo conocido. Si igual no lo reconoces, llama a tu banco.
</p>
<p>
  En Neto Pro, las suscripciones que reconoce entre tus gastos anotados aparecen juntas, con cuánto
  pagas al mes.
</p>

<h2>¿Y los correos del banco?</h2>
<p>
  En Neto Pro, si conectas tu Gmail, los gastos que el banco ya te notifica por correo los anota Neto
  por ti. Es opcional y va encima de lo que escribes, porque no todos los pagos generan un correo.
  Yape, por ejemplo, avisa por correo solo de los yapeos que envías, y solo si activas ese aviso
  (${enlaceExterno("ayuda oficial de Yape", YAPE_CORREO)}).
</p>
<p>
  El permiso que Google te pide es de solo lectura: Neto no puede enviar, borrar ni modificar nada.
  Qué correos abre lo limita su código, que busca remitentes de bancos y billeteras y algunas frases
  típicas de sus avisos. El detalle está en
  <a href="/blog/bancos-peru-rastrear-sin-contrasena">qué bancos lee Neto sin tu contraseña</a>.
</p>
<p><small>Fuentes consultadas el ${CONSULTA_REVISION}.</small></p>
`,

  "bancos-peru-rastrear-sin-contrasena": `
${enCorto([
  "<strong>Neto no se conecta a tu banco ni te pide su contraseña.</strong>",
  "Con Neto Pro y tu Gmail conectado, lee los correos de aviso que tu banco ya te manda y anota esos movimientos.",
  "Es opcional y es un complemento: la mayoría de tus gastos igual los anotas tú por WhatsApp.",
])}
<p>
  La pregunta que más nos hacen es cómo leemos tu banco sin tu contraseña. No lo leemos: leemos tu
  correo, y solo si tú lo conectas. Hay dos formas de que una app vea tus movimientos sin que los
  anotes, y el riesgo no se parece:
</p>
${tabla({
  caption: "Pedirte la clave contra leer tus avisos",
  columnas: ["Qué cambia", "Pedirte usuario y clave", "Leer tus avisos por correo (Neto)"],
  filas: [
    ["Qué le das a la app", "Tu usuario y tu clave del banco", "Un permiso de Google de solo lectura sobre tu correo"],
    ["Cómo entra", "Simula ser tú y copia lo que ve en pantalla", "No entra a tu banco: lee los avisos que ya te llegan"],
    ["Si la app sufre una filtración", "Se filtra la llave de tu cuenta", "No hay credenciales bancarias que filtrar"],
    ["Cómo lo cortas", "Cambiando tu clave del banco", "Quitando el permiso desde tu cuenta de Google"],
  ],
})}
<p>
  Compartir tu clave con un tercero además puede complicarte un reclamo si algo sale mal, así que
  revisa antes las condiciones de tu banco.
</p>

<h2>¿Qué bancos lee?</h2>
<p>
  Esta es la lista de remitentes que Neto busca en tu Gmail, tomada de su código. Que tu banco esté no
  garantiza un correo por cada movimiento: eso depende de los avisos que tengas activados.
</p>
${tabla({
  caption: "Remitentes que Neto busca en tu Gmail",
  columnas: ["Tipo", "Cuáles"],
  filas: [
    ["Bancos", "BCP, BBVA Perú, Interbank, Scotiabank Perú, BanBif, Banco Falabella, Banco Ripley y Mibanco"],
    ["Billeteras", "Yape, por los yapeos que envías y si activas su aviso por correo. Plin, por los avisos que te lleguen al correo"],
    ["Cajas municipales", "Caja Huancayo, Caja Piura, Caja Trujillo, Caja Cusco, Caja Ica y Caja Sullana"],
  ],
  pie: `Lista tomada del código de Neto el ${CONSULTA_REVISION}. Lo de Yape sale de su ${enlaceExterno(
    "ayuda oficial",
    YAPE_CORREO
  )}, consultada el mismo día.`,
})}
<p>
  Los yapeos que recibes no llegan por correo: mándale a Neto la captura por WhatsApp y lo registra
  como ingreso. Si tu banco no está, escríbenos a <a href="mailto:hola@neto.pe">hola@neto.pe</a> con
  un ejemplo del aviso (tapa tus datos). Agregar uno requiere revisar sus correos, así que no
  prometemos plazo.
</p>

<h2>¿Qué ve Neto y qué no?</h2>
${tabla({
  caption: "Lo que Neto puede y no puede ver",
  columnas: ["Esto", "¿Lo ve Neto?"],
  filas: [
    ["Los avisos de los remitentes de la lista", "Sí, si conectaste tu Gmail"],
    ["Tu contraseña o clave del banco", "No. Nunca la pide"],
    ["Tu banca en línea, tu saldo, transferencias o pagos", "No. No entra a tu banco"],
    ["Tu clave de Yape, tu PIN o tu huella", "No. No tiene acceso a ninguna autenticación"],
    ["Tus correos personales o de trabajo", "El código busca solo los remitentes de la lista y algunas frases típicas de avisos, y descarta lo que no es un movimiento"],
  ],
})}

<h2>Cómo se conecta</h2>
<ol>
  <li>Activas Neto Pro. Conectar Gmail es la única función de Pro que no está en la prueba de 14 días: se habilita cuando pagas.</li>
  <li>Desde tu panel Pro en la web eliges qué bancos leer y conectas tu Gmail.</li>
  <li>Google te muestra el permiso: ver tus correos, sin poder enviarlos, borrarlos ni modificarlos.</li>
  <li>Al conectarlo, Neto importa los avisos de los últimos 30 días, hasta 50 correos. Después revisa los nuevos cada cierto tiempo.</li>
</ol>
<p>
  Cada cuenta de Neto admite un solo Gmail. Si cambias de banco y el nuevo está en la lista, lo eliges
  desde tu panel. Para cambiar de correo, escríbenos a hola@neto.pe. Puedes revocar el acceso cuando
  quieras desde
  <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>.
</p>

<h2>¿Cómo se protegen tus datos?</h2>
<p>
  Tus movimientos se guardan en Supabase. Según su ${enlaceExterno("página de seguridad", SUPABASE_SEGURIDAD)},
  cifra en reposo los datos de sus clientes con AES-256 y los transmite por TLS. Además, Neto guarda
  cifrados con AES-256-GCM los tokens de acceso a tu Gmail.
</p>
<p>
  La app web usa Row Level Security: cada sesión solo lee los datos de su propio usuario. Eso no
  quiere decir que nadie en Neto pueda ver nada. El sistema que procesa tus mensajes opera con acceso
  de administrador, que se usa para operar el servicio y darte soporte. Tus datos no se venden. El
  detalle está en <a href="/privacidad">nuestra política de privacidad</a>.
</p>
<p><small>Fuentes consultadas el ${CONSULTA_REVISION}.</small></p>
<p>
  Para probar Neto, <a href="${WA_BLOG}">escríbele por WhatsApp</a> y anota tu primer gasto. Anotar es
  gratis siempre, sin contraseñas bancarias. Qué hace Neto con tus gastos está en
  <a href="/blog/asistente-financiero-whatsapp-peru">cómo funciona el asistente</a>.
</p>
`,

  "asistente-financiero-whatsapp-peru": `
${enCorto([
  "<strong>Neto es un asistente financiero que vive en WhatsApp:</strong> le escribes tus gastos o le mandas la captura del yapeo.",
  "Él los categoriza y te los muestra ordenados.",
  "Anotar es gratis siempre. Ver tus números es de Neto Pro, que cuesta S/10 al mes o S/99 al año.",
])}
<p>No es una app que descargas ni un Excel que llenas: es una conversación. Así se ve anotar un pago:</p>
${chatNeto("captura-yapeo")}

<h2>¿Por qué WhatsApp y no una app?</h2>
<p>
  Porque ya lo tienes abierto. No ocupa espacio ni te pide otra contraseña: si sabes mandar un
  WhatsApp, sabes anotar un gasto. Y lo difícil es el hábito. A una app hay que acordarse de abrirla;
  el chat de Neto está donde ya revisas tus mensajes. Menos pasos por gasto son menos gastos olvidados.
</p>

<h2>Cómo funciona</h2>
<ol>
  <li><strong>Anotas.</strong> Un mensaje («taxi 12»), una nota de voz, la foto de un voucher o la captura de un yapeo o un plin. Neto te confirma lo que anotó. Si el yapeo te lo hicieron a ti, lo registra como ingreso.</li>
  <li><strong>Categoriza con IA, y tú corriges.</strong> Si una categoría está mal, escríbele «cambia el de SmartFit a salud». Si quieres que un comercio vaya siempre a la misma, pídeselo: «todo lo de Rappi va en delivery».</li>
  <li><strong>Te muestra tus números.</strong> Le preguntas «¿cuánto gasté esta semana?» o «¿cuánto llevo en delivery?», y ves todo ordenado en el dashboard web. Esas consultas, los resúmenes y el dashboard son de Neto Pro.</li>
  <li><strong>Opcional, en Pro: tu Gmail.</strong> Los gastos que tu banco te notifica por correo los anota Neto por ti. Es un complemento, no el mecanismo principal, y Neto no se conecta a tu banco. Aquí explicamos <a href="/blog/bancos-peru-rastrear-sin-contrasena">qué bancos lee y cómo</a>.</li>
</ol>

<h2>¿Qué es gratis y qué es de Neto Pro?</h2>
${tabla({
  caption: "Lo gratis y lo de Neto Pro",
  columnas: ["Función", "Gratis", "Neto Pro"],
  filas: [
    ["Anotar por mensaje, voz, voucher o captura", "Sí, sin límite", "Sí"],
    ["Corregir categorías y ver tu total del mes", "Sí", "Sí"],
    ["Resúmenes y consultas por WhatsApp", "No", "Sí"],
    ["Dashboard, historial y reportes con export", "No", "Sí"],
    ["Presupuestos y metas con alertas", "No", "Sí"],
    ["Score financiero y espacios compartidos", "No", "Sí"],
    ["Conectar tu Gmail", "No", "Sí, solo pagando: no entra en la prueba"],
  ],
  pie: "Tu primer gasto activa 14 días de Neto Pro con todo abierto menos Gmail. Pro se paga con Yape y no se renueva solo.",
})}
<p>Así avisa un presupuesto cuando ya pasaste el aviso, en la misma respuesta al gasto:</p>
${chatNeto("tope-categoria")}

<h2>¿Para quién es?</h2>
<ul>
  <li><strong>Quien tiene sueldo fijo y no sabe a dónde se va.</strong> Anotar desde el chat le da la foto real con poco esfuerzo.</li>
  <li><strong>Parejas que comparten gastos.</strong> Los espacios compartidos de Neto Pro juntan los gastos del hogar de los dos.</li>
  <li><strong>Quien paga con varias cuentas.</strong> Lo que pagas con BCP, BBVA, Yape o Plin lo anotas en el mismo chat.</li>
  <li><strong>Freelancers.</strong> Puedes crear categorías propias para separar el negocio de lo personal.</li>
</ul>

<h2>Un primer mes, semana a semana</h2>
<ol>
  <li><strong>Semana 1:</strong> anotas todo y ves tus datos reales. Lo normal es que una o dos categorías te sorprendan.</li>
  <li><strong>Semana 2:</strong> empiezas a notar tus decisiones de gasto, porque ahora tienes los números.</li>
  <li><strong>Semana 3:</strong> pones tus primeros presupuestos por categoría.</li>
  <li><strong>Semana 4:</strong> comparas con la semana 1 y decides qué ajustar el mes siguiente.</li>
</ol>
<p>Para empezar, <a href="${WA_BLOG}">escríbele a Neto por WhatsApp</a> y anota tu primer gasto.</p>
`,
};
