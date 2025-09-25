/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      colors: {
        // Colores de marca centralizados - tonos azules
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Color principal de marca
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Tonos adicionales para tema claro/oscuro
        brand: {
          light: '#3b82f6',
          dark: '#60a5fa',
        },
        // Fondos diferenciados para jerarquía visual
        surface: {
          // Navegación y header
          nav: {
            light: '#f9fafb', // gray-50
            dark: '#1f2937', // gray-800
          },
          // Footer y secciones secundarias
          footer: {
            light: '#f3f4f6', // gray-100
            dark: '#1f2937', // gray-800
          },
          // Contenido principal
          main: {
            light: '#ffffff', // white
            dark: '#111827', // gray-900
          },
        },
        // Colores interactivos centralizados para efectos modernos
        interactive: {
          hover: 'rgb(37 99 235)', // primary-600
          focus: 'rgb(59 130 246)', // primary-500
          active: 'rgb(29 78 216)', // primary-700
          glow: 'rgb(96 165 250)', // primary-400
          // Borders especializados
          'border-hover': 'rgb(96 165 250)', // primary-400
          'border-focus': 'rgb(59 130 246)', // primary-500
          'border-default': 'rgb(229 231 235)', // gray-200
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        // Text shadows centralizados para mejor contraste
        '.text-shadow-sm': {
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.6)',
        },
        '.text-shadow-md': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
        },
        '.text-shadow-lg': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
        },
        '.text-shadow-xl': {
          textShadow: '4px 4px 8px rgba(0, 0, 0, 0.9)',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
      };
      addUtilities(newUtilities);
    },
  ],
  darkMode: 'class',
};
