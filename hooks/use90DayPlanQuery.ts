import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';
import { NinetyDayPlan, Project, ProjectStatus } from '@/types/models';
import { queryKeys } from '@/queries/keys';
import uuid from 'react-native-uuid';
import { addDays, format } from 'date-fns';

/**
 * Hook для работы с 90-дневными планами (React Query версия)
 */
export function use90DayPlanQuery() {
  const queryClient = useQueryClient();

  // Query для загрузки всех планов
  const { data: allPlans = [], isLoading } = useQuery({
    queryKey: queryKeys.ninetyDayPlans,
    queryFn: async () => {
      const plans = await AppStorage.get<NinetyDayPlan[]>(
        StorageKeys.NINETY_DAY_PLANS
      );
      return plans || [];
    },
  });

  // Вычисляем текущий план из allPlans
  const currentPlan = allPlans.find((p) => p.status === 'active') || null;

  // Mutation для создания нового плана
  const createPlanMutation = useMutation({
    mutationFn: async (userId: string) => {
      // Get fresh data from cache
      const allPlans = queryClient.getQueryData<NinetyDayPlan[]>(queryKeys.ninetyDayPlans) || [];

      const startDate = new Date();
      const endDate = addDays(startDate, 90);
      const cycleNumber = allPlans.length + 1;

      const newPlan: NinetyDayPlan = {
        id: uuid.v4() as string,
        userId,
        cycleNumber,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        projects: [],
        workingThoughts: '',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedPlans = allPlans.map((p) =>
        p.status === 'active' ? { ...p, status: 'completed' as const } : p
      );

      const allUpdatedPlans = [...updatedPlans, newPlan];
      await AppStorage.set(StorageKeys.NINETY_DAY_PLANS, allUpdatedPlans);

      return newPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ninetyDayPlans });
    },
  });

  // Mutation для добавления проекта
  const addProjectMutation = useMutation({
    mutationFn: async ({
      title,
      description,
      deadline,
    }: {
      title: string;
      description?: string;
      deadline?: string;
    }) => {
      // Get fresh data from cache
      const allPlans = queryClient.getQueryData<NinetyDayPlan[]>(queryKeys.ninetyDayPlans) || [];
      const currentPlan = allPlans.find((p) => p.status === 'active') || null;

      if (!currentPlan) throw new Error('No active plan');

      const newProject: Project = {
        id: uuid.v4() as string,
        title,
        description: description || '',
        deadline: deadline || null,
        status: 'in_progress',
        createdAt: new Date().toISOString(),
        completedAt: null,
      };

      const updatedPlan: NinetyDayPlan = {
        ...currentPlan,
        projects: [...currentPlan.projects, newProject],
        updatedAt: new Date().toISOString(),
      };

      const updatedPlans = allPlans.map((p) =>
        p.id === updatedPlan.id ? updatedPlan : p
      );

      await AppStorage.set(StorageKeys.NINETY_DAY_PLANS, updatedPlans);
      return updatedPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ninetyDayPlans });
    },
  });

  // Mutation для обновления проекта
  const updateProjectMutation = useMutation({
    mutationFn: async ({
      projectId,
      updates,
    }: {
      projectId: string;
      updates: Partial<Project>;
    }) => {
      // Get fresh data from cache
      const allPlans = queryClient.getQueryData<NinetyDayPlan[]>(queryKeys.ninetyDayPlans) || [];
      const currentPlan = allPlans.find((p) => p.status === 'active') || null;

      if (!currentPlan) throw new Error('No active plan');

      const updatedProjects = currentPlan.projects.map((p) =>
        p.id === projectId
          ? {
              ...p,
              ...updates,
              completedAt:
                updates.status === 'completed' && !p.completedAt
                  ? new Date().toISOString()
                  : p.completedAt,
            }
          : p
      );

      const updatedPlan: NinetyDayPlan = {
        ...currentPlan,
        projects: updatedProjects,
        updatedAt: new Date().toISOString(),
      };

      const updatedPlans = allPlans.map((p) =>
        p.id === updatedPlan.id ? updatedPlan : p
      );

      await AppStorage.set(StorageKeys.NINETY_DAY_PLANS, updatedPlans);
      return updatedPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ninetyDayPlans });
    },
  });

  // Mutation для удаления проекта
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      // Get fresh data from cache
      const allPlans = queryClient.getQueryData<NinetyDayPlan[]>(queryKeys.ninetyDayPlans) || [];
      const currentPlan = allPlans.find((p) => p.status === 'active') || null;

      if (!currentPlan) throw new Error('No active plan');

      const updatedProjects = currentPlan.projects.filter(
        (p) => p.id !== projectId
      );

      const updatedPlan: NinetyDayPlan = {
        ...currentPlan,
        projects: updatedProjects,
        updatedAt: new Date().toISOString(),
      };

      const updatedPlans = allPlans.map((p) =>
        p.id === updatedPlan.id ? updatedPlan : p
      );

      await AppStorage.set(StorageKeys.NINETY_DAY_PLANS, updatedPlans);
      return updatedPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ninetyDayPlans });
    },
  });

  // Mutation для обновления рабочих мыслей
  const updateWorkingThoughtsMutation = useMutation({
    mutationFn: async (thoughts: string) => {
      // Get fresh data from cache
      const allPlans = queryClient.getQueryData<NinetyDayPlan[]>(queryKeys.ninetyDayPlans) || [];
      const currentPlan = allPlans.find((p) => p.status === 'active') || null;

      if (!currentPlan) throw new Error('No active plan');

      const updatedPlan: NinetyDayPlan = {
        ...currentPlan,
        workingThoughts: thoughts,
        updatedAt: new Date().toISOString(),
      };

      const updatedPlans = allPlans.map((p) =>
        p.id === updatedPlan.id ? updatedPlan : p
      );

      await AppStorage.set(StorageKeys.NINETY_DAY_PLANS, updatedPlans);
      return updatedPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ninetyDayPlans });
    },
  });

  return {
    currentPlan,
    allPlans,
    isLoading,
    createNewPlan: createPlanMutation.mutateAsync,
    addProject: addProjectMutation.mutateAsync,
    updateProject: updateProjectMutation.mutateAsync,
    deleteProject: deleteProjectMutation.mutateAsync,
    updateWorkingThoughts: updateWorkingThoughtsMutation.mutateAsync,
  };
}
