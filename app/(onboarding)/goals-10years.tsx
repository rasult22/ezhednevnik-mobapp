import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';

export default function Goals10YearsScreen() {
  const router = useRouter();
  const [goals, setGoals] = useState('');

  useEffect(() => {
    loadSavedGoals();
  }, []);

  const loadSavedGoals = async () => {
    try {
      const saved = await AppStorage.get<string>(StorageKeys.TEMP_GOALS_10Y);
      if (saved) setGoals(saved);
    } catch (error) {
      console.error('Error loading saved goals:', error);
    }
  };

  const handleContinue = async () => {
    if (!goals.trim()) return;

    try {
      // Сохраняем временно
      await AppStorage.set(StorageKeys.TEMP_GOALS_10Y, goals.trim());
      router.push('/(onboarding)/goals-5years');
    } catch (error) {
      console.error('Error saving goals:', error);
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
                Цели на 10 лет
              </Text>
              <Text className="text-gray-400 text-base">
                Мыслите масштабно. Представьте будущее на полную мощность.
              </Text>
            </View>

            <Input
              value={goals}
              onChangeText={setGoals}
              placeholder="Опишите свои самые масштабные долгосрочные цели..."
              multiline
              numberOfLines={10}
              className="flex-1 mb-6"
            />
          </View>

          <View className="mb-8">
            <Button
              title="Далее"
              onPress={handleContinue}
              fullWidth
              disabled={!goals.trim()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
