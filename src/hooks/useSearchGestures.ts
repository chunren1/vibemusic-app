import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue, withSpring, withTiming, useAnimatedStyle, interpolate, Easing } from 'react-native-reanimated';

export const SPRING_LIGHT = { damping: 18, stiffness: 300, mass: 0.8 } as const;
export const SPRING_TIGHT = { damping: 20, stiffness: 380, mass: 0.7 } as const;

// 卡片按压缩放 60fps
export function useCardPress(scaleTo = 0.96) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      scale.value = withSpring(scaleTo, SPRING_TIGHT);
    })
    .onFinalize(() => {
      'worklet';
      scale.value = withSpring(1, SPRING_LIGHT);
    });

  // 兼容 Pressable 的命令式调用
  const onPressIn = () => {
    scale.value = withSpring(scaleTo, SPRING_TIGHT);
  };
  const onPressOut = () => {
    scale.value = withSpring(1, SPRING_LIGHT);
  };

  return { scale, pressStyle, gesture, onPressIn, onPressOut };
}

// 下拉视差回弹：scrollY 为 Reanimated SharedValue<number>
// overScroll 额外共享值处理顶部下拉 overscroll
export function usePullParallax(scrollY: { value: number }) {
  // 由 Animated.ScrollView onScroll 驱动，额外提供 overscrollScale
  const overScale = useSharedValue(1);
  const overTrans = useSharedValue(0);

  // 在 ScrollHandler 中调用：当 y < 0
  const updateOverscroll = (y: number) => {
    'worklet';
    if (y < 0) {
      const abs = Math.min(96, Math.abs(y));
      overScale.value = 1 + abs * 0.0042;
      overTrans.value = abs * 0.42;
    } else {
      overScale.value = withSpring(1, SPRING_LIGHT);
      overTrans.value = withSpring(0, SPRING_LIGHT);
    }
  };

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, 220], [0, -78], 'clamp') + overTrans.value * 0.5 },
      { scale: overScale.value * interpolate(scrollY.value, [0, 160], [1, 0.96], 'clamp') },
    ],
  }));

  const blurStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [-40, 0, 120], [0.4, 1, 0.85], 'clamp'),
  }));

  return { headerStyle, blurStyle, updateOverscroll, overScale, overTrans };
}

// 搜索页整体下拉回弹容器
export function useSearchPullRefresh(onRefresh?: () => void) {
  const pullY = useSharedValue(0);
  const isRefreshing = useSharedValue(0);

  const gesture = Gesture.Pan()
    .activeOffsetY([12, 12])
    .failOffsetX([-18, 18])
    .onUpdate((e) => {
      'worklet';
      if (e.translationY > 0 && e.translationY < 120) {
        pullY.value = e.translationY * 0.42;
      }
    })
    .onEnd((e) => {
      'worklet';
      if (pullY.value > 52 || e.velocityY > 900) {
        isRefreshing.value = 1;
        pullY.value = withTiming(48, { duration: 220, easing: Easing.out(Easing.cubic) });
        if (onRefresh) {
          // 交由 JS 侧触发
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const _ = onRefresh;
        }
      }
      pullY.value = withSpring(0, SPRING_LIGHT);
      isRefreshing.value = withTiming(0, { duration: 300 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pullY.value }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pullY.value, [0, 40], [0, 1], 'clamp'),
    transform: [{ scale: interpolate(pullY.value, [0, 48], [0.82, 1], 'clamp') }],
  }));

  return { gesture, pullY, animatedStyle, indicatorStyle, isRefreshing };
}
