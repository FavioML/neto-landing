"use client";

import { motion } from "framer-motion";
import { Shield, MessageCircle, Lock, Smartphone } from "lucide-react";
import BlurReveal from "@/components/shared/BlurReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const TRUST_QA = [
  {
    icon: MessageCircle,
    q: "¿Cómo registro mis gastos?",
    a: "Escríbele a Neto por WhatsApp en lenguaje natural: \"Gasté 45 en almuerzo\" o manda una foto de tu voucher Yape/Plin. Neto lo categoriza automáticamente.",
  },
  {
    icon: Smartphone,
    q: "¿Necesito descargar una app?",
    a: "No. Neto funciona 100% por WhatsApp — el app que ya tienes. Tu dashboard web está en app.neto.pe, sin instalar nada.",
  },
  {
    icon: Lock,
    q: "¿Mis datos están seguros?",
    a: "Sí. Datos encriptados con TLS 1.3, base de datos con Row Level Security. Nunca pedimos contraseñas bancarias ni accedemos a tu cuenta.",
  },
  {
    icon: Shield,
    q: "¿Puedo automatizar el registro?",
    a: "Sí. Si conectas tu Gmail, Neto lee solo las notificaciones de tu banco (BCP, BBVA, Interbank, Yape) y registra todo automáticamente. Es opcional.",
  },
];

const TECH_BADGES = ["WhatsApp", "Encriptado TLS 1.3", "Supabase RLS"];

export default function GmailTrust() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-neto-green/[0.02] to-transparent">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <BlurReveal>
          <div className="text-center mb-12">
            <span className="rounded-full border border-neto-green/30 bg-neto-green/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-neto-green uppercase mb-5 inline-block">
              Cómo funciona
            </span>
            <h2 className="text-3xl min-[860px]:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 text-neto-txt">
              Simple.{" "}
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "1.5px rgba(229,226,222,0.7)" }}
              >
                Seguro.
              </span>{" "}
              Por WhatsApp.
            </h2>
            <p className="text-neto-txt3 text-base max-w-[540px] mx-auto leading-relaxed">
              Neto vive en tu WhatsApp. Sin apps nuevas, sin hojas de cálculo, sin complicaciones.
            </p>
          </div>
        </BlurReveal>

        {/* Q&A grid */}
        <div className="grid grid-cols-1 min-[640px]:grid-cols-2 gap-4 mb-10">
          {TRUST_QA.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.q}
                className="rounded-[20px] bg-neto-bg2/60 border border-white/[0.07] p-6 backdrop-blur-sm"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              >
                <div className="w-8 h-8 rounded-lg bg-neto-green/15 flex items-center justify-center mb-4">
                  <Icon size={16} className="text-neto-green-light" />
                </div>
                <p className="text-sm font-semibold text-neto-txt mb-2">{item.q}</p>
                <p className="text-sm text-neto-txt3 leading-relaxed">{item.a}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2 justify-center">
          {TECH_BADGES.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-neto-bg5 bg-neto-bg3 px-4 py-1.5 text-xs font-medium text-neto-txt2"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
