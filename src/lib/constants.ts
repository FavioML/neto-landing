export const WA_NUMBER = '51933014505';

export type CtaSource =
  | 'hero'
  | 'hero-secondary'
  | 'sticky'
  | 'pricing-free'
  | 'pricing-pro'
  | 'final'
  | 'exit-intent'
  | 'navbar'
  | 'faq'
  | 'como-funciona'
  | 'score'
  | 'comparativas'
  | 'blog'
  | 'producto';

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

// URL del backend (para la mini-landing de referido: resolver ref_code → nombre del referrer).
export const API_URL = 'https://api.neto.pe';

// Link de referido a WhatsApp. El texto DEBE ser exactamente "Hola NETO ref:CODE" para que el
// webhook del backend (handlers/webhook.js) lo reconozca y vincule al referido con su referrer.
export const waReferralLink = (code: string) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola NETO ref:' + code)}`;

// Registro por la webapp llevando el código en query (alta web con referido).
export const appReferralUrl = (code: string) => `${APP_URL}/?ref=${encodeURIComponent(code)}`;

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

// Channel selector ("¿Cómo prefieres empezar?") — WhatsApp vs webapp.
// A "start" CTA dispatches this event; <ChannelSelector> (mounted once in the
// root layout) listens and opens the modal. Kept decoupled via a DOM event so it
// works from both server and client pages in the static export.
export const trackStartOpen = (source: CtaSource) => {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', 'cta_start_open', { source });
    window.posthog?.capture?.('cta_start_open', { source });
  } catch {
    // analytics must never break the UI
  }
};

export type StartIntent = 'start' | 'pro';

export const openChannelSelector = (
  source: CtaSource,
  intent: StartIntent = 'start'
) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('neto:start', { detail: { source, intent } })
  );
  trackStartOpen(source);
};
