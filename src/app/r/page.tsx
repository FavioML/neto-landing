"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { WA_NUMBER, APP_URL, API_URL, waReferralLink, appReferralUrl } from "@/lib/constants";

// El code viene en el pathname (/r/CODE). Con static export no hay segmento [code]
// pre-renderizado: Cloudflare (_redirects) sirve el HTML de /r y aquí lo leemos en runtime.
function extraerCode(): string | null {
  if (typeof window === "undefined") return null;
  const m = window.location.pathname.match(/\/r\/([A-Za-z0-9]{4,12})/);
  return m ? m[1].toUpperCase() : null;
}

export default function ReferidoPage() {
  const [code, setCode] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    const c = extraerCode();
    setCode(c);
    if (!c) {
      setCargado(true);
      return;
    }
    let vivo = true;
    fetch(`${API_URL}/api/referidor/${c}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (vivo && j?.ok) setNombre(j.nombre || null);
      })
      .catch(() => {
        /* si el backend no responde, cae a la invitación genérica */
      })
      .finally(() => {
        if (vivo) setCargado(true);
      });
    return () => {
      vivo = false;
    };
  }, []);

  const waHref = code
    ? waReferralLink(code)
    : `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola NETO")}`;
  const appHref = code ? appReferralUrl(code) : APP_URL;
  const titulo = cargado && nombre ? `${nombre} te invitó a Neto` : "Te invitaron a Neto";

  return (
    <main className="flex min-h-screen flex-col bg-neto-bg text-neto-txt">
      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/neto-icon.png" alt="Neto" width={32} height={32} className="rounded-lg" />
          <span className="font-heading text-lg font-bold">Neto</span>
        </Link>
        <Link href="/producto" className="text-sm text-neto-txt2 transition-colors hover:text-neto-txt">
          Conoce Pro
        </Link>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-5 py-10 text-center">
        <div className="w-full max-w-lg">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-neto-green/30 bg-neto-green/10 px-4 py-1.5 text-xs font-medium text-neto-green-light">
            🎁 Invitación con regalo
          </div>

          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">{titulo}</h1>

          <p className="mx-auto mt-4 max-w-md text-base text-neto-txt2">
            Neto es tu asistente financiero por WhatsApp. Registra gastos, entiende en qué se te va la plata
            y ahorra — todo desde tu chat.
          </p>

          <div className="mx-auto mt-8 rounded-2xl border border-neto-green/25 bg-neto-green/[0.06] p-5 text-left">
            <p className="text-sm font-semibold text-neto-txt">Tu regalo de bienvenida</p>
            <p className="mt-1 text-sm text-neto-txt2">
              Empieza <span className="font-semibold text-neto-txt">gratis</span> y, cuando quieras Pro,
              estrena tu <span className="font-semibold text-neto-txt">primer mes a mitad de precio</span>:{" "}
              <span className="font-bold text-neto-green-light">S/5</span>{" "}
              <span className="text-neto-txt3 line-through">S/10</span>.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href={waHref}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-neto-green px-6 py-3.5 font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95"
            >
              Empezar gratis por WhatsApp
            </a>
            <a
              href={appHref}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 px-6 py-3.5 font-medium text-neto-txt transition-colors hover:bg-white/[0.04]"
            >
              Crear cuenta en la app
            </a>
          </div>

          <p className="mt-4 text-xs text-neto-txt3">
            Sin tarjeta. El 50% aplica a tu primer mes (plan mensual) y vence 7 días después de registrarte.
          </p>
        </div>
      </section>

      <footer className="px-5 py-6 text-center text-xs text-neto-txt3">
        <Link href="/" className="hover:text-neto-txt2">
          neto.pe
        </Link>{" "}
        · Tu dinero, claro y en orden.
      </footer>
    </main>
  );
}
