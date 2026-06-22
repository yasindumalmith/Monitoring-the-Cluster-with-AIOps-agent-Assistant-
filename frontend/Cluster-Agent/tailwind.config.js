/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#eef4ff',
          100: '#e0ebff',
          200: '#c6d8ff',
          300: '#a3beff',
          400: '#7e9aff',
          500: '#114fd8', // Target color
          600: '#0e3eb5',
          700: '#0a2d8f',
          800: '#08236b',
          900: '#061a45',
          950: '#040d24',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
