import React from 'react';
import { validationStrings } from '../constants/validationStrings';

export const isNameValid = (name: string): string | null => {
  if (!name.trim()) {
    return validationStrings.NAME_REQUIRED;
  }

  if (name.trim().length < 3) {
    return validationStrings.MINIMUM_NAME_LENGTH;
  }

  if (!/^[A-Za-z\s]+$/.test(name)) {
    return validationStrings.NAME_ONLY_ALPHA;
  }

  return null;
};

export const isEmailValid = (email: string): string | null => {
  if (!email.trim()) {
    return validationStrings.EMAIL_REQUIRED;
  }

  if (/[A-Z]/.test(email)) {
      return validationStrings.EMAIL_ONLY_LOWERCASE;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return validationStrings.VALID_EMAIL;
  }

  return null;
};

export const isPasswordValid = (password: string): string | null => {
  
  if (!password) {
    return validationStrings.PASSWORD_REQUIRED;
  }
  if ( password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[@$!%*?&]/.test(password)) {
    return validationStrings.PASSWORD_SUGGESTION;
  }
  return null;
};
