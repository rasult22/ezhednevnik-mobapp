import { useState, useEffect } from 'react';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';
import { NinetyDayPlan, Project, ProjectStatus } from '@/types/models';
import uuid from 'react-native-uuid';
import { addDays, format } from 'date-fns';

/**
 * Hook для работы с 90-дневными планами
 */
export function use90DayPlan() {
  const [currentPlan, setCurrentPlan] = useState<NinetyDayPlan | null>(null);
  const [allPlans, setAllPlans] = useState<NinetyDayPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const plans = await AppStorage.get<NinetyDayPlan[]>(
        StorageKeys.NINETY_DAY_PLANS
      );

      if (plans && plans.length > 0) {
        setAllPlans(plans);
        // Найти активный план
        const active = plans.find((p) => p.status === 'active');
        setCurrentPlan(active || null);
      }
    } catch (error) {
      console.error('Error loading 90-day plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewPlan = async (userId: string) => {
    try {
      const startDate = new Date();
      const endDate = addDays(startDate, 90);

      // Определить номер цикла
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

      // Деактивировать текущий план
      const updatedPlans = allPlans.map((p) =>
        p.status === 'active' ? { ...p, status: 'completed' as const } : p
      );

      const allUpdatedPlans = [...updatedPlans, newPlan];
      await AppStorage.set(StorageKeys.NINETY_DAY_PLANS, allUpdatedPlans);

      setAllPlans(allUpdatedPlans);
      setCurrentPlan(newPlan);

      return newPlan;
    } catch (error) {
      console.error('Error creating 90-day plan:', error);
      throw error;
    }
  };

  const addProject = async (
    title: string,
    description?: string,
    deadline?: string
  ) => {
    if (!currentPlan) return;

    try {
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

      await savePlan(updatedPlan);
      setCurrentPlan(updatedPlan);
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    if (!currentPlan) return;

    try {
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

      await savePlan(updatedPlan);
      setCurrentPlan(updatedPlan);
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  };

  const deleteProject = async (projectId: string) => {
    if (!currentPlan) return;

    try {
      const updatedProjects = currentPlan.projects.filter(
        (p) => p.id !== projectId
      );

      const updatedPlan: NinetyDayPlan = {
        ...currentPlan,
        projects: updatedProjects,
        updatedAt: new Date().toISOString(),
      };

      await savePlan(updatedPlan);
      setCurrentPlan(updatedPlan);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  };

  const updateWorkingThoughts = async (thoughts: string) => {
    if (!currentPlan) return;

    try {
      const updatedPlan: NinetyDayPlan = {
        ...currentPlan,
        workingThoughts: thoughts,
        updatedAt: new Date().toISOString(),
      };

      await savePlan(updatedPlan);
      setCurrentPlan(updatedPlan);
    } catch (error) {
      console.error('Error updating working thoughts:', error);
      throw error;
    }
  };

  const savePlan = async (plan: NinetyDayPlan) => {
    const updatedPlans = allPlans.map((p) =>
      p.id === plan.id ? plan : p
    );
    await AppStorage.set(StorageKeys.NINETY_DAY_PLANS, updatedPlans);
    setAllPlans(updatedPlans);
  };

  const completeCycle = async (
    completedProjectIds: string[],
    notCompletedProjectIds: string[]
  ) => {
    if (!currentPlan) return;

    try {
      // Обновить статусы проектов
      const updatedProjects = currentPlan.projects.map((p) => {
        if (completedProjectIds.includes(p.id)) {
          return {
            ...p,
            status: 'completed' as ProjectStatus,
            completedAt: new Date().toISOString(),
          };
        }
        if (notCompletedProjectIds.includes(p.id)) {
          return { ...p, status: 'not_completed' as ProjectStatus };
        }
        return p;
      });

      const completedPlan: NinetyDayPlan = {
        ...currentPlan,
        projects: updatedProjects,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      };

      await savePlan(completedPlan);

      // Вернуть незавершенные проекты для миграции
      return updatedProjects.filter((p) => p.status === 'not_completed');
    } catch (error) {
      console.error('Error completing cycle:', error);
      throw error;
    }
  };

  return {
    currentPlan,
    allPlans,
    isLoading,
    createNewPlan,
    addProject,
    updateProject,
    deleteProject,
    updateWorkingThoughts,
    completeCycle,
  };
}
