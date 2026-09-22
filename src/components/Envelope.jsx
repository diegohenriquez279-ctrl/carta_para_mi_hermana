import { useState } from 'react';
import { motion } from 'framer-motion';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { letter } from '../content/letter';

/**
 * Pantalla 1 — El sobre cerrado.
 *
 * Sobre con glow pulsante y sello de cera con la inicial de ella.
 * Al hacer click (o Enter/Espacio) se abre la solapa, la carta sale volando
 * y recién ahí se avisa al padre con onOpen().
 *
 * @param {() => void} props.onOpen  se llama cuando termina la animación de apertura
 */
export default function Envelope({ onOpen }) {
  const [abriendo, setAbriendo] = useState(false);
  const movimientoReducido = usePrefersReducedMotion();

  // Duración total de la apertura. Con "reducir movimiento" es casi instantánea.
  const duracion = movimientoReducido ? 0.25 : 1.1;

  function abrir() {
    if (abriendo) return; // evita dobles clicks
    setAbriendo(true);
    // Esperamos a que termine la animación antes de cambiar de pantalla.
    window.setTimeout(() => onOpen?.(), duracion * 1000);
  }

  return (
    <section
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-12"
      aria-label="Sobre de la carta"
    >
      {/* Invitación en cursiva */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="titulo-magico mb-10 text-center text-3xl leading-tight sm:text-4xl"
      >
        Para ti, en tu día especial…
      </motion.p>

      {/* --- EL SOBRE ---------------------------------------------------- */}
      <motion.button
        type="button"
        onClick={abrir}
        aria-label="Abrir el sobre y leer la carta"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{
          opacity: 1,
          scale: 1,
          // Cuando se abre, el sobre se aleja un poco y se desvanece
          ...(abriendo ? { scale: 1.06, opacity: 0 } : {}),
        }}
        transition={{ duration: abriendo ? duracion : 0.7, delay: abriendo ? duracion * 0.45 : 0.35 }}
        className={`group relative h-[190px] w-[280px] cursor-pointer rounded-lg
                    focus-visible:outline-offset-8 sm:h-[230px] sm:w-[340px]
                    ${movimientoReducido || abriendo ? '' : 'animate-latido'}`}
        style={{ perspective: 1200 }}
      >
        {/* Halo dorado detrás del sobre */}
        <span
          aria-hidden="true"
          className="absolute -inset-6 rounded-[2rem] bg-oro/10 blur-2xl transition-opacity
                     duration-500 group-hover:bg-oro/20"
        />

        {/* Panel de atrás del sobre */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-lg border border-oro/30
                     bg-gradient-to-br from-[#2a1445] to-[#150a29] shadow-glow"
        />

        {/* La carta que asoma y sale volando al abrir */}
        <motion.span
          aria-hidden="true"
          className="pergamino absolute inset-x-5 bottom-10 top-4 rounded-sm"
          animate={
            abriendo
              ? { y: movimientoReducido ? 0 : -120, opacity: 0, scale: 0.94 }
              : { y: 0, opacity: 1, scale: 1 }
          }
          transition={{ duration: duracion * 0.8, delay: duracion * 0.3, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Bolsillo delantero del sobre (el triángulo invertido) */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#33184f] to-[#1b0c33]"
          style={{ clipPath: 'polygon(0 22%, 50% 62%, 100% 22%, 100% 100%, 0 100%)' }}
        />
        {/* Bordes decorativos del bolsillo */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-lg border border-oro/20"
          style={{ clipPath: 'polygon(0 22%, 50% 62%, 100% 22%, 100% 100%, 0 100%)' }}
        />

        {/* Solapa superior: rota hacia atrás al abrir */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[62%] origin-top
                     bg-gradient-to-b from-[#3a1c5a] to-[#28123f]"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
          animate={{ rotateX: abriendo ? -172 : 0 }}
          transition={{ duration: duracion * 0.6, ease: [0.4, 0, 0.2, 1] }}
        />

        {/* Sello de cera con la inicial */}
        <motion.span
          aria-hidden="true"
          className="absolute left-1/2 top-[52%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2
                     items-center justify-center rounded-full
                     bg-gradient-to-br from-[#f7c7d9] to-[#c8788f]
                     font-cursiva text-2xl text-[#4a1026] shadow-glow-rosa sm:h-16 sm:w-16 sm:text-3xl"
          animate={abriendo ? { scale: 0, opacity: 0, rotate: -25 } : { scale: 1, opacity: 1 }}
          transition={{ duration: duracion * 0.4 }}
        >
          {letter.recipientInitial}
        </motion.span>
      </motion.button>

      {/* Pista para que sepa que tiene que tocar */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: abriendo ? 0 : 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-10 font-ui text-xs uppercase tracking-[0.3em] text-oro/60"
      >
        Toca el sobre
      </motion.p>
    </section>
  );
}
