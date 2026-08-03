"use client";

import { motion } from "framer-motion";
import BlurReveal from "@/components/shared/BlurReveal";
import ScoreGauge from "@/components/shared/ScoreGauge";

const EASE = [0.16, 1, 0.3, 1] as const;

const SCORE = 74;

/**
 * The six factors the Neto Score breaks down into, same names the dashboard uses.
 * The per-factor numbers are illustrative — like the S/847 in the chat simulator —
 * but the factors themselves are the real ones.
 */
const FACTORS = [
  { name: "Registro", value: 92 },
  { name: "Presupuesto", value: 78 },
  { name: "Ahorro", value: 61 },
  { name: "Planes", value: 70 },
  { name: "Deudas", value: 85 },
  { name: "Visibilidad", value: 58 },
];

/**
 * Score — the star differentiator. Copy on the left, the score itself on the
 * right, drawn natively. It used to be a 1480x2480 full-page capture squashed
 * into 400px, where nothing was legible; this reads at any size and never goes
 * stale when the dashboard changes. The gauge stays blue because that's the
 * colour of the real one in app.neto.pe. id="score" (anchored from Navbar).
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

          {/* Right — the score, drawn natively */}
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
              {/* Card header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <span className="text-sm font-semibold text-neto-txt">
                  Neto Score
                </span>
                <span className="text-xs text-neto-txt3">Este mes</span>
              </div>

              {/* Gauge */}
              <div className="flex flex-col items-center pt-2 pb-6">
                <ScoreGauge value={SCORE} size={216} />
                <span className="mt-3 text-xs text-neto-txt3">
                  Subió 6 puntos desde el mes pasado
                </span>
              </div>

              {/* Factor breakdown */}
              <div className="border-t border-white/[0.06] px-6 py-5 flex flex-col gap-3.5">
                {FACTORS.map((factor, i) => (
                  <div key={factor.name} className="flex items-center gap-3">
                    <span className="text-xs text-neto-txt3 w-[86px] shrink-0">
                      {factor.name}
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-neto-bg5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, #378ADD 0%, #6FB4F0 100%)",
                        }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${factor.value}%` }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{
                          duration: 0.9,
                          delay: 0.25 + i * 0.08,
                          ease: EASE,
                        }}
                      />
                    </div>
                    <span className="text-xs text-neto-txt2 tabular-nums w-6 text-right shrink-0">
                      {factor.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
