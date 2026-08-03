"use client";

import { useEffect, useState, useCallback } from "react";
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
 */
export default function HeroShowcase() {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState(false);

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
    let timeouts: ReturnType<typeof setTimeout>[] = [];
    let restart: ReturnType<typeof setTimeout> | undefined;

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
  }, [runSequence]);

  return (
    // Two boxes on purpose. The inner one is a fixed 562x600 stage so the phone
    // and the card keep their relationship at every width; the outer one carries
    // the *scaled* dimensions, because a transform doesn't shrink the layout box
    // and a 562px child would otherwise set the grid column's min-width and steal
    // the headline's room at 1024.
    <div className="relative shrink-0 w-[418px] h-[432px] min-[1152px]:w-[476px] min-[1152px]:h-[492px] min-[1280px]:w-[534px] min-[1280px]:h-[552px]">
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
