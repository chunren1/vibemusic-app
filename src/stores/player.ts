import { create } from 'zustand';

export type Track = {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  duration: number;
};

type PlayerState = {
  track: Track | null;
  playing: boolean;
  progress: number;
  setTrack: (t: Track | null) => void;
  toggle: () => void;
  setProgress: (v: number) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  track: {
    id: 'demo',
    title: 'Velvet Encore — Midnight Bloom',
    artist: 'Vibe Collective • After Hours',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    duration: 213,
  },
  playing: true,
  progress: 0.34,
  setTrack: (track) => set({ track }),
  toggle: () => set((s) => ({ playing: !s.playing })),
  setProgress: (progress) => set({ progress }),
}));
