import { useState } from 'react';
import { User } from '../models/User';

export const useUserViewModel = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const setUser = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return {
    currentUser,
    setUser,
    logout,
  };
};
