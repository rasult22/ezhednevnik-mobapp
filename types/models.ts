// ============= ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ =============
export interface UserProfile {
  id: string; // UUID
  name: string;
  createdAt: string; // ISO date
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
  lastActiveDate: string | null; // ISO date
}

// ============= ЦЕЛИ =============
export interface Goals {
  id: string;
  userId: string;
  goals10Years: string;
  goals5Years: string;
  goals1Year: string;
  updatedAt: string; // ISO date
}

// ============= 90-ДНЕВНЫЙ ПЛАН =============
export interface NinetyDayPlan {
  id: string;
  userId: string;
  cycleNumber: number; // Номер цикла (1, 2, 3...)
  startDate: string; // ISO date
  endDate: string; // ISO date
  projects: Project[];
  workingThoughts: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  planId: string;
  title: string;
  isCompleted: boolean;
  completedAt: string | null; // ISO date
  order: number; // Порядок отображения
  migratedFrom?: string; // ID проекта из предыдущего цикла
  createdAt: string;
}

// ============= МЕСЯЧНЫЙ ФОКУС =============
export interface MonthlyFocus {
  id: string;
  userId: string;
  month: string; // YYYY-MM
  projects: MonthlyFocusItem[];
  updatedAt: string; // ISO date
}

export interface MonthlyFocusItem {
  projectId: string; // Ссылка на Project
  projectTitle: string;
  deadline: string; // Дедлайн
  order: number; // 1, 2, 3
}

// ============= ЕЖЕДНЕВНЫЙ ПЛАН =============
export interface DailyPlan {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD

  // Блок "3 главное"
  mainTasks: Task[];

  // Блок "+2 второстепенное"
  secondaryTasks: Task[];

  // Блок "Благодарности Богу"
  gratitude: string[]; // 3 элемента

  // Блок "Финансовая установка"
  financialAffirmation: FinancialAffirmation | null;

  // Метаданные
  isCompleted: boolean; // Хотя бы заполнен
  pointsEarned: number;
  createdAt: string; // ISO date
  updatedAt: string;
}

export interface Task {
  id: string;
  text: string;
  isCompleted: boolean;
  completedAt: string | null; // ISO date
  order: number;
}

export interface FinancialAffirmation {
  text: string;
  name: string;
  confirmedAt: string | null; // ISO date когда нажали "Аминь"
}

// ============= ЕЖЕНЕДЕЛЬНАЯ РЕФЛЕКСИЯ =============
export interface WeeklyReflection {
  id: string;
  userId: string;
  weekStartDate: string; // YYYY-MM-DD (понедельник)
  weekEndDate: string; // YYYY-MM-DD (воскресенье)
  reflectionText: string;
  createdAt: string;
}

// ============= ГЕЙМИФИКАЦИЯ =============
export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  iconName: string; // Имя иконки
  isUnlocked: boolean;
  unlockedAt: string | null; // ISO date
  category: 'planning' | 'focus' | 'streak' | 'project' | 'gratitude' | 'cycle';
}

export type AchievementId =
  | 'FIRST_PLAN' // Новичок-планировщик
  | 'MASTER_FOCUS' // Мастер фокуса
  | 'WEEK_STREAK' // Неделя в ударе
  | 'PROJECT_COMPLETED' // Проект завершен
  | 'MONTH_STREAK' // Чемпион постоянства (30 дней)
  | 'GRATITUDE_WEEK' // Практик благодарности
  | 'CYCLE_COMPLETED'; // Триллионер в мыслях

export interface Streak {
  current: number; // Текущая серия
  longest: number; // Максимальная серия
  lastActiveDate: string | null; // ISO date
}

export interface PointsHistory {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  points: number;
  source: PointSource;
  metadata?: Record<string, any>; // Дополнительная информация
  createdAt: string;
}

export type PointSource =
  | 'daily_plan_created'
  | 'main_task_completed'
  | 'secondary_task_completed'
  | 'achievement_unlocked'
  | 'streak_bonus';

// ============= СТАТИСТИКА =============
export interface UserStatistics {
  userId: string;
  totalDaysPlanned: number;
  totalMainTasksCompleted: number;
  totalSecondaryTasksCompleted: number;
  totalProjectsCompleted: number;
  totalCyclesCompleted: number;
  achievementsUnlocked: number;
  currentStreak: number;
  longestStreak: number;
  totalPoints: number;
}

// ============= НАСТРОЙКИ УВЕДОМЛЕНИЙ =============
export interface NotificationSettings {
  userId: string;
  morningEnabled: boolean;
  morningTime: string; // "07:00"
  eveningEnabled: boolean;
  eveningTime: string; // "21:00"
  streakReminderEnabled: boolean;
  motivationalEnabled: boolean;
  updatedAt: string;
}
