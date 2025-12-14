import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NinetyDayPlan } from '@/types/models';
import { format, differenceInDays } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CycleInfoProps {
  plan: NinetyDayPlan;
}

export function CycleInfo({ plan }: CycleInfoProps) {
  const startDate = new Date(plan.startDate);
  const endDate = new Date(plan.endDate);
  const today = new Date();

  const totalDays = 90;
  const daysRemaining = differenceInDays(endDate, today);
  const daysCompleted = totalDays - daysRemaining;
  const progress = Math.min(Math.max((daysCompleted / totalDays) * 100, 0), 100);

  const completedProjects = plan.projects.filter(
    (p) => p.status === 'completed'
  ).length;
  const totalProjects = plan.projects.length;

  return (
    <View className="bg-gray-900 rounded-xl p-4 border border-gray-700 mb-4">
      {/* Cycle number */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Ionicons name="calendar" size={24} color="#FFD700" />
          <Text className="text-white text-xl font-bold ml-2">
            Цикл #{plan.cycleNumber}
          </Text>
        </View>
        <View className={`px-3 py-1 rounded-full ${
          plan.status === 'active' ? 'bg-green-500/20' : 'bg-gray-700'
        }`}>
          <Text className={`text-sm font-semibold ${
            plan.status === 'active' ? 'text-green-500' : 'text-gray-400'
          }`}>
            {plan.status === 'active' ? 'Активный' : 'Завершен'}
          </Text>
        </View>
      </View>

      {/* Dates */}
      <View className="mb-4">
        <View className="flex-row items-center mb-2">
          <Ionicons name="play-circle-outline" size={18} color="#666666" />
          <Text className="text-gray-400 text-sm ml-2">
            Начало: {format(startDate, 'dd MMMM yyyy', { locale: ru })}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="flag-outline" size={18} color="#666666" />
          <Text className="text-gray-400 text-sm ml-2">
            Окончание: {format(endDate, 'dd MMMM yyyy', { locale: ru })}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      {plan.status === 'active' && (
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-white text-sm font-semibold">
              Прогресс цикла
            </Text>
            <Text className="text-gray-400 text-sm">
              {daysCompleted} / {totalDays} дней
            </Text>
          </View>
          <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <View
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
            />
          </View>
          <Text className="text-gray-500 text-xs mt-1 text-right">
            Осталось: {daysRemaining} {daysRemaining === 1 ? 'день' : 'дней'}
          </Text>
        </View>
      )}

      {/* Projects stats */}
      <View className="flex-row items-center justify-between pt-4 border-t border-gray-700">
        <View className="flex-row items-center">
          <Ionicons name="briefcase-outline" size={20} color="#FFFFFF" />
          <Text className="text-white text-sm font-semibold ml-2">
            Проекты
          </Text>
        </View>
        <Text className="text-gray-400 text-sm">
          {completedProjects} / {totalProjects} завершено
        </Text>
      </View>
    </View>
  );
}
