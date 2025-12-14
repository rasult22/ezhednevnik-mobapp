import { useState, useEffect } from 'react';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';
import { Goals } from '@/types/models';
import uuid from 'react-native-uuid';

/**
 * Hook для работы с целями (10/5/1 год)
 */
export function useGoals() {
  const [goals, setGoals] = useState<Goals | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const savedGoals = await AppStorage.get<Goals>(StorageKeys.GOALS);
      setGoals(savedGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGoals = async (
    goals10Years: string,
    goals5Years: string,
    goals1Year: string,
    userId: string
  ) => {
    try {
      const goalsData: Goals = {
        id: uuid.v4() as string,
        userId,
        goals10Years,
        goals5Years,
        goals1Year,
        updatedAt: new Date().toISOString(),
      };

      await AppStorage.set(StorageKeys.GOALS, goalsData);
      setGoals(goalsData);
    } catch (error) {
      console.error('Error saving goals:', error);
      throw error;
    }
  };

  const updateGoals = async (updates: Partial<Goals>) => {
    if (!goals) return;

    try {
      const updatedGoals: Goals = {
        ...goals,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await AppStorage.set(StorageKeys.GOALS, updatedGoals);
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Error updating goals:', error);
      throw error;
    }
  };

  return {
    goals,
    isLoading,
    saveGoals,
    updateGoals,
  };
}
