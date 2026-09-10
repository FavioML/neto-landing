/**
 * ATRIBUCIÓN DE LA LANDING — de dónde vino quien está mirando esta página.
 *
 * Existe porque la cadena se cortaba en el salto: los CTA eran `href="https://app.neto.pe"`
 * pelado y `wa.me/...?text=...[hero]`, así que el UTM con el que alguien llegaba a neto.pe moría
 * en la primera pantalla. Medido contra PostHog el 2026-09-09: de 2898 pageviews de app.neto.pe
 * en 90 días, **10 traían `utm_` (0,3%)**, y esos 10 eran links directos, no propagación.
 *
 * TRES COSAS QUE CONDICIONAN EL DISEÑO, y ninguna es preferencia de estilo:
 *
 * 1. **La landing es static export** (`next.config.ts`, `output: "export"`). Verificado contra
 *    producción, no leído: `curl https://neto.pe/` devuelve los `[hero]`, `[navbar]`, `[sticky]`
 *    ya horneados en el HTML. El mismo HTML se sirve a todos, así que NO hay servidor que pueda
 *    ver el query string entrante. Se resuelve en cliente o no se resuelve.
 *
 * 2. **Por lo mismo, esto no puede correr durante el render.** El HTML del build no tiene query
 *    string y el del navegador sí, y React trataría la diferencia como mismatch de hidratación.
 *    Todo lo que dependa de `window` entra por `useAtribucion()`, que devuelve el valor PELADO en
 *    el primer render y el real después de montar. Los `href` del HTML estático siguen siendo los
 *    de hoy, que es justo el comportamiento que se quiere sin JS.
 *
 * 3. **`<Link>` de Next tira el query string.** Alguien que entra a `/?utm_source=ig` y navega a
 *    `/precios` antes de hacer clic pierde el UTM mucho antes de llegar al CTA. Por eso la
 *    captura se persiste en `sessionStorage` en el primer pageview en vez de leerse de la URL en
 *    cada sitio de uso. Es la mitad del problema que un `curl` no puede ver.
 *
 * QUÉ SALE DE ACÁ, que son dos cosas distintas con dos destinos distintos:
 *
 *   · `params`  →  se pegan a la URL de `app.neto.pe`. Son UTM de verdad cuando la persona llegó
 *                  con UTM (se propagan TAL CUAL, sin tocarlos) y un par derivado cuando no.
 *   · `origen`  →  se mete en el texto prellenado de WhatsApp, al lado de la etiqueta de
 *                  posición que ya existía: `[hero]` pasa a `[hero|ig]`. Ese mensaje es el ÚNICO
 *                  punto donde una sesión de la landing toca un alta, porque el alta de Neto
 *                  ocurre en WhatsApp y no en la web. El backend lo parsea en
 *                  `app/lib/atribucion.js` y lo guarda en `usuarios.origen`.
 *
 * SOBRE EL PAR DERIVADO, que es la decisión discutible de este archivo. Cuando alguien llega sin
 * ningún UTM, el link a la app sale con `utm_source=<lo que diga el referrer, o 'directo'>` y
 * `utm_medium=landing`. Eso NO es inventar una campaña: `utm_medium=landing` marca el salto
 * interno y lo deja distinguible de un inbound real de un solo `WHERE`. La alternativa —no
 * mandar nada— deja sin origen al 51% de las sesiones, que es el agujero que esto viene a tapar.
 * Lo que NUNCA se hace es pisar un `utm_source` que vino de afuera.
 */

export type Atribucion = {
  /** Params a propagar en el salto a app.neto.pe. Siempre trae al menos `utm_source`. */
  params: Record<string, string>;
  /** Etiqueta corta de origen para el texto de WhatsApp. Nunca vacía. */
  origen: string;
};

const CLAVE = 'neto:atribucion';

/** El origen cuando no hay UTM ni referrer que diga nada. No es un error: es un dato. */
export const ORIGEN_DESCONOCIDO = 'directo';

/**
 * El origen de quien entra por un link de referido (`neto.pe/r/CODE`), cuando el link no trae UTM.
 *
 * **Sale de la PÁGINA y no del link, y no es preferencia: medido el 2026-09-10.** El `_redirects`
 * de Cloudflare hace `302 /r/CODE → /r?ref=CODE` y descarta el query string entrante
 * (`curl -sSI "https://neto.pe/r/X?utm_source=y"` devuelve `Location: /r?ref=X`), así que un UTM
 * pegado al link de referido no llega nunca. Y el link lo reparten tres superficies (el bot, la
 * webapp y cualquiera que lo copie a mano): derivarlo acá lo cubre en un solo lugar.
 */
