import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { API_BASE_URL } from '@/src/api/client';
import { GlassCard } from '@/src/components/GlassCard';
import { MiniPlayer } from '@/src/components/MiniPlayer';
import { ParallaxHeader } from '@/src/components/ParallaxHeader';
import { ShimmerRow } from '@/src/components/Shimmer';
import { TagCloud } from '@/src/components/TagCloud';
import { usePlayerStore } from '@/src/stores/player';
import { Neon } from '@/src/theme/tokens';

type Item = { id: string; title: string; artist: string; cover: string; tag: string };
const TAGS = ['全部', '电子', '说唱', '民谣', '摇滚', '爵士', '纯音乐', '流行'];
const MOCK: Item[] = [
  { id: '1', title: 'Midnight Bloom', artist: 'Vibe Collective', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80', tag: '电子' },
  { id: '2', title: 'Neon Afterglow', artist: 'Kilo Bloom', cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80', tag: '流行' },
  { id: '3', title: 'Silk & Static', artist: 'Ava Chen', cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=600&q=80', tag: '爵士' },
  { id: '4', title: 'Velvet Hours', artist: 'Noir Lab', cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=600&q=80', tag: '民谣' },
  { id: '5', title: 'Glass Harbor', artist: 'Ocean Tape', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80', tag: '纯音乐' },
  { id: '6', title: 'City Lights Echo', artist: 'Metro Kid', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80', tag: '摇滚' },
  { id: '7', title: 'Lunar Tape', artist: 'Yuki', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80', tag: '流行' },
  { id: '8', title: 'Low End Theory', artist: 'Bass Dept.', cover: 'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=600&q=80', tag: '说唱' },
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Item>);

export default function SearchScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const overPull = useSharedValue(0);
  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('全部');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>(MOCK);
  const { setTrack, toggle } = usePlayerStore();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
      if (e.contentOffset.y < 0) {
        overPull.value = Math.min(64, Math.abs(e.contentOffset.y)) * 0.52;
      } else {
        overPull.value = withSpring(0, { damping: 20, stiffness: 340 });
      }
    },
  });

  const pullStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: overPull.value * 0.6 }, { scale: interpolate(overPull.value, [0, 48], [0.86, 1], 'clamp') }],
    opacity: interpolate(overPull.value, [0, 24], [0, 1], 'clamp'),
  }));

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const tagOk = activeTag === '全部' || it.tag === activeTag;
      const q = query.trim().toLowerCase();
      const qOk = !q || it.title.toLowerCase().includes(q) || it.artist.toLowerCase().includes(q);
      return tagOk && qOk;
    });
  }, [items, activeTag, query]);

  const doSearch = useCallback(async () => {
    const q = query.trim();
    if (!q) {
      setItems(MOCK);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const json = (await res.json()) as { data?: Item[]; list?: Item[] };
        const list = json.data ?? json.list ?? [];
        if (list.length > 0) setItems(list);
        else setItems(MOCK.filter((m) => m.title.toLowerCase().includes(q.toLowerCase())));
      } else setItems(MOCK.filter((m) => m.title.toLowerCase().includes(q.toLowerCase())));
    } catch {
      setItems(MOCK.filter((m) => m.title.toLowerCase().includes(q.toLowerCase())));
    } finally {
      setLoading(false);
    }
  }, [query]);

  const onPick = useCallback(
    (it: Item) => {
      setTrack({ id: it.id, title: it.title, artist: it.artist, coverUrl: it.cover, duration: 213 });
    },
    [setTrack],
  );

  const renderItem: ListRenderItem<Item> = useCallback(
    ({ item }) => (
      <View style={styles.cardCol}>
        <GlassCard coverUrl={item.cover} title={item.title} subtitle={item.artist} tag={item.tag} onPress={() => onPick(item)} />
      </View>
    ),
    [onPick],
  );

  return (
    <View style={styles.root}>
      <LinearGradient colors={['#0a0a0f', '#0f0f1e']} style={StyleSheet.absoluteFillObject} />
      {/* ambient neon wash */}
      <View pointerEvents="none" style={styles.ambientA}>
        <LinearGradient colors={['rgba(139,92,246,0.10)', 'transparent']} style={StyleSheet.absoluteFillObject} />
      </View>
      <View pointerEvents="none" style={styles.ambientB}>
        <LinearGradient colors={['rgba(6,182,214,0.07)', 'transparent']} style={StyleSheet.absoluteFillObject} />
      </View>

      <View style={{ paddingTop: insets.top }} pointerEvents="none">
        <Animated.View style={[{ alignItems: 'center', paddingVertical: 6 }, pullStyle]}>
          <View style={styles.pullPill}>
            <View style={styles.pullDot} />
            <Text style={styles.pullText}>下拉回弹 • 视差联动</Text>
          </View>
        </Animated.View>
      </View>

      <AnimatedFlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        numColumns={2}
        renderItem={renderItem}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        columnWrapperStyle={filtered.length > 0 ? { paddingHorizontal: 10 } : undefined}
        ListHeaderComponent={
          <View>
            <ParallaxHeader scrollY={scrollY} value={query} onChangeText={setQuery} onSubmit={doSearch} />
            <TagCloud tags={TAGS} active={activeTag} onSelect={setActiveTag} />
            <View style={styles.forYouRow}>
              <View style={styles.forYouLeft}>
                <LinearGradient colors={['#8b5cf6', '#06b6d4']} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.forYouAccent} />
                <Text style={styles.forYouLabel}>FOR YOU • 瀑布流 • 轻点卡片按压回弹</Text>
              </View>
              <View style={styles.countBadge}>
                <LinearGradient
                  colors={['rgba(139,92,246,0.18)', 'rgba(6,182,214,0.12)']}
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.countNum}>{filtered.length}</Text>
                <Text style={styles.countUnit}> 首</Text>
              </View>
            </View>
            {loading ? (
              <View style={styles.shimmerGap}>
                <ShimmerRow />
                <ShimmerRow />
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <View style={styles.emptyIconBox}>
                <Text style={styles.emptyIcon}>∅</Text>
              </View>
              <Text style={styles.emptyTitle}>没有找到相关结果</Text>
              <Text style={styles.emptySub}>试试更换关键词或标签，或者去发现页逛逛</Text>
            </View>
          ) : null
        }
      />
      <MiniPlayer onPlayPress={toggle} aiSlot={{ enabled: true, onTrigger: () => {} }} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0a0a0f' },
  ambientA: { position: 'absolute', top: -40, right: -40, width: 360, height: 360, borderRadius: 180, overflow: 'hidden', opacity: 1 },
  ambientB: { position: 'absolute', bottom: 120, left: -30, width: 300, height: 300, borderRadius: 150, overflow: 'hidden', opacity: 1 },
  pullPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pullDot: { width: 6, height: 6, borderRadius: 999, backgroundColor: Neon.violet },
  pullText: { color: 'rgba(255,255,255,0.62)', fontSize: 11, fontWeight: '700', letterSpacing: 1.1 },
  forYouRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  forYouLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  forYouAccent: { width: 22, height: 2, borderRadius: 999 },
  forYouLabel: { color: 'rgba(232,232,240,0.38)', fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(139,92,246,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  countNum: { color: '#8b5cf6', fontSize: 12, fontWeight: '800' },
  countUnit: { color: 'rgba(232,232,240,0.45)', fontSize: 11, fontWeight: '600' },
  shimmerGap: { gap: 12, paddingBottom: 8, paddingHorizontal: 16 },
  cardCol: { width: '50%', paddingHorizontal: 6 },
  empty: { alignItems: 'center', paddingHorizontal: 32, paddingVertical: 64 },
  emptyIconBox: {
    width: 80,
    height: 80,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: { color: 'rgba(232,232,240,0.42)', fontSize: 26 },
  emptyTitle: { marginTop: 16, color: '#fff', fontSize: 14, fontWeight: '800' },
  emptySub: { marginTop: 6, color: 'rgba(232,232,240,0.38)', fontSize: 12, lineHeight: 20, textAlign: 'center' },
});
