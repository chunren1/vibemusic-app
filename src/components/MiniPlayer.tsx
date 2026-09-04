import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useMiniDrag, type AIPluginSlot } from '@/src/hooks/usePlayerGestures';
import { usePlayerStore } from '@/src/stores/player';

type Props = {
  onExpand?: () => void;
  onCollapse?: () => void;
  onDismiss?: () => void;
  collapsedHeight?: number;
  expandedOffset?: number;
  aiSlot?: AIPluginSlot;
  onPlayPress?: () => void;
};

export function MiniPlayer({
  onExpand,
  onCollapse,
  onDismiss,
  expandedOffset = -340,
  aiSlot,
  onPlayPress,
}: Props): React.JSX.Element {
  const { playing, track } = usePlayerStore();
  const { gesture, animatedStyle, handleStyle } = useMiniDrag({
    snapExpanded: expandedOffset,
    snapCollapsed: 0,
    onExpand,
    onCollapse,
    onDismiss,
  });

  if (!track) return <></> as unknown as React.JSX.Element;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.wrap, animatedStyle]}>
        <Animated.View style={[styles.handle, handleStyle]} />
        <BlurView intensity={22} tint="dark" style={styles.blur}>
          <LinearGradient
            colors={['rgba(30,30,54,0.72)', 'rgba(10,10,15,0.88)']}
            style={StyleSheet.absoluteFillObject}
          />
          {/* neon top edge */}
          <LinearGradient
            colors={['rgba(139,92,246,0.28)', 'rgba(6,182,214,0.14)', 'transparent']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.topEdge}
          />
          <View style={styles.inner}>
            <View style={styles.coverBox}>
              <LinearGradient
                colors={['#8b5cf6', '#06b6d4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.coverEmoji}>♫</Text>
            </View>
            <View style={styles.meta}>
              <Text numberOfLines={1} style={styles.title}>
                {track.title}
              </Text>
              <Text numberOfLines={1} style={styles.artist}>
                {track.artist} • {playing ? '播放中' : '已暂停'}
              </Text>
              {aiSlot?.enabled ? (
                <Pressable onPress={aiSlot.onTrigger} style={styles.aiPill}>
                  <Text style={styles.aiText}>AI 助手 • 点按展开</Text>
                </Pressable>
              ) : null}
            </View>
            <Pressable onPress={onPlayPress} style={styles.playBtn}>
              <LinearGradient
                colors={['#8b5cf6', '#06b6d4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.playIcon}>{playing ? '❚❚' : '▶'}</Text>
            </Pressable>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={['#8b5cf6', '#06b6d4']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[styles.progressFill, { width: `${usePlayerStore.getState().progress * 100}%` }]}
            />
          </View>
          {aiSlot?.enabled && aiSlot.renderAnchor ? (
            <View style={styles.aiSlot}>{aiSlot.renderAnchor()}</View>
          ) : null}
        </BlurView>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 14,
    zIndex: 30,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.42)',
    marginBottom: 8,
  },
  blur: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
  },
  topEdge: { position: 'absolute', top: 0, left: 0, right: 0, height: 1 },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  coverBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverEmoji: { color: '#fff', fontSize: 16, fontWeight: '900' },
  meta: { flex: 1, gap: 2 },
  title: { color: '#fff', fontSize: 13, fontWeight: '800' },
  artist: { color: 'rgba(232,232,240,0.52)', fontSize: 11, fontWeight: '600' },
  aiPill: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(139,92,246,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.22)',
  },
  aiText: { color: '#a78bfa', fontSize: 10, fontWeight: '800', letterSpacing: 0.6 },
  playBtn: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 8,
  },
  playIcon: { color: '#fff', fontSize: 14, fontWeight: '900', marginLeft: 1 },
  progressTrack: { height: 2, backgroundColor: 'rgba(255,255,255,0.08)' },
  progressFill: { height: '100%', borderRadius: 999 },
  aiSlot: { paddingHorizontal: 12, paddingBottom: 10, backgroundColor: 'rgba(255,255,255,0.03)' },
});
