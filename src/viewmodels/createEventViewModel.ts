import { useState, useCallback, useRef, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEvents } from '../context/eventContext';
import { useAuth } from '../context/authContext';
import {
  PlayFormat,
  validateMatchDate,
  allows2v2Format,
  allowsMixedGender,
  isChess
} from '../models/event';
import { validationStrings } from '../constants/validationStrings';

export const useCreateEventViewModel = (role: string) => {
  const navigation = useNavigation<any>();
  const { createEvent } = useEvents();
  const { user } = useAuth();
  const isMountedRef = useRef(true);

  const currentOrganizerId = user?.email || user?.id;

  const [title, setTitle] = useState('');
  const [sportType, setSportType] = useState('');
  const [description, setDescription] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState<Date | null>(null);
  const [matchDate, setMatchDate] = useState<Date | null>(null);
  const [location, setLocation] = useState('');

  const [format1v1Available, setFormat1v1Available] = useState(true);
  const [format2v2Available, setFormat2v2Available] = useState(false);

  const [maxMaleParticipants1v1, setMaxMaleParticipants1v1] = useState('');
  const [maxFemaleParticipants1v1, setMaxFemaleParticipants1v1] = useState('');
  const [maxMaleParticipants2v2, setMaxMaleParticipants2v2] = useState('');
  const [maxFemaleParticipants2v2, setMaxFemaleParticipants2v2] = useState('');

  const [maxTotalParticipants, setMaxTotalParticipants] = useState('');

  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showMatchDatePicker, setShowMatchDatePicker] = useState(false);
  const [tempDeadline, setTempDeadline] = useState<Date>(new Date());
  const [tempMatchDate, setTempMatchDate] = useState<Date>(new Date());

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!sportType) return;

    const isFoosball = allows2v2Format(sportType);
    const isChessGame = isChess(sportType);

    if (isFoosball) {
      setFormat1v1Available(false);
      setFormat2v2Available(true);
      setMaxMaleParticipants1v1('');
      setMaxFemaleParticipants1v1('');
      setMaxTotalParticipants('');
    } else if (isChessGame) {
      setFormat1v1Available(true);
      setFormat2v2Available(false);
      setMaxMaleParticipants1v1('');
      setMaxFemaleParticipants1v1('');
      setMaxMaleParticipants2v2('');
      setMaxFemaleParticipants2v2('');
    } else {
      setFormat1v1Available(true);
      setFormat2v2Available(false);
      setMaxMaleParticipants2v2('');
      setMaxFemaleParticipants2v2('');
      setMaxTotalParticipants('');
    }
  }, [sportType]);

  const formatDate = useCallback((date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const adjustMatchDateIfNeeded = useCallback((deadline: Date) => {
    if (matchDate && deadline >= matchDate) {
      const newMatchDate = new Date(deadline);
      newMatchDate.setDate(newMatchDate.getDate() + 2);
      setMatchDate(newMatchDate);
      setTempMatchDate(newMatchDate);
    }
  }, [matchDate]);

  const onDeadlineChange = useCallback((event: any, selectedDate?: Date) => {
    if (!selectedDate) return;
    setTempDeadline(selectedDate);

    if (Platform.OS === validationStrings.PLATFORM_ANDROID) {
      setShowDeadlinePicker(false);
      if (event.type === validationStrings.EVENT_TYPE_SET) {
        setRegistrationDeadline(selectedDate);
        adjustMatchDateIfNeeded(selectedDate);
      }
    }
  }, [adjustMatchDateIfNeeded]);

  const handleDeadlineConfirm = useCallback(() => {
    setRegistrationDeadline(tempDeadline);
    setShowDeadlinePicker(false);
    adjustMatchDateIfNeeded(tempDeadline);
  }, [tempDeadline, adjustMatchDateIfNeeded]);

  const handleDeadlineCancel = useCallback(() => {
    setShowDeadlinePicker(false);
  }, []);

  const handleShowDeadlinePicker = useCallback(() => {
    setShowDeadlinePicker(true);
  }, []);

  const onMatchDateChange = useCallback((event: any, selectedDate?: Date) => {
    if (!selectedDate) return;
    setTempMatchDate(selectedDate);

    if (Platform.OS === validationStrings.PLATFORM_ANDROID) {
      setShowMatchDatePicker(false);
      if (event.type === validationStrings.EVENT_TYPE_SET) {
        setMatchDate(selectedDate);
      }
    }
  }, []);

  const handleMatchDateConfirm = useCallback(() => {
    setMatchDate(tempMatchDate);
    setShowMatchDatePicker(false);
  }, [tempMatchDate]);

  const handleMatchDateCancel = useCallback(() => {
    setShowMatchDatePicker(false);
  }, []);

  const handleShowMatchDatePicker = useCallback(() => {
    setShowMatchDatePicker(true);
  }, []);

  const toggleFormat1v1 = useCallback(() => {
    if (!allows2v2Format(sportType)) {
      setFormat1v1Available(prev => !prev);
    }
  }, [sportType]);

  const toggleFormat2v2 = useCallback(() => {
    if (allows2v2Format(sportType)) {
      setFormat2v2Available(prev => !prev);
    }
  }, [sportType]);

  const validateForm = useCallback(() => {
    if (!title.trim()) {
      Alert.alert(validationStrings.ERROR, validationStrings.TITLE_VALIDATION);
      return false;
    }
    if (!sportType.trim()) {
      Alert.alert(validationStrings.ERROR, validationStrings.SPORT_TYPE);
      return false;
    }
    if (!registrationDeadline) {
      Alert.alert(validationStrings.ERROR, validationStrings.DEADLINE);
      return false;
    }
    if (!matchDate) {
      Alert.alert(validationStrings.ERROR, validationStrings.MATCH_DATE);
      return false;
    }

    const validation = validateMatchDate(registrationDeadline, matchDate);
    if (!validation.valid) {
      Alert.alert(validationStrings.ERROR, validation.message || validationStrings.MATCH_INVALID);
      return false;
    }

    if (!location.trim()) {
      Alert.alert(validationStrings.ERROR, validationStrings.LOCATION);
      return false;
    }

    const isFoosball = allows2v2Format(sportType);
    const isChessGame = isChess(sportType);

    if (isChessGame) {
      if (!format1v1Available) {
        Alert.alert(validationStrings.ERROR, validationStrings.CHESS_1V1_REQUIRED);
        return false;
      }
      if (!maxTotalParticipants || Number(maxTotalParticipants) <= 0) {
        Alert.alert(validationStrings.ERROR, validationStrings.CHESS_VALID_MAX_PARTICIPANTS);
        return false;
      }
    } else if (isFoosball) {
      if (!format2v2Available) {
        Alert.alert(validationStrings.ERROR, validationStrings.FOOSBALL_FORMAT);
        return false;
      }
      if (!maxMaleParticipants2v2 || Number(maxMaleParticipants2v2) <= 0) {
        Alert.alert(validationStrings.ERROR, validationStrings.MAX_MALE_2V2);
        return false;
      }
      if (!maxFemaleParticipants2v2 || Number(maxFemaleParticipants2v2) <= 0) {
        Alert.alert(validationStrings.ERROR, validationStrings.MAX_FEMALE_2V2);
        return false;
      }
      if (Number(maxMaleParticipants2v2) % 2 !== 0) {
        Alert.alert(validationStrings.ERROR, validationStrings.EVEN_MALE_2V2);
        return false;
      }
      if (Number(maxFemaleParticipants2v2) % 2 !== 0) {
        Alert.alert(validationStrings.ERROR, validationStrings.EVEN_FEMALE_2V2);
        return false;
      }
    } else {
      if (!format1v1Available) {
        Alert.alert(validationStrings.ERROR, validationStrings.OTHER_SPORT_FORMAT);
        return false;
      }
      if (!maxMaleParticipants1v1 || Number(maxMaleParticipants1v1) <= 0) {
        Alert.alert(validationStrings.ERROR, validationStrings.MAX_MALE_1V1);
        return false;
      }
      if (!maxFemaleParticipants1v1 || Number(maxFemaleParticipants1v1) <= 0) {
        Alert.alert(validationStrings.ERROR, validationStrings.MAX_FEMALE_1V1);
        return false;
      }
    }

    if (!currentOrganizerId) {
      Alert.alert(validationStrings.ERROR, validationStrings.LOGIN_REQUIRED);
      return false;
    }

    return true;
  }, [
    title,
    sportType,
    registrationDeadline,
    matchDate,
    location,
    format1v1Available,
    format2v2Available,
    maxMaleParticipants1v1,
    maxFemaleParticipants1v1,
    maxMaleParticipants2v2,
    maxFemaleParticipants2v2,
    maxTotalParticipants,
    currentOrganizerId,
  ]);

  const handleCreate = useCallback(async () => {
    if (!validateForm()) return;

    const isFoosball = allows2v2Format(sportType);
    const isChessGame = isChess(sportType);
    const isMixedGender = allowsMixedGender(sportType);
    const availableFormats = [];

    if (isChessGame && format1v1Available) {
      const total = Number(maxTotalParticipants);
      const half = Math.floor(total / 2);

      availableFormats.push({
        format: validationStrings.FORMAT_1V1 as PlayFormat,
        isAvailable: true,
        maxMaleParticipants: half,
        maxFemaleParticipants: total - half,
        registeredMaleCount: 0,
        registeredFemaleCount: 0,
      });
    } else if (format1v1Available && !isFoosball) {
      availableFormats.push({
        format: validationStrings.FORMAT_1V1 as PlayFormat,
        isAvailable: true,
        maxMaleParticipants: Number(maxMaleParticipants1v1),
        maxFemaleParticipants: Number(maxFemaleParticipants1v1),
        registeredMaleCount: 0,
        registeredFemaleCount: 0,
      });
    }

    if (format2v2Available && isFoosball) {
      availableFormats.push({
        format: validationStrings.FORMAT_2V2 as PlayFormat,
        isAvailable: true,
        maxMaleParticipants: Number(maxMaleParticipants2v2),
        maxFemaleParticipants: Number(maxFemaleParticipants2v2),
        registeredMaleCount: 0,
        registeredFemaleCount: 0,
      });
    }

    try {
      await createEvent({
        title: title.trim(),
        sportType: sportType.trim(),
        description: description.trim(),
        registrationDeadline: registrationDeadline!.toISOString().split(validationStrings.DATE_SEPARATOR)[0],
        matchDate: matchDate!.toISOString().split(validationStrings.DATE_SEPARATOR)[0],
        location: location.trim(),
        status: validationStrings.UPCOMING,
        availableFormats,
        allowsMixedGender: isMixedGender,
        organizerId: currentOrganizerId!,
        createdAt: new Date().toISOString(),
      });

      Alert.alert(validationStrings.SUCCESS, validationStrings.EVENT_CREATED_SUCCESS, [
        {
          text: validationStrings.OK,
          onPress: () => {
            if (role === validationStrings.ORGANIZER) {
              navigation.navigate(validationStrings.SCREEN_EVENT_LIST, { role, filter: validationStrings.MY_EVENTS_FILTER });
            } else {
              navigation.goBack();
            }
          },
        },
      ]);
    } catch (err) {
      console.error(validationStrings.FAILED_TO_CREATE_EVENT, err);
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_CREATE);
    }
  }, [
    validateForm,
    sportType,
    format1v1Available,
    format2v2Available,
    maxMaleParticipants1v1,
    maxFemaleParticipants1v1,
    maxMaleParticipants2v2,
    maxFemaleParticipants2v2,
    maxTotalParticipants,
    title,
    description,
    registrationDeadline,
    matchDate,
    location,
    currentOrganizerId,
    createEvent,
    role,
    navigation,
  ]);

  return {
    title,
    sportType,
    description,
    registrationDeadline,
    matchDate,
    showDeadlinePicker,
    showMatchDatePicker,
    tempDeadline,
    tempMatchDate,
    location,
    format1v1Available,
    format2v2Available,
    maxMaleParticipants1v1,
    maxFemaleParticipants1v1,
    maxMaleParticipants2v2,
    maxFemaleParticipants2v2,
    maxTotalParticipants,

    setTitle,
    setSportType,
    setDescription,
    setLocation,
    setMaxMaleParticipants1v1,
    setMaxFemaleParticipants1v1,
    setMaxMaleParticipants2v2,
    setMaxFemaleParticipants2v2,
    setMaxTotalParticipants,

    formatDate,
    onDeadlineChange,
    handleDeadlineConfirm,
    handleDeadlineCancel,
    handleShowDeadlinePicker,
    onMatchDateChange,
    handleMatchDateConfirm,
    handleMatchDateCancel,
    handleShowMatchDatePicker,
    toggleFormat1v1,
    toggleFormat2v2,
    handleCreate,
  };
};