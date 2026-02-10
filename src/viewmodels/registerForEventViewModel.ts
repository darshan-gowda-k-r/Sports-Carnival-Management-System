import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { teamApiService } from '../api/teamApiService';
import { ApiService } from '../api/apiService';
import { useAuthViewModel } from './authViewModel';
import { Event, PlayFormat } from '../models/event';
import { Gender } from '../models/user';
import { TeamMember } from '../models/team';
import { validationStrings, headerStrings } from '../constants/validationStrings';

interface FormatInfo {
  format: PlayFormat;
  maxTeams: number;
  registeredTeams: number;
  isAvailable: boolean;
  spotsLeft: number;
  isFull: boolean;
}

export const useRegisterForEventViewModel = (event: Event) => {
  const navigation = useNavigation<any>();
  const { user } = useAuthViewModel();

  const [selectedFormat, setSelectedFormat] = useState<PlayFormat | null>(null);
  const [teammateName, setTeammateName] = useState('');
  const [teammateEmail, setTeammateEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validateRegistration = useCallback((): boolean => {
    if (!selectedFormat) {
      Alert.alert(validationStrings.ERROR, validationStrings.SELECT_FORMAT);
      return false;
    }

    if (!user) {
      Alert.alert(validationStrings.ERROR, validationStrings.LOGIN_FIRST);
      return false;
    }

    if (!user.gender) {
      Alert.alert(validationStrings.ERROR, validationStrings.GENDER_UPDATE);
      return false;
    }

    return true;
  }, [selectedFormat, user]);

  const validateTeammate = useCallback((): boolean => {
    if (!teammateName.trim()) {
      Alert.alert(validationStrings.ERROR, validationStrings.ENTER_TEAMMATE_NAME);
      return false;
    }

    if (!teammateEmail.trim()) {
      Alert.alert(validationStrings.ERROR, validationStrings.ENTER_TEAMMATE_EMAIL);
      return false;
    }

    return true;
  }, [teammateName, teammateEmail]);

  const handleRegister = useCallback(async () => {
    if (!validateRegistration()) {
      return;
    }

    setLoading(true);

    try {
      const members: TeamMember[] = [
        {
          userId: user!.email,
          name: user!.name,
          gender: user!.gender!,
        },
      ];

      if (selectedFormat === '2v2') {
        if (!validateTeammate()) {
          setLoading(false);
          return;
        }

        const teammateUser = await ApiService.getUserByEmail(teammateEmail);
        if (!teammateUser) {
          Alert.alert(validationStrings.ERROR, validationStrings.TEAMMATE_NOT_FOUND);
          setLoading(false);
          return;
        }

        if (!teammateUser.gender) {
          Alert.alert(validationStrings.ERROR, validationStrings.TEAMMATE_GENDER_MUST_BE_THERE);
          setLoading(false);
          return;
        }

        if (teammateUser.gender !== user!.gender) {
          Alert.alert(validationStrings.ERROR, validationStrings.SAME_GENDER_TEAMMATE);
          setLoading(false);
          return;
        }

        members.push({
          userId: teammateUser.email,
          name: teammateUser.name,
          gender: teammateUser.gender,
        });
      }

      await teamApiService.createTeam(
        event.id,
        selectedFormat!,
        members,
        user!.email
      );

      Alert.alert(
        validationStrings.SUCCESS,
        validationStrings.REVIEW_PENDING,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert(validationStrings.ERROR, error.message || validationStrings.REGISTER_FAIL);
    } finally {
      setLoading(false);
    }
  }, [validateRegistration, validateTeammate, selectedFormat, user, event.id, teammateEmail, navigation]);

  const getAvailableFormats = useCallback((): FormatInfo[] => {
    return event.availableFormats
      .filter(f => f.isAvailable)
      .map(format => ({
        ...format,
        spotsLeft: format.maxTeams - format.registeredTeams,
        isFull: (format.maxTeams - format.registeredTeams) <= 0,
      }));
  }, [event.availableFormats]);

  const getFormatDescription = useCallback((format: PlayFormat): string => {
    return format === '1v1' ? 'Individual' : validationStrings.PLAYER_COUNT;
  }, []);

  const isFormatSelected = useCallback((format: PlayFormat): boolean => {
    return selectedFormat === format;
  }, [selectedFormat]);

  const canSubmit = useCallback((): boolean => {
    return selectedFormat !== null && !loading;
  }, [selectedFormat, loading]);

  const shouldShowTeammateForm = useCallback((): boolean => {
    return selectedFormat === '2v2';
  }, [selectedFormat]);

  return {
    selectedFormat,
    teammateName,
    teammateEmail,
    loading,
    user,
    event,

    setSelectedFormat,
    setTeammateName,
    setTeammateEmail,

    handleRegister,

    availableFormats: getAvailableFormats(),

    getFormatDescription,
    isFormatSelected,
    canSubmit,
    shouldShowTeammateForm,
  };
};

export type { FormatInfo };