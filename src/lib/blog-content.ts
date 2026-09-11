/**
 * Blog article HTML content, keyed by slug.
 * Keeping content in a TS file keeps the static export simple
 * and avoids MDX/remark dependencies.
 */

import { waLink } from "./constants";
import { APPS } from "./apps-comparativa";

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

/*
 * Los precios del post de precios NO se escriben acá: salen de `APPS`, que es también lo que
 * muestra la comparativa. Refrescar un precio allá lo refresca en los dos lados.
 */
const precioPorApp = APPS.map((app) => {
  const fuente =
    app.fuentes && app.consultado
      ? `<br /><small>Fuente oficial, consultada el ${fechaLarga(app.consultado)}: ${app.fuentes
          .map((f) => `<a href="${f.url}" target="_blank" rel="noopener noreferrer nofollow">${f.nombre}</a>`)
          .join(" · ")}</small>`
      : "";
  return `<h3>${app.name}</h3>\n<p>${app.precio}${fuente}</p>`;
}).join("\n");

// Fuentes de la pieza de Yape y Plin. Cada cifra o dato de terceros de ese post sale de acá.
const YAPE_MOVIMIENTOS = "https://www.yape.com.pe/preguntas-frecuentes/enviar-y-recibir-yapeos/98--como-veo-mis-movimientos";
const YAPE_CORREO = "https://www.yape.com.pe/preguntas-frecuentes/sobre-tu-cuenta-yape/como-recibo-un-correo-de-aviso-cada-vez-que-envie-un-yapeo";
const PLIN = "https://plin.pe/";
const BCRP_INTEROPERABILIDAD = "https://www.bcrp.gob.pe/sistema-de-pagos/interoperabilidad/estrategia-de-interoperabilidad-de-los-pagos-minoristas.html";
const CREDICORP_2T26 = "https://www.sec.gov/Archives/edgar/data/0001001290/000114036126033379/ef20080305_ex99-1.htm";
const CONSULTA_YAPE_PLIN = fechaLarga("2026-09-11");

/*
 * Revisión de los cinco posts de marzo (2026-09-11), con la misma regla que los posts nuevos: cada
 * cifra de terceros lleva fuente y fecha, y lo que no se pudo verificar se borró. Lo que estos posts
 * dicen de Neto (bancos que lee, 30 días de histórico, AES-256-GCM en los tokens de Gmail) sale del
 * código de `neto/app` (`gmail.js`, `services/gmail-scanner.js`, `lib/crypto.js`) a esa fecha.
 */
const INEI_INGRESO_LIMA = "https://www.gob.pe/institucion/inei/noticias/1430813-inei-poblacion-ocupada-aumento-7-7-en-lima-metropolitana-en-el-trimestre-movil-mayo-junio-julio-de-2026";
const SUPABASE_SEGURIDAD = "https://supabase.com/security";
const CONSULTA_REVISION = fechaLarga("2026-09-11");

