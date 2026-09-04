import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

type Props = {
  tags: string[];
  active?: string | null;
  onSelect: (tag: string) => void;
};

export function TagCloud({ tags, active, onSelect }: Props): React.JSX.Element {
  return (
    <View style={styles.row}>
      {tags.map((t) => (
        <Tag key={t} label={t} selected={active === t} onPress={() => onSelect(t)} />
      ))}
    </View>
  );
}

function Tag({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}): React.JSX.Element {
  const s = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));

  return (
    <Animated.View style={style}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          s.value = withSpring(0.94, { damping: 18, stiffness: 420 });
        }}
        onPressOut={() => {
          s.value = withSpring(1, { damping: 16, stiffness: 300 });
        }}
        style={selected ? styles.selectedOuter : styles.outer}
      >
        {selected ? (
          <LinearGradient
            colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.selectedGrad}
          >
            <Text style={styles.selectedText}>{label}</Text>
          </LinearGradient>
        ) : (
          <BlurView intensity={16} tint="dark" style={styles.blur}>
            <View style={styles.idleInner}>
              <Text style={styles.idleText}>{label}</Text>
            </View>
          </BlurView>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  blur: { borderRadius: 999, overflow: 'hidden' },
  outer: { borderRadius: 999 },
  idleInner: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  idleText: { color: 'rgba(232,232,240,0.82)', fontSize: 12, fontWeight: '600', letterSpacing: 0.2 },
  selectedOuter: {
    borderRadius: 999,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.42,
    shadowRadius: 14,
    elevation: 8,
  },
  selectedGrad: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  selectedText: { color: '#fff', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
});
