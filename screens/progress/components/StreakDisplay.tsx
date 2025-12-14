import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
}: StreakDisplayProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(400).delay(100)}
      className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-4"
    >
      <View className="flex-row items-center mb-6">
        <Ionicons name="flame" size={28} color="#FF6B35" />
        <Text className="text-white text-xl font-bold ml-3">Серии</Text>
      </View>

      <View className="flex-row">
        {/* Current Streak */}
        <View className="flex-1 items-center">
          <View className="bg-orange-500/20 w-16 h-16 rounded-full items-center justify-center mb-3">
            <Text className="text-orange-500 text-2xl font-bold">
              {currentStreak}
            </Text>
          </View>
          <Text className="text-gray-400 text-sm">Текущая</Text>
          <Text className="text-gray-500 text-xs mt-1">дней подряд</Text>
        </View>

        {/* Divider */}
        <View className="w-px bg-gray-700 mx-4" />

        {/* Longest Streak */}
        <View className="flex-1 items-center">
          <View className="bg-yellow-500/20 w-16 h-16 rounded-full items-center justify-center mb-3">
            <Text className="text-yellow-500 text-2xl font-bold">
              {longestStreak}
            </Text>
          </View>
          <Text className="text-gray-400 text-sm">Максимальная</Text>
          <Text className="text-gray-500 text-xs mt-1">рекорд</Text>
        </View>
      </View>
    </Animated.View>
  );
}
