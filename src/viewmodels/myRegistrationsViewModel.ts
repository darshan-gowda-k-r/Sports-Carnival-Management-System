import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { registrationApiService } from '../api/registrationApiService';
import { eventApiService } from '../api/eventApiService';
import { useAuthViewModel } from './authViewModel';
import { ParticipantRegistration, RegistrationStatus } from '../models/participantRegistration';
import { Event } from '../models/event';
import Colors from '../constants/colors';
import { headerStrings, validationStrings } from '../constants/validationStrings';


interface RegistrationWithEvent extends ParticipantRegistration {
  eventDetails?: Event;
}

export const useMyRegistrationsViewModel = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthViewModel();

  const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRegistrations = useCallback(async () => {
    if (!user?.email) return;

    try {
      const userRegs = await registrationApiService.getRegistrationsByUser(user.email);

      const regsWithEvents = await Promise.all(
        userRegs.map(async (reg) => {
          const event = await eventApiService.getEventById(reg.eventId);
          return { ...reg, eventDetails: event };
        })
      );

      setRegistrations(regsWithEvents);
    } catch (error) {
      console.error(validationStrings.FAILED_TO_LOAD_REGISTRATIONS, error);
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_LOAD_YOUR_REGISTRATIONS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadRegistrations();
    }, [loadRegistrations])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadRegistrations();
  }, [loadRegistrations]);

  const handleCancelRegistration = useCallback((registration: RegistrationWithEvent) => {
    Alert.alert(
      validationStrings.CANCEL_REGISTRATION,
      validationStrings.CANCEL_REGISTRATION_MESSAGE(registration.eventDetails?.title || validationStrings.THIS_EVENT),
      [
        { text: validationStrings.NO, style: validationStrings.ALERT_STYLE_CANCEL },
        {
          text: validationStrings.YES_CANCEL,
          style: validationStrings.ALERT_STYLE_DESTRUCTIVE,
          onPress: async () => {
            try {
              await registrationApiService.deleteRegistration(registration.id);

              if (registration.status === RegistrationStatus.APPROVED) {
                await eventApiService.unregisterTeam(
                  registration.eventId,
                  registration.format
                );
              }

              Alert.alert(validationStrings.SUCCESS, validationStrings.REGISTRATION_CANCELLED_SUCCESS);
              loadRegistrations();
            } catch (error) {
              Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_CANCEL_REGISTRATION);
            }
          },
        },
      ]
    );
  }, [loadRegistrations]);

  const navigateToEventDetails = useCallback((event: Event) => {
    navigation.navigate(validationStrings.SCREEN_EVENT_DETAILS, {
      event: event,
      role: validationStrings.PART,
    });
  }, [navigation]);

  const navigateToEventList = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_EVENT_LIST, { role: validationStrings.PART });
  }, [navigation]);

  const getStatusColor = useCallback((status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.APPROVED:
        return Colors.COLOR_GREEN;
      case RegistrationStatus.PENDING:
        return Colors.COLOR_ORANGE;
      case RegistrationStatus.REJECTED:
        return Colors.iconDelete;
      default:
        return Colors.iconSecondary;
    }
  }, []);

  const getStatusIcon = useCallback((status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.APPROVED:
        return validationStrings.ICON_CHECK_CIRCLE;
      case RegistrationStatus.PENDING:
        return validationStrings.ICON_SCHEDULE;
      case RegistrationStatus.REJECTED:
        return validationStrings.ICON_CANCEL;
      default:
        return validationStrings.ICON_HELP;
    }
  }, []);

  const canCancelRegistration = useCallback((registration: RegistrationWithEvent) => {
    return registration.status === RegistrationStatus.PENDING;
  }, []);

  const getStats = useCallback(() => {
    return {
      total: registrations.length,
      pending: registrations.filter(r => r.status === RegistrationStatus.PENDING).length,
      approved: registrations.filter(r => r.status === RegistrationStatus.APPROVED).length,
      rejected: registrations.filter(r => r.status === RegistrationStatus.REJECTED).length,
    };
  }, [registrations]);

  return {
    registrations,
    loading,
    refreshing,

    onRefresh,
    handleCancelRegistration,
    navigateToEventDetails,
    navigateToEventList,

    getStatusColor,
    getStatusIcon,
    canCancelRegistration,
    getStats,
  };
};

export type { RegistrationWithEvent };