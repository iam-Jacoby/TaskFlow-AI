import { useState, useEffect } from 'react';

export interface UserSettings {
  profile: {
    name: string;
    email: string;
    timezone: string;
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    taskReminders: boolean;
    teamUpdates: boolean;
    weeklyReports: boolean;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    dateFormat: string;
    timeFormat: '12h' | '24h';
    startOfWeek: 'sunday' | 'monday';
  };
}

const defaultSettings: UserSettings = {
  profile: {
    name: 'Jacob Abraham',
    email: 'jacob@taskflow.ai',
    timezone: 'America/New_York',
    language: 'en'
  },
  notifications: {
    email: true,
    push: true,
    taskReminders: true,
    teamUpdates: true,
    weeklyReports: false
  },
  preferences: {
    theme: 'system',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
    startOfWeek: 'monday'
  }
};

const STORAGE_KEY = 'taskflow_settings';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (newSettings: UserSettings) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      
      // Apply theme changes immediately
      if (newSettings.preferences.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (newSettings.preferences.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System theme
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, error: 'Failed to save settings' };
    }
  };

  const updateProfile = (profile: Partial<UserSettings['profile']>) => {
    const newSettings = {
      ...settings,
      profile: { ...settings.profile, ...profile }
    };
    return saveSettings(newSettings);
  };

  const updateNotifications = (notifications: Partial<UserSettings['notifications']>) => {
    const newSettings = {
      ...settings,
      notifications: { ...settings.notifications, ...notifications }
    };
    return saveSettings(newSettings);
  };

  const updatePreferences = (preferences: Partial<UserSettings['preferences']>) => {
    const newSettings = {
      ...settings,
      preferences: { ...settings.preferences, ...preferences }
    };
    return saveSettings(newSettings);
  };

  const resetSettings = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSettings(defaultSettings);
    return { success: true };
  };

  return {
    settings,
    isLoading,
    updateProfile,
    updateNotifications,
    updatePreferences,
    resetSettings,
    saveSettings
  };
}
