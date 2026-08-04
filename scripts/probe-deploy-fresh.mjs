// ¿La landing que sirve neto.pe está fresca respecto de `main`?
//
// Era el único deployable de Neto sin probe de frescura. El webapp tiene
// `qa-e2e/probe-deploy-fresh.mjs` (contra /api/version de Vercel) y el backend
// tiene `qa-e2e/backend-deploy-fresh.mjs` (contra /version de Railway). Acá no
// hay endpoint que preguntar: un static export no ejecuta nada, así que el SHA
// desplegado hay que pedírselo a la API de Cloudflare.
//
// Esto importa más acá que en los otros dos, porque el modo de falla ya está
// escrito en el CLAUDE.md de la landing y en el propio deploy-config:
// **"Cloudflare a veces skipea deploys"**. Ese es el escenario que este probe
// convierte en un exit 1, en vez de en un `curl -I` que devuelve 200 sin decir
// nada sobre QUÉ build está detrás de ese 200.
//
// La pregunta que contesta es una sola y es la correcta: **¿el commit que hoy es
// `main` tiene un deployment de producción EXITOSO en Cloudflare?** Las tres
// formas de que la respuesta sea "no" salen con su propio mensaje:
//   1. No existe deployment para ese commit → el skip documentado.
//   2. Existe y su build FALLÓ → neto.pe sirve el build anterior, y la única
//      señal hoy es un correo que se pierde.
//   3. Existe y sigue construyendo → no es falla, es un deploy en vuelo.
//
// No se filtra por carpeta (a diferencia del probe del webapp): el repo
// `neto-landing` ES la landing, así que todo commit en `main` debería desplegar.
//
// `main` se lee del repo LOCAL con `fs`, sin salir a la red y sin subprocesos.
// Eso tiene una consecuencia honesta y por eso está contemplada abajo: si el
// `main` local quedó ATRÁS del remoto, el probe no puede afirmar frescura y sale
// con 2 (indeterminado) en vez de con un verde falso.
//
// Exit 0 = fresco (o deploy en vuelo). Exit 1 = STALE. Exit 2 = indeterminado
// (credenciales, red, o el main local no sirve como referencia).
//
// Uso:
//   node scripts/probe-deploy-fresh.mjs
//
// Credenciales, en este orden: variables de entorno CF_ACCOUNT_ID /
// CF_PAGES_TOKEN, o el archivo ~/.config/neto/cloudflare.env (mismo patrón que
// qa.env y backup.env).
//
// Nota: se usa `process.exitCode` (no `process.exit()`). En Windows, salir de
// golpe mientras el socket keep-alive de fetch aún se cierra dispara una
// assertion de libuv y devuelve 127 en vez del código real.

import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const PROYECTO = process.env.CF_PAGES_PROJECT || 'neto-landing';
const RAMA = process.env.NETO_LANDING_BRANCH || 'main';
// Un commit de hace menos de esto puede estar todavía construyendo. La landing
// tarda ~3 min según el deploy-config; 10 da margen a la cola de Cloudflare.
const IN_FLIGHT_MIN = Number(process.env.NETO_INFLIGHT_MIN ?? 10);

const short = (s) => (s ? s.slice(0, 7) : s);
function done(code, verdict, extra = {}) {
  console.log(JSON.stringify({ verdict, ...extra }, null, 2));
  process.exitCode = code;
  return code;
}

/** Credenciales de Cloudflare: entorno primero, después el archivo de config. */
function credenciales() {
  let { CF_ACCOUNT_ID: cuenta, CF_PAGES_TOKEN: token } = process.env;
  if (cuenta && token) return { cuenta, token, fuente: 'env' };
  const ruta = join(homedir(), '.config', 'neto', 'cloudflare.env');
  try {
    for (const linea of readFileSync(ruta, 'utf8').split('\n')) {
      const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(linea);
      if (!m) continue;
      if (m[1] === 'CF_ACCOUNT_ID' && !cuenta) cuenta = m[2];
      if (m[1] === 'CF_PAGES_TOKEN' && !token) token = m[2];
    }
  } catch {
    // El mensaje útil lo arma el caller, que sabe qué faltó.
  }
  return { cuenta, token, fuente: 'archivo' };
}

/**
 * SHA de la rama en el repo local, leído de `.git` con fs.
 * Cubre las dos formas en que git guarda una ref: archivo suelto y `packed-refs`
 * (después de un `git gc` la ref suelta desaparece y solo queda la empaquetada).
 */
function shaLocal(rama) {
  const suelta = join(RAIZ, '.git', 'refs', 'heads', rama);
  try {
    return readFileSync(suelta, 'utf8').trim();
  } catch { /* puede estar empaquetada */ }
  try {
    for (const linea of readFileSync(join(RAIZ, '.git', 'packed-refs'), 'utf8').split('\n')) {
      const m = new RegExp(`^([0-9a-f]{40}) refs/heads/${rama}$`).exec(linea.trim());
      if (m) return m[1];
    }
  } catch { /* sin packed-refs */ }
  return null;
}

