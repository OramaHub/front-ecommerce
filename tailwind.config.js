export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'glass-shimmer': {
          '0%': { transform: 'translateX(-100%) rotate(15deg)' },
          '100%': { transform: 'translateX(200%) rotate(15deg)' },
        },
        'glass-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'glass-shimmer': 'glass-shimmer 1.2s ease-in-out',
        'glass-float': 'glass-float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-radix'),
    require('tailwindcss-animate'),
  ],
}
