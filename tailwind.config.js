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
        midnight: {
          950: '#070B14',
          900: '#0B1220', // Midnight navy
          800: '#111C2F', // Deep navy
          700: '#19263E',
          600: '#22324F',
        },
        cyan: {
          accent: '#67E8F9',
          glow: '#22D3EE',
        },
        electric: {
          blue: '#3B82F6',
          dark: '#1D4ED8',
        },
        slate: {
          muted: '#94A3B8',
          dark: '#64748B',
          light: '#F8FAFC',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
