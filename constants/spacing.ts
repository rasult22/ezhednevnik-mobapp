/**
 * Система отступов приложения
 * Базовая единица: 4px
 */
export const spacing = {
  // Базовые единицы (4px grid)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Семантические отступы
  padding: {
    screen: 16, // Padding для экранов
    card: 16, // Padding для карточек
    input: 12, // Padding для input
    button: 12, // Padding для кнопок
  },

  margin: {
    section: 24, // Margin между секциями
    card: 12, // Margin между карточками
    element: 8, // Margin между элементами
  },

  gap: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },

  // Border radius
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  // Icon sizes
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
} as const;

// Типы для автодополнения
export type Spacing = typeof spacing;
