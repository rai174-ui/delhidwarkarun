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
          950: "#061320",
          900: "#0B1D30",
          800: "#112B45",
          700: "#1B3F63",
        },
        coral: {
          400: "#FF7D45",
          500: "#F26522",
          600: "#D95316",
        },
        ddrblue: {
          400: "#38BDF8",
          500: "#29ABE2",
          600: "#0284C7",
        },
        sage: {
          100: "#F3F8E2",
          200: "#E4F0BE",
          300: "#C5D887",
          400: "#B2CB64",
        },
        volt: "#C5D887",
        charcoal: "#0F172A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Montserrat", "system-ui", "sans-serif"],
        athletic: ["Teko", "Montserrat", "sans-serif"],
      },
      boxShadow: {
        glow: "0 12px 35px -5px rgba(242, 101, 34, 0.55)",
        "glow-lg": "0 20px 50px -10px rgba(242, 101, 34, 0.65)",
        "glow-blue": "0 12px 35px -5px rgba(41, 171, 226, 0.45)",
        card: "0 25px 50px -12px rgba(6, 19, 32, 0.12)",
      },
    },
  },
  plugins: [],
};
