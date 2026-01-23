import { useState } from 'react';
import { ApiService } from '../api/apiService';
import { User, UserRole } from '../models/user';

export const useAuthViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.login(email, password);
      setUser(response);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    setLoading(true);
    setError(null);
    try {
      await ApiService.register(name, email, password, role);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login, register };
};
