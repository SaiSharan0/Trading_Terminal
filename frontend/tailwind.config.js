/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-dark': '#121212',
        'bg-light': '#1E1E1E',
        'text-primary': '#FFFFFF',
        'text-secondary': '#888888',
        'color-green': '#00FF00',
        'color-red': '#FF0000',
        'color-blue': '#3B82F6',
        'color-yellow': '#F59E0B'
      }
    },
  },
  plugins: [],
};
