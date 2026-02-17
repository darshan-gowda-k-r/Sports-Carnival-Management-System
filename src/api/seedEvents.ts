import { defaultEvents } from '../constants/defaultEvents';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validationStrings } from '../constants/validationStrings';

const EVENTS_KEY = 'EVENTS_DATA';
const EVENTS_INITIALIZED_KEY = 'EVENTS_INITIALIZED';

export const seedEvents = async () => {
  const initialized = await AsyncStorage.getItem(EVENTS_INITIALIZED_KEY);
  
  if (!initialized) {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(defaultEvents));
    await AsyncStorage.setItem(EVENTS_INITIALIZED_KEY, validationStrings.TRUE);
  }
};