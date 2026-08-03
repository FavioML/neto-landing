"use client";
import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

import { APP_URL } from "@/lib/constants";
import StartButton from "./StartButton";
const DASHBOARD_URL = APP_URL;

/* ─── Mega-menu data ─── */
const CONOCE = [
  { label: "¿Qué es Neto?", desc: "Tu asistente financiero en WhatsApp", href: "/#que-es" },
  { label: "El Score", desc: "Tu salud financiera en un número", href: "/#score" },
  { label: "Cómo funciona", desc: "Registra, entiende y ahorra", href: "/#features" },
  { label: "Ver la webapp", desc: "Recorre el dashboard por dentro", href: "/producto" },
  { label: "Preguntas frecuentes", desc: "Resolvemos tus dudas", href: "/faq" },
];

const RECURSOS = [
  { label: "Cómo funciona", href: "/como-funciona" },
  { label: "Qué es el Score", href: "/score-financiero" },
  { label: "Comparativa de apps", href: "/comparativas/apps-finanzas-peru" },
  { label: "Blog", href: "/blog" },
  { label: "Preguntas frecuentes", href: "/faq" },
];

/* Desktop dropdown shell — opens on hover and keyboard focus */
function Dropdown({
  label,
  width = "w-[300px]",
  children,
}: {
  label: string;
  width?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1 text-sm text-neto-txt2 group-hover:text-neto-txt group-focus-within:text-neto-txt transition-colors duration-200"
        aria-haspopup="true"
      >
        {label}
        <ChevronDown
          size={14}
          className="text-neto-txt3 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
          aria-hidden
        />
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-200">
        <div
          className={`${width} bg-neto-bg2 border border-white/10 rounded-2xl p-2 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-neto-bg/80 backdrop-blur-xl border-b border-white/5 shadow-[0_1px_0_rgba(255,255,255,0.05)]"
          : "bg-transparent"
      }`}
      aria-label="Navegación principal"
    >
      <div className="mx-auto max-w-[1200px] px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/neto-icon.png" alt="Neto" width={28} height={28} className="rounded-lg" />
          <span className="text-neto-green font-semibold text-lg tracking-tight">neto</span>
        </a>

        {/* Desktop */}
        <div className="hidden min-[860px]:flex items-center gap-7">
          {/* Conoce a Neto */}
          <Dropdown label="Conoce a Neto">
            {CONOCE.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block rounded-xl px-3.5 py-3 hover:bg-neto-bg3 transition-colors duration-150"
              >
                <span className="block text-sm font-semibold text-neto-txt">{item.label}</span>
                <span className="block text-xs text-neto-txt3 leading-snug mt-0.5">{item.desc}</span>
              </a>
            ))}
          </Dropdown>

          {/* Planes */}
          <Dropdown label="Planes">
            <a
              href="/#precios"
              className="block rounded-xl px-3.5 py-3 hover:bg-neto-bg3 transition-colors duration-150"
            >
              <span className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neto-txt">Siempre gratis</span>
                <span className="text-sm font-semibold text-neto-txt2">S/0</span>
              </span>
              <span className="block text-xs text-neto-txt3 leading-snug mt-0.5">
                Anota tus gastos por WhatsApp, sin límite
              </span>
            </a>
            <a
              href="/#precios"
              className="block rounded-xl px-3.5 py-3 hover:bg-neto-bg3 transition-colors duration-150"
            >
              <span className="flex items-center justify-between">
                <span className="text-sm font-semibold text-neto-txt inline-flex items-center gap-2">
                  Pro
                  <span className="text-[9px] font-bold tracking-wide text-[#2a1a00] bg-neto-amber px-1.5 py-0.5 rounded-full">
                    FUNDADOR
                  </span>
                </span>
                <span className="text-sm font-semibold text-neto-amber">S/10/mes</span>
              </span>
              <span className="block text-xs text-neto-txt3 leading-snug mt-0.5">
                14 días gratis. Dashboard, score, historial y reportes
              </span>
            </a>
            <a
              href="/#precios"
              className="block text-center text-sm font-semibold text-neto-green-light hover:text-neto-green py-2.5 mt-1 border-t border-white/5"
            >
              Ver comparación completa →
            </a>
          </Dropdown>

          {/* Recursos */}
          <Dropdown label="Recursos" width="w-[220px]">
            {RECURSOS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block rounded-lg px-3.5 py-2.5 text-sm text-neto-txt2 hover:bg-neto-bg3 hover:text-neto-txt transition-colors duration-150"
              >
                {item.label}
              </a>
            ))}
          </Dropdown>

          <a
            href={DASHBOARD_URL}
            className="text-sm font-medium text-neto-txt2 hover:text-neto-txt transition-colors duration-200"
          >
            Iniciar sesión
          </a>
          <StartButton
            source="navbar"
            className="rounded-full bg-neto-green px-5 py-2 text-sm font-medium text-white hover:bg-neto-green-dark transition-colors duration-200"
          >
            Empezar gratis
          </StartButton>
        </div>

        {/* Mobile toggle */}
        <button
          className="min-[860px]:hidden text-neto-txt2 hover:text-neto-txt"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="min-[860px]:hidden bg-neto-bg2 border-b border-white/5 px-6 py-6 flex flex-col gap-1">
          {[
            { label: "El Score", href: "/#score" },
            { label: "Cómo funciona", href: "/#features" },
            { label: "Precios", href: "/#precios" },
            { label: "Ver la webapp", href: "/producto" },
            { label: "Blog", href: "/blog" },
            { label: "Preguntas frecuentes", href: "/faq" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm text-neto-txt2 hover:text-neto-txt transition-colors duration-200 py-2"
            >
              {l.label}
            </a>
          ))}
          <a
            href={DASHBOARD_URL}
            className="text-sm font-medium text-neto-txt2 text-center mt-2 py-2"
          >
            Iniciar sesión
          </a>
          <StartButton
            source="navbar"
            onClick={() => setOpen(false)}
            className="rounded-full bg-neto-green px-5 py-2.5 text-sm font-medium text-white text-center hover:bg-neto-green-dark transition-colors duration-200 mt-1"
          >
            Empezar gratis
          </StartButton>
        </div>
      )}
    </nav>
  );
}
