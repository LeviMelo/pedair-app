/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // The main HTML file in the frontend root
    "./src/**/*.{js,ts,jsx,tsx}", // All JS/TS/JSX/TSX files in frontend/src
  ],
  theme: {
    extend: {
      // We can add our custom color palette here later
    },
  },
  plugins: [],
}