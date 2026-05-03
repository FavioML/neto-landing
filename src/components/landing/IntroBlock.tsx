/**
 * IntroBlock — bloque de respuesta auto-contenido para AI search.
 * Texto plano de 140-160 palabras optimizado para extracción por ChatGPT,
 * Perplexity y Google AI Overviews. No depende de animaciones ni JS.
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
          className="text-2xl sm:text-3xl font-bold tracking-tight mb-5 text-[#e5e2de]"
        >
          ¿Qué es Neto?
        </h2>
        <p className="text-base sm:text-[17px] leading-7 text-[#c8c5bd]">
          Neto es un asistente financiero personal que opera 100% por WhatsApp
          para usuarios en Perú. Le mandas un mensaje en lenguaje natural
          (&quot;gasté 45 en almuerzo&quot;) o una foto de tu voucher Yape o
          Plin, y Neto categoriza el gasto con inteligencia artificial. El
          resultado aparece en un dashboard web con tu historial de gastos,
          ingresos, presupuestos, metas y un score de salud financiera del 0
          al 100. Neto funciona con BCP, BBVA Perú, Interbank, Scotiabank,
          Yape y Plin, además de Falabella, Ripley, BanBif, Mibanco y CMAC.
          No te pide contraseñas bancarias ni accede a tu banca en línea: tus
          datos de gasto se construyen a partir de lo que tú registras. El
          plan gratuito incluye registro por WhatsApp, presupuestos
          ilimitados, lectura de imágenes de Yape/Plin y dashboard del mes
          actual. El plan Pro cuesta S/10 al mes o S/99 al año y desbloquea
          historial completo, reportes PDF, score detallado y resumen diario
          con IA. Neto está desarrollado por Vortik en Lima, Perú.
        </p>
      </div>
    </section>
  );
}
