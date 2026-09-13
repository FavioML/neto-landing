# Molde de un post del blog de neto.pe

**Qué gobierna.** La forma de `/blog/<slug>`: qué bloques lleva, en qué orden, con qué componente
se dibuja cada uno, cuánto puede pesar el texto y qué chequeo lo comprueba. **Qué NO gobierna:** la
sustancia. Lo que un post dice de Neto sale del código de `app/` a la fecha de escribirlo; una cifra
de terceros lleva fuente y fecha de consulta o no se publica; y lo que el copy puede prometer lo
decide `scripts/verify-claims.mjs`. Si este documento y esas reglas chocan, mandan ellas.

**Estado: VIGENTE desde el 12-sep-2026.** Favio aprobó la anatomía y los cinco componentes ese día,
y los dos posts de la Acción 3 (`cuanto-cuesta-app-finanzas-personales-peru` y
`controlar-gastos-yape-plin`) se migraron al molde. El mismo día se agregó el sexto bloque,
`ejemplo()` (sección 4, "Cuándo un post lleva un ejemplo"), y con él se migraron los cinco posts de
marzo. **Los siete posts están en el molde y la lista `LEGADO` de `scripts/check-blog.mjs` quedó
vacía**: un post nuevo o viejo que se salga del molde pone rojo el chequeo. Lo que cambió al construir
respecto de la propuesta está marcado en cada sección, y lo medido está en las secciones 10, 11 y 12.

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
| 3 | Visual principal | sí | `tabla()`, `barras()`, `chatNeto()` o `ejemplo()` | Tiene que llegar antes de las 120 palabras. Un titular grande no cuenta |
| 4 | Secciones | sí | `<h2>` pelado | Cada una abre respondiendo. Subtítulo como pregunta o etiqueta, nunca como afirmación larga |
| 5 | Visuales de apoyo | según largo | los mismos cuatro | Uno cada 260 palabras de cuerpo como máximo |
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

### Cuándo un post lleva un ejemplo

Cuando la mejor forma de explicar algo es una cuenta con montos inventados ("café S/8 × 22 días",
"un sueldo de S/3,000 al 50/30/20"). Una cuenta ilustrativa no es un dato de terceros: lo que la hace
verdadera es que cierre, no una fuente. Por eso `ejemplo()` saca sus cifras de la regla de
trazabilidad, **pero solo porque se comprueban con lo que está en el mismo bloque**.

Nació el 12-sep-2026 de una medición: sin él, los cinco posts de marzo daban 109 problemas del
chequeo, y 66 eran cuentas de ejemplo. Migrarlos sin este bloque habría empujado a borrar justo lo
más útil de esos posts.

| Forma | Se escribe | Se comprueba |
|---|---|---|
| multiplicación | `unitario`, `veces`, `resultado` | `unitario × veces = resultado` |
| suma | `total` | la suma de los resultados |
| anual | `anual` | `total × 12` |
| reparto | `base` + `pct` por fila | `base × pct / 100 = resultado`, y el total da la base entera |
| presupuesto cero | `base` + filas de monto | el total da la base entera |
| desglose | `partes` en una fila | las partes suman el resultado de la fila |

Cuatro reglas que no se negocian:

- **El resultado y el total los escribe el autor.** Si los calculara la función, una cuenta que no
  cierra no se podría escribir y el bloque no probaría nada. Así, la que no cierra aborta el build
  nombrando la fila.
- **Se marca visible como ejemplo:** etiqueta "Ejemplo", borde punteado azul y el pie fijo "Montos
  inventados para hacer la cuenta". Sin esas marcas, un lector toma la cuenta por un dato.
- **La prosa de afuera no repite sus cifras** (decisión de Favio, 12-sep-2026). Dice "el total del
  ejemplo", no el número. Permitirlo haría pasar cualquier cifra suelta que coincida con algún
  resultado. Tampoco se esquiva escribiendo el número con letras.
- **Barras solo con tres filas o más**, la misma condición de entrada del gráfico. En tabla, bajo
  640 px NO se vuelve tarjetas: dos a cuatro columnas cortas entran, y como tarjetas la cuenta se
  parte en renglones que ya no se leen como una suma.

