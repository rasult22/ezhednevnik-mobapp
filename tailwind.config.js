/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Кастомная палитра для темной темы
        accent: {
          gold: '#FFD700',
          fire: '#FF6B35',
          success: '#4CAF50',
        },
      },
      spacing: {
        // Кастомные отступы
        screen: '16px',
      },
    },
  },
  plugins: [],
}