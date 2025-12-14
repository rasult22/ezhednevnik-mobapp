import { useState, useEffect } from 'react';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';
import { MonthlyFocus, MonthlyFocusItem } from '@/types/models';
import uuid from 'react-native-uuid';
import { format } from 'date-fns';

/**
 * Hook для работы с месячным фокусом
 * Позволяет выбрать 3 проекта из 90-дневного плана раз в месяц
 */
export function useMonthlyFocus() {
  const [monthlyFocus, setMonthlyFocus] = useState<MonthlyFocus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMonthlyFocus();
  }, []);

  const loadMonthlyFocus = async () => {
    try {
      const currentMonth = format(new Date(), 'yyyy-MM');
      const allFocuses = await AppStorage.get<MonthlyFocus[]>(
        StorageKeys.MONTHLY_FOCUS
      );

      if (allFocuses && allFocuses.length > 0) {
        // Найти фокус для текущего месяца
        const currentFocus = allFocuses.find((f) => f.month === currentMonth);
        setMonthlyFocus(currentFocus || null);
      }
    } catch (error) {
      console.error('Error loading monthly focus:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentMonthFocus = async (): Promise<MonthlyFocus | null> => {
    const currentMonth = format(new Date(), 'yyyy-MM');
    const allFocuses = await AppStorage.get<MonthlyFocus[]>(
      StorageKeys.MONTHLY_FOCUS
    );

    if (allFocuses && allFocuses.length > 0) {
      return allFocuses.find((f) => f.month === currentMonth) || null;
    }
    return null;
  };

  const setMonthlyFocusProjects = async (
    userId: string,
    projects: MonthlyFocusItem[]
  ) => {
    try {
      if (projects.length !== 3) {
        throw new Error('Monthly focus must have exactly 3 projects');
      }

      const currentMonth = format(new Date(), 'yyyy-MM');
      const allFocuses = (await AppStorage.get<MonthlyFocus[]>(
        StorageKeys.MONTHLY_FOCUS
      )) || [];

      // Проверить, есть ли уже фокус для текущего месяца
      const existingIndex = allFocuses.findIndex((f) => f.month === currentMonth);

      const newFocus: MonthlyFocus = {
        id: existingIndex >= 0 ? allFocuses[existingIndex].id : (uuid.v4() as string),
        userId,
        month: currentMonth,
        projects,
        updatedAt: new Date().toISOString(),
      };

      let updatedFocuses: MonthlyFocus[];
      if (existingIndex >= 0) {
        // Обновить существующий
        updatedFocuses = allFocuses.map((f, i) =>
          i === existingIndex ? newFocus : f
        );
      } else {
        // Создать новый
        updatedFocuses = [...allFocuses, newFocus];
      }

      await AppStorage.set(StorageKeys.MONTHLY_FOCUS, updatedFocuses);
      setMonthlyFocus(newFocus);

      return newFocus;
    } catch (error) {
      console.error('Error setting monthly focus:', error);
      throw error;
    }
  };

  const updateMonthlyFocusItem = async (
    itemId: string,
    updates: Partial<MonthlyFocusItem>
  ) => {
    if (!monthlyFocus) return;

    try {
      const updatedProjects = monthlyFocus.projects.map((p) =>
        p.id === itemId ? { ...p, ...updates } : p
      );

      const updatedFocus: MonthlyFocus = {
        ...monthlyFocus,
        projects: updatedProjects,
        updatedAt: new Date().toISOString(),
      };

      const allFocuses = (await AppStorage.get<MonthlyFocus[]>(
        StorageKeys.MONTHLY_FOCUS
      )) || [];

      const updatedFocuses = allFocuses.map((f) =>
        f.id === updatedFocus.id ? updatedFocus : f
      );

      await AppStorage.set(StorageKeys.MONTHLY_FOCUS, updatedFocuses);
      setMonthlyFocus(updatedFocus);
    } catch (error) {
      console.error('Error updating monthly focus item:', error);
      throw error;
    }
  };

  const hasMonthlyFocusForCurrentMonth = (): boolean => {
    return monthlyFocus !== null;
  };

  return {
    monthlyFocus,
    isLoading,
    getCurrentMonthFocus,
    setMonthlyFocusProjects,
    updateMonthlyFocusItem,
    hasMonthlyFocusForCurrentMonth,
  };
}
