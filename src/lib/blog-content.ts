/**
 * Blog article HTML content, keyed by slug.
 * Keeping content in a TS file keeps the static export simple
 * and avoids MDX/remark dependencies.
 */

import { WA_LINK } from "./constants";

export const articleContent: Record<string, string> = {
  "gastos-hormiga-peru": `
<h2>Qué son los gastos hormiga</h2>
<p>
  Los gastos hormiga son esos gastos pequeños, casi invisibles, que haces todos los
  días sin pensarlo mucho. Un café de S/8 aquí, un taxi de S/12 allá, el delivery
  del almuerzo, la Coca-Cola de la tarde. Cada uno parece insignificante. Pero
  cuando los sumas al final del mes, el resultado duele.
</p>
<p>
  Se llaman "hormiga" justamente por eso: son pequeños, pasan desapercibidos y
  trabajan en silencio. Pero juntos, <strong>pueden comerse entre S/200 y S/500
  de tu sueldo cada mes</strong> sin que te des cuenta.
</p>
<p>
  En el Perú, donde el sueldo mínimo es de S/1,025 y el sueldo promedio en Lima
  ronda los S/2,800–S/3,200, ese rango representa entre el 7% y el 18% de tus
  ingresos. Plata que se podría convertir en ahorro, en pagar deudas más rápido,
  o en algo que realmente quieres.
</p>

<h2>Cuánto dinero pierdes realmente</h2>
<p>Hagamos cuentas con un ejemplo típico de un limeño con sueldo de S/3,000:</p>
<ul>
  <li><strong>Café diario (de cadena o de la esquina):</strong> S/8 × 22 días hábiles = <strong>S/176 al mes</strong></li>
  <li><strong>Delivery (Rappi, PedidosYa — 2 veces por semana):</strong> S/35 promedio × 8 = <strong>S/280 al mes</strong></li>
  <li><strong>Taxi/Uber "porque estoy cansado" (3 veces por semana):</strong> S/12 × 12 = <strong>S/144 al mes</strong></li>
  <li><strong>Antojos y snacks durante el día:</strong> S/5 × 20 días = <strong>S/100 al mes</strong></li>
  <li><strong>Suscripciones que apenas usas:</strong> Netflix + Spotify + HBO = <strong>S/80 al mes</strong></li>
</ul>
<p>
  <strong>Total: S/780 al mes. S/9,360 al año.</strong>
</p>
<p>
  Casi diez mil soles al año que simplemente desaparecen. Para la mayoría de peruanos, eso
  es más de tres meses de sueldo. Y la gran mayoría no lo sabe porque nunca ha sumado
  estos gastos por categoría.
</p>

<h2>El impacto psicológico: por qué tu cerebro los ignora</h2>
<p>
  Los gastos hormiga no son solo un problema matemático. Son un problema de percepción.
  Cuando gastas S/8 en café, tu cerebro no registra una alarma porque <strong>S/8 no
  duele</strong>. El dolor financiero que sentimos es proporcional al número, y los
  números pequeños pasan bajo el radar cognitivo.
</p>
<p>
  Los economistas del comportamiento llaman a esto "negligencia de pequeñas cantidades".
  Tu cerebro tiene dos sistemas de evaluación financiera:
</p>
<ol>
  <li><strong>Sistema 1 (automático):</strong> Evalúa rápido. "S/8 — no es nada." Aprobado sin pensar.</li>
  <li><strong>Sistema 2 (analítico):</strong> Evalúa lento. Hace cuentas. Proyecta el impacto mensual. Pero solo lo activamos para gastos grandes: la renta, el auto, el viaje.</li>
</ol>
<p>
  El resultado es que tomamos cientos de micro-decisiones financieras al mes usando
  solo el Sistema 1. Y cuando al fin de mes sumamos el daño, nos sorprendemos.
</p>

<h2>Los 5 gastos hormiga más comunes en Perú</h2>
<p>Estos son los que más aparecen al analizar el comportamiento de usuarios peruanos:</p>
<ol>
  <li>
    <strong>Delivery (Rappi, PedidosYa):</strong> El campeón indiscutido. Un almuerzo
    de S/20 más S/8 de delivery fee más propina no son S/20 — son S/32. Y si lo haces
    dos veces por semana, son S/256 al mes solo en delivery. Muchos usuarios se
    sorprenden cuando Neto les muestra este número por primera vez.
  </li>
  <li>
    <strong>Café de cadena:</strong> Starbucks, Juan Valdez, o cualquier café artesanal
    de Miraflores. Un latte a S/18 parece razonable in the moment. Pero 5 veces por
    semana son S/360 al mes. Más que muchos planes de ahorro.
  </li>
  <li>
    <strong>Transporte impulsivo:</strong> Trayectos de S/8–15 que podrías hacer en
    combi o caminando 10 minutos. No hay nada malo en tomar un taxi — el problema
    es no saber cuántos tomas al mes.
  </li>
  <li>
    <strong>Suscripciones olvidadas:</strong> Netflix, Spotify, Disney+, HBO, YouTube
    Premium, Amazon Prime, la app de meditación que usaste dos semanas. Aquí en Perú
    el precio promedio de suscripciones digitales activas por usuario es de S/95–S/130
    al mes. Más de la mitad son plataformas con uso mínimo.
  </li>
  <li>
    <strong>Antojos de tienda:</strong> La galleta, la gaseosa, el chocolate en la caja
    del supermercado. S/3–5 cada vez, varias veces por semana. El supermercado está
    diseñado exactamente para esto: los productos de impulso están estratégicamente
    ubicados en zonas de alta visibilidad.
  </li>
</ol>

<h2>Gastos hormiga vs gastos fijos: la diferencia clave</h2>
<p>
  Un gasto fijo es predecible: tu alquiler, tu seguro, tus cuotas del préstamo. Sabes
  exactamente cuánto pagas y cuándo. Un gasto hormiga es variable, frecuente y
  generalmente impulsivo.
</p>
<p>
  La diferencia importante: <strong>los gastos fijos son difíciles de reducir a corto
  plazo</strong>. Los gastos hormiga los puedes controlar hoy mismo, sin romper contratos
  ni hacer cambios grandes en tu vida. Por eso son el mejor punto de partida para
  cualquier plan de ahorro.
</p>
<p>
  Si quieres aprender a controlar todos tus gastos de forma sistemática, lee nuestra
  <a href="/blog/como-controlar-gastos-personales-peru">guía completa de control de gastos personales en Perú</a>.
</p>

<h2>Las suscripciones: el gasto hormiga digital del siglo XXI</h2>
<p>
  Las suscripciones digitales merecen un capítulo aparte porque tienen un superpoder
  que otros gastos hormiga no tienen: se cobran automáticamente. No tienes que tomar
  ninguna decisión activa — simplemente continúan mes a mes mientras tú te olvidas.
</p>
<p>
  El modelo de negocio está diseñado para aprovechar nuestra inercia. Cancelar una
  suscripción requiere acción activa: buscar el menú de configuración, navegar hasta
  "Cancelar suscripción", confirmar múltiples veces. La fricción es intencional.
</p>
<p>
  La solución: hacer un inventario de todas tus suscripciones activas una vez al año.
  Herramientas como <a href="/">Neto</a> detectan automáticamente los cargos recurrentes
  en tus correos bancarios y los agrupan para que puedas ver de un vistazo cuánto
  pagas en total y decidir cuáles realmente usas.
</p>

<h2>Cómo controlar tus gastos hormiga: paso a paso</h2>
<h3>Paso 1: Hacerlos visibles</h3>
<p>
  El primer paso — y el más importante — es <strong>ver</strong> a dónde se va tu plata.
  No puedes controlar lo que no mides. La mayoría de apps de finanzas te piden
  ingresar cada gasto manualmente. Eso funciona 3 días y luego lo abandonas.
</p>
<p>
  Una alternativa más realista: dejar que la tecnología haga el trabajo.
  <a href="/">Neto</a> lee automáticamente las notificaciones que tu banco ya te
  envía por correo (BCP, BBVA, Interbank, Scotiabank, Yape, Plin) y te muestra
  exactamente en qué estás gastando. Sin ingresar nada manualmente.
</p>

<h3>Paso 2: Identificar patrones</h3>
<p>
  Una vez que ves tus gastos organizados por categoría, los patrones saltan a la
  vista: "Gasto S/300 al mes en delivery" o "Mi café me cuesta S/200 mensuales".
  Con esa información, puedes tomar decisiones conscientes.
</p>
<p>
  La clave es no juzgarte. El objetivo de este paso es solo <strong>ver</strong>,
  no cambiar todavía. Muchas personas se frustran porque quieren cambiar todo de
  golpe. El cambio sostenible empieza con comprensión.
</p>

<h3>Paso 3: Decidir, no eliminar</h3>
<p>
  No se trata de dejar el café para siempre. Se trata de <strong>decidir con
  información</strong>. Tal vez el café diario vale la pena para ti, pero el delivery
  3 veces por semana no. O viceversa. El punto es que sea tu decisión, no un
  accidente.
</p>

<h3>Paso 4: Poner un presupuesto por categoría</h3>
<p>
  Define un tope mensual para tus categorías de gastos hormiga. Por ejemplo:
  "Máximo S/150 en delivery este mes" o "No más de S/80 en cafés". Cuando te
  acercas al límite, ajustas.
</p>
<p>
  Neto te puede alertar por WhatsApp cuando te acercas a tu tope de categoría.
  Así no necesitas revisar nada — el sistema te avisa solo.
</p>

<h2>La matemática del ahorro</h2>
<p>
  Si reduces tus gastos hormiga en solo <strong>S/200 al mes</strong>:
</p>
<ul>
  <li>En 3 meses: S/600 (fondo de emergencia básico para una sola persona)</li>
  <li>En 6 meses: S/1,200 (viaje corto dentro del país)</li>
  <li>En 1 año: S/2,400 (fondo de emergencia sólido o inicio de ahorro)</li>
  <li>En 3 años: S/7,200 (inicial de un negocio pequeño o cuota inicial)</li>
</ul>
<p>
  Y lo mejor: no cambiaste tu estilo de vida. Solo dejaste de gastar en cosas
  que no te importaban tanto.
</p>

<h2>Errores comunes al intentar controlar gastos hormiga</h2>
<ul>
  <li>
    <strong>Intentar eliminar todo de golpe:</strong> Si te propones no gastar nada en
    delivery ni café ni taxis desde mañana, durarás dos semanas. Los cambios drásticos
    no se sostienen. Empieza por reducir en 20%, no en 100%.
  </li>
  <li>
    <strong>No tener datos reales:</strong> Si estimas "más o menos" cuánto gastas, no
    puedes mejorar. Necesitas números concretos para tomar decisiones concretas.
  </li>
  <li>
    <strong>Culpar solo al ingreso:</strong> "Si ganara más, ahorraría más." No
    necesariamente. La mayoría de personas que gana más simplemente incrementa sus
    gastos hormiga proporcionalmente (esto se llama inflación de estilo de vida).
  </li>
</ul>

<h2>Preguntas frecuentes</h2>
<h3>¿Cuánto debería gastar en gastos hormiga al mes?</h3>
<p>
  No hay una regla única, pero una buena referencia es que los gastos discrecionales
  pequeños no superen el 10–15% de tu ingreso neto. Con un sueldo de S/3,000, eso
  es entre S/300 y S/450 al mes para la categoría completa. Si estás gastando más,
  tienes margen de mejora.
</p>

<h3>¿El café de todos los días me arruina?</h3>
<p>
  No por sí solo. El problema no es el café — es la suma de todos los gastos
  hormiga juntos. Un café de S/8 al día son S/2,920 al año, que es significativo.
  Pero si es el único gasto hormiga que tienes y el resto de tus finanzas están
  ordenadas, no es un problema urgente.
</p>

<h3>¿Cómo sé cuáles son mis gastos hormiga actuales?</h3>
<p>
  La forma más rápida es conectar <a href="${WA_LINK}">Neto por WhatsApp</a>. En
  2 minutos te muestra tus gastos del último mes organizados por categoría. Sin
  hacer nada manual — solo conectas tu Gmail y Neto hace el trabajo.
</p>
`,

  "como-controlar-gastos-personales-peru": `
<h2>El problema real de las finanzas personales en Perú</h2>
<p>
  La mayoría de peruanos no tiene un sistema para controlar sus gastos. No porque
  no quieran, sino porque las herramientas disponibles no se adaptan a cómo
  realmente manejamos la plata aquí.
</p>
<p>
  Usamos Yape para el almuerzo, tarjeta para el supermercado, efectivo para el taxi,
  Plin para la comida del fin de semana. <strong>Todo está fragmentado en 3–5 medios
  de pago diferentes</strong>. Ninguna app te muestra todo junto, consolidado y
  categorizado automáticamente.
</p>
<p>
  Resultado: llegas a fin de mes sin saber exactamente en qué se fue tu sueldo.
  Sabes que pagaste el alquiler y los servicios. Pero el resto — esa plata que
  "desapareció" — es un misterio.
</p>
<p>
  El primer paso para resolver este problema no es disciplina ni fuerza de voluntad.
  Es <strong>visibilidad</strong>. Antes de controlar, necesitas ver. Antes de ver,
  necesitas datos. Y para tener datos sin volverse loco, necesitas automatización.
</p>

<h2>El ciclo vicioso del "ya empiezo el lunes"</h2>
<p>
  Hay un patrón muy común: cada vez que alguien decide controlar sus gastos, empieza
  fuerte los primeros días. Descarga una app, anota los primeros gastos, se siente
  productivo. Luego el ritmo de vida se impone, se olvida de anotar una compra, y
  después de una semana de datos incompletos, abandona.
</p>
<p>
  El problema no es la persona — es el sistema. Cualquier sistema que requiera
  acción manual y disciplina constante está condenado a fallar con el tiempo.
  Los hábitos que se sostienen son los que tienen <strong>fricción mínima</strong>.
</p>
<p>
  Por eso el control de gastos moderno no se trata de anotar más — se trata de
  automatizar más. Si quieres entender por dónde empezar,
  <a href="/blog/en-que-gasto-mi-plata">este artículo explica cómo saber a dónde va
  tu plata en 2 minutos</a>.
</p>

<h2>Método 1: La regla 50/30/20 adaptada a Perú</h2>
<p>
  Este método divide tu sueldo en tres categorías. Es simple, funciona para la
  mayoría de situaciones y da un marco claro para tomar decisiones:
</p>
<ul>
  <li><strong>50% — Necesidades:</strong> alquiler, servicios (luz, agua, internet), comida del día, transporte al trabajo, medicamentos, colegios.</li>
  <li><strong>30% — Gustos:</strong> salidas, delivery, ropa, suscripciones (Netflix, Spotify), entretenimiento, viajes.</li>
  <li><strong>20% — Ahorro y deudas:</strong> fondo de emergencia, cuotas de préstamos, ahorro para metas específicas.</li>
</ul>
<p>
  <strong>Ejemplo con un sueldo de S/3,000:</strong>
</p>
<ul>
  <li>Necesidades (50%): S/1,500 — alquiler S/800 + comida S/400 + servicios S/200 + transporte S/100</li>
  <li>Gustos (30%): S/900 — salidas S/300 + delivery S/200 + ropa S/200 + suscripciones S/200</li>
  <li>Ahorro (20%): S/600 — fondo de emergencia S/300 + pago deuda S/300</li>
</ul>
<p>
  <strong>¿La realidad en Perú?</strong> El 50% para necesidades puede ser difícil
  en Lima: solo el alquiler en un distrito medio ya consume S/800–S/1,200. Si tu
  alquiler es S/1,200 con un sueldo de S/3,000, ya estás en 40% solo en renta.
  En ese caso, ajusta la regla a tus circunstancias — lo importante es el
  <em>principio</em>, no los porcentajes exactos.
</p>

<h2>Método 2: Control por categoría (el más efectivo)</h2>
<p>
  En vez de rastrear cada sol, agrupa tus gastos en categorías y pon un tope mensual
  a cada una. Funciona especialmente bien porque <strong>no requiere revisar cada
  transacción</strong> — solo monitoreas si te pasas de la categoría.
</p>
<p>Categorías recomendadas para el contexto peruano:</p>
<ul>
  <li><strong>Comida en casa:</strong> supermercado, mercado, Tottus, Metro</li>
  <li><strong>Comida fuera y delivery:</strong> restaurantes, Rappi, PedidosYa, cafés</li>
  <li><strong>Transporte:</strong> combi, Metropolitano, taxi, Uber, InDriver, combustible</li>
  <li><strong>Entretenimiento:</strong> cine, salidas, suscripciones, juegos</li>
  <li><strong>Ropa y cuidado personal:</strong> ropa, zapatos, peluquería, cosméticos</li>
  <li><strong>Servicios del hogar:</strong> luz, agua, internet, teléfono</li>
  <li><strong>Salud:</strong> medicamentos, consultas, seguro de salud</li>
  <li><strong>Ahorro / inversión:</strong> este es el que más peruanos olvidan incluir</li>
</ul>
<p>
  El truco: <strong>asigna el ahorro como si fuera un gasto fijo</strong>. No ahorres
  "lo que sobra" — ese modelo nunca funciona. Separa el ahorro el primer día del mes,
  igual que pagas el alquiler.
</p>

<h2>Método 3: El presupuesto cero</h2>
<p>
  Este método avanzado consiste en asignar cada sol de tu sueldo a una categoría
  específica antes de empezar el mes, de modo que Ingresos - Gastos = 0. No
  significa que gastas todo — significa que tienes un destino definido para
  cada sol, incluyendo el ahorro.
</p>
<p>
  Ejemplo con S/3,000:
</p>
<ol>
  <li>Alquiler: S/900</li>
  <li>Comida en casa: S/400</li>
  <li>Transporte: S/200</li>
  <li>Servicios: S/200</li>
  <li>Delivery/salidas: S/200</li>
  <li>Ropa: S/100</li>
  <li>Entretenimiento: S/150</li>
  <li>Fondo de emergencia: S/300</li>
  <li>Pago deuda: S/250</li>
  <li>Ahorro meta: S/300</li>
  <li><strong>Total asignado: S/3,000</strong></li>
</ol>
<p>
  El presupuesto cero requiere más planificación al inicio, pero es el método que
  más control da sobre tus finanzas.
</p>

<h2>Método 4: La eliminación quirúrgica (para empezar ya)</h2>
<p>
  Si no quieres complicarte con porcentajes ni categorías todavía, usa este método
  de entrada:
</p>
<ol>
  <li>Revisa tu estado de cuenta del último mes.</li>
  <li>Identifica 3 gastos recurrentes que <strong>no necesitas o casi no usas</strong>.</li>
  <li>Elimínalos. Solo 3.</li>
</ol>
<p>Ejemplos comunes en Perú:</p>
<ul>
  <li>¿Ves HBO y Disney+ además de Netflix? Elige una — ahorras S/40–S/60/mes.</li>
  <li>¿Delivery 3 veces por semana? Bája a 1 — ahorras S/180/mes fácil.</li>
  <li>¿Café de cadena todos los días? Llévalo de casa 3 de 5 días — ahorras S/130/mes.</li>
</ul>
<p>
  Tres cambios. Sin cambiar el resto de tu vida. S/350–S/370 al mes de ahorro potencial.
  Una vez que tienes eso bajo control, amplías el sistema.
</p>

<h2>Por qué las apps de finanzas no funcionan (y qué sí funciona)</h2>
<p>
  Las apps tradicionales como Money Manager, Wallet o Fintonic fallan por la misma razón:
  <strong>te piden ingresar cada gasto a mano</strong>. La promesa es que si anotes
  todo durante un mes, tendrás claridad sobre tus gastos. La realidad es que
  la mayoría abandona antes de la semana 2.
</p>
<p>
  Las hojas de cálculo tienen el mismo problema con más complejidad técnica encima.
  La solución no es más disciplina — es eliminar la necesidad de disciplina.
</p>
<p>
  El enfoque que sí funciona a largo plazo es un sistema que <strong>trabaje solo</strong>.
  Que lea tus gastos automáticamente y te muestre el resumen sin que hagas nada.
  <a href="/">Neto</a> hace exactamente eso: lee las notificaciones que tu banco
  ya te envía por correo, categoriza todo con IA, y te manda un resumen por
  WhatsApp cuando quieras o de forma automática.
</p>
<p>
  Si tienes curiosidad sobre qué bancos son compatibles y cómo funciona sin dar
  contraseñas, <a href="/blog/bancos-peru-rastrear-sin-contrasena">lee este artículo
  sobre los 11 bancos peruanos que puedes rastrear sin entregar credenciales</a>.
</p>

<h2>Herramientas gratuitas vs de pago</h2>
<p>Antes de gastar en herramientas, prueba el nivel gratuito:</p>
<ul>
  <li><strong>Excel / Google Sheets:</strong> Gratis, flexible, pero manual. Funciona si tienes disciplina para mantenerte al día.</li>
  <li><strong>App de tu banco:</strong> Muestra transacciones, pero sin categorización automática y sin consolidar múltiples bancos.</li>
  <li><strong>Neto (plan gratis):</strong> Lee correos bancarios automáticamente, categoriza con IA, resumen por WhatsApp. Sin costo.</li>
</ul>
<p>
  La regla: no pagues por una herramienta de finanzas hasta que hayas probado que
  la usarías. La mayoría de personas que compra una app premium la abandona en 30 días.
</p>

<h2>Plan de acción de 30 días</h2>
<ol>
  <li><strong>Día 1:</strong> Conecta <a href="${WA_LINK}">Neto por WhatsApp</a> (2 minutos, gratis). Obtén tu primer resumen de gastos del mes actual.</li>
  <li><strong>Días 2–7:</strong> Solo observa. Sin juzgar ni cambiar nada. El objetivo es entender tus patrones reales.</li>
  <li><strong>Semana 2:</strong> Identifica tus 3 categorías con más gasto. Elige una para reducir en 20%.</li>
  <li><strong>Semana 3:</strong> Implementa el presupuesto de esa categoría. Usa las alertas de Neto para saber cuándo te acercas al tope.</li>
  <li><strong>Semana 4:</strong> Evalúa. ¿Lo lograste? ¿Qué fue difícil? Ajusta para el mes siguiente.</li>
</ol>

<h2>Errores comunes que evitar</h2>
<ul>
  <li>
    <strong>Intentar cambiarlo todo de golpe:</strong> La restricción total genera rebote.
    Reduce gradualmente y sosteniblemente.
  </li>
  <li>
    <strong>No contar el efectivo:</strong> En Perú el efectivo sigue siendo relevante.
    Si pagas con efectivo, al menos anota los gastos grandes de efectivo semanalmente.
  </li>
  <li>
    <strong>Olvidar los gastos irregulares:</strong> El cumpleaños, el regalo de navidad,
    la reparación del celular. Crea una categoría "extras" con un presupuesto mensual
    pequeño — así no te sorprenden.
  </li>
</ul>

<h2>Preguntas frecuentes</h2>

<h3>¿Cuánto tiempo tarda en verse resultados al controlar los gastos?</h3>
<p>
  En el primer mes vas a ganar visibilidad: sabrás exactamente en qué gastas.
  El cambio real en tu saldo bancario empieza desde el segundo o tercer mes, cuando
  ya has ajustado algunos hábitos. La mejora sostenida tarda entre 3 y 6 meses.
</p>

<h3>¿Qué pasa si tengo deudas y no llega el sueldo?</h3>
<p>
  Primero necesitas ver el panorama completo: ingresos, gastos fijos, deudas.
  Con eso claro, puedes priorizar. La regla general: primero cubres necesidades
  básicas, luego el mínimo de deudas para no acumular intereses, luego cualquier
  excedente va a pagar la deuda con mayor tasa.
</p>

<h3>¿Sirve de algo controlar los gastos si el sueldo es muy bajo?</h3>
<p>
  Sí, aunque con limitaciones. Con ingresos muy bajos, el margen de maniobra es
  pequeño. Pero aún en esos casos, la visibilidad ayuda: muchas personas descubren
  S/50–S/100 de gastos que pueden eliminar sin afectar su calidad de vida.
  Además, los hábitos de control son más fáciles de mantener cuando los ingresos
  mejoran si ya los tienes practicados.
</p>
`,

  "en-que-gasto-mi-plata": `
<h2>El problema: no sabes a dónde va tu sueldo</h2>
<p>
  Cobras el 15 o el 30. Pagas alquiler, servicios, alguna deuda. Y de repente
  es día 20 y ya no tienes plata. ¿En qué se fue? No tienes idea.
</p>
<p>
  No eres el único. La mayoría de peruanos no puede responder con exactitud
  "¿en qué gasté mi plata este mes?". Y no es por falta de interés — es porque
  <strong>no existe una forma fácil de saberlo</strong>.
</p>
<p>
  Tu banco muestra transacciones. Yape te manda notificaciones. Pero nadie te da
  una foto completa, organizada por categoría, de cómo gastas tu plata real. Hasta
  ahora.
</p>

<h2>Por qué es tan difícil rastrear tus gastos</h2>
<ul>
  <li>
    <strong>Múltiples medios de pago:</strong> Yape, tarjeta de débito, tarjeta de
    crédito, Plin, efectivo. Tu plata está fragmentada en al menos 3–5 canales
    diferentes. Ningún banco ni billetera te muestra todo junto.
  </li>
  <li>
    <strong>Nadie anota cada gasto:</strong> Las apps que te piden ingresar cada
    compra manualmente se abandonan en 3–7 días. Es una promesa que ningún ser
    humano real cumple a largo plazo.
  </li>
  <li>
    <strong>Los bancos no categorizan:</strong> Tu estado de cuenta muestra
    "POS WONG 12345" o "TRANSF RECIBIDA YAPE". No dice "comida" ni "transporte".
    Interpretar eso es trabajo que nadie quiere hacer.
  </li>
  <li>
    <strong>El efectivo es invisible:</strong> Lo que pagas con billetes no deja
    rastro en ningún sistema. En Perú, el efectivo sigue siendo entre el 15–25%
    del gasto cotidiano en muchos hogares.
  </li>
</ul>

<h2>Las 5 categorías donde más se pierden los peruanos</h2>
<p>
  Basado en el comportamiento de gasto de usuarios de Neto en Lima y otras ciudades
  del Perú, estas son las categorías que más sorprenden a las personas cuando ven
  sus datos reales por primera vez:
</p>
<ol>
  <li>
    <strong>Delivery y comida fuera:</strong> Promedio de S/380–S/480 al mes para
    alguien que come fuera o pide delivery 3–4 veces por semana. Muchos usuarios
    pensaban que gastaban S/200.
  </li>
  <li>
    <strong>Transporte (incluyendo impulso):</strong> Entre taxis "porque es tarde",
    Uber al centro y el transporte público, el promedio en Lima supera S/200/mes
    para trabajadores que usan transporte mixto.
  </li>
  <li>
    <strong>Suscripciones digitales:</strong> El promedio de plataformas activas por
    usuario peruano es de 3–4. Con precios de S/20–S/45 cada una, son entre S/80–S/150
    al mes. Muchas con uso mínimo.
  </li>
  <li>
    <strong>Antojos y compras impulsivas:</strong> Las compras de menos de S/30 que
    "no cuentan". Suman S/100–S/200 al mes en la mayoría de perfiles.
  </li>
  <li>
    <strong>Tragos y salidas sociales:</strong> Una salida "tranquila" con amigos puede
    costar S/60–S/150 fácilmente. Para personas que salen 2–3 veces al mes, esto
    es S/150–S/350.
  </li>
</ol>

<h2>La solución: que la tecnología lo haga por ti</h2>
<p>
  Tu banco ya te envía un correo cada vez que haces una transacción. Yape y
  Plin hacen lo mismo. El problema no es la falta de datos — es que
  <strong>nadie los está organizando por ti</strong>.
</p>
<p>
  <a href="/">Neto</a> lee esos correos automáticamente, los categoriza con IA
  (comida, transporte, entretenimiento, servicios...) y te manda un resumen
  organizado por WhatsApp. Sin descargar apps, sin anotar nada.
</p>
<p>
  ¿Quieres saber cómo funciona técnicamente y qué bancos son compatibles?
  Lee <a href="/blog/bancos-peru-rastrear-sin-contrasena">cómo Neto rastrea
  11 bancos peruanos sin pedirte contraseñas</a>.
</p>

<h2>Cómo funciona en 3 pasos</h2>
<ol>
  <li>
    <strong>Escríbele a Neto por WhatsApp</strong> — un mensaje de "Hola" al
    +51 933 014 505. Neto te guía paso a paso.
  </li>
  <li>
    <strong>Conecta tu Gmail con un clic</strong> — Neto solo lee los correos de
    notificaciones bancarias, nunca tus correos personales, laborales ni de otra
    índole. El acceso es de solo lectura.
  </li>
  <li>
    <strong>Recibe tu resumen</strong> — Neto te manda por WhatsApp tus gastos
    organizados por categoría, con montos y porcentajes. Puedes pedir tu resumen
    cuando quieras o configurar envíos automáticos.
  </li>
</ol>

<h2>¿Qué ves exactamente?</h2>
<p>Un resumen típico de Neto se ve así:</p>
<blockquote>
  "Esta semana gastaste S/847. Tu top 3: Comida S/380 (45%), Transporte S/220 (26%),
  Entretenimiento S/150 (18%). Te quedan S/403 de tu presupuesto. Tip: Comida subió
  20% vs la semana pasada."
</blockquote>
<p>
  Con esa información puedes tomar decisiones reales. No adivinanzas, no
  estimaciones — <strong>datos exactos de tu propia plata</strong>.
</p>
<p>
  Además del resumen por WhatsApp, tienes un dashboard web con gráficos, historial
  de transacciones, y métricas avanzadas incluyendo tu
  <a href="/score-financiero">score de salud financiera 0–100</a>.
</p>

<h2>Cómo analizar tu estado de cuenta paso a paso</h2>
<p>
  Si prefieres empezar por tu cuenta antes de usar Neto, aquí está el proceso manual:
</p>
<ol>
  <li>
    <strong>Descarga todos tus estados de cuenta del mes:</strong> Cada banco, cada
    tarjeta, cada billetera digital (Yape, Plin). La mayoría los genera en PDF
    desde la app o web.
  </li>
  <li>
    <strong>Lista todas las transacciones en una sola tabla:</strong> Fecha, comercio,
    monto, medio de pago. Excel o Google Sheets son suficientes.
  </li>
  <li>
    <strong>Asigna una categoría a cada transacción:</strong> Comida, transporte,
    entretenimiento, salud, servicios, etc. Las primeras veces toma tiempo. Con
    Neto esto es automático.
  </li>
  <li>
    <strong>Suma por categoría:</strong> ¿Cuánto fue a comida? ¿A transporte?
    ¿A ocio? Los totales son reveladores.
  </li>
  <li>
    <strong>Compara con tu ingreso neto:</strong> ¿Qué porcentaje de tu sueldo fue
    a cada categoría? ¿Qué porcentaje te sobró (o faltó)?
  </li>
</ol>
<p>
  Este proceso manual toma entre 45 minutos y 2 horas la primera vez. Neto lo hace
  automáticamente y actualiza en tiempo real.
</p>

<h2>El truco del "presupuesto asignado"</h2>
<p>
  Una vez que sabes en qué gastas, el paso siguiente es decidir en qué <em>quieres</em>
  gastar. Este es el principio del presupuesto asignado:
</p>
<ol>
  <li>Al inicio de cada mes, asigna un monto a cada categoría basado en tus datos reales del mes anterior.</li>
  <li>Define qué categorías quieres reducir y en cuánto.</li>
  <li>Monitorea durante el mes si te estás pasando o no de cada categoría.</li>
</ol>
<p>
  El objetivo no es restricción — es <strong>intención</strong>. Gastar
  S/350 en delivery de forma consciente ("sé que gasto esto y lo acepto") es
  completamente diferente a gastar S/350 sin saberlo.
</p>

<h2>¿Qué hacer cuando encuentras un gasto que no recuerdas?</h2>
<p>
  Pasa más seguido de lo que crees. Revisas tu estado de cuenta y hay cargos que
  no recuerdas. Antes de asustarte:
</p>
<ul>
  <li>
    <strong>Revisa si es un cargo recurrente:</strong> Suscripciones, seguros automáticos,
    planes de telefonía. Muchos cargos son legítimos pero olvidados.
  </li>
  <li>
    <strong>Busca el nombre del comercio en Google:</strong> Muchas veces "CLXQR3918" es
    el nombre técnico de un servicio conocido.
  </li>
  <li>
    <strong>Si no lo reconoces después de buscar:</strong> Llama a tu banco. Puede ser
    un cargo duplicado, un error, o en casos raros, fraude.
  </li>
</ul>
<p>
  Neto detecta automáticamente cargos recurrentes y los agrupa, así puedes ver de un
  vistazo qué suscripciones tienes activas y cuánto pagan exactamente al mes.
</p>

<h2>¿Es seguro conectar tu Gmail a Neto?</h2>
<p>
  Neto <strong>nunca accede a tu banca en línea</strong>. No te pide usuario ni
  contraseña bancaria. Solo lee los correos de notificación que tu banco ya
  te envía — los mismos que llegarían aunque no usaras Neto.
</p>
<p>
  El acceso se hace via OAuth de Google (el mismo sistema que usan apps como
  Notion, Slack o Zoom para conectarse a Gmail). El permiso es de solo lectura
  sobre correos de remitentes bancarios específicos.
</p>
<p>
  Puedes desconectar el acceso en cualquier momento desde
  <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>.
</p>

<h2>Preguntas frecuentes</h2>

<h3>¿Cuánto tiempo demora ver el primer resumen de gastos?</h3>
<p>
  Con Neto, el proceso completo desde que escribes "Hola" por WhatsApp hasta
  que recibes tu primer resumen de gastos toma menos de 5 minutos. Solo necesitas
  tu celular y acceso a Gmail.
</p>

<h3>¿Qué pasa con los gastos en efectivo?</h3>
<p>
  Neto no puede leer pagos en efectivo ya que no dejan rastro en correos bancarios.
  Para esos gastos puedes anotarlos manualmente enviando un mensaje a Neto por
  WhatsApp: "Gasté S/30 en mercado hoy". Neto lo registra y lo incluye en tu
  resumen.
</p>

<h3>¿Puedo ver gastos de meses anteriores?</h3>
<p>
  Sí. Neto puede procesar correos bancarios de hasta los últimos 6–12 meses
  (dependiendo de qué tan atrás lleguen los correos en tu Gmail). Así puedes
  ver patrones históricos desde el primer día.
</p>
`,

  "bancos-peru-rastrear-sin-contrasena": `
<h2>¿Cómo puedes rastrear tu banco sin dar tu contraseña?</h2>
<p>
  La pregunta más común que recibimos es: "¿Cómo leen mi banco sin mi
  contraseña?". La respuesta es simple: <strong>no leemos tu banco. Leemos tu
  correo.</strong>
</p>
<p>
  Cada vez que haces una compra con tarjeta, recibes un correo de tu banco.
  Cada vez que recibes una transferencia por Yape, llega un correo. Cada vez
  que pagas un servicio, tu banco te notifica por email.
</p>
<p>
  Neto lee esas notificaciones automáticamente, extrae el monto, el comercio
  y la fecha, y las categoriza con IA. Eso es todo. <strong>Cero acceso a tu
  banca en línea, cero contraseñas bancarias.</strong>
</p>

<h2>Screen scraping vs email parsing: la diferencia de seguridad</h2>
<p>
  Existen dos tecnologías principales para rastrear gastos financieros automáticamente,
  y tienen niveles de riesgo completamente diferentes:
</p>
<h3>Screen scraping (el método riesgoso)</h3>
<p>
  Algunas apps te piden tu usuario y contraseña bancaria. Luego se conectan a tu
  banco simulando ser tú, navegan las pantallas y extraen la información. Esto se
  llama "screen scraping" y tiene problemas graves:
</p>
<ul>
  <li>Le estás dando tus credenciales a un tercero — si la app es hackeada, tu banco también lo es.</li>
  <li>Viola los términos de servicio de casi todos los bancos peruanos.</li>
  <li>Si algo sale mal, el banco puede negarte responsabilidad porque "tú compartiste tus credenciales".</li>
  <li>Es técnicamente ilegal en muchos países bajo leyes de acceso no autorizado.</li>
</ul>
<h3>Email parsing (el método de Neto)</h3>
<p>
  Neto no accede a tu banca en línea para nada. Solo lee los correos de notificación
  que tu banco ya te envía automáticamente. Este método es:
</p>
<ul>
  <li><strong>Sin riesgo de credenciales:</strong> Nunca pedimos tu usuario ni contraseña bancaria.</li>
  <li><strong>Autorizado explícitamente por ti:</strong> Tú das permiso via OAuth de Google.</li>
  <li><strong>Revocable en cualquier momento:</strong> Puedes cancelar el acceso con un clic.</li>
  <li><strong>No viola términos bancarios:</strong> No accedemos a la banca en línea.</li>
</ul>

<h2>Los bancos y billeteras compatibles</h2>

<h3>Bancos principales</h3>
<ol>
  <li>
    <strong>BCP (Banco de Crédito del Perú)</strong> — El banco más grande del Perú y el
    que mejor cobertura de notificaciones tiene. Compatibles: cuenta de ahorros, cuenta
    corriente, tarjetas de crédito Visa y Mastercard. Detecta compras, transferencias
    interbancarias, pagos de servicios y retiros en cajero. Los correos de BCP llegan en
    tiempo real por cada transacción.
  </li>
  <li>
    <strong>BBVA Perú</strong> — Segundo banco más grande. Compatible con cuentas de
    ahorro y corriente y todas las tarjetas. Detecta compras nacionales e internacionales,
    transferencias, pagos automáticos de servicios y cuotas de préstamos.
  </li>
  <li>
    <strong>Interbank</strong> — Totalmente compatible. Las notificaciones de Interbank
    son especialmente detalladas: incluyen el nombre del comercio, la categoría del
    establecimiento y el monto exacto en PEN o USD.
  </li>
  <li>
    <strong>Scotiabank Perú</strong> — Compatible con notificaciones de compra, transferencias
    y cargos de suscripciones. Los correos de Scotiabank tardan 1–3 minutos en llegar
    tras la transacción.
  </li>
</ol>

<h3>Billeteras digitales</h3>
<ol start="5">
  <li>
    <strong>Yape</strong> — La billetera más usada del Perú. Neto detecta tanto los pagos
    que haces como los que recibes. Muy útil para rastrear gastos de mercado, restaurantes
    y comercios pequeños que no usan POS.
  </li>
  <li>
    <strong>Plin</strong> — Compatible con transferencias entre bancos vía Plin. Detecta
    pagos salientes y entradas. Especialmente útil para dividir gastos con amigos.
  </li>
</ol>

<h3>Bancos adicionales compatibles</h3>
<ol start="7">
  <li><strong>BanBif</strong> — Cuenta corriente y de ahorros. Notificaciones de transacciones y transferencias.</li>
  <li><strong>Banco Pichincha</strong> — Compatible con notificaciones de movimientos y transferencias recibidas.</li>
  <li><strong>Banco Falabella</strong> — Tarjeta CMR. Detecta compras en tiendas Falabella y otros establecimientos, así como pagos de cuota mensuales.</li>
  <li><strong>Banco Ripley</strong> — Tarjeta Ripley. Compras en tiendas y estados de cuenta.</li>
  <li><strong>MiBanco</strong> — Cuenta básica. Depósitos y retiros. Muy usado por emprendedores y negocios pequeños.</li>
</ol>

<h2>¿Tu banco no está en la lista?</h2>
<p>
  Escríbenos a <a href="mailto:hola@neto.pe">hola@neto.pe</a> con el nombre de
  tu banco y lo activamos. Solo necesitamos una muestra del correo de
  notificación que tu banco envía para configurar el parser. En la mayoría de
  casos lo activamos en menos de 48 horas.
</p>
<p>
  También estamos trabajando en integrar Financiera Oh!, Caja Arequipa y Caja
  Cusco, entre otras entidades financieras peruanas. Si usas alguna de estas,
  avísanos y las priorizamos.
</p>

<h2>¿Qué información NO puede ver Neto?</h2>
<p>
  Esta es la lista de lo que Neto <strong>nunca</strong> puede ver, por diseño:
</p>
<ul>
  <li><strong>Tu saldo bancario real:</strong> Solo procesamos las notificaciones de transacciones, no tu saldo actual.</li>
  <li><strong>Tu contraseña bancaria:</strong> Nunca la pedimos, nunca la necesitamos.</li>
  <li><strong>Tus correos personales o laborales:</strong> El filtro de remitentes bancarios es específico — solo procesamos correos de dominios bancarios conocidos.</li>
  <li><strong>Tu token de Yape/Plin:</strong> Solo leemos las confirmaciones por email que ya recibiste.</li>
  <li><strong>Datos biométricos ni PIN:</strong> No tenemos acceso a ninguna autenticación de tu banco.</li>
</ul>

<h2>Cómo funciona la conexión técnicamente</h2>
<p>
  El proceso usa OAuth 2.0 de Google — el mismo estándar de seguridad que usan
  Notion, Slack, Zoom y miles de aplicaciones corporativas para conectarse a Gmail.
</p>
<ol>
  <li>Abres el link de autorización que Neto te envía por WhatsApp.</li>
  <li>Google te muestra exactamente qué permiso estás dando: "Neto puede leer correos de notificaciones bancarias".</li>
  <li>Tú apruebas. Google envía a Neto un token de acceso limitado — nunca tu contraseña.</li>
  <li>Neto usa ese token para leer solo los correos que coinciden con remitentes bancarios. No puede leer ningún otro correo.</li>
</ol>
<p>
  Puedes revocar el acceso en cualquier momento desde
  <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer">myaccount.google.com/permissions</a>.
  Si revocas, Neto pierde el acceso inmediatamente y no puede leer correos nuevos.
</p>

<h2>¿Qué pasa si cambio de banco o de correo?</h2>
<p>
  <strong>Cambio de banco:</strong> Si empiezas a usar un banco nuevo, solo necesitas
  asegurarte de que las notificaciones del banco nuevo lleguen al mismo Gmail conectado.
  Neto las detectará automáticamente si el banco está en la lista de compatibles.
</p>
<p>
  <strong>Cambio de correo:</strong> Si migras a otro Gmail, necesitas reconectar Neto
  con el nuevo correo. El proceso toma menos de 2 minutos. El historial del correo
  anterior se puede exportar.
</p>

<h2>¿Es seguro desde el punto de vista de privacidad de datos?</h2>
<p>
  Los datos de transacciones se almacenan en servidores con cifrado AES-256. La
  base de datos usa Row-Level Security (RLS) de Supabase, lo que significa que
  cada usuario solo puede acceder a sus propios datos — ni siquiera el equipo de
  Neto puede ver tus transacciones individuales en producción.
</p>
<p>
  Los datos no se venden a terceros ni se usan para ningún propósito fuera del
  servicio. Puedes leer la política completa en <a href="/privacidad">nuestra
  política de privacidad</a>.
</p>

<h2>Empieza gratis</h2>
<p>
  Si quieres ver cómo funciona en la práctica,
  <a href="${WA_LINK}">escríbele a Neto por WhatsApp</a>. En 2 minutos
  conectas tu primer banco y ves tus gastos organizados automáticamente.
  Sin contraseñas bancarias. Sin apps que descargar.
</p>
<p>
  ¿Quieres entender qué hace Neto con esa información una vez que la lee?
  <a href="/blog/asistente-financiero-whatsapp-peru">Lee aquí cómo funciona
  el asistente financiero completo</a>.
</p>

<h2>Preguntas frecuentes sobre seguridad</h2>

<h3>¿Puede Neto hacer transferencias o pagos desde mi cuenta?</h3>
<p>
  No. Absolutamente no. El acceso OAuth que otorgas a Neto es solo de lectura
  sobre correos de Gmail. Neto no tiene ningún acceso a tu banca en línea,
  no puede hacer movimientos, no puede iniciar transferencias.
</p>

<h3>¿Qué pasa si Neto es hackeado?</h3>
<p>
  En el peor escenario hipotético, un atacante podría ver el historial de
  transacciones (montos, comercios, fechas) almacenado en Neto — pero no
  podría acceder a tu banca en línea, ya que Neto no almacena credenciales
  bancarias. La arquitectura está diseñada para minimizar el valor de
  cualquier dato comprometido.
</p>

<h3>¿Recomienda Neto compartir contraseñas bancarias?</h3>
<p>
  Nunca. Si alguna app de finanzas te pide tu usuario y contraseña bancaria,
  no la uses. Ninguna herramienta legítima necesita tus credenciales bancarias
  directas. Las alternativas seguras como Neto usan email parsing o APIs
  bancarias oficiales.
</p>
`,

  "asistente-financiero-whatsapp-peru": `
<h2>¿Qué es un asistente financiero por WhatsApp?</h2>
<p>
  Es exactamente lo que suena: un asistente que te ayuda con tu plata y vive
  en WhatsApp. Le escribes, te responde. Le preguntas cuánto gastaste, te
  dice. Le pides un resumen de la semana, te lo manda.
</p>
<p>
  No es una app que descargas. No es un Excel que llenas. No es un curso de
  finanzas. Es <strong>una conversación por WhatsApp que te ayuda a ordenar
  tu plata</strong>.
</p>
<p>
  En el contexto peruano, esto importa especialmente: somos un país donde la
  mayoría de decisiones financieras del día a día se toman en el celular, entre
  un Yape, una consulta al banco y un pago de servicio — todo en el mismo
  dispositivo donde ya tenemos WhatsApp abierto todo el día.
</p>

<h2>¿Por qué WhatsApp y no una app?</h2>
<p>
  En Perú, WhatsApp es la app más usada. Más que Facebook, más que Instagram,
  más que cualquier otra. <strong>Más del 90% de los peruanos con smartphone
  usa WhatsApp todos los días.</strong>
</p>
<p>
  Entonces, ¿por qué obligarte a descargar otra app? Neto va donde ya estás.
  Sin ocupar espacio en tu celular, sin recordar otra contraseña, sin aprender
  otra interfaz. Si sabes escribir un WhatsApp, sabes usar Neto.
</p>
<p>
  Además, el modelo de WhatsApp elimina las barreras de fricción que matan la
  adopción de apps financieras. No necesitas abrir la app, recordar abrirla,
  ni mantener el hábito. El asistente está en el mismo lugar donde ya revisas
  mensajes todos los días.
</p>

<h2>¿Para quién es Neto?</h2>
<p>
  Neto es para cualquier peruano que quiera entender sus finanzas sin complicarse.
  Pero especialmente útil para:
</p>
<ul>
  <li>
    <strong>Profesionales con ingresos fijos:</strong> Ganan bien pero no saben
    a dónde se va la plata. Neto les da visibilidad sin esfuerzo.
  </li>
  <li>
    <strong>Parejas que comparten gastos:</strong> La función de espacios compartidos
    permite rastrear gastos del hogar juntos sin conflictos por "quién gastó qué".
  </li>
  <li>
    <strong>Personas con varias cuentas y tarjetas:</strong> BCP + BBVA + Yape +
    Plin — todo centralizado en un solo resumen.
  </li>
  <li>
    <strong>Alguien que quiere empezar a ahorrar:</strong> La primera pregunta para
    ahorrar es "¿de dónde recorto?". Neto responde esa pregunta con datos.
  </li>
  <li>
    <strong>Emprendedores y freelancers:</strong> Separa gastos personales de gastos
    del negocio con categorías personalizadas.
  </li>
</ul>

<h2>Cómo funciona Neto</h2>
<h3>1. Se conecta a tu correo (una sola vez)</h3>
<p>
  Conectas tu Gmail con un clic usando OAuth de Google. Neto recibe permiso de
  solo lectura sobre correos de remitentes bancarios específicos.
  No accede a tu banca en línea ni te pide contraseñas bancarias. Funciona con
  BCP, BBVA, Interbank, Scotiabank, Yape, Plin y 5 bancos más.
</p>
<p>
  Si quieres saber en detalle cómo funciona la seguridad de esta conexión,
  <a href="/blog/bancos-peru-rastrear-sin-contrasena">este artículo explica
  la diferencia entre email parsing y screen scraping</a>.
</p>

<h3>2. Lee y categoriza automáticamente</h3>
<p>
  Cada vez que llega un correo de tu banco, Neto lo procesa con IA: extrae
  el monto, identifica el comercio y asigna una categoría (comida, transporte,
  entretenimiento, servicios, etc.). Tú no haces absolutamente nada.
</p>
<p>
  Si una categorización está mal (por ejemplo, Neto categoriza un pago a tu
  gimnasio como "entretenimiento" cuando tú lo consideras "salud"), solo
  escríbele: "Cambia el cargo de SmartFit a salud". Neto lo corrige y aprende
  para el futuro.
</p>

<h3>3. Te manda resúmenes por WhatsApp</h3>
<p>
  Recibes resúmenes automáticos con tus gastos organizados. También puedes
  escribirle cuando quieras para preguntarle cosas como:
</p>
<ul>
  <li>"¿Cuánto gasté esta semana?"</li>
  <li>"¿Cuánto llevo en delivery este mes?"</li>
  <li>"¿Cuáles son mis suscripciones activas?"</li>
  <li>"Dame mi resumen del mes"</li>
  <li>"¿En qué gasté más hoy?"</li>
  <li>"¿Estoy dentro del presupuesto de comida?"</li>
</ul>

<h2>¿Qué puede hacer Neto?</h2>
<ul>
  <li>
    <strong>Resumen semanal y mensual:</strong> Gastos totales, por categoría,
    con porcentajes y comparación vs períodos anteriores.
  </li>
  <li>
    <strong>Alertas de presupuesto:</strong> Configura un tope mensual por categoría
    y Neto te avisa cuando te acercas.
  </li>
  <li>
    <strong>Categorización automática:</strong> IA que aprende tus patrones y
    categoriza con más del 90% de precisión.
  </li>
  <li>
    <strong>Score de salud financiera:</strong> Una puntuación de 0 a 100 que te
    dice qué tan bien van tus finanzas. Aprende más sobre
    <a href="/score-financiero">cómo funciona el score financiero de Neto</a>.
  </li>
  <li>
    <strong>Dashboard web:</strong> Además del WhatsApp, tienes un dashboard visual
    con gráficos detallados y historial completo.
  </li>
  <li>
    <strong>Detector de gastos hormiga:</strong> Neto identifica automáticamente
    los patrones de pequeños gastos recurrentes que más impacto tienen en tu presupuesto.
    <a href="/blog/gastos-hormiga-peru">¿Qué son los gastos hormiga?</a>
  </li>
  <li>
    <strong>Gestión de deudas:</strong> Registra a quién le debes y quién te debe.
    Neto te recuerda y lleva el seguimiento.
  </li>
  <li>
    <strong>Espacios compartidos:</strong> Para gastos de pareja o familia — rastrean
    juntos sin perder privacidad individual.
  </li>
</ul>

<h2>Casos de uso reales</h2>
<h3>Carlos, 29 años, Lima (analista en banca)</h3>
<p>
  "Pensaba que gastaba S/200 al mes en delivery. Neto me mostró que eran S/580.
  En tres meses bajé a S/180. Sin esfuerzo — solo sabiendo el dato real."
</p>

<h3>Valeria y Diego, pareja que comparte gastos de casa</h3>
<p>
  "Usamos los espacios compartidos de Neto. Ya no hay discusiones de 'tú gastaste
  más en la canasta'. Todo está registrado y es transparente para los dos."
</p>

<h3>Andrea, 35 años, freelancer</h3>
<p>
  "Tengo ingresos variables. Neto me ayuda a saber cuándo puedo gastar más y
  cuándo ajustar. Es la diferencia entre vivir con ansiedad financiera y tener
  claridad."
</p>

<h2>¿Cómo mejora tu vida financiera en 30 días?</h2>
<ol>
  <li><strong>Semana 1:</strong> Ves tus datos reales por primera vez. Probablemente te sorprende cuánto gastas en 1–2 categorías específicas.</li>
  <li><strong>Semana 2:</strong> Empiezas a ser más consciente de tus decisiones de gasto. No porque Neto te juzgue, sino porque ahora tienes números reales.</li>
  <li><strong>Semana 3:</strong> Puedes configurar tus primeros presupuestos por categoría. Neto te alerta si te pasas.</li>
  <li><strong>Semana 4:</strong> Compares tu gasto total con la semana 1. La diferencia es concreta.</li>
</ol>
<p>
  El cambio más común que reportan los usuarios en el primer mes: reducir entre
  S/150 y S/400 de gastos no esenciales sin sentir que se privaron de nada importante.
</p>

<h2>¿Cuánto cuesta?</h2>
<p>
  El plan gratis incluye: resumen de gastos por WhatsApp, categorización automática
  con IA, corrección de categorías, consultas en lenguaje natural y acceso al
  dashboard web básico. Gratis para siempre, sin tarjeta de crédito.
</p>
<p>
  El plan Pro (S/10/mes o S/99/año) añade: historial ilimitado, reportes PDF,
  presupuestos con alertas automáticas, score financiero detallado, espacios
  compartidos y acceso prioritario a nuevas funciones.
</p>
<p>
  Puedes pagar con <strong>Yape</strong> — somos el único asistente financiero
  en Perú que acepta Yape como método de pago.
</p>

<h2>Preguntas frecuentes</h2>

<h3>¿Neto funciona si mi banco no envía notificaciones por correo?</h3>
<p>
  La mayoría de bancos peruanos envían notificaciones por correo por defecto,
  pero a veces hay que activarlas. Revisa en la configuración de tu banca en
  línea que las notificaciones de transacciones estén habilitadas hacia tu
  Gmail. Si tienes dudas, escríbenos y te ayudamos.
</p>

<h3>¿Puedo usar Neto si tengo solo Yape y no tarjeta de banco?</h3>
<p>
  Sí. Neto es totalmente compatible con Yape como único medio de pago. Si
  recibes el correo de confirmación de Yape, Neto puede rastrear esos movimientos.
</p>

<h3>¿Hay una versión para negocios?</h3>
<p>
  Actualmente Neto está optimizado para finanzas personales. Si usas Neto para
  un negocio pequeño o freelance, funciona bien para separar categorías de
  gastos del negocio. Una versión específicamente diseñada para negocios está
  en el roadmap.
</p>
`,
};
