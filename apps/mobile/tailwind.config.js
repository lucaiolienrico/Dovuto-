/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        success: '#10b981',
        warning: '#f59e0b',
        danger:  '#f43f5e',
      },
      fontFamily: {
        sans:    ['DMSans_400Regular'],
        medium:  ['DMSans_500Medium'],
        bold:    ['DMSans_700Bold'],
        black:   ['DMSans_800ExtraBold'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
      },
    },
  },
  plugins: [],
}
