import { useEffect, useMemo, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

// El motor de partículas se inicializa UNA sola vez en toda la app.
// Esta promesa compartida evita que se cargue de nuevo en cada montaje.
let promesaMotor = null;
function iniciarMotor() {
  if (!promesaMotor) {
    promesaMotor = initParticlesEngine(async (engine) => {
      await loadSlim(engine); // versión "slim": pesa mucho menos que la completa
    });
  }
  return promesaMotor;
}

/**
 * Fondo global de partículas doradas/rosadas.
 * Va fijo detrás de todo (position: fixed, z-index negativo) y no intercepta clicks.
 *
 * @param {'suave'|'normal'|'fiesta'} props.intensidad  cuántas partículas mostrar
 */
export default function ParticlesBg({ intensidad = 'normal' }) {
  const [motorListo, setMotorListo] = useState(false);
  const movimientoReducido = usePrefersReducedMotion();

  useEffect(() => {
    let vivo = true;
    iniciarMotor().then(() => {
      if (vivo) setMotorListo(true);
    });
    return () => {
      vivo = false;
    };
  }, []);

  const opciones = useMemo(() => {
    // Cantidad base según el momento de la experiencia.
    const porIntensidad = { suave: 22, normal: 45, fiesta: 80 };
    let cantidad = porIntensidad[intensidad] ?? 45;

    // Accesibilidad: con "reducir movimiento" bajamos mucho la cantidad
    // y dejamos las partículas casi quietas.
    if (movimientoReducido) cantidad = Math.round(cantidad * 0.3);

    return {
      fullScreen: { enable: false }, // lo posicionamos nosotros con CSS
      detectRetina: true,
      fpsLimit: 60,
      background: { color: 'transparent' },
      particles: {
        number: {
          value: cantidad,
          density: { enable: true, width: 1200, height: 1200 },
        },
        // Mezcla de destellos dorados y rosa palo
        color: { value: ['#f5c86a', '#f7c7d9', '#fff3d6'] },
        shape: { type: 'circle' },
        opacity: {
          value: { min: 0.15, max: 0.75 },
          animation: {
            enable: !movimientoReducido,
            speed: 0.5,
            sync: false,
            startValue: 'random',
          },
        },
        // Destellos chiquitos de 2 a 4 px, como pide el diseño
        size: { value: { min: 1, max: 2 } }, // radio: 1–2 px = 2–4 px de diámetro
        move: {
          enable: true,
          direction: 'top', // suben lento, como luciérnagas
          speed: movimientoReducido ? 0.08 : { min: 0.15, max: 0.5 },
          straight: false,
          random: true,
          outModes: { default: 'out', bottom: 'out', top: 'out' },
        },
        // Parpadeo suave
        twinkle: {
          particles: {
            enable: !movimientoReducido,
            frequency: 0.04,
            opacity: 1,
          },
        },
        links: { enable: false }, // sin líneas: buscamos polvo mágico, no una red
        shadow: {
          enable: true,
          blur: 6,
          color: { value: '#f5c86a' },
        },
      },
      // Sin interacción: el fondo es decorativo y no debe robar clicks.
      interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
    };
  }, [intensidad, movimientoReducido]);

  if (!motorListo) return null;

  return (
    <Particles
      id="particulas-fondo"
      options={opciones}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
