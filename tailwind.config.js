/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#EFEEEA',
          100: '#DDD9D2',
          200: '#BDB7AE',
          300: '#9D968C',
          400: '#716C64',
          500: '#4B4843',
          600: '#34322E',
          700: '#24231F',
          800: '#1B1A17',
          900: '#12110F',
        },
        gold: {
          50: '#F5F2EF',
          100: '#E9E2DB',
          200: '#D2C6BA',
          300: '#B8A898',
          400: '#9A8978',
          500: '#806F60',
          600: '#67594D',
          700: '#4F443B',
          800: '#39312B',
          900: '#251F1C',
        },
        cream: {
          50: '#FBFAF8',
          100: '#F6F4F0',
          200: '#F0EEE9',
          300: '#DED9D1',
          400: '#C5BDB1',
        },
        ink: '#161512',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        hero: 'clamp(3.5rem, 10vw, 12rem)',
        display: 'clamp(2.5rem, 6vw, 7rem)',
        title: 'clamp(2rem, 4vw, 4.5rem)',
      },
      letterSpacing: {
        tightest: '-0.06em',
        'tighter-2': '-0.04em',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      animation: {
        marquee: 'marquee 44s linear infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-20px)' } },
        shimmer: { '0%, 100%': { opacity: 0.3 }, '50%': { opacity: 1 } },
      },
    },
  },
  plugins: [],
}
