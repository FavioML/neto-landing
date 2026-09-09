# GEO Baseline — neto.pe + app.neto.pe

**Fecha:** 2026-08-02
**Estado:** CORRIDA PERDIDA
**Escrito el:** 2026-09-09, cinco semanas después de la corrida que debía producirlo.

---

## Qué pasó

La tarea programada `geo-baseline-neto-quarterly` disparó el 2026-08-02 a las 15:10:21 UTC. El
registro del scheduler lo confirma (`lastRunAt`). Su paso 7 mandaba escribir este archivo, y no lo
escribió: hasta el 2026-09-09 el único baseline en `docs/` era el inicial de mayo.

**Los datos de ese día ya no se pueden reconstruir.** El GEO Readiness Score se calcula sobre el
estado de robots.txt, llms.txt y las respuestas que daban ChatGPT, Perplexity y Google AI Overviews
en ese momento. Nada de eso queda registrado en ninguna parte, así que inventar un score hoy sería
fabricar el dato en vez de admitir que se perdió. Por eso este archivo declara la corrida perdida en
lugar de traer números.

Lo que sí se sabe es que la ausencia se iba a auto-ocultar: el paso 1 lee "el baseline más reciente",
así que la corrida de noviembre habría leído el de mayo y comparado contra él como si no faltara
nada. El hueco se habría borrado solo.

## Por qué falló, y qué se cambió

El diagnóstico completo está en el encabezado de `scripts/check-geo-baseline.mjs`. En corto: el paso
7 estaba escrito y nada comprobaba su efecto, y el paso 9 reporta un resumen al usuario que puede
salir aunque el 7 no haya escrito nada, así que la corrida se veía exitosa desde afuera.

El arreglo no es una nota, es un `exit 1` probado por mutación. `check-geo-baseline.mjs` deriva qué
baselines deberían existir y falla nombrando los que falten. La tarea lo corre dos veces: como paso 0
antes de trabajar, y como paso final después de escribir. Un archivo que no quedó en disco ahora
rompe la corrida en vez de pasar desapercibido.

## Lo que se midió el 2026-09-09 y sirve de puente hasta noviembre

Esto no reemplaza el baseline de agosto. Se anota acá porque es lo más cercano en el tiempo que
existe, y porque la comparativa de noviembre necesita algo contra qué mirar.

Tráfico real de motores de IA hacia neto.pe, leído de PostHog (proyecto 365696, evento `$pageview`,
sesiones únicas):

| Motor | Sesiones en 90 días | Tendencia mensual |
|---|---|---|
| chatgpt.com | 23 | 5 (may), 4 (jun), 4 (jul), 9 (ago), 6 (1-9 sep) |
| gemini.google.com | 5 | 1 (jun), 3 (ago), 1 (sep) |
| copilot.microsoft.com | 1 | 1 (may) |
| perplexity.ai | 0 | sin registros en 12 meses |

Tres lecturas que la corrida de noviembre debería retomar:

1. ChatGPT es la tercera fuente de tráfico del sitio, detrás de directo y de Google. La citación en
   ChatGPT no es una hipótesis: está ocurriendo y trae gente. Falta saber para qué consultas y
   citando qué URL, que es justo lo que el paso 5 mide y lo que se perdió en agosto.
2. Perplexity está en cero absoluto mientras ChatGPT manda 23 sesiones. Hay que separar tres causas
   posibles antes de concluir: bloqueo de `PerplexityBot`, ausencia de citación, o simplemente menos
   uso en Perú. El baseline de mayo le daba 70/100, el score más alto de las cinco plataformas, así
   que la brecha entre ese score y el tráfico real es en sí un hallazgo.
3. El baseline de mayo marcaba como crítico que GPTBot, ClaudeBot y Google-Extended estaban
   bloqueados por Cloudflare AI Audit. El CLAUDE.md del workspace registra que ese bloqueo se
   levantó. Que ChatGPT y Gemini estén mandando tráfico es consistente con eso, pero hay que
   verificarlo contra el `robots.txt` vivo y no darlo por hecho.

## Para la corrida de noviembre

- El fix marcado como crítico en mayo (bots de IA bloqueados) aparenta estar resuelto. Verificar, no
  asumir, y marcarlo en la comparativa.
- La serie de baselines tiene un hueco declarado acá. El delta de noviembre se calcula contra mayo,
  no contra agosto, y hay que decirlo explícitamente en vez de presentar un delta de seis meses como
  si fuera trimestral.
- Los números de PostHog de arriba dan una línea de base de tráfico que el baseline de mayo no tenía.
  Conviene incorporar esa medición al formato: un score de citability sin tráfico observado al lado
  es una estimación que nadie contrasta.
