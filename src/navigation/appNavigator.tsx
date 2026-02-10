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
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import TeamManagementScreen from '../screens/admin/TeamManagementScreen';
import RegisterForEventScreen from '../screens/participant/RegisterForEventScreen';

import IndividualRegistrationScreen from '../screens/participant/IndividualRegistrationScreen';
import MyRegistrationsScreen from '../screens/participant/MyRegistrationsScreen';
import ManageRegistrationsScreen from '../screens/admin/ManageRegistrationsScreen';
import CreateTeamsScreen from '../screens/admin/CreateTeamsScreen';
import MyMatchesScreen from '../screens/participant/MyMatchesScreen';
import MyTeamsScreen from '../screens/participant/MyTeamsScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AdminHome: undefined;
  OrganizerHome: undefined;
  ParticipantHome: undefined;
  EventList: { role: string };
  EventDetails: { event: any; role: string };
  CreateEvent: { role: string };
  EditEvent: { event: any };
  UserManagement: undefined;
  TeamManagement: { role: string };
  RegisterForEvent: { event: any };

  IndividualRegistration: { eventId: string; event: any };
  MyRegistrations: undefined;
  ManageRegistrations: undefined;
  CreateTeams: { eventId: string; format: '1v1' | '2v2' };
  MyMatches: undefined;
  MyTeams: { role: string };
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

        <Stack.Screen name="UserManagement" component={UserManagementScreen} />
        <Stack.Screen name="TeamManagement" component={TeamManagementScreen} />
        <Stack.Screen name="RegisterForEvent" component={RegisterForEventScreen} />

        <Stack.Screen name="IndividualRegistration" component={IndividualRegistrationScreen} />
        <Stack.Screen name="MyRegistrations" component={MyRegistrationsScreen} />
        <Stack.Screen name="ManageRegistrations" component={ManageRegistrationsScreen} />
        <Stack.Screen name="CreateTeams" component={CreateTeamsScreen} />
        <Stack.Screen name="MyMatches" component={MyMatchesScreen} />
        <Stack.Screen name="MyTeams" component={MyTeamsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

