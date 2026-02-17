import { useState, useRef } from 'react';
import { validationStrings } from '../constants/validationStrings';

interface LoginViewModelDependencies {
  loginService: (email: string, password: string) => Promise<void>;
  forgotPasswordService: (email: string) => Promise<string>;
}

export const useLoginViewModel = (dependencies: LoginViewModelDependencies) => {
  const { loginService, forgotPasswordService } = dependencies;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const hasNavigated = useRef(false);

  const isFormFilled = email.trim() !== '' && password.trim() !== '';

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const openForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  const resetNavigation = () => {
    hasNavigated.current = false;
    setIsNavigating(false);
  };

  const handleLogin = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isFormFilled) {
      return { success: false, error: validationStrings.FILL_ALL_FIELDS };
    }

    try {
      await loginService(email, password);
      return { success: true };
    } catch (err: any) {
      console.error(validationStrings.LOGIN_ERROR, err);
      return { success: false, error: err.message || validationStrings.LOGIN_FAILED_MESSAGE };
    }
  };

  const handleForgotPasswordSubmit = async (
    inputEmail: string
  ): Promise<{ success: boolean; tempPassword?: string; error?: string }> => {
    try {
      const tempPassword = await forgotPasswordService(inputEmail);
      closeForgotPasswordModal();
      return { success: true, tempPassword };
    } catch (err: any) {
      console.error(validationStrings.FORGOT_PASSWORD_ERROR, err);
      return { success: false, error: err.message || validationStrings.FAILED_TO_RESET_PASSWORD };
    }
  };

  return {
    email,
    password,
    showPassword,
    isNavigating,
    showForgotPasswordModal,
    hasNavigated,
    isFormFilled,

    setEmail,
    setPassword,
    togglePasswordVisibility,
    setIsNavigating,
    openForgotPasswordModal,
    closeForgotPasswordModal,
    resetNavigation,

    handleLogin,
    handleForgotPasswordSubmit,
  };
};