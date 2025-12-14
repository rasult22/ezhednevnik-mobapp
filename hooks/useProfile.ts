import { useState, useEffect } from 'react';
import { AppStorage } from '@/lib/storage/asyncStorage';
import { StorageKeys } from '@/types/storage';
import { UserProfile } from '@/types/models';
import uuid from 'react-native-uuid';

/**
 * Hook для работы с профилем пользователя
 */
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AppStorage.get<UserProfile>(
        StorageKeys.USER_PROFILE
      );
      setProfile(savedProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (name: string) => {
    try {
      const newProfile: UserProfile = {
        id: uuid.v4() as string,
        name,
        createdAt: new Date().toISOString(),
        currentStreak: 0,
        longestStreak: 0,
        totalPoints: 0,
        lastActiveDate: null,
      };

      await AppStorage.set(StorageKeys.USER_PROFILE, newProfile);
      setProfile(newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;

    try {
      const updatedProfile: UserProfile = {
        ...profile,
        ...updates,
      };

      await AppStorage.set(StorageKeys.USER_PROFILE, updatedProfile);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return {
    profile,
    isLoading,
    createProfile,
    updateProfile,
  };
}
