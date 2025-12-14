import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { useGoals } from '@/hooks/useGoals';

export default function Goals5YearsScreen() {
  const router = useRouter();
  const { goals: savedGoals } = useGoals();
  const [goals, setGoals] = useState('');

  useEffect(() => {
    if (savedGoals?.goals5Years) {
      setGoals(savedGoals.goals5Years);
    }
  }, [savedGoals]);

  const handleContinue = () => {
    router.push('/(onboarding)/goals-1year');
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
                Цели на 5 лет
              </Text>
              <Text className="text-gray-400 text-base">
                Более конкретные цели. Промежуточные этапы на пути к 10-летним
                ориентирам.
              </Text>
            </View>

            <Input
              value={goals}
              onChangeText={setGoals}
              placeholder="Опишите свои среднесрочные цели..."
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
