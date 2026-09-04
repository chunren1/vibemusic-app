import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Champagne } from '@/src/theme/tokens';

type Props = {
  coverUrl: string;
  playing: boolean;
  size?: number;
};

export function VinylDisc({ coverUrl, playing, size = 292 }: Props): React.JSX.Element {
  const rot = useSharedValue(0);

  useEffect(() => {
    if (playing) {
      rot.value = withRepeat(withTiming(360, { duration: 9000, easing: Easing.linear }), -1, false);
    } else {
      cancelAnimation(rot);
    }
  }, [playing, rot]);

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rot.value % 360}deg` }],
  }));

  const coverSize = size * 0.62;
  const centerSize = size * 0.12;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      {/* outer neon bloom */}
      <LinearGradient
        colors={['rgba(139,92,246,0.32)', 'rgba(6,182,214,0.14)', 'transparent']}
        style={[styles.glow, { width: size + 56, height: size + 56, borderRadius: (size + 56) / 2 }]}
      />
      {/* champagne rim light */}
      <View
        style={[
          styles.champagneRing,
          { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 },
        ]}
      />
      <Animated.View
        style={[styles.disc, { width: size, height: size, borderRadius: size / 2 }, rStyle]}
      >
        <View style={[styles.vinyl, { borderRadius: size / 2 }]}>
          <View
            style={[styles.groove, { width: size * 0.92, height: size * 0.92, borderRadius: size * 0.46 }]}
          />
          <View
            style={[styles.groove, { width: size * 0.84, height: size * 0.84, borderRadius: size * 0.42 }]}
          />
          <View
            style={[styles.groove, { width: size * 0.76, height: size * 0.76, borderRadius: size * 0.38 }]}
          />
        </View>
        <View style={[styles.coverWrap, { width: coverSize, height: coverSize, borderRadius: coverSize / 2 }]}>
          <Image source={{ uri: coverUrl }} style={{ width: coverSize, height: coverSize, borderRadius: coverSize / 2 }} />
          <LinearGradient
            colors={['rgba(255,255,255,0.16)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
        <View style={[styles.centerHole, { width: centerSize, height: centerSize, borderRadius: centerSize / 2 }]} />
        <View
          style={[
            styles.centerDot,
            { width: centerSize * 0.35, height: centerSize * 0.35, borderRadius: centerSize * 0.18 },
          ]}
        />
      </Animated.View>

      <View style={styles.arm} pointerEvents="none">
        <View style={styles.armLine} />
        <View style={styles.armHead} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  glow: { position: 'absolute', top: -28, left: -28, opacity: 0.95 },
  champagneRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(212,165,116,0.18)',
    opacity: 0.9,
  },
  disc: {
    backgroundColor: '#0d0d18',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.65,
    shadowRadius: 30,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  vinyl: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f0f1e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e1e36',
  },
  groove: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  coverWrap: {
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#0a0a0f',
    zIndex: 2,
  },
  centerHole: {
    position: 'absolute',
    backgroundColor: '#1e1e36',
    borderWidth: 2,
    borderColor: 'rgba(139,92,246,0.85)',
    zIndex: 3,
  },
  centerDot: {
    position: 'absolute',
    backgroundColor: Champagne.gold,
    zIndex: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  arm: {
    position: 'absolute',
    right: -6,
    top: 22,
    width: 44,
    height: 120,
    alignItems: 'center',
  },
  armLine: {
    width: 4,
    height: 96,
    borderRadius: 2,
    backgroundColor: 'rgba(232,232,240,0.88)',
    transform: [{ rotate: '18deg' }],
  },
  armHead: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#c5c5d6',
    marginTop: -6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.18)',
  },
});
