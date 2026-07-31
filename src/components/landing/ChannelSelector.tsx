"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, LayoutDashboard, X } from "lucide-react";
import {
  waLink,
  waLinkPro,
  APP_URL,
  trackCtaClick,
  type CtaSource,
  type StartIntent,
} from "@/lib/constants";

const EASE = [0.16, 1, 0.3, 1] as const;

const COPY = {
  start: {
    title: "¿Cómo prefieres empezar?",
    sub: "Neto funciona por los dos lados. Elige por dónde arrancar.",
    waDesc: "Escríbele a Neto y registra tu primer gasto en el chat",
    appDesc: "Crea tu cuenta con Google o correo en app.neto.pe",
    appHref: APP_URL,
    footer: (
      <>
        Empieza por donde quieras. Conéctalos y es{" "}
        <span className="text-neto-txt2">una sola cuenta, sincronizada.</span>
      </>
    ),
  },
  pro: {
    title: "¿Cómo quieres activar Pro?",
    sub: "Actívalo por el canal que prefieras. Vale en los dos lados.",
    waDesc: "Neto te pasa los datos de pago y activa tu Pro",
    appDesc: "Actívalo desde app.neto.pe, paga con Yape",
    appHref: `${APP_URL}/dashboard/pro`,
    footer: (
      <>
        Tu Pro es{" "}
        <span className="text-neto-txt2">la misma cuenta en WhatsApp y app.</span>
      </>
    ),
  },
} as const;

/**
 * "¿Cómo prefieres empezar?" — the dual-registration selector.
 * Mounted once in the root layout. Opens when any <StartButton> dispatches the
 * `neto:start` CustomEvent (see openChannelSelector in lib/constants).
 */
export default function ChannelSelector() {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState<CtaSource>("hero");
  const [intent, setIntent] = useState<StartIntent>("start");

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onStart = (e: Event) => {
      const detail = (e as CustomEvent<{ source?: CtaSource; intent?: StartIntent }>)
        .detail;
      setSource(detail?.source ?? "hero");
      setIntent(detail?.intent ?? "start");
      setOpen(true);
    };
    window.addEventListener("neto:start", onStart as EventListener);
    return () => window.removeEventListener("neto:start", onStart as EventListener);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  const c = COPY[intent];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />

          {/* Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="channel-title"
            className="relative w-full max-w-[440px] rounded-3xl border border-white/10 bg-neto-bg2 p-7 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label="Cerrar"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-neto-txt3 hover:bg-neto-bg3 hover:text-neto-txt transition-colors"
            >
              <X size={18} />
            </button>

            <h3 id="channel-title" className="text-xl font-bold text-neto-txt">
              {c.title}
            </h3>
            <p className="mt-1.5 text-sm text-neto-txt3">{c.sub}</p>

            <div className="mt-6 flex flex-col gap-3">
              {/* WhatsApp */}
              <a
                href={intent === "pro" ? waLinkPro(source) : waLink(source)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick(source, "channel:whatsapp")}
                className="group flex items-center gap-4 rounded-2xl border border-neto-green/30 bg-neto-green/[0.06] px-5 py-4 transition-all hover:border-neto-green/60 hover:bg-neto-green/[0.12]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-neto-green/15">
                  <MessageCircle size={20} className="text-neto-green-light" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold text-neto-txt">
                    Por WhatsApp
                  </span>
                  <span className="text-[13px] text-neto-txt3 leading-snug">
                    {c.waDesc}
                  </span>
                </span>
              </a>

              {/* Webapp */}
              <a
                href={c.appHref}
                onClick={() => trackCtaClick(source, "channel:app")}
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-neto-bg3 px-5 py-4 transition-all hover:border-neto-green/40 hover:bg-neto-bg4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-neto-bg5">
                  <LayoutDashboard size={20} className="text-neto-txt2" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[15px] font-semibold text-neto-txt">
                    Desde la app
                  </span>
                  <span className="text-[13px] text-neto-txt3 leading-snug">
                    {c.appDesc}
                  </span>
                </span>
              </a>
            </div>

            <p className="mt-5 text-center text-xs text-neto-txt3 leading-relaxed">
              {c.footer}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
