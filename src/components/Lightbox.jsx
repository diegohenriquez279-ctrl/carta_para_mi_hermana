import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assetUrl, buildSrcSet } from '../lib/assets';
import { stageLabels } from '../content/photos';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

/**
 * Visor de foto a pantalla completa.
 *
 * Accesibilidad:
 *  - role="dialog" + aria-modal, el foco entra al botón de cerrar.
 *  - Teclado: ← → para navegar, Esc para cerrar.
 *  - Al cerrarse devuelve el foco al elemento que lo abrió.
 *
 * @param {Array}  props.photos    lista completa (ya ordenada) de fotos
 * @param {number} props.indice    índice de la foto abierta, o null si está cerrado
 * @param {Function} props.onClose
 * @param {Function} props.onPrev
 * @param {Function} props.onNext
 */
export default function Lightbox({ photos, indice, onClose, onPrev, onNext }) {
  const abierto = indice !== null && indice !== undefined;
  const photo = abierto ? photos[indice] : null;
  const refCerrar = useRef(null);
  const refFocoPrevio = useRef(null);
  const movimientoReducido = usePrefersReducedMotion();

  // Bloquea el scroll del fondo y maneja el teclado mientras está abierto.
  useEffect(() => {
    if (!abierto) return;

    refFocoPrevio.current = document.activeElement;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function alPresionar(e) {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowLeft') onPrev?.();
      if (e.key === 'ArrowRight') onNext?.();
    }
    window.addEventListener('keydown', alPresionar);

    // El foco entra al diálogo
    refCerrar.current?.focus();

    return () => {
      window.removeEventListener('keydown', alPresionar);
      document.body.style.overflow = overflowPrevio;
      // Devolvemos el foco a donde estaba antes de abrir
      refFocoPrevio.current?.focus?.();
    };
  }, [abierto, onClose, onPrev, onNext]);

  const hayAnterior = abierto && indice > 0;
  const haySiguiente = abierto && indice < photos.length - 1;

  return (
    <AnimatePresence>
      {abierto && photo && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ampliada, etapa ${stageLabels[photo.stage] ?? photo.stage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl"
          // Click en el fondo cierra; click en el contenido no (stopPropagation abajo)
          onClick={onClose}
        >
          {/* Barra superior */}
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-cursiva text-3xl text-oro">
              {stageLabels[photo.stage] ?? photo.stage}
            </span>
            <button
              ref={refCerrar}
              type="button"
              onClick={onClose}
              aria-label="Cerrar la foto"
              className="boton-magico px-4 py-2 text-base"
            >
              ✕
            </button>
          </div>

          {/* Foto grande */}
          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={photo.src}
                src={assetUrl(photo.src)}
                srcSet={buildSrcSet(photo.src)}
                alt={photo.alt?.trim() || `Foto de la etapa ${stageLabels[photo.stage] ?? photo.stage}`}
                initial={{ opacity: 0, scale: movimientoReducido ? 1 : 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: movimientoReducido ? 0.15 : 0.3 }}
                className="max-h-full max-w-full rounded-lg object-contain shadow-glow"
              />
            </AnimatePresence>

            {/* Flecha anterior */}
            <button
              type="button"
              onClick={onPrev}
              disabled={!hayAnterior}
              aria-label="Foto anterior"
              className="boton-magico absolute left-2 top-1/2 -translate-y-1/2 px-3 py-4 text-xl
                         disabled:opacity-20 sm:left-6"
            >
              ◀
            </button>

            {/* Flecha siguiente */}
            <button
              type="button"
              onClick={onNext}
              disabled={!haySiguiente}
              aria-label="Foto siguiente"
              className="boton-magico absolute right-2 top-1/2 -translate-y-1/2 px-3 py-4 text-xl
                         disabled:opacity-20 sm:right-6"
            >
              ▶
            </button>
          </div>

          {/* Pie: caption + contador */}
          <div className="px-6 py-6 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="mx-auto max-w-2xl text-lg italic leading-snug text-rosa/85">
              {photo.caption}
            </p>
            {/* Solo el contador: la etapa ya se muestra arriba */}
            <p className="mt-3 font-ui text-xs uppercase tracking-[0.25em] text-oro/50">
              {indice + 1} / {photos.length}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
