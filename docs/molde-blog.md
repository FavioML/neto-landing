# Molde de un post del blog de neto.pe

**Qué gobierna.** La forma de `/blog/<slug>`: qué bloques lleva, en qué orden, con qué componente
se dibuja cada uno, cuánto puede pesar el texto y qué chequeo lo comprueba. **Qué NO gobierna:** la
sustancia. Lo que un post dice de Neto sale del código de `app/` a la fecha de escribirlo; una cifra
de terceros lleva fuente y fecha de consulta o no se publica; y lo que el copy puede prometer lo
decide `scripts/verify-claims.mjs`. Si este documento y esas reglas chocan, mandan ellas.

**Estado: VIGENTE desde el 12-sep-2026.** Favio aprobó la anatomía y los cinco componentes ese día,
y los dos posts de la Acción 3 (`cuanto-cuesta-app-finanzas-personales-peru` y
`controlar-gastos-yape-plin`) se migraron al molde. Los cinco de marzo siguen fuera, declarados en
`LEGADO` dentro de `scripts/check-blog.mjs`. Lo que cambió al construir respecto de la propuesta está
marcado en cada sección, y el resultado medido está en la sección 10.

```bash
npm run build && npm run check:blog              # sobre out/, con servidor propio
node scripts/check-blog.mjs --base=https://neto.pe   # contra producción, después del deploy
```

---

## 1. Por qué existe

Los siete posts eran texto corrido. Medido el 12-sep-2026 en producción, a 375 px de ancho:
`/blog/cuanto-cuesta-app-finanzas-personales-peru` tenía **824 palabras, cero elementos visuales
(las 824 antes del primero) y 7.493 px de alto**. La información era correcta y trazable; lo que no
tenía era un punto de entrada para quien la abre en un celular.

El segundo motivo es la automatización. Una rutina que escriba posts sola (como
`vortik-content-weekly` en vortik.dev) necesita una forma que se pueda comprobar con un `exit 1`,
porque nadie va a revisar a ojo cada pieza. Un molde que solo vive en prosa no lo ejecuta nadie.

---

## 2. Lo que se midió antes de decidir (12-sep-2026)

Veintitrés artículos de nueve sitios, leídos por agentes en paralelo y, donde el resumen del agente
no alcanzaba, contados en el DOM real con un navegador. Informes completos en el scratchpad de la
sesión; lo que sigue es lo que decide algo.

| Sitio | Arriba | Tablas | Gráficos de datos | Producto | Fuentes y fecha |
|---|---|---|---|---|---|
| NerdWallet (3) | sin caja de resumen | 1 de 3, ejemplo trabajado | **0** (DOM: las 22 `<figure>` son fotos de autores y miniaturas de Getty) | arte de su app | "Updated", fact-checked, notas numeradas |
| Wise (3) | sin resumen | 3 de 3, HTML, hasta 18 filas (DOM: 3 tablas en una sola página) | **0** | imágenes genéricas | "sources checked [fecha]", tiempo de lectura siempre |
| Monzo (3, de 2018-19) | sin resumen | 0 | **0** | 4 capturas reales con pie, en el post de producto | fecha de publicación y aviso de "puede estar desactualizado" |
| Fintual (3) | sin resumen; en uno la tabla hace de resumen | 1 de 3 | **0** | 0 | links inline, autor y fecha |
| YNAB (4) | Key Takeaways de 3 puntos en 1 de 4 | 1 de 4 | **0** (sus SVG son ilustración) | 5 capturas reales en 1 | autor y fecha solo en el blog |
| BCP, Interbank, BBVA, Scotiabank | sin resumen | 0 editoriales | **0** | capturas en 2 de 7 | casi nunca autor, fecha o fuente |
| Kuanto | `kuanto.pe` no resuelve: no hay blog que medir | | | | |

Tres conclusiones, y la primera va contra lo que se pidió al abrir este trabajo:

1. **Los gráficos de datos no aparecen en este tipo de contenido: cero en veintitrés.** Lo que
   hace el trabajo visual es la tabla HTML y el producto mostrado. Por eso acá el gráfico es un
   bloque opcional con condición de entrada (sección 4), no una casilla que todo post tiene que
   llenar. Un gráfico metido para cumplir es una tabla peor.
