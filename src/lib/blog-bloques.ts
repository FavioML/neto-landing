/**
 * Los bloques del molde del blog (`docs/molde-blog.md`). Cada función devuelve un STRING de HTML,
 * porque el cuerpo de un post es un string (`blog-content.ts` → `<HtmlAtribuido>`).
 *
 * Nada de acá corre en el navegador: todo sale en el HTML del build, que es lo único que leen los
 * crawlers de IA (bajan el JavaScript pero no lo ejecutan). Los estilos viven en `globals.css`,
 * bajo `.prose-neto`, y ninguno anima la entrada: un bloque que nace transparente sale del FCP y del
 * LCP, que es el bug que ya se midió en app.neto.pe/login.
 *
 * Lo que se puede comprobar al construir se comprueba acá y ABORTA el build. Lo que necesita la
 * página renderizada (palabras antes del primer visual, desborde a 375 px, cifras trazables) vive
 * en `scripts/check-blog.mjs`.
 */
import registro from "./respuestas-bot.json";

const escapar = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const palabras = (html: string) => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

const FECHA = /\d{1,2} de (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre) de \d{4}/;

/** Link a una fuente de terceros. Siempre en pestaña nueva y `nofollow`, como el resto del blog. */
export const enlaceExterno = (texto: string, url: string) =>
  `<a href="${url}" target="_blank" rel="noopener noreferrer nofollow">${texto}</a>`;

/**
 * La respuesta del post en dos a cuatro puntos, con su cifra. Es el primer elemento del cuerpo.
 * No es táctica de SEO (ningún motor documenta que un TL;DR se cite más): es la regla de la
 * respuesta corta vuelta bloque, para que en un celular la cifra llegue antes del primer scroll.
 */
export function enCorto(puntos: string[]): string {
  if (puntos.length < 2 || puntos.length > 4) {
    throw new Error(`enCorto: van de 2 a 4 puntos y llegaron ${puntos.length}`);
  }
  const total = puntos.reduce((n, p) => n + palabras(p), 0);
  if (total > 60) throw new Error(`enCorto: ${total} palabras, el tope es 60`);
  return `<div class="blq-corto"><p class="blq-etiqueta">En corto</p><ul>${puntos
    .map((p) => `<li>${p}</li>`)
    .join("")}</ul></div>`;
}

type Tabla = {
  caption: string;
  /** La primera columna es el encabezado de cada fila (`<th scope="row">`). */
  columnas: string[];
  filas: string[][];
  /** Fuentes y fecha de consulta. Van pegadas a la tabla, no en una sección aparte. */
  pie?: string;
  /** Índice de la fila propia (Neto), que se marca con el color de la marca. */
  propia?: number;
};

/**
 * Una tabla de datos semántica: `<caption>` y `<th scope>` siempre. Bajo 640 px cada fila se vuelve
 * una tarjeta, solo con CSS (`data-label`), porque una tabla que hay que arrastrar de lado no se lee.
 * Los `role` repiten la semántica nativa a propósito: con `display: block` algunos lectores de
 * pantalla dejan de tratarla como tabla.
 */
export function tabla({ caption, columnas, filas, pie, propia }: Tabla): string {
  if (!caption.trim()) throw new Error("tabla: sin caption no hay forma de saber qué mide");
  filas.forEach((f, i) => {
    if (f.length !== columnas.length) {
      throw new Error(`tabla "${caption}": la fila ${i + 1} tiene ${f.length} celdas y hay ${columnas.length} columnas`);
    }
  });
  const cabecera = columnas.map((c) => `<th scope="col" role="columnheader">${c}</th>`).join("");
  const cuerpo = filas
    .map(([primera, ...resto], i) => {
      const celdas = resto
        .map((c, j) => `<td role="cell" data-label="${escapar(columnas[j + 1])}">${c}</td>`)
        .join("");
      return `<tr role="row"${i === propia ? ' class="blq-propia"' : ""}><th scope="row" role="rowheader">${primera}</th>${celdas}</tr>`;
    })
    .join("");
  return `<figure class="blq-tabla"><table role="table"><caption>${caption}</caption><thead role="rowgroup"><tr role="row">${cabecera}</tr></thead><tbody role="rowgroup">${cuerpo}</tbody></table>${
    pie ? `<figcaption>${pie}</figcaption>` : ""
  }</figure>`;
}

type Barra = {
  etiqueta: string;
  valor: number;
  /** El valor como se lee ("S/ 99.90"). Va escrito al lado de la barra: el largo solo no es un dato. */
  texto: string;
  detalle?: string;
  propia?: boolean;
};

