"use client";

import { motion, AnimatePresence } from "framer-motion";
import ScoreGauge from "@/components/shared/ScoreGauge";
import { useCountUp } from "@/hooks/useCountUp";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The app half of the hero, in two cards so it reads as a surface with depth
 * rather than one slab. Drawn natively rather than screenshotted for one reason:
 * it has to REACT. Driven by the same clock as the chat beside it, so when the
 * simulator registers an expense the total ticks, the donut shifts and the row
 * lands. That's the claim of the section — you write in WhatsApp, it shows up
 * ordered in the app — shown instead of asserted.
 *
 * Every number matches the chat script in ChatSimulator.tsx, including the
 * S/847 the weekly summary reports, so the two halves cannot contradict.
 */

// step counts visible chat messages. Message 2 confirms the typed expense,
// message 4 confirms the one sent as a photo.
const STEP_TYPED = 2;
const STEP_PHOTO = 4;

const SCORE = 74;

// Amounts, not percentages: the donut derives its own shares so the card can
// never disagree with itself.
const CATEGORIES = [
  { name: "Alimentación", base: 367, addAt: STEP_TYPED, add: 45, color: "#EF9F27" },
  { name: "Transporte", base: 188, addAt: STEP_PHOTO, add: 22, color: "#68dbae" },
  { name: "Compras", base: 130, addAt: null, add: 0, color: "#378ADD" },
  { name: "Otros", base: 95, addAt: null, add: 0, color: "#87948c" },
];

// Rows are labelled by CATEGORY, never subcategory: the legend above lists four
// category names and a row saying "Mercado" invents a fifth that the weekly summary
// in the chat never reports. Metro is also the week's largest expense, which is what
// the summary's `🔝 Mayor gasto` line names — so the two halves chain there too.
const BASE_ROWS = [
  { id: "rappi", title: "Rappi", category: "Alimentación", amount: "S/89.00" },
  { id: "metro", title: "Metro", category: "Alimentación", amount: "S/126.40" },
];

const DONUT_R = 30;
const DONUT_C = 2 * Math.PI * DONUT_R;

function Donut({ slices }: { slices: { value: number; color: string }[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;
  return (
    <svg viewBox="0 0 80 80" width={80} height={80} aria-hidden className="shrink-0">
      {slices.map((s, i) => {
        const len = (s.value / total) * DONUT_C;
        const dash = -offset;
        offset += len;
        return (
          <circle
            key={i}
            cx="40"
            cy="40"
            r={DONUT_R}
            fill="none"
            stroke={s.color}
            strokeWidth="10"
            strokeDasharray={`${len} ${DONUT_C - len}`}
            strokeDashoffset={dash}
            transform="rotate(-90 40 40)"
            style={{
              transition:
                "stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1), stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        );
      })}
    </svg>
  );
}

/** Amounts are a pure function of the step, so each card derives its own and
 *  the two can be positioned independently without sharing state. */
function amountsFor(step: number) {
  const raw = CATEGORIES.map((c) => ({
    ...c,
    value: c.base + (c.addAt !== null && step >= c.addAt ? c.add : 0),
  }));
  const total = raw.reduce((s, c) => s + c.value, 0);

  // Largest-remainder, so the legend adds up to exactly 100. Naive rounding gave
  // 50+23+16+12 = 101, which is the kind of detail someone does notice.
  const exact = raw.map((c) => (c.value / total) * 100);
  const floors = exact.map(Math.floor);
  let left = 100 - floors.reduce((a, b) => a + b, 0);
  const order = exact
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  const pct = [...floors];
  for (const { i } of order) {
    if (left <= 0) break;
    pct[i] += 1;
    left -= 1;
  }

  return { amounts: raw.map((c, i) => ({ ...c, pct: pct[i] })), total };
}

export function DashboardSummary({ step }: { step: number }) {
  const { amounts, total } = amountsFor(step);

  const { value: shownTotal, ref: totalRef } = useCountUp<HTMLSpanElement>(total, {
    duration: 900,
    trigger: "value",
  });

  return (
      <div className="w-[252px] rounded-[20px] border border-neto-bg5 bg-neto-bg2 shadow-[0_40px_100px_rgba(0,0,0,0.55)] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-neto-bg3/60">
          <span className="text-[11px] font-semibold text-neto-txt2">
            app.neto.pe
          </span>
          <span className="text-[10px] text-neto-txt3">Esta semana</span>
        </div>

        <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wide text-neto-txt3 mb-1">
              Gastado
            </span>
            <span
              ref={totalRef}
              className="font-heading text-[26px] font-extrabold text-neto-txt leading-none tabular-nums"
            >
              S/{shownTotal}
            </span>
          </div>
          <ScoreGauge value={SCORE} size={76} duration={1100} />
        </div>

        <div className="px-5 pb-4 flex items-center gap-3">
          <Donut slices={amounts.map((a) => ({ value: a.value, color: a.color }))} />
          <div className="flex flex-col gap-1.5 min-w-0">
            {amounts.map((a) => (
              <div key={a.name} className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: a.color }}
                />
                <span className="text-[10px] text-neto-txt3 truncate">{a.name}</span>
                <span className="text-[10px] text-neto-txt2 tabular-nums ml-auto">
                  {a.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}

/** Card B — the movements, where new expenses land. */
export function DashboardMovements({ step }: { step: number }) {
  const typed = step >= STEP_TYPED;
  const photo = step >= STEP_PHOTO;

  return (
      <div className="w-[252px] rounded-[20px] border border-neto-bg5 bg-neto-bg2 shadow-[0_40px_100px_rgba(0,0,0,0.55)] overflow-hidden">
        <div className="px-5 py-2.5 border-b border-white/[0.06] bg-neto-bg3/60">
          <span className="text-[10px] uppercase tracking-wide text-neto-txt3">
            Últimos movimientos
          </span>
        </div>

        <div className="px-5 py-2 flex flex-col">
          <AnimatePresence initial={false}>
            {photo && (
              <Row
                key="taxi"
                title="Taxi Directo"
                category="Transporte"
                amount="S/22.00"
                fresh
                color="#68dbae"
              />
            )}
            {typed && (
              <Row
                key="almuerzo"
                title="Almuerzo"
                category="Alimentación"
                amount="S/45.00"
                fresh
                color="#EF9F27"
              />
            )}
          </AnimatePresence>

          {BASE_ROWS.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between gap-2 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-neto-bg6 shrink-0" />
                <span className="text-[11px] text-neto-txt2 truncate">
                  {row.title}
                </span>
                <span className="text-[10px] text-neto-txt3 shrink-0">
                  {row.category}
                </span>
              </div>
              <span className="text-[11px] text-neto-txt2 tabular-nums shrink-0">
                {row.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
  );
}

function Row({
  title,
  category,
  amount,
  color,
  fresh = false,
}: {
  title: string;
  category: string;
  amount: string;
  color: string;
  fresh?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, y: -8 }}
      animate={{ opacity: 1, height: "auto", y: 0 }}
      exit={{ opacity: 0, height: 0, y: -8 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="flex items-center justify-between gap-2 py-2 border-b border-white/[0.04]">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: fresh ? color : undefined }}
          />
          <span className="text-[11px] text-neto-txt truncate">{title}</span>
          <span className="text-[10px] text-neto-txt3 shrink-0">{category}</span>
        </div>
        <span className="text-[11px] font-semibold text-neto-txt tabular-nums shrink-0">
          {amount}
        </span>
      </div>
    </motion.div>
  );
}
