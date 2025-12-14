import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WorkingThoughtsProps {
  value: string;
  onChange: (text: string) => void;
}

export function WorkingThoughts({ value, onChange }: WorkingThoughtsProps) {
  return (
    <View className="bg-gray-900 rounded-xl p-4 border border-gray-700">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="bulb-outline" size={24} color="#FFD700" />
        <Text className="text-white text-lg font-bold ml-2">
          Рабочие мысли
        </Text>
      </View>

      {/* Description */}
      <Text className="text-gray-400 text-sm mb-3">
        Заметки, идеи, инсайты по проектам
      </Text>

      {/* Text Area */}
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Ваши мысли и идеи..."
        placeholderTextColor="#666666"
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        className="bg-black text-white px-4 py-3 rounded-lg border border-gray-700 min-h-[120px]"
      />
    </View>
  );
}
