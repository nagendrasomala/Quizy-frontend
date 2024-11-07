/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Hides scrollbar in Firefox */
          'scrollbar-width': 'none',
          /* Hides scrollbar in WebKit browsers */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
}

