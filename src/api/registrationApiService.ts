
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParticipantRegistration, RegistrationStatus } from '../models/participantRegistration';
import { PlayFormat } from '../models/event';
import { Gender } from '../models/user';
import { validationStrings } from '../constants/validationStrings';

const REGISTRATIONS_KEY = 'PARTICIPANT_REGISTRATIONS';
const EVENTS_KEY = 'EVENTS_DATA';

const getStoredRegistrations = async (): Promise<ParticipantRegistration[]> => {
  try {
    const data = await AsyncStorage.getItem(REGISTRATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(validationStrings.GET_REGISTRATION_ERROR, error);
    return [];
  }
};

const saveRegistrations = async (registrations: ParticipantRegistration[]) => {
  try {
    await AsyncStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
  } catch (error) {
    console.error(validationStrings.SAVE_REGISTRATION_ERROR, error);
    throw new Error(validationStrings.SAVE_REGISTRATION_ERROR);
  }
};

const updateEventRegisteredTeams = async (
  eventId: string,
  format: PlayFormat,
  increment: number
) => {
  try {
    const eventsData = await AsyncStorage.getItem(EVENTS_KEY);
    if (!eventsData) return;

    const events = JSON.parse(eventsData);
    const eventIndex = events.findIndex((e: any) => e.id === eventId);

    if (eventIndex === -1) return;

    const formatIndex = events[eventIndex].availableFormats.findIndex(
      (f: any) => f.format === format
    );

    if (formatIndex !== -1) {
      events[eventIndex].availableFormats[formatIndex].registeredTeams += increment;

      if (events[eventIndex].availableFormats[formatIndex].registeredTeams < 0) {
        events[eventIndex].availableFormats[formatIndex].registeredTeams = 0;
      }

      await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }
  } catch (error) {
    console.error(validationStrings.ERROR_TEAM_UPDATE, error);
  }
};

export const registrationApiService = {
  createRegistration: async (
    eventId: string,
    participantEmail: string,
    participantName: string,
    participantGender: Gender,
    format: PlayFormat
  ): Promise<ParticipantRegistration> => {
    const registrations = await getStoredRegistrations();

    const existingRegistration = registrations.find(
      r => r.eventId === eventId && r.participantEmail === participantEmail && r.format === format
    );

    if (existingRegistration) {
      throw new Error(validationStrings.ALREADY_REGISTERED);
    }

    const newRegistration: ParticipantRegistration = {
      id: `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      participantEmail,
      participantName,
      participantGender,
      format,
      status: RegistrationStatus.PENDING,
      registeredAt: new Date().toISOString(),
    };

    registrations.push(newRegistration);
    await saveRegistrations(registrations);

    await updateEventRegisteredTeams(eventId, format, 1);

    return newRegistration;
  },

  getAllRegistrations: async (): Promise<ParticipantRegistration[]> => {
    return await getStoredRegistrations();
  },

  getRegistrationsByEvent: async (eventId: string): Promise<ParticipantRegistration[]> => {
    const registrations = await getStoredRegistrations();
    return registrations.filter(r => r.eventId === eventId);
  },

  getRegistrationsByEventAndFormat: async (
    eventId: string,
    format: PlayFormat
  ): Promise<ParticipantRegistration[]> => {
    const registrations = await getStoredRegistrations();
    return registrations.filter(r => r.eventId === eventId && r.format === format);
  },

  getRegistrationsByUser: async (participantEmail: string): Promise<ParticipantRegistration[]> => {
    const registrations = await getStoredRegistrations();
    return registrations.filter(r => r.participantEmail === participantEmail);
  },

  getApprovedRegistrations: async (
    eventId: string,
    format: PlayFormat,
    gender?: Gender
  ): Promise<ParticipantRegistration[]> => {
    const registrations = await getStoredRegistrations();
    let filtered = registrations.filter(
      r => r.eventId === eventId &&
           r.format === format &&
           r.status === RegistrationStatus.APPROVED
    );

    if (gender) {
      filtered = filtered.filter(r => r.participantGender === gender);
    }

    return filtered;
  },

  approveRegistration: async (
    registrationId: string,
    approverEmail: string
  ): Promise<ParticipantRegistration> => {
    const registrations = await getStoredRegistrations();
    const regIndex = registrations.findIndex(r => r.id === registrationId);

    if (regIndex === -1) {
      throw new Error(validationStrings.REG_NOT_FOUND);
    }

    registrations[regIndex] = {
      ...registrations[regIndex],
      status: RegistrationStatus.APPROVED,
      approvedBy: approverEmail,
      approvedAt: new Date().toISOString(),
      rejectionReason: undefined,
    };

    await saveRegistrations(registrations);
    return registrations[regIndex];
  },

  rejectRegistration: async (
    registrationId: string,
    approverEmail: string,
    reason: string
  ): Promise<ParticipantRegistration> => {
    const registrations = await getStoredRegistrations();
    const regIndex = registrations.findIndex(r => r.id === registrationId);

    if (regIndex === -1) {
      throw new Error(validationStrings.REG_NOT_FOUND);
    }

    const registration = registrations[regIndex];

    registrations[regIndex] = {
      ...registrations[regIndex],
      status: RegistrationStatus.REJECTED,
      approvedBy: approverEmail,
      approvedAt: new Date().toISOString(),
      rejectionReason: reason,
    };

    await saveRegistrations(registrations);

    if (registration.status === RegistrationStatus.PENDING) {
      await updateEventRegisteredTeams(registration.eventId, registration.format, -1);
    }

    return registrations[regIndex];
  },

  deleteRegistration: async (registrationId: string): Promise<void> => {
    const registrations = await getStoredRegistrations();

    const registration = registrations.find(r => r.id === registrationId);

    const filtered = registrations.filter(r => r.id !== registrationId);
    await saveRegistrations(filtered);

    if (registration) {
      await updateEventRegisteredTeams(registration.eventId, registration.format, -1);
    }
  },

  getPendingRegistrationsForOrganizer: async (
    eventIds: string[]
  ): Promise<ParticipantRegistration[]> => {
    const registrations = await getStoredRegistrations();
    return registrations.filter(
      r => eventIds.includes(r.eventId) && r.status === RegistrationStatus.PENDING
    );
  },

  getRegistrationStats: async (eventId: string, format: PlayFormat) => {
    const registrations = await getStoredRegistrations();
    const eventRegs = registrations.filter(
      r => r.eventId === eventId && r.format === format
    );

    return {
      total: eventRegs.length,
      pending: eventRegs.filter(r => r.status === RegistrationStatus.PENDING).length,
      approved: eventRegs.filter(r => r.status === RegistrationStatus.APPROVED).length,
      rejected: eventRegs.filter(r => r.status === RegistrationStatus.REJECTED).length,
      male: eventRegs.filter(r => r.participantGender === Gender.MALE).length,
      female: eventRegs.filter(r => r.participantGender === Gender.FEMALE).length,
    };
  },
};