/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nhs: {
          blue: '#005EB8',
          darkBlue: '#003087',
          brightBlue: '#0072CE',
          lightBlue: '#41B6E6',
          aquaBlue: '#00A9CE',
          green: '#007F3B',
          lightGreen: '#00A499',
          yellow: '#FFB81C',
          warmYellow: '#FFB81C',
          darkPink: '#7C2855',
          red: '#DA291C',
          paleGrey: '#F0F4F5',
          midGrey: '#768692',
          darkGrey: '#425563',
          text: '#212B32',
        }
      }
    },
  },
  plugins: [],
}

