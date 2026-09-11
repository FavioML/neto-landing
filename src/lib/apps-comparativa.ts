/*
 * Los datos de las siete apps que compara neto.pe. Viven acá y no dentro de la página de la
 * comparativa porque tienen DOS lectores: `/comparativas/apps-finanzas-peru` y el post de precios
 * del blog (`blog-content.ts`). Un precio copiado a mano en los dos lados se desincroniza en el
 * primer refresco, y el que queda viejo es justo el que ChatGPT cita.
 *
 * Los datos de cada competidor salen de su web oficial y de su ficha en la App Store de Perú
 * (la ficha la escribe el propio desarrollador y los precios son los que ve alguien en Perú).
 * Lo que no se pudo verificar ahí no se escribe. Al refrescar un dato, actualizar su
 * `consultado`, y el `ACTUALIZADO` de la comparativa con su `<lastmod>`.
 */

export type Fuente = { nombre: string; url: string };

export type App = {
  name: string;
  homepage: string;
  operatingSystem: string;
  /** Columnas cortas de la tabla. */
  precioCorto: string;
  whatsapp: string;
  bancosPeru: string;
  /** Detalle de la tarjeta. */
  precio: string;
  plataformas: string;
  bancos: string;
  registro: string;
  espanol: string;
  resumen: string;
  /** Solo competidores: de dónde sale cada dato y cuándo se consultó. */
  fuentes?: Fuente[];
  consultado?: string;
};