2. **La caja de resumen arriba es rara (1 de 23) y ninguna fuente primaria dice que mejore la
   citación en Google o en un motor de IA.** Va igual, por otro motivo, y así se declara: es la
   regla de la respuesta corta (la cifra en las primeras palabras) vuelta bloque visual, y le da al
   post un elemento que no es prosa arriba de la línea de flote. Es decisión de lectura, no táctica
   de SEO.
3. **Lo que ninguno hace y Neto sí puede:** poner la fuente y la fecha pegadas a cada cifra (Wise se
   acerca con su "sources checked"), y mostrar el producto con respuestas reales del bot dibujadas en
   texto. Monzo usa capturas en PNG: no se pueden citar y envejecen sin avisar.

---

## 3. Lo que Google y los motores de IA pueden usar

Solo lo que tiene fuente primaria entra como regla. Lo demás se marca como opinión.

- **Todo el contenido va en el HTML inicial.** El estudio de Vercel y MERJ (17-dic-2024, tráfico
  real) midió que GPTBot y ClaudeBot bajan JavaScript pero no lo ejecutan. El static export ya lo
  cumple; la regla es que **ningún bloque se arma en el cliente**. Por eso no hay calculadoras en
  este molde: ninguno de los veintitrés artículos embebe una (todos enlazan a una herramienta
  aparte), y una calculadora es hidratación que los crawlers no ven. La calculadora de Neto es Neto.
- **Tabla = `<table>` con `<caption>` y `<th scope>`** (W3C WAI, tutorial de tablas). Google no
  documenta en ningún lado que eso dispare un snippet de tabla; es la forma de que cualquier
  extractor la linealice bien, y es accesibilidad obligatoria.
- **Gráfico = HTML o SVG inline con texto real.** Un `<img src="x.svg">` o un PNG es opaco, igual
  que texto horneado en una imagen. Ningún crawler documenta OCR en su indexación.
- **`<details>` se indexa** (Mueller, 2020: lo que está en el HTML cuenta aunque esté plegado).
  Sirve para el relato secundario, nunca para la prueba.
- **FAQPage ya no da resultado enriquecido.** Google dejó de mostrar el rich result de preguntas
  frecuentes el **7-may-2026, para todos los sitios** (changelog de Search Central, entrada del
  8-may-2026, leída el 12-sep-2026). El markup sigue siendo válido y la sección visible sigue
  sirviéndole al lector, así que se queda. Lo que cambia: **un FAQ no se agrega para ganar un rich
  result, porque ese rich result no existe.** Que ayude a un motor de IA no tiene fuente primaria.
- **Article:** `author`, `datePublished` y `dateModified` son las propiedades con beneficio
  documentado (doc de Google actualizada el 8-sep-2026). La guía de contenido útil trata como
  manipulación mover la fecha sin cambio real; eso ya lo impide la regla 3c de `verify-claims.mjs`.
- **Nada del artículo nace transparente.** Chrome saca del cálculo de LCP lo que tiene opacidad
  cero (web.dev, LCP). Es el mismo bug que `feedback_fade_in_rompe_el_fcp` midió en app.neto.pe.

---

## 4. La anatomía

El orden es el de la pregunta de quien llega, no el de un informe: **cuánto → por qué → qué hago →
muéstrame**, y la prueba pegada a cada cifra en vez de juntada al final.

