import { useEffect, useRef, useState } from 'react';

/**
 * Detecta cuándo un elemento entra en el viewport (IntersectionObserver).
 * Lo usa ScrollStory para los fade-in + slide-up, y Timeline/FinalWish para
 * disparar cosas al entrar (partículas extra, confetti).
 *
 * @param {Object}  opciones
 * @param {number}  opciones.threshold  Porción visible necesaria (0 a 1). Default .25
 * @param {string}  opciones.rootMargin Margen del observador. Default '0px 0px -10% 0px'
 * @param {boolean} opciones.once       Si true, una vez visible ya no vuelve a false.
 * @returns {[React.RefObject, boolean]} [ref para el elemento, está visible]
 */
export function useInView({ threshold = 0.25, rootMargin = '0px 0px -10% 0px', once = true } = {}) {
  const ref = useRef(null);
  const [enVista, setEnVista] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    // Si el navegador es viejo y no soporta IntersectionObserver, mostramos todo.
    if (typeof IntersectionObserver === 'undefined') {
      setEnVista(true);
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setEnVista(true);
          if (once) observador.unobserve(elemento);
        } else if (!once) {
          setEnVista(false);
        }
      },
      { threshold, rootMargin }
    );

    observador.observe(elemento);
    return () => observador.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, enVista];
}

export default useInView;
