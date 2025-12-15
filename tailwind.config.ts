import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e63946",
          light: "#f77f7f",
          dark: "#c1121f",
        },
        secondary: {
          DEFAULT: "#457b9d",
          light: "#6a9bc0",
          dark: "#2a5f7a",
        },
        accent: {
          DEFAULT: "#f1faee",
          light: "#ffffff",
          dark: "#d4e4c8",
        },
        background: {
          DEFAULT: "#ffffff",
          dark: "#1d3557",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-merriweather)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

