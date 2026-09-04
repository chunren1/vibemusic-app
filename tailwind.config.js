/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0a0a0f',
          abyss: '#0f0f1a',
          nebula: '#141428',
          veil: '#1a1a2e',
          card: '#1e1e36',
          hover: '#252542',
          muted: '#2a2a4a',
          line: 'rgba(255,255,255,0.07)',
        },
        neon: {
          DEFAULT: '#8b5cf6',
          violet: '#8b5cf6',
          blue: '#06b6d4',
          magenta: '#ec4899',
          glow: 'rgba(139,92,246,0.42)',
          glowBlue: 'rgba(6,182,214,0.38)',
        },
        champagne: {
          DEFAULT: '#d4a574',
          light: '#f5d0a0',
          deep: '#b8935f',
          glow: 'rgba(212,165,116,0.32)',
        },
        mist: {
          DEFAULT: '#a8a8c0',
          light: '#e8e8f0',
          faint: 'rgba(255,255,255,0.06)',
          muted: '#6b6b88',
        },
        // legacy alias — keep for incremental migration, maps to neon
        velvet: {
          DEFAULT: '#8b5cf6',
          dark: '#6d28d9',
          deeper: '#4c1d95',
          light: '#ede9fe',
          glow: 'rgba(139,92,246,0.35)',
        },
        ink: {
          DEFAULT: '#0a0a0f',
          soft: '#0f0f1a',
          card: '#1e1e36',
          muted: '#2a2a4a',
        },
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
      boxShadow: {
        neon: '0 8px 32px rgba(139,92,246,0.35)',
        neonBlue: '0 8px 32px rgba(6,182,214,0.28)',
        champagne: '0 6px 24px rgba(212,165,116,0.22)',
        glass: '0 8px 32px rgba(0,0,0,0.55)',
        card: '0 4px 24px rgba(0,0,0,0.50)',
      },
    },
  },
  plugins: [],
};
