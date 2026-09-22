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
 * No usa tsparticles (sería caro montar otro motor): son 12 puntitos animados
 * con framer-motion, suficiente para el efecto y muy barato.
 */
function Destellos({ activo }) {
  const movimientoReducido = usePrefersReducedMotion();
  if (movimientoReducido || !activo) return null;

  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-visible">
      {Array.from({ length: 12 }).map((_, i) => {
        const angulo = (i / 12) * Math.PI * 2;
        const distancia = 40 + (i % 3) * 22;
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
            transition={{ duration: 1.1, delay: i * 0.03, ease: 'easeOut' }}
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
 * - Cuando cambia la etapa aparece su título con fade + destellos.
 * - Click en una foto abre el Lightbox a pantalla completa.
 *
 * Acá no hay años ni fechas: el orden es el que tengan las fotos en
 * src/content/photos.js, tal cual están escritas.
 */
export default function Timeline() {
  const movimientoReducido = usePrefersReducedMotion();
  const [refSeccion, seccionEnVista] = useInView({ threshold: 0.15 });

  // --- 1. Datos derivados -------------------------------------------------
  // Respetamos el orden del archivo: mover una foto ahí la mueve acá.
  const fotos = photosCrudas;

  // Agrupación por etapa: [{ stage, label, desde, hasta, cantidad }]
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
          label: stageLabels[f.stage] ?? f.stage,
          desde: i,
          hasta: i,
          cantidad: 1,
          orden: stageOrder.indexOf(f.stage),
        });
      }
    });
    return acumulado;
  }, [fotos]);

  // Una marca por foto en la barra de progreso.
  const marcas = useMemo(() => fotos.map((_, indice) => indice), [fotos]);

  // --- 2. Carousel --------------------------------------------------------
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: false, // false = la foto activa siempre queda centrada
    loop: false,
    skipSnaps: false,
    duration: movimientoReducido ? 8 : 25, // velocidad del desplazamiento
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

      {/* --- Título de la etapa actual: cambia con fade + destellos -------- */}
      <div className="relative mb-6 flex h-16 items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={etapaActual}
            initial={{
              opacity: 0,
              y: movimientoReducido ? 0 : 14,
              scale: movimientoReducido ? 1 : 0.94,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: movimientoReducido ? 0 : -14 }}
            transition={{ duration: movimientoReducido ? 0.2 : 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            {/* Destellos extra en el cambio de etapa */}
            <Destellos activo />
            <span className="titulo-magico text-4xl sm:text-5xl">
              {stageLabels[etapaActual] ?? etapaActual}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- Barra de progreso con una marca por foto --------------------- */}
      <div className="mx-auto mb-8 w-full max-w-3xl px-6">
        {/* Etiquetas de etapa, repartidas según cuántas fotos tiene cada una */}
        <div className="mb-2 flex" aria-hidden="true">
          {grupos.map((g, i) => (
            <span
              key={g.stage + '-' + i}
              style={{ width: `${(g.cantidad / fotos.length) * 100}%` }}
              className={`truncate text-center font-ui text-[0.6rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
                g.stage === etapaActual ? 'text-oro' : 'text-oro/30'
              }`}
            >
              {g.label}
            </span>
          ))}
        </div>

        {/* Riel + relleno + marcas */}
        <div className="relative h-7" role="group" aria-label="Saltar a una foto de la línea de tiempo">
          {/* Riel */}
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[11px] h-[2px] rounded-full bg-oro/15"
          />
          {/* Relleno de progreso */}
          <motion.span
            aria-hidden="true"
            className="absolute left-0 top-[11px] h-[2px] rounded-full bg-gradient-to-r from-rosa to-oro shadow-[0_0_10px_rgba(245,200,106,.7)]"
            animate={{ width: `${avance}%` }}
            transition={{ duration: movimientoReducido ? 0.1 : 0.4, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Una marca por foto */}
          {marcas.map((indice) => {
            const posicion = fotos.length > 1 ? (indice / (fotos.length - 1)) * 100 : 50;
            const alcanzado = indice <= seleccionado;
            const esActual = indice === seleccionado;
            const etiquetaEtapa = stageLabels[fotos[indice].stage] ?? fotos[indice].stage;

            return (
              <button
                key={fotos[indice].src}
                type="button"
                onClick={() => irA(indice)}
                aria-label={`Ir a la foto ${indice + 1} de ${fotos.length}, etapa ${etiquetaEtapa}`}
                aria-current={esActual ? 'true' : undefined}
                title={etiquetaEtapa}
                style={{ left: `${posicion}%` }}
                /* El botón tiene padding para que el área táctil sea cómoda con
                   el dedo, aunque el puntito visible sea chiquito. */
                className="group absolute top-0 -translate-x-1/2 px-[9px] py-[6px]"
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
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
            {fotos.map((foto, i) => (
              <div
                key={foto.src}
                className="min-w-0 flex-[0_0_86%] px-2 sm:flex-[0_0_58%] lg:flex-[0_0_44%]"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} de ${fotos.length}`}
              >
                <motion.div
                  animate={{
                    // La foto activa se ve entera; las de los costados, atenuadas
                    opacity: i === seleccionado ? 1 : 0.45,
                    scale: movimientoReducido ? 1 : i === seleccionado ? 1 : 0.93,
                  }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  className="h-full"
                >
                  <PhotoCard photo={foto} esPrimera={i === 0} onOpen={() => abrirLightbox(i)} />
                </motion.div>
              </div>
            ))}
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
