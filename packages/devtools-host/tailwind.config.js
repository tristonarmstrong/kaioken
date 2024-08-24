/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{tsx,css,ts}",
    "./node_modules/devtools-shared/**/*.{tsx,css,ts}",
  ],
  theme: {
    extend: {
      colors: {
        crimson: "crimson",
      },
    },
  },
  plugins: [],
}
