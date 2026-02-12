import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useEvents } from '../context/eventContext';
import { useAuth } from '../context/authContext';
import { PlayFormat } from '../models/event';
import Colors from '../constants/colors';
import { headerStrings, validationStrings } from '../constants/validationStrings';

export interface EventFormatOption {
  eventId: string;
  eventTitle: string;
  format: PlayFormat;
}

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
  const [showCreateTeamsModal, setShowCreateTeamsModal] = useState(false);
  const [eventFormatOptions, setEventFormatOptions] = useState<EventFormatOption[]>([]);

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

  useEffect(() => {
    const myEvents = events.filter(
      event => event.organizerId === currentOrganizerId
    );

    const options: EventFormatOption[] = [];
    myEvents.forEach(event => {
      event.availableFormats.forEach(formatObj => {
        if (formatObj.isAvailable) {
          options.push({
            eventId: event.id,
            eventTitle: event.title,
            format: formatObj.format,
          });
        }
      });
    });
    setEventFormatOptions(options);
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

  const navigateToAllEvents = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_EVENT_LIST, { role: validationStrings.ORGANIZER, filter: validationStrings.ALL_FILTER });
  }, [navigation]);

  const navigateToManageRegistrations = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_MANAGE_REGISTRATIONS, {
      role: validationStrings.ORGANIZER
    });
  }, [navigation]);

  const handleCreateTeamsPress = useCallback(() => {
    if (eventFormatOptions.length === 0) {
      Alert.alert(
        validationStrings.NO_EVENTS_AVAILABLE,
        validationStrings.CREATE_FORMAT
      );
      return;
    }
    setShowCreateTeamsModal(true);
  }, [eventFormatOptions.length]);

  const navigateToTeamManagement = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_TEAM_MANAGEMENT, { role: validationStrings.ORGANIZER });
  }, [navigation]);

  const navigateToFixtures = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_VIEW_FIXTURES, {
      role: validationStrings.ORGANIZER,
      organizerId: user?.email,
    });
  }, [navigation, user]);

  const handleSelectEventFormat = useCallback((option: EventFormatOption) => {
    setShowCreateTeamsModal(false);
    navigation.navigate(validationStrings.SCREEN_CREATE_TEAMS, {
      eventId: option.eventId,
      format: option.format,
    });
  }, [navigation]);

  const handleCloseModal = useCallback(() => {
    setShowCreateTeamsModal(false);
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: validationStrings.VIEW_EVENTS,
      subtitle: validationStrings.ALL_EVENTS_SUBTITLE,
      icon: validationStrings.ICON_EVENT,
      color: Colors.COLOR_BLUE,
      onPress: navigateToAllEvents,
    },
    {
      id: 2,
      title: validationStrings.MANAGE_REG,
      subtitle: validationStrings.APPROVE_OR_REJECT,
      icon: validationStrings.ICON_HOW_TO_REG,
      color: Colors.COLOR_GREEN,
      onPress: navigateToManageRegistrations,
    },
    {
      id: 3,
      title: headerStrings.CREATE_TEAMS,
      subtitle: validationStrings.FORM_TEAMS,
      icon: validationStrings.ICON_GROUPS,
      color: Colors.COLOR_ORANGE,
      onPress: handleCreateTeamsPress,
    },
    {
      id: 4,
      title: validationStrings.TEAM_MANAGE,
      subtitle: validationStrings.VIEW_TEAM_REG,
      icon: validationStrings.ICON_GROUP,
      color: Colors.COLOR_PURPLE,
      onPress: navigateToTeamManagement,
    },
    {
      id: 5,
      title: validationStrings.FIXTURES,
      subtitle: validationStrings.ALL_FIXTURES,
      icon: validationStrings.ICON_TROPHY,
      color: Colors.COLOR_TEAL,
      onPress: navigateToFixtures,
    },
  ];

  const getActivityItems = useCallback(() => {
    if (myEventsCount > 0) {
      const items = [
        {
          title: validationStrings.EVENTS_ACTIVE,
          description: validationStrings.MANAGING_EVENTS(myEventsCount),
        },
      ];

      if (totalRegistrations > 0) {
        items.push({
          title: validationStrings.REGISTRATIONS_RECEIVED,
          description: validationStrings.PARTICIPANTS_REGISTERED(totalRegistrations),
        });
      } else {
        items.push({
          title: validationStrings.READY_FOR_REGISTRATIONS,
          description: validationStrings.AWAITING_SIGNUPS,
        });
      }

      return items;
    }

    return [
      {
        title: validationStrings.WELCOME_EXCLAIM,
        description: validationStrings.CREATE_FIRST_EVENT,
      },
    ];
  }, [myEventsCount, totalRegistrations]);

  return {
    user,
    myEventsCount,
    totalRegistrations,
    showCreateTeamsModal,
    eventFormatOptions,

    handleLogout,
    navigateToCreateEvent,

    menuItems,
    activityItems: getActivityItems(),

    handleSelectEventFormat,
    handleCloseModal,
  };
};

export type { MenuItem };