| # | Bloque | ¿Obligatorio? | Componente | Qué hace |
|---|---|---|---|---|
| 1 | Cabecera | sí | ya existe en `blog/[slug]/page.tsx` | H1 con forma de pregunta, bajada, autor, publicado y actualizado. El tiempo de lectura se **calcula** del texto (`tiempoLectura` en `blog.ts`); hasta el 12-sep-2026 era un `"5 min"` escrito a mano en cada post |
| 2 | En corto | sí | `enCorto()` | La respuesta con su cifra, en 2 a 4 puntos y 60 palabras como máximo. Es el primer elemento del cuerpo |
| 3 | Visual principal | sí | `tabla()`, `barras()` o `chatNeto()` | Tiene que llegar antes de las 120 palabras. Un titular grande no cuenta |
| 4 | Secciones | sí | `<h2>` pelado | Cada una abre respondiendo. Subtítulo como pregunta o etiqueta, nunca como afirmación larga |
| 5 | Visuales de apoyo | según largo | los mismos tres | Uno cada 260 palabras de cuerpo como máximo |
| 6 | Nota | no | `nota()` | Una advertencia o un dato suelto. Incluye el "cuándo no te sirve", que NerdWallet usa y la comparativa de neto.pe ya tiene |
| 7 | Link a WhatsApp en el cuerpo | sí, uno | `waLink('blog')` + `<HtmlAtribuido>` | Antes de las 620 palabras. Nunca un `wa.me` escrito a mano |
| 8 | Preguntas frecuentes | no | el array `faq` de `blog.ts` | 3 a 5, cada respuesta abre respondiendo. Alimenta la sección visible y el FAQPage |
| 9 | CTA final | sí | ya existe | Sin cambios |

**Dónde va la fuente.** En el pie del bloque que muestra la cifra (el `<caption>` de la tabla, el
`<figcaption>` del gráfico) o como link en la misma frase, con la fecha de consulta. No hay sección
de fuentes al final: separa la cifra de su prueba, y es la prueba lo que distingue a estos posts de
los que ya rankean.

**Qué no entra, a propósito:** índice (el post típico tiene cuatro secciones), calculadoras, capturas
en PNG, iconos decorativos, imágenes de stock, más de un CTA en el cuerpo, y cualquier animación de
entrada.

### Cuándo un post lleva gráfico

Solo si hay **tres o más cifras de la misma unidad, del mismo período y con fuente**, y el gráfico
dice algo que la tabla no deja ver de un vistazo. Si una cifra tiene que convertirse de moneda para
entrar, no entra: la conversión sería un número nuevo, con su propia fuente y su propia fecha. Si
las cifras no cumplen, el post va con tabla y no pasa nada.

### El chat de Neto es una afirmación sobre el producto

Dibujar a Neto contestando algo que no contesta es una promesa falsa, igual que el hero lo fue
durante meses. Por eso `chatNeto()` **no acepta texto libre: recibe una clave** de un registro
(`src/lib/respuestas-bot.ts`), y cada entrada del registro trae la plantilla del backend de la que
sale, citada por archivo y función, más los fragmentos literales que el chequeo busca en `../app`.
Si alguien cambia la plantilla en el backend y no toca el blog, el chequeo falla.

Los montos, la fecha y la categoría son de ejemplo y el pie del chat lo dice. La categoría la elige
un modelo de lenguaje, así que es ilustrativa; el formato de la línea es el de la plantilla.

---

## 5. Los componentes

Viven en `src/lib/blog-bloques.ts` como **funciones que devuelven un string de HTML**, porque el
cuerpo del post es un string (`blog-content.ts` → `<HtmlAtribuido>`). Nada de React adentro del
cuerpo, nada de JavaScript en el cliente, y los estilos bajo `.prose-neto` en `globals.css`, con los
tokens de color que ya existen.

| Función | Emite | Regla que trae puesta |
|---|---|---|
| `enCorto(puntos)` | `<div class="blq-corto">` con etiqueta y `<ul>` | máximo 4 puntos |
| `tabla({caption, columnas, filas, pie})` | `<table>` semántica | `<caption>` y `<th scope>` siempre. Bajo 640 px cada fila se vuelve una tarjeta, solo con CSS (`data-label`), para no arrastrar de lado |
| `barras({titulo, unidad, items, fuente})` | `<figure>` con una lista de barras de HTML y `<figcaption>` | exige `fuente` con fecha. El valor va escrito como texto al lado de cada barra, no solo como largo |
| `chatNeto(clave)` | `<figure class="blq-chat">` con burbujas estáticas | solo claves del registro. Convierte el `*negrita*` de WhatsApp como hace el hero |
| `nota(tipo, html)` | `<aside class="blq-nota">` | dos tipos: `ojo` y `dato` |

Los datos no se copian: el post de precios lee `APPS` de `apps-comparativa.ts`, y el precio de Neto
tiene una sola fuente en el backend (`PRO_PRECIOS` de `app/lib/config.js`).

---

## 6. Los umbrales

