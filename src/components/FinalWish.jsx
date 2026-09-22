import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import LottieDecor from './LottieDecor';
import useInView from '../hooks/useInView';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { finalWish } from '../content/finalWish';

/**
 * Pantalla 5 — El deseo final.
 *
 * Al entrar en pantalla dispara el confetti (una sola vez) y muestra el deseo
 * en grande y en cursiva. El botón "Reproducir de nuevo" reinicia toda la
 * experiencia desde el sobre.
 *
 * @param {() => void} props.onReplay
 */
export default function FinalWish({ onReplay }) {
  const [ref, enVista] = useInView({ threshold: 0.4 });
  const movimientoReducido = usePrefersReducedMotion();
  const yaTiroConfetti = useRef(false);

  useEffect(() => {
    if (!enVista || yaTiroConfetti.current) return;
    yaTiroConfetti.current = true;

    // Con "reducir movimiento" no tiramos confetti: sería justo lo contrario
    // de lo que pide el sistema.
    if (movimientoReducido) return;

    const colores = ['#f5c86a', '#f7c7d9', '#fff3d6', '#c8788f'];

    // Ráfaga inicial desde el centro-abajo
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.7 },
      colors: colores,
      disableForReducedMotion: true,
    });

    // Dos ráfagas laterales, un toque después, para que dure un poquito más
    const t1 = window.setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.75 },
        colors: colores,
        disableForReducedMotion: true,
      });
    }, 250);

    const t2 = window.setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.75 },
        colors: colores,
        disableForReducedMotion: true,
      });
    }, 420);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [enVista, movimientoReducido]);

  return (
    <section
      ref={ref}
      aria-label="Deseo final"
      className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-20 text-center"
    >
      {/* Regalito animado */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={enVista ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6 }}
        className={movimientoReducido ? '' : 'animate-flotar'}
      >
        <LottieDecor archivo="gift.json" className="mb-6 h-28 w-28 sm:h-36 sm:w-36" />
      </motion.div>

      {/* El deseo, en grande */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={enVista ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="titulo-magico max-w-3xl text-4xl leading-[1.25] sm:text-6xl"
      >
        {finalWish.text}
      </motion.p>

      {/* Firma opcional */}
      {finalWish.signature ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={enVista ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 text-lg italic text-rosa/70"
        >
          {finalWish.signature}
        </motion.p>
      ) : null}

      {/* Separador */}
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        animate={enVista ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="my-10 block h-px w-40 origin-center bg-gradient-to-r from-transparent via-oro/60 to-transparent"
      />

      <motion.button
        type="button"
        onClick={onReplay}
        initial={{ opacity: 0, y: 12 }}
        animate={enVista ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="boton-magico font-serif text-base italic"
      >
        Reproducir de nuevo
      </motion.button>
    </section>
  );
}
