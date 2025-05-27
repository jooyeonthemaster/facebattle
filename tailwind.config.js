/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'media', // 'media' 또는 'class'
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#0a0a0a',
        },
        foreground: {
          light: '#171717',
          dark: '#ededed',
        },
      },
      backgroundColor: {
        'battle-bg': '#000000',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'text-shine': 'text-shine 3s linear infinite',
        'text-glow': 'text-glow 2s ease-in-out infinite',
        'gradient': 'gradientBackground 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'width-pulse': 'width-pulse 2s ease-in-out infinite',
        'confetti': 'confetti 5s ease-in forwards',
      },
      keyframes: {
        'text-shine': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'width-pulse': {
          '0%, 100%': { 
            width: '0',
            opacity: '0',
          },
          '50%': { 
            width: '100%',
            opacity: '1',
          },
        },
        'confetti': {
          '0%': { 
            transform: 'translateY(0) rotate(0deg)',
            opacity: '1',
          },
          '100%': { 
            transform: 'translateY(1000px) rotate(720deg)',
            opacity: '0',
          },
        },
        'text-glow': {
          '0%, 100%': { textShadow: '0 0 10px rgba(255, 255, 255, 0.3)' },
          '50%': { textShadow: '0 0 20px rgba(139, 92, 246, 0.8)' },
        },
        'gradientBackground': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}; 