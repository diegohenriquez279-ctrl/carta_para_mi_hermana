import { motion } from 'framer-motion';
import LottieDecor from './LottieDecor';
import useInView from '../hooks/useInView';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { storySections } from '../content/letter';

/**
 * Una sección del scroll narrativo.
 * Se mantiene invisible hasta que entra en el viewport; ahí hace
 * fade-in + slide-up. El hook useInView es el que detecta la entrada.
 */
function Seccion({ title, body, indice, esUltima }) {
  const [ref, enVista] = useInView({ threshold: 0.3 });
  const movimientoReducido = usePrefersReducedMotion();

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: movimientoReducido ? 0 : 40 }}
      animate={enVista ? { opacity: 1, y: 0 } : { opacity: 0, y: movimientoReducido ? 0 : 40 }}
      transition={{ duration: movimientoReducido ? 0.25 : 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="mx-auto flex min-h-[70svh] max-w-2xl flex-col items-center justify-center
                 px-6 py-16 text-center"
    >
      {/* Corazoncito animado, solo en la última sección (la que presenta las fotos) */}
      {esUltima && (
        <LottieDecor
          archivo="heart.json"
          className={`mb-4 h-16 w-16 ${movimientoReducido ? '' : 'animate-flotar'}`}
        />
      )}

      <h2 className="titulo-magico mb-6 text-4xl leading-tight sm:text-5xl">{title}</h2>

      {/* Línea decorativa que se estira al entrar */}
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        animate={enVista ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="mb-7 block h-px w-24 origin-center bg-gradient-to-r from-transparent via-oro/70 to-transparent"
      />

      <div className="space-y-4 text-lg leading-relaxed text-rosa/85 sm:text-xl">
        {String(body)
          .split('\n\n')
          .map((parrafo, i) => (
            <p key={i} className="whitespace-pre-line">
              {parrafo}
            </p>
          ))}
      </div>

      {/* Flechita de "seguí bajando", solo en la primera sección */}
      {indice === 0 && (
        <motion.span
          aria-hidden="true"
          animate={movimientoReducido ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-14 font-ui text-2xl text-oro/50"
        >
          ↓
        </motion.span>
      )}
    </motion.section>
  );
}

/**
 * Pantalla 3 — El scroll narrativo.
 * Recorre las secciones definidas en src/content/letter.js (storySections).
 */
export default function ScrollStory() {
  return (
    <div aria-label="Historia">
      {storySections.map((seccion, i) => (
        <Seccion
          key={i}
          indice={i}
          esUltima={i === storySections.length - 1}
          title={seccion.title}
          body={seccion.body}
        />
      ))}
    </div>
  );
}
