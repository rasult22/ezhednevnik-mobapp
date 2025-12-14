import { useState, useEffect } from 'react';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';

/**
 * Hook для проверки статуса онбординга
 */
export function useOnboarding() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const completed = await AppStorage.get<boolean>(
        StorageKeys.ONBOARDING_COMPLETED
      );
      setIsCompleted(completed || false);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setIsCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AppStorage.set(StorageKeys.ONBOARDING_COMPLETED, true);
      setIsCompleted(true);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  return {
    isCompleted,
    isLoading,
    completeOnboarding,
  };
}
