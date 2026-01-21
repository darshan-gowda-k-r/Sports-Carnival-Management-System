import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from './customButtonStyle';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const CustomButton = ({ title, onPress, disabled }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

