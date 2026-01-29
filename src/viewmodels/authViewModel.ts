import { useState } from 'react';
import { ApiService } from '../api/apiService';
import { User, UserRole } from '../models/user';

export const useAuthViewModel = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runWithLoading = async (action: () => Promise<void>) => {
    setLoading(true);
    setError(null);
    try {
      await action();
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    await runWithLoading(async () => {
      const response = await ApiService.login(email, password);
      setUser(response);
    });
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    await runWithLoading(async () => {
      await ApiService.register(name, email, password, role);
    });
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };
};
