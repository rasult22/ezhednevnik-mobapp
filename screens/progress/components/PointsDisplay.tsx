import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PointsDisplayProps {
  totalPoints: number;
  todayPoints: number;
}

export function PointsDisplay({ totalPoints, todayPoints }: PointsDisplayProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className="bg-gray-900 rounded-xl p-6 border border-gray-700 mb-4"
    >
      {/* Total Points */}
      <View className="items-center mb-6">
        <View className="bg-yellow-500/20 w-20 h-20 rounded-full items-center justify-center mb-4">
          <Ionicons name="trophy" size={40} color="#FFD700" />
        </View>
        <Text className="text-gray-400 text-sm mb-2">Всего очков</Text>
        <Text className="text-white text-5xl font-bold">{totalPoints}</Text>
      </View>

      {/* Today's Points */}
      <View className="pt-6 border-t border-gray-700">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={20} color="#FFD700" />
            <Text className="text-gray-400 text-sm ml-2">Сегодня</Text>
          </View>
          <Text className="text-white text-2xl font-bold">+{todayPoints}</Text>
        </View>
      </View>
    </Animated.View>
  );
}
