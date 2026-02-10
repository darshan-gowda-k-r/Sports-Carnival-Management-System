import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiService } from '../api/apiService';
import { User, UserRole, Gender } from '../models/user';
import { headerStrings, validationStrings } from '../constants/validationStrings';

const AUTH_STORAGE_KEY = 'AUTHENTICATED_USER';

export const useAuthViewModel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error(validationStrings.ERROR_LOADING_USERS, err);
    } finally {
      setLoading(false);
    }
  };

  const saveUserToStorage = async (userData: User) => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } catch (err) {
      console.error(validationStrings.ERROR_SAVING_USERS, err);
    }
  };

  const removeUserFromStorage = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {
      console.error(validationStrings.ERROR_REMOVING_USERS, err);
    }
  };

  const runWithLoading = async (action: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await action();
    } catch (err: any) {
      setError(err.message || err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    await runWithLoading(async () => {
      const response = await ApiService.login(email, password);
      setUser(response);
      await saveUserToStorage(response);
    });
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    gender?: Gender
  ) => {
    await runWithLoading(async () => {
      await ApiService.register(name, email, password, role, gender);
    });
  };

  const forgotPassword = async (email: string): Promise<string> => {
    setError(null);
    try {
      const tempPassword = await ApiService.forgotPassword(email);
      return tempPassword;
    } catch (err: any) {
      setError(err.message || err);
      throw err;
    }
  };

  const logout = async () => {
    setUser(null);
    setError(null);
    await removeUserFromStorage();
  };

  const updateUser = async (updatedUser: User) => {
    setUser(updatedUser);
    await saveUserToStorage(updatedUser);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    forgotPassword,
    logout,
    updateUser,
  };
};