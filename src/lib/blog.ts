import { articleContent } from "./blog-content";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  /**
   * Solo si el contenido cambió materialmente después de `date` (YYYY-MM-DD). Alimenta el
   * `dateModified` del JSON-LD y la "Última actualización" visible, y el `<lastmod>` del sitemap
   * tiene que decir lo mismo (`verify-claims.mjs` lo exige). Sin él, las dos fechas son `date`.
   */
  dateModified?: string;
  /**
   * Se CALCULA del texto (`tiempoLectura`), no se escribe. Hasta el 12-sep-2026 era un "5 min"
   * tipeado a mano en cada post, que nadie volvía a tocar cuando el post cambiaba de largo.
   */
  readingTime: string;
  keywords: string[];
  content: string; // HTML content
  ogImage?: string; // Optional custom OG image URL (falls back to og-default.jpg)
  /**
   * Preguntas frecuentes del post. De este array salen la sección visible Y el FAQPage del
   * JSON-LD, así que no pueden decir cosas distintas. Texto plano: el JSON-LD no lleva HTML.
   * Google dejó de mostrar el resultado enriquecido de FAQ el 7-may-2026: el FAQ vale por lo que
   * le sirve al lector, no por un rich result que ya no existe (`docs/molde-blog.md`, sección 3).
   */
  faq?: { pregunta: string; respuesta: string }[];
}

type PostEscrito = Omit<BlogPost, "readingTime">;

/** Palabras por minuto de lectura en pantalla. El número es convención, no medición. */
const PALABRAS_POR_MINUTO = 200;

