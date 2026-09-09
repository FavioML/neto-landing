#!/usr/bin/env node
// Verifica que la serie de baselines GEO trimestrales esté completa en docs/.
//
// Por qué existe
// --------------
// La tarea `geo-baseline-neto-quarterly` corre el día 2 de febrero, mayo, agosto y noviembre, y su
// paso 7 manda escribir `docs/geo-baseline-YYYY-MM.md`. El 2026-08-02 el registro del scheduler
// dice que corrió (`lastRunAt: 2026-08-02T15:10:21Z`) y ese archivo **no se escribió**: en `docs/`
// solo estaba el baseline inicial de mayo. Nadie se enteró durante cinco semanas, y el motivo es
// estructural, no un descuido:
//
//   · El paso 7 estaba escrito y nada comprobaba su efecto. Un paso que solo está escrito no se
//     ejecuta, y si además nada mira el resultado, no falla: simplemente no pasa.
//   · El paso 1 lee "el baseline más reciente", así que la ausencia del de agosto **se auto-oculta**:
//     la corrida de noviembre habría leído el de mayo y comparado contra él como si nada faltara.
//     El defecto se borra sus propias huellas en la corrida siguiente.
//   · El paso 9 reporta un resumen al usuario. Ese reporte puede salir aunque el 7 no haya escrito
//     nada, así que la corrida se ve exitosa desde afuera.
//
// Es la misma clase que el paso 0 del canary de deploys y que el cortacircuitos de
// `vortik-content-weekly`: la única forma de arreglar un paso que no se ejecuta es un exit 1 que se
// pueda probar por mutación.
//
// Qué comprueba
// -------------
// Deriva de forma determinista qué baselines DEBERÍAN existir (todos los trimestres desde el inicial
// hasta el último día 2 ya vencido) y exige el archivo de cada uno. No lee el estado del scheduler a
// propósito: ese estado es lo que ya mintió, porque `lastRunAt` marcó una corrida que no dejó nada.
//
// Una corrida que se perdió y no se puede reconstruir se declara EN SU PROPIO ARCHIVO con la línea
// `**Estado:** CORRIDA PERDIDA` y un motivo. Eso es deliberado: la alternativa sería una lista de
// excepciones dentro de este script, y entonces el hueco viviría lejos del lugar donde se nota.
// Declarado así, el archivo existe, la serie está completa, la comparativa del trimestre siguiente
// sabe que ahí no hay datos, y este guard lo sigue nombrando en cada corrida para que no se olvide.
//
// Exit codes:
//   0 = la serie está completa (los baselines perdidos declarados se listan igual, no se ocultan)
//   1 = falta al menos un baseline que debía existir, o uno existe pero está vacío o incompleto
//   2 = no se pudo determinar (falta el directorio docs/)
//
// Uso:
//   node scripts/check-geo-baseline.mjs [--docs=<ruta>] [--hoy=YYYY-MM-DD]

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opt = (n, d) => {
  const hit = args.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.slice(n.length + 3) : d;
};

const AQUI = dirname(fileURLToPath(import.meta.url));
const DOCS = resolve(opt('docs', join(AQUI, '..', 'docs')));

// El baseline inicial y los meses de corrida son los que declara el SKILL.md de la tarea. Si alguna
// vez cambia la cadencia, cambia acá y el guard sigue siendo cierto.
const INICIAL = { anio: 2026, mes: 5 };
const MESES_DE_CORRIDA = [2, 5, 8, 11];
const DIA_DE_CORRIDA = 2;
// Un baseline real de mayo pesa ~16 KB. 500 bytes no valida contenido, solo descarta el archivo
// vacío o el placeholder de una línea que dejaría pasar una corrida que abortó a mitad.
const MINIMO_BYTES = 500;

const hoyStr = opt('hoy', null);
const HOY = hoyStr ? new Date(`${hoyStr}T12:00:00Z`) : new Date();
if (Number.isNaN(HOY.getTime())) {
  console.error(JSON.stringify({ verdict: 'SIN_VEREDICTO', motivo: `--hoy no es una fecha válida: ${hoyStr}` }, null, 2));
  process.exit(2);
}

const salir = (code, payload) => {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(code);
};

try {
  if (!statSync(DOCS).isDirectory()) throw new Error('no es un directorio');
} catch (e) {
  salir(2, { verdict: 'SIN_VEREDICTO', motivo: `no se pudo leer ${DOCS}: ${e.message}` });
}

// Qué baselines debían existir: cada mes de corrida desde el inicial cuyo día 2 ya pasó.
const esperados = [];
for (let anio = INICIAL.anio; anio <= HOY.getUTCFullYear(); anio++) {
  for (const mes of MESES_DE_CORRIDA) {
    if (anio === INICIAL.anio && mes < INICIAL.mes) continue;
    const fecha = new Date(Date.UTC(anio, mes - 1, DIA_DE_CORRIDA, 12));
    if (fecha > HOY) continue;
    esperados.push(`${anio}-${String(mes).padStart(2, '0')}`);
  }
}

const presentes = new Set(
  readdirSync(DOCS)
    .map((f) => /^geo-baseline-(\d{4}-\d{2})\.md$/.exec(f))
    .filter(Boolean)
    .map((m) => m[1]),
);

const faltantes = [];
const incompletos = [];
const perdidosDeclarados = [];

for (const periodo of esperados) {
  if (!presentes.has(periodo)) {
    faltantes.push(periodo);
    continue;
  }
  const ruta = join(DOCS, `geo-baseline-${periodo}.md`);
  const texto = readFileSync(ruta, 'utf8');
  const declaraPerdida = /\*\*Estado:\*\*\s*CORRIDA PERDIDA/i.test(texto);
  if (declaraPerdida) {
    perdidosDeclarados.push(periodo);
    continue;
  }
  if (Buffer.byteLength(texto, 'utf8') < MINIMO_BYTES) {
    incompletos.push({ periodo, bytes: Buffer.byteLength(texto, 'utf8'), minimo: MINIMO_BYTES });
  }
}

const base = {
  docs: DOCS,
  hoy: HOY.toISOString().slice(0, 10),
  esperados,
  presentes: [...presentes].sort(),
  perdidos_declarados: perdidosDeclarados,
};

if (faltantes.length || incompletos.length) {
  salir(1, {
    verdict: 'SERIE_INCOMPLETA',
    motivo:
      'la tarea geo-baseline-neto-quarterly debía haber dejado un baseline por cada trimestre vencido y falta al menos uno. ' +
      'Si una corrida se perdió y no se puede reconstruir, escribe su archivo con la línea "**Estado:** CORRIDA PERDIDA" y el motivo, ' +
      'en vez de dejar el hueco.',
    faltantes,
    incompletos,
    ...base,
  });
}

salir(0, {
  verdict: 'SERIE_COMPLETA',
  ...base,
});
