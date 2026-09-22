import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { AnimatePresence, motion } from 'framer-motion';
import PhotoCard from './PhotoCard';
import Lightbox from './Lightbox';
import useInView from '../hooks/useInView';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { photos as photosCrudas, stageLabels, stageOrder } from '../content/photos';

/**
 * Pequeño estallido de destellos que acompaña el cambio de etapa.
 * Son 8 puntitos con framer-motion: barato y suficiente para el efecto.
 */
function Destellos() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible">
      {Array.from({ length: 8 }).map((_, i) => {
        const angulo = (i / 8) * Math.PI * 2;
        const distancia = 46 + (i % 2) * 24;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
            animate={{
              opacity: [0, 1, 0],
              x: Math.cos(angulo) * distancia,
              y: Math.sin(angulo) * distancia,
              scale: [0.4, 1, 0.3],
            }}
            transition={{ duration: 1, delay: i * 0.04, ease: 'easeOut' }}
            className="absolute left-1/2 top-1/2 h-[3px] w-[3px] rounded-full bg-oro shadow-[0_0_8px_rgba(245,200,106,.9)]"
          />
        );
      })}
    </span>
  );
}

/**
 * Pantalla 4 — La línea de tiempo (el corazón de la experiencia).
 *
 * - Agrupa las fotos por etapa automáticamente.
 * - Carousel horizontal (embla) con snap foto por foto.
 * - Barra de progreso con una marca por foto: tocarla salta a esa foto.
 * - Al cambiar de etapa aparece su frase con fade + destellos.
 * - Click en una foto abre el Lightbox a pantalla completa.
 *
 * Acá no hay años ni fechas: el orden es el que tengan las fotos en
 * src/content/photos.js, tal cual están escritas.
 *
 * RENDIMIENTO — por qué el carousel está escrito así:
 *  1. El atenuado de las fotas de los costados se hace con TRANSICIONES CSS,
 *     no con framer-motion. Animar 16 tarjetas desde JavaScript en cada
 *     deslizamiento hacía que se trabara en el celular; el navegador resuelve
 *     las transiciones CSS solo, en el compositor.
 *  2. El fondo borroso de la tarjeta solo se dibuja en la foto activa
 *     (ver el comentario en PhotoCard.jsx).
 *  3. Solo usamos opacidad y transform, que no obligan a recalcular el layout.
 */
