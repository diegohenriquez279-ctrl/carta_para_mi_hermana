import { assetUrl, buildSrcSet } from '../lib/assets';
import { stageLabels } from '../content/photos';

/**
 * Tarjeta de una foto dentro del carousel del timeline.
 *
 * Decisiones de diseño importantes:
 *  - La ALTURA es FIJA (no depende de la foto). Así las fotos verticales y
 *    horizontales conviven sin que el carousel "salte" al pasar de una a otra.
 *  - La foto va con object-contain (nunca se recorta: no queremos cortar caras)
 *    y detrás se pone la misma foto borrosa para rellenar el espacio sobrante.
 *  - Sin textos encima de la foto: la etapa ya se anuncia arriba del carousel
 *    y el caption va debajo. La foto se ve limpia.
 *
 * @param {Object}   props.photo      objeto de src/content/photos.js
 * @param {boolean}  props.esPrimera  la primera del timeline carga con eager
 * @param {() => void} props.onOpen   abrir esta foto en el Lightbox
 */
export default function PhotoCard({ photo, esPrimera = false, onOpen }) {
  const url = assetUrl(photo.src);
  const srcSet = buildSrcSet(photo.src);

  // Si Diego no escribió un alt, armamos uno genérico para lectores de pantalla.
  const textoAlt =
    photo.alt?.trim() || `Foto de la etapa ${stageLabels[photo.stage] ?? photo.stage}`;

  return (
    <figure className="flex h-full flex-col">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Ver más grande: ${textoAlt}`}
        className="group relative block w-full overflow-hidden rounded-xl border border-oro/25
                   bg-[#150a29] shadow-glow transition-shadow duration-300 hover:shadow-glow-fuerte
                   h-[clamp(300px,58svh,430px)] sm:h-[clamp(320px,52svh,440px)]"
      >
        {/* Relleno borroso: la misma foto, ampliada y oscurecida */}
        <span
          aria-hidden="true"
          className="absolute inset-0 scale-125 bg-cover bg-center opacity-60 blur-xl saturate-150"
          style={{ backgroundImage: `url(${url})` }}
        />

        {/* La foto real, completa y sin recortes */}
        <img
          src={url}
          srcSet={srcSet}
          alt={textoAlt}
          loading={esPrimera ? 'eager' : 'lazy'}
          decoding={esPrimera ? 'sync' : 'async'}
          fetchpriority={esPrimera ? 'high' : 'auto'}
          className="relative h-full w-full object-contain transition-transform duration-500
                     ease-suave group-hover:scale-[1.03]"
        />

        {/* Lupa que aparece al pasar el mouse */}
        <span
          aria-hidden="true"
          className="absolute right-3 top-3 rounded-full border border-oro/40 bg-black/50 px-2 py-1
                     font-ui text-xs text-oro opacity-0 transition-opacity duration-300
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
