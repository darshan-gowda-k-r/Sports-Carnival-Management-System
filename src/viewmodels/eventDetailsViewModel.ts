import { useState, useEffect, useCallback, useRef } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { registrationApiService } from '../api/registrationApiService';
import { teamApiService } from '../api/teamApiService';
import { Gender, UserRole } from '../models/user';
import { useAuth } from '../context/authContext';
import { Event } from '../models/event';
import { RegistrationStatus } from '../models/participantRegistration';
import Colors from '../constants/colors';
import { validationStrings } from '../constants/validationStrings';

export const useEventDetailsViewModel = () => {
  type ParticipantStatus = 'in_team' | 'approved' | 'pending' | 'rejected' | 'not_registered';
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { event, role }: { event: Event; role: UserRole } = route.params;
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
    if (role === UserRole.PARTICIPANT && user) {
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

  const getUserStatus = useCallback((): ParticipantStatus => {
    if (userTeams.length > 0) return 'in_team';

    if (userRegistrations.some(r => r.status === RegistrationStatus.APPROVED)) return 'approved';
    if (userRegistrations.some(r => r.status === RegistrationStatus.PENDING)) return 'pending';
    if (userRegistrations.some(r => r.status === RegistrationStatus.REJECTED)) return 'rejected';

    return 'not_registered';
  }, [userRegistrations, userTeams]);

  const getStatusStyle = useCallback((status: string) => {
    switch (status) {
      case 'UPCOMING':
        return { backgroundColor: Colors.COLOR_GREEN };
      case 'ONGOING':
        return { backgroundColor: Colors.COLOR_ORANGE };
      case 'COMPLETED':
        return { backgroundColor: Colors.iconSecondary };
      default:
        return { backgroundColor: Colors.iconSecondary };
    }
  }, []);

  const canUserRegister = useCallback((): boolean => {
    if (!user?.gender) return true;

    return event.availableFormats.some(format => {
      if (!format.isAvailable) return false;

      if (user.gender === Gender.MALE) {
        return format.registeredMaleCount < format.maxMaleParticipants;
      }

      return format.registeredFemaleCount < format.maxFemaleParticipants;
    });
  }, [event.availableFormats, user?.gender]);

  return {
    event,
    role,
    user,
    userRegistrations,
    userTeams,
    loading,
    navigateToRegistration,
    navigateToMyTeams,
    navigateToMyRegistrations,
    navigateToFixtureCreation,
    getUserStatus,
    getStatusStyle,
    canUserRegister,
  };
};