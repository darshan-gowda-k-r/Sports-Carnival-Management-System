import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEvents } from '../context/eventContext';
import { Event, PlayFormat, validateMatchDate, allows2v2Format, allowsMixedGender } from '../models/event';
import Colors from '../constants/colors';
import { headerStrings, validationStrings } from '../constants/validationStrings';

export const useEditEventViewModel = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { updateEvent } = useEvents();
  const event: Event = route.params?.event;
  const isMountedRef = useRef(true);

  const [title, setTitle] = useState(event.title);
  const [sportType, setSportType] = useState(event.sportType);
  const [description, setDescription] = useState(event.description);
  const [registrationDeadline, setRegistrationDeadline] = useState<Date>(
    new Date(event.registrationDeadline)
  );
  const [matchDate, setMatchDate] = useState<Date>(
    new Date(event.matchDate)
  );
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showMatchDatePicker, setShowMatchDatePicker] = useState(false);
  const [tempDeadline, setTempDeadline] = useState<Date>(
    new Date(event.registrationDeadline)
  );
  const [tempMatchDate, setTempMatchDate] = useState<Date>(
    new Date(event.matchDate)
  );
  const [location, setLocation] = useState(event.location);

  const format1v1 = event.availableFormats.find(f => f.format === '1v1');
  const format2v2 = event.availableFormats.find(f => f.format === '2v2');

  const [format1v1Available, setFormat1v1Available] = useState(!!format1v1?.isAvailable);
  const [format2v2Available, setFormat2v2Available] = useState(!!format2v2?.isAvailable);
  const [maxMaleParticipants1v1, setMaxMaleParticipants1v1] = useState(format1v1?.maxMaleParticipants.toString() || '');
  const [maxFemaleParticipants1v1, setMaxFemaleParticipants1v1] = useState(format1v1?.maxFemaleParticipants.toString() || '');
  const [maxMaleParticipants2v2, setMaxMaleParticipants2v2] = useState(format2v2?.maxMaleParticipants.toString() || '');
  const [maxFemaleParticipants2v2, setMaxFemaleParticipants2v2] = useState(format2v2?.maxFemaleParticipants.toString() || '');

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const formatDate = useCallback((date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const onDeadlineChange = useCallback((event: any, selectedDate?: Date) => {
    if (!isMountedRef.current) return;

    if (selectedDate) {
      setTempDeadline(selectedDate);
    }

    if (Platform.OS === validationStrings.PLATFORM_ANDROID) {
      setShowDeadlinePicker(false);
      if (event.type === validationStrings.EVENT_TYPE_SET && selectedDate) {
        setRegistrationDeadline(selectedDate);

        if (matchDate && selectedDate >= matchDate) {
          const newMatchDate = new Date(selectedDate);
          newMatchDate.setDate(newMatchDate.getDate() + 2);
          setMatchDate(newMatchDate);
          setTempMatchDate(newMatchDate);
        }
      }
    }
  }, [matchDate]);

  const handleDeadlineConfirm = useCallback(() => {
    if (!isMountedRef.current) return;
    setRegistrationDeadline(tempDeadline);
    setShowDeadlinePicker(false);

    if (matchDate && tempDeadline >= matchDate) {
      const newMatchDate = new Date(tempDeadline);
      newMatchDate.setDate(newMatchDate.getDate() + 2);
      setMatchDate(newMatchDate);
      setTempMatchDate(newMatchDate);
    }
  }, [tempDeadline, matchDate]);

  const handleDeadlineCancel = useCallback(() => {
    if (!isMountedRef.current) return;
    setShowDeadlinePicker(false);
  }, []);

  const handleShowDeadlinePicker = useCallback(() => {
    setShowDeadlinePicker(true);
  }, []);

  const onMatchDateChange = useCallback((event: any, selectedDate?: Date) => {
    if (!isMountedRef.current) return;

    if (selectedDate) {
      setTempMatchDate(selectedDate);
    }

    if (Platform.OS === validationStrings.PLATFORM_ANDROID) {
      setShowMatchDatePicker(false);
      if (event.type === validationStrings.EVENT_TYPE_SET && selectedDate) {
        setMatchDate(selectedDate);
      }
    }
  }, []);

  const handleMatchDateConfirm = useCallback(() => {
    if (!isMountedRef.current) return;
    setMatchDate(tempMatchDate);
    setShowMatchDatePicker(false);
  }, [tempMatchDate]);

  const handleMatchDateCancel = useCallback(() => {
    if (!isMountedRef.current) return;
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
      Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.TITLE_VALIDATION);
      return false;
    }
    if (!sportType.trim()) {
      Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.SPORT_TYPE);
      return false;
    }
    if (!registrationDeadline) {
      Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.DEADLINE);
      return false;
    }
    if (!matchDate) {
      Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.MATCH_DATE);
      return false;
    }

    const validation = validateMatchDate(registrationDeadline, matchDate);
    if (!validation.valid) {
      Alert.alert(validationStrings.VALIDATION_ERROR, validation.message || validationStrings.INVALID_MATCH_DATE);
      return false;
    }

    if (!location.trim()) {
      Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.LOCATION);
      return false;
    }

    const isFoosball = allows2v2Format(sportType);

    if (isFoosball) {
      if (!format2v2Available) {
        Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.FOOSBALL_FORMAT);
        return false;
      }
      if (!maxMaleParticipants2v2 || Number(maxMaleParticipants2v2) <= 0) {
        Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.MAX_MALE_2V2);
        return false;
      }
      if (!maxFemaleParticipants2v2 || Number(maxFemaleParticipants2v2) <= 0) {
        Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.MAX_FEMALE_2V2);
        return false;
      }
      if (Number(maxMaleParticipants2v2) % 2 !== 0) {
        Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.EVEN_MALE_2V2);
        return false;
      }
      if (Number(maxFemaleParticipants2v2) % 2 !== 0) {
        Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.EVEN_FEMALE_2V2);
        return false;
      }
    } else {
      if (!format1v1Available) {
        Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.OTHER_SPORT_FORMAT);
        return false;
      }
      if (!maxMaleParticipants1v1 || Number(maxMaleParticipants1v1) <= 0) {
        Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.MAX_MALE_1V1);
        return false;
      }
      if (!maxFemaleParticipants1v1 || Number(maxFemaleParticipants1v1) <= 0) {
        Alert.alert(validationStrings.VALIDATION_ERROR, validationStrings.MAX_FEMALE_1V1);
        return false;
      }
    }

    return true;
  }, [title, sportType, registrationDeadline, matchDate, location, format1v1Available, format2v2Available, maxMaleParticipants1v1, maxFemaleParticipants1v1, maxMaleParticipants2v2, maxFemaleParticipants2v2]);

  const handleUpdate = useCallback(async () => {
    if (!isMountedRef.current) return;
    if (!validateForm()) return;

    try {
      const availableFormats = [];
      const isFoosball = allows2v2Format(sportType);
      const isMixedGender = allowsMixedGender(sportType);

      if (format1v1Available && !isFoosball) {
        availableFormats.push({
          format: validationStrings.FORMAT_1V1 as PlayFormat,
          isAvailable: true,
          maxMaleParticipants: Number(maxMaleParticipants1v1),
          maxFemaleParticipants: Number(maxFemaleParticipants1v1),
          registeredMaleCount: format1v1?.registeredMaleCount || 0,
          registeredFemaleCount: format1v1?.registeredFemaleCount || 0,
        });
      }

      if (format2v2Available && isFoosball) {
        availableFormats.push({
          format: validationStrings.FORMAT_2V2 as PlayFormat,
          isAvailable: true,
          maxMaleParticipants: Number(maxMaleParticipants2v2),
          maxFemaleParticipants: Number(maxFemaleParticipants2v2),
          registeredMaleCount: format2v2?.registeredMaleCount || 0,
          registeredFemaleCount: format2v2?.registeredFemaleCount || 0,
        });
      }

      await updateEvent(event.id, {
        title: title.trim(),
        sportType: sportType.trim(),
        description: description.trim(),
        registrationDeadline: registrationDeadline.toISOString().split('T')[0],
        matchDate: matchDate.toISOString().split('T')[0],
        location: location.trim(),
        status: event.status,
        availableFormats,
        allowsMixedGender: isMixedGender,
      });

      Alert.alert(validationStrings.SUCCESS, validationStrings.EVENT_UPDATED_SUCCESS, [
        { text: validationStrings.OK, onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error(validationStrings.FAILED_TO_UPDATE_EVENT, err);
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_UPDATE_EVENT_MESSAGE);
    }
  }, [
    validateForm,
    format1v1Available,
    format2v2Available,
    maxMaleParticipants1v1,
    maxFemaleParticipants1v1,
    maxMaleParticipants2v2,
    maxFemaleParticipants2v2,
    format1v1,
    format2v2,
    title,
    sportType,
    description,
    registrationDeadline,
    matchDate,
    location,
    event.id,
    event.status,
    updateEvent,
    navigation
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
    format1v1,
    format2v2,

    setTitle,
    setSportType,
    setDescription,
    setLocation,
    setMaxMaleParticipants1v1,
    setMaxFemaleParticipants1v1,
    setMaxMaleParticipants2v2,
    setMaxFemaleParticipants2v2,

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
    handleUpdate,
  };
};