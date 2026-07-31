"use client";

import { waLink, openChannelSelector, type CtaSource } from "@/lib/constants";

interface StartButtonProps {
  /** Where the CTA lives — used for analytics + the WhatsApp deep-link. */
  source: CtaSource;
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
  className,
  children,
  id,
  onClick,
}: StartButtonProps) {
  return (
    <a
      href={waLink(source)}
      id={id}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        openChannelSelector(source);
      }}
    >
      {children}
    </a>
  );
}
