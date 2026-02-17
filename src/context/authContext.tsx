import React, { createContext, useContext } from 'react';
import { useAuthViewModel } from '../viewmodels/authViewModel';
import { validationStrings, headerStrings } from '../constants/validationStrings';

type AuthContextType = ReturnType<typeof useAuthViewModel>;

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const viewModel = useAuthViewModel();

  return (
    <AuthContext.Provider value={viewModel}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error(validationStrings.AUTH_ERROR);
  return context;
};