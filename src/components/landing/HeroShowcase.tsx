"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import ChatSimulator, {
  SEQUENCE_TIMINGS,
  TYPING_SHOW,
  TYPING_HIDE,
  RESET_DELAY,
  RESTART_GAP,
} from "./ChatSimulator";
import { DashboardSummary, DashboardMovements } from "./MiniDashboard";

/**
 * Chat + app, on one clock. The timing used to live inside ChatSimulator; it
 * moved up here so the dashboard can react to the same script instead of running
 * its own loop and drifting out of sync within a few cycles.
 *
 * Desktop only — the parent keeps this behind `hidden min-[1024px]:flex`, so
 * none of it renders on mobile and the mobile LCP is untouched.
 *
 * The loop is gated twice, because one clock now drives three components (the phone plus
 * the two dashboard cards) and it used to run forever:
 *
 *   · **Reduced motion** — no loop at all. It renders the FINAL frame instead of freezing on
 *     an empty chat: the hero is an argument about the product, and someone who asked the OS
 *     for less motion should still get to read it.
 *   · **Viewport** — paused once the hero scrolls off. Nothing was watching, and the timers
 *     kept firing state updates through three subtrees for as long as the tab stayed open.
 *
 * Both default to ON when the browser can't answer (no IntersectionObserver, no matchMedia).
 * That matters more than it looks: `scripts/verify-hero.mjs` drives a real browser and reads
 * the sixth bubble at 8.9s inside a 15s loop, so a gate that defaults to "paused" wouldn't
 * fail loudly — it would leave the guard staring at a hero that never plays.
 */
const PASOS_TOTALES = SEQUENCE_TIMINGS.length;

export default function HeroShowcase() {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);
  const [enPantalla, setEnPantalla] = useState(true);
  const [motionReducido, setMotionReducido] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    setMotionReducido(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMotionReducido(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const nodo = contenedor.current;
    if (!nodo || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entrada]) => setEnPantalla(entrada.isIntersecting),
      // Un poco de margen: reanudar cuando ya está entrando, no cuando el usuario
      // lo tiene al medio de la pantalla mirando un chat vacío.
      { rootMargin: "120px" }
    );
    io.observe(nodo);
    return () => io.disconnect();
  }, []);

  const runSequence = useCallback(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    SEQUENCE_TIMINGS.forEach((delay, index) => {
      timeouts.push(setTimeout(() => setStep(index + 1), delay));
    });
    timeouts.push(setTimeout(() => setTyping(true), TYPING_SHOW));
    timeouts.push(setTimeout(() => setTyping(false), TYPING_HIDE));

    return timeouts;
  }, []);

  useEffect(() => {
    if (motionReducido) {
      // El guion completo, quieto. No es "sin animación": es el desenlace.
      setStep(PASOS_TOTALES);
      setTyping(false);
      return;
    }
    if (!enPantalla) return;

    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let restart: ReturnType<typeof setTimeout> | undefined;

    // Se reinicia desde cero al volver a pantalla. Sin esto, quien sale del hero a mitad de
    // guion y vuelve ve el frame donde quedó —incluido el "escribiendo…" congelado si salió
    // entre los 8.0s y los 8.9s— y el chat recién colapsa a una burbuja cuando entra el
    // primer timeout. Empezar de cero es además lo que la escena quiere: el guion se lee
    // desde el principio o no se entiende.
    setStep(0);
    setTyping(false);
    timeouts = runSequence();

    const loopInterval = setInterval(() => {
      timeouts.forEach(clearTimeout);
      setStep(0);
      setTyping(false);
      restart = setTimeout(() => {
        timeouts = runSequence();
      }, RESTART_GAP);
    }, RESET_DELAY);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(restart);
      clearInterval(loopInterval);
    };
  }, [runSequence, enPantalla, motionReducido]);

  return (
    // Two boxes on purpose. The inner one is a fixed 562x600 stage so the phone
    // and the card keep their relationship at every width; the outer one carries
    // the *scaled* dimensions, because a transform doesn't shrink the layout box
    // and a 562px child would otherwise set the grid column's min-width and steal
    // the headline's room at 1024.
    <div
      ref={contenedor}
      className="relative shrink-0 w-[418px] h-[432px] min-[1152px]:w-[476px] min-[1152px]:h-[492px] min-[1280px]:w-[534px] min-[1280px]:h-[552px]"
    >
      <div className="absolute left-0 top-0 w-[580px] h-[600px] origin-top-left scale-[0.72] min-[1152px]:scale-[0.82] min-[1280px]:scale-[0.92]">
        {/* Two app cards, staggered. Card B is nudged left so its border tucks
            under the phone by ~14px — just the edge. Any deeper and the phone
            eats the card's left padding, which is where the labels sit. */}
        <div className="absolute right-0 top-[36px] z-10">
          <DashboardSummary step={step} />
        </div>
        <div className="absolute right-[22px] top-[352px] z-30">
          <DashboardMovements step={step} />
        </div>

        {/* Phone — in front and to the left */}
        <div className="absolute left-0 top-0 z-20">
          <ChatSimulator step={step} typing={typing} />
        </div>
      </div>
    </div>
  );
}
