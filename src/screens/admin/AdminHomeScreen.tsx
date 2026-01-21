import React from 'react';
import { View, Text } from 'react-native';
import styles from './AdminHomeScreenStyle';
import { validationStrings } from '../../constants/validationStrings';

const AdminHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{validationStrings.ADMIN_TITLE}</Text>
      <Text style={styles.subtitle}>{validationStrings.ADMIN_ROLE}</Text>
    </View>
  );
};

export default AdminHomeScreen;