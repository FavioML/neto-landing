"use client";

import { useEffect, useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import HeroShowcaseLazy from "./HeroShowcaseLazy";
import StartButton from "./StartButton";

export default function Hero() {
  // Prevent Framer Motion from serializing opacity:0 into the static HTML
  // (which blocks LCP). On the server / initial paint, content is fully visible.
  // After hydration the entrance animation plays once.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    let timeout: ReturnType<typeof setTimeout>;
    const isTouchDevice =
      typeof window !== "undefined" &&
      window.matchMedia?.("(hover: none)").matches;

    const pulse = () => {
      const el = document.getElementById("hero-cta");
      if (!el) return;
      el.classList.remove("cta-attention");
      // re-trigger reflow so the class re-applies cleanly
      void el.offsetWidth;
      el.classList.add("cta-attention");
    };

    if (isTouchDevice) {
      // Mobile: fire attention pulse every 8s regardless of interaction
      const interval = setInterval(pulse, 8000);
      return () => clearInterval(interval);
    }

    const reset = () => {
      clearTimeout(timeout);
      document.getElementById("hero-cta")?.classList.remove("cta-attention");
      timeout = setTimeout(() => {
        document.getElementById("hero-cta")?.classList.add("cta-attention");
      }, 8000);
    };

    window.addEventListener("mousemove", reset, { passive: true });
    window.addEventListener("scroll", reset, { passive: true });
    reset();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", reset);
      window.removeEventListener("scroll", reset);
    };
  }, []);

  // La entrada se hace con el `.animate-fade-up` que ya vive en globals.css, no
  // con framer-motion: la librería entera estaba en el bundle CRÍTICO de la
  // primera pantalla para animar cinco bloques una sola vez. El CSS ya respeta
  // `prefers-reduced-motion` (globals.css), que antes había que recordar aparte.
  //
  // Se conserva el gate por `mounted`, y su razón original no cambió: sin él, el
  // HTML estático saldría con `opacity: 0` serializado y eso retrasa el LCP. En
  // SSR y hasta hidratar, el contenido va visible y sin clase de animación.
  // El helper RECIBE las clases del elemento y las combina. Devolver `className`
  // suelto para spreadearlo sería un bug silencioso: en JSX el último gana, así
  // que `{...fadeUp(100)} className="..."` borraría la animación (o al revés,
  // borraría el layout del bloque).
  const fadeUp = (delayMs: number, className = "") => ({
    className: mounted ? `animate-fade-up ${className}`.trim() : className,
    ...(mounted ? { style: { animationDelay: `${delayMs}ms` } } : {}),
  });

  const fadeIn = (className = "") => fadeUp(0, className);

  return (
    <section className="relative min-h-[88svh] min-[640px]:min-h-[100svh] bg-neto-bg overflow-hidden flex flex-col justify-center">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 -z-20 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #68dbae 1px, transparent 1px), linear-gradient(to bottom, #68dbae 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 50% at 50% 40%, black 40%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 50% at 50% 40%, black 40%, transparent 100%)",
        }}
      />

      {/* Green radial glow */}
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] -z-10 bg-[#1D9E75]/[0.08] blur-[140px] pointer-events-none"
        aria-hidden
      />

      {/* Amber glow */}
      <div
        className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] -z-10 bg-[#EF9F27]/[0.05] blur-[100px] pointer-events-none"
        aria-hidden
      />

      {/* Main content grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 min-[1024px]:grid-cols-[55fr_45fr] gap-12 min-[1024px]:gap-8 items-center">
        {/* Left column — text */}
        <div {...fadeIn("flex flex-col gap-8 min-[1024px]:pr-8")}>
          {/* Eyebrow badge */}
          <div {...fadeUp(100)}>
            <span className="inline-flex items-center gap-2 border border-neto-green/30 bg-neto-green/10 px-5 py-1.5 rounded-full">
              <Sparkles
                size={14}
                className="text-neto-amber shrink-0"
                aria-hidden
              />
              <span className="text-xs text-neto-green-light font-medium">
                Score financiero 0-100 · 14 días de Pro gratis
              </span>
            </span>
          </div>

          {/* H1 */}
          <h1
            {...fadeUp(
              200,
              "text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight",
            )}
          >
            <span className="block bg-gradient-to-b from-neto-txt to-neto-txt3 bg-clip-text text-transparent">
              Entiende tu plata,
            </span>
            <span className="block bg-gradient-to-r from-neto-green-light via-neto-green to-neto-green bg-clip-text text-transparent">
              no solo la anotes.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            {...fadeUp(300, "text-lg text-neto-txt3 max-w-[520px] leading-relaxed")}
          >
            Anotar gastos es el piso. Neto te da un score de salud financiera
            del 0 al 100 y te dice, en soles, a dónde se va tu plata y cuánto
            te queda. Por WhatsApp o desde la app.
          </p>

          {/* Stats row — placed between subtitle and CTA so trust signals are above-the-fold on mobile */}
          <div
            {...fadeUp(400, "flex flex-row flex-wrap items-center gap-x-4 gap-y-3")}
          >
            {[
              { value: "Bancos", label: "Compatibles" },
              { value: "Consultas", label: "En lenguaje natural" },
              { value: "Sin contraseñas", label: "Bancarias" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex flex-row items-center gap-4">
                {i > 0 && (
                  <span className="text-neto-txt3 select-none" aria-hidden>
                    ·
                  </span>
                )}
                <div className="flex flex-col">
                  <span className="text-neto-txt font-semibold text-sm leading-tight">
                    {stat.value}
                  </span>
                  <span className="text-neto-txt3 text-xs leading-tight">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div {...fadeUp(500, "flex flex-col gap-2")}>
            <div className="flex flex-row flex-wrap gap-3">
              <StartButton
                source="hero"
                id="hero-cta"
                className="rounded-full bg-gradient-to-br from-neto-green-light to-neto-green text-[#002115] px-7 py-3.5 text-base font-semibold transition-all duration-200 hover:shadow-[0_0_40px_rgba(29,158,117,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Probar Neto gratis →
              </StartButton>
              <a
                href="#precios"
                className="rounded-full border border-neto-bg5 bg-neto-bg3/60 backdrop-blur-sm px-7 py-3.5 text-base font-medium text-neto-txt2 transition-all duration-200 hover:bg-neto-bg4 hover:text-neto-txt active:scale-[0.98]"
              >
                Ver precios
              </a>
            </div>
            <p className="text-xs text-neto-txt3">
              Setup en 2 min · 14 días de Pro gratis · Después{" "}
              <span className="text-neto-green font-medium">S/10/mes</span>
              {" "}— la mitad que la competencia
            </p>
          </div>
        </div>

        {/* Right column — chat + app, synchronised. Oculto en móvil, y desde el
            17-ago tampoco se DESCARGA ahí: `hidden` es CSS y el chunk se bajaba
            igual (ver HeroShowcaseLazy). La altura mínima está reservada porque
            ahora entra después de hidratar y sin eso sería CLS en desktop. */}
        <div className="hidden min-[1024px]:flex min-h-[560px] items-center justify-center relative">
          <HeroShowcaseLazy />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden min-[1024px]:flex flex-col items-center gap-1 pointer-events-none">
        <ChevronDown
          size={20}
          className="text-neto-txt3 animate-bounce"
          aria-hidden
        />
      </div>
    </section>
  );
}
