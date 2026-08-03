"use client";
import { useState, useEffect, useRef } from "react";

type CountUpTrigger = "view" | "value";

interface CountUpOptions {
  duration?: number;
  /**
   * "view" (default) — start at 0 and count up once, when the element enters the
   * viewport. "value" — start already at `target` and tween from whatever number
   * is currently on screen every time `target` changes, for when something else
   * (a script, a timer) drives it.
   */
  trigger?: CountUpTrigger;
}

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

export function useCountUp<T extends HTMLElement = HTMLSpanElement>(
  target: number,
  { duration = 1200, trigger = "view" }: CountUpOptions = {}
) {
  const [value, setValue] = useState(trigger === "value" ? target : 0);
  const ref = useRef<T>(null);
  const hasAnimated = useRef(false);
  const frame = useRef<number | null>(null);
  // The number actually on screen. Kept in a ref so an interrupted tween resumes
  // from where it really is instead of restarting from the last committed state.
  const current = useRef(value);

  useEffect(() => {
    const cancel = () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };

    const run = (from: number) => {
      // globals.css silences every other animation under this media query; the
      // gauge honours it too and lands straight on the final number.
      if (prefersReducedMotion()) {
        current.current = target;
        setValue(target);
        return;
      }
      const start = performance.now();
      const delta = target - from;
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const next = Math.round(from + delta * easeOutCubic(p));
        current.current = next;
        setValue(next);
        frame.current = p < 1 ? requestAnimationFrame(tick) : null;
      };
      frame.current = requestAnimationFrame(tick);
    };

    if (trigger === "value") {
      if (current.current === target) return;
      cancel();
      run(current.current);
      return cancel;
    }

    const el = ref.current;
    if (!el || hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;
        observer.disconnect();
        run(0);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      cancel();
    };
  }, [target, duration, trigger]);

  return { value, ref };
}
