import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '@/hooks/useProfile';
import { useAchievements } from '@/hooks/useAchievements';
import { PointsDisplay } from '@/screens/progress/components/PointsDisplay';
import { StreakDisplay } from '@/screens/progress/components/StreakDisplay';
import { StatsGrid } from '@/screens/progress/components/StatsGrid';
import { AchievementsList } from '@/screens/progress/components/AchievementsList';
import { calculateProgressStats } from '@/lib/gamification/calculateStats';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';
import { DailyPlan } from '@/types/models';

export default function ProgressScreen() {
  const { profile } = useProfile();
  const { achievements, isLoading: achievementsLoading } = useAchievements();
  const [stats, setStats] = useState({
    totalPoints: 0,
    todayPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    completedDays: 0,
    mainTasksCompleted: 0,
    secondaryTasksCompleted: 0,
    averagePointsPerDay: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [profile]);

  const loadStats = async () => {
    if (!profile) {
      setIsLoading(false);
      return;
    }

    try {
      const dailyPlans = (await AppStorage.get<DailyPlan[]>(
        StorageKeys.DAILY_PLANS
      )) || [];

      const progressStats = calculateProgressStats(profile, dailyPlans);
      setStats(progressStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={['bottom']}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Загрузка...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={['bottom']}>
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-white text-2xl font-bold mb-4">
            Профиль не найден
          </Text>
          <Text className="text-gray-400 text-center">
            Пройдите онбординг для создания профиля
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const gridStats = [
    {
      icon: 'calendar-outline',
      label: 'Завершено дней',
      value: stats.completedDays,
      color: '#4CAF50',
    },
    {
      icon: 'trending-up',
      label: 'Средние очки/день',
      value: stats.averagePointsPerDay,
      color: '#FFD700',
    },
    {
      icon: 'checkmark-circle',
      label: 'Главных задач',
      value: stats.mainTasksCompleted,
      color: '#FF6B35',
    },
    {
      icon: 'list',
      label: 'Второстепенных задач',
      value: stats.secondaryTasksCompleted,
      color: '#4CAF50',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['bottom']}>
      <ScrollView className="flex-1 px-4 py-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold mb-2">
            Мой прогресс
          </Text>
          <Text className="text-gray-400 text-sm">
            Привет, {profile.name}! 👋
          </Text>
        </View>

        {/* Points Display */}
        <PointsDisplay
          totalPoints={stats.totalPoints}
          todayPoints={stats.todayPoints}
        />

        {/* Streak Display */}
        <StreakDisplay
          currentStreak={stats.currentStreak}
          longestStreak={stats.longestStreak}
        />

        {/* Stats Grid */}
        <StatsGrid stats={gridStats} />

        {/* Achievements */}
        {!achievementsLoading && (
          <AchievementsList achievements={achievements} />
        )}

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
