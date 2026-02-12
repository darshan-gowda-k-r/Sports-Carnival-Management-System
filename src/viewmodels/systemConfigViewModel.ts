import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validationStrings } from '../constants/validationStrings';

const CONFIG_KEY = 'SYSTEM_CONFIG';

interface SystemConfig {
  autoApproveRegistrations: boolean;
  emailNotifications: boolean;
  allowLateRegistration: boolean;
}

const DEFAULT_CONFIG: SystemConfig = {
  autoApproveRegistrations: false,
  emailNotifications: true,
  allowLateRegistration: false,
};

export const useSystemConfigViewModel = () => {
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);

  const loadConfig = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(CONFIG_KEY);
      if (stored) {
        setConfig(JSON.parse(stored));
      }
    } catch (error) {
      console.error(validationStrings.ERROR_LOADING_CONFIG, error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const updateConfig = useCallback(async (key: keyof SystemConfig, value: any) => {
    try {
      const newConfig = { ...config, [key]: value };
      setConfig(newConfig);
      await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(newConfig));
    } catch (error) {
      console.error(validationStrings.ERROR_UPDATING_CONFIG, error);
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_UPDATE_CONFIG);
    }
  }, [config]);

  const resetToDefaults = useCallback(async () => {
    Alert.alert(
      validationStrings.RESET_CONFIG_TITLE,
      validationStrings.RESET_CONFIG_MESSAGE,
      [
        { text: validationStrings.CANCEL, style: 'cancel' },
        {
          text: validationStrings.RESET_TEXT,
          style: 'destructive',
          onPress: async () => {
            try {
              setConfig(DEFAULT_CONFIG);
              await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
              Alert.alert(validationStrings.SUCCESS, validationStrings.CONFIG_RESET_SUCCESS);
            } catch (error) {
              Alert.alert(validationStrings.ERROR, validationStrings.FAILED_RESET_CONFIG);
            }
          },
        },
      ]
    );
  }, []);

  return {
    config,
    loading,
    updateConfig,
    resetToDefaults,
  };
};