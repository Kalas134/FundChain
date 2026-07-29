/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        funding: 'var(--primary-btn)', // #6366F1 (Indigo)
        warning: 'var(--warning)',     // #FF6584 (Pinkish Red)
        accent: 'var(--accent)',       // #00D4B2 (Mint)
        tcolor: 'var(--text)',         // #0F172A (Main Slate)
        thcolor: 'var(--text-h)',      // #1E293B (Dark Slate)
        muted: '#64748B',              // Muted slate gray
        bg: 'var(--bg)',               // #F8FAFC
        border: 'var(--border)',       // #E2E8F0
      },
      maxWidth: {
        'content': '1200px',
      }
    },
  },
  plugins: [],
}