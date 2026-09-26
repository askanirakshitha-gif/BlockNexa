/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          950: '#070d19',
          900: '#0b1528',
          850: '#0f1d37',
          800: '#142546',
          700: '#1d345f',
          600: '#2b4c85',
          500: '#3b82f6',
          accent: '#1e3a8a',
          red: '#dc2626',
          gold: '#f59e0b',
          green: '#10b981',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      }
    },
  },
  plugins: [],
}

