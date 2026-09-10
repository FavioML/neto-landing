"use client";

import { useCtaHrefs } from "@/hooks/useAtribucion";
import type { CtaSource } from "@/lib/constants";

/**
 * Un `<a>` a WhatsApp que lleva su posición Y el origen de la visita (`[footer|ig]`).
 *
 * Hermano de `<AppLink>`, y existe por lo mismo: el `Footer` es server component y lo único que
 * necesita `window` es este href. Sin JS (o en el primer render) sale `[footer]`, que ya dice la
 * posición correcta aunque le falte el origen.
 */
export default function WaLink({
  posicion,
  className,
  children,
}: {
  posicion: CtaSource;
  className?: string;
  children: React.ReactNode;
}) {
  const { wa } = useCtaHrefs(posicion);
  return (
    <a href={wa} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
