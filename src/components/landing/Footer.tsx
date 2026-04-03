import { WA_LINK, APP_URL } from "@/lib/constants";

const PRODUCT_LINKS = [
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Precios", href: "/#precios" },
  { label: "Dashboard", href: APP_URL },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
];

const CONTACT_LINKS = [
  { label: "hola@neto.pe", href: "mailto:hola@neto.pe" },
  { label: "WhatsApp", href: WA_LINK, target: "_blank" },
];

const LEGAL_LINKS = [
  { label: "Privacidad", href: "/privacidad" },
  { label: "Términos", href: "/terminos" },
];

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/neto_peru/",
    aria: "Instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/profile.php?id=61578664208419",
    aria: "Facebook",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@neto_peru",
    aria: "TikTok",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16z" />
      </svg>
    ),
  },
];

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-neto-txt3 mb-4">{title}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-neto-bg2 pt-16 pb-8">
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/neto-icon.png" alt="Neto" width={28} height={28} className="rounded-lg" />
              <span className="text-neto-green font-semibold text-lg tracking-tight">neto</span>
            </a>
            <p className="text-sm text-neto-txt3 leading-relaxed mb-5 max-w-[260px]">
              Somos un equipo peruano construyendo el asistente financiero que nos hubiera gustado
              tener.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.aria}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.aria}
                  className="w-8 h-8 rounded-full bg-neto-bg3 border border-white/10 flex items-center justify-center text-neto-txt2 hover:border-white/20 hover:text-neto-txt transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Producto */}
          <FooterCol title="Producto">
            {PRODUCT_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-neto-txt3 hover:text-neto-txt2 transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </FooterCol>

          {/* Col 3 — Contacto */}
          <FooterCol title="Contacto">
            {CONTACT_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target={l.target}
                rel={l.target === "_blank" ? "noopener noreferrer" : undefined}
                className="text-sm text-neto-txt3 hover:text-neto-txt2 transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </FooterCol>

          {/* Col 4 — Legal */}
          <FooterCol title="Legal">
            {LEGAL_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-neto-txt3 hover:text-neto-txt2 transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </FooterCol>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex justify-between flex-wrap gap-4">
          <p className="text-sm text-neto-txt3">
            © 2026 Neto · Lima, Perú · un producto de{" "}
            <a
              href="https://vortik.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neto-green hover:text-neto-green-light transition-colors duration-200"
            >
              Vortik
            </a>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/privacidad"
              className="text-sm text-neto-txt3 hover:text-neto-txt2 transition-colors duration-200"
            >
              Privacidad
            </a>
            <span className="text-neto-txt3 text-sm">|</span>
            <a
              href="/terminos"
              className="text-sm text-neto-txt3 hover:text-neto-txt2 transition-colors duration-200"
            >
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
