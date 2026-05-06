import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#001F5C',
          800: '#002E7A',
          700: '#003B8E',
          600: '#0047B0',
          500: '#1565C0',
          400: '#4A90D9',
          300: '#7DB8E8',
          200: '#B3D4F0',
          100: '#D6E4F7',
          50:  '#EEF5FC',
          DEFAULT: '#1565C0',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light: '#FDE68A',
          dark: '#B45309',
        },
        dark: '#111827',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
export default config;
