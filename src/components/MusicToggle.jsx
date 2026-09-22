import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { motion } from 'framer-motion';
import { assetUrl } from '../lib/assets';

/**
 * Botón flotante de música de fondo.
 *
 * Arranca SIEMPRE en silencio, a propósito:
 *  1. Los navegadores bloquean el audio que empieza solo (hace falta que la
 *     persona toque algo primero), así que no serviría de nada.
 *  2. Si ella abre la carta en clase o con gente al lado, que no le suene
 *     música de golpe.
 *
 * Si todavía no pusiste el archivo public/media/music/bg.mp3, el botón se
 * muestra apagado y deshabilitado en vez de romper la página.
 */
export default function MusicToggle() {
  const [sonando, setSonando] = useState(false);
  const [disponible, setDisponible] = useState(true);
  const howlRef = useRef(null);

  useEffect(() => {
    const sonido = new Howl({
      src: [assetUrl('/media/music/bg.mp3')],
      loop: true,
      volume: 0, // subimos el volumen con un fade al darle play
      html5: true, // streaming: no espera a bajar todo el mp3 para sonar
      preload: true,
      onloaderror: () => setDisponible(false),
      onplayerror: () => setDisponible(false),
    });

    howlRef.current = sonido;

    return () => {
      sonido.unload();
    };
  }, []);

  function alternar() {
    const sonido = howlRef.current;
    if (!sonido || !disponible) return;

    if (sonando) {
      sonido.fade(sonido.volume(), 0, 600);
      // Pausamos recién cuando terminó el fade, para que no corte de golpe
      window.setTimeout(() => sonido.pause(), 620);
      setSonando(false);
    } else {
      sonido.play();
      sonido.fade(0, 0.35, 900);
      setSonando(true);
    }
  }

  return (
    <motion.button
      type="button"
      onClick={alternar}
      disabled={!disponible}
      aria-label={
        !disponible
          ? 'Música no disponible: falta el archivo bg.mp3'
          : sonando
            ? 'Silenciar la música'
            : 'Reproducir música de fondo'
      }
      aria-pressed={sonando}
      title={!disponible ? 'Falta public/media/music/bg.mp3' : sonando ? 'Silenciar' : 'Música'}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: disponible ? 1 : 0.35, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center
                 rounded-full border border-oro/40 bg-noche/80 text-oro backdrop-blur-sm
                 transition-all duration-300 ease-suave
                 hover:border-oro/80 hover:shadow-glow
                 disabled:cursor-not-allowed disabled:hover:border-oro/40 disabled:hover:shadow-none"
    >
      {/* Iconos dibujados a mano para no sumar una librería de íconos */}
      <span aria-hidden="true" className="text-lg leading-none">
        {sonando ? '♪' : '♪̸'}
      </span>

      {/* Anillo que late mientras suena */}
      {sonando && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-oro/50"
          animate={{ scale: [1, 1.35], opacity: [0.7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
    </motion.button>
  );
}
