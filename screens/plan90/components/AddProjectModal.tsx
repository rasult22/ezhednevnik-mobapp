import { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { Project } from '@/types/models';

interface AddProjectModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, description?: string, deadline?: string) => void;
  editingProject?: Project | null;
}

export function AddProjectModal({
  visible,
  onClose,
  onSave,
  editingProject,
}: AddProjectModalProps) {
  const [title, setTitle] = useState(editingProject?.title || '');
  const [description, setDescription] = useState(
    editingProject?.description || ''
  );
  const [deadline, setDeadline] = useState(editingProject?.deadline || '');

  const handleSave = () => {
    if (!title.trim()) return;

    onSave(
      title.trim(),
      description.trim() || undefined,
      deadline.trim() || undefined
    );

    // Reset form
    setTitle('');
    setDescription('');
    setDeadline('');
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/80">
        <SafeAreaView className="flex-1" edges={['top']}>
          <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Animated.View
              entering={SlideInDown.duration(300)}
              exiting={SlideOutDown.duration(300)}
              className="flex-1 justify-end"
            >
              <View className="bg-gray-900 rounded-t-3xl">
                <ScrollView
                  className="px-6 py-6"
                  keyboardShouldPersistTaps="handled"
                >
                  {/* Header */}
                  <View className="flex-row items-center justify-between mb-6">
                    <Text className="text-white text-2xl font-bold">
                      {editingProject ? 'Редактировать проект' : 'Новый проект'}
                    </Text>
                    <Pressable onPress={handleClose} className="p-2">
                      <Ionicons name="close" size={28} color="#FFFFFF" />
                    </Pressable>
                  </View>

                  {/* Title */}
                  <View className="mb-4">
                    <Input
                      label="Название проекта *"
                      value={title}
                      onChangeText={setTitle}
                      placeholder="Запустить онлайн-курс"
                    />
                  </View>

                  {/* Description */}
                  <View className="mb-4">
                    <Input
                      label="Описание"
                      value={description}
                      onChangeText={setDescription}
                      placeholder="Подробное описание проекта"
                      multiline
                    />
                  </View>

                  {/* Deadline */}
                  <View className="mb-6">
                    <Input
                      label="Дедлайн (ГГГГ-ММ-ДД)"
                      value={deadline}
                      onChangeText={setDeadline}
                      placeholder="2025-03-31"
                    />
                    <Text className="text-gray-500 text-xs mt-1">
                      Формат: ГГГГ-ММ-ДД, например: 2025-03-31
                    </Text>
                  </View>

                  {/* Buttons */}
                  <View className="space-y-3">
                    <Button
                      title={editingProject ? 'Сохранить' : 'Добавить проект'}
                      onPress={handleSave}
                      variant="primary"
                      fullWidth
                      disabled={!title.trim()}
                    />
                    <Button
                      title="Отмена"
                      onPress={handleClose}
                      variant="secondary"
                      fullWidth
                    />
                  </View>
                </ScrollView>
              </View>
            </Animated.View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
