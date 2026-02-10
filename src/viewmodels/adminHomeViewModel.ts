import { useEffect, useState, useCallback, useRef } from 'react';
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

export interface MenuItem {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export const useAdminHomeViewModel = () => {
  const navigation = useNavigation<any>();
  const { events, loadEvents } = useEvents();
  const { logout } = useAuth();
  const isMountedRef = useRef(true);

  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [showCreateTeamsModal, setShowCreateTeamsModal] = useState(false);
  const [eventFormatOptions, setEventFormatOptions] = useState<EventFormatOption[]>([]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [loadEvents])
  );

  useEffect(() => {
    setTotalEvents(events.length);

    const registrations = events.reduce((total, event) => {
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

    const options: EventFormatOption[] = [];
    events.forEach(event => {
      event.availableFormats.forEach(formatObj => {
        options.push({
          eventId: event.id,
          eventTitle: event.title,
          format: formatObj.format,
        });
      });
    });
    setEventFormatOptions(options);
  }, [events]);

  const handleLogout = useCallback(() => {
    if (!isMountedRef.current) return;

    setTimeout(() => {
      Alert.alert(
        validationStrings.LOGOUT_CONFIRMATION,
        validationStrings.LOGOUT_MSG,
        [
          { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
          {
            text: validationStrings.LOGOUT,
            style: validationStrings.ALERT_STYLE_DESTRUCTIVE,
            onPress: async () => {
              await logout();
              navigation.replace(validationStrings.SCREEN_LOGIN);
            },
          },
        ]
      );
    }, 100);
  }, [logout, navigation]);

  const handleCreateTeamsPress = useCallback(() => {
    if (!isMountedRef.current) return;

    if (eventFormatOptions.length === 0) {
      setTimeout(() => {
        Alert.alert(
          validationStrings.NO_EVENTS_AVAILABLE,
          validationStrings.CREATE_FORMAT
        );
      }, 100);
      return;
    }
    setShowCreateTeamsModal(true);
  }, [eventFormatOptions.length]);

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
      title: validationStrings.EVENT_MANAGE,
      subtitle: validationStrings.ORGANISER_ROLE,
      icon: validationStrings.ICON_EVENT,
      color: Colors.COLOR_BLUE,
      onPress: () => navigation.navigate(validationStrings.SCREEN_EVENT_LIST, { role: validationStrings.ADMIN }),
    },
    {
      id: 2,
      title: validationStrings.MANAGE_REG,
      subtitle: validationStrings.APPROVE_OR_REJECT,
      icon: validationStrings.ICON_HOW_TO_REG,
      color: Colors.COLOR_GREEN,
      onPress: () => navigation.navigate(validationStrings.SCREEN_MANAGE_REGISTRATIONS),
    },
    {
      id: 3,
      title: headerStrings.CREATE_TEAMS,
      subtitle: validationStrings.FORM_TEAMS,
      icon: validationStrings.ICON_GROUPS,
      color: Colors.COLOR_PURPLE,
      onPress: handleCreateTeamsPress,
    },
    {
      id: 4,
      title: validationStrings.MANAGE_USER,
      subtitle: validationStrings.MANAGE_USER_ACC,
      icon: validationStrings.ICON_PEOPLE,
      color: Colors.COLOR_ORANGE,
      onPress: () => navigation.navigate(validationStrings.SCREEN_USER_MANAGEMENT),
    },
    {
      id: 5,
      title: validationStrings.TEAM_MANAGE,
      subtitle: validationStrings.VIEW_TEAM_REG,
      icon: validationStrings.ICON_GROUP,
      color: Colors.COLOR_FEMALE,
      onPress: () => navigation.navigate(validationStrings.SCREEN_TEAM_MANAGEMENT, { role: validationStrings.ADMIN }),
    },
    {
      id: 6,
      title: validationStrings.SCHEDULE_RESULT,
      subtitle: validationStrings.MATCH_SCHEDULE,
      icon: validationStrings.ICON_SCHEDULE,
      color: Colors.schedule_color,
      onPress: () => navigation.navigate(validationStrings.SCREEN_SCHEDULES_RESULTS, { role: validationStrings.ADMIN }),
    },
    {
      id: 7,
      title: validationStrings.REPORT,
      subtitle: validationStrings.VIEW_ANALYTICS,
      icon: validationStrings.ICON_ASSESSMENT,
      color: Colors.notificationBadge,
      onPress: () => navigation.navigate(validationStrings.SCREEN_REPORTS),
    },
    {
      id: 8,
      title: validationStrings.CONFIG,
      subtitle: validationStrings.SYSTEM_CONFIGERATION,
      icon: validationStrings.ICON_SETTINGS,
      color: Colors.iconSecondary,
      onPress: () => navigation.navigate(validationStrings.SCREEN_SYSTEM_CONFIG),
    },
  ];

  return {
    totalEvents,
    totalRegistrations,
    showCreateTeamsModal,
    eventFormatOptions,
    menuItems,
    handleLogout,
    handleCreateTeamsPress,
    handleSelectEventFormat,
    handleCloseModal,
  };
};