**Son prestados, y se declara.** Los de prosa y estructura salen de `vortik-site/docs/guias-linea-b.md`,
que los calibró midiendo sus propias páginas. Miden español leído en un celular, así que el préstamo
es razonable, pero no son un hallazgo sobre el blog de Neto. Si un post no entra, el número se cambia
midiendo posts de este tipo, nunca porque la pieza que se está escribiendo no cabe.

| Grupo | Umbral | Valor |
|---|---|---|
| Prosa | mediana de palabras por oración | ≤ 18 |
| | oraciones de más de 30 palabras | < 10 % |
| | oración más larga | ≤ 40 |
| | bloque de prosa seguido | ≤ 70 palabras |
| | primera oración de un bloque | ≤ 25 palabras |
| | subtítulo (`h2`, `h3`) | ≤ 10 palabras |
| | em dash en la prosa (el chat queda fuera: cita al backend literal) | 0 |
| | voseo | 0 |
| Estructura | palabras antes del primer visual | ≤ 120 |
| | palabras de cuerpo por visual | ≤ 260 |
| | palabras antes del link a WhatsApp | ≤ 620 |
| | cuerpo total, sin la FAQ | ≤ 780 |
| Datos | tabla sin `<caption>` o sin `<th scope>` | 0 |
| | figura sin fuente con fecha en su pie | 0 |
| | cifra en S/, US$, R$ o % del cuerpo que no salga de `APPS`, de `PRO_PRECIOS` o de un chat del registro, ni tenga link en su misma frase | 0 |
| Producto | fragmento de un chat que ya no está en `../app` | 0 |
| | `verify-claims.mjs` | verde |
| Página | `<h1>` | exactamente 1 |
| | desborde horizontal a 375 px | 0 |
| | clase de animación de entrada dentro del artículo | 0 |

**Los posts viejos no se miden, y la exención es explícita.** El chequeo barre todos los posts por
defecto y los que todavía no están en el molde van en una lista `LEGADO` con su motivo, igual que
`PROFUNDIZANDO` en `verify-claims.mjs`. Un post nuevo cae del lado estricto sin que nadie se acuerde.

---

## 7. El piloto: `/blog/cuanto-cuesta-app-finanzas-personales-peru`

| Bloque | Qué lleva |
|---|---|
| En corto | anotar cuesta S/0 en casi todas; lo que se cobra es lo de encima; Neto Pro S/10 al mes o S/99 al año; las otras cobran por cosas distintas y en monedas distintas |
| Tabla | las siete apps de `APPS`: precio corto, qué se paga y dónde lo publican, con las fuentes y la fecha de consulta en el pie |
| Barras | lo que cuesta un año en soles, **solo de los planes que publican precio anual en soles**: Money Manager (sincronizar, S/ 76.90), Neto Pro (S/99) y Wallet Premium (S/ 99.90). Cada barra dice qué compra, y ese es el argumento del post: números parecidos por tres cosas distintas. El pie nombra las que quedan fuera y por qué (Spendee en dólares, Mobills en reales, Monefy sin periodicidad publicada, Fintonic sin precio) |
| Chat | dos intercambios reales de alguien cuya prueba terminó: anota un gasto y Neto lo confirma con el total del mes (`colaConfirmacionGasto` → `nudgeMuro`), pide su resumen y Neto le contesta el muro con el precio (`mensajeMuro` → `pieMuro` → `lineaPrecioPro`). Es lo gratis y lo que se paga, dicho por el propio bot |
| Nota | cuándo no conviene pagar ninguna |

**Cambió al construir:** `APPS` no ganó ningún campo. El monto anual se LEE del propio `precio` de
cada app (el patrón `S/ 99.90 al año`), así que la gráfica no copia ningún número. Lo que sí se
escribe es qué compra cada plan y por qué queda fuera cada app (`COMPRA_ANUAL` y `FUERA_DE_ANUAL` en
`blog-content.ts`), y el build aborta si una app entra o sale de la gráfica sin estar en uno de los
dos mapas.

**La medición del 11-dic ya no separa el molde de la forma de pregunta.** Se propuso dejar
`controlar-gastos-yape-plin` sin migrar, como comparación, y Favio decidió migrar los dos (12-sep-2026).
Dicho para que nadie lo lea mal en diciembre: lo que den esas dos URLs en GSC es el efecto conjunto de
la forma de pregunta y del molde, y no hay forma de atribuirlo a uno solo.

