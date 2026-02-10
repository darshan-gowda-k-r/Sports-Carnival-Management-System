import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/colors';
import styles from './forgotPasswordModalStyle';
import { headerStrings, validationStrings } from '../constants/validationStrings';
import { useForgotPasswordModalViewModel } from '../viewmodels/forgotPasswordModalViewModel';

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const {
    email,
    setEmail,
    loading,
    handleSubmit,
    handleClose,
  } = useForgotPasswordModalViewModel(onSubmit, onClose);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{validationStrings.FORGOT_PASSWORD}</Text>
          <Text style={styles.subtitle}>
            {validationStrings.ENTER_REG_EMAIL_ID}
          </Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor={Colors.gray}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>{validationStrings.CANCEL}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {validationStrings.SUBMIT}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;
