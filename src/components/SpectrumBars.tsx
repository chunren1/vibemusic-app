import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  playing: boolean;
  count?: number;
  color?: string;
};

const BAR_W = 3;
const GAP = 3;
const H_MIN = 6;
const H_MAX = 28;

export function SpectrumBars({ playing, count = 28, color = '#8b5cf6' }: Props): React.JSX.Element {
  return (
    <View style={styles.row} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <Bar key={i} index={i} playing={playing} color={color} />
      ))}
    </View>
  );
}

function Bar({
  index,
  playing,
  color,
}: {
  index: number;
  playing: boolean;
  color: string;
}): React.JSX.Element {
  const h = useSharedValue(H_MIN + Math.random() * 8);

  useEffect(() => {
    if (playing) {
      const dur = 260 + Math.random() * 380;
      const delay = index * 24;
      h.value = withDelay(
        delay,
        withRepeat(
          withTiming(H_MIN + Math.random() * (H_MAX - H_MIN), {
            duration: dur,
            easing: Easing.inOut(Easing.ease),
          }),
          -1,
          true,
        ),
      );
    } else {
      h.value = withTiming(4, { duration: 300 });
    }
  }, [playing, index, h]);

  const style = useAnimatedStyle(() => ({
    height: h.value,
    opacity: playing ? 0.92 : 0.32,
  }));

  return (
    <Animated.View
      style={[styles.bar, { backgroundColor: color, width: BAR_W, marginHorizontal: GAP / 2 }, style]}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: H_MAX + 4,
  },
  bar: {
    borderRadius: 999,
    minHeight: 4,
  },
});
