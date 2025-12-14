import { TextInput, View, Text } from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  className?: string;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  className = '',
}: InputProps) {
  return (
    <View className={`w-full ${className}`}>
      {label && (
        <Text className="text-gray-400 text-sm mb-2 font-medium">{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#666666"
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={secureTextEntry}
        className={`
          bg-gray-900 text-white px-4 rounded-lg border border-gray-700
          ${multiline ? 'py-3 min-h-[100px]' : 'py-3'}
        `}
      />
    </View>
  );
}
