import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Project } from '@/types/models';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ProjectCardProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onToggleStatus,
}: ProjectCardProps) {
  const getStatusColor = () => {
    switch (project.status) {
      case 'completed':
        return 'border-green-500';
      case 'not_completed':
        return 'border-red-500';
      default:
        return 'border-gray-700';
    }
  };

  const getStatusIcon = () => {
    switch (project.status) {
      case 'completed':
        return 'checkmark-circle';
      case 'not_completed':
        return 'close-circle';
      default:
        return 'ellipse-outline';
    }
  };

  const getStatusText = () => {
    switch (project.status) {
      case 'completed':
        return 'Завершен';
      case 'not_completed':
        return 'Не завершен';
      default:
        return 'В процессе';
    }
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      className={`bg-gray-900 rounded-xl p-4 border ${getStatusColor()}`}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2">
        <Pressable
          onPress={onToggleStatus}
          className="flex-row items-center flex-1"
        >
          <Ionicons
            name={getStatusIcon() as any}
            size={24}
            color={
              project.status === 'completed'
                ? '#4CAF50'
                : project.status === 'not_completed'
                ? '#FF6B35'
                : '#666666'
            }
          />
          <Text className="text-gray-400 text-sm ml-2">{getStatusText()}</Text>
        </Pressable>

        <View className="flex-row items-center space-x-2">
          <Pressable onPress={onEdit} className="p-2">
            <Ionicons name="pencil" size={20} color="#FFFFFF" />
          </Pressable>
          <Pressable onPress={onDelete} className="p-2">
            <Ionicons name="trash-outline" size={20} color="#FF6B35" />
          </Pressable>
        </View>
      </View>

      {/* Title */}
      <Text className="text-white text-lg font-bold mb-2">{project.title}</Text>

      {/* Description */}
      {project.description && (
        <Text className="text-gray-400 text-sm mb-3">
          {project.description}
        </Text>
      )}

      {/* Deadline */}
      {project.deadline && (
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={16} color="#666666" />
          <Text className="text-gray-500 text-sm ml-2">
            Дедлайн:{' '}
            {format(new Date(project.deadline), 'dd MMMM yyyy', { locale: ru })}
          </Text>
        </View>
      )}

      {/* Completion date */}
      {project.completedAt && (
        <View className="flex-row items-center mt-2">
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text className="text-green-500 text-sm ml-2">
            Завершено:{' '}
            {format(new Date(project.completedAt), 'dd MMMM yyyy', {
              locale: ru,
            })}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}
