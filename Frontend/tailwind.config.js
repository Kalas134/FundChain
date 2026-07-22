/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS 변수들과 테일윈드 이름을 매핑해 줍니다.
        funding: 'var(--primary-btn)', // #6366F1
        warning: 'var(--warning)',     // #FF6584
        accent: 'var(--accent)',       // #00D4B2
        tcolor: 'var(--text)',
        thcolor: 'var(--text)',
        bg: 'var(--bg)'
      }
    },
  },
  plugins: [],
}