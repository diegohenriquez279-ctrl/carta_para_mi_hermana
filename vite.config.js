import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ---------------------------------------------------------------------------
// BASE URL — de dónde cuelga el sitio.
//
// Ahora mismo está configurado para **Netlify o Vercel**, que sirven el sitio
// desde la raíz del dominio. Por eso base es '/' y no hay nada que tocar.
//
// Si algún día te pasás a GitHub Pages, ahí el sitio NO vive en la raíz sino en
// tuusuario.github.io/NOMBRE-REPO/, y tenés que cambiarlo así:
//
//     const NOMBRE_REPO = 'carta_para_mi_hermana';   // el nombre exacto del repo
//     base: process.env.NODE_ENV === 'production' ? `/${NOMBRE_REPO}/` : '/',
//
// Si no coincide con el nombre real del repo, la página sale en blanco.
// ---------------------------------------------------------------------------

export default defineConfig({
  plugins: [react()],
  base: '/',

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
