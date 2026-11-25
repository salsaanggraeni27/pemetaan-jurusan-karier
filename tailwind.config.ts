import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Fira Sans'", "system-ui", "-apple-system", "sans-serif"],
        heading: ["'Fira Sans'", "system-ui", "-apple-system", "sans-serif"],
        mono: ["'Fira Code'", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#141619",
          body: "#25282D",
          muted: "#525863",
          faint: "#E2E2DC",
        },
        ground: {
          main: "#F4F4F1",
          alt: "#EAEAE5",
          card: "#FFFFFF",
          dark: "#121417",
        },
        action: {
          DEFAULT: "#0B5D51",
          hover: "#08473E",
          tint: "#E6F0EE",
        },
      },
    },
  },
  plugins: [],
};
export default config;
