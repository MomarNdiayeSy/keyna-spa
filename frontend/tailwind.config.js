// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8A6E4B', // Couleur principale (doré/beige chaud)
          light: '#A98E6B',
          dark: '#6A4E2B',
        },
        secondary: {
          DEFAULT: '#345557', // Couleur secondaire (vert-bleu foncé)
          light: '#547577',
          dark: '#143537',
        },
        accent: {
          DEFAULT: '#D6AD60', // Couleur d'accent (doré clair)
          light: '#F6CD80',
          dark: '#B68D40',
        },
        neutral: {
          DEFAULT: '#F5F5F5',
          dark: '#333333',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}