**Lo que no comprueba, declarado:** que los operandos sean inventados. Un dato real metido como
operando ("RMV S/1,130") cerraría igual. El caso obvio lo cortan las palabras de `DATO_AJENO`
(promedio, según, INEI, mínimo, RMV…), en el build y en el chequeo; el resto es criterio de quien
escribe.

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
| `ejemplo({titulo, filas, base, total, anual, como})` | `<figure class="blq-ejemplo">`, como tabla (con `blq-tabla`) o como barras (con `blq-barras`) | aborta el build si la cuenta no cierra, si mezcla formas, si trae menos de dos filas o si nombra un dato de terceros. Cada número lleva un `data-rol` para que el chequeo rehaga la cuenta desde el texto visible |

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
| | ejemplo cuya cuenta no cierra, rehecha desde el texto visible | 0 |
| | ejemplo sin la etiqueta "Ejemplo" o sin el pie de montos inventados | 0 |
| | cifra dentro de un ejemplo que no es operando ni resultado de su cuenta | 0 |
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
| 5 | Cifras trazables | una cifra del cuerpo sin origen en los datos ni link en su frase, o un ejemplo cuya cuenta no cierra | sí, `check-blog.mjs` |
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

---

## 11. El bloque de ejemplo y la migración de dos posts de marzo (12-sep-2026)

### Antes y después, con el propio chequeo

"Antes" es el conteo de la sesión anterior, con `check-blog` corrido sin `LEGADO`.

| | Gastos hormiga, antes | Después | Cómo controlar, antes | Después |
|---|---|---|---|---|
| Problemas que nombra `check-blog` | 36 | 0 | 43 | 0 |
| Palabras de cuerpo, sin la FAQ | sobre 1.000 | 489 | sobre 1.000 | 684 |
| Elementos visuales | 0 | 4 (barras de ejemplo, tabla, chat, tabla de ejemplo) | 0 | 4 (tabla, dos tablas de ejemplo, chat) |
| Palabras antes del primer visual | todas | 90 | todas | 77 |
| Palabras antes del link a WhatsApp | sin link en el cuerpo | 390 | sin link en el cuerpo | 447 |
| Oración más larga | | 29 | | 30 |

Qué se conservó de la reescritura del 11-sep: el ingreso de Lima del INEI con su fuente y fecha, y
todas las cuentas de ejemplo, ahora verificadas. Qué se cortó para entrar en 780 palabras: la
sección de gastos fijos contra gastos hormiga, la lista larga de categorías, la de herramientas
gratis y pagadas (queda un link al post de precios) y los errores comunes, que pasaron a una nota.
Nada se plegó en un `<details>` para esquivar el tope: el chequeo no cuenta esas palabras y usarlo
así sería hacerle trampa al molde. La FAQ salió del cuerpo al array `faq`, que es texto plano para el
JSON-LD, así que el "S/8 al día son S/2,920 al año" se reescribió sin la cifra.

**Un detalle del original se corrigió porque el bloque lo dejaba a la vista:** el café se contaba
en 22 días hábiles y el snack, "en los días de trabajo", en 20. Los dos van en 22, así que el total
del ejemplo pasó de S/700 a S/710 y el anual de S/8,400 a S/8,520.

**Un chat nuevo en el registro, `tope-categoria`:** anotar un delivery con un presupuesto de
categoría al 82%. Es una respuesta INMEDIATA del bot (la alerta se pega a la confirmación en
`handlers/intents/transacciones.js`), no un cron. Se usó el tope de categoría y no el de subcategoría
porque el de categoría es el que se puede crear seguro desde la app. Queda fijado que la cola de la
confirmación va vacía para un Pro con cuenta web (`nudgeActivacion` corta en `supabase_auth_id`).

### Las mutaciones

Se muta el fuente y se reconstruye (sección 10). Cada caso verifica antes que la mutación se
aplicó: si el texto a mutar no está en el fuente, el caso sale como fallo y se imprime.

