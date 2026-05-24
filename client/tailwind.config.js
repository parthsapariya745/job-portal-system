/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Example blue
        secondary: '#475569',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans Gujarati', 'Noto Sans Devanagari', 'sans-serif'],
      },
      screens: {
        'xs': '280px', // Extra small screens
      }
    },
  },
  plugins: [],
}
