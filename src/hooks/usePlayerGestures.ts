import { useCallback } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated';

// ---------- spring presets 60fps AAA ----------
export const SPRING_SILKY = { damping: 22, stiffness: 320, mass: 0.7 } as const;
export const SPRING_BOUNCY = { damping: 16, stiffness: 280, mass: 0.85 } as const;
export const SPRING_SNAPPY = { damping: 24, stiffness: 420, mass: 0.6 } as const;

// ---------- AI plugin slot ----------
export type AIPluginSlot = {
  enabled: boolean;
  onTrigger?: () => void;
  renderAnchor?: () => React.JSX.Element | null;
};

// ---------- swipe ----------
export type SwipeCallbacks = {
  onNext?: () => void;
  onPrev?: () => void;
  threshold?: number;
  velocityThreshold?: number;
};

export function useSwipeGesture(callbacks: SwipeCallbacks) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const threshold = callbacks.threshold ?? 88;
  const velThreshold = callbacks.velocityThreshold ?? 650;

  const gesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-18, 18])
    .onUpdate((e) => {
      'worklet';
      // rubber band when exceeding 140
      const damp = Math.abs(e.translationX) > 140 ? 0.28 : 1;
      translateX.value = e.translationX * damp;
      opacity.value = interpolate(Math.abs(e.translationX), [0, 160], [1, 0.72], 'clamp');
    })
    .onEnd((e) => {
      'worklet';
      const absX = Math.abs(e.translationX);
      const absV = Math.abs(e.velocityX);
      const goNext = e.translationX < 0 && (absX > threshold || absV > velThreshold);
      const goPrev = e.translationX > 0 && (absX > threshold || absV > velThreshold);

      if (goNext && callbacks.onNext) {
        translateX.value = withTiming(-420, { duration: 220, easing: Easing.out(Easing.cubic) }, () => {
          translateX.value = 420;
          opacity.value = 0.4;
          translateX.value = withSpring(0, SPRING_SILKY);
          opacity.value = withTiming(1, { duration: 220 });
        });
        if (callbacks.onNext) runOnJS(callbacks.onNext)();
      } else if (goPrev && callbacks.onPrev) {
        translateX.value = withTiming(420, { duration: 220, easing: Easing.out(Easing.cubic) }, () => {
          translateX.value = -420;
          opacity.value = 0.4;
          translateX.value = withSpring(0, SPRING_SILKY);
          opacity.value = withTiming(1, { duration: 220 });
        });
        if (callbacks.onPrev) runOnJS(callbacks.onPrev)();
      } else {
        translateX.value = withSpring(0, SPRING_BOUNCY);
        opacity.value = withTiming(1, { duration: 180 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(Math.abs(translateX.value), [14, 88], [0, 1], 'clamp'),
    transform: [{ translateX: interpolate(translateX.value, [-120, 120], [-10, 10], 'clamp') }],
  }));

  return { gesture, translateX, animatedStyle, indicatorStyle };
}

// ---------- vertical mini drag ----------
export type MiniDragConfig = {
  snapExpanded?: number;
  snapCollapsed?: number;
  onExpand?: () => void;
  onCollapse?: () => void;
  onDismiss?: () => void;
};

export function useMiniDrag(config: MiniDragConfig = {}) {
  const snapExpanded = config.snapExpanded ?? -340;
  const snapCollapsed = config.snapCollapsed ?? 0;
  const dismissThreshold = -78;

  const translateY = useSharedValue(0);
  const contextY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .activeOffsetY([-10, 10])
    .failOffsetX([-22, 22])
    .onStart(() => {
      'worklet';
      contextY.value = translateY.value;
    })
    .onUpdate((e) => {
      'worklet';
      const next = contextY.value + e.translationY;
      // allow upward drag beyond expanded with rubber
      if (next < snapExpanded) {
        const over = next - snapExpanded;
        translateY.value = snapExpanded + over * 0.22;
      } else if (next > 48) {
        const over = next - 48;
        translateY.value = 48 + over * 0.28;
      } else {
        translateY.value = next;
      }
    })
    .onEnd((e) => {
      'worklet';
      const v = e.velocityY;
      // dismiss: fast down swipe when at collapsed
      if (translateY.value > dismissThreshold && v > 1200) {
        if (config.onDismiss) runOnJS(config.onDismiss)();
        translateY.value = withSpring(120, SPRING_SNAPPY);
        return;
      }
      // snap logic
      const shouldExpand = translateY.value < -90 || v < -900;
      const shouldCollapse = translateY.value > -40 || v > 900;
      if (shouldExpand) {
        translateY.value = withSpring(snapExpanded, SPRING_SILKY);
        if (config.onExpand) runOnJS(config.onExpand)();
      } else if (shouldCollapse) {
        translateY.value = withSpring(snapCollapsed, SPRING_BOUNCY);
        if (config.onCollapse) runOnJS(config.onCollapse)();
      } else {
        translateY.value = withSpring(translateY.value < -60 ? snapExpanded : snapCollapsed, SPRING_BOUNCY);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(Math.abs(translateY.value), [0, 120], [0.5, 1], 'clamp'),
    transform: [{ scale: interpolate(Math.abs(translateY.value), [0, 120], [1, 1.06], 'clamp') }],
  }));

  const expand = useCallback(() => {
    translateY.value = withSpring(snapExpanded, SPRING_SILKY);
  }, [translateY, snapExpanded]);

  const collapse = useCallback(() => {
    translateY.value = withSpring(snapCollapsed, SPRING_BOUNCY);
  }, [translateY, snapCollapsed]);

  return { gesture, translateY, animatedStyle, handleStyle, expand, collapse };
}

// ---------- unified hook ----------
export type PlayerGesturesConfig = SwipeCallbacks &
  MiniDragConfig & {
    aiSlot?: AIPluginSlot;
  };

export function usePlayerGestures(config: PlayerGesturesConfig) {
  const swipe = useSwipeGesture({ onNext: config.onNext, onPrev: config.onPrev });
  const mini = useMiniDrag({
    onExpand: config.onExpand,
    onCollapse: config.onCollapse,
    onDismiss: config.onDismiss,
    snapExpanded: config.snapExpanded,
    snapCollapsed: config.snapCollapsed,
  });
  return { swipe, mini, aiSlot: config.aiSlot ?? { enabled: false } };
}
