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
        a: "No. Neto nunca accede a tu banca en línea ni te pide usuario o contraseña bancaria, y no existe ninguna conexión directa con tu banco. Tus datos de gasto se construyen a partir de lo que tú le mandas a Neto por WhatsApp — un mensaje, una foto de voucher Yape/Plin o un screenshot — y, si tienes Pro y lo activas tú, de los correos de notificación que tu banco ya te envía.",
        aPlain:
          "No. Neto nunca accede a tu banca en línea ni te pide usuario o contraseña bancaria, y no existe ninguna conexión directa con tu banco. Tus datos de gasto se construyen a partir de lo que tú le mandas a Neto por WhatsApp y, si tienes Pro y lo activas tú, de los correos de notificación que tu banco ya te envía.",
      },
      {
        q: "¿Qué información guarda Neto sobre mí?",
        a: 'Los datos de los gastos que tú le mandas: monto, comercio, fecha y categoría. No leemos tus correos personales ni tus chats. Lo único que Neto puede leer de tu bandeja son los correos de notificación bancaria, y solo si tienes Pro y conectas tu Gmail tú mismo: es opcional, es de solo lectura y lo desconectas cuando quieras. Puedes solicitar la eliminación de tus datos cuando quieras escribiéndonos por WhatsApp. Más detalles en nuestra <a href="/privacidad" class="text-neto-green hover:underline">Política de Privacidad</a>.',
        aPlain:
          "Los datos de los gastos que tú le mandas: monto, comercio, fecha y categoría. No leemos tus correos personales ni tus chats. Lo único que Neto puede leer de tu bandeja son los correos de notificación bancaria, y solo si tienes Pro y conectas tu Gmail tú mismo: es opcional, es de solo lectura y lo desconectas cuando quieras.",
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
        q: "¿Cómo funciona la prueba de 14 días?",
        a: 'Cuando anotas tu primer gasto se activan 14 días de Neto Pro con todo abierto: dashboard, score, historial completo, presupuestos y reportes. Los días arrancan con ese primer gasto, no con el registro, así que nadie quema la prueba sin haber usado nada. No se pide tarjeta.',
        aPlain:
          "Cuando anotas tu primer gasto se activan 14 días de Neto Pro con todo abierto: dashboard, score, historial completo, presupuestos y reportes. Los días arrancan con ese primer gasto, no con el registro. No se pide tarjeta.",
      },
      {
        q: "¿Qué pasa cuando terminan los 14 días?",
        a: 'Neto sigue anotando todo lo que le mandes por WhatsApp, sin límite y sin costo, incluidas las fotos de tu Yape o Plin, y sigue mostrándote tu total del mes. No se borra nada. Lo que se cierra es verlos ordenados: dashboard, gráficos, categorías, historial y reportes quedan detrás de Pro.',
        aPlain:
          "Neto sigue anotando todo lo que le mandes por WhatsApp, sin límite y sin costo, incluidas las fotos de tu Yape o Plin, y sigue mostrándote tu total del mes. No se borra nada. Lo que se cierra es verlos ordenados: dashboard, gráficos, categorías, historial y reportes quedan detrás de Pro.",
      },
      {
        q: "¿Qué incluye Neto Pro?",
        a: "Neto Pro cuesta S/10 al mes o S/99 al año e incluye: dashboard completo con gráficos y categorías, Neto Score con detalle y tendencia, historial completo sin límite de meses, presupuestos y metas ilimitados, detector de fugas y alertas, espacios compartidos hasta 6 personas, y reportes con export CSV/Excel.",
        aPlain:
          "Neto Pro cuesta S/10 al mes o S/99 al año e incluye: dashboard completo con gráficos y categorías, Neto Score con detalle y tendencia, historial completo sin límite de meses, presupuestos y metas ilimitados, detector de fugas y alertas, espacios compartidos hasta 6 personas, y reportes con export CSV/Excel.",
      },
      {
        q: "¿Neto puede leer mis correos del banco?",
        a: 'Sí, está en beta. Con Neto Pro activo puedes conectar tu Gmail y Neto registra solo los gastos de las notificaciones que tu banco ya te envía, sin que anotes nada. Es opcional y la conectas tú: el permiso es de solo lectura y únicamente sobre correos de notificación bancaria, nunca tu banca en línea ni tus contraseñas, y puedes desconectarla cuando quieras. Como está en beta, hay cupos limitados y no se habilita durante la prueba de 14 días.',
        aPlain:
          "Sí, está en beta. Con Neto Pro activo puedes conectar tu Gmail y Neto registra solo los gastos de las notificaciones que tu banco ya te envía. Es opcional: el permiso es de solo lectura y únicamente sobre correos de notificación bancaria, nunca tu banca en línea ni tus contraseñas, y puedes desconectarla cuando quieras. Como está en beta, hay cupos limitados y no se habilita durante la prueba de 14 días.",
      },
      {
        q: "¿Cómo se paga?",
        a: "Por Yape. Eliges el plan, yapeas el monto y envías la captura: no hay pasarela ni datos de tarjeta de por medio. Por eso tampoco hay cobro automático — Pro no se renueva solo.",
        aPlain:
          "Por Yape. Eliges el plan, yapeas el monto y envías la captura: no hay pasarela ni datos de tarjeta de por medio. Por eso tampoco hay cobro automático: Pro no se renueva solo.",
      },
      {
        q: "¿Puedo cancelar cuando quiera?",
        a: "No hay nada que cancelar: como el pago es un Yape manual, Pro simplemente no se renueva solo. Al terminar el periodo que pagaste, Neto sigue anotando tus gastos gratis y tus datos históricos se conservan completos.",
        aPlain:
          "No hay nada que cancelar: como el pago es un Yape manual, Pro simplemente no se renueva solo. Al terminar el periodo que pagaste, Neto sigue anotando tus gastos gratis y tus datos históricos se conservan completos.",
      },
    ],
  },
  {
    group: "Uso del servicio",
    items: [
      {
        q: "¿Cómo empiezo a usar Neto?",
        a: `Tienes dos caminos: crea tu cuenta en <a href="https://app.neto.pe" target="_blank" rel="noopener noreferrer" class="text-neto-green hover:underline">app.neto.pe</a> con Google o tu correo, o escríbele a Neto por WhatsApp al <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener noreferrer" class="text-neto-green hover:underline">+51 933 014 505</a>. Empiezas por donde quieras, en menos de 2 minutos.`,
        aPlain:
          "Tienes dos caminos: crea tu cuenta en app.neto.pe con Google o tu correo, o escríbele a Neto por WhatsApp al +51 933 014 505. Empiezas por donde quieras, en menos de 2 minutos.",
      },
      {
        q: "¿Se sincroniza mi cuenta entre la app y WhatsApp?",
        a: "Sí, cuando conectas los dos canales. Si empezaste en la web, entra a tu cuenta y conecta tu WhatsApp: Neto te da un código que envías por chat y desde ahí es una sola cuenta, todo lo que registres aparece en los dos lados. Igual funciona si empezaste por WhatsApp y también quieres el dashboard web.",
        aPlain:
          "Sí, cuando conectas los dos canales. Si empezaste en la web, entra a tu cuenta y conecta tu WhatsApp: Neto te da un código que envías por chat y desde ahí es una sola cuenta, todo lo que registres aparece en los dos lados. Igual funciona si empezaste por WhatsApp y también quieres el dashboard web.",
      },
      {
        q: "¿Puedo corregir una categoría incorrecta?",
        a: 'Sí. Solo escríbele a Neto en lenguaje natural: "Cambia Rappi a delivery" o "Ese cargo de Netflix es suscripción". Neto lo corrige y aprende para futuras transacciones del mismo comercio.',
        aPlain:
          'Sí. Solo escríbele a Neto en lenguaje natural: "Cambia Rappi a delivery" o "Ese cargo de Netflix es suscripción". Neto lo corrige y aprende para futuras transacciones del mismo comercio.',
      },
      {
        q: "¿Cada cuánto llega el resumen automático?",
        a: "Con Neto Pro puedes configurar la frecuencia y el horario que prefieras, y pedir tu resumen cuando quieras por WhatsApp. Sin Pro, Neto sigue anotando todo y te muestra tu total del mes en cada gasto que registras.",
        aPlain:
          "Con Neto Pro puedes configurar la frecuencia y el horario que prefieras, y pedir tu resumen cuando quieras por WhatsApp. Sin Pro, Neto sigue anotando todo y te muestra tu total del mes en cada gasto que registras.",
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
