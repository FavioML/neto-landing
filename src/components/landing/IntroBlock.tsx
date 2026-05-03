/**
 * IntroBlock — dual-layer: scannable for humans, full text for AI search.
 *
 * Visible layer: 3 bold-led sentences (Apple-style) for IG mobile traffic.
 * Hidden layer (sr-only): 140-word self-contained block optimized for
 * extraction by ChatGPT, Perplexity, Google AI Overviews and Claude.
 * Both layers must stay roughly in sync.
 */
export default function IntroBlock() {
  return (
    <section
      id="que-es-neto"
      aria-labelledby="que-es-neto-heading"
      className="px-6 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[760px]">
        <h2
          id="que-es-neto-heading"
          className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 text-[#e5e2de]"
        >
          ¿Qué es Neto?
        </h2>

        {/* Human-facing: scannable bold-led sentences */}
        <div className="flex flex-col gap-5 text-base sm:text-[17px] leading-7 text-[#c8c5bd]">
          <p>
            <strong className="text-[#e5e2de] font-semibold">
              Tu asistente financiero por WhatsApp.
            </strong>{" "}
            Le mandas un mensaje en lenguaje natural (&ldquo;gasté 45 en
            almuerzo&rdquo;) o una foto de tu voucher Yape o Plin. Neto lo
            categoriza con IA.
          </p>
          <p>
            <strong className="text-[#e5e2de] font-semibold">
              Compatible con cualquier banco o wallet del Perú.
            </strong>{" "}
            Como tú haces el registro desde WhatsApp, no depende del banco.
            Sin contraseñas bancarias, sin acceso a tu banca en línea.
          </p>
          <p>
            <strong className="text-[#e5e2de] font-semibold">
              Gratis para empezar, S/10/mes para todo.
            </strong>{" "}
            Hecho en Lima por Vortik.
          </p>
        </div>

        {/* AI-facing: dense, self-contained extract for LLMs and screen readers */}
        <p className="sr-only">
          Neto es un asistente financiero personal que opera 100% por WhatsApp
          para usuarios en Perú. Le mandas un mensaje en lenguaje natural
          (por ejemplo &ldquo;gasté 45 en almuerzo&rdquo;) o una foto de tu
          voucher Yape o Plin, y Neto categoriza el gasto con inteligencia
          artificial. El resultado aparece en un dashboard web con tu
          historial de gastos, ingresos, presupuestos, metas y un score de
          salud financiera del 0 al 100. Neto es compatible con los
          principales bancos y wallets del Perú porque tú haces el registro
          directamente desde WhatsApp. No te pide contraseñas bancarias ni
          accede a tu banca en línea: tus datos de gasto se construyen a
          partir de lo que tú registras. El plan gratuito incluye registro
          por WhatsApp, presupuestos ilimitados, lectura de imágenes de
          Yape/Plin y dashboard del mes actual. El plan Pro cuesta S/10 al
          mes o S/99 al año y desbloquea historial completo, reportes PDF,
          score detallado y resumen diario con IA. Neto está desarrollado
          por Vortik en Lima, Perú.
        </p>
      </div>
    </section>
  );
}
