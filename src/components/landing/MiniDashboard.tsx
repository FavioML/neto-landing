"use client";

import { motion, AnimatePresence } from "framer-motion";
import ScoreGauge from "@/components/shared/ScoreGauge";
import { useCountUp } from "@/hooks/useCountUp";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The app half of the hero. It is drawn natively rather than screenshotted for
 * one reason: it has to REACT. Driven by the same clock as the chat next to it,
 * so when the simulator registers "S/45 almuerzo" the total ticks up, the row
 * lands and the score moves. That's the whole claim of the section — you write
 * in WhatsApp, it shows up ordered in the app — shown instead of asserted.
 *
 * Every number here comes from the chat script in ChatSimulator.tsx, so the two
 * halves can never contradict each other.
 */

// step counts visible chat messages. Message 2 ("¡Anotado! Almuerzo · S/45.00")
// is the one that lands the expense; message 6 is the one that moves the score.
const STEP_REGISTERED = 2;
const STEP_SCORED = 6;

const TOTAL_BEFORE = 802;
const TOTAL_AFTER = 847; // matches "Llevas S/847 esta semana" in the chat
const SCORE_BEFORE = 71;
const SCORE_AFTER = 74; // matches "Tu score va en 74 este mes"

const CATEGORIES = [
  { name: "Comida", base: 38, after: 46, color: "#EF9F27" },
  { name: "Transporte", base: 24, after: 24, color: "#68dbae" },
  { name: "Servicios", base: 18, after: 18, color: "#378ADD" },
];

const BASE_ROWS = [
  { id: "uber", title: "Uber", category: "Transporte", amount: "S/18.50" },
  { id: "metro", title: "Metro", category: "Mercado", amount: "S/126.40" },
];

export default function MiniDashboard({ step }: { step: number }) {
  const registered = step >= STEP_REGISTERED;
  const scored = step >= STEP_SCORED;

  const { value: total, ref: totalRef } = useCountUp<HTMLSpanElement>(
    registered ? TOTAL_AFTER : TOTAL_BEFORE,
    { duration: 900, trigger: "value" }
  );

  return (
    <div className="w-[260px] rounded-[20px] border border-neto-bg5 bg-neto-bg2 shadow-[0_40px_100px_rgba(0,0,0,0.55)] overflow-hidden">
      {/* App chrome */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-neto-bg3/60">
        <span className="text-[11px] font-semibold text-neto-txt2">
          app.neto.pe
        </span>
        <span className="text-[10px] text-neto-txt3">Esta semana</span>
      </div>

      {/* Total + score */}
      <div className="px-5 pt-5 pb-4 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wide text-neto-txt3 mb-1">
            Gastado
          </span>
          <span
            ref={totalRef}
            className="font-heading text-3xl font-extrabold text-neto-txt leading-none tabular-nums"
          >
            S/{total}
          </span>
        </div>
        <ScoreGauge
          value={scored ? SCORE_AFTER : SCORE_BEFORE}
          size={84}
          trigger="value"
          duration={900}
        />
      </div>

      {/* Category bars */}
      <div className="px-5 pb-4 flex flex-col gap-2.5">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="flex items-center gap-2.5">
            <span className="text-[10px] text-neto-txt3 w-[62px] shrink-0">
              {cat.name}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-neto-bg5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: cat.color }}
                animate={{ width: `${registered ? cat.after : cat.base}%` }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Recent rows — the new expense drops in on top */}
      <div className="border-t border-white/[0.06] px-5 py-3 flex flex-col">
        <AnimatePresence initial={false}>
          {registered && (
            <motion.div
              key="nuevo"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 py-2 border-b border-white/[0.04]">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-neto-amber shrink-0" />
                  <span className="text-[11px] text-neto-txt truncate">
                    Almuerzo
                  </span>
                  <span className="text-[10px] text-neto-txt3 shrink-0">
                    Comida
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-neto-txt tabular-nums shrink-0">
                  S/45.00
                </span>
              </div>
            </motion.div>
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
