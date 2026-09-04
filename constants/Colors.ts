import { Obsidian, Neon, Champagne, Mist } from '@/src/theme/tokens';

const ObsidianBloom = {
  // obsidian depth
  void: Obsidian.void,
  abyss: Obsidian.abyss,
  nebula: Obsidian.nebula,
  veil: Obsidian.veil,
  card: Obsidian.card,
  cardHover: Obsidian.cardHover,
  muted: Obsidian.muted,
  line: Obsidian.line,
  // neon
  neon: Neon.violet,
  neonBlue: Neon.blue,
  neonMagenta: Neon.magenta,
  neonGlow: Neon.violetGlow,
  neonBlueGlow: Neon.blueGlow,
  // champagne
  gold: Champagne.gold,
  goldLight: Champagne.goldLight,
  goldGlow: Champagne.goldGlow,
  // mist
  mist: Mist.secondary,
  mistLight: Mist.primary,
  mistMuted: Mist.muted,
} as const;

// Velvet alias for backward compat — points to Neon now
const Velvet = {
  primary: Neon.violet,
  primaryDark: Neon.violetDeep,
  primaryDeeper: '#4c1d95',
  glow: Neon.violetGlow,
  ink: Obsidian.void,
  inkSoft: Obsidian.abyss,
  inkCard: Obsidian.card,
  mist: Mist.secondary,
  mistLight: Mist.primary,
} as const;

const Colors = {
  light: {
    text: '#0a0a0f',
    background: '#f8f7ff',
    tint: Neon.violet,
    icon: '#6b6b88',
    tabIconDefault: '#a8a8c0',
    tabIconSelected: Neon.violet,
  },
  dark: {
    text: '#e8e8f0',
    background: Obsidian.void,
    tint: Neon.violet,
    icon: '#a8a8c0',
    tabIconDefault: '#6b6b88',
    tabIconSelected: Neon.violet,
  },
  obsidian: ObsidianBloom,
  velvet: Velvet,
} as const;

export default Colors;
export { Velvet, ObsidianBloom, Obsidian, Neon, Champagne };
