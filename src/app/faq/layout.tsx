import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Neto Finanzas WhatsApp Perú",
  description:
    "Resuelve tus dudas sobre Neto: bancos compatibles (BCP, BBVA, Interbank, Scotiabank), privacidad, plan Pro y cómo empezar gratis en 2 minutos.",
  alternates: {
    canonical: "https://neto.pe/faq",
  },
  openGraph: {
    title: "FAQ — Neto Finanzas WhatsApp Perú",
    description:
      "Resuelve tus dudas sobre Neto: bancos compatibles, privacidad, plan Pro y cómo empezar gratis.",
    url: "https://neto.pe/faq",
    type: "website",
    locale: "es_PE",
    siteName: "Neto",
    images: [
      {
        url: "https://neto.pe/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Preguntas frecuentes — Neto",
      },
    ],
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
