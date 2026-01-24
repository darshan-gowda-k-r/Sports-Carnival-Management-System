import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEventViewModel } from '../../viewmodels/eventViewModel';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './CreateEventScreenStyle';
import { validationStrings } from '../../constants/validationStrings';

const CreateEventScreen = () => {
  const navigation = useNavigation<any>();
  const { createEvent } = useEventViewModel();

  const [title, setTitle] = useState('');
  const [sportType, setSportType] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [maxTeams1v1, setMaxTeams1v1] = useState('');
  const [maxTeams2v2, setMaxTeams2v2] = useState('');

  const handleCreate = () => {
    createEvent({
      title,
      sportType,
      description,
      date,
      location,
      organizer,
      status: 'UPCOMING',
      formats: [
        { format: '1v1', teamSize: 1, maxTeams: Number(maxTeams1v1), registeredTeams: 0 },
        { format: '2v2', teamSize: 2, maxTeams: Number(maxTeams2v2), registeredTeams: 0 },
      ],
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Event</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={validationStrings.EVENT_TITLE}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Sport Type</Text>
          <TextInput
            style={styles.input}
            value={sportType}
            onChangeText={setSportType}
            placeholder={validationStrings.GAMES}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            value={description}
            onChangeText={setDescription}
            placeholder={validationStrings.EVENT_DES}
            multiline
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder={validationStrings.DATE_FORMAT}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder={validationStrings.EVENT_LOCATION}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Max Teams (1v1)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={maxTeams1v1}
            onChangeText={setMaxTeams1v1}
            placeholder="Number of teams"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Max Teams (2v2)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={maxTeams2v2}
            onChangeText={setMaxTeams2v2}
            placeholder="Number of teams"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreate}>
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateEventScreen;
