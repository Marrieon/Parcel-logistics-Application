/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin'); // 1. Import the plugin function

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00A396",
        secondary: "#2F4858",
        neutral: "#F7FAFC",
        "base-text": "#36454F",
        success: "#48BB78",
        error: "#F56565",
      },
      backgroundPosition: {
        'left-center': 'left center',
      }
    },
  },
  plugins: [
    plugin(function({ addUtilities, theme }) {
      const newUtilities = {
        '.bg-left-center': {
          backgroundPosition: theme('backgroundPosition.left-center'),
        },
      }
      addUtilities(newUtilities)
    }),
    require('@tailwindcss/typography'),
  ],
}