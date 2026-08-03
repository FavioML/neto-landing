"use client";

import { useState, useEffect, useCallback, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  from: "neto" | "user";
  text?: string;
  /** A photo the user sends: a Yape/Plin voucher. */
  kind?: "voucher";
}

/**
 * The script mirrors what Neto actually replies today, taken from the backend
 * verbatim: a terse one-line confirmation for a typed expense
 * (handlers/intents/transacciones.js), the photo confirmation with the merchant
 * in bold (handlers/webhook.js), and an on-demand weekly summary
 * (lib/formatters.js formatearResumen + handlers/intents/gastos.js).
 *
 * It deliberately does NOT show Neto volunteering totals, offering "¿te aviso
 * si pasas de S/200?" or announcing the score after a confirmation. That was the
 * old conversational Neto and none of it exists anymore: every opinion moved to
 * scheduled crons (weekly summary Monday 8am, leaks Wednesday 11am, score Sunday
 * 10am). WhatsApp here is plain text only — the channel has no buttons.
 */
const MESSAGES: Message[] = [
  { id: 0, from: "user", text: "Gasté 45 en almuerzo" },
  { id: 1, from: "neto", text: "✅ S/45.00 en Alimentación > restaurante · 03-ago-26" },
  { id: 2, from: "user", kind: "voucher" },
  {
    id: 3,
    from: "neto",
    text: "📸 *Gasto registrado*\n\n🚌 *Uber* — S/ 22.00\nTransporte > taxi · 03-ago-26",
  },
  { id: 4, from: "user", text: "cuánto gasté esta semana" },
  {
    id: 5,
    from: "neto",
    text:
      "📊 *esta semana*\nTotal: *S/ 847.00* • 18 movimientos\n\n" +
      "🍽️ Alimentación: *S/ 412.00* (49%)\n🚌 Transporte: *S/ 210.00* (25%)\n\n" +
      "📈 Semana pasada: *S/ 688.00* (+S/ 159.00)",
  },
];

// The first message lands almost immediately after a reset on purpose: the
// dashboard beside the phone stays populated, so a long blank chat reads as
// broken rather than as a loop restarting.
export const SEQUENCE_TIMINGS = [200, 1600, 3400, 4900, 7100, 8900];
export const TYPING_SHOW = 8000;
export const TYPING_HIDE = 8900;
export const RESET_DELAY = 15000;
/** Gap between clearing and restarting — just enough for React to flush. */
export const RESTART_GAP = 60;

/** WhatsApp markdown: *bold* and _italic_, rendered as nodes (never as HTML). */
function renderWa(text: string) {
  return text.split(/(\*[^*\n]+\*|_[^_\n]+_)/g).map((part, i) => {
    if (/^\*[^*\n]+\*$/.test(part)) {
      return (
        <strong key={i} className="font-semibold text-neto-txt">
          {part.slice(1, -1)}
        </strong>
      );
    }
    if (/^_[^_\n]+_$/.test(part)) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Stand-in for the payment screenshot the user shares. Drawn, not loaded. */
function VoucherThumb() {
  return (
    <div className="w-[150px] rounded-[10px] bg-[#101a20] border border-white/10 p-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-neto-bg6 shrink-0" />
        <span className="h-1.5 flex-1 rounded-full bg-neto-bg6" />
      </div>
      <span className="text-white font-semibold text-[15px] leading-none">
        S/ 22.00
      </span>
      <div className="flex flex-col gap-1">
        <span className="h-1 w-2/3 rounded-full bg-neto-bg5" />
        <span className="h-1 w-1/2 rounded-full bg-neto-bg5" />
      </div>
    </div>
  );
}

interface ChatSimulatorProps {
  /**
   * How many messages to show. Leave undefined and the simulator runs its own
   * loop, as it always has. Pass it (from HeroShowcase) to drive the chat and
   * something else — the dashboard next to it — off a single clock.
   */
  step?: number;
  typing?: boolean;
  className?: string;
}

export default function ChatSimulator({
  step,
  typing,
  className = "",
}: ChatSimulatorProps = {}) {
  const controlled = step !== undefined;
  const [selfCount, setSelfCount] = useState<number>(0);
  const [selfTyping, setSelfTyping] = useState<boolean>(false);

  const visibleCount = controlled ? step : selfCount;
  const showTyping = controlled ? typing === true : selfTyping;

  const runSequence = useCallback(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    SEQUENCE_TIMINGS.forEach((delay, index) => {
      timeouts.push(
        setTimeout(() => {
          setSelfCount(index + 1);
        }, delay)
      );
    });

    timeouts.push(
      setTimeout(() => {
        setSelfTyping(true);
      }, TYPING_SHOW)
    );

    timeouts.push(
      setTimeout(() => {
        setSelfTyping(false);
      }, TYPING_HIDE)
    );

    return timeouts;
  }, []);

  useEffect(() => {
    if (controlled) return;

    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let restart: ReturnType<typeof setTimeout> | undefined;

    timeouts = runSequence();

    const loopInterval = setInterval(() => {
      timeouts.forEach(clearTimeout);
      setSelfCount(0);
      setSelfTyping(false);
      restart = setTimeout(() => {
        timeouts = runSequence();
      }, RESTART_GAP);
    }, RESET_DELAY);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(restart);
      clearInterval(loopInterval);
    };
  }, [runSequence, controlled]);

  const visibleMessages = MESSAGES.slice(0, visibleCount);

  return (
    <div
      className={`animate-float rounded-[44px] bg-neto-bg2 border border-neto-bg5 shadow-[0_40px_120px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden ${className}`}
      style={{ width: "320px", height: "580px" }}
    >
      {/* WhatsApp Header */}
      <div className="bg-[#075E54] rounded-t-[40px] px-4 py-3 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-neto-green flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-white font-semibold text-sm leading-tight">Neto 🟢</span>
          <span className="text-white/70 text-xs leading-tight">en línea</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden bg-[#0B1114] px-4 py-4 flex flex-col gap-3 justify-end">
        <AnimatePresence initial={false}>
          {visibleMessages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.2 } }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={
                msg.from === "neto"
                  ? "rounded-[18px] rounded-tl-[4px] bg-neto-bg3 text-neto-txt2 text-[13px] px-4 py-2.5 max-w-[88%] mr-auto leading-relaxed whitespace-pre-line"
                  : msg.kind === "voucher"
                    ? "rounded-[18px] rounded-tr-[4px] bg-[#005C4B] p-1.5 ml-auto"
                    : "rounded-[18px] rounded-tr-[4px] bg-[#005C4B] text-white text-sm px-4 py-2.5 max-w-[85%] ml-auto whitespace-pre-line"
              }
            >
              {msg.kind === "voucher" ? <VoucherThumb /> : renderWa(msg.text ?? "")}
            </motion.div>
          ))}

          {showTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[18px] rounded-tl-[4px] bg-neto-bg3 px-4 py-3 max-w-[85%] mr-auto flex items-center gap-1.5"
            >
              {[0, 0.2, 0.4].map((delay, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-neto-txt3 animate-pulse-dot"
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1F2C34] rounded-b-[40px] px-4 py-3 shrink-0">
        <div className="bg-[#2A3942] rounded-full px-4 py-2.5 flex items-center">
          <span className="text-[#8696A0] text-sm select-none">Escribe un mensaje</span>
        </div>
      </div>
    </div>
  );
}
