"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Zap, Crown } from "lucide-react";
import BlurReveal from "@/components/shared/BlurReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

import { waLink, waLinkPro, trackCtaClick } from "@/lib/constants";

/* ─── Features ─── */
const FREE_FEATURES = [
  { text: "WhatsApp: registro de gastos", included: true },
  { text: "Dashboard web completo", included: true },
  { text: "Clasificación con IA", included: true },
  { text: "Presupuestos + metas de ahorro", included: true },
  { text: "Score financiero básico", included: true },
  { text: "Lectura de imágenes Yape/Plin", included: true },
  { text: "Referidos (3 Pro = 1 mes gratis)", included: true },
  { text: "Score detallado + tendencia + tips", included: false },
  { text: "Reportes PDF", included: false },
  { text: "Historial completo + heatmap", included: false },
  { text: "Consejo IA diario + resumen diario", included: false },
  { text: "Export CSV/JSON + carga Excel", included: false },
];

const PRO_FEATURES = [
  { text: "WhatsApp: registro de gastos", included: true, isProExclusive: false },
  { text: "Dashboard web completo", included: true, isProExclusive: false },
  { text: "Clasificación con IA", included: true, isProExclusive: false },
  { text: "Presupuestos + metas de ahorro", included: true, isProExclusive: false },
  { text: "Score financiero básico", included: true, isProExclusive: false },
  { text: "Lectura de imágenes Yape/Plin", included: true, isProExclusive: false },
  { text: "Referidos (3 Pro = 1 mes gratis)", included: true, isProExclusive: false },
  { text: "Score detallado + tendencia + tips", included: true, isProExclusive: true },
  { text: "Reportes PDF", included: true, isProExclusive: true },
  { text: "Historial completo + heatmap", included: true, isProExclusive: true },
  { text: "Consejo IA diario + resumen diario", included: true, isProExclusive: true },
  { text: "Export CSV/JSON + carga Excel", included: true, isProExclusive: true },
];

