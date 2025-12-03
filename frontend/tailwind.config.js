/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Professional Corporate Color Palette
        slate: {
          dark: '#0f172a',
          medium: '#334155',
          text: '#64748b',
        },
        blue: {
          primary: '#2563eb',
          hover: '#1d4ed8',
        },
        gray: {
          light: '#f1f5f9',
          border: '#e2e8f0',
        },
        // Accent Colors
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        maintenance: '#6b7280',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
    },
  },
  plugins: [],
}
