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

## El blog tiene molde, y un chequeo que lo hace cumplir

Desde el 12-sep-2026 un post nuevo se arma con los bloques de `src/lib/blog-bloques.ts` (En corto,
tabla, barras, chat de Neto, nota) siguiendo `docs/molde-blog.md`, que es la fuente de verdad de la
forma: orden, umbrales y qué tendría que bloquear una rutina automática. El chat de Neto no acepta
texto libre: toma una clave de `src/lib/respuestas-bot.json`, y el chequeo coteja cada plantilla
contra `../app`.

```bash
npm run build && npm run check:blog   # exit 1 no se publica; exit 2 (sin ../app, sin out/) tampoco
```

Los posts sin migrar van en `LEGADO` dentro del script, con su motivo. **No mutes el HTML de `out/`
para probar el chequeo:** React reescribe el cuerpo del post desde su payload al hidratar, así que la
mutación desaparece del DOM a los pocos segundos y el chequeo parece ciego cuando no lo está. Se muta
el fuente y se reconstruye (detalle en la sección 10 del doc).

## La atribución cruza el salto, y es un contrato con OTRO repo

Hasta el 2026-09-09 la landing tiraba el UTM al saltar: los CTA eran `href="https://app.neto.pe"`
pelado y `wa.me/...?text=...[hero]`. Medido contra PostHog, de 2898 pageviews de app.neto.pe en 90
días **10 traían `utm_` (0,3%)**, y esos 10 eran links directos, no propagación. Ninguna de las 48
altas de agosto tenía canal.

Hoy `src/lib/atribucion.ts` resuelve el origen de cada visita y `src/hooks/useAtribucion.ts` lo pega
a los dos destinos, cada uno por su vía:

| destino | cómo viaja | quién lo lee |
|---|---|---|
| `app.neto.pe` | query string (`utm_source=ig&utm_medium=bio`) | PostHog, del otro lado del salto |
| `wa.me` | DENTRO del texto: `[hero]` pasa a `[hero\|ig]` | `app/lib/atribucion.js` → `usuarios.origen` |

**La segunda fila es el punto de todo esto.** El alta de Neto ocurre en WhatsApp, no en la web, así
que ese mensaje es el único lugar donde una sesión de esta landing toca un alta.

**Todo link a WhatsApp de la landing lleva su POSICIÓN real, no `[hero]`** (10-sep-2026, Acción 5 del
audit). Hasta ese día existía un `WA_LINK` fijo con `[hero]` que usaban el footer y el cuerpo del
blog, así que un clic desde un post llegaba al backend como si fuera del hero y sin origen. Ya no
existe. Tres vías, según de dónde salga el link:

| el link vive en | cómo se atribuye |
|---|---|
| JSX (CTA, navbar, modal) | `useCtaHrefs(posicion)` |
| un server component (footer) | `<WaLink posicion>` / `<AppLink>` |
| un STRING de HTML (cuerpo del blog, respuestas de la FAQ) | `waLink('blog')` en el string + `<HtmlAtribuido>`, que reescribe los `href` en el DOM después de montar |

Y `/r` (referidos) deriva el origen `referido` de la PÁGINA: el `302 /r/CODE → /r?ref=CODE` de
`_redirects` tira el query string entrante, así que un UTM pegado al link de referido no llega nunca.
El texto de referido pasa a `Hola NETO ref:CODE [referido|<origen>]`, con la etiqueta DETRÁS porque
el regex de referidos del backend ancla solo el inicio. El vocabulario de `utm_source` y las
posiciones válidas viven en el `CLAUDE.md` de `products/neto/`, que es el que cruza los dos repos.

Tres cosas que cuestan una tarde si se re-descubren:

