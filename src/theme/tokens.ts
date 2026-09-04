/** Obsidian Bloom — AAA luxury theme for vibemusic-app (independent from web Velvet) */
export const Obsidian = {
  // deep space — 3-layer depth
  void: '#0a0a0f',
  abyss: '#0f0f1a',
  nebula: '#141428',
  veil: '#1a1a2e',
  card: '#1e1e36',
  cardHover: '#252542',
  muted: '#2a2a4a',
  line: 'rgba(255,255,255,0.07)',
  lineStrong: 'rgba(255,255,255,0.11)',
} as const;

export const Neon = {
  violet: '#8b5cf6',
  violetDeep: '#6d28d9',
  violetGlow: 'rgba(139,92,246,0.42)',
  blue: '#06b6d4',
  blueDeep: '#0891b2',
  blueGlow: 'rgba(6,182,214,0.38)',
  magenta: '#ec4899',
  magentaGlow: 'rgba(236,72,153,0.34)',
  // gradient pairs (AAA game bloom)
  gradViolet: ['#8b5cf6', '#06b6d4'] as const,
  gradBloom: ['#8b5cf6', '#ec4899', '#06b6d4'] as const,
  gradMidnight: ['#0a0a0f', '#1a1a3e', '#0f172a'] as const,
  gradPlayer: ['#0a0a0f', '#141432', '#1e1a4a', '#0a0a0f'] as const,
  gradCardSheen: ['rgba(139,92,246,0.16)', 'rgba(6,182,214,0.08)', 'transparent'] as const,
} as const;

export const Champagne = {
  gold: '#d4a574',
  goldLight: '#f5d0a0',
  goldDeep: '#b8935f',
  goldGlow: 'rgba(212,165,116,0.32)',
  brass: '#c9a96e',
  shimmer: 'rgba(245,208,160,0.18)',
} as const;

export const Mist = {
  primary: '#e8e8f0',
  secondary: '#a8a8c0',
  muted: '#6b6b88',
  faint: 'rgba(255,255,255,0.06)',
} as const;

export const Radii = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  card: 20,
  pill: 999,
} as const;

export const Shadows = {
  neonViolet: '0 8px 32px rgba(139,92,246,0.35)',
  neonBlue: '0 8px 32px rgba(6,182,214,0.28)',
  champagne: '0 6px 24px rgba(212,165,116,0.22)',
  obsidian: '0 8px 32px rgba(0,0,0,0.55)',
  card: '0 4px 24px rgba(0,0,0,0.50)',
  vinyl: '0 18px 48px rgba(0,0,0,0.65)',
} as const;

export const Springs = {
  silky: { damping: 22, stiffness: 320, mass: 0.7 },
  bouncy: { damping: 16, stiffness: 280, mass: 0.85 },
  snappy: { damping: 24, stiffness: 420, mass: 0.6 },
  gentle: { damping: 26, stiffness: 240, mass: 1 },
} as const;

export const Motion = {
  tab: 220,
  press: 140,
  bloom: 2600,
  drift: 8000,
} as const;

export const Glass = {
  bg: 'rgba(255,255,255,0.06)',
  bgStrong: 'rgba(255,255,255,0.09)',
  border: 'rgba(255,255,255,0.10)',
  borderNeon: 'rgba(139,92,246,0.22)',
  blur: 20,
} as const;
