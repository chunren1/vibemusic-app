import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Neon } from '@/src/theme/tokens';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }): React.JSX.Element {
  return <FontAwesome size={22} style={{ marginBottom: -2 }} {...props} />;
}

function TabLabel({ label, focused }: { label: string; focused: boolean }): React.JSX.Element {
  return (
    <Text
      style={{
        fontSize: 10,
        fontWeight: focused ? '800' : '600',
        letterSpacing: focused ? 0.6 : 0.3,
        color: focused ? Neon.violet : 'rgba(232,232,240,0.45)',
        marginTop: 2,
      }}
    >
      {label}
    </Text>
  );
}

export default function TabLayout(): React.JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Neon.violet,
        tabBarInactiveTintColor: 'rgba(232,232,240,0.45)',
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFillObject}>
            <BlurView intensity={26} tint="dark" style={StyleSheet.absoluteFillObject} />
            <LinearGradient
              colors={['rgba(20,20,50,0.92)', 'rgba(10,10,15,0.98)']}
              style={StyleSheet.absoluteFillObject}
            />
            {/* top neon hairline */}
            <View style={styles.hairline}>
              <LinearGradient
                colors={['transparent', 'rgba(139,92,246,0.35)', 'rgba(6,182,214,0.22)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={StyleSheet.absoluteFillObject}
              />
            </View>
          </View>
        ),
        tabBarLabelStyle: { fontSize: 10 },
        tabBarItemStyle: { paddingVertical: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              {focused ? (
                <LinearGradient
                  colors={['rgba(139,92,246,0.22)', 'rgba(6,182,214,0.12)']}
                  style={styles.activeIconBg}
                />
              ) : null}
              <TabBarIcon name="home" color={color} />
            </View>
          ),
          tabBarLabel: ({ focused }) => <TabLabel label="HOME" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              {focused ? (
                <LinearGradient
                  colors={['rgba(139,92,246,0.22)', 'rgba(6,182,214,0.12)']}
                  style={styles.activeIconBg}
                />
              ) : null}
              <TabBarIcon name="search" color={color} />
            </View>
          ),
          tabBarLabel: ({ focused }) => <TabLabel label="DISCOVER" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="player"
        options={{
          title: 'Player',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : styles.inactiveIconWrap}>
              {focused ? (
                <LinearGradient
                  colors={['#8b5cf6', '#06b6d4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.playerActiveBg}
                />
              ) : (
                <View style={styles.playerInactiveBg} />
              )}
              <FontAwesome
                size={focused ? 20 : 18}
                name="play"
                color={focused ? '#fff' : 'rgba(232,232,240,0.55)'}
                style={{ marginLeft: focused ? 2 : 1 }}
              />
            </View>
          ),
          tabBarLabel: ({ focused }) => <TabLabel label="PLAYER" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          title: 'Playlist',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              {focused ? (
                <LinearGradient
                  colors={['rgba(139,92,246,0.22)', 'rgba(6,182,214,0.12)']}
                  style={styles.activeIconBg}
                />
              ) : null}
              <TabBarIcon name="list" color={color} />
            </View>
          ),
          tabBarLabel: ({ focused }) => <TabLabel label="QUEUE" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: 'Me',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconWrap : undefined}>
              {focused ? (
                <LinearGradient
                  colors={['rgba(139,92,246,0.22)', 'rgba(6,182,214,0.12)']}
                  style={styles.activeIconBg}
                />
              ) : null}
              <TabBarIcon name="user" color={color} />
            </View>
          ),
          tabBarLabel: ({ focused }) => <TabLabel label="ME" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    elevation: 0,
    height: Platform.OS === 'ios' ? 86 : 64,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 22 : 8,
    overflow: 'hidden',
  },
  hairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  activeIconWrap: {
    width: 36,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  activeIconBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
  },
  inactiveIconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerActiveBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
  },
  playerInactiveBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
});
