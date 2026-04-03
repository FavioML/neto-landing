"use client";

import { motion } from "framer-motion";
import { CreditCard, Bug, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import BlurReveal from "@/components/shared/BlurReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

const FUGAS = [
  {
    icon: CreditCard,
    color: "#EF9F27",
    colorBg: "rgba(239,159,39,0.08)",
    colorBorder: "rgba(239,159,39,0.15)",
    label: "Suscripciones fantasma",
    headline: "Netflix + Spotify + Disney+ + HBO = S/89/mes",
    sub: "¿Las usas todas?",
    visual: (
      <div className="flex flex-col gap-1.5 mt-3">
        {[
          { name: "Netflix", price: "S/39" },
          { name: "Spotify", price: "S/17" },
          { name: "Disney+", price: "S/22" },
          { name: "HBO Max", price: "S/11" },
        ].map((sub) => (
          <div key={sub.name} className="flex items-center justify-between text-xs">
            <span className="text-white/60">{sub.name}</span>
            <span className="text-neto-amber font-medium tabular-nums">{sub.price}</span>
          </div>
        ))}
        <div className="flex items-center justify-between text-xs border-t border-white/10 pt-1.5 mt-0.5">
          <span className="text-white/80 font-semibold">Total</span>
          <span className="text-neto-amber font-bold">S/89</span>
        </div>
      </div>
    ),
  },
  {
    icon: Bug,
    color: "#68dbae",
    colorBg: "rgba(104,219,174,0.08)",
    colorBorder: "rgba(104,219,174,0.15)",
    label: "Gastos hormiga",
    headline: "15 cafés. S/127. Este mes.",
    sub: "Pequeño pero constante",
    visual: (
      <div className="mt-3 flex items-end gap-1 h-12">
        {[3, 5, 2, 4, 6, 3, 5, 4, 7, 5, 6, 4, 5, 3, 6].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-neto-green/60"
            style={{ height: `${(h / 7) * 100}%` }}
          />
        ))}
      </div>
    ),
  },
  {
    icon: Calendar,
    color: "#3B9EDB",
    colorBg: "rgba(59,158,219,0.08)",
    colorBorder: "rgba(59,158,219,0.15)",
    label: "Patrón de fin de semana",
    headline: "Sáb y Dom = 43% de tu gasto mensual",
    sub: "Detectado automáticamente",
    visual: (
      <div className="mt-3 grid grid-cols-7 gap-1">
        {["L", "M", "X", "J", "V", "S", "D"].map((day, i) => (
          <div key={day} className="flex flex-col items-center gap-1">
            <div
              className="w-full rounded-sm"
              style={{
                height: "28px",
                background: i >= 5
                  ? "rgba(59,158,219,0.6)"
                  : "rgba(255,255,255,0.08)",
              }}
            />
            <span className="text-[10px] text-white/40">{day}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: TrendingUp,
    color: "#E85D3A",
    colorBg: "rgba(232,93,58,0.08)",
    colorBorder: "rgba(232,93,58,0.15)",
    label: "Alertas por categoría",
    headline: "Gastaste 120% de tu presupuesto de comida",
    sub: "Neto te avisa antes de que pase",
    visual: (
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-white/60">Comida · S/1,200</span>
          <span className="text-[#E85D3A] font-semibold flex items-center gap-1">
            <AlertTriangle size={10} />
            120%
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, rgba(232,93,58,0.6) 0%, #E85D3A 100%)",
            }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/30 mt-1">
          <span>Límite: S/1,000</span>
          <span>Real: S/1,200</span>
        </div>
      </div>
    ),
  },
];

export default function FugasSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle red glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E85D3A]/[0.04] blur-[120px] pointer-events-none" aria-hidden />

      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <BlurReveal>
          <div className="flex flex-col items-center text-center mb-14">
            <span className="rounded-full border border-neto-amber/30 bg-neto-amber/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-neto-amber uppercase mb-5">
              Detector de fugas
            </span>
            <h2 className="text-3xl min-[860px]:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4 text-neto-txt">
              ¿A dónde se escapa tu plata?
            </h2>
            <p className="text-neto-txt3 text-base max-w-[500px] leading-relaxed">
              Neto detecta automáticamente gastos que ni sabías que tenías
            </p>
          </div>
        </BlurReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 min-[640px]:grid-cols-2 gap-4">
          {FUGAS.map((fuga, i) => {
            const Icon = fuga.icon;
            return (
              <motion.div
                key={fuga.label}
                className="rounded-[20px] border p-6 flex flex-col"
                style={{
                  background: fuga.colorBg,
                  borderColor: fuga.colorBorder,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease: EASE }}
              >
                {/* Label row */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${fuga.color}20` }}
                  >
                    <Icon size={14} style={{ color: fuga.color }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: fuga.color }}>
                    {fuga.label}
                  </span>
                </div>

                <p className="text-sm font-semibold text-neto-txt leading-snug">{fuga.headline}</p>
                <p className="text-xs text-neto-txt3 mt-0.5">{fuga.sub}</p>

                {fuga.visual}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
