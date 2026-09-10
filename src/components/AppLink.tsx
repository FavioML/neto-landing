"use client";

import { useAppHref } from "@/hooks/useAtribucion";
import { APP_URL } from "@/lib/constants";

/**
 * Un `<a>` a app.neto.pe que propaga la atribución de la visita.
 *
 * Existe como componente propio para no convertir en cliente a toda una página server-side por un
 * link. El `Footer` es el caso que lo motivó: es server component, y el único sitio que necesita
 * `window` es el href del link "Dashboard".
 *
 * Sin JS (o en el primer render del HTML estático) cae al link pelado, que es el de hoy.
 */
export default function AppLink({
  href = APP_URL,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={useAppHref(href)} className={className}>
      {children}
    </a>
  );
}
