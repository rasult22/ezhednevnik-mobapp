import { DailyPlan, UserProfile } from '@/types/models';
import { differenceInDays, parseISO } from 'date-fns';

export interface ProgressStats {
  totalPoints: number;
  todayPoints: number;
  currentStreak: number;
  longestStreak: number;
  completedDays: number;
  mainTasksCompleted: number;
  secondaryTasksCompleted: number;
  averagePointsPerDay: number;
}

/**
 * Вычисляет все статистики прогресса пользователя
 */
export function calculateProgressStats(
  profile: UserProfile,
  dailyPlans: DailyPlan[]
): ProgressStats {
  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  // Сегодняшний план
  const todayPlan = dailyPlans.find((p) => p.date === todayString);
  const todayPoints = todayPlan?.pointsEarned || 0;

  // Завершенные дни
  const completedDays = dailyPlans.filter((p) => p.isCompleted).length;

  // Подсчет выполненных задач
  let mainTasksCompleted = 0;
  let secondaryTasksCompleted = 0;

  dailyPlans.forEach((plan) => {
    mainTasksCompleted += plan.mainTasks.filter(
      (t) => t.isCompleted && t.text.trim() !== ''
    ).length;
    secondaryTasksCompleted += plan.secondaryTasks.filter(
      (t) => t.isCompleted && t.text.trim() !== ''
    ).length;
  });

  // Средние очки в день
  const averagePointsPerDay =
    completedDays > 0 ? Math.round(profile.totalPoints / completedDays) : 0;

  return {
    totalPoints: profile.totalPoints,
    todayPoints,
    currentStreak: profile.currentStreak,
    longestStreak: profile.longestStreak,
    completedDays,
    mainTasksCompleted,
    secondaryTasksCompleted,
    averagePointsPerDay,
  };
}

/**
 * Подсчитывает серию (streak) из ежедневных планов
 */
export function calculateStreak(dailyPlans: DailyPlan[]): {
  current: number;
  longest: number;
} {
  if (dailyPlans.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Сортируем планы по дате (от новых к старым)
  const sortedPlans = [...dailyPlans].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Подсчет текущей серии
  for (let i = 0; i < sortedPlans.length; i++) {
    const plan = sortedPlans[i];
    const planDate = parseISO(plan.date);
    planDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    expectedDate.setHours(0, 0, 0, 0);

    // Если план на ожидаемую дату и завершен
    if (
      planDate.getTime() === expectedDate.getTime() &&
      plan.isCompleted &&
      plan.pointsEarned > 0
    ) {
      currentStreak++;
    } else {
      // Серия прервана
      break;
    }
  }

  // Подсчет самой длинной серии
  for (let i = 0; i < sortedPlans.length; i++) {
    const plan = sortedPlans[i];

    if (plan.isCompleted && plan.pointsEarned > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  return {
    current: currentStreak,
    longest: longestStreak,
  };
}
