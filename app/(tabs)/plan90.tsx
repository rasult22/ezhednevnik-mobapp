import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { use90DayPlanQuery } from '@/hooks/use90DayPlanQuery';
import { useProfile } from '@/hooks/useProfile';
import { ProjectCard } from '@/screens/plan90/components/ProjectCard';
import { AddProjectModal } from '@/screens/plan90/components/AddProjectModal';
import { WorkingThoughts } from '@/screens/plan90/components/WorkingThoughts';
import { CycleInfo } from '@/screens/plan90/components/CycleInfo';
import { Button } from '@/components/ui/Button';
import { Project } from '@/types/models';

export default function Plan90Screen() {
  const { profile } = useProfile();
  const {
    currentPlan,
    isLoading,
    createNewPlan,
    addProject,
    updateProject,
    deleteProject,
    updateWorkingThoughts,
  } = use90DayPlanQuery();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Auto-create first plan if needed
  useEffect(() => {
    if (!isLoading && !currentPlan && profile) {
      createNewPlan(profile.id);
    }
  }, [isLoading, currentPlan, profile]);

  const handleAddProject = async (
    title: string,
    description?: string,
    deadline?: string
  ) => {
    try {
      if (editingProject) {
        await updateProject({
          projectId: editingProject.id,
          updates: { title, description, deadline },
        });
        setEditingProject(null);
      } else {
        await addProject({ title, description, deadline });
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить проект');
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setModalVisible(true);
  };

  const handleDeleteProject = (projectId: string) => {
    Alert.alert(
      'Удалить проект?',
      'Это действие нельзя отменить',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => deleteProject(projectId),
        },
      ]
    );
  };

  const handleToggleProjectStatus = async (project: Project) => {
    const nextStatus =
      project.status === 'in_progress'
        ? 'completed'
        : project.status === 'completed'
        ? 'not_completed'
        : 'in_progress';

    await updateProject({
      projectId: project.id,
      updates: { status: nextStatus },
    });
  };

  const handleWorkingThoughtsChange = async (text: string) => {
    await updateWorkingThoughts(text);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={['bottom']}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Загрузка...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentPlan) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={['bottom']}>
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="calendar-outline" size={64} color="#666666" />
          <Text className="text-white text-2xl font-bold mt-4 mb-2">
            Нет активного цикла
          </Text>
          <Text className="text-gray-400 text-center mb-6">
            Создайте новый 90-дневный план
          </Text>
          {profile && (
            <Button
              title="Создать план"
              onPress={() => createNewPlan(profile.id)}
              variant="primary"
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 py-4">
        {/* Cycle Info */}
        <CycleInfo plan={currentPlan} />

        {/* Projects Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-xl font-bold">
              Проекты ({currentPlan.projects.length})
            </Text>
            <Pressable
              onPress={() => {
                setEditingProject(null);
                setModalVisible(true);
              }}
              className="bg-white rounded-lg px-4 py-2 flex-row items-center"
            >
              <Ionicons name="add" size={20} color="#000000" />
              <Text className="text-black font-semibold ml-1">Добавить</Text>
            </Pressable>
          </View>

          {/* Project List */}
          {currentPlan.projects.length === 0 ? (
            <View className="bg-gray-900 rounded-xl p-8 border border-gray-700 items-center">
              <Ionicons name="briefcase-outline" size={48} color="#666666" />
              <Text className="text-gray-400 text-center mt-4">
                Добавьте первый проект в ваш 90-дневный план
              </Text>
              <Text className="text-gray-500 text-sm text-center mt-2">
                Рекомендуется 6-8 проектов на цикл
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {currentPlan.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={() => handleEditProject(project)}
                  onDelete={() => handleDeleteProject(project.id)}
                  onToggleStatus={() => handleToggleProjectStatus(project)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Working Thoughts */}
        <WorkingThoughts
          value={currentPlan.workingThoughts}
          onChange={handleWorkingThoughtsChange}
        />

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>

      {/* Add/Edit Project Modal */}
      <AddProjectModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingProject(null);
        }}
        onSave={handleAddProject}
        editingProject={editingProject}
      />
    </SafeAreaView>
  );
}
