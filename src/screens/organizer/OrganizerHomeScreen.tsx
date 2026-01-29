import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { validationStrings } from '../../constants/validationStrings';
import styles from './OrganizerScreenStyle';

const OrganizerHomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{validationStrings.ORGANISER_TITLE}</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('EventList', { role: 'ORGANIZER' })}
        >
          <Text style={styles.cardText}>{validationStrings.ORG_EVENTS}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('TeamRegistrations', { role: 'ORGANIZER' })}
        >
          <Text style={styles.cardText}>{validationStrings.TEAM_REG}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SchedulesResults', { role: 'ORGANIZER' })}
        >
          <Text style={styles.cardText}>{validationStrings.SCHEDULE_RESULT}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrganizerHomeScreen;
