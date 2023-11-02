/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'MyFont': ['"Source Sans 3"', 'sans-serif']
    },
    extend: {
      colors: {
        'white': '#FFF'
      },
      backgroundColor: {
        'judo-purple': '#9A48D6'
      },
    },
  },
  plugins: [],
}

