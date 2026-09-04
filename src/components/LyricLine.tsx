import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type Props = {
  text: string;
  active: boolean;
  translation?: string;
};

export function LyricLine({ text, active, translation }: Props): React.JSX.Element {
  const p = useSharedValue(active ? 1 : 0);

  useEffect(() => {
    p.value = withTiming(active ? 1 : 0, { duration: 420, easing: Easing.out(Easing.cubic) });
  }, [active, p]);

  const textStyle = useAnimatedStyle(() => ({
    opacity: 0.45 + p.value * 0.55,
    transform: [{ scale: 0.96 + p.value * 0.04 }, { translateY: (1 - p.value) * 4 }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: p.value,
  }));

  return (
    <Animated.View style={[styles.wrap, textStyle]}>
      {active ? (
        <Animated.View style={[StyleSheet.absoluteFillObject, glowStyle]} pointerEvents="none">
          <LinearGradient
            colors={['transparent', 'rgba(49,194,124,0.12)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>
      ) : null}
      <Text
        className={`text-center leading-7 ${active ? 'text-base font-bold text-white' : 'text-sm text-white/45'}`}
        style={active ? styles.activeShadow : undefined}
      >
        {text}
      </Text>
      {translation ? (
        <Text className={`mt-1 text-center text-xs ${active ? 'text-velvet' : 'text-white/25'}`}>
          {translation}
        </Text>
      ) : null}
      {active ? <View className="mx-auto mt-2 h-0.5 w-8 rounded-full bg-velvet" /> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  activeShadow: {
    textShadowColor: 'rgba(49,194,124,0.45)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
});
