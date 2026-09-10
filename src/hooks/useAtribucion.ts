"use client";

import { useEffect, useState } from "react";
import {
  capturarAtribucion,
  conAtribucion,
  etiquetaCta,
  type Atribucion,
} from "@/lib/atribucion";
import { APP_URL, WA_NUMBER, type CtaSource, type StartIntent } from "@/lib/constants";

/**
 * Resuelve los dos links de CTA con la atribución de esta visita pegada.
 *
 * **Devuelve los links PELADOS en el primer render y los reales después de montar, y eso es a
 * propósito.** La landing es static export: el HTML sale del build, igual para todos, y calcular
 * esto durante el render haría que el HTML del build y el del navegador difieran, que es mismatch
 * de hidratación. Como efecto lateral deseable, el HTML estático conserva exactamente los links
 * de hoy, así que sin JS los CTA siguen funcionando igual que antes.
 *
 * La ventana entre el primer pintado y el mount es de milisegundos y el peor caso es un clic que
 * sale sin atribución, o sea el comportamiento actual. Ningún caso sale roto.
 */
export function useAtribucion(porDefecto?: string): Atribucion | null {
  const [atr, setAtr] = useState<Atribucion | null>(null);
  // La captura es idempotente y no toca la red, así que llamarla en cada componente que use el
  // hook no cuesta nada y evita depender de que alguien se acuerde de montar un capturador.
  // `porDefecto` es el origen que implica la página (ver `capturarAtribucion`).
  useEffect(() => setAtr(capturarAtribucion(porDefecto)), [porDefecto]);
  return atr;
}

/** Texto prellenado del CTA de WhatsApp. La etiqueta de posición ya existía; el origen es nuevo. */
const textoWa = (posicion: string, intent: StartIntent) =>
  intent === "pro"
    ? `Hola Neto, quiero activar Pro [${posicion}] ⭐`
    : `Hola Neto, quiero empezar [${posicion}] 👋`;

/**
 * Los dos destinos de un CTA, ya atribuidos.
 *
 * `wa` lleva el origen DENTRO del texto porque el alta de Neto ocurre en WhatsApp: ese mensaje es
 * el único punto donde una sesión de la landing toca un alta. `app` lo lleva en el query string,
 * que es lo que PostHog puede leer del otro lado.
 */
export function useCtaHrefs(source: CtaSource, intent: StartIntent = "start") {
  const atr = useAtribucion();
  const texto = textoWa(etiquetaCta(source, atr), intent);
  const appBase = intent === "pro" ? `${APP_URL}/dashboard/pro` : APP_URL;
  return {
    wa: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`,
    app: conAtribucion(appBase, atr),
  };
}

/** Una URL cualquiera de app.neto.pe con la atribución pegada (navbar, footer, links sueltos). */
export function useAppHref(url: string = APP_URL) {
  return conAtribucion(url, useAtribucion());
}
