"use client";

import { motion } from "framer-motion";
import BlurReveal from "@/components/shared/BlurReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Score — the star differentiator. Copy on the left, a REAL capture of
 * app.neto.pe/dashboard/score on the right (not a mockup). The score gauge is
 * blue on purpose: that's the real product. id="score" (anchored from Navbar).
 */
export default function ScoreSection() {
  return (
    <section id="score" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 min-[900px]:grid-cols-[0.92fr_1.08fr] gap-10 min-[900px]:gap-12 items-center">
          {/* Left — copy */}
          <BlurReveal>
            <div className="flex flex-col">
              <span className="self-start rounded-full border border-neto-green/30 bg-neto-green/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-neto-green uppercase mb-5">
                El Neto Score
              </span>
              <h2 className="text-3xl min-[860px]:text-5xl font-extrabold tracking-tight leading-[1.08] mb-5 text-neto-txt">
                Un número que sí{" "}
                <span className="block text-neto-green-light">entiendes.</span>
              </h2>
              <p className="text-neto-txt2 text-[17px] leading-relaxed mb-4 max-w-[480px]">
                Tu score de salud financiera resume en un solo número cómo va tu
                mes: cuánto gastas frente a lo que ganas, si estás ahorrando, si
                tus deudas están bajo control.
              </p>
              <p className="text-neto-txt2 text-[17px] leading-relaxed mb-6 max-w-[480px]">
                Sube cuando ordenas tu plata y baja cuando algo se te escapa. Es
                la brújula que ninguna app de solo-anotar te da.
              </p>
              <span className="self-start inline-flex items-center gap-2 text-sm text-neto-txt3 border border-neto-bg5 rounded-full px-4 py-2">
                <span aria-hidden>🎯</span>
                <span>
                  <b className="text-neto-amber font-semibold">Único en Perú</b>{" "}
                  — ningún otro asistente de WhatsApp tiene score
                </span>
              </span>
              <a
                href="/producto"
                className="self-start mt-6 inline-flex items-center gap-1 text-[15px] font-semibold text-neto-green-light hover:text-neto-green transition-colors duration-200"
              >
                Ver todo el dashboard →
              </a>
            </div>
          </BlurReveal>

          {/* Right — real score capture */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {/* Green glow behind the frame */}
            <div
              className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none"
              aria-hidden
            >
              <div className="w-[260px] h-[260px] rounded-full bg-neto-green/[0.14] blur-[70px]" />
            </div>
            <div className="mx-auto max-w-[400px] rounded-[18px] border border-white/[0.08] bg-neto-bg2 overflow-hidden shadow-[0_40px_80px_-34px_rgba(0,0,0,0.75)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/producto/score.jpg"
                alt="Pantalla del Neto Score en app.neto.pe: puntaje 72 de 100 con el desglose por factor (registro, presupuesto, ahorro, planes, deudas y visibilidad)"
                width={1480}
                height={2480}
                loading="lazy"
                className="block w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
