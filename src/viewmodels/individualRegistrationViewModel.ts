import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { registrationApiService } from '../api/registrationApiService';
import { eventApiService } from '../api/eventApiService';
import { useAuth } from '../context/authContext';
import { Event, PlayFormat, FormatAvailability } from '../models/event';
import { Gender } from '../models/user';
import { validationStrings } from '../constants/validationStrings';

export const useIndividualRegistrationViewModel = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { event }: { event: Event } = route.params;
  const { user } = useAuth();
  const isMountedRef = useRef(true);

  const [selectedFormat, setSelectedFormat] = useState<PlayFormat | null>(null);
  const [loading, setLoading] = useState(false);

  const getAvailableFormats = useCallback(() => {
    return event.availableFormats.filter(f => f.isAvailable);
  }, [event.availableFormats]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const availableFormats = getAvailableFormats();
    if (availableFormats.length === 1) {
      setSelectedFormat(availableFormats[0].format);
    }
  }, [getAvailableFormats]);

  const hasMultipleFormats = getAvailableFormats().length > 1;

  const handleFormatSelect = useCallback((format: PlayFormat, isFull: boolean) => {
    if (!isFull) {
      setSelectedFormat(format);
    }
  }, []);

  const updateEventRegistrationCounts = useCallback(async (
    eventId: string,
    format: PlayFormat,
    gender: Gender
  ) => {
    try {
      const updatedEvent = { ...event };
      const formatIndex = updatedEvent.availableFormats.findIndex(f => f.format === format);

      if (formatIndex !== -1) {
        if (gender === Gender.MALE) {
          updatedEvent.availableFormats[formatIndex].registeredMaleCount += 1;
        } else {
          updatedEvent.availableFormats[formatIndex].registeredFemaleCount += 1;
        }

        await eventApiService.updateEvent(updatedEvent);
      }
    } catch (error) {
      console.error(validationStrings.ERROR_TEAM_UPDATE, error);
    }
  }, [event]);

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

    const selectedFormatData = event.availableFormats.find(f => f.format === selectedFormat);
    if (selectedFormatData) {
      const hasSpots = user.gender === Gender.MALE
        ? selectedFormatData.registeredMaleCount < selectedFormatData.maxMaleParticipants
        : selectedFormatData.registeredFemaleCount < selectedFormatData.maxFemaleParticipants;

      if (!hasSpots) {
        Alert.alert(
          validationStrings.ERROR,
          validationStrings.NO_SPOTS_FOR_GENDER(user.gender)
        );
        return;
      }
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

      await updateEventRegistrationCounts(event.id, selectedFormat, user.gender);

      const organizerLabel = event.organizerId ? validationStrings.EVENT_ORGANIZER : validationStrings.ADMIN;
      Alert.alert(
        validationStrings.SUCCESS_EXCLAIM,
        validationStrings.REGISTRATION_SUBMITTED_DETAIL(organizerLabel),
        [{
          text: validationStrings.OK,
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: validationStrings.SCREEN_MY_REGISTRATIONS }],
            });
          }
        }]
      );
    } catch (error: any) {
      Alert.alert(validationStrings.ERROR, error.message || validationStrings.REGISTER_FAIL);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [selectedFormat, user, event, navigation, updateEventRegistrationCounts]);

  const getSpotsLeftForUser = useCallback((format: FormatAvailability): number => {
    if (!user?.gender) return 0;

    return user.gender === Gender.MALE
      ? format.maxMaleParticipants - format.registeredMaleCount
      : format.maxFemaleParticipants - format.registeredFemaleCount;
  }, [user?.gender]);

  const isFormatFullForUser = useCallback((format: FormatAvailability): boolean => {
    if (!user?.gender) return true;

    return user.gender === Gender.MALE
      ? format.registeredMaleCount >= format.maxMaleParticipants
      : format.registeredFemaleCount >= format.maxFemaleParticipants;
  }, [user?.gender]);

  const getFormatDescription = useCallback((format: PlayFormat) => {
    if (format === validationStrings.FORMAT_1V1) {
      if (event.allowsMixedGender) {
        return validationStrings.INDIVIDUAL_COMPETITION || validationStrings.INDIVIDUAL_PLAY_ANY_GENDER;
      }
      return validationStrings.INDIVIDUAL_COMPETITION || validationStrings.INDIVIDUAL_SAME_GENDER;
    }
    return validationStrings.TEAMS_OF_TWO_ORGANIZER || validationStrings.TEAMS_TWO_ADMIN_SAME_GENDER;
  }, [event.allowsMixedGender]);

  const availableFormats = getAvailableFormats();

  return {
    event,
    user,
    selectedFormat,
    loading,
    availableFormats,
    hasMultipleFormats,

    handleFormatSelect,
    handleRegister,

    getSpotsLeft: getSpotsLeftForUser,
    isFormatFull: isFormatFullForUser,
    getFormatDescription,
  };
};