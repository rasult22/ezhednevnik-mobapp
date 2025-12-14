import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { useGoals } from '@/hooks/useGoals';
import { useProfile } from '@/hooks/useProfile';
import { useOnboarding } from '@/hooks/useOnboarding';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';

export default function Goals1YearScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const { saveGoals } = useGoals();
  const { completeOnboarding } = useOnboarding();
  const [goals10Years, setGoals10Years] = useState('');
  const [goals5Years, setGoals5Years] = useState('');
  const [goals1Year, setGoals1Year] = useState('');

  useEffect(() => {
    loadTempGoals();
  }, []);

  const loadTempGoals = async () => {
    try {
      const temp10 = await AppStorage.get<string>(StorageKeys.TEMP_GOALS_10Y);
      const temp5 = await AppStorage.get<string>(StorageKeys.TEMP_GOALS_5Y);

      if (temp10) setGoals10Years(temp10);
      if (temp5) setGoals5Years(temp5);
    } catch (error) {
      console.error('Error loading temp goals:', error);
    }
  };

  const handleComplete = async () => {
    if (!profile || !goals1Year.trim()) return;

    try {
      // Сохранить все цели
      await saveGoals(
        goals10Years.trim() || 'Не указано',
        goals5Years.trim() || 'Не указано',
        goals1Year.trim(),
        profile.id
      );

      // Очистить временные данные
      await AppStorage.remove(StorageKeys.TEMP_GOALS_10Y);
      await AppStorage.remove(StorageKeys.TEMP_GOALS_5Y);

      // Завершить онбординг
      await completeOnboarding();

      // Перейти в основное приложение
      router.replace('/(tabs)/' as any);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1">
            <View className="mt-8 mb-6">
              <Text className="text-white text-3xl font-bold mb-2">
                Цели на предстоящий год
              </Text>
              <Text className="text-gray-400 text-base">
                Максимально четкие и измеримые цели. Они станут основой для первого
                90-дневного плана.
              </Text>
            </View>

            <Input
              value={goals1Year}
              onChangeText={setGoals1Year}
              placeholder="Опишите свои цели на год..."
              multiline
              numberOfLines={10}
              className="flex-1 mb-6"
            />
          </View>

          <View className="mb-8">
            <Button
              title="Завершить"
              onPress={handleComplete}
              fullWidth
              disabled={!goals1Year.trim()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
