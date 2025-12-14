import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Goals } from '@/types/models';

interface GoalsSectionProps {
  goals: Goals | null;
  onEditGoals: () => void;
}

export function GoalsSection({ goals, onEditGoals }: GoalsSectionProps) {
  return (
    <View className="bg-gray-900 rounded-xl p-4 border border-gray-700 mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-lg font-bold">Мои цели</Text>
        <Pressable onPress={onEditGoals} className="p-2">
          <Ionicons name="pencil" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      {goals ? (
        <View className="space-y-4">
          {/* 10 years */}
          <View>
            <Text className="text-gray-400 text-xs mb-2">Цели на 10 лет</Text>
            <Text className="text-white text-sm" numberOfLines={3}>
              {goals.goals10Years}
            </Text>
          </View>

          {/* 5 years */}
          <View>
            <Text className="text-gray-400 text-xs mb-2">Цели на 5 лет</Text>
            <Text className="text-white text-sm" numberOfLines={3}>
              {goals.goals5Years}
            </Text>
          </View>

          {/* 1 year */}
          <View>
            <Text className="text-gray-400 text-xs mb-2">Цели на 1 год</Text>
            <Text className="text-white text-sm" numberOfLines={3}>
              {goals.goals1Year}
            </Text>
          </View>
        </View>
      ) : (
        <Text className="text-gray-500 text-sm">Цели не установлены</Text>
      )}
    </View>
  );
}