export const APPS: App[] = [
  {
    name: "Neto",
    homepage: "https://neto.pe",
    operatingSystem: "WhatsApp, Web",
    precioCorto: "Registrar gratis · Pro S/10/mes",
    whatsapp: "Sí",
    bancosPeru: "No se conecta; registras tú",
    precio:
      "Registrar es gratis siempre. Ver el dashboard, el historial y el score es Neto Pro: S/10 al mes o S/99 al año, después de 14 días de prueba sin tarjeta.",
    plataformas: "WhatsApp y web (app.neto.pe).",
    bancos:
      "No se conecta a ningún banco ni pide contraseñas. Lo que gastas en BCP, BBVA, Interbank, Scotiabank, Yape o Plin lo anotas tú.",
    registro:
      "Un mensaje de WhatsApp («almuerzo 18»), la foto del voucher o la captura del yapeo. La IA lee monto, comercio y fecha y lo categoriza.",
    espanol: "Sí, hecho en Perú. Registra en soles y en dólares.",
    resumen:
      "Incluye score de salud financiera 0-100, presupuestos, metas, deudas entre personas y espacios compartidos. Opcional y solo en Pro: conectar tu Gmail para que Neto sume los correos de notificación que tu banco ya te envía (beta). Es un complemento; lo principal sigue siendo lo que anotas.",
  },
  {
    name: "Monefy",
    homepage: "https://www.monefy.com",
    operatingSystem: "iOS, Android",
    precioCorto: "Gratis · Premium desde S/ 154.90",
    whatsapp: "No",
    bancosPeru: "No se conecta",
    precio:
      "Gratis. Premium como compra dentro de la app: la App Store de Perú lista opciones de S/ 154.90 y S/ 229.90. Según sus términos, Premium puede ser mensual, anual o pago único.",
    plataformas: "iOS y Android.",
    bancos:
      "Sus fuentes oficiales no ofrecen conexión bancaria: las cuentas (efectivo, tarjetas, banco) las creas y llenas tú.",
    registro: "Manual, dentro de la app.",
    espanol: "Sí, entre 16 idiomas.",
    resumen:
      "Varias monedas, con el tipo de cambio que defines tú. Sincroniza entre dispositivos a través de tu propio Google Drive o Dropbox. Desarrollada por Reflective Technologies ApS.",
    fuentes: [
      { nombre: "App Store Perú", url: "https://apps.apple.com/pe/app/monefy-money-tracker/id1212024409" },
      { nombre: "Centro de ayuda", url: "https://www.monefy.com/help-center" },
      { nombre: "Términos de servicio", url: "https://www.monefy.com/terms-of-service" },
    ],
    consultado: "2026-09-11",
  },
  {
    name: "Wallet by BudgetBakers",
    homepage: "https://budgetbakers.com",
    operatingSystem: "iOS, Android, Web, macOS",
    precioCorto: "Gratis · Premium S/ 22.90/mes",
    whatsapp: "No",
    bancosPeru: "Sincroniza bancos, pero no nombra ninguno peruano",
    precio:
      "Gratis con registro manual. Premium en la App Store de Perú: S/ 22.90 al mes, S/ 99.90 al año, S/ 229.90 por tres años o S/ 199.90 de por vida.",
    plataformas: "iOS, Android, web y macOS.",
    bancos:
      "Sincroniza cuentas bancarias en Premium (declara más de 15 000 entidades en más de 80 países). Ninguna de sus páginas oficiales nombra un banco peruano.",
    registro:
      "Manual, importación de archivos CSV, XLS u OFX, o sincronización bancaria.",
    espanol: "Sí.",
    resumen:
      "Varias monedas con tipo de cambio automático. En Premium permite compartir cuentas y metas con otras personas.",
    fuentes: [
      { nombre: "Página de Wallet", url: "https://budgetbakers.com/en/products/wallet/" },
      { nombre: "Sincronización bancaria", url: "https://budgetbakers.com/en/products/wallet/features/bank-sync/" },
      { nombre: "App Store Perú", url: "https://apps.apple.com/pe/app/wallet-personal-finance/id1032467659" },
    ],
    consultado: "2026-09-11",
  },
  {
    name: "Money Manager",
    homepage: "https://www.realbyteapps.com",
    operatingSystem: "iOS, Android",
    precioCorto: "Gratis · sin anuncios S/ 12.90 único",
    whatsapp: "No",
    bancosPeru: "No se conecta",
    precio:
      "Gratis. La versión sin anuncios es un pago único de S/ 12.90 en la App Store de Perú. Sincronizar entre dispositivos es una suscripción aparte: S/ 9.90 al mes o S/ 76.90 al año.",
    plataformas:
      "iOS y Android. Se puede manejar desde la computadora por Wi-Fi, con el celular como servidor.",
    bancos: "Su descripción oficial no ofrece conexión con bancos.",
    registro: "Manual, con contabilidad de doble entrada.",
    espanol: "Sí. En la App Store de Perú aparece como «Registro Contable».",
    resumen:
      "Varias monedas a la vez, presupuestos semanales, mensuales o anuales, copia de seguridad por correo o iCloud y exportación a Excel. Desarrollada por Realbyte.",
    fuentes: [
      { nombre: "App Store Perú (gratis)", url: "https://apps.apple.com/pe/app/money-manager-expense-budget/id560481810" },
      { nombre: "App Store Perú (sin anuncios)", url: "https://apps.apple.com/pe/app/money-manager-remove-ads/id564730202" },
    ],
    consultado: "2026-09-11",
  },
  {
    name: "Mobills",
    homepage: "https://www.mobills.com.br",
    operatingSystem: "iOS, Android, Web",
    precioCorto: "Gratis · Premium R$ 99,90/año",
    whatsapp: "Solo en su plan PRO",
    bancosPeru: "Ningún banco peruano",
    precio:
      "Gratis. Premium a R$ 99,90 al año según su web, en reales brasileños. La App Store de Perú lista compras desde S/ 14.90.",
    plataformas: "iOS, Android y web.",
    bancos:
      "Su web menciona sincronizar cuentas de Nubank o Santander. Ninguna fuente oficial nombra un banco peruano.",
    registro:
      "Manual en la app. Su plan PRO anuncia una IA por WhatsApp para registrar gastos, según su página oficial de Facebook. No pudimos verificar su precio ni si funciona desde Perú.",
    espanol: "Sí, entre 6 idiomas. Su web está en portugués.",
    resumen: "App brasileña de control de gastos, con la misma suscripción para iOS, Android y web.",
    fuentes: [
      { nombre: "Precios", url: "https://www.mobills.com.br/pricing/" },
      { nombre: "App Store Perú", url: "https://apps.apple.com/pe/app/mobills-controle-de-gastos/id921838244" },
      { nombre: "Facebook oficial (plan PRO)", url: "https://www.facebook.com/mobillsapp/videos/intelig%C3%AAncia-artificial-nas-finan%C3%A7as/1312621343204186/" },
    ],
    consultado: "2026-09-11",
  },
  {
    name: "Spendee",
    homepage: "https://www.spendee.com",
    operatingSystem: "iOS, Android, Web",
    precioCorto: "Gratis · Plus US$1.99/mes",
    whatsapp: "No",
    bancosPeru: "Perú no está en su lista",
    precio:
      "Gratis. Plus a US$1.99 al mes o US$14.99 al año, y Premium a US$5.99 al mes o US$35.99 al año, según su web. Todos con 7 días de prueba.",
    plataformas: "iOS, Android y web.",
    bancos:
      "Sincroniza con más de 2500 entidades. Perú no aparece en su lista oficial de países.",
    registro: "Manual, escáner de recibos con IA o sincronización bancaria.",
    espanol: "Sí.",
    resumen: "Billeteras compartidas con otras personas y varias monedas.",
    fuentes: [
      { nombre: "Precios", url: "https://www.spendee.com/pricing" },
      { nombre: "Países y bancos", url: "https://www.spendee.com/supported-banks" },
      { nombre: "App Store Perú", url: "https://apps.apple.com/pe/app/spendee/id635861140" },
    ],
    consultado: "2026-09-11",
  },
  {
    name: "Fintonic",
    homepage: "https://www.fintonic.com",
    operatingSystem: "iOS, Android",
    precioCorto: "Gratis · no está en la App Store de Perú",
    whatsapp: "No",
    bancosPeru: "Solo bancos españoles",
    precio:
      "La app figura gratis en la App Store de España. Su web no publica el precio de ningún plan de pago.",
    plataformas: "iOS y Android. No aparece en la App Store de Perú.",
    bancos:
      "Lee cuentas de bancos españoles, como proveedor autorizado por el Banco de España. Su lista de bancos no incluye ninguno peruano.",
    registro: "Desde las cuentas bancarias españolas conectadas.",
    espanol: "Solo español.",
    resumen: "Opera en España. Ofrece FinScore, un puntaje financiero gratuito que se actualiza cada mes.",
    fuentes: [
      { nombre: "Web oficial (España)", url: "https://www.fintonic.com/es-ES/inicio/" },
      { nombre: "Bancos que conecta", url: "https://fintonic.ladesk.com/261786-Qu%C3%A9-bancos-puedo-conectar-en-Fintonic" },
      { nombre: "App Store España", url: "https://apps.apple.com/es/app/fintonic-ahorra-y-fin%C3%A1nciate/id672220319" },
    ],
    consultado: "2026-09-11",
  },
];
