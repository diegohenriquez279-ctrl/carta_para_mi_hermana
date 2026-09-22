import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { letter } from '../content/letter';

/**
 * Pantalla 2 — El libro/carta con páginas.
 *
 * Muestra una página a la vez sobre un pergamino translúcido, con flip 3D
 * entre páginas. Navegación con los botones ◀ / ▶, con las flechas del
 * teclado, o deslizando con el dedo.
 *
 * @param {() => void} props.onContinue  se llama al tocar "Sigamos…"
 */
export default function LetterBook({ onContinue }) {
  const paginas = letter.pages ?? [];
  const [indice, setIndice] = useState(0);
  // direccion: 1 = vamos hacia adelante, -1 = hacia atrás (define hacia dónde gira)
  const [direccion, setDireccion] = useState(1);
  const movimientoReducido = usePrefersReducedMotion();

  const esUltima = indice === paginas.length - 1;
  const refSigamos = useRef(null);

  // Si la carta es más alta que la pantalla (un poema largo, un celular chico),
  // el botón "Sigamos…" queda abajo del borde y ella no lo ve. Al llegar a la
  // última página lo traemos a la vista solo.
  useEffect(() => {
    if (!esUltima) return;
    const id = window.setTimeout(() => {
      refSigamos.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 700); // esperamos a que termine de aparecer el botón
    return () => window.clearTimeout(id);
  }, [esUltima]);

  const irA = useCallback(
    (nuevoIndice, dir) => {
      if (nuevoIndice < 0 || nuevoIndice >= paginas.length) return;
      setDireccion(dir);
      setIndice(nuevoIndice);
    },
    [paginas.length]
  );

  const siguiente = useCallback(() => irA(indice + 1, 1), [indice, irA]);
  const anterior = useCallback(() => irA(indice - 1, -1), [indice, irA]);

  // Navegación por teclado (accesibilidad)
  useEffect(() => {
    function alPresionar(e) {
      if (e.key === 'ArrowRight') siguiente();
      if (e.key === 'ArrowLeft') anterior();
    }
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [siguiente, anterior]);

  // Variantes de la animación de página.
  // Con "reducir movimiento" el flip 3D se reemplaza por un fade simple.
  const variantes = movimientoReducido
    ? {
        entra: { opacity: 0 },
        centro: { opacity: 1 },
        sale: { opacity: 0 },
      }
    : {
        entra: (dir) => ({ rotateY: dir > 0 ? 80 : -80, opacity: 0, x: dir > 0 ? 60 : -60 }),
        centro: { rotateY: 0, opacity: 1, x: 0 },
        sale: (dir) => ({ rotateY: dir > 0 ? -80 : 80, opacity: 0, x: dir > 0 ? -60 : 60 }),
      };

  const pagina = paginas[indice];
  if (!pagina) return null;

  return (
    <section
      className="flex min-h-[100svh] flex-col items-center justify-center px-4 py-10"
      aria-label="Carta"
    >
      {/* Escenario 3D: la perspectiva vive en el contenedor, no en la página */}
      <div className="w-full max-w-xl" style={{ perspective: 1600 }}>
        <div className="relative min-h-[22rem] sm:min-h-[26rem]">
          <AnimatePresence mode="wait" custom={direccion} initial={false}>
            <motion.article
              key={indice}
              custom={direccion}
              variants={variantes}
              initial="entra"
              animate="centro"
              exit="sale"
              transition={{ duration: movimientoReducido ? 0.25 : 0.55, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
              className="pergamino relative flex min-h-[22rem] flex-col rounded-lg px-7 py-9
                         text-[#3a2a18] sm:min-h-[26rem] sm:px-12 sm:py-12"
            >
              {/* Filigrana dorada en las esquinas */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-3 rounded-md border border-[#b9975b]/30"
              />

              <h2 className="mb-6 text-center font-cursiva text-4xl text-[#7a4b22] sm:text-5xl">
                {pagina.title}
              </h2>

              {/* Separador decorativo */}
              <span aria-hidden="true" className="mx-auto mb-7 block text-lg text-[#b9975b]">
                ❦
              </span>

              {/* Cuerpo: cada bloque separado por línea en blanco es un párrafo */}
              <div className="flex-1 space-y-4 text-lg leading-relaxed sm:text-xl">
                {String(pagina.body)
                  .split('\n\n')
                  .map((parrafo, i) => (
                    <p key={i} className="whitespace-pre-line">
                      {parrafo}
                    </p>
                  ))}
              </div>

              {/* Número de página */}
              <p className="mt-8 text-center font-ui text-xs tracking-widest text-[#8a6a42]">
                {indice + 1} / {paginas.length}
              </p>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>

      {/* --- Navegación ---------------------------------------------------- */}
      <div className="mt-6 flex items-center gap-6">
        <button
          type="button"
          onClick={anterior}
          disabled={indice === 0}
          aria-label="Página anterior"
          className="boton-magico px-4 py-2 text-lg disabled:cursor-not-allowed disabled:opacity-25
                     disabled:hover:bg-oro/5 disabled:hover:shadow-none"
        >
          ◀
        </button>

        {/* Puntitos indicadores */}
        <div className="flex gap-2" role="tablist" aria-label="Páginas de la carta">
          {paginas.map((p, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === indice}
              aria-label={`Ir a la página ${i + 1}: ${p.title}`}
              onClick={() => irA(i, i > indice ? 1 : -1)}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === indice ? 'w-5 bg-oro shadow-glow' : 'bg-oro/30 hover:bg-oro/60'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={siguiente}
          disabled={esUltima}
          aria-label="Página siguiente"
          className="boton-magico px-4 py-2 text-lg disabled:cursor-not-allowed disabled:opacity-25
                     disabled:hover:bg-oro/5 disabled:hover:shadow-none"
        >
          ▶
        </button>
      </div>

      {/* "Sigamos…" aparece solo al llegar a la última página */}
      <AnimatePresence>
        {esUltima && (
          <motion.button
            ref={refSigamos}
            type="button"
            onClick={onContinue}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="boton-magico mb-2 mt-8 font-serif text-base italic"
          >
            Sigamos…
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
