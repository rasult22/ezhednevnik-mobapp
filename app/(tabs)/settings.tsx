import { useState } from 'react';
import { View, Text, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '@/hooks/useProfile';
import { useGoals } from '@/hooks/useGoals';
import { ProfileSection } from '@/screens/settings/components/ProfileSection';
import { GoalsSection } from '@/screens/settings/components/GoalsSection';
import { SettingsItem } from '@/screens/settings/components/SettingsItem';
import { Button } from '@/components/ui/Button';
import { AppStorage } from '@/lib/storage/asyncStorage';

export default function SettingsScreen() {
  const { profile, updateProfile } = useProfile();
  const { goals } = useGoals();
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const [newName, setNewName] = useState('');

  const handleEditName = () => {
    setNewName(profile?.name || '');
    setEditNameModalVisible(true);
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;

    try {
      await updateProfile({ name: newName.trim() });
      setEditNameModalVisible(false);
      Alert.alert('Успешно', 'Имя обновлено');
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить имя');
    }
  };

  const handleEditGoals = () => {
    Alert.alert(
      'Редактирование целей',
      'Редактирование целей будет доступно в следующем обновлении'
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Очистить все данные?',
      'Это действие нельзя отменить. Все данные будут удалены.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: async () => {
            try {
              await AppStorage.clear();
              Alert.alert(
                'Данные очищены',
                'Перезапустите приложение для прохождения онбординга'
              );
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось очистить данные');
            }
          },
        },
      ]
    );
  };

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={['bottom']}>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-white text-2xl font-bold mb-4">
            Профиль не найден
          </Text>
          <Text className="text-gray-400 text-center">
            Пройдите онбординг для создания профиля
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 py-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold">Настройки</Text>
        </View>

        {/* Profile Section */}
        <ProfileSection profile={profile} onEditName={handleEditName} />

        {/* Goals Section */}
        <GoalsSection goals={goals} onEditGoals={handleEditGoals} />

        {/* Settings Items */}
        <View className="mb-4">
          <Text className="text-white text-lg font-bold mb-3">
            Дополнительно
          </Text>

          <SettingsItem
            icon="information-circle-outline"
            title="О приложении"
            subtitle="Версия 1.0.0"
            onPress={() =>
              Alert.alert(
                'Цифровой Ежедневник Триллионера',
                'Версия 1.0.0\n\nТренажёр для фокуса на главном по принципу Парето'
              )
            }
          />

          <SettingsItem
            icon="trash-outline"
            title="Очистить все данные"
            subtitle="Удалить все планы, цели и прогресс"
            onPress={handleClearData}
            destructive
          />
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>

      {/* Edit Name Modal */}
      <Modal
        visible={editNameModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEditNameModalVisible(false)}
      >
        <View className="flex-1 bg-black/90 justify-center px-4">
          <View className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <Text className="text-white text-xl font-bold mb-4">
              Изменить имя
            </Text>

            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Введите новое имя"
              placeholderTextColor="#666666"
              className="bg-black text-white px-4 py-3 rounded-lg border border-gray-700 mb-6"
            />

            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Button
                  title="Отмена"
                  onPress={() => setEditNameModalVisible(false)}
                  variant="secondary"
                  fullWidth
                />
              </View>
              <View className="flex-1">
                <Button
                  title="Сохранить"
                  onPress={handleSaveName}
                  variant="primary"
                  fullWidth
                  disabled={!newName.trim()}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
