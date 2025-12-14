import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '@/types/models';

interface ProfileSectionProps {
  profile: UserProfile;
  onEditName: () => void;
}

export function ProfileSection({ profile, onEditName }: ProfileSectionProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <View className="bg-gray-900 rounded-xl p-4 border border-gray-700 mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-lg font-bold">Профиль</Text>
        <Pressable onPress={onEditName} className="p-2">
          <Ionicons name="pencil" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View className="space-y-3">
        {/* Name */}
        <View className="flex-row items-center">
          <Ionicons name="person-outline" size={20} color="#666666" />
          <View className="ml-3 flex-1">
            <Text className="text-gray-400 text-xs mb-1">Имя</Text>
            <Text className="text-white text-base">{profile.name}</Text>
          </View>
        </View>

        {/* Member since */}
        <View className="flex-row items-center">
          <Ionicons name="calendar-outline" size={20} color="#666666" />
          <View className="ml-3 flex-1">
            <Text className="text-gray-400 text-xs mb-1">
              Дата регистрации
            </Text>
            <Text className="text-white text-base">
              {formatDate(profile.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
