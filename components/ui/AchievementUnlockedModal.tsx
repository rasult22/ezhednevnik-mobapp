import { Modal, View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { ZoomIn, FadeIn } from 'react-native-reanimated';
import { Achievement } from '@/types/models';

interface AchievementUnlockedModalProps {
  visible: boolean;
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementUnlockedModal({
  visible,
  achievement,
  onClose,
}: AchievementUnlockedModalProps) {
  if (!achievement) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/90 items-center justify-center px-4">
        <Animated.View
          entering={ZoomIn.duration(400)}
          className="bg-gray-900 rounded-2xl p-8 border-2 border-yellow-500 items-center max-w-sm w-full"
        >
          {/* Confetti effect */}
          <Animated.View
            entering={FadeIn.duration(600).delay(200)}
            className="absolute -top-10 -left-10 -right-10 -bottom-10"
          >
            <Text className="text-6xl text-center">🎉</Text>
          </Animated.View>

          {/* Icon */}
          <View className="w-20 h-20 bg-yellow-500 rounded-full items-center justify-center mb-4">
            <Ionicons name={achievement.icon as any} size={40} color="#000000" />
          </View>

          {/* Title */}
          <Text className="text-white text-2xl font-bold text-center mb-2">
            Достижение разблокировано!
          </Text>

          {/* Achievement name */}
          <Text className="text-yellow-500 text-xl font-bold text-center mb-3">
            {achievement.title}
          </Text>

          {/* Description */}
          <Text className="text-gray-400 text-sm text-center mb-6">
            {achievement.description}
          </Text>

          {/* Close button */}
          <Pressable
            onPress={onClose}
            className="bg-yellow-500 rounded-xl px-8 py-3 active:opacity-70"
          >
            <Text className="text-black font-bold text-base">Отлично!</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}
