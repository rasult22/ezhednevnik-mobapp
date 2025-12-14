import { DailyPlan, UserProfile } from '@/types/models';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';
import { calculateStreak } from './calculateStats';

/**
 * Обновляет очки и серии в профиле на основе ежедневных планов
 */
export async function updateProfileProgress(
  profile: UserProfile,
  dailyPlans: DailyPlan[]
): Promise<UserProfile> {
  // Подсчет общих очков
  const totalPoints = dailyPlans.reduce(
    (sum, plan) => sum + plan.pointsEarned,
    0
  );

  // Подсчет серий
  const { current: currentStreak, longest: longestStreak } =
    calculateStreak(dailyPlans);

  // Последняя активная дата
  const sortedPlans = [...dailyPlans].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const lastActiveDate =
    sortedPlans.length > 0 ? sortedPlans[0].date : profile.lastActiveDate;

  // Обновленный профиль
  const updatedProfile: UserProfile = {
    ...profile,
    totalPoints,
    currentStreak,
    longestStreak: Math.max(longestStreak, profile.longestStreak),
    lastActiveDate,
  };

  // Сохранить в storage
  await AppStorage.set(StorageKeys.USER_PROFILE, updatedProfile);

  return updatedProfile;
}

/**
 * Добавляет очки к профилю
 */
export async function addPointsToProfile(
  profile: UserProfile,
  points: number
): Promise<UserProfile> {
  const updatedProfile: UserProfile = {
    ...profile,
    totalPoints: profile.totalPoints + points,
  };

  await AppStorage.set(StorageKeys.USER_PROFILE, updatedProfile);
  return updatedProfile;
}
