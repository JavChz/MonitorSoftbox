/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#0a0a0c',
          900: '#121216',
          850: '#17171d',
          800: '#1e1e26',
          700: '#2a2a36',
          600: '#3c3c4d',
        },
        cinematic: {
          amber: '#f59e0b',
          tungsten: '#ff9933',
          daylight: '#60a5fa',
          neon: '#06b6d4',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
