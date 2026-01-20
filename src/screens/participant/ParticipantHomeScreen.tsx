import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const ParticipantHomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Participant</Text>
      <Text style={styles.subtitle}>Explore and join events</Text>
    </View>
  );
};

export default ParticipantHomeScreen;

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
