/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Same brand palette as the main website, for a consistent identity
        espresso: "#2B2420",
        clay: "#B5622C",
        sand: "#E8DFD3",
        ivory: "#FBF7F0",
        taupe: "#8A7F73",
        ink: "#1A1613",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
