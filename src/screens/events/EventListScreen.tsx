import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors';
import { validationStrings } from '../../constants/validationStrings';
import { useEventViewModel } from '../../viewmodels/eventViewModel';
import styles from './EventListScreenStyle';

const EventListScreen = ({ route }: any) => {
  const { role } = route.params; 
  const navigation = useNavigation<any>();
  const { events, loadEvents, deleteEvent } = useEventViewModel();

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      validationStrings.DELETE_COFIRMATION,
      validationStrings.DELETE_MSG,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteEvent(id),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Events</Text>

      {(role === 'ADMIN' || role === 'ORGANIZER') && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateEvent')}
        >
          <Text style={styles.createButtonText}>+ Create Event</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('EventDetails', { event: item, role })
              }
            >
              <Text style={styles.eventName}>{item.title}</Text>
              <Text style={styles.eventType}>{item.sportType}</Text>
            </TouchableOpacity>

            {role === 'ADMIN' && (
              <View style={styles.adminActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    navigation.navigate('EditEvent', { event: item })
                  }
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={[styles.actionText, { color: Colors.error }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {role === 'ORGANIZER' && (
              <View style={styles.adminActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    navigation.navigate('EditEvent', { event: item })
                  }
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default EventListScreen;
