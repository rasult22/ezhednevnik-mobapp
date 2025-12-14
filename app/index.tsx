import { Redirect } from 'expo-router';
import { useOnboarding } from '@/hooks/useOnboarding';
import { View, Text } from 'react-native';

export default function Index() {
  const { isCompleted, isLoading } = useOnboarding();

  if (isLoading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Загрузка...</Text>
      </View>
    );
  }

  if (isCompleted) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(onboarding)/welcome" />;
}
