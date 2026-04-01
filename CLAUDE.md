# Neto Landing — neto.pe

Landing page y blog de Neto. Static export desplegado en Cloudflare Pages.

## Stack
- Next.js 16 (static export, output: "export")
- React 19 + TypeScript + Tailwind CSS
- Framer Motion para animaciones
- jsPDF + html-to-image para reportes compartibles

## Comandos
```bash
npm run dev     # Dev server con Turbopack
npm run build   # Static export a out/
```

## Arquitectura
```
src/
├── app/          Pages (Next.js App Router)
│   ├── page.tsx          Homepage/landing
│   ├── blog/             Posts SEO
│   ├── contacto/         Formulario de contacto
│   ├── faq/              Preguntas frecuentes
│   ├── mi-reporte/       Reporte compartible
│   ├── privacidad/       Politica de privacidad
│   └── terminos/         Terminos de servicio
├── components/   Componentes React reutilizables
├── hooks/        Custom hooks
├── lib/          Utilidades
└── types/        TypeScript types
```

## Deploy
- Cloudflare Pages: proyecto "neto-site"
- Account ID: f5b742b797b7a03b8d25140bb9c3594f
- Auto-deploy on push (root directory: "landing/", watch paths: "landing/**")
- A veces Cloudflare skipea deploys — verificar con API si no aparece

## SEO y Tracking
- Google Search Console: verificado, sitemap enviado
- Google Analytics 4: G-6M907HW1YM
- Meta Pixel: 1510666681068015
- Google Ads tag: AW-8115117081
- JSON-LD: Organization, WebSite, FAQPage, BreadcrumbList
- Meta tags, canonicals, hreflang en todas las paginas

## Convenciones
- Componentes React con TypeScript
- Static export — no server-side features (no API routes en prod)
- Imagenes optimizadas en public/
- Blog posts para SEO (comparativos, educativos)
