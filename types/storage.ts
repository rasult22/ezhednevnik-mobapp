import {
  DailyPlan,
  NinetyDayPlan,
  MonthlyFocus,
  WeeklyReflection,
} from './models';

// ============= КЛЮЧИ ДЛЯ ASYNCSTORAGE =============
export enum StorageKeys {
  // Профиль
  USER_PROFILE = '@user_profile',

  // Онбординг
  ONBOARDING_COMPLETED = '@onboarding_completed',
  TEMP_GOALS_10Y = '@temp_goals_10y',
  TEMP_GOALS_5Y = '@temp_goals_5y',

  // Цели
  GOALS = '@goals',

  // 90-дневные планы
  NINETY_DAY_PLANS = '@90day_plans',
  ACTIVE_PLAN_ID = '@active_plan_id',

  // Месячный фокус
  MONTHLY_FOCUS = '@monthly_focus',

  // Ежедневные планы
  DAILY_PLANS = '@daily_plans',

  // Рефлексии
  WEEKLY_REFLECTIONS = '@weekly_reflections',

  // Геймификация
  ACHIEVEMENTS = '@achievements',
  POINTS_HISTORY = '@points_history',
  STREAK_DATA = '@streak_data',

  // Настройки
  NOTIFICATION_SETTINGS = '@notification_settings',

  // Метаданные
  LAST_SYNC = '@last_sync',
  APP_VERSION = '@app_version',
}

// ============= ТИПЫ ДЛЯ ХРАНЕНИЯ КОЛЛЕКЦИЙ =============

/**
 * Хранение ежедневных планов по датам
 * Ключ: "YYYY-MM-DD"
 */
export interface StoredDailyPlans {
  [date: string]: DailyPlan;
}

/**
 * Хранение 90-дневных планов по ID
 */
export interface StoredNinetyDayPlans {
  [planId: string]: NinetyDayPlan;
}

/**
 * Хранение месячного фокуса по месяцам
 * Ключ: "YYYY-MM"
 */
export interface StoredMonthlyFocus {
  [month: string]: MonthlyFocus;
}

/**
 * Хранение еженедельных рефлексий по датам
 * Ключ: "YYYY-MM-DD" (дата начала недели)
 */
export interface StoredWeeklyReflections {
  [weekStartDate: string]: WeeklyReflection;
}

// ============= КОНФИГУРАЦИЯ ХРАНИЛИЩА =============
export const STORAGE_CONFIG = {
  // Версия схемы данных (для миграций)
  CURRENT_VERSION: 1,

  // Максимальный размер для single item (AsyncStorage ограничения)
  MAX_ITEM_SIZE: 2 * 1024 * 1024, // 2MB

  // Настройки кеширования
  CACHE_TTL: 24 * 60 * 60 * 1000, // 24 часа
} as const;
