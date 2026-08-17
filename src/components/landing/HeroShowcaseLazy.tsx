"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * Carga el showcase del hero SOLO donde se ve.
 *
 * El wrapper del padre (`hidden min-[1024px]:flex`) lo esconde en móvil, y el
 * comentario de `HeroShowcase` afirmaba que por eso "none of it renders on
 * mobile". Eso es cierto para los PÍXELES y falso para el JavaScript: `hidden`
 * es CSS, así que el chunk del simulador —ChatSimulator + MiniDashboard +
 * BrowserFrame, más framer-motion— se descargaba, parseaba e hidrataba en cada
 * teléfono para algo que nadie iba a mirar. Medido el 17-ago-2026: la landing en
 * móvil daba 54/100 con **TBT 1290ms**, y Lighthouse atribuía 262 KiB de JS sin
 * usar.
 *
 * `matchMedia` decide el montaje con el MISMO breakpoint que el CSS del padre
 * (1024px). Un solo sitio manda sobre "esto es de desktop"; si alguien mueve el
 * breakpoint del wrapper y no éste, `scripts/verify-hero.mjs` lo agarra, porque
 * lee las burbujas en desktop y exige el showcase oculto en móvil.
 *
 * `ssr: false` es lo que evita que el chunk entre al HTML estático. El costo es
 * que en desktop aparece después de hidratar, y por eso el padre reserva la
 * altura: sin esa reserva esto sería CLS en la primera pantalla.
 */
const HeroShowcase = dynamic(() => import("./HeroShowcase"), { ssr: false });

/** Mismo valor que el `min-[1024px]:` del wrapper en Hero.tsx. */
export const SHOWCASE_MIN_WIDTH = 1024;

export default function HeroShowcaseLazy() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Sin matchMedia no se monta: en un navegador que no sabe responder, el
    // showcase es decoración de desktop y el hero se sostiene solo sin él.
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(`(min-width: ${SHOWCASE_MIN_WIDTH}px)`);
    setVisible(mq.matches);
    // Alguien que agranda la ventana (o gira la tablet) cruza el breakpoint y
    // debe recibirlo; el chunk se pide recién en ese momento.
    const onChange = (e: MediaQueryListEvent) => setVisible(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!visible) return null;
  return <HeroShowcase />;
}
