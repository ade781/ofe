/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: "#003d7a",
          light: "#1a5bae",
          accent: "#d4a574",
          light2: "#4a7dc8",
          bg: "#f5f7fa",
          border: "#d0d8e0",
        },
      },
    },
  },
  plugins: [],
};
