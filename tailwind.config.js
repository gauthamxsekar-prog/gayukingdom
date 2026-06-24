/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f8",
          100: "#e1e8f0",
          200: "#c3d1e1",
          300: "#a5bac2",
          400: "#8d9fb8",
          500: "#1a237e",
          600: "#16205a",
          700: "#121a47",
          800: "#0d1435",
          900: "#0a0e22",
        },
        orange: {
          50: "#fff7ed",
          100: "#fee2d5",
          200: "#fcc5ab",
          300: "#fba381",
          400: "#f88c5a",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a2e0c",
          900: "#7c240c",
        },
      },
      backgroundColor: {
        primary: "#1a237e",
        secondary: "#f97316",
      },
      textColor: {
        primary: "#f97316",
        secondary: "#1a237e",
      },
    },
  },
  plugins: [],
};
