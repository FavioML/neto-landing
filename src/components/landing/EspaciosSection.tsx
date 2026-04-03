"use client";

import { motion } from "framer-motion";
import { Users, BarChart2, Scale, Lock } from "lucide-react";
import BlurReveal from "@/components/shared/BlurReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const FEATURES = [
  { icon: BarChart2, text: "Gastos compartidos con split automático" },
  { icon: Scale, text: "Balance: quién debe a quién" },
  { icon: BarChart2, text: "Presupuestos del espacio" },
  { icon: Lock, text: "Cada uno mantiene sus finanzas privadas" },
];

export default function EspaciosSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 min-[860px]:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <div>
            <BlurReveal>
              <div>
                <span className="rounded-full border border-neto-green/30 bg-neto-green/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-neto-green uppercase mb-5 inline-block">
                  Espacios compartidos
                </span>
                <h2 className="text-3xl min-[860px]:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 mt-4">
                  <span className="text-neto-txt">Manejen su plata juntos.</span>
                  <br />
                  <span
                    className="text-transparent bg-clip-text"
                    style={{
                      backgroundImage: "linear-gradient(135deg, #68dbae 0%, #1D9E75 100%)",
                      WebkitBackgroundClip: "text",
                    }}
                  >
                    Sin pelear.
                  </span>
                </h2>
                <p className="text-neto-txt3 text-base leading-relaxed mb-8">
                  Crea un espacio con tu pareja o roommate. Vean gastos compartidos, dividan cuentas y mantengan la paz financiera.
                </p>

                <ul className="flex flex-col gap-3">
                  {FEATURES.map((f, i) => {
                    const Icon = f.icon;
                    return (
                      <motion.li
                        key={f.text}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                      >
                        <div className="w-6 h-6 rounded-full bg-neto-green/15 flex items-center justify-center shrink-0">
                          <Icon size={12} className="text-neto-green" />
                        </div>
                        <span className="text-sm text-neto-txt2">{f.text}</span>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </BlurReveal>
          </div>

          {/* Right — visual */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="rounded-[28px] bg-neto-bg2/80 backdrop-blur-xl border border-white/[0.08] p-8 relative overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-24 bg-neto-green/10 blur-[60px] pointer-events-none" />

              {/* Avatars */}
              <div className="flex items-center justify-center gap-6 mb-6 relative z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-neto-green/20 border-2 border-neto-green/30 flex items-center justify-center text-2xl">
                    👩
                  </div>
                  <span className="text-xs text-neto-txt2 font-medium">Ana</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <Users size={20} className="text-neto-green" />
                  <span className="text-[10px] text-neto-green font-semibold">Espacio Depa</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-neto-amber/20 border-2 border-neto-amber/30 flex items-center justify-center text-2xl">
                    👨
                  </div>
                  <span className="text-xs text-neto-txt2 font-medium">Marco</span>
                </div>
              </div>

              {/* Expense rows */}
              <div className="space-y-2 relative z-10">
                {[
                  { label: "Alquiler", ana: "S/750", marco: "S/750", split: "50/50" },
                  { label: "Internet", ana: "S/45", marco: "S/45", split: "50/50" },
                  { label: "Delivery", ana: "S/80", marco: "S/40", split: "60/40" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg bg-white/[0.04] px-4 py-2.5 text-xs">
                    <span className="text-neto-txt2 flex-1">{row.label}</span>
                    <span className="text-neto-green-light w-14 text-right">{row.ana}</span>
                    <span className="text-neto-amber w-14 text-right">{row.marco}</span>
                    <span className="text-neto-txt3 w-12 text-right">{row.split}</span>
                  </div>
                ))}
              </div>

              {/* Balance */}
              <div className="mt-4 rounded-xl border border-neto-green/20 bg-neto-green/5 px-4 py-3 text-xs text-center relative z-10">
                <span className="text-neto-txt3">Balance: </span>
                <span className="text-neto-txt font-semibold">Marco le debe S/20 a Ana</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
