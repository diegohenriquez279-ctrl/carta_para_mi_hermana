// ---------------------------------------------------------------------------
// Helper de assets de /public
//
// ¿Por qué existe? Porque en GitHub Pages el sitio NO vive en la raíz del
// dominio sino en /NOMBRE-REPO/. Una ruta escrita a mano como
// "/media/photos/peques-01.jpg" funcionaría en `npm run dev` pero daría 404 en
// producción. `assetUrl()` le pega adelante el `base` de Vite automáticamente.
//
// Regla: TODA ruta a /public pasa por assetUrl().
// ---------------------------------------------------------------------------

/**
 * Convierte una ruta de /public en una URL válida en dev y en producción.
 * @param {string} ruta ej. '/media/photos/peques-01.jpg'
 * @returns {string}
 */
export function assetUrl(ruta = '') {
  if (!ruta) return '';
  // Si ya es una URL absoluta (http, https, data:), la dejamos como está.
  if (/^(https?:)?\/\//.test(ruta) || ruta.startsWith('data:')) return ruta;

  const base = import.meta.env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/${ruta.replace(/^\//, '')}`;
}

// ---------------------------------------------------------------------------
// TODO (Diego) — versiones @2x para pantallas retina
//
// Está TODO listo del lado del código: si ponés este flag en `true`, el sitio
// va a pedir automáticamente una versión "@2x" de cada foto.
//
// Para activarlo necesitás que junto a cada foto exista su gemela @2x:
//     public/media/photos/peques-01.jpg      <- versión normal  (ej. 800px de ancho)
//     public/media/photos/peques-01@2x.jpg   <- versión retina  (ej. 1600px de ancho)
//
// Cómo generarlas (elegí una):
//   a) A mano, en Photoshop / GIMP / Squoosh (https://squoosh.app).
//   b) Con ImageMagick, desde la carpeta public/media/photos:
//        for f in *.jpg; do
//          n="${f%.jpg}"
//          magick "$f" -resize 1600x1600\> -quality 82 "$n@2x.jpg"
//          magick "$f" -resize  800x800\>  -quality 82 "$n.jpg"
//        done
//
// Si el flag queda en `false`, se usa una sola imagen y todo funciona igual.
// ---------------------------------------------------------------------------
export const USAR_2X = false;

/**
 * Arma el atributo srcSet de una imagen (1x + 2x) si USAR_2X está activado.
 * @param {string} ruta ruta de la versión normal, ej. '/media/photos/peques-01.jpg'
 * @returns {string|undefined} valor para el atributo srcSet, o undefined
 */
export function buildSrcSet(ruta) {
  if (!USAR_2X || !ruta) return undefined;

  const punto = ruta.lastIndexOf('.');
  if (punto === -1) return undefined;

  const sinExtension = ruta.slice(0, punto);
  const extension = ruta.slice(punto);

  return `${assetUrl(ruta)} 1x, ${assetUrl(`${sinExtension}@2x${extension}`)} 2x`;
}
