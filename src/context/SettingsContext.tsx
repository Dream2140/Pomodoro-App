import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { PomodoroSettings } from '@/types';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';
import {
  getUserSettings,
  saveSettings as saveSettingsToDb,
  getDefaultSettings,
} from '@/services/firebase';

const DEFAULT_SETTINGS: PomodoroSettings = {
  work: { value: 25, min: 15, max: 25, step: 5, default: 25 },
  shortBreak: { value: 5, min: 3, max: 5, step: 1, default: 5 },
  longBreak: { value: 30, min: 15, max: 30, step: 5, default: 30 },
  iteration: { value: 5, min: 2, max: 5, step: 1, default: 5 },
};

interface SettingsContextValue {
  settings: PomodoroSettings;
  loading: boolean;
  updateSetting: (key: keyof PomodoroSettings, value: number) => void;
  resetDefaults: () => void;
  saveSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const userSettings = await getUserSettings(user!.uid);
        if (userSettings) {
          setSettings(userSettings);
        } else {
          const defaults = await getDefaultSettings();
          setSettings(defaults ?? DEFAULT_SETTINGS);
        }
      } catch {
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  const updateSetting = useCallback((key: keyof PomodoroSettings, value: number) => {
    setSettings((prev) => {
      const setting = prev[key];
      if (value >= setting.min && value <= setting.max) {
        return { ...prev, [key]: { ...setting, value } };
      }
      return prev;
    });
  }, []);

  const resetDefaults = useCallback(() => {
    setSettings((prev) => {
      const reset = { ...prev };
      for (const key of Object.keys(reset) as (keyof PomodoroSettings)[]) {
        reset[key] = { ...reset[key], value: reset[key].default };
      }
      return reset;
    });
  }, []);

  const saveSettings = useCallback(async () => {
    if (!user) return;
    try {
      await saveSettingsToDb(user.uid, settings);
      notify('success', 'Settings saved successfully');
    } catch {
      notify('error', 'Unable to save settings. Try again later');
    }
  }, [user, settings, notify]);

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSetting, resetDefaults, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
