import { Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Checkbox({
  checked,
  onChange,
  disabled = false,
  className = '',
}: CheckboxProps) {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      className={`
        w-6 h-6 rounded border-2 items-center justify-center
        ${checked ? 'bg-white border-white' : 'border-gray-500'}
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {checked && (
        <Animated.View entering={FadeIn.duration(200)}>
          <Ionicons name="checkmark" size={16} color="#000000" />
        </Animated.View>
      )}
    </Pressable>
  );
}
