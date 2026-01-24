import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEventViewModel } from '../../viewmodels/eventViewModel';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './EditEventScreenStyle';
import { validationStrings } from '../../constants/validationStrings';
import Colors from '../../constants/colors';

const EditEventScreen = ({ route }: any) => {
  const { event } = route.params;
  const navigation = useNavigation<any>();
  const { updateEvent } = useEventViewModel();

  const [title, setTitle] = useState(event.title);
  const [sportType, setSportType] = useState(event.sportType);
  const [description, setDescription] = useState(event.description);
  const [date, setDate] = useState(event.date);
  const [location, setLocation] = useState(event.location);
  const [organizer, setOrganizer] = useState(event.organizer);

  const handleUpdate = () => {
    updateEvent({
      ...event,
      title,
      sportType,
      description,
      date,
      location,
      organizer,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style = {{ flex: 1, backgroundColor: Colors.Background_color }}>
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.screenTitle}>Edit Event</Text>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
            style={styles.input}
            placeholder={validationStrings.EVENT_TITLE}
            value={title}
            onChangeText={setTitle}
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Sport Type</Text>
            <TextInput
            style={styles.input}
            placeholder={validationStrings.GAMES}
            value={sportType}
            onChangeText={setSportType}
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={validationStrings.EVENT_DESCRIPTION}
            value={description}
            onChangeText={setDescription}
            multiline
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Date</Text>
            <TextInput
            style={styles.input}
            placeholder={validationStrings.DATE_FORMAT}
            value={date}
            onChangeText={setDate}
            />
        </View>

        <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
            style={styles.input}
            placeholder={validationStrings.EVENT_LOCATION}
            value={location}
            onChangeText={setLocation}
            />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update Event</Text>
        </TouchableOpacity>
        </ScrollView>
    </SafeAreaView>
    
  );
};

export default EditEventScreen;
