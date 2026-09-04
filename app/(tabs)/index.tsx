import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import { Neon, Obsidian } from '@/src/theme/tokens';

export default function HomeScreen(): React.JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: Obsidian.void }}>
      <LinearGradient
        colors={[...Neon.gradMidnight]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      {/* bloom orbs */}
      <View
        style={{
          position: 'absolute',
          top: 80,
          right: -40,
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: 'rgba(139,92,246,0.18)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 180,
          left: -30,
          width: 200,
          height: 200,
          borderRadius: 100,
          backgroundColor: 'rgba(6,182,214,0.12)',
        }}
      />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
        <LinearGradient
          colors={[...Neon.gradBloom]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 999, paddingHorizontal: 18, paddingVertical: 7, marginBottom: 16 }}
        >
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 11, letterSpacing: 2.2 }}>
            OBSIDIAN BLOOM · 3A
          </Text>
        </LinearGradient>
        <Text
          style={{
            color: '#e8e8f0',
            fontSize: 28,
            fontWeight: '900',
            letterSpacing: -0.6,
            textAlign: 'center',
          }}
        >
          VibeMusic
        </Text>
        <Text
          style={{
            color: 'rgba(232,232,240,0.55)',
            fontSize: 13,
            marginTop: 8,
            textAlign: 'center',
            lineHeight: 18,
          }}
        >
          Luxury sound · Neon dusk · AAA bloom
        </Text>
        <View
          style={{
            marginTop: 20,
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.08)',
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}
        >
          <Text style={{ color: 'rgba(232,232,240,0.7)', fontSize: 12 }}>
            APK ready · Install & enjoy offline
          </Text>
        </View>
      </View>
    </View>
  );
}
