import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type ShimmerCardProps = {
  height?: number;
  borderRadius?: number;
};

export function ShimmerCard({ height = 180, borderRadius = 20 }: ShimmerCardProps): React.JSX.Element {
  const x = useSharedValue(-1);

  useEffect(() => {
    x.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }),
      -1,
      false,
    );
  }, [x]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value * 260 }],
  }));

  return (
    <View
      style={[styles.base, { height, borderRadius }]}
      className="overflow-hidden bg-ink-card"
    >
      <Animated.View style={[styles.sweep, style]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.08)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
      <View className="absolute bottom-0 left-0 right-0 p-3">
        <View className="h-3 w-2/3 rounded-full bg-white/10" />
        <View className="mt-2 h-2 w-1/2 rounded-full bg-white/5" />
      </View>
    </View>
  );
}

export function ShimmerRow(): React.JSX.Element {
  return (
    <View className="flex-row gap-3 px-4">
      <View className="flex-1">
        <ShimmerCard height={160} />
      </View>
      <View className="flex-1">
        <ShimmerCard height={160} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { width: '100%' },
  sweep: {
    height: '100%',
    width: 120,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
