import { useState } from 'react';
import { UserRole, Gender } from '../models/user';
import { isNameValid, isEmailValid, isPasswordValid } from '../utils/validators';

export const useRegisterViewModel = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.PARTICIPANT);
  const [gender, setGender] = useState<Gender>(Gender.MALE);

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleNameChange = (text: string) => {
    setName(text);
    setNameError(isNameValid(text));
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setEmailError(isEmailValid(text));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setPasswordError(isPasswordValid(text));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    const nError = isNameValid(name);
    if (nError) {
      setNameError(nError);
      return false;
    }
    const eError = isEmailValid(email);
    if (eError) {
      setEmailError(eError);
      return false;
    }
    const pError = isPasswordValid(password);
    if (pError) {
      setPasswordError(pError);
      return false;
    }
    return true;
  };

  const isFormValid =
    !isNameValid(name) &&
    !isEmailValid(email) &&
    !isPasswordValid(password);

  return {
    name,
    email,
    password,
    showPassword,
    role,
    gender,
    nameError,
    emailError,
    passwordError,
    handleNameChange,
    handleEmailChange,
    handlePasswordChange,
    togglePasswordVisibility,
    setRole,
    setGender,
    validateForm,
    isFormValid,
  };
};