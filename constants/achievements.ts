import { Achievement } from '@/types/models';

export type AchievementId =
  | 'FIRST_PLAN'
  | 'MASTER_FOCUS'
  | 'WEEK_STREAK';

export interface AchievementDefinition {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  checkCondition: (stats: {
    dailyPlansCount: number;
    currentStreak: number;
    todayMainTasksCompleted: number;
  }) => boolean;
}

/**
 * 3 базовых достижения для MVP
 */
export const ACHIEVEMENTS: Record<AchievementId, AchievementDefinition> = {
  FIRST_PLAN: {
    id: 'FIRST_PLAN',
    title: 'Новичок-планировщик',
    description: 'Создан первый дневной план',
    icon: 'calendar',
    checkCondition: (stats) => stats.dailyPlansCount >= 1,
  },

  MASTER_FOCUS: {
    id: 'MASTER_FOCUS',
    title: 'Мастер фокуса',
    description: 'Все 3 главные задачи выполнены за день',
    icon: 'checkmark-done-circle',
    checkCondition: (stats) => stats.todayMainTasksCompleted >= 3,
  },

  WEEK_STREAK: {
    id: 'WEEK_STREAK',
    title: 'Неделя в ударе',
    description: '7 дней подряд заполнения плана',
    icon: 'flame',
    checkCondition: (stats) => stats.currentStreak >= 7,
  },
};

/**
 * Создает начальный список достижений для нового пользователя
 */
export function createInitialAchievements(): Achievement[] {
  return Object.values(ACHIEVEMENTS).map((def) => ({
    id: def.id,
    title: def.title,
    description: def.description,
    icon: def.icon,
    isUnlocked: false,
    unlockedAt: null,
  }));
}
