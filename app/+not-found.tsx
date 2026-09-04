import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen(): React.JSX.Element {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-xl font-bold">Not Found</Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-blue-500">Go to home</Text>
        </Link>
      </View>
    </>
  );
}
