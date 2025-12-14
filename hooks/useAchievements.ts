import { useState, useEffect } from 'react';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';
import { Achievement, DailyPlan } from '@/types/models';
import { ACHIEVEMENTS, createInitialAchievements } from '@/constants/achievements';

/**
 * Hook для работы с системой достижений
 */
export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      let stored = await AppStorage.get<Achievement[]>(
        StorageKeys.ACHIEVEMENTS
      );

      // Если достижений нет, создать начальные
      if (!stored || stored.length === 0) {
        stored = createInitialAchievements();
        await AppStorage.set(StorageKeys.ACHIEVEMENTS, stored);
      }

      setAchievements(stored);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAndUnlockAchievements = async () => {
    try {
      const dailyPlans = (await AppStorage.get<DailyPlan[]>(
        StorageKeys.DAILY_PLANS
      )) || [];

      const today = new Date().toISOString().split('T')[0];
      const todayPlan = dailyPlans.find((p) => p.date === today);

      // Подсчет статистики для проверки условий
      const stats = {
        dailyPlansCount: dailyPlans.length,
        currentStreak: 0, // Будет обновлено из профиля
        todayMainTasksCompleted: todayPlan
          ? todayPlan.mainTasks.filter(
              (t) => t.isCompleted && t.text.trim() !== ''
            ).length
          : 0,
      };

      // Загрузить текущую серию из профиля
      const profile = await AppStorage.get<any>(StorageKeys.USER_PROFILE);
      if (profile) {
        stats.currentStreak = profile.currentStreak;
      }

      let updated = false;
      const updatedAchievements = achievements.map((achievement) => {
        // Если уже разблокировано, пропустить
        if (achievement.isUnlocked) return achievement;

        // Получить определение достижения
        const definition = ACHIEVEMENTS[achievement.id as keyof typeof ACHIEVEMENTS];
        if (!definition) return achievement;

        // Проверить условие
        if (definition.checkCondition(stats)) {
          updated = true;
          return {
            ...achievement,
            isUnlocked: true,
            unlockedAt: new Date().toISOString(),
          };
        }

        return achievement;
      });

      if (updated) {
        await AppStorage.set(StorageKeys.ACHIEVEMENTS, updatedAchievements);
        setAchievements(updatedAchievements);
        return updatedAchievements.filter(
          (a, i) => a.isUnlocked && !achievements[i].isUnlocked
        );
      }

      return [];
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  };

  const getUnlockedCount = (): number => {
    return achievements.filter((a) => a.isUnlocked).length;
  };

  const getTotalCount = (): number => {
    return achievements.length;
  };

  return {
    achievements,
    isLoading,
    checkAndUnlockAchievements,
    getUnlockedCount,
    getTotalCount,
  };
}
