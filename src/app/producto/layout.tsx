import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Así se ve Neto por dentro — el dashboard de app.neto.pe",
  description:
    "Recorre la webapp de Neto: el Neto Score, presupuestos con alertas, transacciones categorizadas con IA y control de deudas. Producto real, no un render.",
  alternates: { canonical: "https://neto.pe/producto" },
  keywords:
    "dashboard finanzas personales, app finanzas peru, neto score, control de gastos, presupuestos, deudas, app.neto.pe",
  openGraph: {
    title: "Así se ve Neto por dentro",
    description:
      "El dashboard de Neto en app.neto.pe: Score, presupuestos, transacciones y deudas. Todo lo que registras por WhatsApp, ordenado y claro.",
    url: "https://neto.pe/producto",
    type: "website",
    locale: "es_PE",
    siteName: "Neto",
    images: [
      {
        url: "https://neto.pe/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "El dashboard de Neto por dentro",
      },
    ],
  },
};

const pageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Así se ve Neto por dentro — el dashboard de app.neto.pe",
  description:
    "Recorrido por la webapp de Neto: Neto Score, presupuestos con alertas, transacciones categorizadas con IA y control de deudas.",
  url: "https://neto.pe/producto",
  inLanguage: "es-PE",
  publisher: {
    "@type": "Organization",
    name: "Neto",
    url: "https://neto.pe",
  },
};

export default function ProductoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* JSON-LD as script children (JSON has no HTML-escapable chars) */}
      <script type="application/ld+json">{JSON.stringify(pageJsonLd)}</script>
      {children}
    </>
  );
}
