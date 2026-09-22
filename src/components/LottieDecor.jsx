import { lazy, Suspense, useEffect, useState } from 'react';
import { assetUrl } from '../lib/assets';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

// lottie-web pesa bastante (~250 KB) y estos adornos aparecen recién al final.
// Con lazy() el reproductor se descarga solo cuando hace falta, así la primera
// pantalla (el sobre) carga mucho más rápido.
const Lottie = lazy(() => import('lottie-react'));

/**
 * Animación decorativa de Lottie (el regalo y el corazón).
 *
 * Los .json viven en /public/media/lottie/, así que los traemos con fetch en vez
 * de importarlos: de esa forma pasan por assetUrl() y siguen funcionando cuando
 * el sitio vive en /NOMBRE-REPO/ en GitHub Pages.
 *
 * Es puramente decorativo:
 *  - va con aria-hidden (un lector de pantalla no tiene nada que anunciar acá),
 *  - si falla la carga simplemente no se muestra nada (no rompe la página),
 *  - con "reducir movimiento" se congela en el primer fotograma.
 *
 * @param {string} props.archivo  ej. 'gift.json'
 * @param {string} props.className tamaño/posición desde afuera
 * @param {boolean} props.loop
 */
export default function LottieDecor({ archivo, className = 'w-24 h-24', loop = true }) {
  const [animacion, setAnimacion] = useState(null);
  const movimientoReducido = usePrefersReducedMotion();

  useEffect(() => {
    let vivo = true;
    fetch(assetUrl(`/media/lottie/${archivo}`))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('404'))))
      .then((datos) => {
        if (vivo) setAnimacion(datos);
      })
      .catch(() => {
        // Si el archivo no está, no pasa nada: el adorno simplemente no aparece.
        if (vivo) setAnimacion(null);
      });
    return () => {
      vivo = false;
    };
  }, [archivo]);

  if (!animacion) return null;

  return (
    <div aria-hidden="true" className={className}>
      {/* Mientras baja el reproductor no mostramos nada: es un adorno */}
      <Suspense fallback={null}>
        <Lottie
          animationData={animacion}
          loop={movimientoReducido ? false : loop}
          autoplay={!movimientoReducido}
        />
      </Suspense>
    </div>
  );
}
