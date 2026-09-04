# vibemusic-app

Expo 52 + TypeScript + Expo Router + NativeWind skeleton.

## Quick start

```sh
npm install
npx expo start        # Expo Go preview
npx expo start --android
npx expo start --ios
npx expo start --web
```

## Config

- **Name/Slug**: `vibemusic-app`
- **Bundle ID**: `com.cyk666.vibemusic` (iOS `bundleIdentifier`, Android `package`)
- **Scheme**: `vibemusic-app`
- **SDK**: Expo 52 (~52.0.49), React 18.3.1, React Native 0.76.9, Expo Router 4
- **Styling**: NativeWind 2.0.11 + Tailwind 3.4
- **State/Data**: Zustand, TanStack Query, MMKV

Backend: `http://10.0.2.2:8080` (Android emulator) / `http://localhost:8080` (iOS). See `src/api/client.ts`.

## Structure

```
app/(tabs)/_layout.tsx
app/(tabs)/index.tsx       # TODO Home
app/(tabs)/search.tsx      # TODO Search
app/(tabs)/player.tsx      # TODO Player
app/(tabs)/playlist.tsx    # TODO Playlist
app/(tabs)/me.tsx          # TODO Me
src/stores/  src/api/  src/hooks/  src/components/
```

## Verify

```sh
npx expo --version
npm run
npm run typecheck
npm run lint
```
