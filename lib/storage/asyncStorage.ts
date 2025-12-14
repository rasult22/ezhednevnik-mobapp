import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '@/types/storage';

/**
 * Generic wrapper для AsyncStorage с типизацией
 * Обеспечивает типобезопасное хранение и получение данных
 */
export class AppStorage {
  /**
   * Получить данные из хранилища
   * @param key Ключ хранилища
   * @returns Данные или null если не найдены
   */
  static async get<T>(key: StorageKeys): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return null;
    }
  }

  /**
   * Сохранить данные в хранилище
   * @param key Ключ хранилища
   * @param value Данные для сохранения
   */
  static async set<T>(key: StorageKeys, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
      throw error;
    }
  }

  /**
   * Удалить данные из хранилища
   * @param key Ключ хранилища
   */
  static async remove(key: StorageKeys): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      throw error;
    }
  }

  /**
   * Очистить всё хранилище (осторожно!)
   */
  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Получить все ключи приложения
   */
  static async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Мультигет для оптимизации чтения нескольких ключей
   * @param keys Массив ключей
   * @returns Объект с данными по ключам
   */
  static async multiGet(keys: StorageKeys[]): Promise<Record<string, any>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      return pairs.reduce(
        (acc, [key, value]) => {
          acc[key] = value ? JSON.parse(value) : null;
          return acc;
        },
        {} as Record<string, any>
      );
    } catch (error) {
      console.error('Error in multiGet:', error);
      return {};
    }
  }
}
