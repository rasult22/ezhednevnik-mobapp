import { AppStorage } from './asyncStorage';
import { StorageKeys, STORAGE_CONFIG } from '@/types/storage';

/**
 * Система миграций для обновления схемы данных
 * Будет критична при переходе AsyncStorage -> SQLite
 */
export class StorageMigrations {
  /**
   * Проверка и выполнение необходимых миграций
   */
  static async runMigrations(): Promise<void> {
    const currentVersion = await AppStorage.get<number>(
      StorageKeys.APP_VERSION
    );

    if (!currentVersion) {
      // Первый запуск
      await this.initializeStorage();
      return;
    }

    // Запуск миграций по порядку
    if (currentVersion < 1) {
      await this.migrateToV1();
    }

    // Будущие миграции:
    // if (currentVersion < 2) await this.migrateToV2();
  }

  /**
   * Инициализация хранилища при первом запуске
   */
  private static async initializeStorage(): Promise<void> {
    await AppStorage.set(
      StorageKeys.APP_VERSION,
      STORAGE_CONFIG.CURRENT_VERSION
    );
  }

  /**
   * Миграция на версию 1
   */
  private static async migrateToV1(): Promise<void> {
    console.log('Migrating to V1...');
    await AppStorage.set(StorageKeys.APP_VERSION, 1);
  }

  /**
   * Подготовка данных для экспорта (JSON)
   */
  static async exportAllData(): Promise<string> {
    const allKeys = Object.values(StorageKeys);
    const data = await AppStorage.multiGet(allKeys);

    return JSON.stringify(
      {
        version: STORAGE_CONFIG.CURRENT_VERSION,
        exportedAt: new Date().toISOString(),
        data,
      },
      null,
      2
    );
  }

  /**
   * Импорт данных из JSON
   */
  static async importData(jsonString: string): Promise<void> {
    try {
      const parsed = JSON.parse(jsonString);

      // Валидация версии
      if (parsed.version > STORAGE_CONFIG.CURRENT_VERSION) {
        throw new Error('Exported data is from newer version');
      }

      // Импорт данных
      for (const [key, value] of Object.entries(parsed.data)) {
        if (value !== null) {
          await AppStorage.set(key as StorageKeys, value);
        }
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}
