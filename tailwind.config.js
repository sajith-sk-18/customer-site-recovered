/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fluro Tech — fluorescent green palette (vivid, never deep).
        brand: {
          50:  '#ecfff5',
          100: '#d2ffe5',
          200: '#bdf6cf',
          300: '#86efac',
          400: '#4ade80',
          500: '#22e36b',
          600: '#16c95a',
          700: '#10a648',
          800: '#0f943f',
          900: '#0e8a3b',
        },
      },
    },
  },
  plugins: [],
};
