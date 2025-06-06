import daisyui from 'daisyui'


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F72585',
        secondary: '#7209B7',
      }
    },
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: [
      {
        "primary": "#F72585",
      },
      "light",
      "dark",
      "forest",
      "black",
      "night",
    ],
  },
}