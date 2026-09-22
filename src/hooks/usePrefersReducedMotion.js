import { useEffect, useState } from 'react';

/**
 * Devuelve true si el sistema operativo pide menos movimiento
 * (Ajustes > Accesibilidad > Reducir movimiento).
 *
 * Cuando es true la experiencia:
 *  - baja la cantidad de partículas,
 *  - reemplaza el flip 3D del libro por un fade simple,
 *  - suaviza/desactiva el confetti y el parallax.
 */
export function usePrefersReducedMotion() {
  const [reducido, setReducido] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const alCambiar = (e) => setReducido(e.matches);

    // addEventListener no existe en Safari viejo: fallback a addListener.
    if (mq.addEventListener) mq.addEventListener('change', alCambiar);
    else mq.addListener(alCambiar);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', alCambiar);
      else mq.removeListener(alCambiar);
    };
  }, []);

  return reducido;
}

export default usePrefersReducedMotion;
