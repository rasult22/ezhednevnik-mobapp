import { TextStyle } from 'react-native';
import { colors } from './colors';

/**
 * Типография приложения
 * Минималистичный, деловой стиль
 */
export const typography = {
  // Заголовки
  h1: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: colors.text.primary,
    lineHeight: 40,
  } as TextStyle,

  h2: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: colors.text.primary,
    lineHeight: 32,
  } as TextStyle,

  h3: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: colors.text.primary,
    lineHeight: 28,
  } as TextStyle,

  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 24,
  } as TextStyle,

  // Основной текст
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.primary,
    lineHeight: 24,
  } as TextStyle,

  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    lineHeight: 24,
  } as TextStyle,

  bodyBold: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 24,
  } as TextStyle,

  // Мелкий текст
  small: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.text.secondary,
    lineHeight: 20,
  } as TextStyle,

  smallMedium: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    lineHeight: 20,
  } as TextStyle,

  // Подписи и вспомогательный текст
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.text.tertiary,
    lineHeight: 16,
  } as TextStyle,

  captionMedium: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.tertiary,
    lineHeight: 16,
  } as TextStyle,

  // Кнопки
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 24,
  } as TextStyle,

  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
    lineHeight: 20,
  } as TextStyle,

  // Label для форм
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
    lineHeight: 20,
  } as TextStyle,
} as const;

// Типы для автодополнения
export type Typography = typeof typography;