export default function Timeline() {
  const movimientoReducido = usePrefersReducedMotion();
  const [refSeccion, seccionEnVista] = useInView({ threshold: 0.15 });

  // --- 1. Datos derivados -------------------------------------------------
  // Respetamos el orden del archivo: mover una foto ahí la mueve acá.
  const fotos = photosCrudas;

  // Agrupación por etapa: [{ stage, desde, hasta, cantidad }]
  const grupos = useMemo(() => {
    const acumulado = [];
    fotos.forEach((f, i) => {
      const ultimo = acumulado[acumulado.length - 1];
      if (ultimo && ultimo.stage === f.stage) {
        ultimo.hasta = i;
        ultimo.cantidad += 1;
      } else {
        acumulado.push({
          stage: f.stage,
          desde: i,
          hasta: i,
          cantidad: 1,
          orden: stageOrder.indexOf(f.stage),
        });
      }
    });
    return acumulado;
  }, [fotos]);

  // --- 2. Carousel --------------------------------------------------------
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: false, // la foto activa siempre queda centrada
    loop: false,
    skipSnaps: false,
    duration: movimientoReducido ? 8 : 18, // más bajo = deslizamiento más ágil
  });

  const [seleccionado, setSeleccionado] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    const alSeleccionar = () => setSeleccionado(emblaApi.selectedScrollSnap());
    emblaApi.on('select', alSeleccionar);
    emblaApi.on('reInit', alSeleccionar);
    alSeleccionar();
    return () => {
      emblaApi.off('select', alSeleccionar);
      emblaApi.off('reInit', alSeleccionar);
    };
  }, [emblaApi]);

  const irA = useCallback((i) => emblaApi?.scrollTo(i), [emblaApi]);
  const anterior = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const siguiente = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Teclado dentro del carousel. No es un listener global: solo actúa cuando el
  // carousel tiene el foco, así no pelea con el Lightbox ni con la carta.
  const alPresionarEnCarousel = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        anterior();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        siguiente();
      }
    },
    [anterior, siguiente]
  );

  // --- 3. Etapa actual ----------------------------------------------------
  const fotoActual = fotos[seleccionado];
  const etapaActual = fotoActual?.stage;

  // --- 4. Lightbox --------------------------------------------------------
  const [indiceLightbox, setIndiceLightbox] = useState(null);
  const abrirLightbox = useCallback((i) => setIndiceLightbox(i), []);
  const cerrarLightbox = useCallback(() => setIndiceLightbox(null), []);
  const anteriorLightbox = useCallback(() => setIndiceLightbox((i) => (i > 0 ? i - 1 : i)), []);
  const siguienteLightbox = useCallback(
    () => setIndiceLightbox((i) => (i < fotos.length - 1 ? i + 1 : i)),
    [fotos.length]
  );

  // Al navegar dentro del Lightbox, el carousel de atrás sigue el mismo ritmo,
  // así al cerrarlo ella queda parada en la foto que estaba mirando.
  useEffect(() => {
    if (indiceLightbox !== null) irA(indiceLightbox);
  }, [indiceLightbox, irA]);

  if (fotos.length === 0) return null;

  // Porcentaje de avance de la barra de progreso.
  const avance = fotos.length > 1 ? (seleccionado / (fotos.length - 1)) * 100 : 100;
  const posicionDe = (i) => (fotos.length > 1 ? (i / (fotos.length - 1)) * 100 : 50);

  return (
    <section ref={refSeccion} aria-label="Línea de tiempo de fotos" className="relative py-16">
      {/* Encabezado de la sección */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={seccionEnVista ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="titulo-magico mb-3 text-center text-4xl sm:text-5xl"
      >
        Nuestra línea de tiempo
      </motion.h2>
      <p className="mb-10 text-center font-ui text-xs uppercase tracking-[0.3em] text-oro/50">
        Deslizá para recorrerla
      </p>

      {/* --- Frase de la etapa actual: cambia con fade + destellos --------- */}
      <div className="relative mb-6 flex min-h-[5.5rem] items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={etapaActual}
            initial={{ opacity: 0, y: movimientoReducido ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: movimientoReducido ? 0 : -12 }}
            transition={{ duration: movimientoReducido ? 0.2 : 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            {!movimientoReducido && <Destellos />}
            <span className="titulo-magico block text-center text-3xl leading-tight sm:text-5xl">
              {stageLabels[etapaActual] ?? etapaActual}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- Barra de progreso -------------------------------------------- */}
      <div className="mx-auto mb-8 w-full max-w-3xl px-6">
        <div
          className="relative h-7"
          role="group"
          aria-label="Saltar a una foto de la línea de tiempo"
        >
          {/* Riel */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[11px] h-[2px] rounded-full bg-oro/15"
          />

          {/* Relleno de progreso (transición CSS, no JS) */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-[11px] h-[2px] rounded-full bg-gradient-to-r from-rosa to-oro
                       shadow-[0_0_10px_rgba(245,200,106,.7)] transition-[width] duration-300 ease-suave"
            style={{ width: `${avance}%` }}
          />

          {/* Separadores entre etapas: marcan los capítulos sin escribir nada */}
          {grupos.slice(1).map((g) => (
            <span
              key={`sep-${g.stage}-${g.desde}`}
              aria-hidden="true"
              style={{ left: `${(posicionDe(g.desde) + posicionDe(g.desde - 1)) / 2}%` }}
              className="absolute top-[5px] h-[14px] w-px -translate-x-1/2 bg-oro/35"
            />
          ))}

          {/* Una marca por foto */}
          {fotos.map((foto, indice) => {
            const alcanzado = indice <= seleccionado;
            const esActual = indice === seleccionado;

            return (
              <button
                key={foto.src}
                type="button"
                onClick={() => irA(indice)}
                aria-label={`Ir a la foto ${indice + 1} de ${fotos.length}`}
                aria-current={esActual ? 'true' : undefined}
                style={{ left: `${posicionDe(indice)}%` }}
                /* El botón tiene padding para que el área táctil sea cómoda con
                   el dedo, aunque el puntito visible sea chiquito. */
                className="group absolute top-0 -translate-x-1/2 px-[9px] py-[6px]"
              >
                <span
                  className={`block rounded-full transition-all duration-200 ${
                    esActual
                      ? 'h-3 w-3 bg-oro shadow-glow'
                      : alcanzado
                        ? 'h-2 w-2 bg-oro/80'
                        : 'h-2 w-2 bg-oro/25 group-hover:bg-oro/60'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* --- Carousel ----------------------------------------------------- */}
      <div
        className="relative"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Fotos en orden cronológico. Usá las flechas izquierda y derecha para navegar."
        onKeyDown={alPresionarEnCarousel}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y">
            {fotos.map((foto, i) => {
              const activa = i === seleccionado;
              return (
                <div
                  key={foto.src}
                  className="min-w-0 flex-[0_0_86%] px-2 sm:flex-[0_0_58%] lg:flex-[0_0_44%]"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} de ${fotos.length}`}
                >
                  {/* Atenuado de las fotos de los costados: transición CSS pura */}
                  <div
                    className={`h-full transition-[opacity,transform] duration-300 ease-suave ${
                      activa
                        ? 'opacity-100'
                        : movimientoReducido
                          ? 'opacity-50'
                          : 'scale-[0.94] opacity-50'
                    }`}
                  >
                    <PhotoCard
                      photo={foto}
                      esPrimera={i === 0}
                      conFondo={activa}
                      onOpen={() => abrirLightbox(i)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Flechas del carousel */}
        <div className="mt-4 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={anterior}
            disabled={seleccionado === 0}
            aria-label="Foto anterior"
            className="boton-magico px-4 py-2 disabled:cursor-not-allowed disabled:opacity-25"
          >
            ◀
          </button>
          <span className="font-ui text-xs tracking-[0.2em] text-oro/50">
            {seleccionado + 1} / {fotos.length}
          </span>
          <button
            type="button"
            onClick={siguiente}
            disabled={seleccionado === fotos.length - 1}
            aria-label="Foto siguiente"
            className="boton-magico px-4 py-2 disabled:cursor-not-allowed disabled:opacity-25"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Anuncio para lectores de pantalla al cambiar de foto */}
      <p className="sr-only" aria-live="polite">
        Foto {seleccionado + 1} de {fotos.length}. {stageLabels[etapaActual] ?? etapaActual}.
      </p>

      {/* --- Lightbox ----------------------------------------------------- */}
      <Lightbox
        photos={fotos}
        indice={indiceLightbox}
        onClose={cerrarLightbox}
        onPrev={anteriorLightbox}
        onNext={siguienteLightbox}
      />
    </section>
  );
}
