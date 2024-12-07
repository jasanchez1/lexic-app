/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eef7f6',
          100: '#d5ebe8',
          200: '#aed7d2',
          300: '#7fb8b1',
          400: '#509c94',
          500: '#2c7f77',  // Main brand color - Teal
          600: '#236661',
          700: '#1d524d',
          800: '#183f3c',
          900: '#142f2d',
        },
        secondary: {
          50:  '#fdf3f3',
          100: '#fbe7e7',
          200: '#f6c7c7',
          300: '#ef9898',
          400: '#e66f6f',
          500: '#d93939',  // Secondary - Warm Red
          600: '#c42d2d',
          700: '#a32525',
          800: '#862121',
          900: '#6f1d1d',
        },
        accent: {
          50:  '#f7f7f2',
          100: '#eeebd9',
          200: '#e2dbb4',
          300: '#d4c682',
          400: '#c7b155',
          500: '#b99b2a',  // Accent - Warm Gold
          600: '#9c7e21',
          700: '#7c611c',
          800: '#66501b',
          900: '#544219',
        }
      }
    },
  },
  plugins: [],
}