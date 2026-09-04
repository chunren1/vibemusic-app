import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Champagne, Obsidian } from '@/src/theme/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  coverUrl: string;
  title: string;
  subtitle: string;
  tag?: string;
  onPress?: () => void;
};

export function GlassCard({ coverUrl, title, subtitle, tag, onPress }: Props): React.JSX.Element {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const aStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.965, { damping: 18, stiffness: 420 });
        glow.value = withSpring(1, { damping: 20, stiffness: 320 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 16, stiffness: 300 });
        glow.value = withSpring(0, { damping: 20, stiffness: 280 });
      }}
      style={[styles.shadow, aStyle]}
      className="mb-3 flex-1 overflow-hidden rounded-card"
    >
      {/* neon outer glow on press */}
      <Animated.View style={[styles.pressGlow, glowStyle]} pointerEvents="none">
        <LinearGradient
          colors={['rgba(139,92,246,0.22)', 'rgba(6,182,214,0.14)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <View style={styles.cardInner}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: coverUrl }} style={styles.image} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(10,10,15,0.72)', 'rgba(10,10,15,0.92)']}
            style={StyleSheet.absoluteFillObject}
          />
          {/* top sheen diagonal */}
          <LinearGradient
            colors={['rgba(255,255,255,0.14)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sheen}
          />

          {/* play badge — neon gradient */}
          <View style={styles.badgeWrap}>
            <BlurView intensity={28} tint="dark" style={styles.blurBadge}>
              <LinearGradient
                colors={['#8b5cf6', '#06b6d4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.badgeGrad}
              >
                <Text style={styles.badgeIcon}>▶</Text>
              </LinearGradient>
            </BlurView>
          </View>

          {tag ? (
            <View style={styles.tag}>
              <LinearGradient
                colors={['rgba(139,92,246,0.92)', 'rgba(109,40,217,0.92)']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.tagGrad}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </LinearGradient>
            </View>
          ) : null}
        </View>

        <View style={styles.meta}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
          <View style={styles.accentRow}>
            <LinearGradient
              colors={['#8b5cf6', '#06b6d4']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={styles.accentLine}
            />
            <View style={styles.champagneDot} />
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
  pressGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardInner: {
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: Obsidian.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  imageWrap: {
    position: 'relative',
    height: 148,
    width: '100%',
    overflow: 'hidden',
  },
  image: { height: '100%', width: '100%' },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    opacity: 0.9,
  },
  badgeWrap: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  blurBadge: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  badgeGrad: {
    height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
  },
  badgeIcon: { color: '#fff', fontSize: 11, fontWeight: '900', marginLeft: 1 },
  tag: {
    position: 'absolute',
    left: 10,
    top: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  tagGrad: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  meta: { paddingHorizontal: 12, paddingVertical: 12 },
  title: { color: '#fff', fontSize: 14, fontWeight: '800', lineHeight: 20 },
  subtitle: { color: '#a8a8c0', fontSize: 12, fontWeight: '500', marginTop: 2 },
  accentRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  accentLine: { height: 2, width: 32, borderRadius: 999 },
  champagneDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: Champagne.gold,
    opacity: 0.95,
  },
});
