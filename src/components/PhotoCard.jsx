import { assetUrl, buildSrcSet } from '../lib/assets';

/**
 * Tarjeta de una foto dentro del carousel del timeline.
 *
 * Decisiones de diseño:
 *  - La ALTURA es FIJA (no depende de la foto). Así las fotos verticales y
 *    horizontales conviven sin que el carousel "salte" al pasar de una a otra.
 *  - La foto va con object-contain (nunca se recorta: no queremos cortar caras)
 *    y detrás se pone la misma foto borrosa para rellenar el espacio sobrante.
 *  - Sin textos encima de la foto: la frase de la etapa ya se anuncia arriba y
 *    el caption va debajo.
 *
 * Decisión de RENDIMIENTO (importante):
 *  El fondo borroso es un filtro CSS caro. Si lo dibujáramos en las 16 fotos a
 *  la vez, el celular tiene que recalcular 16 desenfoques en cada cuadro del
 *  desplazamiento y el carousel se traba. Por eso solo la foto ACTIVA lo lleva
 *  (prop `conFondo`); las de los costados, que además están atenuadas y más
 *  chicas, usan un color plano que no cuesta nada.
 *
 * @param {Object}   props.photo      objeto de src/content/photos.js
 * @param {boolean}  props.esPrimera  la primera del timeline carga con eager
 * @param {boolean}  props.conFondo   dibujar el fondo borroso (solo la activa)
 * @param {() => void} props.onOpen   abrir esta foto en el Lightbox
 */
export default function PhotoCard({ photo, esPrimera = false, conFondo = false, onOpen }) {
  const url = assetUrl(photo.src);
  const srcSet = buildSrcSet(photo.src);

  // Si no se escribió un alt, usamos uno genérico para lectores de pantalla.
  const textoAlt = photo.alt?.trim() || 'Una foto de nuestra historia';

  return (
    <figure className="flex h-full flex-col">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver más grande: ${textoAlt}`}
        className="group relative block w-full overflow-hidden rounded-xl border border-oro/25
                   bg-[#150a29] shadow-glow
                   h-[clamp(300px,58svh,430px)] sm:h-[clamp(320px,52svh,440px)]"
      >
        {/* Relleno borroso: la misma foto, ampliada. Solo en la foto activa. */}
        {conFondo && (
          <span
            aria-hidden="true"
            className="absolute inset-0 scale-125 bg-cover bg-center opacity-60 blur-lg"
            style={{
              backgroundImage: `url(${url})`,
              // Lo empujamos a su propia capa del compositor para que el
              // desenfoque se calcule una vez y no en cada cuadro.
              transform: 'scale(1.25) translateZ(0)',
            }}
          />
        )}

        {/* La foto real, completa y sin recortes */}
        <img
          src={url}
          srcSet={srcSet}
          alt={textoAlt}
          loading={esPrimera ? 'eager' : 'lazy'}
          decoding="async"
          fetchpriority={esPrimera ? 'high' : 'auto'}
          draggable="false"
          className="relative h-full w-full object-contain"
        />

        {/* Lupa que aparece al pasar el mouse (solo en escritorio) */}
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 rounded-full border border-oro/40 bg-black/50 px-2 py-1
                     font-ui text-xs text-oro opacity-0 transition-opacity duration-200
                     group-hover:opacity-100"
        >
          ⤢
        </span>
      </button>

      {/* Caption debajo de la foto — altura mínima fija para que no salte */}
      <figcaption className="mt-4 min-h-[3.5rem] px-2 text-center text-base italic leading-snug text-rosa/80 sm:text-lg">
        {photo.caption}
      </figcaption>
    </figure>
  );
}
