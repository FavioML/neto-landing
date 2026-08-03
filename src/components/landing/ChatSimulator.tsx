"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  from: "neto" | "user";
  text: string;
}

const MESSAGES: Message[] = [
  { id: 0, from: "user", text: "Gasté 45 en almuerzo 🍽️" },
  { id: 1, from: "neto", text: "¡Anotado! ✅\nAlmuerzo · S/45.00 · Comida 🍔" },
  { id: 2, from: "neto", text: "Llevas S/847 esta semana.\nTe quedan S/403 de tu presupuesto." },
  { id: 3, from: "neto", text: "💡 Van 3 deliverys esta semana. ¿Te aviso si pasas de S/200?" },
  { id: 4, from: "user", text: "Sí porfa" },
  { id: 5, from: "neto", text: "Listo ✅ Te avisaré.\nTu score va en 74 este mes 📈" },
];

export const SEQUENCE_TIMINGS = [600, 2000, 3500, 6500, 8500, 10000];
export const TYPING_SHOW = 5200;
export const TYPING_HIDE = 6500;
export const RESET_DELAY = 13000;

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

    timeouts.push(
      setTimeout(() => {
        setSelfCount(0);
        setSelfTyping(false);
      }, RESET_DELAY)
    );

    return timeouts;
  }, []);

  useEffect(() => {
    if (controlled) return;

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    const start = () => {
      timeouts = runSequence();
    };

    start();

    const loopInterval = setInterval(() => {
      timeouts.forEach(clearTimeout);
      setSelfCount(0);
      setSelfTyping(false);
      setTimeout(() => {
        timeouts = runSequence();
      }, 100);
    }, RESET_DELAY + 500);

    return () => {
      timeouts.forEach(clearTimeout);
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
                  ? "rounded-[18px] rounded-tl-[4px] bg-neto-bg3 text-neto-txt2 text-sm px-4 py-2.5 max-w-[85%] mr-auto leading-relaxed whitespace-pre-line"
                  : "rounded-[18px] rounded-tr-[4px] bg-[#005C4B] text-white text-sm px-4 py-2.5 max-w-[85%] ml-auto whitespace-pre-line"
              }
            >
              {msg.text}
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
