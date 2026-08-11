"use client";

import { ArrowRight } from "lucide-react";
import BlurReveal from "@/components/shared/BlurReveal";
import StartButton from "./StartButton";

export default function FinalCTA() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)" }}
    >
      {/* Amber glow */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#EF9F27]/20 blur-[100px] pointer-events-none" />

      <BlurReveal>
        <div className="relative z-10 text-center max-w-[700px] mx-auto px-6 flex flex-col items-center">
          {/* H2 */}
          <h2 className="text-4xl min-[860px]:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1]">
            <span className="text-white">¿A dónde se fue</span>
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px rgba(255,255,255,0.85)" }}
            >
              tu plata?
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-white/80 mb-10">
            Mándale un mensaje a Neto y descúbrelo en 2 minutos.
          </p>

          {/* CTA button */}
          <StartButton
            source="final"
            className="inline-flex items-center gap-2 rounded-full bg-neto-amber px-8 py-4 text-base font-semibold text-neto-bg transition-all duration-200 hover:brightness-110"
          >
            Probar Neto gratis
            <ArrowRight size={18} />
          </StartButton>

          {/* Sub note. "Setup en 2 min" sale porque el subtítulo de arriba ya dice
              "en 2 minutos", y el hueco lo ocupa el precio: la página entera vende
              lo que está detrás del muro. */}
          <p className="text-sm text-white/60 mt-6">
            14 días de Pro gratis · Después S/10/mes · Sin contraseñas bancarias
          </p>
        </div>
      </BlurReveal>
    </section>
  );
}
