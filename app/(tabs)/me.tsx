import { Text, View } from 'react-native';

export default function MeScreen(): React.JSX.Element {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold">Me</Text>
      <Text className="mt-2 text-gray-500">TODO: Me</Text>
    </View>
  );
}
