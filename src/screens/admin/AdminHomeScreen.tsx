import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { validationStrings } from '../../constants/validationStrings';
import styles from './AdminHomeScreenStyle';

const AdminHomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{validationStrings.ADMIN_TITLE}</Text>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('EventList', { role: 'ADMIN' })}
        >
          <Text style={styles.cardText}>{validationStrings.EVENT_MANAGE}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('UserManagement')}
        >
          <Text style={styles.cardText}>{validationStrings.MANAGE_USER}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('TeamManagement', { role: 'ADMIN' })}
        >
          <Text style={styles.cardText}>{validationStrings.TEAM_MANAGE}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SchedulesResults', { role: 'ADMIN' })}
        >
          <Text style={styles.cardText}>{validationStrings.SCHEDULE_RESULT}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Reports')}
        >
          <Text style={styles.cardText}>{validationStrings.REPORT}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('SystemConfig')}
        >
          <Text style={styles.cardText}>{validationStrings.CONFIG}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminHomeScreen;