/**
 * Cuándo quedó ese commit en la punta de la rama, según el reflog local.
 * Sirve solo para la gracia de "deploy en vuelo": si no hay reflog (repo clonado
 * con --no-reflog, o reflog podado) devolvemos null y el probe no da gracia, que
 * es el lado seguro: prefiere un rojo temprano a un verde tardío.
 */
function momentoLocal(sha) {
  try {
    const lineas = readFileSync(join(RAIZ, '.git', 'logs', 'HEAD'), 'utf8').trim().split('\n');
    for (let i = lineas.length - 1; i >= 0; i--) {
      const m = /^([0-9a-f]{40}) ([0-9a-f]{40}) .*? (\d{9,}) [+-]\d{4}\t/.exec(lineas[i]);
      if (m && m[2] === sha) return Number(m[3]) * 1000;
    }
  } catch { /* sin reflog */ }
  return null;
}

async function main() {
  const { cuenta, token, fuente } = credenciales();
  if (!cuenta || !token) {
    return done(2, 'faltan credenciales de Cloudflare', {
      falta: [!cuenta && 'CF_ACCOUNT_ID', !token && 'CF_PAGES_TOKEN'].filter(Boolean),
      hint: 'Exportalas, o poné CF_ACCOUNT_ID= y CF_PAGES_TOKEN= en ~/.config/neto/cloudflare.env (chmod 600).',
    });
  }

  const local = shaLocal(RAMA);
  if (!local) {
    return done(2, `no se pudo leer refs/heads/${RAMA} del repo local`, { raiz: RAIZ });
  }

  // Deployments de PRODUCCIÓN. Se piden varios y se filtra por `environment`:
  // un preview de otra rama no puede hacerse pasar por el deploy de prod.
  let deploys;
  try {
    const url = `https://api.cloudflare.com/client/v4/accounts/${cuenta}/pages/projects/${PROYECTO}/deployments?per_page=25`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.success) {
      return done(2, 'la API de Cloudflare rechazó la consulta', {
        status: res.status,
        proyecto: PROYECTO,
        errores: body?.errors,
        fuenteCredenciales: fuente,
        hint: 'El proyecto de Pages es "neto-landing" (NO "neto-site", que no existe). ¿El token sigue vivo?',
      });
    }
    deploys = (body.result || []).filter((d) => d.environment === 'production');
  } catch (e) {
    return done(2, 'no se pudo consultar la API de Cloudflare', { error: String(e).split('\n')[0] });
  }

  if (!deploys.length) {
    return done(2, 'Cloudflare no devolvió ningún deployment de producción', { proyecto: PROYECTO });
  }

  const sha = (d) => d.deployment_trigger?.metadata?.commit_hash || null;
  const estado = (d) => d.latest_stage?.status || null;
  const ultimo = deploys[0];
  const mio = deploys.find((d) => sha(d) === local);

  // ── El commit local ya tiene deployment: su estado decide ──────────────────
  if (mio) {
    const st = estado(mio);
    if (st === 'success') {
      // Si además es el más nuevo, no hay nada pendiente. Si NO lo es, Cloudflare
      // desplegó algo posterior: el main local está atrás y no puede arbitrar.
      if (sha(ultimo) === local) {
        return done(0, 'PASS', { sha: short(local), estado: st, desplegado: mio.created_on });
      }
      return done(2, 'el main local está ATRÁS de lo desplegado (no se puede afirmar frescura)', {
        shaLocal: short(local),
        shaDesplegado: short(sha(ultimo)),
        hint: 'Corré `git fetch origin && git status` en products/neto/landing y volvé a probar.',
      });
    }
    if (st === 'failure' || st === 'canceled') {
      return done(1, `STALE: el deploy del commit actual terminó en "${st}"`, {
        sha: short(local),
        etapa: mio.latest_stage?.name,
        creado: mio.created_on,
        hint: 'neto.pe está sirviendo el build ANTERIOR. Revisar los logs en el dashboard de Cloudflare Pages.',
      });
    }
    return done(0, 'PASS', {
      motivo: `deploy en vuelo (etapa ${mio.latest_stage?.name}, estado ${st})`,
      sha: short(local),
    });
  }

  // ── No hay deployment para el commit local ────────────────────────────────
  // Puede ser el skip documentado, o que el push sea de hace un minuto.
  const ts = momentoLocal(local);
  const edadMin = ts ? Math.round((Date.now() - ts) / 60000) : null;
  if (edadMin !== null && edadMin < IN_FLIGHT_MIN) {
    return done(0, 'PASS', {
      motivo: `commit local de hace ${edadMin} min (< ${IN_FLIGHT_MIN}): Cloudflare todavía puede no haberlo tomado`,
      sha: short(local),
      ultimoDesplegado: short(sha(ultimo)),
    });
  }

  return done(1, 'STALE: el commit actual de main no tiene deployment en Cloudflare', {
    shaLocal: short(local),
    ultimoDesplegado: short(sha(ultimo)),
    ultimoDesplegadoEstado: estado(ultimo),
    ultimoDesplegadoCreado: ultimo.created_on,
    edadDelCommitLocalMin: edadMin,
    hint: 'Este es el "Cloudflare a veces skipea deploys" del CLAUDE.md. Re-disparar desde el dashboard, o `git commit --allow-empty` + push.',
  });
}

await main();
