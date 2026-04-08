import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { WA_LINK } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Score Financiero 0-100 — Neto",
  description:
    "Neto calcula tu score de salud financiera del 0 al 100. Descubre qué significa tu puntaje, cómo se calcula y cómo mejorarlo este mes.",
  alternates: { canonical: "https://neto.pe/score-financiero" },
  keywords:
    "score financiero, salud financiera, puntaje financiero, score financiero peru, como mejorar finanzas personales",
  openGraph: {
    title: "Score Financiero 0-100 — Neto",
    description:
      "Neto calcula tu score de salud financiera del 0 al 100. Descubre qué significa tu puntaje y cómo mejorarlo.",
    url: "https://neto.pe/score-financiero",
    type: "website",
    locale: "es_PE",
    siteName: "Neto",
    images: [
      {
        url: "https://neto.pe/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Score Financiero 0-100 — Neto",
      },
    ],
  },
};

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Score Financiero 0-100 — Neto",
  description:
    "Neto calcula tu score de salud financiera del 0 al 100. Metodología, rangos y cómo mejorar tu puntaje.",
  url: "https://neto.pe/score-financiero",
  inLanguage: "es-PE",
  publisher: {
    "@type": "Organization",
    name: "Neto",
    url: "https://neto.pe",
  },
};

const SCORE_RANGES = [
  {
    range: "80 – 100",
    label: "Excelente",
    color: "text-neto-green",
    border: "border-neto-green/30",
    bg: "bg-neto-green/10",
    desc: "Tus finanzas están en orden. Gastas menos de lo que ganas, tienes reservas, tus deudas están bajo control y mantienes hábitos consistentes. Estás en el 15% superior de usuarios de Neto.",
  },
  {
    range: "60 – 79",
    label: "Buena",
    color: "text-neto-amber",
    border: "border-neto-amber/30",
    bg: "bg-neto-amber/10",
    desc: "Vas bien. Tienes control sobre tu gasto pero hay áreas específicas que mejorar — tal vez gastas más de lo ideal en una categoría o tu tasa de ahorro es baja. Con ajustes puntuales puedes llegar a Excelente.",
  },
  {
    range: "40 – 59",
    label: "En desarrollo",
    color: "text-orange-400",
    border: "border-orange-400/30",
    bg: "bg-orange-400/10",
    desc: "Hay margen de mejora claro. Probablemente gastas más de lo planificado en algunas categorías o no tienes un colchón de ahorro aún. Las recomendaciones de Neto en este rango son las más concretas y accionables.",
  },
  {
    range: "0 – 39",
    label: "Crítico",
    color: "text-red-400",
    border: "border-red-400/30",
    bg: "bg-red-400/10",
    desc: "Tus gastos superan tus ingresos o estás acumulando deuda. Requiere atención inmediata. Neto identifica las 3 acciones más urgentes para estabilizar tu situación financiera.",
  },
];

const PILLARS = [
  {
    num: "01",
    name: "Control de gastos",
    weight: "30%",
    desc: "¿Gastas menos de lo que ganas? ¿Cuánto porcentaje del ingreso va a necesidades vs gustos vs ahorro? Este pilar evalúa si tu gasto está alineado con la regla 50/30/20 adaptada a tu realidad.",
  },
  {
    num: "02",
    name: "Tasa de ahorro",
    weight: "25%",
    desc: "¿Qué porcentaje de tu ingreso neto ahorras cada mes? Una tasa de ahorro del 10% o más suma puntos. Por debajo del 5% restará puntos. Sin ahorro, cualquier gasto imprevisto se convierte en deuda.",
  },
  {
    num: "03",
    name: "Gestión de deudas",
    weight: "20%",
    desc: "¿Cuánto del ingreso va a pagar cuotas de deudas? La regla general: no más del 30% del sueldo en pagos de deuda. Las deudas de consumo (tarjetas al 60%+ anual) tienen mayor penalización que préstamos hipotecarios.",
  },
  {
    num: "04",
    name: "Consistencia",
    weight: "15%",
    desc: "¿Tus finanzas son estables mes a mes o hay grandes variaciones? La consistencia — gastar patrones predecibles, ahorrar regularmente — es una señal de control real. Los picos de gasto impulsivo bajan este pilar.",
  },
  {
    num: "05",
    name: "Cumplimiento de metas",
    weight: "10%",
    desc: "¿Estás alcanzando los presupuestos que tú mismo definiste? Si pones S/200 en delivery y gastas S/180, sumas. Si gastas S/320, restas. Este pilar mide la brecha entre intención y realidad.",
  },
];

