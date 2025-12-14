import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FinancialAffirmation } from '@/types/models';
import Animated, { ZoomIn } from 'react-native-reanimated';

interface FinancialAffirmationBlockProps {
  affirmation: FinancialAffirmation | null;
  onUpdate: (affirmation: FinancialAffirmation) => void;
}

export function FinancialAffirmationBlock({
  affirmation,
  onUpdate,
}: FinancialAffirmationBlockProps) {
  const handleTextChange = (text: string) => {
    onUpdate({
      text,
      yourName: affirmation?.yourName || '',
      isConfirmed: false,
    });
  };

  const handleNameChange = (name: string) => {
    onUpdate({
      text: affirmation?.text || '',
      yourName: name,
      isConfirmed: false,
    });
  };

  const handleConfirm = () => {
    if (!affirmation?.text.trim() || !affirmation?.yourName.trim()) {
      return;
    }

    onUpdate({
      ...affirmation,
      isConfirmed: true,
    });
  };

  const isValid = affirmation?.text.trim() && affirmation?.yourName.trim();

  return (
    <View className="bg-gray-900 rounded-xl p-4 border border-gray-700 mb-4">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <Ionicons name="trending-up" size={24} color="#4CAF50" />
        <Text className="text-white text-lg font-bold ml-2">
          Финансовая установка
        </Text>
      </View>

      {/* Description */}
      <Text className="text-gray-400 text-sm mb-4">
        Ваше денежное намерение на сегодня
      </Text>

      {/* Affirmation text */}
      <View className="mb-3">
        <Text className="text-gray-400 text-sm mb-2">Установка</Text>
        <TextInput
          value={affirmation?.text || ''}
          onChangeText={handleTextChange}
          placeholder="Например: Я зарабатываю 1 000 000 рублей в месяц"
          placeholderTextColor="#666666"
          multiline
          className="bg-black text-white px-4 py-3 rounded-lg border border-gray-700 min-h-[80px]"
        />
      </View>

      {/* Your name */}
      <View className="mb-4">
        <Text className="text-gray-400 text-sm mb-2">Ваше имя</Text>
        <TextInput
          value={affirmation?.yourName || ''}
          onChangeText={handleNameChange}
          placeholder="Введите ваше имя"
          placeholderTextColor="#666666"
          className="bg-black text-white px-4 py-3 rounded-lg border border-gray-700"
        />
      </View>

      {/* Confirm button */}
      <Pressable
        onPress={handleConfirm}
        disabled={!isValid || affirmation?.isConfirmed}
        className={`rounded-lg py-3 items-center ${
          affirmation?.isConfirmed
            ? 'bg-green-500'
            : isValid
            ? 'bg-white'
            : 'bg-gray-700'
        }`}
      >
        {affirmation?.isConfirmed ? (
          <Animated.View
            entering={ZoomIn.duration(300)}
            className="flex-row items-center"
          >
            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
            <Text className="text-white font-bold ml-2">Принято!</Text>
          </Animated.View>
        ) : (
          <Text
            className={`font-bold ${
              isValid ? 'text-black' : 'text-gray-500'
            }`}
          >
            Аминь
          </Text>
        )}
      </Pressable>

      {/* Preview */}
      {affirmation?.isConfirmed && (
        <Animated.View
          entering={ZoomIn.duration(400).delay(200)}
          className="mt-4 bg-black rounded-lg p-4 border border-green-500"
        >
          <Text className="text-white text-center font-medium">
            {affirmation.text}
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            — {affirmation.yourName}
          </Text>
          <Text className="text-green-500 text-center mt-2 font-bold">
            Аминь
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
