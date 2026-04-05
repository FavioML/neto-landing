"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE, delay },
});

const FEATURES = [
  {
    msg: '"Le presté S/200 a Juan"',
    response: "Anotado ✓ — Juan te debe S/200. Te aviso cuando se acerque la fecha.",
  },
  {
    msg: '"Pagué S/150 de cuota del préstamo"',
    response: "Registrado ✓ — Te quedan 8 cuotas. Progreso: 38% pagado.",
  },
  {
    msg: '"¿Cuánto me deben?"',
    response: "Juan: S/200 · María: S/80 · Total pendiente: S/280 💰",
  },
];

export default function DebtSection() {
  return (
    <section className="relative py-24 bg-neto-bg overflow-hidden">
      {/* Subtle amber glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] -z-10 bg-[#EF9F27]/[0.04] blur-[120px] pointer-events-none"
        aria-hidden
      />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 min-[1024px]:grid-cols-2 gap-16 items-center">

        {/* Left — copy */}
        <div className="flex flex-col gap-8">
          <motion.div {...fadeUp(0.05)} className="flex flex-col gap-4">
            {/* Tag */}
            <span className="inline-flex w-fit items-center gap-2 border border-neto-amber/30 bg-neto-amber/10 px-4 py-1 rounded-full text-xs text-neto-amber font-medium">
              Solo en Neto — ningún otro asistente financiero en Perú lo tiene
            </span>

            {/* Headline */}
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.1] tracking-tight">
              <span className="block text-neto-txt">
                ¿Le debes a alguien
              </span>
              <span className="block bg-gradient-to-r from-neto-amber to-neto-amber/70 bg-clip-text text-transparent">
                o te deben a ti?
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-neto-txt3 leading-relaxed max-w-[480px]">
              Registra deudas, préstamos y cuotas desde WhatsApp. Neto te
              recuerda cuándo cobrar y cuándo pagar — sin que tengas que
              acordarte solo.
            </p>
          </motion.div>

          {/* Bullets */}
          <motion.ul {...fadeUp(0.15)} className="flex flex-col gap-4">
            {[
              'Registra en segundos: "Le presté S/200 a Juan"',
              "Recibe alertas automáticas antes de cada fecha de pago",
              "Ve el balance completo: cuánto debes y cuánto te deben",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-neto-amber/20 flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-neto-amber" />
                </span>
                <span className="text-neto-txt2 text-sm leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right — WhatsApp mockup */}
        <motion.div
          {...fadeUp(0.1)}
          className="flex justify-center min-[1024px]:justify-end"
        >
          <div className="w-full max-w-[340px] rounded-3xl border border-neto-bg5 bg-neto-bg2 overflow-hidden shadow-2xl">
            {/* WA header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-neto-bg3 border-b border-neto-bg5">
              <div className="w-9 h-9 rounded-full bg-neto-amber/20 flex items-center justify-center text-base">
                💰
              </div>
              <div>
                <p className="text-neto-txt font-semibold text-sm leading-tight">
                  Neto
                </p>
                <p className="text-neto-txt3 text-xs">en línea</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 px-4 py-4">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex flex-col gap-2">
                  {/* User message */}
                  <div className="self-end max-w-[80%] bg-[#1D9E75]/20 rounded-2xl rounded-tr-sm px-3 py-2">
                    <p className="text-neto-txt text-xs leading-relaxed">
                      {f.msg}
                    </p>
                  </div>
                  {/* Neto response */}
                  <div className="self-start max-w-[85%] bg-neto-bg4 border border-neto-bg5 rounded-2xl rounded-tl-sm px-3 py-2 flex gap-2 items-start">
                    <MessageCircle
                      size={12}
                      className="text-neto-amber mt-0.5 shrink-0"
                    />
                    <p className="text-neto-txt2 text-xs leading-relaxed">
                      {f.response}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
