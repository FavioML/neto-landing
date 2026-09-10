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
  | 'producto'
  | 'footer'
  | 'referido';

const buildWaLink = (source: CtaSource, intent: 'start' | 'pro' = 'start') => {
  const text =
    intent === 'pro'
      ? `Hola Neto, quiero activar Pro [${source}] ⭐`
      : `Hola Neto, quiero empezar [${source}] 👋`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
};

// Estos dos arman el link SIN origen (`[blog]`): es lo que queda horneado en el HTML estático.
// El origen se agrega en cliente, con `useCtaHrefs` o, para HTML que viene como string, con
// `<HtmlAtribuido>`. Ya no existe un `WA_LINK` fijo: etiquetaba como `hero` los clics del footer
// y del cuerpo del blog, así que la posición mentía justo donde el origen faltaba.
export const waLink = (source: CtaSource) => buildWaLink(source, 'start');
export const waLinkPro = (source: CtaSource) => buildWaLink(source, 'pro');

export const APP_URL = 'https://app.neto.pe';

// URL del backend (para la mini-landing de referido: resolver ref_code → nombre del referrer).
export const API_URL = 'https://api.neto.pe';

// Link de referido a WhatsApp. El texto DEBE EMPEZAR con "Hola NETO ref:CODE" para que el webhook
// del backend (handlers/webhook.js, `/^hola\s+neto\s+ref:([A-Z0-9]{4,12})/i`) lo reconozca y vincule
// al referido con su referrer. Ese regex ancla solo el inicio, así que la etiqueta de atribución va
// DETRÁS (`[referido|ig]`, el mismo contrato del corchete que los CTA). Sin ella el alta por
// referido quedaba con `origen` NULL, porque `registrarOrigenDelAlta` no escribe nada sin etiqueta.
export const waReferralLink = (code: string, etiqueta: string = 'referido') =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola NETO ref:' + code + ' [' + etiqueta + ']')}`;

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