| Mutación | Capa | Resultado |
|---|---|---|
| Control: los bloques tal cual | chequeo | exit 0 |
| Una fila que no es su producto (176 → 186) | build | aborta: *la fila "Café, cada día hábil" dice S/186 y S/8 × 22 = S/176* |
| Un total que no es la suma | build | aborta: *el total dice S/720 y las filas suman S/710* |
| Un anual que no es el total × 12 | build | aborta: *el anual dice S/8,400 y S/710 × 12 = S/8,520* |
| Un 50/30/20 con Gustos al 35% | build | aborta: *el 35% de S/3,000 es S/1,050* |
| Un desglose que no suma su fila | build | aborta: *las partes de "Gustos" suman S/950 y la fila dice S/900* |
| Un presupuesto cero que no reparte la base | build | aborta: *el total dice S/3,000 y las filas suman S/2,900* |
| "promedio" dentro de un concepto | build | aborta: *"promedio" anuncia un dato de terceros* |
| Barras con dos filas | build | aborta: *en barras van tres filas o más y hay 2* |
| **HTML falsificado a mano** con `blq-ejemplo` y una cuenta que no cierra | chequeo | exit 1: *la cuenta no cierra: "Café" muestra S/8 × 22 = S/186* |
| HTML falsificado sin la etiqueta "Ejemplo" | chequeo | exit 1: *no abre con la etiqueta visible "Ejemplo"* |
| Una cifra suelta en el caption de un ejemplo | chequeo | exit 1: *la cifra S/2,500 está en el ejemplo pero no es parte de ninguna cuenta* |
| La cifra del ejemplo repetida en la prosa de afuera | chequeo | exit 1 por trazabilidad: *la cifra S/710 no sale de APPS…* |

**Tres cosas que salieron de correrlas, y ninguna se habría visto leyendo el código:**

- **El lector de cifras sueltas inventaba cifras.** El `textContent` de un bloque pega celdas
  vecinas sin espacio: "S/200" + "3" daba "S/2003", y el primer verde real salió con nueve
  problemas falsos. Ahora el texto se arma nodo por nodo y unido con espacio.
- **Ese arreglo dejó el mensaje ciego.** Un TreeWalker no devuelve su propia raíz, así que con un
  nodo de texto de raíz el concepto salía vacío: la mutación de la cuenta falsificada daba exit 1
  con *`""` muestra S/8 × 22 = S/186*. El exit era correcto y el mensaje no nombraba la fila, así
  que se contó como no cazada hasta arreglarlo.
- **Una mutación no se aplicaba y el arnés no lo decía.** El texto a mutar suponía un orden de
  filas que el fuente no tenía, y el caso no aparecía en la salida: se leía como "11 corrieron".
  Ahora un caso no aplicado se imprime como fallo.

### Core Web Vitals de laboratorio, antes y después

Móvil, `npm run measure:cwv` con cinco corridas pedidas por medición, contra producción, el mismo
día y con una hora de diferencia entre el antes y el después. PageSpeed devolvió 500 o se colgó en
varias corridas: la tanda del "antes" de cómo controlar se repitió dos veces porque quedó con menos de
tres válidas, y se usa la tercera.

| | Antes | Después |
|---|---|---|
| Gastos hormiga, score | 75 (72 a 82), n=3 | 86.5 (74 a 91), n=4 |
| Gastos hormiga, LCP | 3301 ms (3092 a 3301) | 3210 ms (2701 a 3227) |
| Cómo controlar, score | 86 (77 a 93), n=5 | 86 (77 a 88), n=3 |
| Cómo controlar, LCP | 2776 ms (2401 a 4502) | 2926 ms (2852 a 3151) |
| CLS | 0 en todas | 0 en todas |
| Peso de la página | 1036 a 1040 KiB | 1035 a 1040 KiB |

**Lectura: no hay cambio medible.** En los dos posts el rango del "después" se superpone con el del
"antes", así que cualquier diferencia de medianas queda dentro del ruido de su propia tanda. Eso
incluye los 11 puntos de score de gastos hormiga, que se ven como una mejora y no alcanzan para
llamarla así. El bloque suma CSS y nada de JavaScript, y el peso no se movió.

### Verificación en producción (12-sep-2026, `32981c5`)

`check-blog --base=https://neto.pe` en verde para los cuatro posts del molde; los dos migrados
responden 200; el sitemap y el `dateModified` del JSON-LD dicen 2026-09-12; validator.schema.org da
0 errores y 0 advertencias en los dos (BreadcrumbList, BlogPosting y FAQPage).

