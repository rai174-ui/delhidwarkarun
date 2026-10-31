/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#040814",
          900: "#0A1128",
          800: "#101B3B",
          700: "#1B2B5E",
        },
        coral: {
          400: "#FF7849",
          500: "#FF5722",
          600: "#E64A19",
        },
        volt: "#CCFF00",
        charcoal: "#0F172A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Montserrat", "system-ui", "sans-serif"],
        athletic: ["Teko", "Montserrat", "sans-serif"],
      },
      boxShadow: {
        glow: "0 12px 35px -5px rgba(255, 87, 34, 0.55)",
        "glow-lg": "0 20px 50px -10px rgba(255, 87, 34, 0.65)",
        card: "0 25px 50px -12px rgba(10, 17, 40, 0.12)",
      },
    },
  },
  plugins: [],
};
