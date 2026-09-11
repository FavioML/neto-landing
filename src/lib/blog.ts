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
  readingTime: string;
  keywords: string[];
  content: string; // HTML content
  ogImage?: string; // Optional custom OG image URL (falls back to og-default.jpg)
  /**
   * Preguntas frecuentes del post. De este array salen la sección visible Y el FAQPage del
   * JSON-LD, así que no pueden decir cosas distintas. Texto plano: el JSON-LD no lleva HTML.
   */
  faq?: { pregunta: string; respuesta: string }[];
}

/** Central registry — import from here, add new posts to the array. */
export const posts: BlogPost[] = [
  {
    slug: "cuanto-cuesta-app-finanzas-personales-peru",
    title: "¿Cuánto cuesta una app de finanzas personales en Perú?",
    description:
      "Anotar gastos es gratis en casi todas. Lo que se cobra es lo de encima. Precios de Neto, Monefy, Wallet, Money Manager, Mobills y Spendee con su fuente oficial.",
    date: "2026-09-11",
    readingTime: "5 min",
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
      "Yape guarda tus yapeos y cada banco guarda tus plines, pero ninguno los suma por categoría. Cómo juntar todo en un solo lugar, paso a paso.",
    date: "2026-09-11",
    readingTime: "6 min",
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
    dateModified: "2026-09-11",
    readingTime: "5 min",
    keywords: [
      "gastos hormiga",
      "gastos hormiga peru",
      "gastos innecesarios",
      "ahorro peru",
      "control de gastos",
    ],
    content: "",
  },
  {
    slug: "como-controlar-gastos-personales-peru",
    title: "Cómo controlar gastos personales en Perú: guía 2026",
    description:
      "Cuatro métodos para controlar tus gastos en Perú (50/30/20, topes por categoría, presupuesto cero y quitar tres gastos), con ejemplos en soles y un plan de 30 días.",
    date: "2026-03-22",
    dateModified: "2026-09-11",
    readingTime: "6 min",
    keywords: [
      "cómo controlar gastos personales",
      "control de gastos perú",
      "finanzas personales perú",
      "presupuesto personal",
      "ahorrar dinero perú",
    ],
    content: "",
  },
  {
    slug: "en-que-gasto-mi-plata",
    title: "¿En qué gasto mi plata? Cómo averiguarlo mes a mes",
    description:
      "Si llegas al 20 sin plata y no sabes por qué, es porque tus gastos están repartidos. Cómo juntarlos y verlos por categoría, a mano o desde WhatsApp.",
    date: "2026-03-22",
    dateModified: "2026-09-11",
    readingTime: "5 min",
    keywords: [
      "en qué gasto mi plata",
      "a dónde se va mi dinero",
      "control de gastos whatsapp",
      "rastrear gastos",
      "gastos por categoría",
    ],
    content: "",
  },
  {
    slug: "bancos-peru-rastrear-sin-contrasena",
    title: "Bancos peruanos que Neto lee sin pedirte tu contraseña",
    description:
      "Neto no se conecta a tu banco. Con Neto Pro y tu Gmail conectado, lee los correos de notificación de BCP, BBVA, Interbank, Scotiabank, Yape y otros. Qué lee, qué no y cómo quitarle el acceso.",
    date: "2026-03-22",
    dateModified: "2026-09-11",
    readingTime: "6 min",
    keywords: [
      "bancos perú",
      "app finanzas perú sin contraseña",
      "rastrear gastos bcp",
      "leer correos bancarios",
      "seguridad financiera perú",
    ],
    content: "",
  },
  {
    slug: "asistente-financiero-whatsapp-peru",
    title: "Asistente financiero por WhatsApp: cómo funciona Neto",
    description:
      "Qué hace Neto, qué no hace y cuánto cuesta. Anotas tus gastos por WhatsApp con un mensaje o la captura del yapeo, y los ves ordenados en tu dashboard.",
    date: "2026-03-22",
    dateModified: "2026-09-11",
    readingTime: "5 min",
    keywords: [
      "asistente financiero whatsapp",
      "asistente financiero perú",
      "neto finanzas",
      "bot whatsapp finanzas",
      "control de gastos whatsapp",
    ],
    content: "",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return posts.map((p) => p.slug);
}