---

## 8. Qué tendría que bloquear una rutina automática

Espejo del Paso 7 de la skill `vortik-post`, que es lo que hace sostenible que `vortik-content-weekly`
publique sin gate humano. Si cualquiera falla, **no se fusiona**: la rama queda empujada, el PR
abierto y el aviso de Telegram dice cuál falló. Exit 2 (no se pudo medir) cuenta como fallo.

| # | Chequeo | Falla si | Existe hoy |
|---|---|---|---|
| 0 | Cortacircuitos | árbol sucio, rama `content/*` huérfana, falta la bitácora de la corrida anterior, o hubo un revert en los últimos 14 días | no; hay que escribir el de Neto (el de vortik-site es el molde) |
| 1 | `npm run build` | el build falla | sí |
| 2 | `verify-claims.mjs` | una afirmación prohibida, el sitemap sin la ruta o un `<lastmod>` que no es `dateModified` | sí |
| 3 | Chequeo del molde (sección 6) | cualquier umbral de prosa, estructura, datos o página | sí, `check-blog.mjs` |
| 4 | Chats contra el backend | un fragmento del registro ya no está en `../app` | sí, `check-blog.mjs` |
| 5 | Cifras trazables | una cifra del cuerpo sin origen en los datos ni link en su frase | sí, `check-blog.mjs` |
| 6 | `verify-atribucion.mjs` | el link del post a WhatsApp perdió su posición `[blog]` | sí |
| 7 | Móvil a 375 px | desborde horizontal de la página o de un bloque. Los links dentro de un párrafo quedan exentos del mínimo de 44 px (WCAG 2.5.8), y en el cuerpo del blog son todos así | sí, `check-blog.mjs` |
| 8 | Verificación en producción | la URL no da 200, el `<title>` no es el esperado, el JSON-LD no parsea, falta la fila del sitemap | sí, a mano; hay que volverlo script |
| 9 | Marcha atrás | si 8 falla, la corrida revierte su propio merge y lo registra | no |

**Lo que se queda fuera del gate a propósito:** el laboratorio de CWV. Tres corridas sobre la misma
build dieron 46, 49 y 56 de score el 17-ago-2026; un gate con ese ruido bloquea por nada. Se mide
antes y después, dentro de la misma tanda, y se informa con su dispersión.

**La prueba que ningún script hace**, y que en vortik es el criterio de rechazo: cambiar el sujeto
del post por otro del mismo tipo. Si un post sobre Yape se sigue leyendo verdadero hablando de Plin,
es genérico. Esa prueba se escribe en la bitácora antes de fusionar.

**Decisión de Favio (12-sep-2026): la rutina publica sola desde la primera pieza**, igual que
`vortik-content-weekly`. Se le recomendó lo contrario y queda escrito para poder contrastarlo, no para
reabrirlo: el riesgo de un post de Neto no es de estilo sino de producto (una respuesta del bot mal
descrita, una promesa bancaria), y la propuesta era fusionar a mano las tres primeras piezas. Lo que
sostiene la decisión son los chequeos de esta tabla y, sobre todo, la marcha atrás (9), que todavía no
existe. **Por eso la rutina no debería crearse mientras 0, 8 y 9 sigan sin ser scripts.**

---

## 9. Lo que este molde no prueba

Que alguien lea hasta el final. Los umbrales garantizan que ningún post vuelva a ser un muro de
texto; si engancha lo va a decir el scroll depth de PostHog cuando haya tráfico, no este documento.

---

## 10. Resultado del piloto (12-sep-2026)

### Antes y después, medido con el propio chequeo

La columna "antes" es un accidente útil: el primer build del piloto lo abortó la guarda de `enCorto()`
(62 palabras contra un tope de 60), `out/` quedó con los posts publicados y el chequeo los midió.

