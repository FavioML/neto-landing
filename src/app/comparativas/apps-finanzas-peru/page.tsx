import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StartButton from "@/components/landing/StartButton";
import { APPS } from "@/lib/apps-comparativa";

/*
 * UNA sola fuente para la fecha: el texto visible, el JSON-LD, el OpenGraph y el <lastmod>
 * del sitemap salen de estas dos constantes (verify-claims exige que el sitemap coincida con
 * ACTUALIZADO). ChatGPT muestra la fecha de esta página en su tarjeta de citación y la saca
 * del texto visible: con "2 de mayo" escrito a mano la mostraba como "1 de mayo". La hora
 * fija en Lima evita ese corrimiento de un día al pasar por UTC.
 */
const PUBLICADO = "2026-05-02";
const ACTUALIZADO = "2026-09-11";
const URL = "https://neto.pe/comparativas/apps-finanzas-peru";

const conHora = (dia: string) => `${dia}T09:00:00-05:00`;
const fechaLarga = (dia: string) =>
  new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Lima",
  }).format(new Date(conHora(dia)));

const TITULO = "Apps de finanzas personales en Perú: comparativa 2026";
const DESCRIPCION =
  "Neto, Monefy, Wallet, Money Manager, Mobills, Spendee y Fintonic comparadas para Perú con datos de sus fuentes oficiales: precio, bancos, WhatsApp y cuándo conviene cada una.";

