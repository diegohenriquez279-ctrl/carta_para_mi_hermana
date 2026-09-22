/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta "mezcla mágica"
        noche: '#0b0616',      // fondo profundo
        violeta: '#1a0b2e',    // fondo secundario del gradiente
        oro: '#f5c86a',        // acento principal
        rosa: '#f7c7d9',       // acento secundario (rosa palo)
        pergamino: '#f6ecd9',  // papel de la carta
      },
      fontFamily: {
        // Cursiva para títulos, serif elegante para cuerpo, Inter solo para UI
        cursiva: ['"Great Vibes"', 'cursive'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Glows con varias capas
        glow: '0 0 14px rgba(245,200,106,.35), 0 0 40px rgba(245,200,106,.18), 0 0 90px rgba(247,199,217,.12)',
        'glow-fuerte': '0 0 22px rgba(245,200,106,.55), 0 0 60px rgba(245,200,106,.3), 0 0 130px rgba(247,199,217,.22)',
        'glow-rosa': '0 0 16px rgba(247,199,217,.4), 0 0 48px rgba(247,199,217,.2)',
      },
      transitionTimingFunction: {
        suave: 'cubic-bezier(.4,0,.2,1)',
      },
      keyframes: {
        latido: {
          '0%, 100%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.03)', filter: 'brightness(1.12)' },
        },
        flotar: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        latido: 'latido 2.8s ease-in-out infinite',
        flotar: 'flotar 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
