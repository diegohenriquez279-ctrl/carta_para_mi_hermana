import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ---------------------------------------------------------------------------
// TODO (Diego): cambiá 'carta-virtual-cumpleanos' por el nombre EXACTO de tu
// repo en GitHub. Si el repo se llama "carta-hermana", acá va '/carta-hermana/'.
// Las barras del inicio y del final son obligatorias.
// Si en vez de GitHub Pages publicás en Netlify/Vercel, poné base: '/'.
// ---------------------------------------------------------------------------
const NOMBRE_REPO = 'carta-virtual-cumpleanos';

export default defineConfig({
  plugins: [react()],
  // En dev siempre '/', en build el subdirectorio de GitHub Pages.
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
