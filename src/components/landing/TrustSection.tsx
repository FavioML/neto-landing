"use client";

import { motion } from "framer-motion";
import BlurReveal from "@/components/shared/BlurReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const CARDS = [
  {
    icon: "🔒",
    title: "Cero contraseñas bancarias",
    desc: "Nunca pedimos tu clave del banco ni accedemos a tu banca en línea. Tú registras, nosotros ordenamos.",
  },
  {
    icon: "💬",
    title: "Sin apps que instalar",
    desc: "Vive en el WhatsApp que ya tienes. Tu dashboard está en app.neto.pe, sin descargar nada.",
  },
  {
    icon: "🛡️",
    title: "Datos encriptados",
    desc: "TLS 1.3 y base de datos con Row Level Security. Login seguro con Google.",
  },
  {
    icon: "🇵🇪",
    title: "Hecho en Lima",
    desc: "Neto lo hace Vortik, un estudio peruano. No somos un banco. ¿Dudas? hola@neto.pe",
  },
];

const BADGES = ["WhatsApp", "Encriptado TLS 1.3", "Google OAuth 2.0", "Supabase RLS"];

/**
 * "Simple y seguro" — fuses the old GmailTrust (trust Q&A) and Security
 * sections. Placed after Pricing so it closes objections before the final CTA.
 */
export default function TrustSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-neto-green/[0.02] to-transparent">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <BlurReveal>
          <div className="flex flex-col items-center text-center mb-12 gap-4">
            <span className="rounded-full border border-neto-green/30 bg-neto-green/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-neto-green uppercase">
              Simple y seguro
            </span>
            <h2 className="text-3xl min-[860px]:text-5xl font-extrabold tracking-tight leading-[1.1] text-neto-txt">
              Tu plata es tuya.
              <br />
              Tus datos también.
            </h2>
          </div>
        </BlurReveal>

        {/* Cards */}
        <div className="grid grid-cols-1 min-[640px]:grid-cols-2 gap-3.5 max-w-[860px] mx-auto mb-7">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              className="rounded-[18px] bg-neto-bg2/60 border border-white/[0.07] p-[22px]"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
            >
              <div className="w-8 h-8 rounded-[9px] bg-neto-green/[0.14] grid place-items-center text-[15px] mb-3.5">
                {card.icon}
              </div>
              <h4 className="text-[15px] font-bold text-neto-txt mb-1.5">
                {card.title}
              </h4>
              <p className="text-neto-txt3 text-[13.5px] leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2.5 justify-center">
          {BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-neto-bg5 bg-neto-bg3 px-[15px] py-[7px] text-[12.5px] font-medium text-neto-txt2"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
