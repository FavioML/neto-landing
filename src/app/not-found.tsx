import Link from 'next/link';
import type { Metadata } from 'next';

/**
 * 404 de la landing (hallazgo F14 de la auditoría CTO del 2026-08-10).
 *
 * Sin este archivo, Next sirve su 404 por defecto: fondo blanco, Inter, "This page could not
 * be found". En un sitio dark-only eso no se lee como una página que no existe, se lee como
 * que el sitio se rompió — y la landing es la superficie de conversión, así que el que llega
 * ahí llegó por un link viejo de un blog o de un DM y todavía se puede recuperar.
 *
 * Sin `'use client'` a propósito: no hay estado ni evento, así que se prerenderiza estático y
 * lo sirve el CDN de Cloudflare Pages sin JS. Es el mismo criterio del resto de las páginas
 * de contenido de este proyecto.
 */

export const metadata: Metadata = {
  title: 'Página no encontrada · Neto',
  // `noindex` no es decorativo: sin él Google puede indexar la 404 como una página más y
  // servirla en resultados por consultas de marca.
  robots: { index: false, follow: true },
};

const DESTINOS = [
  { href: '/', label: 'Inicio' },
  { href: '/producto', label: 'Cómo funciona' },
  { href: '/faq', label: 'Preguntas frecuentes' },
  { href: '/blog', label: 'Blog' },
];

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neto-bg px-6 py-24 text-center">
      <p className="text-sm font-semibold tracking-widest text-neto-green">404</p>
      <h1 className="mt-4 text-3xl font-bold text-neto-txt sm:text-4xl">
        Esta página no existe
      </h1>
      <p className="mt-4 max-w-md text-neto-txt3">
        Puede que el enlace esté viejo o que la dirección tenga un error. Tus datos en Neto no
        tienen nada que ver con esto y siguen donde estaban.
      </p>

      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neto-green to-neto-green-dark px-6 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
      >
        Volver al inicio
      </Link>

      <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-neto-txt2">
        {DESTINOS.map((d) => (
          <Link key={d.href} href={d.href} className="hover:text-neto-txt transition-colors">
            {d.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
