import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ParticlesBg from './components/ParticlesBg';
import Envelope from './components/Envelope';
import LetterBook from './components/LetterBook';
import ScrollStory from './components/ScrollStory';
import Timeline from './components/Timeline';
import FinalWish from './components/FinalWish';
import MusicToggle from './components/MusicToggle';

/**
 * La experiencia completa, en tres fases:
 *
 *   'sobre'     → landing con el sobre cerrado          (sin scroll)
 *   'carta'     → el libro con las páginas de la carta  (sin scroll)
 *   'historia'  → scroll narrativo + línea de tiempo + deseo final (con scroll)
 *
 * El scroll arranca bloqueado a propósito: la idea es que ella siga el recorrido
 * en orden y no se saltee la carta bajando de una. Se desbloquea recién al tocar
 * "Sigamos…" en la última página.
 */
export default function App() {
  const [fase, setFase] = useState('sobre');

  // Al cambiar de fase volvemos arriba de todo.
  //
  // Ojo: NO bloqueamos el scroll del body. Antes lo hacía y era un error — si
  // la carta quedaba más alta que la pantalla (un poema largo, un celular
  // chico), el botón "Sigamos…" caía abajo del borde y no había forma de
  // llegar a él. Igual ella no se puede saltear nada: cada fase se monta sola,
  // así que la historia ni siquiera existe en la página hasta que toque el botón.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [fase]);

  const abrirCarta = useCallback(() => setFase('carta'), []);

  const empezarHistoria = useCallback(() => {
    setFase('historia');
    // Arrancamos arriba de todo para que el fade-in de la primera sección se vea.
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const reiniciar = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    setFase('sobre');
  }, []);

  return (
    <>
      {/* Fondo de partículas: más discreto en el sobre, más vivo en la historia */}
      <ParticlesBg intensidad={fase === 'sobre' ? 'suave' : 'normal'} />

      <main className="relative">
        <AnimatePresence mode="wait">
          {fase === 'sobre' && (
            <motion.div
              key="sobre"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Envelope onOpen={abrirCarta} />
            </motion.div>
          )}

          {fase === 'carta' && (
            <motion.div
              key="carta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <LetterBook onContinue={empezarHistoria} />
            </motion.div>
          )}

          {fase === 'historia' && (
            <motion.div
              key="historia"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <ScrollStory />
              <Timeline />
              <FinalWish onReplay={reiniciar} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Botón de música: siempre visible, en silencio hasta que ella lo toque */}
      <MusicToggle />
    </>
  );
}