- **Static export, o sea que se resuelve en cliente.** El HTML sale del build, igual para todos
  (`curl https://neto.pe/` devuelve los `[hero]` horneados). Por lo mismo **no puede calcularse
  durante el render**: el HTML del build no tiene query string y el del navegador sí, y React lo
  trataría como mismatch de hidratación. El hook devuelve el link PELADO hasta que monta, que de
  paso es el comportamiento correcto sin JS.
- **`<Link>` de Next tira el query string.** Por eso la captura se persiste en `sessionStorage` en
  el primer pageview. Es la mitad del problema que un `curl` no puede ver, y la que se rompió
  primero cuando se escribió esto.
- **El contrato con el backend es el FORMATO DEL CORCHETE y nada más.** Se eligió no anclar el
  parser sobre la frase ("Hola Neto, quiero empezar") a propósito: ataría la atribución al copy de
  este repo, y un cambio de copy acá no puede poner rojo el CI de `app/`. Si cambiás el separador o
  el juego de caracteres, el que se rompe es `app/lib/atribucion.js`, y su test vive allá.

```bash
npm run build && npx serve out -l 4321 -s
npm run verify:atribucion -- http://127.0.0.1:4321/   # los 8 casos (salto, referido, blog, faq), navegador real
npm run verify:atribucion                             # contra PRODUCCIÓN
npm run probe:atribucion                              # los dos números del audit, a 30 días
```

**Ninguno de los dos va al canary, y por motivos distintos.** `verify-atribucion.mjs` se rompe
**con** commit —el copy y los hooks viven en este repo— así que su lugar es antes de publicar, al
lado de `verify:claims` y `verify:hero`; en el canary serían ~60s de Chromium diarios sin señal
nueva, que es el mismo argumento por el que `measure-cwv-lab.mjs` tampoco está. Un deploy a medias
de Cloudflare ya lo agarra `probe-deploy-fresh`. Y `probe-atribucion.mjs` es un instrumento de
MEDICIÓN, no un guard: sus dos números dependen de tráfico real y nunca da PASS/FAIL.

**Lo que NINGUNO de los dos cubre, y conviene saberlo:** que el backend siga parseando el formato.
Ese lado vive en otro repositorio y su CI no hace checkout de éste, así que la forma del corchete
está fijada **dos veces a propósito** —acá en los casos de `verify-atribucion.mjs`, allá en
`app/tests/lib/atribucion.test.js`— igual que las reglas de `verify-claims.mjs` y su hermano de la
webapp. Al cambiar el formato hay que tocar los dos; si sólo se toca uno, lo que se rompe no es un
test: son las altas, en silencio. Desde el 10-sep hay además un tercero que mira el backend
DESPLEGADO: `app/qa-e2e/qa-atribucion-wa.mjs` manda por el webhook firmado los textos que esta
landing reparte y lee `usuarios.origen`. Corrélo al tocar un texto o una posición.

Al tocarlo, lo que hay que saber: el caso 4 del verificador (navegación interna) es el único que un
`curl` no alcanza, y **el gate de hidratación son dos esperas, no una** — React pega sus props
ANTES de correr los efectos, así que esperar sólo la prop navega antes de que se guarde nada y
reporta una pérdida de UTM que no existe. Medido: a 0 ms la prop está y el `sessionStorage` es
`null`; a 200 ms están los dos.

## Core Web Vitals: el dato de campo sale del RUM propio, no de CrUX

Los umbrales viven en `.claude/deploy-config.json` — ahí se leen, acá no se copian — y
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
- **Las sondas no cuentan como tráfico** (11-sep-2026). PageSpeed ya no manda `Chrome-Lighthouse`
  y el filtro de bots de PostHog lo deja pasar: el `?cwv=`, el `?det=` y el canary diario (sin
  query, UA de Lighthouse) entraban a `$direct` y al RUM. `layout.tsx` los descarta en
  `before_send`; el porqué y lo que no alcanza a separar están ahí. Un cache-buster nuevo tiene
  que usar uno de esos dos nombres, o vuelve a contarse como visita.
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
