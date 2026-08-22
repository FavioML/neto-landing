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

## Core Web Vitals: el dato de campo sale del RUM propio, no de CrUX

Los umbrales (`LCP 2500 / INP 200 / CLS 0.1`) viven en `.claude/deploy-config.json` y
desde el 03-ago-2026 hasta el 22-ago-2026 **no los evaluó nadie**: el canary los medía
contra CrUX, que no publica agregado de campo para neto.pe por tráfico insuficiente. No
era un bug del canary — era una espera sin fecha.

La fuente de campo es el evento `$web_vitals` de PostHog, que **ya se estaba capturando**
sin que nadie lo hubiera declarado ni mirado. Hoy está fijado en `src/app/layout.tsx`
(`capture_performance: { web_vitals: true }`) para que no dependa de un toggle en una
consola ajena, que se apaga sin dejar diff.

```bash
npm run probe:rum                    # ¿la landing sigue reportando vitals? (navegador real)
npm run measure:cwv -- --n=5         # laboratorio con MEDIANAS, informativo, no alarma
node C:/Vortik.dev/tools/canary-cwv/check-cwv-rum.mjs .claude/deploy-config.json
```

Tres cosas que cuestan una tarde si se re-descubren:

- **PSI cachea.** Cinco llamadas seguidas a la misma URL devuelven el mismo resultado byte
  por byte. `measure-cwv-lab.mjs` mete un `?cwv=<n>` distinto por corrida; sin eso, una
  "mediana de 5" puede ser una sola medición repetida cinco veces.
- **Las dos métricas son ruidosas, y cuál más cambia entre tandas.** Cuatro tandas del
  22-ago contra la misma build: dos dieron el score mucho más disperso que el LCP (16 pts vs
  150ms) y dos lo dieron al revés (5 pts vs 675ms). Con una tanda no se puede concluir cuál
  es más estable — este archivo llegó a afirmar que sí, y la afirmación duró una tarde. La
  regla que sobrevive: **comparar sólo dentro de la misma tanda** (antes/después, mismo
  rato), **reportar la dispersión al lado de la mediana**, y tratar como ruido cualquier
  diferencia que no supere la dispersión de su propia tanda. Los valores absolutos se corren
  con la hora del día: el LCP de una corrida fue de 2551 a 3302 el mismo día.
- **PostHog descarta el tráfico automatizado** (mira `navigator.webdriver` *y*
  `userAgentData.brands`), y manda el cuerpo del evento **gzippeado**. Las tres cosas
  juntas hacen que un probe ingenuo reporte "no reporta" contra una landing que reporta
  bien. `probe-rum-vitals.mjs` las tiene resueltas y explicadas.

`measure-cwv-lab.mjs` NO va al canary a propósito: mide lo que se rompe **con** commit.
`probe-rum-vitals.mjs` y `check-cwv-rum.mjs` sí van — se rompen sin commit.

## Deploy & monitoring
- Config: `.claude/deploy-config.json` (Cloudflare Pages neto-landing, CWV thresholds, canary checks).
- Daily canary 10am Lima vía scheduled task `canary-daily-deploys`. Reporte solo si hay fallo en `C:/Vortik.dev/memory/canary/`.
- Verificación manual post-push: `curl -I https://neto.pe/`. Cloudflare a veces skipea deploys — verificar con CF API si no aparece.
