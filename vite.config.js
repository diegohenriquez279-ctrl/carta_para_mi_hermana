import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ---------------------------------------------------------------------------
// BASE URL — de dónde cuelga el sitio.
//
// Está configurado para **GitHub Pages**. Ahí el sitio NO vive en la raíz del
// dominio sino en  tuusuario.github.io/NOMBRE-REPO/,  así que Vite necesita
// saber el nombre del repo para armar bien las rutas de las fotos y los estilos.
//
// Si le cambiás el nombre al repo en GitHub, cambialo también acá o la página
// va a salir en blanco.
//
// (En `npm run dev` siempre se usa '/', así que en local no se nota la diferencia.
//  Si algún día te pasás a Netlify o Vercel, poné simplemente  base: '/' ).
// ---------------------------------------------------------------------------
const NOMBRE_REPO = 'carta_para_mi_hermana';

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? `/${NOMBRE_REPO}/` : '/',

  build: {
    rollupOptions: {
      output: {
        // Separamos las librerías pesadas en archivos aparte para que el
        // navegador no tenga que bajar todo junto antes de mostrar el sobre.
        manualChunks: {
          react: ['react', 'react-dom'],
          animacion: ['framer-motion'],
          particulas: ['@tsparticles/react', '@tsparticles/slim'],
        },
      },
    },
    // El chunk de partículas ronda los 400 KB; no queremos el warning de Vite
    // por algo que ya está separado a propósito.
    chunkSizeWarningLimit: 600,
  },
});
