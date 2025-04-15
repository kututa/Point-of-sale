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
        primary: '#6B4F3B',    // Antique Brown
        secondary: '#D6A75B',  // Warm Gold
        background: {
          light: '#F5F3EF',    // Soft Beige
          dark: '#2C2C2C',     // Deep Charcoal
        },
        surface: '#FFFFFF',    // Classic White
        text: {
          dark: '#2C2C2C',     // Deep Charcoal
          light: '#FFFFFF',    // White
        },
        accent: {
          light: '#D6A75B',    // Warm Gold
          dark: '#A2674C',     // Rustic Copper
        },
        error: '#D9534F',      // Soft Red
        success: '#5CB85C',    // Natural Green
        border: '#E0DCD5',     // Gentle contrast
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(224, 220, 213, 0.3)',
        'medium': '0 4px 20px rgba(224, 220, 213, 0.5)',
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      minHeight: {
        'screen-without-nav': 'calc(100vh - 4rem)',
      },
      maxHeight: {
        'screen-without-nav': 'calc(100vh - 4rem)',
      },
    },
  },
  plugins: [],
}