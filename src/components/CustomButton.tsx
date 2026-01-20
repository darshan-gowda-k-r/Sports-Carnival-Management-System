import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

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

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: Colors.gray,
  },
});
