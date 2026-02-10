import { useState, useEffect, useCallback, useRef } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { registrationApiService } from '../api/registrationApiService';
import { teamApiService } from '../api/teamApiService';
import { useAuth } from '../context/authContext';
import { Event } from '../models/event';
import { RegistrationStatus } from '../models/participantRegistration';
import Colors from '../constants/colors';
import { headerStrings, validationStrings } from '../constants/validationStrings';

export const useEventDetailsViewModel = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { event, role }: { event: Event; role: string } = route.params;
  const isMountedRef = useRef(true);

  const [userRegistrations, setUserRegistrations] = useState<any[]>([]);
  const [userTeams, setUserTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadUserStatus = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      setLoading(true);
      const userEmail = user?.email || user?.id;

      if (!userEmail) {
        if (isMountedRef.current) {
          setLoading(false);
        }
        return;
      }

      const allRegistrations = await registrationApiService.getAllRegistrations();
      const myRegistrations = allRegistrations.filter(
        reg => reg.participantEmail === userEmail && reg.eventId === event.id
      );

      const allTeams = await teamApiService.getAllTeams();
      const myTeams = allTeams.filter(
        team => team.eventId === event.id &&
                team.members.some(member => member.userId === userEmail)
      );

      if (isMountedRef.current) {
        setUserRegistrations(myRegistrations);
        setUserTeams(myTeams);
      }
    } catch (error) {
      console.error(validationStrings.FAILED_TO_LOAD_USER_STATUS, error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [event.id, user]);

  useEffect(() => {
    if (role === validationStrings.PART && user) {
      loadUserStatus();
    } else {
      setLoading(false);
    }
  }, [role, user, loadUserStatus]);

  const navigateToRegistration = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_INDIVIDUAL_REGISTRATION, {
      eventId: event.id,
      event: event
    });
  }, [navigation, event]);

  const navigateToMyTeams = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_MY_TEAMS, { role: validationStrings.PART });
  }, [navigation]);

  const navigateToMyRegistrations = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_MY_REGISTRATIONS);
  }, [navigation]);

  const navigateToFixtureCreation = useCallback(() => {
    navigation.navigate(validationStrings.SCREEN_FIXTURE_CREATION, {
      event: event,
      eventId: event.id
    });
  }, [navigation, event]);

  const getUserStatus = useCallback(() => {
    if (userTeams.length > 0) {
      return validationStrings.STATUS_IN_TEAM;
    }

    const approvedRegs = userRegistrations.filter(r => r.status === RegistrationStatus.APPROVED);
    const pendingRegs = userRegistrations.filter(r => r.status === RegistrationStatus.PENDING);
    const rejectedRegs = userRegistrations.filter(r => r.status === RegistrationStatus.REJECTED);

    if (approvedRegs.length > 0) return validationStrings.STATUS_APPROVED_LOWERCASE;
    if (pendingRegs.length > 0) return validationStrings.STATUS_PENDING_LOWERCASE;
    if (rejectedRegs.length > 0) return validationStrings.STATUS_REJECTED_LOWERCASE;

    return validationStrings.STATUS_NOT_REGISTERED;
  }, [userRegistrations, userTeams]);

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

  return {
    event,
    role,
    userRegistrations,
    userTeams,
    loading,
    navigateToRegistration,
    navigateToMyTeams,
    navigateToMyRegistrations,
    navigateToFixtureCreation,
    getUserStatus,
    getStatusStyle,
  };
};