import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/authContext';
import Colors from '../constants/colors';
import { validationStrings, headerStrings } from '../constants/validationStrings';
import { ROUTES } from '../constants/routes';

interface QuickAction {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  sport: string;
}

export const useParticipantHomeViewModel = () => {
  const navigation = useNavigation<any>();
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    Alert.alert(
      headerStrings.LOGOUT,
      headerStrings.LOGOUT_MSG,
      [
        { text: validationStrings.CANCEL, style: 'cancel' },
        {
          text: headerStrings.LOGOUT,
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace(ROUTES.LOGIN);
          },
        },
      ]
    );
  }, [logout, navigation]);

  const navigateToEventList = useCallback(() => {
    navigation.navigate(ROUTES.EVENT_LIST, {
      role: validationStrings.PARTICIPANT
    });
  }, [navigation]);

  const navigateToMyRegistrations = useCallback(() => {
    navigation.navigate(ROUTES.MY_REGISTRATIONS);
  }, [navigation]);

  const navigateToMyMatches = useCallback(() => {
    navigation.navigate(ROUTES.MY_MATCHES);
  }, [navigation]);

  const navigateToMyTeams = useCallback(() => {
    navigation.navigate(ROUTES.MY_TEAMS, {
      role: validationStrings.PARTICIPANT
    });
  }, [navigation]);

  const navigateToFixtures = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_VIEW_FIXTURES, {
      role: validationStrings.PARTICIPANT,
    });
  }, [navigation]);

  const quickActions: QuickAction[] = [
    {
      id: 1,
      title: validationStrings.BROWSE_EVENTS_TITLE,
      subtitle: validationStrings.BROWSE_EVENTS_SUBTITLE,
      icon: validationStrings.ICON_EXPLORE,
      color: Colors.COLOR_BLUE,
      onPress: navigateToEventList,
    },
    {
      id: 2,
      title: validationStrings.MY_REGISTRATIONS_TITLE,
      subtitle: validationStrings.MY_REGISTRATIONS_SUBTITLE,
      icon: validationStrings.ICON_ASSIGNMENT,
      color: Colors.COLOR_GREEN,
      onPress: navigateToMyRegistrations,
    },
    {
      id: 3,
      title: validationStrings.FIXTURES,
      subtitle: validationStrings.MANAGE_FIXTURES,
      icon: validationStrings.SPORTS_SOCCER,
      color: Colors.COLOR_ORANGE,
      onPress: navigateToFixtures,
    },
    {
      id: 4,
      title: validationStrings.MY_TEAMS_TITLE,
      subtitle: validationStrings.MY_TEAMS_SUBTITLE,
      icon: validationStrings.ICON_GROUPS,
      color: Colors.COLOR_PURPLE,
      onPress: navigateToMyTeams,
    },
  ];

  const upcomingEvents: UpcomingEvent[] = [
    {
      id: 1,
      title: validationStrings.SAMPLE_EVENT_1_TITLE,
      date: validationStrings.SAMPLE_EVENT_1_DATE,
      time: validationStrings.SAMPLE_EVENT_1_TIME,
      sport: validationStrings.SAMPLE_EVENT_1_SPORT,
    },
    {
      id: 2,
      title: validationStrings.SAMPLE_EVENT_2_TITLE,
      date: validationStrings.SAMPLE_EVENT_2_DATE,
      time: validationStrings.SAMPLE_EVENT_2_TIME,
      sport: validationStrings.SAMPLE_EVENT_2_SPORT,
    },
    {
      id: 3,
      title: validationStrings.SAMPLE_EVENT_3_TITLE,
      date: validationStrings.SAMPLE_EVENT_3_DATE,
      time: validationStrings.SAMPLE_EVENT_3_TIME,
      sport: validationStrings.SAMPLE_EVENT_3_SPORT,
    },
  ];

  const stats = {
    eventsJoined: 3,
    upcomingMatches: 2,
    wins: 1,
  };

  return {
    handleLogout,
    navigateToEventList,
    quickActions,
    upcomingEvents,
    stats,
  };
};

export type { QuickAction, UpcomingEvent };