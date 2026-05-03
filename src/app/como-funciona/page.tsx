import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { ArrowRight, MessageSquare, Brain, LayoutDashboard, Camera, Shield, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cómo funciona Neto — Asistente financiero por WhatsApp",
  description:
    "Le mandas un mensaje o foto de Yape/Plin a Neto por WhatsApp, lo categoriza con IA y te muestra todo en un dashboard. Sin descargar apps, sin contraseñas bancarias.",
  keywords:
    "cómo funciona neto, asistente financiero whatsapp, registrar gastos whatsapp, control gastos peru",
  openGraph: {
    title: "Cómo funciona Neto — 4 pasos, cero fricción",
    description:
      "Mándale un mensaje o foto a Neto por WhatsApp. Categoriza con IA y te resume todo. Gratis.",
    url: "https://neto.pe/como-funciona",
    type: "website",
    locale: "es_PE",
    siteName: "Neto",
  },
  alternates: { canonical: "https://neto.pe/como-funciona" },
};

import { WA_LINK } from "@/lib/constants";

const STEPS = [
  {
    num: "01",
    Icon: MessageSquare,
    title: "Le escribes a Neto por WhatsApp",
    desc: "Mándale un mensaje en lenguaje natural — \"gasté 45 en almuerzo\" o \"recibí 1500 de sueldo\". Neto te responde al instante con la confirmación y la categoría asignada.",
    detail: "Funciona con el WhatsApp que ya tienes. Sin descargas, sin formularios, sin código.",
    accent: "text-[#EF9F27]",
    bg: "bg-[#EF9F27]/10",
  },
  {
    num: "02",
    Icon: Camera,
    title: "Le mandas fotos de Yape, Plin o vouchers",
    desc: "Si pagaste por Yape o Plin, mándale el screenshot. Neto lee el monto, el comercio y la fecha automáticamente con IA de visión.",
    detail: "También funciona con vouchers de POS, recibos físicos y capturas del app de tu banco. Si el monto está visible, Neto lo registra.",
    accent: "text-[#68dbae]",
    bg: "bg-[#1D9E75]/10",
  },
  {
    num: "03",
    Icon: Brain,
    title: "Neto categoriza y arma tu dashboard",
    desc: "Cada gasto se clasifica en una de 11 categorías (alimentación, transporte, vivienda, etc.). Neto aprende tus comercios frecuentes y mejora con el tiempo.",
    detail: "Recibes resúmenes semanales y mensuales por WhatsApp con tu total gastado, top categorías y alertas cuando te acercas al límite de tus presupuestos.",
    accent: "text-[#25D366]",
    bg: "bg-[#25D366]/10",
  },
  {
    num: "04",
    Icon: LayoutDashboard,
    title: "Exploras tu dashboard web",
    desc: "Entra a app.neto.pe para ver gráficos interactivos, score financiero 0-100, calendario de gastos, detección de suscripciones y reportes PDF descargables.",
    detail: "El dashboard funciona en cualquier navegador (computadora o celular). No necesitas descargar ninguna aplicación.",
    accent: "text-[#818cf8]",
    bg: "bg-[#818cf8]/10",
  },
];

const FAQS = [
  {
    q: "¿Tengo que descargar algún app?",
    a: "No. Neto funciona 100% por WhatsApp — el app que ya tienes. Tu dashboard web está en app.neto.pe y se ve igual de bien en celular que en computadora.",
  },
  {
    q: "¿Necesito dar mi contraseña del banco?",
    a: "No. Nunca pedimos usuario ni contraseña de tu banco ni accedemos a tu banca en línea. Tus datos de gasto se construyen a partir de lo que tú le mandas a Neto por WhatsApp.",
  },
  {
    q: "¿Con qué bancos y wallets funciona?",
    a: "Con todos. Si pagaste por Yape, Plin, BCP, BBVA, Interbank, Scotiabank, Falabella, Ripley, BanBif, Mibanco, CMAC o efectivo, le puedes mandar el voucher o el monto a Neto y lo registra. No depende del banco.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "El plan gratuito incluye WhatsApp ilimitado, presupuestos y metas ilimitados, lectura de fotos Yape/Plin y dashboard del mes actual. El plan Pro cuesta S/10/mes (o S/99/año) y desbloquea historial completo, score detallado, reportes PDF, resumen diario con IA y export CSV.",
  },
  {
    q: "¿Puedo dejar de usarlo cuando quiera?",
    a: "Sí. Sin contratos, sin permanencia. Puedes pausar tu suscripción Pro cuando quieras y solicitar la eliminación de tus datos por WhatsApp.",
  },
];

