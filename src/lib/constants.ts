export const WA_NUMBER = '51933014505';

type CtaSource =
  | 'hero'
  | 'hero-secondary'
  | 'sticky'
  | 'pricing-free'
  | 'pricing-pro'
  | 'final'
  | 'exit-intent'
  | 'navbar';

const buildWaLink = (source: CtaSource, intent: 'start' | 'pro' = 'start') => {
  const text =
    intent === 'pro'
      ? `Hola Neto, quiero activar Pro [${source}] ⭐`
      : `Hola Neto, quiero empezar [${source}] 👋`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

export const waLink = (source: CtaSource) => buildWaLink(source, 'start');
export const waLinkPro = (source: CtaSource) => buildWaLink(source, 'pro');

// Backwards-compat exports (legacy callers)
export const WA_LINK = buildWaLink('hero');
export const WA_LINK_PRO = buildWaLink('pricing-pro', 'pro');

export const APP_URL = 'https://app.neto.pe';

// Tracking helper — fire on every CTA tap
type GtagFn = (
  command: 'event',
  eventName: string,
  params?: Record<string, unknown>
) => void;
type FbqFn = (
  command: 'track' | 'trackCustom',
  eventName: string,
  params?: Record<string, unknown>
) => void;
type PosthogFn = {
  capture?: (eventName: string, properties?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    gtag?: GtagFn;
    fbq?: FbqFn;
    posthog?: PosthogFn;
  }
}

export const trackCtaClick = (source: CtaSource, label?: string) => {
  if (typeof window === 'undefined') return;
  const props = { source, label: label ?? source };
  try {
    window.gtag?.('event', 'cta_whatsapp_click', props);
    window.fbq?.('track', 'Contact', props);
    window.posthog?.capture?.('cta_whatsapp_click', props);
  } catch {
    // never break navigation because of analytics
  }
};
