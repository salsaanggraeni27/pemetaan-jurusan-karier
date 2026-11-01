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
        sman1: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36abf6',
          500: '#0c8ee7',
          600: '#0171c6',
          700: '#025aa0',
          800: '#064d84',
          900: '#0a406e',
          950: '#072949',
        },
      },
    },
  },
  plugins: [],
};
export default config;
