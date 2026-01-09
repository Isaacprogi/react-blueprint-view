/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Scan all your source files where Tailwind classes are used
    "./src/**/*.{ts,tsx}",
  ],
  important: '.routekeeper-vision',
  theme: {
    extend: {},
  },
  plugins: [],
  // Highly recommended for component libraries
  corePlugins: {
    preflight: false, // Prevents your library from injecting global base styles (like resetting margin/padding) that could conflict with consumer apps
  },
};