import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { registrationApiService } from '../api/registrationApiService';
import { useAuth } from '../context/authContext';
import { Event, PlayFormat } from '../models/event';
import Colors from '../constants/colors';
import { headerStrings, validationStrings } from '../constants/validationStrings';

export const useIndividualRegistrationViewModel = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { event }: { event: Event } = route.params;
  const { user } = useAuth();
  const isMountedRef = useRef(true);

  const [selectedFormat, setSelectedFormat] = useState<PlayFormat | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleFormatSelect = useCallback((format: PlayFormat, isFull: boolean) => {
    if (!isFull) {
      setSelectedFormat(format);
    }
  }, []);

  const handleRegister = useCallback(async () => {
    if (!isMountedRef.current) return;

    if (!selectedFormat) {
      Alert.alert(validationStrings.ERROR, validationStrings.SELECT_FORMAT);
      return;
    }

    if (!user) {
      Alert.alert(validationStrings.ERROR, validationStrings.LOGIN_FIRST);
      return;
    }

    if (!user.gender) {
      Alert.alert(validationStrings.ERROR, validationStrings.GENDER_UPDATE);
      return;
    }

    setLoading(true);

    try {
      await registrationApiService.createRegistration(
        event.id,
        user.email,
        user.name,
        user.gender,
        selectedFormat
      );

      Alert.alert(
        validationStrings.SUCCESS_EXCLAIM,
        validationStrings.REGISTRATION_SUBMITTED_SUCCESS,
        [{ text: validationStrings.OK, onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert(validationStrings.ERROR, error.message || validationStrings.REGISTER_FAIL);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [selectedFormat, user, event.id, navigation]);

  const getAvailableFormats = useCallback(() => {
    return event.availableFormats.filter(f => f.isAvailable);
  }, [event.availableFormats]);

  const getSpotsLeft = useCallback((maxTeams: number, registeredTeams: number) => {
    return maxTeams - registeredTeams;
  }, []);

  const isFormatFull = useCallback((maxTeams: number, registeredTeams: number) => {
    return getSpotsLeft(maxTeams, registeredTeams) <= 0;
  }, [getSpotsLeft]);

  const getFormatDescription = useCallback((format: PlayFormat) => {
    return format === validationStrings.FORMAT_1V1
      ? validationStrings.INDIVIDUAL_COMPETITION
      : validationStrings.TEAMS_OF_TWO_ORGANIZER;
  }, []);

  const availableFormats = getAvailableFormats();

  return {
    event,
    user,
    selectedFormat,
    loading,
    availableFormats,

    handleFormatSelect,
    handleRegister,

    getSpotsLeft,
    isFormatFull,
    getFormatDescription,
  };
};