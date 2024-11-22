/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f5ff',
          100: '#edebfe',
          200: '#dcd7fe',
          300: '#cabffd',
          400: '#ac94fa',
          500: '#9061f9',
          600: '#7e3af2',
          700: '#6c2bd9',
          800: '#5521b5',
          900: '#4a1d96',
        },
      }
    },
  },
  plugins: [],
};