export const articleContent: Record<string, string> = {
  "cuanto-cuesta-app-finanzas-personales-peru": `
<p>
  <strong>Anotar tus gastos cuesta S/0 en casi todas las apps de finanzas personales que se
  usan en Perú. Lo que se cobra es lo de encima</strong>: ver reportes, quitar anuncios,
  sincronizar entre dispositivos o conectar bancos de otros países. En Neto, registrar es
  gratis siempre y ver tus números cuesta S/10 al mes o S/99 al año con Neto Pro. Las demás
  cobran por cosas distintas y hasta en monedas distintas, así que abajo va el precio de cada
  una con su fuente oficial.
</p>
<p>
  Este post lo escribe el equipo de Neto. Por eso los precios de las otras apps no están
  resumidos por nosotros: son los que publica cada una en su web o en su ficha de la App Store
  de Perú, que es donde ves el precio que te cobran desde aquí.
</p>

<h2>Cuánto cuesta cada app</h2>
${precioPorApp}

<h2>Por qué comparar solo el número engaña</h2>
<p>
  Cada app cobra por una cosa distinta, así que dos precios parecidos pueden comprar cosas que
  no se parecen en nada. Money Manager cobra una vez por quitar los anuncios y aparte, cada
  mes, por sincronizar entre tus dispositivos. En Wallet, lo que se paga es Premium, que es
  donde está la sincronización bancaria, aunque ninguna de sus páginas oficiales nombra un
  banco peruano. Spendee y Mobills publican sus precios en dólares y en reales, y el cobro
  final en soles lo ves recién en la App Store.
</p>
<p>
  Neto no cobra por anotar ni por la cantidad de gastos: puedes registrar todos los que quieras
  por WhatsApp o en la web sin pagar nunca. Lo que se paga es consultarlos, o sea el dashboard
  con gráficos, el historial completo, el score financiero, los presupuestos y los reportes.
  Si quieres ver qué hace cada app además del precio, está en la
  <a href="/comparativas/apps-finanzas-peru">comparativa de apps de finanzas personales en Perú</a>.
</p>

<h2>¿Vale la pena pagar?</h2>
<p>
  Nuestra respuesta honesta: no pagues por ninguna app de finanzas antes de haberla usado dos o
  tres semanas seguidas. Si en ese tiempo no la abriste, no te va a ordenar la plata por pagar
  la versión completa. Una suscripción que no usas es un gasto hormiga más, del tipo que
  explicamos en <a href="/blog/gastos-hormiga-peru">cómo los gastos hormiga se comen tu sueldo</a>.
</p>
<p>
  Si ya anotas y lo que te falta es entender en qué se va la plata, ahí sí tiene sentido pagar
  por la parte de análisis. Y si prefieres no pagar nada, una hoja de Excel o de Google Sheets
  sigue siendo gratis; el costo es tu tiempo, porque todo lo categorizas y sumas a mano.
</p>

<h2>Cómo probar Neto sin pagar</h2>
<p>
  Cuando registras tu primer gasto se activan 14 días de Neto Pro con todo abierto, sin pedirte
  tarjeta. Después puedes seguir anotando gratis, o activar Pro por S/10 al mes o S/99 al año.
  Se paga por Yape y no se renueva solo, así que no hay cobro sorpresa.
</p>
<p>
  Para empezar, <a href="${WA_BLOG}">escríbele a Neto por WhatsApp</a> y anota tu primer gasto
  («almuerzo 18») o mándale la captura de un yapeo.
</p>
`,

  "controlar-gastos-yape-plin": `
<p>
  <strong>Para controlar lo que gastas con Yape y Plin necesitas juntar en un solo lugar lo que
  hoy vive en dos o más apps, y anotarlo en el momento en que pagas.</strong> Yape guarda tus
  yapeos y cada banco guarda los plines que salen de su app, pero ninguno los suma por
  categoría ni los junta con lo que pagas con tarjeta o en efectivo. La forma más corta es
  mandar la captura de cada pago a un solo registro, como Neto por WhatsApp, y mirar el total
  por categoría una vez por semana.
</p>

<h2>Por qué tus yapeos no te dicen en qué gastas</h2>
<p>
  La app de Yape sí tiene historial: muestra quién te yapeó, a quién yapeaste, la fecha y el
  monto, con filtros de últimos 90 días y más de 90 días, y te deja enviar el listado a tu
  correo (<a href="${YAPE_MOVIMIENTOS}" target="_blank" rel="noopener noreferrer nofollow">ayuda
  oficial de Yape</a>). Lo que no te dice es cuánto se fue en comida o en taxis: es una lista de
  nombres y montos, sin categorías.
</p>
<p>
  Plin ni siquiera tiene app propia. Es una función dentro de la app de tu banco o caja: BBVA,
  Interbank, Scotiabank, BanBif, Caja Arequipa y otras entidades, según la
  <a href="${PLIN}" target="_blank" rel="noopener noreferrer nofollow">web oficial de Plin</a>.
  Tus plines quedan en el historial de ese banco, separados de tus yapeos.
</p>
<p>
  Y desde marzo de 2023 las dos se pueden pagar entre sí, porque el Banco Central de Reserva del
  Perú hizo interoperables a Yape y Plin
  (<a href="${BCRP_INTEROPERABILIDAD}" target="_blank" rel="noopener noreferrer nofollow">BCRP</a>).
  Es cómodo, pero para tu control tiene un efecto: el mismo tipo de gasto puede terminar en una
  app o en la otra según cuál tenías a la mano, y ninguna de las dos ve la otra.
</p>
<p>
  No es un problema de pocos. Yape tenía 16,7 millones de usuarios activos al mes al cierre de
  junio de 2026, según el reporte del segundo trimestre de Credicorp, el grupo dueño del BCP
  (<a href="${CREDICORP_2T26}" target="_blank" rel="noopener noreferrer nofollow">reporte
  2T26</a>).
</p>
<p><small>Fuentes consultadas el ${CONSULTA_YAPE_PLIN}.</small></p>

<h2>Cómo controlar tus gastos de Yape y Plin en cinco pasos</h2>
<ol>
  <li>
    <strong>Elige un solo lugar donde vive todo.</strong> Puede ser un Excel, una app o Neto.
    Lo que no funciona es tener la mitad en Yape, la otra mitad en el banco y el efectivo en tu
    cabeza.
  </li>
  <li>
    <strong>Anota en el momento en que pagas.</strong> La pantalla que Yape o tu banco te
    muestra al terminar el pago ya tiene el monto, a quién le pagaste y la fecha. Con Neto le
    reenvías esa captura por WhatsApp: lee esos datos, le pone una categoría y te confirma lo
    que anotó. Lo que pagas en efectivo se lo escribes («taxi 12»).
  </li>
  <li>
    <strong>Separa lo que no es gasto.</strong> Pasar plata entre tus propias cuentas no es un
    gasto, así que no lo anotes. Si la captura es de un yapeo que te hicieron, Neto la registra
    como ingreso. Y si le prestaste a alguien, anótalo como deuda entre personas en vez de gasto,
    para que no se te mezcle con lo que consumiste.
  </li>
  <li>
    <strong>Ponle un tope a tus categorías.</strong> Con un par de semanas anotadas ya ves en qué
    se va más. En Neto Pro puedes poner un presupuesto por categoría, y Neto te avisa por
    WhatsApp cuando te acercas al límite.
  </li>
  <li>
    <strong>Revisa una vez por semana.</strong> Compara lo que anotaste con la lista de
    movimientos de Yape: si falta algún yapeo, lo agregas en ese momento. Es la forma de
    atrapar lo que se te olvidó mandar.
  </li>
</ol>

<h2>Lo que Neto no hace</h2>
<p>
  Neto no se conecta a Yape, a Plin ni a ningún banco, y no te pide contraseñas. No ve tus
  movimientos si no se los mandas, así que un yapeo que no reenviaste no existe para Neto. Por
  eso el quinto paso importa: la revisión semanal contra tu historial de Yape es lo que cierra
  ese hueco.
</p>
<p>
  Yape también puede mandarte un correo de aviso por los yapeos que envías, a partir de un monto
  mínimo que eliges entre S/10, S/50, S/100 y S/500
  (<a href="${YAPE_CORREO}" target="_blank" rel="noopener noreferrer nofollow">ayuda oficial de
  Yape</a>). Sirve como recordatorio, pero no te arma el total por categoría.
</p>

<h2>¿Y si prefiero otra herramienta?</h2>
<p>
  Los cinco pasos sirven igual con un Excel o con cualquier app de gastos: lo que importa es el
  lugar único y la costumbre de anotar al pagar. Si estás eligiendo app, en la
  <a href="/comparativas/apps-finanzas-peru">comparativa de apps de finanzas personales en Perú</a>
  está qué hace cada una, y en <a href="/blog/cuanto-cuesta-app-finanzas-personales-peru">cuánto
  cuesta una app de finanzas personales</a> está el precio de cada una con su fuente.
</p>
<p>
  Si quieres probar con Neto, <a href="${WA_BLOG}">escríbele por WhatsApp</a> y mándale la
  captura de tu último yapeo. Anotar es gratis siempre.
</p>
`,

  "gastos-hormiga-peru": `
<p>
  <strong>Un gasto hormiga es un gasto chico y frecuente que no se siente cuando lo haces, pero que
  sumado a fin de mes pesa.</strong> El café, el taxi corto, el snack de la tarde, la suscripción
  que ya no abres. Ninguno duele solo. La única forma de saber cuánto se llevan es sumarlos con tus
  propios números, y para eso primero hay que anotarlos.
</p>

<h2>Qué son los gastos hormiga</h2>
<p>
  Se llaman así porque son pequeños, pasan desapercibidos y trabajan juntos. Un café de S/8, un taxi
  de S/12, el delivery del almuerzo, la gaseosa de la tarde. Cada uno por separado parece nada. El
  problema aparece cuando los sumas al final del mes, y casi nadie los suma.
</p>

<h2>Cuánto pueden sumar: un ejemplo para hacer la cuenta</h2>
<p>
  Los montos de abajo son un ejemplo, no un promedio de nadie. Sirven para ver cómo se acumulan:
  cambia cada uno por lo que tú gastas y la cuenta es la misma.
</p>
<ul>
  <li>Café cinco días a la semana, a S/8: S/8 × 22 días hábiles = <strong>S/176 al mes</strong></li>
  <li>Delivery dos veces por semana, a S/35: S/35 × 8 = <strong>S/280 al mes</strong></li>
  <li>Taxi corto tres veces por semana, a S/12: S/12 × 12 = <strong>S/144 al mes</strong></li>
  <li>Un snack en los días de trabajo, a S/5: S/5 × 20 días = <strong>S/100 al mes</strong></li>
</ul>
<p>
  <strong>Total del ejemplo: S/700 al mes, S/8,400 al año.</strong>
</p>
<p>
  Para ponerlo en escala: según el INEI, el ingreso promedio mensual por trabajo en Lima
  Metropolitana fue de S/2,312.6 en el trimestre de mayo a julio de 2026
  (<a href="${INEI_INGRESO_LIMA}" target="_blank" rel="noopener noreferrer nofollow">INEI</a>).
  Con ese ingreso, los S/700 del ejemplo serían alrededor del 30% de lo que entra en el mes. Tu
  número puede ser mucho menor o mucho mayor; lo que importa es que lo conozcas.
</p>
<p><small>Fuente consultada el ${CONSULTA_REVISION}.</small></p>

<h2>Por qué no los notas</h2>
<p>
  Un gasto de S/8 no activa ninguna alarma. Los gastos grandes (el alquiler, un pasaje, una compra
  fuerte) los piensas antes de hacerlos; los chicos se aprueban solos. Y como cada uno se paga por
  un medio distinto (un yapeo, la tarjeta, un billete), no queda un lugar donde se vean juntos.
</p>

<h2>Los gastos hormiga más comunes</h2>
<p>
  No hay un ranking oficial de gastos hormiga en Perú. Estos son los que conviene revisar primero,
  porque se repiten muchas veces en un mes:
</p>
<ol>
  <li>
    <strong>Delivery.</strong> Al precio de la comida se suman el costo de envío y la propina, así
    que el pedido cuesta más de lo que marca el plato. Mira el total que pagaste, no el precio del
    menú.
  </li>
  <li>
    <strong>Café y antojos fuera de casa.</strong> Un latte o un snack de todos los días es de los
    gastos que más veces se repiten.
  </li>
  <li>
    <strong>Taxis cortos.</strong> Tomar un taxi no tiene nada de malo; lo que falla es no saber
    cuántos tomaste en el mes.
  </li>
  <li>
    <strong>Suscripciones que no usas.</strong> Streaming, música, almacenamiento en la nube, la app
    que probaste dos semanas. Se cobran solas cada mes.
  </li>
  <li>
    <strong>Compras de impulso.</strong> La galleta o la gaseosa en la caja del supermercado. S/3 o
    S/5 cada vez, varias veces por semana.
  </li>
</ol>

<h2>Gastos hormiga vs gastos fijos</h2>
<p>
  Un gasto fijo es predecible: el alquiler, el seguro, la cuota del préstamo. Sabes cuánto pagas y
  cuándo. Un gasto hormiga es variable, frecuente y casi siempre impulsivo.
</p>
<p>
  La diferencia que importa: <strong>los gastos fijos son difíciles de bajar rápido</strong>, porque
  dependen de contratos. Los gastos hormiga los puedes ajustar desde hoy sin cambiar nada grande en
  tu vida. Por eso son un buen punto de partida para cualquier plan de ahorro.
</p>
<p>
  Si quieres ordenar todos tus gastos y no solo los chicos, lee nuestra
  <a href="/blog/como-controlar-gastos-personales-peru">guía de control de gastos personales en Perú</a>.
</p>

<h2>Las suscripciones: el gasto hormiga que se cobra solo</h2>
<p>
  Las suscripciones tienen algo que los otros gastos hormiga no tienen: no decides nada para que se
  cobren. Siguen mes a mes hasta que las cancelas, y cancelar suele pedir más pasos que suscribirse.
</p>
<p>
  Lo práctico es hacer un inventario de todo lo que pagas cada mes y cancelar lo que no usas. En
  <a href="/">Neto</a> Pro, las suscripciones que reconoce entre los gastos que anotaste (Netflix,
  Disney+, Max y otras de su catálogo) aparecen juntas, con cuánto suman al mes.
</p>

<h2>Cómo controlar tus gastos hormiga, paso a paso</h2>
<h3>Paso 1: hacerlos visibles</h3>
<p>
  No puedes controlar lo que no ves. Y como los gastos hormiga son justo los que no anotas, lo que
  funciona es bajar el esfuerzo de anotar hasta que casi no cueste.
</p>
<p>
  Con <a href="/">Neto</a> le escribes por WhatsApp como le escribirías a un amigo («café 8») o le
  mandas la captura de tu yapeo, y él lo categoriza y lo suma. Si además quieres que los cargos que
  tu banco te notifica por correo entren solos, en Neto Pro puedes conectar tu Gmail: es opcional y
  va encima de lo que anotas, no en su lugar.
</p>

<h3>Paso 2: identificar patrones</h3>
<p>
  Con un par de semanas anotadas, los patrones aparecen solos: «se me va más en delivery de lo que
  creía» o «el café me cuesta más que el gimnasio». Con esa información puedes decidir con calma.
</p>
<p>
  No te juzgues en este paso. El objetivo es solo <strong>ver</strong>; cambiar viene después.
  Querer cambiar todo de golpe es lo que suele frustrar.
</p>

<h3>Paso 3: decidir, no eliminar</h3>
<p>
  No se trata de dejar el café para siempre. Se trata de <strong>decidir con información</strong>.
  Tal vez el café diario vale la pena para ti y el delivery tres veces por semana no, o al revés.
  Lo importante es que sea tu decisión y no un accidente.
</p>

<h3>Paso 4: ponerle un tope a cada categoría</h3>
<p>
  Define un tope mensual para tus categorías hormiga, por ejemplo «máximo S/150 en delivery este
  mes» o «no más de S/80 en cafés». Cuando te acercas al límite, ajustas.
</p>
<p>
  En Neto Pro puedes poner un presupuesto por categoría, y Neto te avisa cuando te acercas al tope.
</p>

<h2>La matemática del ahorro</h2>
<p>
  Si bajas tus gastos hormiga en <strong>S/200 al mes</strong>, sin contar intereses:
</p>
<ul>
  <li>En 3 meses: S/600</li>
  <li>En 6 meses: S/1,200</li>
  <li>En 1 año: S/2,400</li>
  <li>En 3 años: S/7,200</li>
</ul>
<p>
  Y no cambiaste tu estilo de vida: solo dejaste de gastar en cosas que no te importaban tanto.
</p>

<h2>Errores comunes al intentar controlar gastos hormiga</h2>
<ul>
  <li>
    <strong>Eliminar todo de golpe:</strong> si desde mañana no gastas nada en delivery, café ni
    taxis, lo más probable es que no lo sostengas. Empieza reduciendo una parte, no el 100%.
  </li>
  <li>
    <strong>Trabajar con estimados:</strong> «más o menos gasto tanto» no sirve para decidir.
    Necesitas el número real.
  </li>
  <li>
    <strong>Culpar solo al sueldo:</strong> ganar más no garantiza ahorrar más. Es común que, al
    subir el ingreso, también suban los gastos chicos.
  </li>
</ul>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuánto debería gastar en gastos hormiga al mes?</h3>
<p>
  No hay una regla oficial. Lo útil es anotar un mes completo, ver cuánto sumaron y decidir un tope
  que te parezca razonable a ti. Si al ver el número te incomoda, ahí tienes margen.
</p>

<h3>¿El café de todos los días me arruina?</h3>
<p>
  No por sí solo. Un café de S/8 al día son S/2,920 al año, que no es poco, pero el problema es la
  suma de todos los gastos hormiga juntos. Si es el único y el resto de tus finanzas está en orden,
  no es urgente.
</p>

<h3>¿Cómo sé cuáles son mis gastos hormiga?</h3>
<p>
  Anotándolos. La forma más rápida es escribirle a <a href="${WA_BLOG}">Neto por WhatsApp</a> cada
  gasto cuando lo haces. Anotar es gratis siempre; ver tus gastos ordenados por categoría en el
  dashboard es de Neto Pro, y tienes 14 días de prueba desde que registras tu primer gasto.
</p>
`,

  "como-controlar-gastos-personales-peru": `
<p>
  <strong>Controlar tus gastos en Perú empieza por juntar en un solo lugar lo que pagas con Yape,
  Plin, tarjeta y efectivo, y anotarlo cuando pagas.</strong> Con un mes de datos reales ya puedes
  elegir un método: la regla 50/30/20, topes por categoría o el presupuesto cero. Abajo va cada uno
  con un ejemplo en soles, y un plan de 30 días para empezar.
</p>

<h2>El problema: tu plata está repartida</h2>
<p>
  Yape para el almuerzo, tarjeta para el supermercado, efectivo para el taxi, Plin para la comida
  del fin de semana. Cada medio de pago guarda su propio historial y ninguno te muestra el total
  junto ni ordenado por categoría.
</p>
<p>
  Resultado: llegas a fin de mes sin saber exactamente en qué se fue tu sueldo. Sabes que pagaste el
  alquiler y los servicios; el resto es un misterio.
</p>
<p>
  Por eso el primer paso no es disciplina ni fuerza de voluntad: es <strong>visibilidad</strong>.
  Antes de controlar necesitas ver, y para ver necesitas datos. Si quieres saber por dónde empezar,
  <a href="/blog/en-que-gasto-mi-plata">este artículo explica cómo averiguar a dónde va tu plata</a>.
</p>

<h2>El ciclo del «ya empiezo el lunes»</h2>
<p>
  Es un patrón común: alguien decide controlar sus gastos, empieza fuerte los primeros días, se
  olvida de anotar una compra y, después de una semana con datos incompletos, lo deja.
</p>
<p>
  El problema no es la persona: es cuánto cuesta anotar. Cualquier sistema de control de gastos
  depende de que registres lo que pagas, y lo que cambia entre uno y otro es cuánto esfuerzo te pide
  cada registro. Los hábitos que duran son los que tienen <strong>fricción mínima</strong>.
</p>

<h2>Método 1: la regla 50/30/20 adaptada a Perú</h2>
<p>
  Este método divide tu sueldo en tres partes. Es simple y te da un marco claro para decidir:
</p>
<ul>
  <li><strong>50% para necesidades:</strong> alquiler, servicios (luz, agua, internet), comida del día, transporte al trabajo, medicamentos, colegios.</li>
  <li><strong>30% para gustos:</strong> salidas, delivery, ropa, suscripciones, entretenimiento, viajes.</li>
  <li><strong>20% para ahorro y deudas:</strong> fondo de emergencia, cuotas de préstamos, ahorro para metas.</li>
</ul>
<p>
  <strong>Ejemplo con un sueldo de S/3,000:</strong>
</p>
<ul>
  <li>Necesidades (50%): S/1,500. Alquiler S/800 + comida S/400 + servicios S/200 + transporte S/100</li>
  <li>Gustos (30%): S/900. Salidas S/300 + delivery S/200 + ropa S/200 + suscripciones S/200</li>
  <li>Ahorro (20%): S/600. Fondo de emergencia S/300 + pago de deuda S/300</li>
</ul>
<p>
  <strong>¿Y si no te alcanza?</strong> Si el alquiler solo ya se come casi todo el 50% de
  necesidades, ajusta los porcentajes a tu situación. Lo importante es el <em>principio</em> de
  separar necesidades, gustos y ahorro, no los porcentajes exactos.
</p>

<h2>Método 2: control por categoría</h2>
<p>
  En vez de revisar cada sol, agrupa tus gastos en categorías y ponle un tope mensual a cada una.
  Funciona bien porque <strong>no te obliga a revisar cada transacción</strong>: solo miras si te
  pasaste en alguna categoría.
</p>
<p>Categorías que funcionan bien en Perú:</p>
<ul>
  <li><strong>Comida en casa:</strong> supermercado, mercado, Tottus, Metro</li>
  <li><strong>Comida fuera y delivery:</strong> restaurantes, Rappi, PedidosYa, cafés</li>
  <li><strong>Transporte:</strong> combi, Metropolitano, taxi, Uber, InDriver, combustible</li>
  <li><strong>Entretenimiento:</strong> cine, salidas, suscripciones, juegos</li>
  <li><strong>Ropa y cuidado personal:</strong> ropa, zapatos, peluquería, cosméticos</li>
  <li><strong>Servicios del hogar:</strong> luz, agua, internet, teléfono</li>
  <li><strong>Salud:</strong> medicamentos, consultas, seguro de salud</li>
  <li><strong>Ahorro e inversión:</strong> la categoría que más se olvida incluir</li>
</ul>
<p>
  El truco: <strong>trata el ahorro como si fuera un gasto fijo</strong>. No ahorres «lo que
  sobra», porque casi nunca sobra. Separa el ahorro el primer día del mes, igual que pagas el
  alquiler.
</p>

<h2>Método 3: el presupuesto cero</h2>
<p>
  Consiste en asignar cada sol de tu sueldo a una categoría antes de empezar el mes, de modo que
  ingresos menos gastos dé cero. No significa que gastas todo: significa que cada sol tiene un
  destino definido, incluido el ahorro.
</p>
<p>
  Ejemplo con S/3,000:
</p>
<ol>
  <li>Alquiler: S/900</li>
  <li>Comida en casa: S/400</li>
  <li>Transporte: S/200</li>
  <li>Servicios: S/200</li>
  <li>Delivery y salidas: S/200</li>
  <li>Ropa: S/100</li>
  <li>Entretenimiento: S/150</li>
  <li>Fondo de emergencia: S/300</li>
  <li>Pago de deuda: S/250</li>
  <li>Ahorro para una meta: S/300</li>
  <li><strong>Total asignado: S/3,000</strong></li>
</ol>
<p>
  Pide más planificación al inicio, pero es el método que más control te da.
</p>

<h2>Método 4: quitar tres gastos (para empezar ya)</h2>
<p>
  Si todavía no quieres porcentajes ni categorías, empieza por aquí:
</p>
<ol>
  <li>Revisa tu estado de cuenta del último mes.</li>
  <li>Identifica 3 gastos recurrentes que <strong>no necesitas o casi no usas</strong>.</li>
  <li>Quítalos. Solo 3.</li>
</ol>
<p>Ejemplos comunes:</p>
<ul>
  <li>¿Pagas dos o tres plataformas de streaming? Quédate con una y te ahorras lo que cuestan las otras.</li>
  <li>¿Pides delivery tres veces por semana? Baja a una.</li>
  <li>¿Café de cadena todos los días? Llévalo de casa tres de cinco días.</li>
</ul>
<p>
  Tres cambios, sin tocar el resto de tu vida. Anota cuánto te ahorró cada uno el primer mes y, con
  eso bajo control, amplías el sistema.
</p>

<h2>Por qué mucha gente deja de anotar (y qué ayuda)</h2>
<p>
  Casi todas las apps de finanzas personales, incluida Neto, dependen de que tú registres tus
  gastos: ninguna de las siete apps de nuestra
  <a href="/comparativas/apps-finanzas-peru">comparativa de apps de finanzas en Perú</a> se
  sincroniza con bancos peruanos, según sus propias fuentes oficiales. Lo que cambia es cuánto te
  cuesta cada registro. Llenar un formulario con monto, categoría y fecha por cada café es justo lo
  que hace que la gente lo deje.
</p>
<p>
  Las hojas de cálculo tienen el mismo problema, con más trabajo encima: todo lo categorizas y lo
  sumas a mano.
</p>
<p>
  <a href="/">Neto</a> apuesta por el canal que ya tienes abierto: le escribes el gasto en una línea
  por WhatsApp o le mandas la foto del voucher o la captura del yapeo, y él lo categoriza con IA.
  Los resúmenes y el dashboard son de Neto Pro. En Pro también puedes conectar tu Gmail para que
  los gastos que el banco te notifica por correo los anote Neto por ti; es opcional y complementa
  lo que escribes, no lo reemplaza.
</p>
<p>
  Si quieres saber qué bancos lee Neto por correo y cómo lo hace sin pedirte contraseñas,
  <a href="/blog/bancos-peru-rastrear-sin-contrasena">lee qué bancos lee Neto sin tu contraseña</a>.
</p>

<h2>Herramientas gratuitas vs de pago</h2>
<p>Antes de pagar por una herramienta, prueba lo gratuito:</p>
<ul>
  <li><strong>Excel o Google Sheets:</strong> gratis y flexible, pero todo lo categorizas y sumas a mano.</li>
  <li><strong>La app de tu banco:</strong> muestra los movimientos de ese banco, y solo de ese.</li>
  <li><strong>Neto:</strong> anotas el gasto por WhatsApp o mandas la foto del voucher y lo categoriza con IA. Registrar es gratis y sin límite; los 14 días de prueba abren el dashboard completo, y después verlo es de Neto Pro (S/10 al mes o S/99 al año).</li>
</ul>
<p>
  La regla: no pagues por una herramienta de finanzas antes de comprobar que la usas. Si quieres
  comparar, en <a href="/blog/cuanto-cuesta-app-finanzas-personales-peru">cuánto cuesta una app de
  finanzas personales</a> está el precio de cada una con su fuente oficial.
</p>

<h2>Plan de acción de 30 días</h2>
<ol>
  <li><strong>Día 1:</strong> Escríbele a <a href="${WA_BLOG}">Neto por WhatsApp</a> y anota tu primer gasto, o mándale la captura de un yapeo. Es gratis.</li>
  <li><strong>Días 2 a 7:</strong> Anota todo y solo observa. Sin juzgar ni cambiar nada: el objetivo es entender tus patrones reales.</li>
  <li><strong>Semana 2:</strong> Identifica tus 3 categorías con más gasto. Elige una para reducir en 20%.</li>
  <li><strong>Semana 3:</strong> Ponle un tope a esa categoría. En Neto Pro, Neto te avisa cuando te acercas.</li>
  <li><strong>Semana 4:</strong> Evalúa. ¿Lo lograste? ¿Qué fue difícil? Ajusta para el mes siguiente.</li>
</ol>

<h2>Errores comunes que evitar</h2>
<ul>
  <li>
    <strong>Querer cambiarlo todo de golpe:</strong> la restricción total genera rebote. Reduce de a
    pocos.
  </li>
  <li>
    <strong>No contar el efectivo:</strong> lo que pagas en efectivo no queda en ningún historial.
    Si no puedes anotar cada gasto, al menos anota los grandes una vez por semana.
  </li>
  <li>
    <strong>Olvidar los gastos irregulares:</strong> el cumpleaños, el regalo de Navidad, la
    reparación del celular. Crea una categoría «extras» con un presupuesto mensual pequeño, así no
    te sorprenden.
  </li>
</ul>

<h2>Preguntas frecuentes</h2>

<h3>¿Cuánto tiempo tarda en verse resultados al controlar los gastos?</h3>
<p>
  En el primer mes ganas visibilidad: sabes en qué gastas. El cambio en tu saldo llega después,
  cuando ya ajustaste algunos hábitos, y cuánto tarda depende del margen que tengas.
</p>

<h3>¿Qué pasa si tengo deudas y no llega el sueldo?</h3>
<p>
  Primero necesitas ver el panorama completo: ingresos, gastos fijos y deudas. Con eso claro,
  priorizas. La regla general: primero cubres las necesidades básicas, luego el mínimo de cada
  deuda para no acumular intereses, y cualquier excedente va a la deuda con la tasa más alta.
</p>

<h3>¿Sirve de algo controlar los gastos si el sueldo es muy bajo?</h3>
<p>
  Sí, aunque con límites. Con ingresos bajos el margen es chico, pero ver en qué se va la plata
  ayuda a encontrar gastos que puedes quitar sin afectar lo importante. Y cuando el ingreso mejora,
  el hábito ya lo tienes.
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