export const metadata: Metadata = {
  title: `${TITULO} — Neto`,
  description: DESCRIPCION,
  keywords:
    "apps finanzas personales peru, comparativa apps gastos, monefy peru, wallet budgetbakers peru, money manager peru, alternativas fintonic, app whatsapp gastos peru",
  alternates: { canonical: URL },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: URL,
    type: "article",
    publishedTime: conHora(PUBLICADO),
    modifiedTime: conHora(ACTUALIZADO),
    locale: "es_PE",
    siteName: "Neto",
    images: [
      {
        url: "https://neto.pe/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Comparativa de apps de finanzas personales en Perú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITULO,
    description: DESCRIPCION,
    images: ["https://neto.pe/og-default.jpg"],
  },
};

// Los datos de las apps viven en `@/lib/apps-comparativa`: el post de precios del blog los lee también.

const CUANDO_NO: { titulo: string; texto: string }[] = [
  {
    titulo: "Quieres que tus movimientos entren solos desde el banco",
    texto:
      "Neto no se conecta a ningún banco: lo que gastas lo anotas tú, con un mensaje o una foto. Para bancos peruanos tampoco lo vas a encontrar en las otras seis: Wallet, Spendee y Fintonic sincronizan bancos, pero sus fuentes oficiales no nombran ninguno del Perú.",
  },
  {
    titulo: "No quieres pagar nunca y quieres ver tus gráficos",
    texto:
      "En Neto registrar es gratis siempre, pero pasados los 14 días de prueba el dashboard, el historial y el score son de Pro (S/10 al mes). Monefy, Wallet, Money Manager, Mobills y Spendee tienen versión gratuita; revisa en su tienda qué incluye cada una.",
  },
  {
    titulo: "No usas WhatsApp o no quieres tus finanzas junto a tus chats",
    texto:
      "Neto vive en WhatsApp y en la web. Si prefieres una app aparte, Monefy y Money Manager guardan todo dentro de su propia app.",
  },
  {
    titulo: "Llevas cuentas en monedas que no son soles ni dólares",
    texto:
      "Neto registra en soles y en dólares. Monefy, Wallet, Money Manager y Spendee declaran soporte para varias monedas.",
  },
  {
    titulo: "Buscas contabilidad de negocio, inversiones o asesoría de portafolio",
    texto:
      "Neto es para finanzas personales: gastos, presupuestos, metas y deudas entre personas.",
  },
  {
    titulo: "No vives en Perú",
    texto: "Neto está pensado para la banca, los comercios y las billeteras del Perú.",
  },
];

const FAQ: { pregunta: string; respuesta: string }[] = [
  {
    pregunta: "¿Cuál es la mejor app de finanzas personales en Perú?",
    respuesta:
      "Depende de cómo quieras registrar. Ninguna de las siete apps de esta comparativa sincroniza con bancos peruanos según sus propias fuentes, así que en todas el registro lo haces tú. Si quieres anotar por WhatsApp o mandando la captura del yapeo, Neto está hecho para eso. Si prefieres una app aparte con versión gratuita, Monefy, Money Manager y Wallet son opciones conocidas. Si tienes cuentas en bancos de otros países, Wallet y Spendee sincronizan cuentas bancarias.",
  },
  {
    pregunta: "¿Qué app de gastos se conecta con BCP, BBVA, Interbank o Scotiabank?",
    respuesta:
      "Ninguna de las siete que comparamos, según sus fuentes oficiales consultadas el 11 de septiembre de 2026. Neto tampoco: no pide contraseñas ni se conecta al banco, y lo que gastas en esos bancos lo anotas tú. En Neto Pro puedes, si quieres, conectar tu Gmail para que Neto sume los correos de notificación que el banco ya te envía (beta). Es un complemento, no una conexión con el banco.",
  },
  {
    pregunta: "¿Hay alternativas a Fintonic en Perú?",
    respuesta:
      "Sí. Fintonic opera en España, trabaja con bancos españoles y su app no aparece en la App Store de Perú. Neto, Monefy, Wallet, Money Manager, Mobills y Spendee sí se pueden descargar desde Perú. Si lo que te interesaba de Fintonic era el puntaje financiero, Neto calcula un score de salud financiera de 0 a 100.",
  },
  {
    pregunta: "¿Existe una app de control de gastos por WhatsApp en Perú?",
    respuesta:
      "Sí. En Neto escribes «almuerzo 18» o mandas la foto del voucher por WhatsApp y el gasto queda anotado y categorizado. No es la única: hay otros asistentes por WhatsApp en Perú que esta comparativa no cubre, y Mobills anuncia una IA por WhatsApp en su plan PRO. En Neto, anotar es gratis; consultar tus números (cuánto gastaste en delivery, tu score) es de Neto Pro, después de 14 días de prueba.",
  },
  {
    pregunta: "¿Qué apps leen las capturas de Yape y Plin?",
    respuesta:
      "Neto lee la captura: le mandas la imagen del yapeo por WhatsApp y saca el monto, el comercio y la fecha. Spendee tiene un escáner de recibos con IA, pero sus fuentes no mencionan Yape ni Plin. En las demás, un pago por Yape se anota a mano como cualquier otro gasto.",
  },
];

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: TITULO,
  description: DESCRIPCION,
  url: URL,
  datePublished: conHora(PUBLICADO),
  dateModified: conHora(ACTUALIZADO),
  inLanguage: "es-PE",
  image: { "@type": "ImageObject", url: "https://neto.pe/og-default.jpg", width: 1200, height: 630 },
  author: {
    "@type": "Person",
    name: "Favio Mendoza",
    jobTitle: "Founder",
    worksFor: { "@type": "Organization", name: "Vortik", url: "https://vortik.dev" },
  },
  publisher: {
    "@type": "Organization",
    name: "Neto",
    url: "https://neto.pe",
    logo: { "@type": "ImageObject", url: "https://neto.pe/neto-icon.png", width: 512, height: 512 },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": URL },
};

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Apps de finanzas personales en Perú",
  description:
    "Comparativa de aplicaciones de control de gastos para usuarios peruanos, con datos de las fuentes oficiales de cada app.",
  numberOfItems: APPS.length,
  itemListElement: APPS.map((app, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "SoftwareApplication",
      name: app.name,
      url: app.homepage,
      applicationCategory: "FinanceApplication",
      operatingSystem: app.operatingSystem,
      inLanguage: "es",
      description: `${app.registro} ${app.bancos}`,
    },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Inicio", item: "https://neto.pe" },
    { "@type": "ListItem", position: 2, name: "Apps de finanzas personales en Perú", item: URL },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map((q) => ({
    "@type": "Question",
    name: q.pregunta,
    acceptedAnswer: { "@type": "Answer", text: q.respuesta },
  })),
};

const H2 = "text-xl sm:text-2xl font-bold mb-4 text-[#e5e2de]";

export default function ComparativasAppsFinanzasPeru() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleJsonLd, itemListJsonLd, breadcrumbJsonLd, faqJsonLd]),
        }}
      />
      <Navbar />
      <main className="bg-neto-bg min-h-screen pt-28 pb-20">
        <article className="mx-auto max-w-[860px] px-6">
          <nav className="text-xs text-neto-txt3 mb-8 flex items-center gap-1.5">
            <Link href="/" className="hover:text-neto-txt transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-neto-txt2">Comparativas</span>
            <span>/</span>
            <span className="text-neto-txt2">Apps de finanzas Perú</span>
          </nav>

          <header className="mb-10">
            <p className="text-sm text-neto-green font-medium tracking-wide uppercase mb-3">
              Comparativa
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-5 text-[#e5e2de]">
              {TITULO}
            </h1>
            <p className="text-base text-neto-txt2 leading-7 max-w-[700px]">
              Comparamos siete apps para controlar gastos desde Perú: Neto, Monefy,
              Wallet by BudgetBakers, Money Manager, Mobills, Spendee y Fintonic.
              Los datos de cada competidor salen de su web oficial y de su ficha en
              la App Store de Perú, enlazadas en cada tarjeta. Lo que no pudimos
              verificar ahí no está escrito.
            </p>
            <p className="text-xs text-neto-txt3 mt-5">
              Por <span className="text-neto-txt2 font-medium">Favio Mendoza</span>,
              founder de{" "}
              <a
                href="https://vortik.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neto-green hover:underline"
              >
                Vortik
              </a>
              , que desarrolla Neto{" · "}
              Actualizado el{" "}
              <time dateTime={conHora(ACTUALIZADO)}>{fechaLarga(ACTUALIZADO)}</time>
            </p>
          </header>

          <section className="mb-12" aria-labelledby="resumen-comparativa">
            <h2 id="resumen-comparativa" className={H2}>
              Resumen
            </h2>
            <p className="text-base leading-7 text-neto-txt2 mb-4">
              Ninguna de las siete apps sincroniza con bancos peruanos según sus propias
              fuentes. Wallet, Spendee y Fintonic sincronizan bancos, pero de otros países;
              Monefy y Money Manager no se conectan a bancos. O sea que en Perú, con
              cualquiera de ellas, el registro lo haces tú, y la diferencia real está en
              cómo lo haces y cuánto cuesta.
            </p>
            <p className="text-base leading-7 text-neto-txt2">
              Neto es la opción si quieres anotar por WhatsApp o mandando la captura del
              yapeo: registrar es gratis siempre y el análisis cuesta S/10 al mes. Si
              prefieres una app aparte con versión gratuita, Monefy, Money Manager y Wallet
              tienen versión gratuita. Esta página la escribe el equipo de Neto; por eso
              cada dato de las otras apps lleva su fuente y abajo está la lista de casos en
              los que Neto no es la mejor opción.
            </p>
          </section>

          <section className="mb-14" aria-labelledby="tabla-comparativa">
            <h2 id="tabla-comparativa" className={`${H2} mb-6`}>
              Tabla comparativa
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-white/6 bg-neto-bg2">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-white/6 bg-white/5 text-left">
                    <th className="p-3 font-semibold text-neto-txt sticky left-0 bg-[#1C1C19]">App</th>
                    <th className="p-3 font-semibold text-neto-txt2">Precio</th>
                    <th className="p-3 font-semibold text-neto-txt2">Por WhatsApp</th>
                    <th className="p-3 font-semibold text-neto-txt2">Bancos peruanos</th>
                  </tr>
                </thead>
                <tbody>
                  {APPS.map((app) => {
                    const esNeto = app.name === "Neto";
                    return (
                      <tr key={app.name} className="border-b border-white/6 last:border-0 align-top">
                        <th
                          scope="row"
                          className={`p-3 text-left font-semibold sticky left-0 bg-[#1C1C19] ${
                            esNeto ? "text-neto-green" : "text-neto-txt"
                          }`}
                        >
                          {app.name}
                        </th>
                        <td className={`p-3 ${esNeto ? "text-neto-green" : "text-neto-txt2"}`}>
                          {app.precioCorto}
                        </td>
                        <td className="p-3 text-neto-txt2">{app.whatsapp}</td>
                        <td className="p-3 text-neto-txt2">{app.bancosPeru}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-neto-txt3 mt-3 leading-5">
              «No» en WhatsApp significa que sus fuentes oficiales no lo ofrecen. Precios
              en la moneda en que los publica cada fuente; los de la App Store de Perú son
              los que ve alguien que descarga la app desde aquí.
            </p>
          </section>

          <section className="mb-14" aria-labelledby="detalle-apps">
            <h2 id="detalle-apps" className={`${H2} mb-6`}>
              Detalle por aplicación
            </h2>
            <div className="space-y-4">
              {APPS.map((app) => {
                const esNeto = app.name === "Neto";
                return (
                  <div
                    key={app.name}
                    className={`rounded-xl border p-5 ${
                      esNeto ? "border-neto-green/30 bg-neto-green/5" : "border-white/6 bg-neto-bg2"
                    }`}
                  >
                    <h3 className={`font-bold text-lg mb-3 ${esNeto ? "text-neto-green" : "text-neto-txt"}`}>
                      {app.name}
                    </h3>
                    <dl className="grid sm:grid-cols-[130px_1fr] gap-x-4 gap-y-2 text-sm leading-relaxed">
                      <dt className="text-neto-txt3">Precio</dt>
                      <dd className="text-neto-txt2">{app.precio}</dd>
                      <dt className="text-neto-txt3">Bancos</dt>
                      <dd className="text-neto-txt2">{app.bancos}</dd>
                      <dt className="text-neto-txt3">Cómo registras</dt>
                      <dd className="text-neto-txt2">{app.registro}</dd>
                      <dt className="text-neto-txt3">Plataformas</dt>
                      <dd className="text-neto-txt2">{app.plataformas}</dd>
                      <dt className="text-neto-txt3">Español</dt>
                      <dd className="text-neto-txt2">{app.espanol}</dd>
                    </dl>
                    <p className="text-sm text-neto-txt2 leading-relaxed mt-3">{app.resumen}</p>
                    {app.fuentes && app.consultado && (
                      <p className="text-xs text-neto-txt3 mt-3 leading-5">
                        Fuentes oficiales, consultadas el{" "}
                        <time dateTime={app.consultado}>{fechaLarga(app.consultado)}</time>:{" "}
                        {app.fuentes.map((f, i) => (
                          <span key={f.url}>
                            {i > 0 && " · "}
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="underline hover:text-neto-txt2"
                            >
                              {f.nombre}
                            </a>
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-14" aria-labelledby="cuando-no-neto">
            <h2 id="cuando-no-neto" className={H2}>
              Cuándo Neto no es la mejor opción
            </h2>
            <p className="text-base leading-7 text-neto-txt2 mb-6">
              Neto sirve para anotar rápido lo que gastas en Perú y entender en qué se va
              tu plata. Hay casos en los que otra app te va a servir mejor:
            </p>
            <ul className="space-y-4">
              {CUANDO_NO.map((c) => (
                <li key={c.titulo} className="border-l-2 border-white/10 pl-4">
                  <p className="text-[15px] font-medium text-neto-txt mb-1">{c.titulo}</p>
                  <p className="text-sm text-neto-txt2 leading-7">{c.texto}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-14" aria-labelledby="preguntas-frecuentes">
            <h2 id="preguntas-frecuentes" className={`${H2} mb-6`}>
              Preguntas frecuentes
            </h2>
            <div className="space-y-4">
              {FAQ.map((q) => (
                <details key={q.pregunta} className="group border-b border-white/6">
                  <summary className="flex items-start justify-between gap-4 py-4 cursor-pointer list-none">
                    <span className="text-[15px] font-medium text-neto-txt leading-snug flex-1">
                      {q.pregunta}
                    </span>
                    <span className="text-lg text-neto-green shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="pb-4 text-sm text-neto-txt2 leading-7">{q.respuesta}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="bg-neto-green rounded-2xl p-7 flex items-center justify-between gap-5 flex-wrap">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Prueba Neto gratis</h3>
              <p className="text-sm text-white/80 max-w-[420px]">
                Empieza en 2 minutos por WhatsApp. Sin contraseñas bancarias: anotas tú
                lo que gastas en cualquier banco, Yape o Plin.
              </p>
            </div>
            <StartButton
              source="comparativas"
              className="bg-white text-neto-green-dark rounded-full px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
            >
              Empezar gratis
            </StartButton>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