export const ORIGEN_REFERIDO = 'referido';

/**
 * Lo único que se propaga. Lista CERRADA a propósito: propagar el query string entero convierte
 * cualquier parámetro que alguien pegue en la URL en parte del link de salida, y eso es un vector
 * de ruido (y de cosas peores) sin ninguna ventaja. `ref` queda FUERA a propósito: el flujo de
 * referidos ya lo maneja por su cuenta en `/r` y meterlo acá le daría dos dueños.
 */
const LLAVES = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'gclid',
  'fbclid',
] as const;

/**
 * Normaliza un valor de atribución. Minúsculas, juego de caracteres acotado y tope de largo: lo
 * que sale de acá termina pegado a una URL Y dentro de un mensaje de WhatsApp, así que un valor
 * con espacios, comillas o un corchete rompería el parser del otro lado. Devuelve `''` si no
 * queda nada utilizable, que es lo mismo que no tener el parámetro.
 */
export const sanear = (v: string | null | undefined): string =>
  (v ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 40);

/**
 * Clasifica el referrer a una etiqueta de canal. Devuelve `''` cuando no hay referrer o cuando es
 * la propia landing (navegación interna: ahí lo que manda es lo que ya estaba guardado).
 *
 * El ORDEN de las ramas es la definición, y las dos primeras importan: `gemini.google.com` tiene
 * que resolverse antes que el `google` genérico, o un usuario de Gemini se cuenta como búsqueda
 * orgánica. Lo que no está en la lista cae a su propio hostname, que es más útil que 'otro'.
 */
