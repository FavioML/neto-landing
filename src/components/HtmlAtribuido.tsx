"use client";

import { useEffect, useRef } from "react";
import { useAtribucion } from "@/hooks/useAtribucion";
import { atribuirHref } from "@/lib/atribucion";

/**
 * Renderiza un string de HTML y, después de montar, le pega la atribución a sus links de
 * WhatsApp y de app.neto.pe (`atribuirHref`).
 *
 * Existe porque el cuerpo del blog y las respuestas de la FAQ son strings de HTML, no JSX: sus
 * links no pueden pasar por `useCtaHrefs`. Hasta el 2026-09-10 esos links salían con `[hero]`
 * fijo, o sea que un clic desde un post llegaba al backend como si fuera del hero y sin origen.
 *
 * **Muta los `href` en el DOM en vez de re-renderizar con otro string, a propósito.** El primer
 * render es idéntico al HTML estático (sin mismatch de hidratación) y React no vuelve a tocar un
 * `dangerouslySetInnerHTML` cuyo string no cambió, así que el cambio de atributo no se pisa. Un
 * re-render con el HTML reescrito, en cambio, recrearía todos los nodos del artículo.
 */
export default function HtmlAtribuido({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const atr = useAtribucion();

  useEffect(() => {
    if (!atr || !ref.current) return;
    for (const a of ref.current.querySelectorAll<HTMLAnchorElement>("a[href]")) {
      const href = a.getAttribute("href") || "";
      const nuevo = atribuirHref(href, atr);
      if (nuevo !== href) a.setAttribute("href", nuevo);
    }
  }, [atr, html]);

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
