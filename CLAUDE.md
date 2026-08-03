# Neto Landing — neto.pe

Landing page y blog de Neto. Static export desplegado en Cloudflare Pages.

## Stack
- Next.js 16 (static export, output: "export")
- React 19 + TypeScript + Tailwind CSS
- Framer Motion para animaciones

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
│   ├── privacidad/       Politica de privacidad
│   └── terminos/         Terminos de servicio
├── components/   Componentes React reutilizables
├── hooks/        Custom hooks
├── lib/          Utilidades
└── types/        TypeScript types
```

## Deploy
- Cloudflare Pages: proyecto "neto-landing"
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

## El hero es una afirmacion sobre el producto

`ChatSimulator.tsx` reproduce respuestas reales del bot. Cada burbuja de Neto sale
literal de una plantilla del backend (`neto/app`), citada en el comentario de `MESSAGES`:
`handlers/intents/transacciones.js:228`, `handlers/webhook.js:203`, y
`lib/formatters.js:32-36` + `handlers/intents/gastos.js:74-81`.

Se desactualiza en silencio cuando cambian los handlers — ya paso: el hero mostro
durante meses un Neto conversacional que opinaba solo. **Todo lo que Neto opina
(resumen semanal, fugas, score) es un cron agendado, nunca una respuesta inmediata.**
El canal es texto plano: `lib/whatsapp.js` solo manda `type:'text'` o `type:'template'`,
asi que el simulador no puede dibujar botones.

Guard: `scripts/verify-hero.mjs` fija las tres burbujas caracter por caracter en un
navegador real, y chequea que el total del MiniDashboard coincida con el que el propio
chat reporta. Ojo: el guion vive en el bundle JS, no en el HTML — un grep sobre
`index.html` da 0 aunque el deploy este bien.

```bash
npm run build && npx serve out -l 4321 -s
node scripts/verify-hero.mjs http://localhost:4321/
```

## Deploy & monitoring
- Config: `.claude/deploy-config.json` (Cloudflare Pages neto-landing, CWV thresholds, canary checks).
- Daily canary 10am Lima vía scheduled task `canary-daily-deploys`. Reporte solo si hay fallo en `C:/Vortik.dev/memory/canary/`.
- Verificación manual post-push: `curl -I https://neto.pe/`. Cloudflare a veces skipea deploys — verificar con CF API si no aparece.
