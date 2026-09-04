import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated';

type Props = {
  scrollY: SharedValue<number>;
  value: string;
  onChangeText: (t: string) => void;
  onSubmit?: () => void;
};

const HEADER_H = 292;
const COLLAPSED_H = 96;

export function ParallaxHeader({ scrollY, value, onChangeText, onSubmit }: Props): React.JSX.Element {
  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, HEADER_H], [0, -HEADER_H * 0.34], 'clamp') },
      { scale: interpolate(scrollY.value, [-120, 0], [1.18, 1], 'clamp') },
    ],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, HEADER_H - COLLAPSED_H], [1, 0.18], 'clamp'),
    transform: [{ translateY: interpolate(scrollY.value, [0, 80], [0, -10], 'clamp') }],
  }));

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(scrollY.value, [0, 80], [0, -6], 'clamp') }],
    opacity: interpolate(scrollY.value, [HEADER_H - 40, HEADER_H], [1, 0.98], 'clamp'),
  }));

  return (
    <View style={{ height: HEADER_H }} className="overflow-hidden">
      <Animated.View style={[StyleSheet.absoluteFillObject, imageStyle]}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80' }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(10,10,15,0.08)', 'rgba(10,10,15,0.45)', '#0a0a0f']}
          style={StyleSheet.absoluteFillObject}
        />
        {/* neon bloom blobs */}
        <View style={[styles.blob, { top: -36, right: -28, backgroundColor: 'rgba(139,92,246,0.42)' }]} />
        <View style={[styles.blob, { bottom: 42, left: -22, width: 220, height: 220, backgroundColor: 'rgba(6,182,214,0.22)' }]} />
        <View style={[styles.blob, { top: 68, left: '42%', width: 160, height: 160, backgroundColor: 'rgba(236,72,153,0.18)' }]} />
      </Animated.View>

      <Animated.View style={[styles.center, overlayStyle]} pointerEvents="none">
        <View style={styles.kickerRow}>
          <View style={styles.kickerLine} />
          <Text style={styles.kicker}>OBSIDIAN BLOOM • 2026</Text>
          <View style={styles.kickerLine} />
        </View>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>霓虹深空 · 香槟微光</Text>
        <LinearGradient
          colors={['#8b5cf6', '#06b6d4']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.titleUnderline}
        />
      </Animated.View>

      {/* glass search bar — champagne focus ring */}
      <Animated.View style={[styles.barWrap, barStyle]}>
        <BlurView intensity={26} tint="dark" style={styles.blurBar}>
          <LinearGradient
            colors={['rgba(255,255,255,0.09)', 'rgba(255,255,255,0.04)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.barInner}>
            <View style={styles.searchIconWrap}>
              <Text style={styles.searchIcon}>⌕</Text>
            </View>
            <TextInput
              value={value}
              onChangeText={onChangeText}
              onSubmitEditing={onSubmit}
              placeholder="搜索歌曲、歌手、专辑…"
              placeholderTextColor="rgba(232,232,240,0.42)"
              returnKeyType="search"
              style={styles.input}
            />
            {value.length > 0 ? (
              <View style={styles.countPill}>
                <LinearGradient
                  colors={['#8b5cf6', '#06b6d4']}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.countText}>{value.length}</Text>
              </View>
            ) : null}
          </View>
        </BlurView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.95,
  },
  center: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  kickerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  kickerLine: { width: 18, height: 1, backgroundColor: 'rgba(212,165,116,0.55)', borderRadius: 999 },
  kicker: { color: 'rgba(245,208,160,0.92)', fontSize: 10, fontWeight: '800', letterSpacing: 2.2 },
  title: { marginTop: 8, color: '#fff', fontSize: 34, fontWeight: '900', letterSpacing: -0.8, textAlign: 'center' },
  subtitle: { marginTop: 4, color: 'rgba(232,232,240,0.62)', fontSize: 12, fontWeight: '600', letterSpacing: 3.2 },
  titleUnderline: { marginTop: 12, width: 42, height: 2.5, borderRadius: 999, opacity: 0.95 },
  barWrap: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  blurBar: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  barInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 999,
    backgroundColor: 'rgba(139,92,246,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: { color: 'rgba(255,255,255,0.82)', fontSize: 14, fontWeight: '700' },
  input: { flex: 1, color: '#fff', fontSize: 15, padding: 0 },
  countPill: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    overflow: 'hidden',
    minWidth: 28,
    alignItems: 'center',
  },
  countText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
