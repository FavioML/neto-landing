import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — Neto | Asistente financiero por WhatsApp",
  description:
    "¿Tienes preguntas sobre Neto? Escríbenos por WhatsApp o completa el formulario. Respondemos en menos de 24 horas.",
  alternates: { canonical: "https://neto.pe/contacto" },
  openGraph: {
    title: "Contacto — Neto | Asistente financiero por WhatsApp",
    description:
      "¿Tienes preguntas sobre Neto? Escríbenos por WhatsApp o completa el formulario.",
    url: "https://neto.pe/contacto",
    type: "website",
    locale: "es_PE",
    siteName: "Neto",
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
