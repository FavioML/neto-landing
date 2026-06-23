'use client';

import { useEffect, useState } from 'react';

// La landing usa el snippet inline de PostHog (window.posthog), no el módulo npm.
type PH = {
  opt_out_capturing?: () => void;
  opt_in_capturing?: () => void;
  has_opted_out_capturing?: () => boolean;
};

function getPH(): PH | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { posthog?: PH }).posthog;
}

export default function PrivacyToggle({ className }: { className?: string }) {
  const [optedOut, setOptedOut] = useState(false);

  useEffect(() => {
    try {
      setOptedOut(!!getPH()?.has_opted_out_capturing?.());
    } catch {
      /* noop */
    }
  }, []);

  const toggle = () => {
    const ph = getPH();
    if (!ph) return;
    try {
      if (optedOut) {
        ph.opt_in_capturing?.();
        setOptedOut(false);
      } else {
        ph.opt_out_capturing?.();
        setOptedOut(true);
      }
    } catch {
      /* noop */
    }
  };

  return (
    <button type="button" onClick={toggle} className={className}>
      {optedOut ? 'Activar analíticas' : 'No rastrear mi actividad'}
    </button>
  );
}