export default function ComoFunciona() {
  const howItWorksSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo funciona Neto — Asistente financiero por WhatsApp",
    description: "Le mandas un mensaje o foto de Yape/Plin a Neto por WhatsApp, categoriza con IA y te resume todo. Sin descargar apps, sin contraseñas bancarias.",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.desc,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0E0E0C]">
        {/* Hero */}
        <section className="pt-32 pb-16 px-6">
          <div className="mx-auto max-w-[800px] text-center">
            <p className="text-sm text-[#1D9E75] font-medium tracking-wide uppercase mb-4">
              Cómo funciona
            </p>
            <h1 className="text-4xl min-[860px]:text-6xl font-extrabold leading-tight mb-6">
              <span className="bg-gradient-to-b from-[#e5e2de] to-[#87948c] bg-clip-text text-transparent">
                Cuatro pasos.
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#68dbae] to-[#1D9E75] bg-clip-text text-transparent">
                Cero fricción.
              </span>
            </h1>
            <p className="text-lg text-[#87948c] max-w-[560px] mx-auto leading-relaxed">
              Le mandas un mensaje o foto a Neto por WhatsApp, lo categoriza con IA y
              te resume todo en un dashboard. Así de simple.
            </p>
          </div>
        </section>

        {/* Definitional block — for AI extraction */}
        <section className="pb-12 px-6" aria-labelledby="resumen-funcionamiento">
          <div className="mx-auto max-w-[760px]">
            <h2 id="resumen-funcionamiento" className="text-xl sm:text-2xl font-bold mb-4 text-[#e5e2de]">
              Resumen de funcionamiento
            </h2>
            <p className="text-base leading-7 text-[#c8c5bd]">
              Neto es un asistente financiero personal por WhatsApp para Perú
              que registra y categoriza gastos en cuatro pasos. Primero, el
              usuario le manda un mensaje en lenguaje natural por WhatsApp
              (&quot;gasté 45 en almuerzo&quot;) o una foto de un voucher Yape,
              Plin o de POS. Segundo, Neto extrae monto, comercio y fecha del
              mensaje o de la imagen con IA. Tercero, una capa de inteligencia
              artificial clasifica cada gasto en una de once categorías
              (alimentación, transporte, vivienda, salud, educación,
              entretenimiento, servicios, deudas, ahorro, transferencias e
              ingresos) y aprende los comercios frecuentes del usuario.
              Cuarto, el usuario recibe resúmenes semanales y mensuales por
              WhatsApp y accede a un dashboard web en app.neto.pe con
              gráficos, score financiero, presupuestos y reportes PDF.
              Funciona con cualquier banco o wallet del Perú porque el
              registro lo hace el usuario directamente desde WhatsApp. Plan
              Gratis disponible. Plan Pro a S/10/mes o S/99/año.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="pb-20 px-6">
          <div className="mx-auto max-w-[800px] space-y-8">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="rounded-3xl bg-[#1C1C19] border border-white/5 p-8 min-[640px]:p-10"
              >
                <div className="flex items-start gap-5">
                  <div className={`flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl ${step.bg}`}>
                    <step.Icon className={`h-6 w-6 ${step.accent}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-bold ${step.accent} opacity-60`}>
                        PASO {step.num}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#e5e2de] mb-3">
                      {step.title}
                    </h2>
                    <p className="text-[#87948c] leading-relaxed mb-3">
                      {step.desc}
                    </p>
                    <p className="text-sm text-[#87948c]/70 leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security callout */}
        <section className="pb-20 px-6">
          <div className="mx-auto max-w-[800px]">
            <div className="rounded-3xl bg-[#1D9E75]/5 border border-[#1D9E75]/20 p-8 min-[640px]:p-10 flex items-start gap-5">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1D9E75]/15">
                <Shield className="h-6 w-6 text-[#1D9E75]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#e5e2de] mb-2">
                  Tu seguridad es nuestra prioridad
                </h3>
                <p className="text-[#87948c] leading-relaxed">
                  Neto nunca accede a tu banca en línea ni te pide contraseñas
                  bancarias. Tus datos de gasto se construyen a partir de lo que tú
                  le mandas por WhatsApp. Todo está encriptado con TLS 1.3 y protegido
                  con Row-Level Security en Supabase. Puedes solicitar la eliminación
                  de tus datos cuando quieras.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-20 px-6">
          <div className="mx-auto max-w-[800px]">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="h-5 w-5 text-[#EF9F27]" />
              <h2 className="text-2xl font-bold text-[#e5e2de]">Preguntas frecuentes</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-2xl bg-[#1C1C19] border border-white/5 p-6">
                  <h3 className="font-semibold text-[#e5e2de] mb-2">{faq.q}</h3>
                  <p className="text-sm text-[#87948c] leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 px-6">
          <div className="mx-auto max-w-[800px] text-center">
            <h2 className="text-3xl font-bold text-[#e5e2de] mb-4">
              Empieza en 2 minutos
            </h2>
            <p className="text-[#87948c] mb-8 max-w-md mx-auto">
              Escríbele &quot;Hola&quot; a Neto por WhatsApp y empieza a registrar
              tu primer gasto. Gratis, sin contraseñas, sin descargar nada.
            </p>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#1D9E75] hover:bg-[#1D9E75]/90 text-white font-semibold px-8 py-4 text-lg transition-colors"
            >
              Regístrate ahora
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>
      <Footer />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howItWorksSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
