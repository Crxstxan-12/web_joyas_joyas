/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'infinito-cream': '#FDFCF8',
        'infinito-gold': '#D4AF37',
        'infinito-black': '#1A1A1A',
        'infinito-pink': '#F8E1E7',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