/**
 * Un gráfico de barras hecho con HTML, no con una imagen: cada etiqueta y cada valor son texto que
 * se puede citar. Solo entra con tres cifras o más de la misma unidad y con fuente fechada; con
 * menos, lo que corresponde es una tabla (`docs/molde-blog.md`, "Cuándo un post lleva gráfico").
 */
export function barras({ titulo, items, fuente, nota }: { titulo: string; items: Barra[]; fuente: string; nota?: string }): string {
  if (items.length < 3) {
    throw new Error(`barras "${titulo}": un gráfico necesita tres cifras o más y hay ${items.length}; con menos va una tabla`);
  }
  if (!FECHA.test(fuente)) throw new Error(`barras "${titulo}": la fuente no trae la fecha de consulta`);
  const max = Math.max(...items.map((i) => i.valor));
  const filas = items
    .map((i) => {
      const ancho = Math.round((i.valor / max) * 1000) / 10;
      return `<li${i.propia ? ' class="blq-propia"' : ""}><span class="blq-barra-etq">${i.etiqueta}${
        i.detalle ? `<small>${i.detalle}</small>` : ""
      }</span><span class="blq-barra-valor">${i.texto}</span><span class="blq-barra-pista" aria-hidden="true"><span class="blq-barra" style="width:${ancho}%"></span></span></li>`;
    })
    .join("");
  return `<figure class="blq-barras"><p class="blq-fig-titulo">${titulo}</p><ol>${filas}</ol><figcaption>${
    nota ? `${nota} ` : ""
  }${fuente}</figcaption></figure>`;
}

type Mensaje = {
  de: "usuario" | "neto";
  texto?: string;
  patron?: string;
  captura?: { monto: string; destinatario: string; cuando: string };
};
type Respuesta = {
  situacion: string;
  ejemplo: string;
  mensajes: Mensaje[];
  plantilla: { archivo: string; codigo: string }[];
};

export type ClaveChat = keyof typeof registro.respuestas;
const RESPUESTAS = registro.respuestas as Record<ClaveChat, Respuesta>;

/** El `*negrita*` y el `_cursiva_` de WhatsApp, igual que `renderWa` del hero, sobre texto ya escapado. */
const markdownWa = (t: string) =>
  escapar(t)
    .replace(/\*([^*\n]+)\*/g, "<strong>$1</strong>")
    .replace(/_([^_\n]+)_/g, "<em>$1</em>");

/**
 * Una conversación real con Neto. Recibe una CLAVE del registro (`respuestas-bot.json`), nunca
 * texto: dibujar a Neto contestando algo que no contesta es una afirmación falsa sobre el producto,
 * y el hero ya la hizo durante meses. `check-blog.mjs` coteja cada plantilla contra `../app`.
 *
 * La captura de pago se dibuja, no se carga (0 KB, no envejece), y sin la marca de Yape: el mismo
 * criterio que `VoucherThumb` del hero.
 */
export function chatNeto(clave: ClaveChat): string {
  const r = RESPUESTAS[clave];
  const burbujas = r.mensajes
    .map((m) => {
      if (m.captura) {
        const { monto, destinatario, cuando } = m.captura;
        return `<div class="blq-msg blq-usuario blq-captura" role="img" aria-label="Captura de un pago de ${escapar(monto)} a ${escapar(destinatario)}"><span class="blq-cap-etq">Pago exitoso</span><span class="blq-cap-monto">${escapar(monto)}</span><span class="blq-cap-dest">a ${escapar(destinatario)}</span><span class="blq-cap-fecha">${escapar(cuando)}</span></div>`;
      }
      return `<p class="blq-msg ${m.de === "neto" ? "blq-neto" : "blq-usuario"}">${markdownWa(m.texto ?? "")}</p>`;
    })
    .join("");
  return `<figure class="blq-chat" data-chat="${clave}"><div class="blq-chat-cabecera" aria-hidden="true"><span class="blq-chat-avatar">N</span>Neto</div><div class="blq-chat-cuerpo">${burbujas}</div><figcaption>${escapar(
    r.situacion
  )} Respuesta real de Neto: el texto sale de la plantilla del bot; ${escapar(r.ejemplo)}.</figcaption></figure>`;
}

/** Una advertencia (`ojo`) o un dato suelto (`dato`). Incluye el "cuándo no te sirve". */
export function nota(tipo: "ojo" | "dato", titulo: string, html: string): string {
  return `<aside class="blq-nota" data-tipo="${tipo}"><p class="blq-etiqueta">${titulo}</p>${html}</aside>`;
}
