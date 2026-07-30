"use client";

import { motion } from "framer-motion";
import BlurReveal from "@/components/shared/BlurReveal";

const EASE = [0.16, 1, 0.3, 1] as const;

/* 3-step "cómo funciona", folded into a compact strip. */
const FLOW = [
  {
    n: "1",
    title: "Escríbele por WhatsApp",
    desc: '"Gasté 45 en almuerzo" o foto de tu voucher',
  },
  {
    n: "2",
    title: "Neto ordena y entiende",
    desc: "Categoriza con IA y actualiza tu score",
  },
  {
    n: "3",
    title: "Sabes a dónde va",
    desc: "Cuánto te queda, por chat o en tu dashboard",
  },
];

/**
 * Consolidated features bento — fuses the old Fugas + Bento + Espacios + Deudas
 * sections plus the "cómo funciona" strip into one. id="features".
 */
export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <BlurReveal>
          <div className="flex flex-col items-center text-center mb-12 gap-4">
            <span className="rounded-full border border-neto-green/30 bg-neto-green/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-neto-green uppercase">
              Qué hace por ti
            </span>
            <h2 className="text-3xl min-[860px]:text-5xl font-extrabold tracking-tight leading-[1.1] text-neto-txt">
              Registrar es el piso.
              <br />
              Esto es el techo.
            </h2>
            <p className="text-neto-txt3 text-base max-w-[520px] leading-relaxed">
              Todo lo que Neto hace con tu plata una vez que empiezas a
              ordenarla.
            </p>
          </div>
        </BlurReveal>

        {/* Flow strip */}
        <BlurReveal>
          <div className="flex flex-wrap items-stretch justify-center gap-2.5 mb-10">
            {FLOW.map((step, i) => (
              <div key={step.n} className="flex items-center gap-2.5">
                <div className="flex items-center gap-3 rounded-2xl bg-neto-bg2 border border-white/[0.06] px-[18px] py-3.5 flex-1 min-[820px]:flex-none max-w-[320px]">
                  <span className="shrink-0 w-7 h-7 rounded-lg grid place-items-center font-extrabold text-[13px] text-neto-green border border-neto-green/35">
                    {step.n}
                  </span>
                  <div>
                    <b className="block text-sm font-semibold text-neto-txt">
                      {step.title}
                    </b>
                    <span className="block text-[12.5px] text-neto-txt3 leading-snug mt-0.5">
                      {step.desc}
                    </span>
                  </div>
                </div>
                {i < FLOW.length - 1 && (
                  <span className="hidden min-[820px]:inline text-neto-txt3 text-lg" aria-hidden>
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </BlurReveal>

        {/* Bento grid */}
        <div className="grid grid-cols-1 min-[520px]:grid-cols-2 min-[780px]:grid-cols-6 gap-4">
          {/* Detector de fugas */}
          <Cell
            className="min-[520px]:col-span-2 min-[780px]:col-span-3"
            icon="🕳️"
            title="Detector de fugas"
            desc="Neto encuentra los gastos que ni sabías que tenías y te avisa antes de que se vuelvan un hueco."
            delay={0}
          >
            <div className="flex flex-col gap-2 mt-1.5">
              <FugaRow label="👻 Suscripción olvidada" amt="−S/39/mes" />
              <FugaRow label="🐜 Gasto hormiga (delivery)" amt="−S/210/mes" />
            </div>
          </Cell>

          {/* Espacios compartidos */}
          <Cell
            className="min-[520px]:col-span-2 min-[780px]:col-span-3"
            icon="👥"
            title="Espacios compartidos"
            desc="Manejen la plata en pareja o con roommates. Neto divide cuentas y lleva el balance de quién debe a quién."
            delay={0.06}
          >
            <div className="flex flex-col gap-2 mt-1.5">
              <div className="flex items-center justify-between text-[13px] bg-neto-bg4 rounded-[10px] px-3 py-2">
                <span className="flex items-center gap-2 text-neto-txt2">
                  <span className="w-5 h-5 rounded-full grid place-items-center text-[11px] font-bold text-[#002115] bg-neto-green-light">
                    A
                  </span>
                  Ana pagó el mercado
                </span>
                <span className="text-neto-txt2 tabular-nums">S/120</span>
              </div>
              <div className="flex items-center justify-between text-[13px] bg-neto-bg4 rounded-[10px] px-3 py-2">
                <span className="text-neto-txt3">Balance</span>
                <span className="text-neto-green-light font-semibold">
                  Marco le debe S/60
                </span>
              </div>
            </div>
          </Cell>

          {/* Deudas — Solo en Neto */}
          <Cell
            className="min-[780px]:col-span-2"
            icon="🤝"
            title="Deudas y préstamos"
            desc="Registra lo que debes y lo que te deben. Neto te recuerda cuándo cobrar y cuándo pagar."
            badge="Solo en Neto"
            delay={0.12}
          />

          {/* Metas y presupuestos */}
          <Cell
            className="min-[780px]:col-span-2"
            icon="🎯"
            title="Metas y presupuestos"
            desc="Ponte un límite por categoría y una meta de ahorro. Neto te avisa antes de pasarte, no después."
            delay={0.18}
          />

          {/* Dashboard y reportes */}
          <Cell
            className="min-[780px]:col-span-2"
            icon="📊"
            title="Dashboard y reportes"
            desc="Tu historial completo en app.neto.pe, con reportes PDF y resumen mensual con IA."
            delay={0.24}
          />
        </div>
      </div>
    </section>
  );
}

function Cell({
  className = "",
  icon,
  title,
  desc,
  badge,
  delay,
  children,
}: {
  className?: string;
  icon: string;
  title: string;
  desc: string;
  badge?: string;
  delay: number;
  children?: React.ReactNode;
}) {
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-[22px] border border-white/[0.06] bg-gradient-to-b from-neto-bg3 to-neto-bg2 p-[26px] flex flex-col gap-3 transition-colors duration-200 hover:border-neto-green-light/[0.28] ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {badge && (
        <span className="self-start text-[10.5px] font-bold tracking-[0.06em] uppercase text-neto-amber bg-neto-amber/[0.13] border border-neto-amber/[0.28] px-2.5 py-[3px] rounded-full">
          {badge}
        </span>
      )}
      <div className="w-10 h-10 rounded-xl grid place-items-center text-[19px] bg-neto-green/[0.14]">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-neto-txt">{title}</h3>
      <p className="text-neto-txt3 text-[14.5px] leading-relaxed">{desc}</p>
      {children}
    </motion.div>
  );
}

function FugaRow({ label, amt }: { label: string; amt: string }) {
  return (
    <div className="flex items-center justify-between text-[13px] bg-neto-bg4 rounded-[10px] px-3 py-2">
      <span className="text-neto-txt2">{label}</span>
      <span className="text-neto-red font-bold tabular-nums">{amt}</span>
    </div>
  );
}
