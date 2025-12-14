import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from '@/components/ui/Checkbox';
import { Task } from '@/types/models';

interface MainTasksBlockProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, text: string, isCompleted: boolean) => void;
}

export function MainTasksBlock({ tasks, onUpdateTask }: MainTasksBlockProps) {
  return (
    <View className="bg-gray-900 rounded-xl p-4 border border-gray-700 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="flag" size={24} color="#FF6B35" />
          <Text className="text-white text-lg font-bold ml-2">
            3 главное (20%)
          </Text>
        </View>
        <View className="bg-yellow-500/20 px-2 py-1 rounded">
          <Text className="text-yellow-500 text-xs font-bold">50 очков</Text>
        </View>
      </View>

      {/* Description */}
      <Text className="text-gray-400 text-sm mb-4">
        Самые важные задачи дня по принципу Парето
      </Text>

      {/* Tasks */}
      <View className="space-y-3">
        {tasks.map((task, index) => (
          <View key={task.id} className="flex-row items-center">
            {/* Checkbox */}
            <Checkbox
              checked={task.isCompleted}
              onChange={(checked) =>
                onUpdateTask(task.id, task.text, checked)
              }
            />

            {/* Number */}
            <Text className="text-white font-bold ml-3 mr-2">{index + 1}.</Text>

            {/* Input */}
            <TextInput
              value={task.text}
              onChangeText={(text) =>
                onUpdateTask(task.id, text, task.isCompleted)
              }
              placeholder="Главная задача..."
              placeholderTextColor="#666666"
              className={`flex-1 bg-black text-white px-3 py-2 rounded-lg border border-gray-700 ${
                task.isCompleted ? 'line-through opacity-60' : ''
              }`}
            />
          </View>
        ))}
      </View>
    </View>
  );
}
