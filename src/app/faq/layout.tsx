import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes sobre Neto — Finanzas por WhatsApp en Perú",
  description:
    "Resuelve tus dudas sobre Neto: bancos compatibles (BCP, BBVA, Interbank), privacidad, plan Pro, y cómo empezar gratis.",
  alternates: {
    canonical: "https://neto.pe/faq",
  },
  openGraph: {
    title: "Preguntas frecuentes sobre Neto — Finanzas por WhatsApp en Perú",
    description:
      "Resuelve tus dudas sobre Neto: bancos compatibles, privacidad, plan Pro, y cómo empezar gratis.",
    url: "https://neto.pe/faq",
    type: "website",
    locale: "es_PE",
    siteName: "Neto",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children;
}
