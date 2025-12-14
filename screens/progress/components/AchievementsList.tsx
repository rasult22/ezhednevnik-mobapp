import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Achievement } from '@/types/models';

interface AchievementsListProps {
  achievements: Achievement[];
}

export function AchievementsList({ achievements }: AchievementsListProps) {
  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-xl font-bold">Достижения</Text>
        <Text className="text-gray-400 text-sm">
          {unlockedCount} / {achievements.length}
        </Text>
      </View>

      <View className="space-y-3">
        {achievements.map((achievement, index) => (
          <Animated.View
            key={achievement.id}
            entering={
              achievement.isUnlocked
                ? ZoomIn.duration(400).delay(index * 100)
                : FadeIn.duration(300).delay(index * 50)
            }
            className={`bg-gray-900 rounded-xl p-4 border ${
              achievement.isUnlocked
                ? 'border-yellow-500'
                : 'border-gray-700'
            }`}
          >
            <View className="flex-row items-center">
              {/* Icon */}
              <View
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  achievement.isUnlocked ? 'bg-yellow-500' : 'bg-gray-800'
                }`}
              >
                <Ionicons
                  name={achievement.icon as any}
                  size={24}
                  color={achievement.isUnlocked ? '#000000' : '#666666'}
                />
              </View>

              {/* Content */}
              <View className="flex-1 ml-4">
                <Text
                  className={`text-base font-bold ${
                    achievement.isUnlocked ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {achievement.title}
                </Text>
                <Text
                  className={`text-sm mt-1 ${
                    achievement.isUnlocked ? 'text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {achievement.description}
                </Text>
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <Text className="text-xs text-yellow-500 mt-1">
                    Разблокировано{' '}
                    {new Date(achievement.unlockedAt).toLocaleDateString(
                      'ru-RU',
                      {
                        day: 'numeric',
                        month: 'short',
                      }
                    )}
                  </Text>
                )}
              </View>

              {/* Lock/Unlock indicator */}
              {!achievement.isUnlocked && (
                <Ionicons name="lock-closed" size={20} color="#666666" />
              )}
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
