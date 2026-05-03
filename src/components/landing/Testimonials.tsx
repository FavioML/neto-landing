"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Briefcase, Wallet, Smartphone, PieChart } from "lucide-react";
import BlurReveal from "@/components/shared/BlurReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── useTilt hook ─── */
function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(800px) rotateX(0deg) rotateY(0deg)"
  );

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(800px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`
    );
  };

  const onMouseLeave = () =>
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg)");

  return { ref, transform, onMouseMove, onMouseLeave };
}

/* ─── Data ─── */
// Casos de uso anonimizados — sin nombres ni "métricas reales" hasta tener
// testimonios con consentimiento de usuarios reales. Evita riesgo Indecopi
// y se mantiene útil como social proof por tipología.
const TESTIMONIALS = [
  {
    persona: "Si trabajas en planilla",
    role: "Sueldo fijo, gastos variables",
    icon: Briefcase,
    quote:
      "Sabes cuánto ganas, pero a fin de mes no sabes a dónde se fue. Neto te muestra exactamente en qué categoría se va tu plata cada semana.",
    metric: "Categorías",
    metricLabel: "ordenadas por % del mes",
  },
  {
    persona: "Si eres freelance",
    role: "Ingresos irregulares",
    icon: Wallet,
    quote:
      "Tus ingresos cambian mes a mes y separar gasto personal del trabajo es un dolor. Neto detecta patrones por categoría y te avisa cuando algo se sale de tu promedio.",
    metric: "Promedio",
    metricLabel: "por categoría y mes",
  },
  {
    persona: "Si tienes un negocio",
    role: "Decisiones rápidas",
    icon: Smartphone,
    quote:
      "No tienes tiempo para abrir un dashboard. Le escribes a Neto por WhatsApp, te responde con el dato que necesitas y sigues con tu día.",
    metric: "WhatsApp",
    metricLabel: "sin abrir nada más",
  },
  {
    persona: "Si tienes gastos hormiga",
    role: "Delivery, taxis, suscripciones",
    icon: PieChart,
    quote:
      "Sabes que se te va plata en cositas pero no sabes cuánta. Neto suma los micro-gastos por categoría y te avisa cuando una categoría se está disparando.",
    metric: "Alertas",
    metricLabel: "cuando una categoría sube",
  },
];

/* ─── PersonaIcon ─── */
function PersonaIcon({ Icon }: { Icon: typeof Briefcase }) {
  return (
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neto-green/20 to-neto-green-dark/20 border border-neto-green/30 flex items-center justify-center shrink-0">
      <Icon size={20} className="text-neto-green-light" />
    </div>
  );
}

export default function Testimonials() {
  const tilt = useTilt();
  const [t0, t1, t2, t3] = TESTIMONIALS;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <BlurReveal>
          <div className="flex flex-col items-center text-center mb-14">
            <span className="rounded-full border border-neto-green/30 bg-neto-green/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-neto-green uppercase mb-5">
              Para qué te sirve
            </span>
            <h2 className="text-3xl min-[860px]:text-5xl font-extrabold tracking-tight leading-[1.1]">
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #68dbae 0%, #1D9E75 100%)",
                  WebkitBackgroundClip: "text",
                }}
              >
                Casos de uso reales.
              </span>
            </h2>
            <p className="text-neto-txt3 text-base max-w-[520px] leading-relaxed mt-4">
              Neto se adapta a cómo manejas tu plata. Estos son los escenarios más
              comunes de la gente que lo usa.
            </p>
          </div>
        </BlurReveal>

        {/* Bento grid */}
        <div className="grid grid-cols-1 min-[860px]:grid-cols-12 gap-4">
          {/* Featured card [0] — col-span-7 */}
          <motion.div
            ref={tilt.ref}
            onMouseMove={tilt.onMouseMove}
            onMouseLeave={tilt.onMouseLeave}
            style={{ transform: tilt.transform }}
            className="min-[860px]:col-span-7 bg-neto-bg3 border border-white/5 rounded-[24px] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Top accent line */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-neto-green to-transparent opacity-40" />

            <div className="p-8 min-[860px]:p-10 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <PersonaIcon Icon={t0.icon} />
                <div>
                  <p className="text-sm font-semibold text-neto-txt">{t0.persona}</p>
                  <p className="text-xs text-neto-txt3">{t0.role}</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <Quote size={32} className="text-neto-green/20" />
                <blockquote className="text-xl min-[860px]:text-2xl font-medium text-neto-txt leading-relaxed">
                  {t0.quote}
                </blockquote>
              </div>

              {/* Metric card */}
              <div className="rounded-2xl bg-neto-bg4 p-5 w-fit">
                <p className="text-3xl font-bold text-neto-green-light">{t0.metric}</p>
                <p className="text-sm text-neto-txt3 mt-0.5">{t0.metricLabel}</p>
              </div>
            </div>
          </motion.div>

          {/* Right stack [1],[2] — col-span-5 */}
          <div className="min-[860px]:col-span-5 flex flex-col gap-4">
            {[t1, t2].map((t, idx) => (
              <motion.div
                key={t.persona}
                className="bg-neto-bg3 rounded-[24px] p-7 flex flex-col gap-4 border border-white/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.1 + idx * 0.08, ease: EASE }}
              >
                <div className="flex items-center gap-3">
                  <PersonaIcon Icon={t.icon} />
                  <div>
                    <p className="text-sm font-semibold text-neto-txt">{t.persona}</p>
                    <p className="text-xs text-neto-txt3">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-neto-txt2 leading-relaxed">
                  {t.quote}
                </p>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-neto-green-light">{t.metric}</p>
                  <p className="text-xs text-neto-txt3">{t.metricLabel}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Full-width accent card [3] — col-span-12 */}
          <motion.div
            className="min-[860px]:col-span-12 rounded-[24px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          >
            <div className="p-8 min-[860px]:p-10 flex flex-col min-[860px]:flex-row min-[860px]:items-center gap-6 min-[860px]:gap-10">
              <div className="flex flex-col gap-4 flex-1">
                <div className="flex items-center gap-3">
                  <PersonaIcon Icon={t3.icon} />
                  <div>
                    <p className="text-sm font-semibold text-white">{t3.persona}</p>
                    <p className="text-xs text-white/70">{t3.role}</p>
                  </div>
                </div>
                <p className="text-lg min-[860px]:text-xl font-medium text-white/95 leading-relaxed">
                  {t3.quote}
                </p>
              </div>

              {/* Metric — right on desktop */}
              <div className="min-[860px]:text-right shrink-0 min-[860px]:border-l min-[860px]:border-white/20 min-[860px]:pl-10">
                <p className="text-4xl font-bold text-white">{t3.metric}</p>
                <p className="text-sm text-white/70 mt-1">{t3.metricLabel}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
