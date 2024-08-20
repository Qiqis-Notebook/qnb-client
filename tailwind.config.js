/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#E91E63",
          "primary-focus": "#C1134E",
          "primary-content": "#FFF",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["business"],
          primary: "#E91E63",
          "primary-focus": "#C1134E",
          "primary-content": "#FFF",
          "base-100": "#191919",
          "base-200": "#242424",
          "base-300": "#333333",
          "--rounded-btn": "6px",
        },
      },
    ],
  },
  content: ["./src/renderer/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("@tailwindcss/container-queries")],
};
