/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,tsx,ts}"],
  theme: {
    extend: {
      colors: {
        twitter: '#00ADED'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}