import { useState } from 'react';
import { View, Text, Pressable, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MonthlyFocus, MonthlyFocusItem, Project } from '@/types/models';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Animated, { FadeIn } from 'react-native-reanimated';

interface MonthlyFocusBlockProps {
  monthlyFocus: MonthlyFocus | null;
  availableProjects: Project[];
  onSelectProjects: (projects: MonthlyFocusItem[]) => void;
}

export function MonthlyFocusBlock({
  monthlyFocus,
  availableProjects,
  onSelectProjects,
}: MonthlyFocusBlockProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const handleOpenModal = () => {
    setSelectedProjects([]);
    setModalVisible(true);
  };

  const handleToggleProject = (projectId: string) => {
    setSelectedProjects((prev) => {
      if (prev.includes(projectId)) {
        return prev.filter((id) => id !== projectId);
      }
      if (prev.length >= 3) {
        Alert.alert('Ограничение', 'Можно выбрать максимум 3 проекта');
        return prev;
      }
      return [...prev, projectId];
    });
  };

  const handleSaveSelection = () => {
    if (selectedProjects.length !== 3) {
      Alert.alert('Ошибка', 'Выберите ровно 3 проекта');
      return;
    }

    const projects = selectedProjects.map((projectId) => {
      const project = availableProjects.find((p) => p.id === projectId);
      return {
        id: projectId,
        projectTitle: project?.title || '',
        deadline: project?.deadline || null,
      };
    });

    onSelectProjects(projects);
    setModalVisible(false);
  };

  const currentMonth = format(new Date(), 'LLLL yyyy', { locale: ru });

  return (
    <View className="bg-gray-900 rounded-xl p-4 border border-gray-700 mb-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="star" size={24} color="#FFD700" />
          <Text className="text-white text-lg font-bold ml-2">
            Главное на месяц
          </Text>
        </View>
        <Pressable onPress={handleOpenModal}>
          <Text className="text-white text-sm underline">
            {monthlyFocus ? 'Изменить' : 'Выбрать'}
          </Text>
        </Pressable>
      </View>

      {/* Current month */}
      <Text className="text-gray-400 text-sm mb-3 capitalize">
        {currentMonth}
      </Text>

      {/* Selected projects */}
      {monthlyFocus && monthlyFocus.projects.length > 0 ? (
        <View className="space-y-2">
          {monthlyFocus.projects.map((item, index) => (
            <Animated.View
              key={item.id}
              entering={FadeIn.duration(300).delay(index * 100)}
              className="bg-black rounded-lg p-3 border border-gray-700"
            >
              <View className="flex-row items-start">
                <Text className="text-white font-semibold mr-2">
                  {index + 1}.
                </Text>
                <View className="flex-1">
                  <Text className="text-white font-medium">
                    {item.projectTitle}
                  </Text>
                  {item.deadline && (
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="calendar-outline" size={14} color="#666666" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {format(new Date(item.deadline), 'dd.MM.yyyy')}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          ))}
        </View>
      ) : (
        <View className="bg-black rounded-lg p-4 border border-dashed border-gray-700 items-center">
          <Text className="text-gray-500 text-sm text-center">
            Выберите 3 проекта из вашего 90-дневного плана
          </Text>
        </View>
      )}

      {/* Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/90 justify-center px-4">
          <View className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <Text className="text-white text-xl font-bold mb-4">
              Выберите 3 проекта
            </Text>

            {availableProjects.length === 0 ? (
              <View className="py-8">
                <Text className="text-gray-400 text-center">
                  У вас нет проектов в 90-дневном плане
                </Text>
                <Text className="text-gray-500 text-sm text-center mt-2">
                  Сначала добавьте проекты в раздел "90 дней"
                </Text>
              </View>
            ) : (
              <View className="space-y-2 mb-6">
                {availableProjects.map((project) => {
                  const isSelected = selectedProjects.includes(project.id);
                  return (
                    <Pressable
                      key={project.id}
                      onPress={() => handleToggleProject(project.id)}
                      className={`p-3 rounded-lg border ${
                        isSelected
                          ? 'bg-white border-white'
                          : 'bg-black border-gray-700'
                      }`}
                    >
                      <View className="flex-row items-center">
                        <View
                          className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                            isSelected
                              ? 'border-black bg-black'
                              : 'border-gray-500'
                          }`}
                        >
                          {isSelected && (
                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                          )}
                        </View>
                        <Text
                          className={`flex-1 font-medium ${
                            isSelected ? 'text-black' : 'text-white'
                          }`}
                        >
                          {project.title}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            <View className="flex-row space-x-3">
              <Pressable
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-gray-700 rounded-lg py-3 items-center"
              >
                <Text className="text-white font-semibold">Отмена</Text>
              </Pressable>
              {availableProjects.length > 0 && (
                <Pressable
                  onPress={handleSaveSelection}
                  disabled={selectedProjects.length !== 3}
                  className={`flex-1 rounded-lg py-3 items-center ${
                    selectedProjects.length === 3
                      ? 'bg-white'
                      : 'bg-gray-700 opacity-50'
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      selectedProjects.length === 3 ? 'text-black' : 'text-gray-500'
                    }`}
                  >
                    Сохранить ({selectedProjects.length}/3)
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
