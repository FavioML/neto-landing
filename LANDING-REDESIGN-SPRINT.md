# Sprint: Implementación del rediseño de la landing (neto.pe)

> Handoff para sesión dedicada de Claude Code desde `C:\Vortik.dev\products\neto\landing`. El diseño ya está validado con Favio en 9 iteraciones de preview. Esto es traducir ese preview al código Next.js real. Contexto de negocio: memoria `project_neto_landing_redesign`.

## Objetivo

Simplificar la home de neto.pe de 13 secciones a **7**, con el Score como diferenciador protagonista, alineado al posicionamiento "entender > registrar". Más una **página de producto dedicada** (`/producto`) que muestra la webapp por dentro.

## El spec (fuente de verdad visual)

Los previews HTML validados están en `landing/.redesign-spec/` (fieles al design system, con el copy final):
- `home-preview.html` — la home rediseñada (7 secciones). **Este es el spec de copy + estructura + jerarquía.**
- `producto-preview.html` — la página `/producto` (tour de la webapp con capturas reales embebidas).
- `.jpg` — capturas reales de app.neto.pe usadas en los previews (son con data QA, se reemplazan por capturas de seed limpio, ver abajo).

Artifacts navegables (mismo contenido, renderizado): home `https://claude.ai/code/artifact/7e7eb014-9d18-4c0f-9915-e58f9901ee67`, producto `https://claude.ai/code/artifact/3f9a9211-6eda-4aa1-a39d-2d70692263bc`.

**Design system (Andean Obsidian):** ya está en `landing/src/app/globals.css` (@theme). Verde `#1D9E75` / green-light `#68dbae`, ámbar `#EF9F27`, fondos obsidiana `#0E0E0C`→bg6, texto `neto-txt/txt2/txt3`, Manrope (headings) + Inter (body). Usar los tokens Tailwind `neto-*` existentes. Ojo: la landing usa gradient-text en headings (parte del brand, mantener por consistencia; no aplicar el ban de gradient-text de otras skills aquí).

## Estado: Fases 1-3 HECHAS (local, typecheck limpio, NO desplegado)

- **Fase 1 · Navbar** (`src/components/landing/Navbar.tsx`): reescrito con dropdowns "Conoce a Neto" / "Planes" (precios visibles) / "Recursos" (links a páginas reales) + "Iniciar sesión" (→ app.neto.pe) + CTA WhatsApp. Mobile con menú plano.
- **Fase 2 · Hero** (`src/components/landing/Hero.tsx`): H1 "Entiende tu plata, no solo la anotes" + subtítulo nuevo. **Fix CASA en `ChatSimulator.tsx`**: el usuario escribe primero, se eliminó el "Registré tu gasto del BCP" proactivo.
- **Fase 3 · Reframe** (`src/components/landing/IntroBlock.tsx`): "No es que gastes mal. Es que nadie te dijo cuánto." + qué es Neto + perfiles. Conserva la capa `sr-only` de SEO. id `que-es`.

Anclas que el Navbar ya espera: `/#que-es` (✓ IntroBlock), `/#score` (falta), `/#features` (falta), `/#precios` (✓ Pricing ya tiene id="precios").

## Paso 0 (antes de la Fase 4): seed demo limpio + capturas de producción

Las capturas actuales usan el usuario QA con ruido ("QA-SENT Root", "Carlos Amigo"). Favio pidió **seed demo limpio** para producción.

1. Sembrar data curada y representativa (nombres/comercios peruanos realistas, montos coherentes) en una cuenta demo. Puede ser el QA Pro user (`ded7e219-...`, ver memoria `reference_neto_qa_test_user`) con su data reemplazada, o una cuenta demo dedicada. Limpieza: `delete from transacciones where usuario_id='...' and dedup_hash like 'qa%'` y re-seed. Usar Supabase MCP (execute_sql) o REST.
2. Re-correr los harness de captura (ya existen): `app/qa-e2e/shot-score.mjs` (pantalla Score) y `app/qa-e2e/shot-tour.mjs` (dashboard/presupuestos/transacciones/deudas). Loguean con el QA user vía password grant + cookie SSR forjada contra prod. Ver `SHOT_OUT=<dir> node shot-score.mjs`.
3. Optimizar los JPEG y ponerlos en `landing/public/` (ej. `public/producto/score.jpg`, etc.). La landing es static export → imágenes en `/public` se sirven directo. Reemplazan los data-URI embebidos del preview.

Nota CASA: los screenshots muestran nombres de banco como metadata del usuario ("BCP Débito", "Préstamo BCP"). **Favio decidió mantenerlos** (es data que el usuario tipeó, registro manual). No re-flaggear.

