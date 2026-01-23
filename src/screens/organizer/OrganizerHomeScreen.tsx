import React from 'react';
import { View, Text } from 'react-native';
import styles from './OrganizerScreenStyle';
import { validationStrings } from '../../constants/validationStrings';

const OrganizerHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{validationStrings.ORGANISER_TITLE}</Text>
      <Text style={styles.subtitle}>{validationStrings.ORGANISER_ROLE}</Text>
    </View>
  );
};

export default OrganizerHomeScreen;
