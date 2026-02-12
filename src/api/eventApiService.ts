import AsyncStorage from '@react-native-async-storage/async-storage';
import { Event, PlayFormat } from '../models/event';
import { validationStrings } from '../constants/validationStrings';
import { defaultEvents } from '../constants/defaultEvents';

const EVENTS_KEY = 'EVENTS_DATA';
const EVENTS_INITIALIZED_KEY = 'EVENTS_INITIALIZED';

const getStoredEvents = async (): Promise<Event[]> => {
  try {
    const data = await AsyncStorage.getItem(EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(validationStrings.ERROR_GETTING_STORED_EVENTS, error);
    return [];
  }
};

const saveEvents = async (events: Event[]) => {
  try {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error(validationStrings.ERROR_SAVING_EVENTS, error);
    throw new Error(validationStrings.FAILED_TO_SAVE_EVENTS);
  }
};

export const eventApiService = {
  getEvents: async (): Promise<Event[]> => {
    return getStoredEvents();
  },

  getEventById: async (id: string): Promise<Event | undefined> => {
    const events = await getStoredEvents();
    return events.find(e => e.id === id);
  },

  createEvent: async (event: Omit<Event, 'id'>): Promise<Event> => {
    const events = await getStoredEvents();

    const newEvent: Event = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    };

    const updated = [...events, newEvent];
    await saveEvents(updated);

    return newEvent;
  },

  updateEvent: async (updatedEvent: Event): Promise<Event> => {
    const events = await getStoredEvents();
    const updatedEvents = events.map(e =>
      e.id === updatedEvent.id ? updatedEvent : e
    );

    await saveEvents(updatedEvents);
    return updatedEvent;
  },

  deleteEvent: async (eventId: string): Promise<void> => {
    const events = await getStoredEvents();
    await saveEvents(events.filter(e => e.id !== eventId));
  },

  registerTeam: async (
    eventId: string,
    format: PlayFormat
  ): Promise<Event> => {
    const events = await getStoredEvents();
    const eventFound = events.find(e => e.id === eventId);

    if (!eventFound) {
      throw new Error(validationStrings.EVENT_NOT_EXISTS);
    }

    const selectedFormat = eventFound.availableFormats.find(
      f => f.format === format && f.isAvailable
    );

    if (!selectedFormat) {
      throw new Error(validationStrings.FORMAT_FULL);
    }

    await saveEvents(events);
    return eventFound;
  },

  unregisterTeam: async (
    eventId: string,
    format: PlayFormat
  ): Promise<Event> => {
    const events = await getStoredEvents();
    const eventFound = events.find(e => e.id === eventId);

    if (!eventFound) {
      throw new Error(validationStrings.EVENT_NOT_EXISTS);
    }

    const selectedFormat = eventFound.availableFormats.find(
      f => f.format === format
    );

    if (!selectedFormat) {
      throw new Error(validationStrings.FORMAT_NOT_FOUND);
    }

    await saveEvents(events);
    return eventFound;
  },

  isFormatFull: async (
    eventId: string,
    format: PlayFormat
  ): Promise<boolean> => {
    const event = await eventApiService.getEventById(eventId);
    if (!event) return true;

    const selectedFormat = event.availableFormats.find(
      f => f.format === format && f.isAvailable
    );

    if (!selectedFormat) return true;

    return (
      selectedFormat.registeredMaleCount >= selectedFormat.maxMaleParticipants ||
      selectedFormat.registeredFemaleCount >= selectedFormat.maxFemaleParticipants
    );
  },

  extendDeadline: async (eventId: string, newDeadline: string): Promise<Event> => {
    const events = await getStoredEvents();
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
      throw new Error(validationStrings.EVENT_NOT_EXISTS);
    }

    events[eventIndex].registrationDeadline = newDeadline;
    await saveEvents(events);
    return events[eventIndex];
  },

  getRegistrationStats: async (
    eventId: string,
    format: PlayFormat
  ): Promise<{
    maleCount: number;
    femaleCount: number;
    maleMax: number;
    femaleMax: number;
    malePercentage: number;
    femalePercentage: number;
  } | null> => {
    const event = await eventApiService.getEventById(eventId);
    if (!event) return null;

    const selectedFormat = event.availableFormats.find(
      f => f.format === format && f.isAvailable
    );

    if (!selectedFormat) return null;

    const malePercentage = selectedFormat.maxMaleParticipants > 0
      ? (selectedFormat.registeredMaleCount / selectedFormat.maxMaleParticipants) * 100
      : 0;

    const femalePercentage = selectedFormat.maxFemaleParticipants > 0
      ? (selectedFormat.registeredFemaleCount / selectedFormat.maxFemaleParticipants) * 100
      : 0;

    return {
      maleCount: selectedFormat.registeredMaleCount,
      femaleCount: selectedFormat.registeredFemaleCount,
      maleMax: selectedFormat.maxMaleParticipants,
      femaleMax: selectedFormat.maxFemaleParticipants,
      malePercentage: Math.round(malePercentage),
      femalePercentage: Math.round(femalePercentage),
    };
  },

  getAvailableSpots: async (
    eventId: string,
    format: PlayFormat
  ): Promise<{ male: number; female: number }> => {
    const event = await eventApiService.getEventById(eventId);
    if (!event) return { male: 0, female: 0 };

    const selectedFormat = event.availableFormats.find(
      f => f.format === format && f.isAvailable
    );

    if (!selectedFormat) return { male: 0, female: 0 };

    return {
      male: selectedFormat.maxMaleParticipants - selectedFormat.registeredMaleCount,
      female: selectedFormat.maxFemaleParticipants - selectedFormat.registeredFemaleCount,
    };
  },
};

export const seedEvents = async () => {
  const initialized = await AsyncStorage.getItem(EVENTS_INITIALIZED_KEY);

  if (!initialized) {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(defaultEvents));
    await AsyncStorage.setItem(EVENTS_INITIALIZED_KEY, 'true');
  }
};
