import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../../constants/colors';
import styles from './ParticipantScreenStyle';
import { validationStrings } from '../../constants/validationStrings';

const ParticipantHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{validationStrings.PARTICIPANT_TITLE}</Text>
      <Text style={styles.subtitle}>{validationStrings.PARTICIPANT_ROLE}</Text>
    </View>
  );
};

export default ParticipantHomeScreen;