/** Minutos de lectura del cuerpo más la FAQ visible, redondeados y nunca menos de 1. */
export function tiempoLectura(post: PostEscrito): string {
  const faq = (post.faq ?? []).map((q) => `${q.pregunta} ${q.respuesta}`).join(" ");
  const texto = `${articleContent[post.slug] ?? ""} ${faq}`.replace(/<[^>]+>/g, " ");
  const palabras = texto.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(palabras / PALABRAS_POR_MINUTO))} min`;
}

/** Central registry — add new posts to the array. */
const escritos: PostEscrito[] = [
  {
    slug: "cuanto-cuesta-app-finanzas-personales-peru",
    title: "¿Cuánto cuesta una app de finanzas personales en Perú?",
    description:
      "Anotar gastos es gratis en casi todas. Lo que se cobra es lo de encima. Precios de Neto, Monefy, Wallet, Money Manager, Mobills y Spendee con su fuente oficial.",
    date: "2026-09-11",
    dateModified: "2026-09-12",
    keywords: [
      "cuánto cuesta una app de finanzas personales",
      "app de gastos gratis perú",
      "precio app control de gastos",
      "apps finanzas personales perú precio",
      "neto pro precio",
    ],
    content: "",
    faq: [
      {
        pregunta: "¿Hay apps de finanzas personales gratis en Perú?",
        respuesta:
          "Sí. Monefy, Wallet, Money Manager, Mobills y Spendee tienen versión gratuita, y en Neto registrar gastos es gratis siempre. Lo que cambia entre ellas es qué incluye lo gratis: en Neto, pasados los 14 días de prueba, ver el dashboard, el historial y el score es de Neto Pro.",
      },
      {
        pregunta: "¿Cuánto cuesta Neto?",
        respuesta:
          "Anotar gastos por WhatsApp o en la web cuesta S/0, siempre y sin límite. Neto Pro cuesta S/10 al mes o S/99 al año. Tu primer gasto activa 14 días de Pro sin pedirte tarjeta, se paga por Yape y no se renueva solo.",
      },
      {
        pregunta: "¿Qué pasa con mis datos si dejo de pagar Neto Pro?",
        respuesta:
          "Se quedan completos y puedes seguir anotando gratis. Lo que se cierra es la consulta: el dashboard, el historial y el score vuelven a abrirse cuando activas Pro de nuevo.",
      },
      {
        pregunta: "¿Conviene pagar el plan anual?",
        respuesta:
          "Solo si ya usaste la app unas semanas y sabes que la vas a seguir usando. En Neto el anual cuesta S/99 contra S/120 de doce meses sueltos. Si todavía estás probando, el mensual te deja salir sin perder plata.",
      },
      {
        pregunta: "¿Por qué algunas apps muestran precios en dólares o en reales?",
        respuesta:
          "Porque así los publican en su web: Spendee en dólares y Mobills en reales brasileños. Cuando compras dentro de la app desde un celular peruano, la App Store te muestra el cobro en soles, así que revisa ahí el precio final antes de pagar.",
      },
    ],
  },
  {
    slug: "controlar-gastos-yape-plin",
    title: "¿Cómo controlar tus gastos si pagas con Yape y Plin?",
    description:
      "Yape guarda tus yapeos y cada banco guarda tus plines, pero ninguna de esas apps ve lo que pagas en las otras. Cómo juntar todo en un solo lugar, paso a paso.",
    date: "2026-09-11",
    dateModified: "2026-09-12",
    keywords: [
      "controlar gastos yape",
      "controlar gastos plin",
      "presupuesto yape",
      "cómo ver mis gastos de yape",
      "registrar yapeos",
    ],
    content: "",
    faq: [
      {
        pregunta: "¿Neto se conecta a mi Yape o a mi banco?",
        respuesta:
          "No. Neto no se conecta a Yape, a Plin ni a ningún banco, y no te pide contraseñas. El gasto entra porque tú se lo mandas: la captura del yapeo o un mensaje como «almuerzo 18».",
      },
      {
        pregunta: "¿Qué lee Neto de una captura de Yape o Plin?",
        respuesta:
          "El monto, a quién le pagaste (o quién te pagó) y la fecha, y con eso le pone una categoría. Si la captura es de un yapeo que te hicieron, lo registra como ingreso y no como gasto.",
      },
      {
        pregunta: "¿Yape tiene historial de movimientos?",
        respuesta:
          "Sí. La app de Yape muestra quién te yapeó, a quién yapeaste, la fecha y el monto, con filtros de últimos 90 días y más de 90 días, y te deja enviar el listado a tu correo. Lo que no hace es agruparlos por categoría ni juntarlos con lo que pagas por Plin, con tarjeta o en efectivo.",
      },
      {
        pregunta: "¿Plin tiene app propia?",
        respuesta:
          "No. Plin es una función dentro de la app de tu banco o caja, por ejemplo BBVA, Interbank, Scotiabank o BanBif. Por eso tus plines quedan en el historial de cada banco, separados de tus yapeos.",
      },
      {
        pregunta: "¿Cuánto cuesta controlar mis yapeos con Neto?",
        respuesta:
          "Mandar capturas y anotar gastos es gratis siempre. Ver tu gasto por categoría, el historial y los presupuestos es de Neto Pro (S/10 al mes o S/99 al año), después de 14 días de prueba que arrancan con tu primer gasto.",
      },
    ],
  },
  {
    slug: "gastos-hormiga-peru",
    title: "Gastos hormiga: qué son y cómo verlos en tu sueldo",
    description:
      "Qué son los gastos hormiga, cómo sumarlos con tus propios números y cómo ponerles un tope. Con un ejemplo en soles y el ingreso promedio de Lima según el INEI.",
    date: "2026-03-21",
    dateModified: "2026-09-12",
    keywords: [
      "gastos hormiga",
      "gastos hormiga peru",
      "gastos innecesarios",
      "ahorro peru",
      "control de gastos",
    ],
    content: "",
    faq: [
      {
        pregunta: "¿Cuánto debería gastar en gastos hormiga al mes?",
        respuesta:
          "No hay una regla oficial. Lo útil es anotar un mes completo, ver cuánto sumaron y decidir un tope que te parezca razonable. Si al ver el número te incomoda, ahí tienes margen.",
      },
      {
        pregunta: "¿El café de todos los días me arruina?",
        respuesta:
          "No por sí solo. Un gasto chico de todos los días sí pesa en un año, pero el problema es la suma de todos los gastos hormiga juntos. Si es el único y el resto de tus finanzas está en orden, no es urgente.",
      },
      {
        pregunta: "¿Cómo sé cuáles son mis gastos hormiga?",
        respuesta:
          "Anotándolos. Lo más rápido es escribirle a Neto por WhatsApp cada gasto cuando lo haces. Anotar es gratis siempre; ver tus gastos por categoría en el dashboard es de Neto Pro, con 14 días de prueba desde tu primer gasto.",
      },
    ],
  },
  {
    slug: "como-controlar-gastos-personales-peru",
    title: "Cómo controlar gastos personales en Perú: guía 2026",
    description:
      "Cuatro métodos para controlar tus gastos en Perú (50/30/20, topes por categoría, presupuesto cero y quitar tres gastos), con ejemplos en soles y un plan de 30 días.",
    date: "2026-03-22",
    dateModified: "2026-09-12",
    keywords: [
      "cómo controlar gastos personales",
      "control de gastos perú",
      "finanzas personales perú",
      "presupuesto personal",
      "ahorrar dinero perú",
    ],
    content: "",
    faq: [
      {
        pregunta: "¿Cuánto tarda en verse el resultado de controlar los gastos?",
        respuesta:
          "En el primer mes ganas visibilidad: sabes en qué gastas. El cambio en tu saldo llega después, cuando ya ajustaste algunos hábitos, y cuánto tarda depende del margen que tengas.",
      },
      {
        pregunta: "¿Qué hago si tengo deudas y no me alcanza el sueldo?",
        respuesta:
          "Primero mira el panorama completo: ingresos, gastos fijos y deudas. Con eso claro, cubres las necesidades básicas, después el mínimo de cada deuda para no acumular intereses, y lo que sobre va a la deuda con la tasa más alta.",
      },
      {
        pregunta: "¿Sirve controlar los gastos si el sueldo es muy bajo?",
        respuesta:
          "Sí, aunque con límites. Con ingresos bajos el margen es chico, pero ver en qué se va la plata ayuda a encontrar gastos que puedes quitar sin tocar lo importante. Y cuando el ingreso mejora, el hábito ya lo tienes.",
      },
    ],
  },
  {
    slug: "en-que-gasto-mi-plata",
    title: "¿En qué gasto mi plata? Cómo averiguarlo mes a mes",
    description:
      "Si llegas al 20 sin plata y no sabes por qué, es porque tus gastos están repartidos. Cómo juntarlos y verlos por categoría, a mano o desde WhatsApp.",
    date: "2026-03-22",
    dateModified: "2026-09-12",
    keywords: [
      "en qué gasto mi plata",
      "a dónde se va mi dinero",
      "control de gastos whatsapp",
      "rastrear gastos",
      "gastos por categoría",
    ],
    content: "",
    faq: [
      {
        pregunta: "¿Cuánto demora ver mi primer resumen?",
        respuesta:
          "Anotar el primer gasto es un mensaje. El resumen se arma con lo que vas anotando, así que la foto útil aparece después de unos días de registrar todo.",
      },
      {
        pregunta: "¿Qué pasa con los gastos en efectivo?",
        respuesta:
          "No dejan rastro en ningún banco ni correo, así que se los escribes a Neto por WhatsApp, por ejemplo «mercado 30». Neto lo registra y lo incluye en tu resumen.",
      },
      {
        pregunta: "¿Puedo ver gastos de meses anteriores?",
        respuesta:
          "Neto parte de lo que anotas desde el primer día. Con Neto Pro y tu Gmail conectado, al conectarlo importa los correos de aviso bancario de los últimos 30 días, hasta 50 correos. En Pro también puedes mandarle por WhatsApp un Excel o un CSV con movimientos anteriores.",
      },
    ],
  },
  {
    slug: "bancos-peru-rastrear-sin-contrasena",
    title: "Bancos peruanos que Neto lee sin pedirte tu contraseña",
    description:
      "Neto no se conecta a tu banco. Con Neto Pro y tu Gmail conectado, lee los correos de notificación de BCP, BBVA, Interbank, Scotiabank, Yape y otros. Qué lee, qué no y cómo quitarle el acceso.",
    date: "2026-03-22",
    dateModified: "2026-09-12",
    keywords: [
      "bancos perú",
      "app finanzas perú sin contraseña",
      "rastrear gastos bcp",
      "leer correos bancarios",
      "seguridad financiera perú",
    ],
    content: "",
    faq: [
      {
        pregunta: "¿Puede Neto hacer transferencias o pagos desde mi cuenta?",
        respuesta:
          "No. Neto no tiene ningún acceso a tu banca en línea. El permiso de Gmail es de solo lectura de correo y no sirve para mover plata.",
      },
      {
        pregunta: "¿Qué pasa si Neto sufre un ataque?",
        respuesta:
          "Nadie podría entrar a tu banco con lo que guarda Neto, porque no guarda credenciales bancarias. Lo que sí está en Neto es tu historial de movimientos y, si conectaste Gmail, el token de acceso a tu correo, guardado cifrado. Si tienes dudas, revoca ese acceso desde tu cuenta de Google.",
      },
      {
        pregunta: "¿Es buena idea darle mi clave del banco a una app?",
        respuesta:
          "No. Si una app de finanzas te pide tu usuario y clave del banco, piénsalo dos veces antes de dársela. Hay formas de ordenar tus gastos sin entregar credenciales: anotarlos tú, o dejar que una app lea los avisos que ya recibes.",
      },
    ],
  },
  {
    slug: "asistente-financiero-whatsapp-peru",
    title: "Asistente financiero por WhatsApp: cómo funciona Neto",
    description:
      "Qué hace Neto, qué no hace y cuánto cuesta. Anotas tus gastos por WhatsApp con un mensaje o la captura del yapeo, y los ves ordenados en tu dashboard.",
    date: "2026-03-22",
    dateModified: "2026-09-12",
    keywords: [
      "asistente financiero whatsapp",
      "asistente financiero perú",
      "neto finanzas",
      "bot whatsapp finanzas",
      "control de gastos whatsapp",
    ],
    content: "",
    faq: [
      {
        pregunta: "¿Necesito conectar mi correo para usar Neto?",
        respuesta:
          "No. Neto funciona completo anotando por WhatsApp o en la web. Conectar Gmail es opcional y es de Neto Pro: sirve para que los gastos que tu banco te notifica por correo los anote Neto por ti, además de los que anotas tú.",
      },
      {
        pregunta: "¿Puedo usar Neto si solo uso Yape?",
        respuesta:
          "Sí. Mándale a Neto la captura de cada yapeo por WhatsApp y él lee el monto, a quién le pagaste y la fecha. Si el yapeo te lo hicieron a ti, lo registra como ingreso.",
      },
      {
        pregunta: "¿Hay una versión para negocios?",
        respuesta:
          "No. Neto está hecho para finanzas personales. Si eres freelancer o tienes un negocio pequeño, puedes usar categorías propias para separar los gastos del negocio de los tuyos.",
      },
    ],
  },
];

export const posts: BlogPost[] = escritos.map((p) => ({ ...p, readingTime: tiempoLectura(p) }));

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}
