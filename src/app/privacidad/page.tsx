import type { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { WA_NUMBER } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Política de Privacidad — Neto",
  description:
    "Conoce cómo Neto protege tu información financiera. Tus datos son los que tú registras, nunca accedemos a tu banca en línea, y todo viaja y se guarda cifrado.",
  alternates: { canonical: "https://neto.pe/privacidad" },
  openGraph: {
    title: "Política de Privacidad — Neto",
    description:
      "Conoce cómo Neto protege tu información financiera. Tus datos son los que tú registras y nunca accedemos a tu banca en línea.",
    url: "https://neto.pe/privacidad",
    type: "website",
    locale: "es_PE",
    siteName: "Neto",
  },
};

export default function PrivacidadPage() {
  return (
    <>
      <Navbar />
      <main className="bg-neto-bg min-h-screen">
        <article className="mx-auto max-w-[800px] px-6 pt-28 pb-20 md:pt-32">
          {/* Header */}
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neto-green mb-3">
            <span className="w-4 h-[2px] bg-neto-green" />
            Legal
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Politica de Privacidad
          </h1>
          <p className="text-sm text-neto-txt3 mb-10 pb-6 border-b border-white/7">
            Ultima actualizacion: agosto 2026 · Aplicable a usuarios de neto.pe
            y el servicio Neto por WhatsApp
          </p>

          {/* Content */}
          <div className="space-y-8">
            {/* Highlight box */}
            <div className="bg-neto-bg3 border border-white/7 border-l-[3px] border-l-neto-green rounded-r-xl p-4">
              <p className="text-sm text-neto-txt2">
                <strong>Resumen simple:</strong> tus datos son los movimientos
                que tu registras. Si ademas conectas tu Gmail —opcional y solo
                en Pro— Neto lee unicamente los correos de notificacion de
                transacciones. Nunca leemos correos personales, nunca accedemos
                a tu banca en linea, nunca almacenamos contrasenas y nunca
                vendemos tus datos a terceros.
              </p>
            </div>

            <section>
              <h2 className="text-lg font-bold tracking-tight mb-3">
                1. Quienes somos
              </h2>
              <p className="text-sm text-neto-txt2 leading-7">
                Neto es un servicio de asistente financiero personal que opera a
                traves de WhatsApp. Nuestros datos de contacto son:{" "}
                <a
                  href="mailto:hola@neto.pe"
                  className="text-neto-green hover:underline"
                >
                  hola@neto.pe
                </a>{" "}
                y{" "}
                <a
                  href="https://neto.pe"
                  className="text-neto-green hover:underline"
                >
                  neto.pe
                </a>
                . Operamos desde Lima, Peru.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight mb-3">
                2. Que datos recopilamos
              </h2>
              <p className="text-sm text-neto-txt2 leading-7 mb-3">
                Recopilamos unicamente los datos necesarios para brindarte el
                servicio:
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Numero de WhatsApp:</strong> para enviarte resumenes y
                  notificaciones.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Los movimientos que registras:</strong> lo que
                  escribes por WhatsApp o en la aplicacion web, y las capturas
                  de comprobante que nos envias. La imagen se procesa para
                  extraer el monto, el comercio y la fecha; no la conservamos.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Correos de notificacion bancaria (opcional, solo
                  Pro):</strong> si conectas tu Gmail, unicamente los correos
                  automaticos que tu banco envia por cada transaccion (ej.
                  &quot;Se realizo un cargo de S/50 en tu tarjeta&quot;). No
                  accedemos a correos personales, laborales ni de ningun otro
                  tipo. Si no conectas Gmail, Neto no lee ningun correo tuyo.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Datos de transacciones:</strong> montos, comercios,
                  fechas y categorias, provenientes de lo que registras y, si
                  corresponde, de esos correos de notificacion.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Comprobante de pago de Neto Pro:</strong> si contratas
                  Pro, la captura del Yape con la que acreditas el pago se
                  conserva como respaldo de la operacion.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Datos de cuenta:</strong> nombre, numero de telefono y
                  preferencias de configuracion del servicio.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight mb-3">
                3. Como usamos tus datos
              </h2>
              <ul className="space-y-2">
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  Generar resumenes de gastos y enviartelos por WhatsApp.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  Categorizar tus transacciones automaticamente con inteligencia
                  artificial.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  Elaborar tu reporte mensual de salud financiera.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  Enviarte alertas sobre gastos inusuales o superacion de
                  promedios.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  Mejorar la precision de categorizacion y el funcionamiento del
                  servicio.
                </li>
              </ul>
              <p className="text-sm text-neto-txt2 leading-7 mt-3">
                <strong>No usamos tus datos para:</strong> publicidad de
                terceros, perfilamiento comercial, venta a otras empresas, ni
                ningun fin distinto a brindarte el servicio.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight mb-3">
                4. Acceso a Gmail
              </h2>
              <p className="text-sm text-neto-txt2 leading-7 mb-3">
                Conectar Gmail es <strong>opcional</strong>: es una funcion del
                plan Pro, la activas tu desde tu cuenta y Neto funciona
                completo sin ella. Si decides activarla, Neto solicita acceso
                limitado bajo el estandar OAuth 2.0 de Google. Ese acceso es
                especifico y restringido a:
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  Lectura de correos identificados como notificaciones de
                  transacciones de bancos y billeteras digitales peruanas. El
                  permiso es de solo lectura: Neto no puede enviar, borrar ni
                  modificar correos.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  Una sola cuenta de Google por usuario.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  No leemos, almacenamos ni procesamos ningun otro correo de tu
                  bandeja de entrada.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  Puedes revocar este acceso en cualquier momento desde tu
                  cuenta de Google en:{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neto-green hover:underline"
                  >
                    myaccount.google.com/permissions
                  </a>
                  .
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight mb-3">
                5. Almacenamiento y seguridad
              </h2>
              <p className="text-sm text-neto-txt2 leading-7 mb-3">
                Tus datos se almacenan en servidores seguros (Supabase) con las
                siguientes medidas:
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  Cifrado en transito (HTTPS/TLS) y en reposo.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  Acceso restringido por nivel de usuario (Row Level Security):
                  solo tu puedes ver tus propios datos.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  Tokens de acceso a Gmail cifrados y nunca expuestos en texto
                  plano.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight mb-3">
                6. Comparticion de datos con terceros
              </h2>
              <p className="text-sm text-neto-txt2 leading-7 mb-3">
                Neto utiliza los siguientes proveedores de servicios para
                operar:
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>OpenAI:</strong> interpretacion de los mensajes y las
                  capturas que nos envias, para extraer el monto, el comercio y
                  la categoria, y para generar resumenes. Se transmite el
                  contenido del movimiento —incluida la imagen del comprobante
                  cuando registras por foto—, no tus credenciales. Segun la
                  politica de la API de OpenAI, estos datos no se utilizan para
                  entrenar sus modelos.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Supabase:</strong> almacenamiento de base de datos.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Vercel:</strong> alojamiento de la aplicacion web
                  app.neto.pe.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Meta (WhatsApp Business API):</strong> envio de
                  mensajes.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Railway:</strong> infraestructura de servidores.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>PostHog, Google Analytics y Meta Pixel:</strong>{" "}
                  analiticas de producto para entender como se usa Neto y
                  mejorarlo. PostHog incluye grabaciones de sesion en las que
                  todos tus datos financieros (montos, comercios, transacciones)
                  van enmascarados y nunca quedan visibles.
                </li>
              </ul>
              <p className="text-sm text-neto-txt2 leading-7 mt-3">
                No vendemos, alquilamos ni compartimos tus datos con ninguna
                otra empresa, anunciante o tercero.
              </p>
              <p className="text-sm text-neto-txt2 leading-7 mt-3">
                Respetamos la senal &quot;Do Not Track&quot; de tu navegador.
                Ademas puedes desactivar las analiticas cuando quieras desde el
                enlace &quot;No rastrear mi actividad&quot; en el pie de pagina,
                o desde Configuracion en tu dashboard.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight mb-3">
                7. Tus derechos (Ley 29733 - Peru)
              </h2>
              <p className="text-sm text-neto-txt2 leading-7 mb-3">
                De acuerdo con la Ley de Proteccion de Datos Personales del Peru
                (Ley N 29733), tienes derecho a:
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Acceso:</strong> solicitar que datos tenemos sobre ti.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Rectificacion:</strong> corregir datos inexactos.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Cancelacion:</strong> eliminar tus datos. No hace falta
                  solicitarlo: puedes hacerlo tu mismo desde{" "}
                  <strong>Configuracion &rarr; Zona de peligro</strong> en la
                  aplicacion. El detalle de que se borra y que se conserva esta
                  en la seccion 8.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Oposicion:</strong> oponerte al tratamiento de tus
                  datos.
                </li>
              </ul>
              <p className="text-sm text-neto-txt2 leading-7 mt-3">
                Para ejercer cualquiera de estos derechos, escribenos a{" "}
                <a
                  href="mailto:hola@neto.pe"
                  className="text-neto-green hover:underline"
                >
                  hola@neto.pe
                </a>{" "}
                con el asunto &quot;Derechos ARCO&quot;.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight mb-3">
                8. Retencion de datos
              </h2>
              <p className="text-sm text-neto-txt2 leading-7">
                Conservamos tus datos mientras uses el servicio activamente.
              </p>
              <p className="text-sm text-neto-txt2 leading-7 mt-3">
                Puedes eliminar tu cuenta desde{" "}
                <strong>Configuracion &rarr; Zona de peligro</strong> en{" "}
                <a
                  href="https://app.neto.pe/dashboard/configuracion"
                  className="text-neto-green hover:underline"
                >
                  app.neto.pe
                </a>{" "}
                o pidiendonoslo por WhatsApp. El borrado ocurre en el momento, no
                en 30 dias: se eliminan tus movimientos, presupuestos, categorias,
                metas, deudas, alertas, notificaciones, el historial de tu
                conversacion con Neto y los comprobantes de pago que nos hayas
                enviado. Si tenias Gmail conectado, revocamos el permiso ante
                Google y borramos la direccion.
              </p>
              <p className="text-sm text-neto-txt2 leading-7 mt-3 mb-2">
                Esto es lo unico que se conserva despues, y por que:
              </p>
              <ul className="space-y-2">
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>El registro contable de tus pagos:</strong> monto, fecha
                  y plan contratado. Sin tu nombre, sin tu numero y sin el
                  comprobante que enviaste. Es la excepcion por obligacion legal.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Un identificador interno sin datos personales:</strong>{" "}
                  guarda la constancia de que pediste la baja, el plan que habias
                  pagado por si vuelves, y una huella irreversible del correo de
                  Google que hubieras conectado, para que no consuma dos veces un
                  cupo de conexion. No permite identificarte ni contactarte.
                </li>
                <li className="text-sm text-neto-txt2 leading-7 pl-5 relative before:content-['\2014'] before:absolute before:left-0 before:text-neto-green before:font-semibold">
                  <strong>Nuestras copias de respaldo cifradas</strong>, que por
                  seguridad no se pueden reescribir. Se eliminan solas por
                  rotacion: hasta 30 dias las diarias y hasta 12 meses las
                  mensuales.
                </li>
              </ul>
              <p className="text-sm text-neto-txt2 leading-7 mt-3">
                Si compartias un espacio, una deuda o una meta con otra persona,
                los movimientos que registraste ahi siguen en las cuentas de esa
                persona, ya sin tu nombre: son parte de su historial, no solo del
                tuyo.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight mb-3">
                9. Cambios a esta politica
              </h2>
              <p className="text-sm text-neto-txt2 leading-7">
                Si realizamos cambios significativos a esta politica, te
                notificaremos por WhatsApp con al menos 7 dias de anticipacion
                antes de que entren en vigor.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold tracking-tight mb-3">
                10. Contacto
              </h2>
              <p className="text-sm text-neto-txt2 leading-7">
                Para cualquier consulta sobre privacidad:{" "}
                <a
                  href="mailto:hola@neto.pe"
                  className="text-neto-green hover:underline"
                >
                  hola@neto.pe
                </a>{" "}
                o escribenos por{" "}
                <a
                  href={`https://wa.me/${WA_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neto-green hover:underline"
                >
                  WhatsApp al +51 933 014 505
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
