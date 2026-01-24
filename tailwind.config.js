/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
          light: '#EF4444',
        },
        dark: {
          DEFAULT: '#111827',
          light: '#1F2937',
          lighter: '#374151',
        },
        accent: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
        }
      },
    },
  },
  plugins: [],
}
