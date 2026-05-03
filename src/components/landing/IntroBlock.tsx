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
          para usuarios en Perú. Lee los correos de notificación bancaria que
          recibes en Gmail (acceso de lectura, sin contraseñas y sin entrar a
          tu banca en línea), extrae cada compra, transferencia o pago, y los
          categoriza automáticamente con inteligencia artificial. El resultado
          aparece en un dashboard web con tu historial de gastos, ingresos,
          presupuestos, metas y un score de salud financiera del 0 al 100.
          Neto funciona con BCP, BBVA Perú, Interbank, Scotiabank, Yape y
          Plin, además de Falabella, Ripley, BanBif, Mibanco y CMAC. El plan
          gratuito incluye registro por WhatsApp, presupuestos ilimitados,
          lectura de fotos Yape y dashboard del mes actual. El plan Pro
          cuesta S/10 al mes o S/99 al año y desbloquea lectura automática
          de correos bancarios, historial completo, reportes PDF y resumen
          diario con IA. Neto está desarrollado por Vortik en Lima, Perú.
        </p>
      </div>
    </section>
  );
}
