"use client";

import { useCountUp } from "@/hooks/useCountUp";

/**
 * The Neto Score gauge, drawn natively instead of screenshotted. It replaces a
 * 1480x2480 capture that had to be squashed to 400px to fit, and it stops the
 * landing's flagship visual from going stale every time the dashboard changes.
 *
 * Blue on purpose (--color-app-info): the real gauge in app.neto.pe paints a score
 * of 60-79 in --info, and both places that draw this one show a score in that band.
 * It sits on a light app card (palette B), so track and digits use the app-* tokens;
 * the green accents around the card belong to the landing, not to the score.
 */

const R = 48;
const CIRCUMFERENCE = 2 * Math.PI * R;
// Three quarters of the circle, gap centred at the bottom: the arc runs from
// 135deg (bottom-left) clockwise through the top to 45deg (bottom-right).
const SWEEP = 0.75;

interface ScoreGaugeProps {
  value: number;
  size?: number;
  /** "view" counts up once on scroll-in; "value" tweens whenever value changes. */
  trigger?: "view" | "value";
  duration?: number;
  className?: string;
}

export default function ScoreGauge({
  value,
  size = 200,
  trigger = "view",
  duration = 1400,
  className = "",
}: ScoreGaugeProps) {
  const target = Math.max(0, Math.min(100, Math.round(value)));
  const { value: shown, ref } = useCountUp<HTMLDivElement>(target, {
    duration,
    trigger,
  });

  return (
    <div
      ref={ref}
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      // The visible number starts at 0 and animates, so the accessible name
      // carries the real score for screen readers and crawlers.
      aria-label={`Neto Score: ${target} de 100`}
    >
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
        {/* Track */}
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke="var(--color-app-track)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${SWEEP * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          transform="rotate(135 60 60)"
        />

        {/* Progress — driven by the same number shown in the middle, so ring and
            digits never disagree mid-animation. */}
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke="var(--color-app-info)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={`${(shown / 100) * SWEEP * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          transform="rotate(135 60 60)"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span
          className="font-heading font-extrabold text-app-fg leading-none tabular-nums"
          style={{ fontSize: size * 0.28 }}
          aria-hidden
        >
          {shown}
        </span>
        <span
          className="text-app-muted leading-none mt-1"
          style={{ fontSize: Math.max(10, size * 0.075) }}
          aria-hidden
        >
          de 100
        </span>
      </div>
    </div>
  );
}