export default function ScoreFinancieroPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <Navbar />
      <main className="bg-neto-bg min-h-screen pt-28 pb-20">
        <div className="mx-auto max-w-[800px] px-6">

          {/* Breadcrumb */}
          <nav className="text-xs text-neto-txt3 mb-8 flex items-center gap-1.5">
            <Link href="/" className="hover:text-neto-txt transition-colors duration-200">Inicio</Link>
            <span>/</span>
            <span className="text-neto-txt2">Score Financiero</span>
          </nav>

          {/* Header */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neto-green mb-3">
            <span className="w-4 h-[2px] bg-neto-green" />
            Metodología
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
            Tu score de salud financiera,<br />
            <span className="text-neto-green">del 0 al 100</span>
          </h1>
          <p className="text-base text-neto-txt2 font-light mb-10 pb-8 border-b border-white/7 leading-relaxed max-w-[640px]">
            Neto calcula automáticamente un puntaje que resume el estado de tus
            finanzas en un solo número. Transparente, basado en tus datos reales
            y actualizado cada mes.
          </p>

          {/* What is it */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">¿Qué es el score financiero?</h2>
            <p className="text-sm text-neto-txt2 leading-7 mb-4">
              El score financiero de Neto es un número del 0 al 100 que representa qué tan
              saludable está tu situación financiera personal en un momento dado. Funciona de
              forma similar a un score crediticio, pero en lugar de medir si eres buen pagador
              de deudas, mide <strong>qué tan bien manejas tu dinero en general</strong>.
            </p>
            <p className="text-sm text-neto-txt2 leading-7 mb-4">
              No existe un número "correcto" — el objetivo es que el tuyo mejore mes a mes.
              Un score de 55 que sube a 62 en 30 días es un progreso real y concreto, no una
              promesa vaga de "ahorrar más".
            </p>
            <p className="text-sm text-neto-txt2 leading-7">
              El score se calcula automáticamente usando los datos de tus transacciones reales.
              No requiere que ingreses información manual. Si conectaste tu banco a Neto, el
              score se actualiza solo.
            </p>
          </section>

          {/* Ranges */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">¿Qué significa tu puntaje?</h2>
            <div className="space-y-3">
              {SCORE_RANGES.map((r) => (
                <div
                  key={r.range}
                  className={`rounded-xl border ${r.border} ${r.bg} p-5`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-lg font-bold ${r.color}`}>{r.range}</span>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${r.color}`}>
                      {r.label}
                    </span>
                  </div>
                  <p className="text-sm text-neto-txt2 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pillars */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-2">¿Cómo se calcula?</h2>
            <p className="text-sm text-neto-txt2 mb-6 leading-relaxed">
              El score es una media ponderada de cinco pilares. Cada uno tiene un peso
              diferente según su impacto en la salud financiera general:
            </p>
            <div className="space-y-4">
              {PILLARS.map((p) => (
                <div key={p.num} className="rounded-xl border border-white/6 bg-neto-bg2 p-5">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-neto-txt3 font-mono">{p.num}</span>
                      <span className="text-sm font-semibold text-neto-txt">{p.name}</span>
                    </div>
                    <span className="text-xs font-bold text-neto-green shrink-0">{p.weight}</span>
                  </div>
                  <p className="text-sm text-neto-txt2 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How to improve */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Cómo mejorar tu score este mes</h2>
            <p className="text-sm text-neto-txt2 leading-7 mb-6">
              Neto genera automáticamente 3 acciones concretas personalizadas según tu
              puntaje actual y tus patrones de gasto. Pero si quieres un punto de
              partida general:
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-neto-green/20 text-neto-green text-xs font-bold flex items-center justify-center">1</span>
                <div>
                  <p className="text-sm font-semibold text-neto-txt mb-1">Identifica tu categoría con más gasto</p>
                  <p className="text-sm text-neto-txt2 leading-relaxed">
                    Normalmente una sola categoría concentra el 30–40% del gasto total.
                    Reducirla en un 20% puede mover el score 5–8 puntos.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-neto-green/20 text-neto-green text-xs font-bold flex items-center justify-center">2</span>
                <div>
                  <p className="text-sm font-semibold text-neto-txt mb-1">Empieza a ahorrar aunque sea S/100</p>
                  <p className="text-sm text-neto-txt2 leading-relaxed">
                    La tasa de ahorro tiene un peso del 25% en el score. Pasar de 0% a
                    cualquier porcentaje positivo tiene el mayor impacto puntual.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-neto-green/20 text-neto-green text-xs font-bold flex items-center justify-center">3</span>
                <div>
                  <p className="text-sm font-semibold text-neto-txt mb-1">Cancela suscripciones que no usas</p>
                  <p className="text-sm text-neto-txt2 leading-relaxed">
                    Las suscripciones son gastos fijos que se acumulan silenciosamente.
                    Neto las detecta automáticamente —{" "}
                    <Link href="/blog/gastos-hormiga-peru" className="text-neto-green hover:underline">
                      los gastos hormiga digitales son los más fáciles de eliminar
                    </Link>.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-neto-green/20 text-neto-green text-xs font-bold flex items-center justify-center">4</span>
                <div>
                  <p className="text-sm font-semibold text-neto-txt mb-1">Define presupuestos mensuales</p>
                  <p className="text-sm text-neto-txt2 leading-relaxed">
                    El pilar de Cumplimiento de metas (10%) requiere que definas topes.
                    Sin presupuesto, ese pilar siempre va a puntuar bajo. Cinco minutos
                    al inicio del mes cambian esto completamente.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6">Preguntas frecuentes</h2>
            <div className="space-y-4">
              {[
                {
                  q: "¿Con qué frecuencia se actualiza el score?",
                  a: "El score se recalcula cada vez que Neto procesa una nueva transacción. En la práctica, si conectaste tu banco y recibes correos de notificación regularmente, tu score se actualiza en tiempo casi real.",
                },
                {
                  q: "¿Un score bajo significa que soy mala persona con el dinero?",
                  a: "No. El score mide hábitos, no valor personal. Un score bajo simplemente indica áreas de mejora. Muchos usuarios empiezan en 30–40 y suben a 65–70 en dos o tres meses con pequeños ajustes. El score es una herramienta, no un juicio.",
                },
                {
                  q: "¿El score de Neto es el mismo que el score crediticio del banco?",
                  a: "Son completamente diferentes. El score crediticio (como el de Equifax o el de la SBS) mide tu historial de pago de deudas. El score de Neto mide tu salud financiera general — incluyendo ahorro, control de gastos y consistencia. Neto no reporta ni consulta bureaus crediticios.",
                },
                {
                  q: "¿Puedo ver el historial de mi score en el tiempo?",
                  a: "Sí, con el plan Pro. El dashboard web muestra la evolución de tu score mes a mes, para que veas claramente si estás mejorando y qué cambios tuvieron mayor impacto.",
                },
              ].map((item) => (
                <details key={item.q} className="group border-b border-white/6">
                  <summary className="flex items-start justify-between gap-4 py-4 cursor-pointer list-none">
                    <span className="text-[15px] font-medium text-neto-txt leading-snug flex-1">{item.q}</span>
                    <span className="text-lg text-neto-green shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-45">+</span>
                  </summary>
                  <p className="pb-4 text-sm text-neto-txt2 leading-7">{item.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Related content */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4">Artículos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  href: "/blog/gastos-hormiga-peru",
                  title: "Gastos hormiga: cómo te roban S/200 al mes",
                  desc: "Los pequeños gastos invisibles que más impactan tu score.",
                },
                {
                  href: "/blog/como-controlar-gastos-personales-peru",
                  title: "Guía de control de gastos en Perú",
                  desc: "Métodos probados para mejorar tus finanzas mes a mes.",
                },
              ].map((a) => (
                <Link
                  key={a.href}
                  href={a.href}
                  className="block rounded-xl border border-white/5 bg-neto-bg2 p-4 hover:border-neto-green/30 transition-colors duration-200"
                >
                  <p className="text-sm font-semibold text-neto-txt mb-1 group-hover:text-neto-green">{a.title}</p>
                  <p className="text-xs text-neto-txt3">{a.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="bg-neto-green rounded-2xl p-7 flex items-center justify-between gap-5 flex-wrap">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Conoce tu score ahora</h3>
              <p className="text-sm text-white/75">
                Conecta tu banco en 2 minutos y recibe tu score de salud financiera
                junto con 3 acciones concretas para mejorarlo.
              </p>
            </div>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-neto-green-dark rounded-full px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
            >
              Empezar gratis
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
