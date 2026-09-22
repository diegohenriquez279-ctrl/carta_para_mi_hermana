// ---------------------------------------------------------------------------
// Comprime las fotos de public/media/photos.
//
// Uso:
//     npm run fotos
//
// Qué hace con cada .jpg:
//   · lo achica a 1400 px de lado más largo (más que eso no se nota en pantalla),
//   · lo recomprime con calidad 80 y mozjpeg,
//   · le borra los metadatos (ubicación GPS, modelo del celular, etc.),
//   · si el resultado pesa MÁS que el original, deja el original intacto.
//
// Guarda una copia de seguridad en _originales-sin-comprimir/ la primera vez,
// así siempre podés volver atrás. Esa carpeta no se sube al repo.
// ---------------------------------------------------------------------------

import { readdir, mkdir, copyFile, stat, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const CARPETA = 'public/media/photos';
const RESPALDO = '_originales-sin-comprimir';
const LADO_MAXIMO = 1400;
const CALIDAD = 80;

function aKB(bytes) {
  return Math.round(bytes / 1024);
}

const archivos = (await readdir(CARPETA)).filter((f) => /\.jpe?g$/i.test(f));

if (archivos.length === 0) {
  console.log('No encontré fotos en ' + CARPETA);
  process.exit(0);
}

if (!existsSync(RESPALDO)) await mkdir(RESPALDO, { recursive: true });

let antesTotal = 0;
let despuesTotal = 0;

for (const nombre of archivos) {
  const ruta = path.join(CARPETA, nombre);
  const pesoAntes = (await stat(ruta)).size;
  antesTotal += pesoAntes;

  // Respaldo (solo la primera vez que se toca cada foto)
  const rutaRespaldo = path.join(RESPALDO, nombre);
  if (!existsSync(rutaRespaldo)) await copyFile(ruta, rutaRespaldo);

  // Comprimimos a un archivo temporal para no pisar el original mientras se lee
  const temporal = ruta + '.tmp';
  await sharp(rutaRespaldo)
    .rotate() // respeta la orientación EXIF antes de borrar los metadatos
    .resize({
      width: LADO_MAXIMO,
      height: LADO_MAXIMO,
      fit: 'inside',
      withoutEnlargement: true, // nunca agranda una foto chica
    })
    .jpeg({ quality: CALIDAD, mozjpeg: true, progressive: true })
    .toFile(temporal);

  const pesoDespues = (await stat(temporal)).size;

  if (pesoDespues < pesoAntes) {
    await rename(temporal, ruta);
    despuesTotal += pesoDespues;
    const ahorro = Math.round((1 - pesoDespues / pesoAntes) * 100);
    console.log(
      `${nombre.padEnd(24)} ${String(aKB(pesoAntes)).padStart(4)} KB → ${String(aKB(pesoDespues)).padStart(4)} KB  (-${ahorro}%)`
    );
  } else {
    // El original ya estaba mejor comprimido: lo dejamos como está.
    const { unlink } = await import('node:fs/promises');
    await unlink(temporal);
    despuesTotal += pesoAntes;
    console.log(`${nombre.padEnd(24)} ${String(aKB(pesoAntes)).padStart(4)} KB → sin cambios`);
  }
}

console.log('\n' + '-'.repeat(52));
console.log(`Total: ${aKB(antesTotal)} KB → ${aKB(despuesTotal)} KB`);
console.log(`Ahorro: ${Math.round((1 - despuesTotal / antesTotal) * 100)}%`);
console.log(`\nLos originales quedaron respaldados en ${RESPALDO}/`);
