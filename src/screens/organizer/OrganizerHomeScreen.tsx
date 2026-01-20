import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const OrganizerHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Organizer Dashboard</Text>
      <Text style={styles.subtitle}>Create & manage events</Text>
    </View>
  );
};

export default OrganizerHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  subtitle: {
    marginTop: 10,
    color: Colors.gray,
  },
});
