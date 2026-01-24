import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { validationStrings } from '../../constants/validationStrings';
import styles from './EventDetailsScreenStyle';

const EventDetailsScreen = ({ route }: any) => {
  const { event, role } = route.params;
  const navigation = useNavigation<any>();

  const handleAssignOrganizer = () => {
    Alert.alert(validationStrings.ORGANIZER_ALERT);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>

      <Text style={styles.label}>Sport Type</Text>
      <Text style={styles.value}>{event.sportType}</Text>

      <Text style={styles.label}>Description</Text>
      <Text style={styles.value}>{event.description}</Text>

      <Text style={styles.label}>Date</Text>
      <Text style={styles.value}>{event.date}</Text>

      <Text style={styles.label}>Location</Text>
      <Text style={styles.value}>{event.location}</Text>

      <Text style={styles.label}>Organizer</Text>
      <Text style={styles.value}>{event.organizer}</Text>

      <Text style={styles.label}>{validationStrings.EVENT_DETAILS}</Text>
      {event.formats.map((f: any) => (
        <Text key={f.format} style={styles.value}>
          {f.format}     :                 {f.registeredTeams}/{f.maxTeams} teams
        </Text>
      ))}

      {role === 'ADMIN' && (
        <View style={styles.adminActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditEvent', { event })}
          >
            <Text style={styles.editButtonText}>Edit Event</Text>
          </TouchableOpacity>
        </View>
      )}

      {role === 'ORGANIZER' && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditEvent', { event })}
        >
          <Text style={styles.editButtonText}>Edit Event</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default EventDetailsScreen;
