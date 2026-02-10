import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useEvents } from '../context/eventContext';
import { useAuth } from '../context/authContext';
import Colors from '../constants/colors';
import { headerStrings, validationStrings } from '../constants/validationStrings';
import { Event } from '../models/event';

type TabType = 'all' | 'today' | 'upcoming' | 'myEvents';

export const useEventListViewModel = () => {
  const route = useRoute<any>();
  const { role, filter: initialFilter } = route.params;
  const navigation = useNavigation<any>();
  const { events, loadEvents, deleteEvent } = useEvents();
  const { user } = useAuth();
  const isMountedRef = useRef(true);

  const currentOrganizerId = user?.email || user?.id;

  const [activeTab, setActiveTab] = useState<TabType>(
    initialFilter === validationStrings.MY_EVENTS_FILTER ? validationStrings.MY_EVENTS_FILTER : validationStrings.ALL_FILTER
  );

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

  const getFilteredEvents = useCallback(() => {
    const today = new Date().toISOString().split(validationStrings.DATE_SEPARATOR)[0];

    let filteredByTab = events;

    switch (activeTab) {
      case validationStrings.TODAY_FILTER:
        filteredByTab = events.filter(event => event.matchDate === today);
        break;
      case validationStrings.UPCOMING_FILTER:
        filteredByTab = events.filter(event => event.matchDate > today);
        break;
      case validationStrings.MY_EVENTS_FILTER:
        filteredByTab = events.filter(
          event => event.organizerId && event.organizerId === currentOrganizerId
        );
        break;
      case validationStrings.ALL_FILTER:
      default:
        filteredByTab = events;
    }

    return filteredByTab;
  }, [events, activeTab, currentOrganizerId]);

  const handleDelete = useCallback((id: string) => {
    if (!isMountedRef.current) return;

    Alert.alert(
      validationStrings.DELETE_CONFIRMATION,
      validationStrings.DELETE_MSG,
      [
        { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
        { text: validationStrings.DELETE, style: validationStrings.ALERT_STYLE_DESTRUCTIVE, onPress: () => deleteEvent(id) },
      ]
    );
  }, [deleteEvent]);

  const handleNavigateToCreate = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_CREATE_EVENT, { role });
  }, [navigation, role]);

  const handleNavigateToDetails = useCallback((event: Event) => {
    navigation.navigate(validationStrings.SCREEN_EVENT_DETAILS, { event, role });
  }, [navigation, role]);

  const handleNavigateToEdit = useCallback((event: Event, stopPropagation: () => void) => {
    stopPropagation();
    navigation.navigate(validationStrings.SCREEN_EDIT_EVENT, { event });
  }, [navigation]);

  const handleDeleteWithStopPropagation = useCallback((id: string, stopPropagation: () => void) => {
    stopPropagation();
    handleDelete(id);
  }, [handleDelete]);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
  }, []);

  const canManageEvent = useCallback((event: Event) => {
    const isMyEvent = event.organizerId === currentOrganizerId;
    return (role === validationStrings.ORGANIZER && isMyEvent) || role === validationStrings.ADMIN;
  }, [role, currentOrganizerId]);

  const isMyEvent = useCallback((event: Event) => {
    return event.organizerId === currentOrganizerId;
  }, [currentOrganizerId]);

  const getStatusStyle = useCallback((status: string) => {
    switch (status) {
      case validationStrings.UPCOMING:
        return { backgroundColor: Colors.COLOR_GREEN };
      case validationStrings.ONGOING:
        return { backgroundColor: Colors.COLOR_ORANGE };
      case validationStrings.COMPLETED:
        return { backgroundColor: Colors.iconSecondary };
      default:
        return { backgroundColor: Colors.iconSecondary };
    }
  }, []);

  const getEmptyStateTitle = useCallback(() => {
    switch (activeTab) {
      case validationStrings.TODAY_FILTER:
        return validationStrings.NO_EVENTS_TODAY;
      case validationStrings.UPCOMING_FILTER:
        return validationStrings.NO_UPCOMING_EVENTS;
      case validationStrings.MY_EVENTS_FILTER:
        return validationStrings.NO_EVENTS_CREATED_YET;
      case validationStrings.ALL_FILTER:
      default:
        return validationStrings.NO_EVENTS_FOUND;
    }
  }, [activeTab]);

  const getEmptyStateSubtitle = useCallback(() => {
    if (activeTab === validationStrings.MY_EVENTS_FILTER) {
      return validationStrings.TAP_PLUS_CREATE_FIRST_EVENT;
    }
    if (role === validationStrings.ADMIN || role === validationStrings.ORGANIZER) {
      return validationStrings.TAP_PLUS_CREATE_EVENT;
    }
    return validationStrings.CHECK_BACK_LATER;
  }, [activeTab, role]);

  const shouldShowMyEventsTab = role === validationStrings.ORGANIZER || role === validationStrings.ADMIN;
  const filteredEvents = getFilteredEvents();

  return {
    activeTab,
    filteredEvents,
    role,
    currentOrganizerId,
    shouldShowMyEventsTab,

    handleTabChange,
    handleDelete,
    handleNavigateToCreate,
    handleNavigateToDetails,
    handleNavigateToEdit,
    handleDeleteWithStopPropagation,
    canManageEvent,
    isMyEvent,
    getStatusStyle,
    getEmptyStateTitle,
    getEmptyStateSubtitle,
  };
};