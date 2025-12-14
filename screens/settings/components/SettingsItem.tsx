import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
  destructive?: boolean;
}

export function SettingsItem({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
}: SettingsItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-gray-900 rounded-xl p-4 border border-gray-700 mb-3 active:opacity-70"
    >
      <View className="flex-row items-center">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center ${
            destructive ? 'bg-red-500/20' : 'bg-gray-800'
          }`}
        >
          <Ionicons
            name={icon as any}
            size={20}
            color={destructive ? '#FF6B35' : '#FFFFFF'}
          />
        </View>
        <View className="flex-1 ml-3">
          <Text
            className={`text-base font-semibold ${
              destructive ? 'text-red-500' : 'text-white'
            }`}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="text-gray-400 text-xs mt-1">{subtitle}</Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666666" />
      </View>
    </Pressable>
  );
}
