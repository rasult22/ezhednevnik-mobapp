import { useState, useEffect } from 'react';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';
import { DailyPlan, Task, FinancialAffirmation, UserProfile } from '@/types/models';
import uuid from 'react-native-uuid';
import { format } from 'date-fns';
import { updateProfileProgress } from '@/lib/gamification/updateProfile';

/**
 * Hook для работы с ежедневными планами
 */
export function useDailyPlan(date?: Date) {
  const targetDate = date || new Date();
  const dateString = format(targetDate, 'yyyy-MM-dd');

  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDailyPlan();
  }, [dateString]);

  const loadDailyPlan = async () => {
    try {
      const allPlans = (await AppStorage.get<DailyPlan[]>(
        StorageKeys.DAILY_PLANS
      )) || [];

      const plan = allPlans.find((p) => p.date === dateString);
      setDailyPlan(plan || null);
    } catch (error) {
      console.error('Error loading daily plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDailyPlan = async (userId: string): Promise<DailyPlan> => {
    try {
      const newPlan: DailyPlan = {
        id: uuid.v4() as string,
        userId,
        date: dateString,
        mainTasks: [
          { id: uuid.v4() as string, text: '', isCompleted: false },
          { id: uuid.v4() as string, text: '', isCompleted: false },
          { id: uuid.v4() as string, text: '', isCompleted: false },
        ],
        secondaryTasks: Array.from({ length: 9 }, () => ({
          id: uuid.v4() as string,
          text: '',
          isCompleted: false,
        })),
        gratitude: ['', '', ''],
        financialAffirmation: null,
        isCompleted: false,
        pointsEarned: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const allPlans = (await AppStorage.get<DailyPlan[]>(
        StorageKeys.DAILY_PLANS
      )) || [];

      const updatedPlans = [...allPlans, newPlan];
      await AppStorage.set(StorageKeys.DAILY_PLANS, updatedPlans);

      setDailyPlan(newPlan);
      return newPlan;
    } catch (error) {
      console.error('Error creating daily plan:', error);
      throw error;
    }
  };

  const updateMainTask = async (taskId: string, updates: Partial<Task>) => {
    if (!dailyPlan) return;

    try {
      const updatedTasks = dailyPlan.mainTasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      );

      await updatePlan({ mainTasks: updatedTasks });
    } catch (error) {
      console.error('Error updating main task:', error);
      throw error;
    }
  };

  const updateSecondaryTask = async (taskId: string, updates: Partial<Task>) => {
    if (!dailyPlan) return;

    try {
      const updatedTasks = dailyPlan.secondaryTasks.map((t) =>
        t.id === taskId ? { ...t, ...updates } : t
      );

      await updatePlan({ secondaryTasks: updatedTasks });
    } catch (error) {
      console.error('Error updating secondary task:', error);
      throw error;
    }
  };

  const updateGratitude = async (index: number, text: string) => {
    if (!dailyPlan || index < 0 || index > 2) return;

    try {
      const updatedGratitude = [...dailyPlan.gratitude];
      updatedGratitude[index] = text;

      await updatePlan({ gratitude: updatedGratitude });
    } catch (error) {
      console.error('Error updating gratitude:', error);
      throw error;
    }
  };

  const updateFinancialAffirmation = async (
    affirmation: FinancialAffirmation
  ) => {
    if (!dailyPlan) return;

    try {
      await updatePlan({ financialAffirmation: affirmation });
    } catch (error) {
      console.error('Error updating financial affirmation:', error);
      throw error;
    }
  };

  const calculatePoints = (): number => {
    if (!dailyPlan) return 0;

    const mainTaskPoints = dailyPlan.mainTasks.filter(
      (t) => t.isCompleted && t.text.trim() !== ''
    ).length * 50;

    const secondaryTaskPoints = dailyPlan.secondaryTasks.filter(
      (t) => t.isCompleted && t.text.trim() !== ''
    ).length * 5;

    return mainTaskPoints + secondaryTaskPoints;
  };

  const completeDailyPlan = async () => {
    if (!dailyPlan) return;

    try {
      const points = calculatePoints();
      await updatePlan({
        isCompleted: true,
        pointsEarned: points,
      });
    } catch (error) {
      console.error('Error completing daily plan:', error);
      throw error;
    }
  };

  const updatePlan = async (updates: Partial<DailyPlan>) => {
    if (!dailyPlan) return;

    try {
      // Автоматически пересчитываем очки при обновлении задач
      const tempPlan = { ...dailyPlan, ...updates };
      const mainTaskPoints = tempPlan.mainTasks.filter(
        (t) => t.isCompleted && t.text.trim() !== ''
      ).length * 50;
      const secondaryTaskPoints = tempPlan.secondaryTasks.filter(
        (t) => t.isCompleted && t.text.trim() !== ''
      ).length * 5;
      const newPoints = mainTaskPoints + secondaryTaskPoints;

      const updatedPlan: DailyPlan = {
        ...dailyPlan,
        ...updates,
        pointsEarned: newPoints,
        updatedAt: new Date().toISOString(),
      };

      const allPlans = (await AppStorage.get<DailyPlan[]>(
        StorageKeys.DAILY_PLANS
      )) || [];

      const updatedPlans = allPlans.map((p) =>
        p.id === updatedPlan.id ? updatedPlan : p
      );

      await AppStorage.set(StorageKeys.DAILY_PLANS, updatedPlans);
      setDailyPlan(updatedPlan);

      // Обновляем профиль (очки и серии)
      const profile = await AppStorage.get<UserProfile>(
        StorageKeys.USER_PROFILE
      );
      if (profile) {
        await updateProfileProgress(profile, updatedPlans);
      }
    } catch (error) {
      console.error('Error updating daily plan:', error);
      throw error;
    }
  };

  return {
    dailyPlan,
    isLoading,
    createDailyPlan,
    updateMainTask,
    updateSecondaryTask,
    updateGratitude,
    updateFinancialAffirmation,
    calculatePoints,
    completeDailyPlan,
  };
}
