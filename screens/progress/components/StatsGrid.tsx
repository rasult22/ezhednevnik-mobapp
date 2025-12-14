import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface Stat {
  icon: string;
  label: string;
  value: string | number;
  color: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <View className="mb-4">
      <Text className="text-white text-xl font-bold mb-4">Статистика</Text>
      <View className="flex-row flex-wrap -mx-2">
        {stats.map((stat, index) => (
          <Animated.View
            key={index}
            entering={FadeIn.duration(400).delay(200 + index * 50)}
            className="w-1/2 px-2 mb-4"
          >
            <View className="bg-gray-900 rounded-xl p-4 border border-gray-700">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <Ionicons
                  name={stat.icon as any}
                  size={20}
                  color={stat.color}
                />
              </View>
              <Text className="text-white text-2xl font-bold mb-1">
                {stat.value}
              </Text>
              <Text className="text-gray-400 text-xs">{stat.label}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
