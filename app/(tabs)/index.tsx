import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useDailyPlan } from '@/hooks/useDailyPlan';
import { useProfile } from '@/hooks/useProfile';
import { use90DayPlan } from '@/hooks/use90DayPlan';
import { useMonthlyFocus } from '@/hooks/useMonthlyFocus';
import { useAchievements } from '@/hooks/useAchievements';
import { MonthlyFocusBlock } from '@/screens/daily-planning/components/MonthlyFocusBlock';
import { MainTasksBlock } from '@/screens/daily-planning/components/MainTasksBlock';
import { SecondaryTasksBlock } from '@/screens/daily-planning/components/SecondaryTasksBlock';
import { GratitudeBlock } from '@/screens/daily-planning/components/GratitudeBlock';
import { FinancialAffirmationBlock } from '@/screens/daily-planning/components/FinancialAffirmationBlock';
import { AchievementUnlockedModal } from '@/components/ui/AchievementUnlockedModal';
import { FinancialAffirmation, MonthlyFocusItem, Achievement } from '@/types/models';

export default function DailyPlanningScreen() {
  const [currentDate] = useState(new Date());
  const { profile } = useProfile();
  const { currentPlan } = use90DayPlan();
  const { monthlyFocus, setMonthlyFocusProjects } = useMonthlyFocus();
  const { checkAndUnlockAchievements } = useAchievements();
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const {
    dailyPlan,
    isLoading,
    createDailyPlan,
    updateMainTask,
    updateSecondaryTask,
    updateGratitude,
    updateFinancialAffirmation,
    calculatePoints,
  } = useDailyPlan(currentDate);

  // Auto-create daily plan if needed
  useEffect(() => {
    if (!isLoading && !dailyPlan && profile) {
      createDailyPlan(profile.id);
    }
  }, [isLoading, dailyPlan, profile]);

  const handleSelectMonthlyFocus = async (projects: MonthlyFocusItem[]) => {
    if (!profile) return;
    try {
      await setMonthlyFocusProjects(profile.id, projects);
    } catch (error) {
      console.error('Error setting monthly focus:', error);
    }
  };

  const handleUpdateMainTask = async (
    taskId: string,
    text: string,
    isCompleted: boolean
  ) => {
    await updateMainTask(taskId, { text, isCompleted });

    // Проверяем достижения после обновления задачи
    const newAchievements = await checkAndUnlockAchievements();
    if (newAchievements.length > 0) {
      setUnlockedAchievement(newAchievements[0]);
    }
  };

  const handleUpdateSecondaryTask = async (
    taskId: string,
    text: string,
    isCompleted: boolean
  ) => {
    await updateSecondaryTask(taskId, { text, isCompleted });

    // Проверяем достижения после обновления задачи
    const newAchievements = await checkAndUnlockAchievements();
    if (newAchievements.length > 0) {
      setUnlockedAchievement(newAchievements[0]);
    }
  };

  const handleUpdateGratitude = async (index: number, text: string) => {
    await updateGratitude(index, text);
  };

  const handleUpdateFinancialAffirmation = async (
    affirmation: FinancialAffirmation
  ) => {
    await updateFinancialAffirmation(affirmation);
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

  if (!dailyPlan) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={['bottom']}>
        <View className="flex-1 items-center justify-center px-4">
          <Ionicons name="calendar-outline" size={64} color="#666666" />
          <Text className="text-white text-2xl font-bold mt-4 mb-2">
            План не создан
          </Text>
          <Text className="text-gray-400 text-center">
            Происходит создание плана...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentPoints = calculatePoints();
  const dateFormatted = format(currentDate, 'EEEE, d MMMM yyyy', { locale: ru });

  return (
    <SafeAreaView className="flex-1 bg-black" edges={['bottom']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          className="flex-1 px-4 py-4"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with date and points */}
          <View className="mb-6">
            <Text className="text-white text-2xl font-bold capitalize">
              {dateFormatted}
            </Text>
            <View className="flex-row items-center mt-2">
              <Ionicons name="trophy" size={20} color="#FFD700" />
              <Text className="text-gray-400 text-sm ml-2">
                Заработано сегодня: <Text className="text-white font-bold">{currentPoints}</Text> очков
              </Text>
            </View>
          </View>

          {/* 1. Monthly Focus Block */}
          <MonthlyFocusBlock
            monthlyFocus={monthlyFocus}
            availableProjects={currentPlan?.projects || []}
            onSelectProjects={handleSelectMonthlyFocus}
          />

          {/* 2. Main Tasks Block (3 главное) */}
          <MainTasksBlock
            tasks={dailyPlan.mainTasks}
            onUpdateTask={handleUpdateMainTask}
          />

          {/* 3. Secondary Tasks Block (+2 второстепенное) */}
          <SecondaryTasksBlock
            tasks={dailyPlan.secondaryTasks}
            onUpdateTask={handleUpdateSecondaryTask}
          />

          {/* 4. Gratitude Block */}
          <GratitudeBlock
            gratitudes={dailyPlan.gratitude}
            onUpdateGratitude={handleUpdateGratitude}
          />

          {/* 5. Financial Affirmation Block */}
          <FinancialAffirmationBlock
            affirmation={dailyPlan.financialAffirmation}
            onUpdate={handleUpdateFinancialAffirmation}
          />

          {/* Bottom spacing */}
          <View className="h-8" />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Achievement Unlocked Modal */}
      <AchievementUnlockedModal
        visible={!!unlockedAchievement}
        achievement={unlockedAchievement}
        onClose={() => setUnlockedAchievement(null)}
      />
    </SafeAreaView>
  );
}
