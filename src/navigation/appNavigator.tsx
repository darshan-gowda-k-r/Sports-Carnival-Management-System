import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/authentication/LoginScreen';
import RegisterScreen from '../screens/authentication/RegisterScreen';
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import OrganizerHomeScreen from '../screens/organizer/OrganizerHomeScreen';
import ParticipantHomeScreen from '../screens/participant/ParticipantHomeScreen';

import EventListScreen from '../screens/events/EventListScreen';
import EventDetailsScreen from '../screens/events/EventDetailsScreen';
import CreateEventScreen from '../screens/events/CreateEventScreen';
import EditEventScreen from '../screens/events/EditEventScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AdminHome: undefined;
  OrganizerHome: undefined;
  ParticipantHome: undefined;
  EventList: { role: string };
  EventDetails: { eventId: number };
  CreateEvent: undefined;
  EditEvent: { eventId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        <Stack.Screen name="OrganizerHome" component={OrganizerHomeScreen} />
        <Stack.Screen name="ParticipantHome" component={ParticipantHomeScreen} />

        <Stack.Screen name="EventList" component={EventListScreen} />
        <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
        <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
        <Stack.Screen name="EditEvent" component={EditEventScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
