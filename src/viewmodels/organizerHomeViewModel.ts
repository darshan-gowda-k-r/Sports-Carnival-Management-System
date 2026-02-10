import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useEvents } from '../context/eventContext';
import { useAuth } from '../context/authContext';
import Colors from '../constants/colors';
import { headerStrings, validationStrings } from '../constants/validationStrings';

interface MenuItem {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export const useOrganizerHomeViewModel = () => {
  const navigation = useNavigation<any>();
  const { events, loadEvents } = useEvents();
  const { user, logout } = useAuth();

  const currentOrganizerId = user?.email || user?.id;

  const [myEventsCount, setMyEventsCount] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  useEffect(() => {
    if (!currentOrganizerId) {
      setMyEventsCount(0);
      setTotalRegistrations(0);
      return;
    }

    const myEvents = events.filter(
      event => event.organizerId === currentOrganizerId
    );

    setMyEventsCount(myEvents.length);

    const registrations = myEvents.reduce((total, event) => {
      const eventRegistrations = event.availableFormats.reduce(
        (sum, format) => {
          const maleCount = format.registeredMaleCount || 0;
          const femaleCount = format.registeredFemaleCount || 0;
          return sum + maleCount + femaleCount;
        },
        0
      );
      return total + eventRegistrations;
    }, 0);

    setTotalRegistrations(registrations);
  }, [events, currentOrganizerId]);

  const handleLogout = useCallback(() => {
    Alert.alert(
      headerStrings.LOGOUT,
      headerStrings.LOGOUT_MSG,
      [
        { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
        {
          text: headerStrings.LOGOUT,
          style: validationStrings.ALERT_STYLE_DESTRUCTIVE,
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: validationStrings.SCREEN_LOGIN }],
              });
            } catch (error) {
              console.error(validationStrings.LOGOUT_ERROR, error);
              Alert.alert(validationStrings.ERROR, validationStrings.LOGOUT_ERROR);
            }
          },
        },
      ]
    );
  }, [logout, navigation]);

  const navigateToCreateEvent = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_CREATE_EVENT, { role: validationStrings.ORGANIZER });
  }, [navigation]);

  const navigateToMyEvents = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_EVENT_LIST, { role: validationStrings.ORGANIZER, filter: validationStrings.MY_EVENTS_FILTER });
  }, [navigation]);

  const navigateToAllEvents = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_EVENT_LIST, { role: validationStrings.ORGANIZER, filter: validationStrings.ALL_FILTER });
  }, [navigation]);

  const navigateToTeamRegistrations = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_TEAM_REGISTRATIONS, { role: validationStrings.ORGANIZER });
  }, [navigation]);

  const navigateToSchedulesResults = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_SCHEDULES_RESULTS, { role: validationStrings.ORGANIZER });
  }, [navigation]);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: validationStrings.MY_EVENTS,
      subtitle: validationStrings.MY_EVENTS_SUBTITLE,
      icon: validationStrings.ICON_EVENT_AVAILABLE,
      color: Colors.COLOR_BLUE,
      onPress: navigateToMyEvents,
    },
    {
      id: 2,
      title: validationStrings.ALL_EVENTS_MENU,
      subtitle: validationStrings.ALL_EVENTS_SUBTITLE,
      icon: validationStrings.ICON_EVENT,
      color: Colors.COLOR_GREEN,
      onPress: navigateToAllEvents,
    },
    {
      id: 3,
      title: validationStrings.TEAM_REG,
      subtitle: validationStrings.TEAM_REG_SUBTITLE,
      icon: validationStrings.ICON_HOW_TO_REG,
      color: Colors.COLOR_ORANGE,
      onPress: navigateToTeamRegistrations,
    },
    {
      id: 4,
      title: validationStrings.SCHEDULE_RESULT,
      subtitle: validationStrings.SCHEDULE_RESULT_SUBTITLE,
      icon: validationStrings.ICON_CALENDAR_TODAY,
      color: Colors.COLOR_PURPLE,
      onPress: navigateToSchedulesResults,
    },
  ];

  const getActivityItems = useCallback(() => {
    if (myEventsCount > 0) {
      const items = [
        {
          title: validationStrings.EVENTS_DASHBOARD_READY,
          description: validationStrings.ACTIVE_EVENTS_COUNT(myEventsCount),
        },
      ];

      if (totalRegistrations > 0) {
        items.push({
          title: validationStrings.REGISTRATIONS_RECEIVED,
          description: validationStrings.PARTICIPANTS_REGISTERED_COUNT(totalRegistrations),
        });
      }

      return items;
    }

    return [
      {
        title: validationStrings.READY_TO_GET_STARTED,
        description: validationStrings.CREATE_FIRST_EVENT_PROMPT,
      },
    ];
  }, [myEventsCount, totalRegistrations]);

  return {
    user,
    myEventsCount,
    totalRegistrations,

    handleLogout,
    navigateToCreateEvent,

    menuItems,
    activityItems: getActivityItems(),
  };
};

export type { MenuItem };