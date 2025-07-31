import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1E3A8A',
        secondary: '#4B5563',
        accent: '#F97316',
        accentHover: '#EA580C',
        sponsor: '#10B981',
        neutral: {
          black: '#111827',
          white: '#FFFFFF',
          gray: '#D1D5DB',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Roboto', 'sans-serif'],
        jakarta: ['"plus-jakarta-sans"', 'sans-serif'],
        poppins: ['"poppins"', 'sans-serif']
      },
    },
  },
  plugins: [],
};
export default config;
