"use client";

import {
  waLink,
  waLinkPro,
  openChannelSelector,
  type CtaSource,
  type StartIntent,
} from "@/lib/constants";

interface StartButtonProps {
  /** Where the CTA lives — used for analytics + the WhatsApp deep-link. */
  source: CtaSource;
  /** "start" (register) or "pro" (activate Pro). Changes the selector copy. */
  intent?: StartIntent;
  className?: string;
  children: React.ReactNode;
  id?: string;
  /** Optional side-effect to run when clicked (e.g. close a mobile menu). */
  onClick?: () => void;
}

/**
 * A registration CTA that opens the channel selector ("¿Cómo prefieres
 * empezar?"). Renders as an <a> whose href is the WhatsApp link, so without JS
 * it still degrades to WhatsApp; with JS it opens the modal instead.
 * Styling is passed in via className so each call site keeps its own look.
 */
export default function StartButton({
  source,
  intent = "start",
  className,
  children,
  id,
  onClick,
}: StartButtonProps) {
  return (
    <a
      href={intent === "pro" ? waLinkPro(source) : waLink(source)}
      id={id}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        openChannelSelector(source, intent);
      }}
    >
      {children}
    </a>
  );
}