/* ─── FeatureItem ─── */
function FeatureItem({
  text,
  included,
  isProExclusive,
}: {
  text: string;
  included: boolean;
  isProExclusive?: boolean;
}) {
  return (
    <li className="flex items-center gap-3">
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
          included ? "bg-neto-green/20" : "bg-white/5"
        }`}
      >
        {included ? (
          <Check size={10} className="text-neto-green" />
        ) : (
          <X size={10} className="text-neto-txt3" />
        )}
      </div>
      <span
        className={`text-sm ${
          isProExclusive
            ? "text-neto-green-light font-medium"
            : included
            ? "text-neto-txt2"
            : "text-neto-txt3 line-through opacity-50"
        }`}
      >
        {text}
      </span>
    </li>
  );
}

export default function Pricing() {
  // Default to yearly — better LTV, user can downgrade to monthly explicitly.
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");

  const prices = {
    monthly: { free: "S/0", pro: "S/10" },
    yearly: { free: "S/0", pro: "S/99/año" },
  };

  return (
    <section id="precios" className="py-24 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <BlurReveal>
          <div className="flex flex-col items-center text-center mb-12">
            <span className="rounded-full border border-neto-green/30 bg-neto-green/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-neto-green uppercase mb-5">
              Precios
            </span>
            <h2 className="text-3xl min-[860px]:text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #e5e2de 0%, #bccac1 100%)",
                  WebkitBackgroundClip: "text",
                }}
              >
                Empieza gratis.{" "}
              </span>
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #68dbae 0%, #1D9E75 100%)",
                  WebkitBackgroundClip: "text",
                }}
              >
                Crece con Pro.
              </span>
            </h2>
            <p className="text-neto-txt3 text-base max-w-[520px] leading-relaxed">
              Registra tus gastos sin costo. Activa Pro cuando quieras score detallado,
              reportes PDF y todo ilimitado.
            </p>
          </div>
        </BlurReveal>

        {/* Billing toggle */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center rounded-full bg-neto-bg3 p-1 gap-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                billing === "monthly"
                  ? "bg-neto-green text-white shadow-sm"
                  : "text-neto-txt3 hover:text-neto-txt2"
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                billing === "yearly"
                  ? "bg-neto-green text-white shadow-sm"
                  : "text-neto-txt3 hover:text-neto-txt2"
              }`}
            >
              Anual
              <span className="rounded-full bg-neto-amber/20 border border-neto-amber/30 px-2 py-0.5 text-[10px] font-bold text-neto-amber">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 min-[860px]:grid-cols-2 gap-6 items-start">
          {/* Free card */}
          <motion.div
            className="bg-neto-bg3 rounded-[24px] border border-white/5 p-8 flex flex-col"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-neto-bg5 flex items-center justify-center">
                <Zap size={20} className="text-neto-txt2" />
              </div>
              <h3 className="text-xl font-bold text-neto-txt">Gratis</h3>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-neto-txt">
                {prices[billing].free}
              </span>
              <span className="text-neto-txt3 text-sm ml-2">/ siempre</span>
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-3 mb-8">
              {FREE_FEATURES.map((f) => (
                <FeatureItem key={f.text} text={f.text} included={f.included} />
              ))}
            </ul>

            {/* CTA */}
            <a
              href={waLink("pricing-free")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCtaClick("pricing-free", "Empezar gratis")}
              className="mt-auto w-full rounded-full border border-neto-bg5 bg-neto-bg4 px-6 py-3.5 text-sm font-semibold text-neto-txt2 text-center transition-all duration-200 hover:border-neto-green/40 hover:text-neto-txt"
            >
              Empezar gratis
            </a>
          </motion.div>

          {/* Pro card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.08, ease: EASE }}
          >
            {/*
              On mobile: static green border (cheap on CPU, no jank in IG browser).
              On desktop (>=860px): keep the conic-gradient animated border.
            */}
            <div className="group relative rounded-[24px] overflow-hidden border border-neto-green/40 min-[860px]:border-0 min-[860px]:pro-card cursor-default">
              {/* Conic gradient border — desktop only */}
              <div
                className="absolute inset-0 rounded-[24px] hidden min-[860px]:block"
                style={{
                  background:
                    "conic-gradient(from var(--angle), #0F6E56, #68dbae, #1D9E75, #0F6E56)",
                }}
              />
              <div className="absolute inset-[1px] rounded-[23px] bg-neto-bg2 hidden min-[860px]:block" />
              <div className="absolute inset-0 rounded-[24px] bg-neto-bg2 min-[860px]:hidden" />
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-20 bg-neto-green/15 blur-[60px] pointer-events-none" />

              <div className="relative p-8 flex flex-col h-full">
                {/* Badge row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neto-green/20 flex items-center justify-center">
                      <Crown size={20} className="text-neto-green-light" />
                    </div>
                    <h3 className="text-xl font-bold text-neto-txt">Pro</h3>
                  </div>
                  <span className="rounded-full bg-neto-amber px-3 py-1 text-xs font-bold text-neto-bg">
                    PRECIO FUNDADOR
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  {billing === "monthly" && (
                    <span className="text-sm text-neto-txt3 line-through mr-2">S/29</span>
                  )}
                  <span className="text-4xl font-extrabold text-neto-txt">
                    {prices[billing].pro}
                  </span>
                  {billing === "monthly" && (
                    <span className="text-neto-txt3 text-sm ml-2">/ mes · Precio fundador</span>
                  )}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 mb-8">
                  {PRO_FEATURES.map((f) => (
                    <FeatureItem
                      key={f.text}
                      text={f.text}
                      included={f.included}
                      isProExclusive={f.isProExclusive}
                    />
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={waLinkPro("pricing-pro")}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCtaClick("pricing-pro", "Activar Pro")}
                  className="mt-auto w-full rounded-full bg-gradient-to-br from-neto-green-light to-neto-green px-6 py-3.5 text-sm font-semibold text-[#002115] text-center transition-all duration-200 hover:shadow-[0_0_24px_rgba(29,158,117,0.4)] hover:scale-[1.02]"
                >
                  Activar Pro
                </a>
                {/* Trust badges */}
                <p className="text-center text-xs text-neto-txt3 mt-3">
                  Cancela cuando quieras · Sin permanencia · Paga con Yape
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ROI callout */}
        <motion.div
          className="mt-8 rounded-2xl border border-neto-green/20 bg-neto-green/5 p-5 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <p className="text-sm text-neto-txt2 leading-relaxed">
            💡 Si Neto te ahorra{" "}
            <span className="text-neto-txt font-semibold">S/200/mes</span> en
            gastos que no sabías que tenías, Pro se paga solo{" "}
            <span className="text-neto-green font-semibold">20 veces.</span>
          </p>
        </motion.div>

        {/* Referral banner */}
        <motion.div
          className="mt-4 rounded-2xl border border-neto-amber/20 bg-neto-amber/5 p-4 flex items-center justify-center gap-3 flex-wrap text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
        >
          <span className="text-lg" aria-hidden>🎁</span>
          <p className="text-sm text-neto-txt2">
            <span className="text-neto-txt font-semibold">Invita 3 amigos a Pro</span> y tu mes es gratis
          </p>
        </motion.div>
      </div>
    </section>
  );
}
