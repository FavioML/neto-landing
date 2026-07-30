"use client";

import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

interface BrowserFrameProps {
  /** URL shown in the fake address bar, e.g. "app.neto.pe/dashboard". */
  url: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Aspect ratio for the cropped viewport, e.g. "16 / 10" or "4 / 3.1". Omit to show the full image. */
  aspect?: string;
  /** object-position for the crop. Defaults to "top center". */
  objectPosition?: string;
  className?: string;
  priority?: boolean;
}

/**
 * A macOS-style browser chrome wrapping a real product screenshot.
 * Used on /producto and reused for framed captures across the landing.
 */
export default function BrowserFrame({
  url,
  src,
  alt,
  width,
  height,
  aspect,
  objectPosition = "top center",
  className = "",
  priority = false,
}: BrowserFrameProps) {
  return (
    <motion.div
      className={`rounded-2xl border border-white/[0.08] bg-neto-bg2 overflow-hidden shadow-[0_40px_90px_-40px_rgba(0,0,0,0.8)] ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {/* Chrome top bar */}
      <div className="flex items-center gap-3 px-3.5 py-2.5 bg-neto-bg3 border-b border-white/[0.06]">
        <span className="flex gap-1.5" aria-hidden>
          <i className="w-2.5 h-2.5 rounded-full bg-neto-bg6" />
          <i className="w-2.5 h-2.5 rounded-full bg-neto-bg6" />
          <i className="w-2.5 h-2.5 rounded-full bg-neto-bg6" />
        </span>
        <span className="text-[11.5px] text-neto-txt3 bg-neto-bg rounded-md px-3 py-0.5">
          {url}
        </span>
      </div>
      {/* Screenshot */}
      <div style={aspect ? { aspectRatio: aspect, overflow: "hidden" } : undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          className="block w-full"
          style={
            aspect
              ? { height: "100%", objectFit: "cover", objectPosition }
              : { height: "auto" }
          }
        />
      </div>
    </motion.div>
  );
}
