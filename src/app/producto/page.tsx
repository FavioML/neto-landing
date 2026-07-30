"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import BrowserFrame from "@/components/landing/BrowserFrame";
import BlurReveal from "@/components/shared/BlurReveal";
import { waLink, trackCtaClick } from "@/lib/constants";

interface Row {
  eyebrow: string;
  title: React.ReactNode;
  desc: string;
  only?: boolean;
  bullets: string[];
  url: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

const ROWS: Row[] = [
  {
    eyebrow: "Tu salud financiera",
    title: (
      <>
        Un número que resume
        <br />
        tu mes: el Score.
      </>
    ),
    desc: "Del 0 al 100, tu Neto Score te dice cómo vas de verdad. Y te muestra qué lo sube y qué lo baja, factor por factor.",
    bullets: [
      "6 factores: registro, presupuesto, ahorro, planes, deudas y visibilidad",
      "Evolución mes a mes para ver si mejoras",
      "Único en Perú entre asistentes de WhatsApp",
    ],
    url: "app.neto.pe/dashboard/score",
    src: "/producto/score.jpg",
    alt: "Pantalla del Neto Score con puntaje 72 de 100 y desglose por factor",
    width: 1480,
    height: 2480,
  },
  {
    eyebrow: "Presupuestos",
    title: (
      <>
        Ponte límites.
        <br />
        Neto te avisa a tiempo.
      </>
    ),
    desc: "Define cuánto quieres gastar por categoría y mira en vivo cuánto llevas. Cuando te pasas, lo ves en rojo antes de que sea tarde.",
    bullets: [
      "Límite por categoría con barra de avance",
      "Alerta cuando excedes tu presupuesto",
      "Uso total del mes de un vistazo",
    ],
    url: "app.neto.pe/dashboard/presupuestos",
    src: "/producto/presupuestos.jpg",
    alt: "Pantalla de presupuestos por categoría con barras de avance y alertas cuando se excede el límite",
    width: 1504,
    height: 1840,
  },
  {
    eyebrow: "Transacciones",
    title: (
      <>
        Cada gasto,
        <br />
        categorizado con IA.
      </>
    ),
    desc: "Tu historial completo, ordenado por comercio, categoría y método. Busca, filtra y corrige en segundos. Neto aprende de cómo clasificas.",
    bullets: [
      "Categoría y subcategoría automáticas",
      "Filtros por tipo, categoría y método de pago",
      "Exporta a CSV o importa desde Excel",
    ],
    url: "app.neto.pe/dashboard/transacciones",
    src: "/producto/transacciones.jpg",
    alt: "Tabla de transacciones con comercio, categoría, método de pago y monto, categorizadas con IA",
    width: 1504,
    height: 1840,
  },
  {
    eyebrow: "Deudas y préstamos",
    title: (
      <>
        Lo que debes
        <br />
        y lo que te deben.
      </>
    ),
    desc: "Registra préstamos y cuotas, mira quién te debe y a quién le debes, y deja que Neto te recuerde cuándo cobrar y cuándo pagar.",
    only: true,
    bullets: [
      "Balance separado: lo que debes vs. te deben",
      "Avance de pago por deuda y recordatorios",
      "Agrupado por persona",
    ],
    url: "app.neto.pe/dashboard/deudas",
    src: "/producto/deudas.jpg",
    alt: "Pantalla de deudas mostrando lo que debes y lo que te deben, con avance de pago por deuda",
    width: 1504,
    height: 1840,
  },
];

export default function ProductoPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        {/* Hero */}
        <section className="relative px-6 pt-32 pb-16 min-[860px]:pt-40">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] -z-10 bg-neto-green/[0.07] blur-[140px] pointer-events-none"
            aria-hidden
          />
          <div className="max-w-5xl mx-auto text-center flex flex-col items-center">
            <BlurReveal>
              <span className="rounded-full border border-neto-green/30 bg-neto-green/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-neto-green uppercase">
                Así se ve por dentro
              </span>
            </BlurReveal>
            <BlurReveal delay={80}>
              <h1 className="mt-6 text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold tracking-tight leading-[1.08] text-neto-txt max-w-[880px]">
                Todo lo que registras por WhatsApp,{" "}
                <span className="text-neto-green-light">ordenado y claro.</span>
              </h1>
            </BlurReveal>
            <BlurReveal delay={160}>
              <p className="mt-6 text-lg text-neto-txt3 max-w-[560px] leading-relaxed">
                Tu dashboard web en app.neto.pe: no solo ves tus gastos, entiendes
                tu mes. Esto es producto real, no un render.
              </p>
            </BlurReveal>
            <BlurReveal delay={240}>
              <a
                href={waLink("hero")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCtaClick("hero", "Probar Neto (producto hero)")}
                className="mt-8 inline-block rounded-full bg-gradient-to-br from-neto-green-light to-neto-green text-[#002115] px-7 py-3.5 text-base font-semibold transition-all duration-200 hover:shadow-[0_0_40px_rgba(29,158,117,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Probar Neto en WhatsApp →
              </a>
            </BlurReveal>
            <div className="mt-14 w-full max-w-[960px]">
              <BrowserFrame
                url="app.neto.pe/dashboard"
                src="/producto/dashboard.jpg"
                alt="Dashboard de Neto en app.neto.pe con ingresos, gastos, ahorro, score y gastos por categoría"
                width={1888}
                height={1840}
                aspect="16 / 10"
                priority
              />
            </div>
          </div>
        </section>

        {/* Feature rows */}
        <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col gap-24">
          {ROWS.map((row, i) => {
            const mediaLeft = i % 2 === 1;
            return (
              <div
                key={row.url}
                className="grid grid-cols-1 min-[880px]:grid-cols-2 gap-8 min-[880px]:gap-14 items-center"
              >
                {/* Text */}
                <BlurReveal className={mediaLeft ? "min-[880px]:order-2" : ""}>
                  <div className="flex flex-col">
                    <span className="self-start rounded-full border border-neto-green/30 bg-neto-green/10 px-3.5 py-1 text-[11px] font-semibold tracking-wide text-neto-green uppercase">
                      {row.eyebrow}
                    </span>
                    <h2 className="mt-4 text-[clamp(1.7rem,3.6vw,2.5rem)] font-extrabold leading-[1.1] text-neto-txt">
                      {row.title}
                    </h2>
                    <p className="mt-4 text-neto-txt2 text-[16.5px] leading-relaxed max-w-[460px]">
                      {row.desc}
                    </p>
                    {row.only && (
                      <span className="self-start mt-4 text-[10.5px] font-bold tracking-[0.06em] uppercase text-neto-amber bg-neto-amber/[0.13] border border-neto-amber/[0.28] px-2.5 py-[3px] rounded-full">
                        Solo en Neto
                      </span>
                    )}
                    <ul className="mt-5 flex flex-col gap-2.5">
                      {row.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2.5 text-[14.5px] text-neto-txt2"
                        >
                          <span className="mt-0.5 w-[18px] h-[18px] shrink-0 rounded-full bg-neto-green/20 text-neto-green grid place-items-center text-[10px] font-extrabold">
                            ✓
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </BlurReveal>

                {/* Media */}
                <div className={mediaLeft ? "min-[880px]:order-1" : ""}>
                  <BrowserFrame
                    url={row.url}
                    src={row.src}
                    alt={row.alt}
                    width={row.width}
                    height={row.height}
                    aspect="4 / 3.1"
                  />
                </div>
              </div>
            );
          })}
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl min-[860px]:text-5xl font-extrabold tracking-tight leading-[1.1] text-neto-txt">
              Todo esto empieza
              <br />
              con un mensaje.
            </h2>
            <p className="mt-5 text-neto-txt3 text-lg">
              Escríbele a Neto por WhatsApp y tu dashboard se arma solo.
            </p>
            <a
              href={waLink("final")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCtaClick("final", "Probar Neto (producto final)")}
              className="mt-8 inline-block rounded-full bg-gradient-to-br from-neto-green-light to-neto-green text-[#002115] px-7 py-3.5 text-base font-semibold transition-all duration-200 hover:shadow-[0_0_40px_rgba(29,158,117,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Probar Neto en WhatsApp →
            </a>
            <p className="mt-4 text-xs text-neto-txt3">
              Setup en 2 min · Gratis · Sin contraseñas bancarias
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
