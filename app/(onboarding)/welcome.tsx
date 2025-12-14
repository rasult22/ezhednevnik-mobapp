import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { useProfile } from '@/hooks/useProfile';

export default function WelcomeScreen() {
  const router = useRouter();
  const { createProfile } = useProfile();
  const [name, setName] = useState('');

  const handleStart = async () => {
    if (!name.trim()) return;

    try {
      await createProfile(name.trim());
      router.push('/(onboarding)/goals-10years');
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-4">
      <View className="flex-1 justify-center">
        <Text className="text-white text-4xl font-bold text-center mb-4">
          Цифровой Ежедневник{'\n'}Триллионера
        </Text>
        <Text className="text-gray-400 text-lg text-center mb-8">
          Тренажёр для фокуса на главном
        </Text>
        <Text className="text-gray-500 text-base text-center mb-12 px-4">
          Следуя принципу Парето, мы фокусируемся на 20% задач,{'\n'}
          которые приносят 80% результата
        </Text>

        <View className="mb-6">
          <Input
            label="Ваше имя"
            value={name}
            onChangeText={setName}
            placeholder="Введите ваше имя"
          />
        </View>
      </View>

      <View className="mb-8">
        <Button
          title="Начать"
          onPress={handleStart}
          fullWidth
          disabled={!name.trim()}
        />
      </View>
    </SafeAreaView>
  );
}
