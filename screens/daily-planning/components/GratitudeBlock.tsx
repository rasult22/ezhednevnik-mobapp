import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GratitudeBlockProps {
  gratitudes: string[];
  onUpdateGratitude: (index: number, text: string) => void;
}

export function GratitudeBlock({
  gratitudes,
  onUpdateGratitude,
}: GratitudeBlockProps) {
  return (
    <View className="bg-gray-900 rounded-xl p-4 border border-gray-700 mb-4">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="heart" size={24} color="#FF6B35" />
        <Text className="text-white text-lg font-bold ml-2">
          Благодарности Богу
        </Text>
      </View>

      {/* Description */}
      <Text className="text-gray-400 text-sm mb-4">
        За что вы благодарны сегодня?
      </Text>

      {/* Gratitude inputs */}
      <View className="space-y-3">
        {gratitudes.map((gratitude, index) => (
          <View key={index} className="flex-row items-start">
            {/* Number */}
            <Text className="text-white font-semibold mt-3 mr-2">
              {index + 1}.
            </Text>

            {/* Input */}
            <TextInput
              value={gratitude}
              onChangeText={(text) => onUpdateGratitude(index, text)}
              placeholder="Я благодарен за..."
              placeholderTextColor="#666666"
              multiline
              className="flex-1 bg-black text-white px-3 py-2 rounded-lg border border-gray-700 min-h-[44px]"
            />
          </View>
        ))}
      </View>
    </View>
  );
}