---

## 12. Los últimos tres de marzo, y `LEGADO` vacía (12-sep-2026)

Línea de base medida esa tarde con `check-blog`, sacando los tres de `LEGADO` sobre el build vigente:
30 problemas (en qué gasto 12, asistente 10, bancos 8). Ninguno de los tres tenía cuentas de ejemplo
que salvar, así que `ejemplo()` no se usó: sus visuales son tablas y chats.

| | En qué gasto | Bancos | Asistente |
|---|---|---|---|
| Problemas, antes → después | 12 → 0 | 8 → 0 | 10 → 0 |
| Palabras de cuerpo, antes → después | 1273 → 608 | 1221 → 478 | 1077 → 459 |
| Visuales, antes → después | 0 → 3 (tabla de dónde queda cada pago, tabla de categorías, chat) | 0 → 3 (tres tablas) | 0 → 3 (chat, tabla de gratis y Pro, chat de alerta) |
| Palabras antes del link a WhatsApp | sin link → 256 | 1009 → 450 | sin link → 449 |

**Qué se conservó de la reescritura del 11-sep, a propósito:** la lista de remitentes tomada del
código con su fecha (ahora en el pie de su tabla), los 30 días y 50 correos del histórico, que el
permiso de Gmail es de solo lectura sobre la bandeja y el recorte lo hace el código, el AES-256 de
Supabase con su fuente y el AES-256-GCM de los tokens, lo de Yape (solo avisa por correo de los
yapeos enviados y si se activa) y que Gmail es de Pro pagado y no entra en la prueba. La tabla de
"dónde queda cada pago" de en qué gasto es la MISMA constante que usa el post de Yape y Plin: un
dato, un dueño.

**Una frase se cambió por precaución:** la FAQ de asistente decía que con Gmail los gastos "entren
solos". Pasa a "los anote Neto por ti", la forma que el copy ya usa en el resto del sitio, para no
leerse como registro automático.

**Lo que salió de migrar, fuera de este alcance:** el chequeo no revisa la trazabilidad de las cifras
DENTRO de una `tabla()` (las tablas cuentan como visual y quedan fuera del lector de cifras), y
`tabla()` no exige pie con fecha, a diferencia de `barras()`. Hoy no se explota, porque las tablas con
cifras leen de `APPS`, pero una rutina automática podría escribir una cifra inventada en una celda y
el chequeo daría verde. Quedó como tarea aparte.

### Core Web Vitals de laboratorio, antes y después

Móvil, `npm run measure:cwv` con cinco corridas pedidas, contra producción, el mismo día. El
"después" de bancos se repitió: la primera tanda llevaba cuatro corridas válidas y murió en la quinta
por un timeout de PageSpeed que el script no atrapa, sin escribir su resultado (defecto de
`measure-cwv-lab.mjs`, quedó como tarea aparte).

| | Antes | Después |
|---|---|---|
| En qué gasto, score | 88.5 (73 a 92), n=4 | 83.5 (80 a 89), n=4 |
| En qué gasto, LCP | 3189 ms (2701 a 3226) | 3081 ms (2926 a 3227) |
| Bancos, score | 91 (78 a 92), n=5 | 87 (83 a 92), n=3 |
| Bancos, LCP | 3151 ms (3076 a 3152) | 2861 ms (2776 a 3226) |
| Asistente, score | 82.5 (77 a 91), n=4 | 90 (69 a 95), n=5 |
| Asistente, LCP | 3196 ms (3151 a 3227) | 3151 ms (2551 a 3227) |
| CLS | 0 en todas | 0 en todas |
| Peso de la página | 1034 a 1040 KiB | 1033 a 1040 KiB |

**Lectura: no hay cambio medible en ninguno de los tres.** Todos los rangos del "después" se
superponen con los del "antes", en score y en LCP.

### Verificación en producción (12-sep-2026, `df72eff`)

`check-blog --base=https://neto.pe` en verde para los siete posts con `LEGADO` vacía; los tres
migrados responden 200; sitemap y `dateModified` dicen 2026-09-12; validator.schema.org da 0 errores
y 0 advertencias en los tres (BreadcrumbList, BlogPosting y FAQPage).

