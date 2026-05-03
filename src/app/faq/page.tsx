import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { WA_NUMBER } from "@/lib/constants";

const FAQ_DATA = [
  {
    group: "Sobre el servicio",
    items: [
      {
        q: "¿Qué es Neto exactamente?",
        a: "Neto es tu asistente financiero personal que opera 100% por WhatsApp. Le mandas un mensaje en lenguaje natural (\"gasté 45 en almuerzo\") o una foto de tu voucher Yape/Plin. Neto lo categoriza con IA y arma tu dashboard. Sin apps que descargar.",
        aPlain:
          "Neto es tu asistente financiero personal que opera 100% por WhatsApp. Le mandas un mensaje en lenguaje natural o una foto de Yape/Plin. Neto lo categoriza con IA y arma tu dashboard. Sin apps que descargar.",
      },
      {
        q: "¿Qué bancos y billeteras son compatibles?",
        a: 'Funciona con todos. Como tú le mandas el monto o el voucher por WhatsApp, no depende del banco. Funciona con BCP, BBVA, Interbank, Scotiabank, Yape, Plin, Falabella, Ripley, BanBif, Mibanco, CMAC y efectivo. Si tienes un caso especial, escríbenos a <a href="mailto:hola@neto.pe" class="text-neto-green hover:underline">hola@neto.pe</a>.',
        aPlain:
          "Funciona con todos. Como tú le mandas el monto o el voucher por WhatsApp, no depende del banco. Funciona con BCP, BBVA, Interbank, Scotiabank, Yape, Plin, Falabella, Ripley, BanBif, Mibanco, CMAC y efectivo.",
      },
      {
        q: "¿Neto funciona sin internet o fuera de Lima?",
        a: "Necesitas internet para mandarle mensajes a Neto por WhatsApp y para que el dashboard sincronice. Funciona desde cualquier lugar del Perú — no importa dónde estés.",
        aPlain:
          "Necesitas internet para mandarle mensajes a Neto por WhatsApp y para que el dashboard sincronice. Funciona desde cualquier lugar del Perú — no importa dónde estés.",
      },
    ],
  },
  {
    group: "Privacidad y seguridad",
    items: [
      {
        q: "¿Neto accede a mi cuenta bancaria?",
        a: "No. Neto nunca accede a tu banca en línea ni te pide usuario o contraseña bancaria. Tus datos de gasto se construyen a partir de lo que tú le mandas a Neto por WhatsApp — un mensaje, una foto de voucher Yape/Plin o un screenshot.",
        aPlain:
          "No. Neto nunca accede a tu banca en línea ni te pide usuario o contraseña bancaria. Tus datos de gasto se construyen a partir de lo que tú le mandas a Neto por WhatsApp.",
      },
      {
        q: "¿Qué información guarda Neto sobre mí?",
        a: 'Solo los datos de los gastos que tú le mandas: monto, comercio, fecha y categoría. No accedemos a tus correos, mensajes ni a otra información personal. Puedes solicitar la eliminación de tus datos cuando quieras escribiéndonos por WhatsApp. Más detalles en nuestra <a href="/privacidad" class="text-neto-green hover:underline">Política de Privacidad</a>.',
        aPlain:
          "Solo los datos de los gastos que tú le mandas: monto, comercio, fecha y categoría. No accedemos a tus correos, mensajes ni a otra información personal. Puedes solicitar la eliminación de tus datos cuando quieras.",
      },
      {
        q: "¿Venden mis datos a terceros?",
        a: 'No. Nunca. Tus datos financieros son estrictamente personales y solo se usan para brindarte el servicio. Consulta nuestra <a href="/privacidad" class="text-neto-green hover:underline">Política de Privacidad</a> para más detalles.',
        aPlain:
          "No. Nunca. Tus datos financieros son estrictamente personales y solo se usan para brindarte el servicio.",
      },
    ],
  },
  {
    group: "Planes y pagos",
    items: [
      {
        q: "¿Qué incluye el plan gratis?",
        a: 'El plan gratis incluye: resumen de gastos por WhatsApp, categorización automática con IA, corrección de categorías y consultas en lenguaje natural ("¿cuánto gasté en delivery?"). Es gratis para siempre, sin tarjeta de crédito.',
        aPlain:
          'El plan gratis incluye: resumen de gastos por WhatsApp, categorización automática con IA, corrección de categorías y consultas en lenguaje natural. Es gratis para siempre, sin tarjeta de crédito.',
      },
      {
        q: "¿Qué incluye el plan Pro?",
        a: "El plan Pro (S/10/mes o S/99/año) incluye todo lo del plan Gratis más: reportes mensuales web ilimitados, historial ilimitado de transacciones, resúmenes automáticos configurables, score de salud financiera detallado y la opción de pagar con Yape o tarjeta.",
        aPlain:
          "El plan Pro (S/10/mes o S/99/año) incluye todo lo del plan Gratis más: reportes mensuales web ilimitados, historial ilimitado de transacciones, resúmenes automáticos configurables, score de salud financiera detallado y la opción de pagar con Yape o tarjeta.",
      },
      {
        q: "¿Puedo pagar con Yape?",
        a: "Sí. Neto acepta Yape, tarjeta de débito y tarjeta de crédito. Somos el único asistente financiero en Perú que acepta Yape como método de pago.",
        aPlain:
          "Sí. Neto acepta Yape, tarjeta de débito y tarjeta de crédito. Somos el único asistente financiero en Perú que acepta Yape como método de pago.",
      },
      {
        q: "¿Puedo cancelar cuando quiera?",
        a: "Sí, sin trámites ni penalidades. Si cancelas, mantienes el acceso Pro hasta el final del periodo pagado y luego bajas automáticamente al plan Gratis. Tus datos históricos se conservan.",
        aPlain:
          "Sí, sin trámites ni penalidades. Si cancelas, mantienes el acceso Pro hasta el final del periodo pagado y luego bajas automáticamente al plan Gratis. Tus datos históricos se conservan.",
      },
    ],
  },
  {
    group: "Uso del servicio",
    items: [
      {
        q: "¿Cómo empiezo a usar Neto?",
        a: `Escríbenos por WhatsApp al <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener noreferrer" class="text-neto-green hover:underline">+51 933 014 505</a>. Neto te guiará paso a paso para registrar tu primer gasto. El proceso toma menos de 2 minutos.`,
        aPlain:
          "Escríbenos por WhatsApp al +51 933 014 505. Neto te guiará paso a paso para registrar tu primer gasto. El proceso toma menos de 2 minutos.",
      },
      {
        q: "¿Puedo corregir una categoría incorrecta?",
        a: 'Sí. Solo escríbele a Neto en lenguaje natural: "Cambia Rappi a delivery" o "Ese cargo de Netflix es suscripción". Neto lo corrige y aprende para futuras transacciones del mismo comercio.',
        aPlain:
          'Sí. Solo escríbele a Neto en lenguaje natural: "Cambia Rappi a delivery" o "Ese cargo de Netflix es suscripción". Neto lo corrige y aprende para futuras transacciones del mismo comercio.',
      },
      {
        q: "¿Cada cuánto llega el resumen automático?",
        a: "Con el plan Pro puedes configurar la frecuencia y el horario que prefieras. Con el plan Gratis puedes pedir tu resumen cuando quieras escribiendo a Neto por WhatsApp.",
        aPlain:
          "Con el plan Pro puedes configurar la frecuencia y el horario que prefieras. Con el plan Gratis puedes pedir tu resumen cuando quieras escribiendo a Neto por WhatsApp.",
      },
      {
        q: "¿Qué es el reporte mensual web?",
        a: "Es un reporte completo disponible en el navegador. Incluye: análisis de gastos por categoría, top comercios, suscripciones detectadas, score de salud financiera y 3 acciones concretas para el mes siguiente. Se accede desde un link que Neto te envía por WhatsApp.",
        aPlain:
          "Es un reporte completo disponible en el navegador. Incluye: análisis de gastos por categoría, top comercios, suscripciones detectadas, score de salud financiera y 3 acciones concretas para el mes siguiente. Se accede desde un link que Neto te envía por WhatsApp.",
      },
    ],
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_DATA.flatMap((group) =>
    group.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.aPlain,
      },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Navbar />
      <main className="bg-neto-bg min-h-screen">
        <article className="mx-auto max-w-[800px] px-6 pt-28 pb-20 md:pt-32">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neto-green mb-3">
            <span className="w-4 h-[2px] bg-neto-green" />
            Ayuda
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Preguntas frecuentes
          </h1>
          <p className="text-base text-neto-txt2 font-light mb-10 pb-6 border-b border-white/7 leading-relaxed">
            Todo lo que necesitas saber antes de empezar. Si no encuentras tu
            respuesta, escríbenos a{" "}
            <a href="mailto:hola@neto.pe" className="text-neto-green hover:underline">
              hola@neto.pe
            </a>
            .
          </p>

          {/* FAQ Groups */}
          <div className="space-y-10">
            {FAQ_DATA.map((group) => (
              <section key={group.group}>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neto-green mb-3">
                  <span className="w-3.5 h-[2px] bg-neto-green" />
                  {group.group}
                </div>
                <div>
                  {group.items.map((item) => (
                    <details key={item.q} className="group border-b border-white/6">
                      <summary className="flex items-start justify-between gap-4 py-4 cursor-pointer list-none">
                        <span className="text-[15px] font-medium text-neto-txt leading-snug flex-1">
                          {item.q}
                        </span>
                        <span className="text-lg text-neto-green shrink-0 mt-0.5 transition-transform duration-200 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <div
                        className="pb-4 text-sm text-neto-txt2 leading-7"
                        dangerouslySetInnerHTML={{ __html: item.a }}
                      />
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* CTA Box */}
          <div className="bg-neto-green rounded-2xl p-7 mt-12 flex items-center justify-between gap-5 flex-wrap">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                ¿Tienes otra pregunta?
              </h3>
              <p className="text-sm text-white/75">
                Escríbenos y te respondemos en menos de 24 horas.
              </p>
            </div>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-neto-green-dark rounded-full px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity shrink-0"
            >
              Escribir a Neto
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
