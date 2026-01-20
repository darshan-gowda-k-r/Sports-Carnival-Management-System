export const isNameValid = (name: string): string | null => {
  if (!name.trim()) {
    return 'Name is required';
  }

  if (name.trim().length < 3) {
    return 'Name must be at least 3 characters long';
  }

  if (!/^[A-Za-z\s]+$/.test(name)) {
    return 'Name can contain only letters and spaces';
  }

  return null;
};

export const isEmailValid = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};

export const isPasswordValid = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 10) return 'Password must be at least 10 characters long';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter (A-Z)';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter (a-z)';
  if (!/\d/.test(password)) return 'Password must contain at least one number (0-9)';
  if (!/[@$!%*?&]/.test(password)) return 'Password must contain at least one special character (@$!%*?&)';
  return null;
};
