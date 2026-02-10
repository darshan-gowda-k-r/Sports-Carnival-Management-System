import { useState } from 'react';
import { Alert } from 'react-native';
import { validationStrings } from '../constants/validationStrings';

export const useForgotPasswordModalViewModel = (
  onSubmit: (email: string) => Promise<void>,
  onClose: () => void
) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.trim()) {
      Alert.alert(validationStrings.ERROR, validationStrings.ENTER_VALID_EMAIL);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(email.trim());
      setEmail('');
      onClose();
    } catch (error) {
      console.error(validationStrings.FORGOT_PASSWORD_ERROR, error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return {
    email,
    setEmail,
    loading,
    handleSubmit,
    handleClose,
  };
};