export const clasificarReferrer = (referrer: string | null | undefined): string => {
  if (!referrer) return '';
  let h: string;
  try {
    h = new URL(referrer).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
  if (h === 'neto.pe' || h.endsWith('.neto.pe')) return '';
  if (h === 'chatgpt.com' || h.endsWith('.chatgpt.com') || h.includes('openai')) return 'chatgpt.com';
  if (h.startsWith('gemini.') || h.includes('bard.google')) return 'gemini';
  if (h.includes('perplexity')) return 'perplexity';
  if (h.includes('copilot')) return 'copilot';
  if (h.includes('instagram')) return 'ig';
  if (h.includes('facebook') || h === 'fb.com') return 'fb';
  if (h.includes('tiktok')) return 'tiktok';
  if (h === 't.co' || h === 'x.com' || h.endsWith('.x.com') || h.includes('twitter')) return 'x';
  if (h.includes('linkedin') || h === 'lnkd.in') return 'linkedin';
  if (h.includes('whatsapp') || h.endsWith('wl.co')) return 'whatsapp';
  if (h.includes('google')) return 'google';
  if (h.includes('bing')) return 'bing';
  if (h.includes('duckduckgo')) return 'duckduckgo';
  return sanear(h) || '';
};

/** Lee de la URL SOLO las llaves propagables, saneadas. Las vacías no entran. */
const deLaUrl = (search: string): Record<string, string> => {
  const q = new URLSearchParams(search);
  const out: Record<string, string> = {};
  for (const k of LLAVES) {
    const v = sanear(q.get(k));
    if (v) out[k] = v;
  }
  return out;
};

const leerGuardada = (): Atribucion | null => {
  try {
    const raw = sessionStorage.getItem(CLAVE);
    if (!raw) return null;
    const j = JSON.parse(raw);
    if (!j || typeof j.origen !== 'string' || typeof j.params !== 'object' || !j.params) return null;
    return { params: j.params as Record<string, string>, origen: j.origen };
  } catch {
    // sessionStorage puede tirar (modo privado, cookies bloqueadas). Sin almacén se sigue
    // funcionando, sólo se pierde la persistencia entre navegaciones internas.
    return null;
  }
};

/**
 * Resuelve la atribución de ESTA visita y la deja guardada. Idempotente y baratísima, así que se
 * puede llamar en el mount de cualquier componente.
 *
 * La regla de precedencia, en una línea: **una visita que trae UTM pisa lo guardado; una que no
 * trae nada, no.** Sin eso, navegar internamente tras entrar con `?utm_source=ig` machacaría el
 * `ig` con un `directo`, que es el bug que esta función existe para no tener.
 *
 * `porDefecto` es el origen que implica la PÁGINA misma (hoy solo `/r`, que es `referido`). Va
 * después del UTM —un link de referido que alguien pegó en su bio con `?utm_source=ig` sigue
 * siendo `ig`— y antes del referrer, porque "vino desde WhatsApp" dice menos que "vino por un
 * referido". No pisa lo guardado: primer toque dentro de la sesión, igual que el resto.
 */
export const capturarAtribucion = (porDefecto?: string): Atribucion => {
  const defecto = sanear(porDefecto);
  if (typeof window === 'undefined') {
    const o = defecto || ORIGEN_DESCONOCIDO;
    return { params: { utm_source: o, utm_medium: 'landing' }, origen: o };
  }

  const entrante = deLaUrl(window.location.search);
  const guardada = leerGuardada();

  // Nada nuevo en la URL y ya hay algo guardado → lo guardado manda. Este `return` es lo que
  // hace que el UTM sobreviva a `<Link>`.
  if (!Object.keys(entrante).length && guardada) return guardada;

  const params = { ...entrante };
  const porReferrer = clasificarReferrer(typeof document !== 'undefined' ? document.referrer : '');

  // Si el referrer no dice nada y había algo guardado, se respeta: una recarga en medio de la
  // sesión no convierte a alguien de Instagram en 'directo'.
  const origen = params.utm_source || defecto || porReferrer || guardada?.origen || ORIGEN_DESCONOCIDO;

  if (!params.utm_source) {
    // El par derivado. `utm_medium` sólo se completa si no vino uno de afuera.
    params.utm_source = origen;
    if (!params.utm_medium) params.utm_medium = 'landing';
  }

  const atr: Atribucion = { params, origen };
  try {
    sessionStorage.setItem(CLAVE, JSON.stringify(atr));
  } catch {
    /* sin almacén se sigue funcionando, ver leerGuardada */
  }
  return atr;
};

/**
 * Pega los params de atribución a una URL. **No pisa lo que la URL ya trae**: el caso real es
 * `appReferralUrl(code)`, que llega con su `?ref=CODE` y no debe perderlo ni duplicarlo.
 */
export const conAtribucion = (url: string, atr: Atribucion | null): string => {
  if (!atr) return url;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  for (const [k, v] of Object.entries(atr.params)) {
    if (!u.searchParams.has(k)) u.searchParams.set(k, v);
  }
  return u.toString();
};

/**
 * La etiqueta que va dentro del texto de WhatsApp: `hero` pasa a `hero|ig`.
 *
 * El separador es `|` y el formato lo lee `app/lib/atribucion.js` del backend. Dos propiedades
 * que ese parser necesita y por eso se fijan acá: la posición va PRIMERA (así un mensaje viejo,
 * `[hero]` sin origen, sigue dando la posición) y los dos campos están saneados, o sea sin
 * espacios ni corchetes que puedan cerrar el par antes de tiempo.
 *
 * Con `atr` en null devuelve la posición sola, que es exactamente el link de hoy. El primer
 * render del HTML estático cae por acá.
 */
export const etiquetaCta = (posicion: string, atr: Atribucion | null): string => {
  const o = atr ? sanear(atr.origen) : '';
  return o ? `${posicion}|${o}` : posicion;
};

/**
 * Atribuye un link que YA está en el DOM: el que sale de un string de HTML (cuerpo del blog,
 * respuestas de la FAQ) y por eso no puede pasar por `useCtaHrefs`.
 *
 *   · `app.neto.pe`  → se le pegan los params, igual que `conAtribucion`.
 *   · `wa.me`        → una etiqueta SIN origen (`[blog]`) pasa a `[blog|ig]`. Una que ya trae
 *                      origen no se toca: no hay caso en que re-etiquetar sea correcto.
 *   · cualquier otro → intacto.
 *
 * El texto se re-codifica con `encodeURIComponent`, no con `searchParams.set`: este último escribe
 * los espacios como `+`, y el texto prellenado de WhatsApp no garantiza leerlo como espacio. Los
 * demás params y el `#hash` se conservan (lo encontró la revisión adversarial: la primera versión
 * los tiraba). Se etiqueta solo el PRIMER corchete, que es también el único que lee el parser del
 * backend (`msg.match` sin `g`).
 */
export const atribuirHref = (href: string, atr: Atribucion | null): string => {
  if (!atr || !href) return href;
  let u: URL;
  try {
    u = new URL(href);
  } catch {
    return href;
  }
  if (u.hostname === 'app.neto.pe') return conAtribucion(href, atr);
  if (u.hostname !== 'wa.me') return href;
  const texto = u.searchParams.get('text');
  if (!texto) return href;
  const nuevo = texto.replace(/\[([a-z][a-z0-9-]{1,23})\]/, (_, pos: string) => `[${etiquetaCta(pos, atr)}]`);
  if (nuevo === texto) return href;
  const qs = [...u.searchParams]
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(k === 'text' ? nuevo : v)}`)
    .join('&');
  return `${u.origin}${u.pathname}?${qs}${u.hash}`;
};
