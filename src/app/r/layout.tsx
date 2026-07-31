import type { Metadata } from "next";

// Páginas de referido: personales y efímeras, no deben indexarse.
export const metadata: Metadata = {
  title: "Te invitaron a Neto — tu primer mes Pro a mitad de precio",
  description:
    "Un amigo te invitó a Neto, tu asistente financiero por WhatsApp. Regístrate gratis y estrena Pro a mitad de precio tu primer mes.",
  robots: { index: false, follow: true },
};

export default function ReferidoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
