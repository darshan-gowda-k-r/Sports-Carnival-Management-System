import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { validationStrings } from '../../constants/validationStrings';
import styles from './ParticipantScreenStyle';

const ParticipantHomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{validationStrings.PARTICIPANT_TITLE}</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('EventList', { role: 'PARTICIPANT' })}
        >
          <Text style={styles.cardText}>{validationStrings.VIEW_EVENTS}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('MyTeams', { role: 'PARTICIPANT' })}
        >
          <Text style={styles.cardText}>{validationStrings.MY_TEAM}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SchedulesResults', { role: 'PARTICIPANT' })}
        >
          <Text style={styles.cardText}>{validationStrings.SCHEDULE_RESULT}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ParticipantHomeScreen;
