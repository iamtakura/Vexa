/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '480px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      colors: {
        purple: {
          DEFAULT: 'var(--purple)',
          mid: 'var(--purple-mid)',
          light: 'var(--purple-light)',
          card: 'var(--purple-card)',
        },
        coral: {
          DEFAULT: 'var(--coral)',
          soft: 'var(--coral-soft)',
          glow: 'var(--coral-glow)',
        },
        white: 'var(--white)',
        muted: 'var(--muted)',
        dim: 'var(--dim)',
        error: 'var(--error)',
        success: 'var(--success)',
      },
      fontFamily: {
        fredoka: ['var(--font-fredoka)', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
