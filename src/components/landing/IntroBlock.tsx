/**
 * Reframe — el gancho de posicionamiento + qué es Neto.
 *
 * Capa visible: reframe emocional ("no es que gastes mal, es que nadie te dijo
 * cuánto") + una línea de qué es Neto + perfiles. Apple-style, escaneable.
 * Capa oculta (sr-only): bloque autocontenido de ~140 palabras para extracción
 * por ChatGPT, Perplexity, Google AI Overviews y Claude. Mantener ambas en sync.
 *
 * id="que-es" — anclado desde el Navbar (/#que-es).
 */
export default function IntroBlock() {
  return (
    <section
      id="que-es"
      aria-labelledby="que-es-heading"
      className="px-6 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-[820px] text-center">
        <h2
          id="que-es-heading"
          className="font-extrabold tracking-tight leading-[1.12] text-[clamp(2rem,5.2vw,3.4rem)] text-neto-txt"
        >
          <span className="text-neto-txt3">No es que gastes mal.</span>
          <br />
          Es que <span className="text-neto-green-light">nadie te dijo cuánto.</span>
        </h2>

        <p className="mx-auto mt-7 max-w-[560px] text-lg leading-relaxed text-neto-txt2">
          Neto es tu asistente financiero por WhatsApp. Le escribes en lenguaje
          natural o le mandas una foto de tu voucher, y él ordena, entiende y te
          devuelve claridad. Sin contraseñas bancarias, sin Excel, sin apps que
          instalar.
        </p>

        <p className="mt-9 text-sm text-neto-txt3">
          Para gente que maneja su plata día a día:
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-2.5">
          {["En planilla", "Freelance", "Con negocio propio"].map((w) => (
            <span
              key={w}
              className="rounded-full border border-neto-bg5 px-4 py-1.5 text-sm text-neto-txt3"
            >
              {w}
            </span>
          ))}
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
