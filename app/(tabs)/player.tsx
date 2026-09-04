import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LyricLine } from '@/src/components/LyricLine';
import { MiniPlayer } from '@/src/components/MiniPlayer';
import { SpectrumBars } from '@/src/components/SpectrumBars';
import { VinylDisc } from '@/src/components/VinylDisc';
import { usePlayerGestures } from '@/src/hooks/usePlayerGestures';
import { type Track, usePlayerStore } from '@/src/stores/player';

type Lyric = { time: number; text: string; trans?: string };
const LYRICS: Lyric[] = [
  { time: 0, text: 'Midnight bloom in obsidian air', trans: '午夜花开于黑曜空气中' },
  { time: 6, text: 'Neon rivers running through the night', trans: '霓虹河流穿过夜色' },
  { time: 13, text: 'Your whisper turns the silence to a song', trans: '你的低语让寂静成歌' },
  { time: 20, text: 'Every heartbeat finds where it belongs', trans: '每一次心跳找到归属' },
  { time: 27, text: 'Hold that frequency, don’t let go', trans: '抓住这个频率，别松手' },
  { time: 34, text: 'We are glass and afterglow', trans: '我们是玻璃与余晖' },
  { time: 41, text: 'Obsidian bloom, play it again', trans: '黑曜绽放，再来一遍' },
  { time: 48, text: ' till the sunrise bends', trans: '直到日出弯折地平线' },
];

