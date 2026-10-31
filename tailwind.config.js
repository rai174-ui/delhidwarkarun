/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#060B19",
          900: "#0A1128",
          800: "#111D40",
          700: "#1B2A59",
        },
        coral: {
          400: "#FF7849",
          500: "#FF5722",
          600: "#E64A19",
        },
        charcoal: "#1E293B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Montserrat", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 30px -5px rgba(255, 87, 34, 0.45)",
        card: "0 20px 40px -15px rgba(10, 17, 40, 0.08)",
      },
    },
  },
  plugins: [],
};