## Fases restantes

- **Fase 4 · Sección Score** (nuevo componente, ej. `ScoreSection.tsx`, id="score"): copy izquierda ("Un número que sí entiendes" + 6 factores + "Único en Perú") + captura real del Score a la derecha en un frame de navegador. Link "Ver todo el dashboard →" a `/producto`. Ver la sección Score de `home-preview.html`.
- **Fase 5 · Bento de features** (id="features"): fusionar en UNO los 4 componentes actuales `FugasSection` + `BentoShowcase` + `EspaciosSection` + `DebtSection`, más una tira compacta de 3 pasos ("cómo funciona" fundido). Celdas: Detector de fugas, Espacios compartidos, Deudas (badge "Solo en Neto"), Metas y presupuestos, Dashboard y reportes. Ver `home-preview.html`.
- **Fase 6 · Confianza fusionada** (ej. `TrustSection.tsx`): fusionar `GmailTrust` (nombre de archivo residual, contenido es Q&A de confianza) + `Security` en una sola sección "Simple y seguro". Va DESPUÉS de Pricing (cierra objeciones antes del CTA final).
- **Fase 7 · Pricing** (`Pricing.tsx`): agrupar las 14 features. Free = lista corta; Pro = "Todo lo de Gratis, y además:" con las exclusivas. Mantener toggle mensual/anual, precio fundador, ROI callout, referral. NO agregar "lectura de correos" (CASA, ver abajo).
- **Fase 8 · Ensamblaje**:
  - `src/app/page.tsx`: nuevo orden → Hero, IntroBlock(reframe), ScoreSection, FeaturesSection, Pricing, TrustSection, FinalCTA. **Quitar** de la página: `BankTicker` (CASA, logos de banco), `HowItWorks` (fundido en features), `Testimonials` (vuelve cuando haya testimonios reales con consentimiento). Mantener Footer, StickyCTA, ExitIntent.
  - Nueva página `src/app/producto/page.tsx` (+ layout con metadata SEO): tour de la webapp según `producto-preview.html`, con las capturas de seed limpio desde `/public`. Enlazada desde el Navbar ("Ver la webapp") y desde la sección Score.
  - Actualizar JSON-LD si aplica (el `page.tsx` tiene Organization/WebSite/SoftwareApplication).

## Restricción CASA (crítica, no negociable)

- NADA de "lee tus correos / notificaciones bancarias / Gmail / email parser" en ninguna parte (hasta certificación CASA ~$540). Esto incluye NO poner "Lectura automática de correos" como feature de Pro, aunque sea tentador como diferenciador. Riesgo: verificación OAuth de Google + publicidad engañosa Indecopi.
- NO tira de logos de bancos (insinúa integración). Por eso se quita `BankTicker`.
- El ChatSimulator ya está corregido (usuario escribe primero).

## Selector de canal (WhatsApp vs app): NO implementar aún

El preview mockea un modal "¿Cómo prefieres empezar?" (WhatsApp / app). **No va a producción todavía**: la webapp hoy no permite onboarding sin WhatsApp (ver `ONBOARDING-WEB-SPRINT.md` y memoria del user_identity_model). Para esta implementación, los CTA "Probar Neto" van directo a WhatsApp (`waLink`). El selector se activa cuando exista el onboarding web-independiente.

## Verificación (obligatoria antes de dar por cerrado)

- `npx tsc --noEmit` y `npm run build` (static export a `out/`) sin errores.
- Deploy: Cloudflare Pages proyecto "neto-site", auto-deploy on push (root `landing/`, watch `landing/**`). A veces Cloudflare skipea deploys → verificar con CF API si no aparece.
- Post-deploy: `curl -I https://neto.pe/` (200) y revisar la home + `/producto` en el browser real (no solo build local: el preview local puede servir contenido viejo). Verificar dropdowns, anclas, CTAs a WhatsApp, y que NO haya mención de correos/bancos.
- Un push a la landing dispara solo Cloudflare (no Railway/Vercel). Aún así, buena práctica: `curl -I https://app.neto.pe/` y `https://api.neto.pe/health` no deberían verse afectados.

## Convenciones

- Commits en inglés con prefijo. Push directo (flujo normal Neto). El hook PostToolUse recuerda el curl post-push.
- TypeScript estricto. Componentes en kebab/PascalCase como los existentes. UTF-8 sin BOM.
- Al terminar: actualizar memoria `project_neto_landing_redesign` (marcar SHIPPED con commit) y este archivo puede borrarse.