const PLAYLIST: Track[] = [
  { id: '1', title: 'Midnight Bloom — Obsidian', artist: 'Vibe Collective • After Hours', coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80', duration: 213 },
  { id: '2', title: 'Glass Harbor — Ocean Tape', artist: 'Ocean Tape • Harbor Mix', coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80', duration: 198 },
  { id: '3', title: 'Neon Afterglow', artist: 'Kilo Bloom', coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80', duration: 225 },
];

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export default function PlayerScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const { track, playing, progress, toggle, setProgress, setTrack } = usePlayerStore();
  const [activeIdx, setActiveIdx] = useState(2);
  const [curIdx, setCurIdx] = useState(0);
  const pulse = useSharedValue(0);
  const bgShift = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }), -1, true);
    bgShift.value = withRepeat(withTiming(1, { duration: 8600, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [pulse, bgShift]);

  const elapsed = useMemo(() => (track ? track.duration * progress : 0), [track, progress]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress(Math.min(1, progress + 1 / 213));
      const t = elapsed + 1;
      const idx = LYRICS.findIndex((l, i) => t >= l.time && t < (LYRICS[i + 1]?.time ?? 999));
      if (idx !== -1) setActiveIdx(idx);
    }, 1000);
    return () => clearInterval(id);
  }, [playing, progress, elapsed, setProgress]);

  const goNext = useCallback(() => {
    const n = (curIdx + 1) % PLAYLIST.length;
    setCurIdx(n);
    setTrack(PLAYLIST[n] as Track);
    setProgress(0.02);
  }, [curIdx, setTrack, setProgress]);

  const goPrev = useCallback(() => {
    const p = (curIdx - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurIdx(p);
    setTrack(PLAYLIST[p] as Track);
    setProgress(0.02);
  }, [curIdx, setTrack, setProgress]);

  const { swipe } = usePlayerGestures({ onNext: goNext, onPrev: goPrev });

  const vinylParallax = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(Math.abs(swipe.translateX.value), [0, 120], [1, 0.97], 'clamp') }],
    opacity: interpolate(Math.abs(swipe.translateX.value), [0, 160], [1, 0.88], 'clamp'),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.52 + pulse.value * 0.34,
    transform: [{ scale: 1 + pulse.value * 0.045 }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(bgShift.value, [0, 1], [-18, 18]) },
      { translateY: interpolate(bgShift.value, [0, 1], [-10, 10]) },
    ],
  }));

  if (!track)
    return (
      <View style={styles.emptyRoot}>
        <Text style={styles.emptyText}>暂无播放</Text>
      </View>
    );

  const nextTrack = PLAYLIST[(curIdx + 1) % PLAYLIST.length] as Track;

  return (
    <View style={styles.root}>
      {/* deep-space obsidian backdrop */}
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.View style={[StyleSheet.absoluteFillObject, bgStyle]}>
          <LinearGradient
            colors={['#0a0a0f', '#141432', '#1e1a4a', '#0a0a0f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
          {/* neon orbs */}
          <Animated.View style={[styles.orbA, glowStyle]}>
            <LinearGradient
              colors={['rgba(139,92,246,0.52)', 'rgba(139,92,246,0.14)', 'transparent']}
              style={StyleSheet.absoluteFillObject}
            />
          </Animated.View>
          <View style={styles.orbB}>
            <LinearGradient colors={['rgba(6,182,214,0.22)', 'transparent']} style={StyleSheet.absoluteFillObject} />
          </View>
          <View style={styles.orbC}>
            <LinearGradient colors={['rgba(236,72,153,0.16)', 'transparent']} style={StyleSheet.absoluteFillObject} />
          </View>
          {/* champagne micro-glow top */}
          <View style={styles.champagneWash}>
            <LinearGradient colors={['rgba(212,165,116,0.07)', 'transparent']} style={StyleSheet.absoluteFillObject} />
          </View>
        </Animated.View>
        <BlurView intensity={7} tint="dark" style={StyleSheet.absoluteFillObject} />
        <LinearGradient colors={['rgba(10,10,15,0.14)', 'rgba(10,10,15,0.72)']} style={StyleSheet.absoluteFillObject} />
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 10, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.kickerRow}>
            <View style={styles.kickerDot} />
            <Text style={styles.kicker}>NOW PLAYING • 滑动切歌</Text>
            <View style={styles.kickerDotGold} />
          </View>
          <Text numberOfLines={1} style={styles.title}>
            {track.title}
          </Text>
          <Text style={styles.artist}>{track.artist}</Text>
          <View style={styles.swipeHintRow}>
            <View style={styles.swipeLineActive} />
            <Text style={styles.swipeHintText}>← 滑动切歌 →</Text>
            <View style={styles.swipeLineIdle} />
          </View>
        </View>

        <GestureDetector gesture={swipe.gesture}>
          <Animated.View style={swipe.animatedStyle}>
            <View style={styles.vinylWrap}>
              <Animated.View style={vinylParallax}>
                <VinylDisc coverUrl={track.coverUrl} playing={playing} size={292} />
              </Animated.View>
              <View style={styles.spectrumWrap}>
                <SpectrumBars playing={playing} count={28} color="#8b5cf6" />
              </View>
              <Animated.View style={[styles.swipeHint, swipe.indicatorStyle]}>
                <Text style={styles.swipeHintLabel}>松手切换</Text>
              </Animated.View>
            </View>
          </Animated.View>
        </GestureDetector>

        <View style={styles.glassOuter}>
          <BlurView intensity={22} tint="dark" style={styles.glassBlur}>
            <LinearGradient
              colors={['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.03)']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.glassInner}>
              <View style={styles.neonTopLine}>
                <LinearGradient
                  colors={['rgba(139,92,246,0.45)', 'rgba(6,182,214,0.22)', 'transparent']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFillObject}
                />
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeText}>{fmt(elapsed)}</Text>
                <Text style={styles.timeTextDim}>{fmt(track.duration)}</Text>
              </View>
              <Pressable
                onPress={(e) => setProgress(Math.max(0, Math.min(1, e.nativeEvent.locationX / 280)))}
                style={styles.progressTrack}
              >
                <LinearGradient
                  colors={['#8b5cf6', '#06b6d4']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[styles.progressFill, { width: `${progress * 100}%` }]}
                />
                <View style={[styles.progressThumb, { left: `${progress * 100}%`, marginLeft: -7 }]} />
              </Pressable>

              <View style={styles.controls}>
                <Pressable onPress={goPrev} style={styles.ctrlBtnSm}>
                  <Text style={styles.ctrlIconSm}>⏮</Text>
                </Pressable>
                <Pressable onPress={toggle} style={styles.playBtn}>
                  <LinearGradient
                    colors={['#8b5cf6', '#7c3aed', '#06b6d4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={StyleSheet.absoluteFillObject}
                  />
                  <Text style={styles.playIcon}>{playing ? '⏸' : '▶'}</Text>
                </Pressable>
                <Pressable onPress={goNext} style={styles.ctrlBtnSm}>
                  <Text style={styles.ctrlIconSm}>⏭</Text>
                </Pressable>
              </View>

              <View style={styles.chips}>
                <View style={styles.chipIdle}>
                  <Text style={styles.chipIdleText}>REPEAT</Text>
                </View>
                <LinearGradient
                  colors={['rgba(139,92,246,0.20)', 'rgba(6,182,214,0.14)']}
                  style={styles.chipActive}
                >
                  <View style={styles.chipDot} />
                  <Text style={styles.chipActiveText}>OBSIDIAN EQ • ON</Text>
                </LinearGradient>
              </View>
              <Text style={styles.nextHint}>下一首: {nextTrack.title} — 滑动或点⏭</Text>
            </View>
          </BlurView>
        </View>

        <View style={styles.lyrics}>
          <Text style={styles.lyricsHead}>LYRICS • 流光歌词</Text>
          <View style={styles.lyricsList}>
            {LYRICS.map((l, idx) => (
              <LyricLine key={idx} text={l.text} translation={l.trans} active={idx === activeIdx} />
            ))}
          </View>
        </View>
      </ScrollView>

      <MiniPlayer onPlayPress={toggle} aiSlot={{ enabled: true, onTrigger: () => {} }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0f' },
  emptyRoot: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f' },
  emptyText: { color: 'rgba(232,232,240,0.55)', fontSize: 14 },
  orbA: { position: 'absolute', top: -60, right: -70, width: 440, height: 440, borderRadius: 220, overflow: 'hidden' },
  orbB: { position: 'absolute', bottom: -30, left: -56, width: 380, height: 380, borderRadius: 190, overflow: 'hidden', opacity: 0.9 },
  orbC: { position: 'absolute', top: '38%', left: '28%', width: 220, height: 220, borderRadius: 110, overflow: 'hidden', opacity: 0.85 },
  champagneWash: { position: 'absolute', top: 0, left: 0, right: 0, height: 220, opacity: 1 },
  header: { alignItems: 'center', paddingHorizontal: 20 },
  kickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  kickerDot: { width: 6, height: 6, borderRadius: 999, backgroundColor: '#8b5cf6' },
  kickerDotGold: { width: 6, height: 6, borderRadius: 999, backgroundColor: '#d4a574', opacity: 0.9 },
  kicker: { color: 'rgba(232,232,240,0.62)', fontSize: 11, fontWeight: '800', letterSpacing: 1.8 },
  title: { marginTop: 8, color: '#fff', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  artist: { marginTop: 4, color: 'rgba(232,232,240,0.52)', fontSize: 12, letterSpacing: 0.4, textAlign: 'center' },
  swipeHintRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  swipeLineActive: { width: 22, height: 2, borderRadius: 999, backgroundColor: '#8b5cf6' },
  swipeLineIdle: { width: 22, height: 2, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)' },
  swipeHintText: { color: 'rgba(232,232,240,0.32)', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  vinylWrap: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 24 },
  spectrumWrap: { marginTop: 16 },
  swipeHint: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  swipeHintLabel: { color: 'rgba(255,255,255,0.58)', fontSize: 11, fontWeight: '700' },
  glassOuter: { marginHorizontal: 16, overflow: 'hidden', borderRadius: 24 },
  glassBlur: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
  glassInner: { borderRadius: 24, padding: 16 },
  neonTopLine: { position: 'absolute', top: 0, left: 16, right: 16, height: 1, overflow: 'hidden', opacity: 0.9 },
  timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeText: { color: 'rgba(255,255,255,0.72)', fontSize: 12, fontWeight: '700', fontVariant: ['tabular-nums'] },
  timeTextDim: { color: 'rgba(255,255,255,0.38)', fontSize: 12, fontWeight: '600', fontVariant: ['tabular-nums'] },
  progressTrack: { marginTop: 12, height: 6, overflow: 'hidden', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.09)' },
  progressFill: { height: '100%', borderRadius: 999 },
  progressThumb: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  controls: { marginTop: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctrlBtnSm: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctrlIconSm: { color: '#fff', fontSize: 16 },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.42,
    shadowRadius: 18,
    elevation: 12,
  },
  playIcon: { color: '#fff', fontSize: 22, fontWeight: '900', marginLeft: 2 },
  chips: { marginTop: 14, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  chipIdle: { borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', paddingHorizontal: 12, paddingVertical: 6 },
  chipIdleText: { color: 'rgba(255,255,255,0.52)', fontSize: 10, fontWeight: '800', letterSpacing: 0.9 },
  chipActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipDot: { width: 6, height: 6, borderRadius: 999, backgroundColor: '#d4a574' },
  chipActiveText: { color: '#a78bfa', fontSize: 10, fontWeight: '800', letterSpacing: 0.9 },
  nextHint: { marginTop: 10, color: 'rgba(232,232,240,0.28)', fontSize: 10, letterSpacing: 0.7, textAlign: 'center' },
  lyrics: { marginTop: 26 },
  lyricsHead: { paddingHorizontal: 24, color: 'rgba(232,232,240,0.32)', fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  lyricsList: { marginTop: 12, gap: 2 },
});
