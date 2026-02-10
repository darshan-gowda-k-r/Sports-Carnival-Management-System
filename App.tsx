import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/appNavigator';
import { seedEvents } from './src/api/seedEvents';
import { ApiService } from './src/api/apiService';
import { EventProvider } from './src/context/eventContext';
import { AuthProvider } from './src/context/authContext';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import Colors from './src/constants/colors';

const App = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await ApiService.initialize();

        await seedEvents();

        setReady(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setReady(true);
      }
    };
    init();
  }, []);

  if (!ready) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Initializing App...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <EventProvider>
        <AppNavigator />
      </EventProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.Background_color,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '600',
  },
});

export default App;

