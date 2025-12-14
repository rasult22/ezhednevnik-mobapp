/**
 * Query keys для React Query
 */
export const queryKeys = {
  profile: ['profile'] as const,
  goals: ['goals'] as const,
  ninetyDayPlans: ['ninety-day-plans'] as const,
  currentNinetyDayPlan: ['ninety-day-plans', 'current'] as const,
  monthlyFocus: (month?: string) =>
    month ? ['monthly-focus', month] as const : ['monthly-focus'] as const,
  dailyPlans: ['daily-plans'] as const,
  dailyPlan: (date: string) => ['daily-plans', date] as const,
  achievements: ['achievements'] as const,
};