| | Precio, antes | Precio, después | Yape, antes | Yape, después |
|---|---|---|---|---|
| Palabras de cuerpo, sin la FAQ | 827 | 440 | 773 | 515 |
| Elementos visuales | 0 | 3 (tabla, barras, chat) | 0 | 2 (tabla, chat) |
| Palabras antes del primer visual | todas | 97 | todas | 83 |
| Palabras antes del link a WhatsApp | 808 | 421 | 758 | 500 |
| Oración más larga | 43 | 30 | 43 | 36 |
| Problemas que nombra `check-blog` | 21 entre los dos | 0 | | 0 |

### Las mutaciones, y la que enseñó algo

Cada una comprueba que el chequeo **nombre su regla**, no solo que salga distinto de cero, y cada una
verifica antes que el cambio se aplicó de verdad.

| Mutación | Resultado |
|---|---|
| Control: copia del backend sin tocar | exit 0 |
| El backend cambia el pie del muro ("no se borra nada") | exit 1, nombra `lib/trial.js` |
| El backend sube `PRO_PRECIOS.mensual` de 10 a 12 | exit 1 con tres fallos: el ejemplo del chat, el precio de Neto en `APPS` y el S/120 de la FAQ |
| El backend cambia el separador de la captura | exit 1, nombra `handlers/webhook.js` |
| No hay backend | exit 2 |
| Alguien retoca el texto de Neto en el registro | exit 1: no encaja en la plantilla, y el chat publicado deja de coincidir con el registro |
| La captura dice otro comercio que la respuesta | exit 1 |
| Em dash en la prosa (fuente + build) | exit 1, "1 em dash en la prosa" |
| Voseo (fuente + build) | exit 1, "voseo: querés" |
| Tabla sin caption (fuente + build) | **el build aborta** desde `tabla()` |
| Cifra inventada, S/ 49.90 (fuente + build) | exit 1, nombra la cifra |
| Oración de 45 palabras (fuente + build) | exit 1 |
| Animación de entrada en "En corto" (fuente + build) | exit 1 |
| La tabla deja de ser visual (fuente + build) | exit 1, palabras antes del primer visual |

**No se muta el HTML de `out/`.** La primera tanda mutó el HTML construido, y tres casos (em dash,
caption, voseo) salieron verdes. El chequeo no estaba ciego: el cuerpo del post es un
`dangerouslySetInnerHTML` cuyo string también viaja en el payload de React, y **al hidratar React
reescribe el cuerpo desde el payload**, sin la mutación. Medido: al evento `load` el DOM tenía el em
dash y no tenía caption; tres segundos después tenía caption y no tenía em dash. Los casos que "sí
cazó" habían llegado antes de la hidratación por suerte. Dos consecuencias: el chequeo espera
`networkidle` (mide el DOM estable que ve el lector) y las mutaciones se hacen en el fuente, con build.

**Un verde sobre un `out/` viejo no es un verde.** Un build falló por un archivo de tipos que dejó
cortado el dev server (`.next/dev/types/routes.d.ts`), `out/` quedó con la versión anterior, y el
chequeo dio verde midiendo HTML de antes. Desde ese día, si algún fuente del blog es más nuevo que el
HTML construido, sale exit 2.

### Core Web Vitals de laboratorio, antes y después

Móvil, `npm run measure:cwv` (PageSpeed), cinco corridas pedidas por medición, el mismo día. PageSpeed
devolvió 500 en muchas corridas, así que la n real va al lado de cada número.

| | Antes | Después |
|---|---|---|
| Precio, score | 92 (77 a 96), n=4 | 89 (84 a 90), n=3 en dos tandas |
| Precio, LCP | 2926 ms (2401 a 3226) | 3151 ms (3001 a 3151) |
| Yape, score | 85 (72 a 90), n=5 | 81 (74 a 91), n=3 |
| Yape, LCP | 3226 ms (3151 a 4501) | 3151 ms (3151 a 3226) |
| CLS | 0 en todas | 0 en todas |
| Peso de la página | 1033 KiB | 1034 a 1040 KiB |

**Lectura: no hay cambio medible.** En los dos posts el rango del "después" cae dentro del del
"antes", que es la regla de `measure-cwv-lab.mjs` para llamar ruido a una diferencia. El molde no
agrega imágenes ni JavaScript: suma entre 1 y 7 KiB de CSS. La salvedad es la n: el "después" del
post de precios juntó corridas de dos tandas separadas por una hora, más débil que una sola tanda.

