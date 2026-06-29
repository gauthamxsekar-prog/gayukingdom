/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
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
          50: "#fff8ed",
          100: "#ffefdb",
          200: "#fedfb3",
          300: "#fdd289",
          400: "#fbc85a",
          500: "#F59E0B",
          600: "#db8909",
          700: "#b06908",
          800: "#8a4f06",
          900: "#6b3d05",
        },
        green: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22C55E",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
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
