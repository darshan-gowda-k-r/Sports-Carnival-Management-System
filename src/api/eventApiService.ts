import { Event, PlayFormat } from '../models/event';
import { validationStrings } from '../constants/validationStrings';


let events: Event[] = [
  {
    id: '1',
    title: 'Carrom Championship',
    sportType: 'Carrom',
    description: 'Singles and doubles carrom tournament',
    date: '2026-02-01',
    location: 'Indoor Hall',
    organizer: 'Sports Committee',
    status: 'UPCOMING',
    formats: [
      { format: '1v1', teamSize: 1, maxTeams: 32, registeredTeams: 0 },
      { format: '2v2', teamSize: 2, maxTeams: 16, registeredTeams: 0 },
    ],
  },
  {
    id: '2',
    title: 'Table Tennis Open',
    sportType: 'Table Tennis',
    description: 'Singles and doubles table tennis competition',
    date: '2026-02-03',
    location: 'Sports Arena',
    organizer: 'TT Club',
    status: 'UPCOMING',
    formats: [
      { format: '1v1', teamSize: 1, maxTeams: 24, registeredTeams: 0 },
      { format: '2v2', teamSize: 2, maxTeams: 12, registeredTeams: 0 },
    ],
  },
  {
    id: '3',
    title: 'Badminton League',
    sportType: 'Badminton',
    description: 'Singles & doubles badminton league',
    date: '2026-02-05',
    location: 'Badminton Court',
    organizer: 'Badminton Association',
    status: 'UPCOMING',
    formats: [
      { format: '1v1', teamSize: 1, maxTeams: 32, registeredTeams: 0 },
      { format: '2v2', teamSize: 2, maxTeams: 16, registeredTeams: 0 },
    ],
  },
  {
    id: '4',
    title: 'Foosball Faceoff',
    sportType: 'Foosball',
    description: 'Singles and doubles foosball matches',
    date: '2026-02-07',
    location: 'Recreation Room',
    organizer: 'Fun Games Club',
    status: 'UPCOMING',
    formats: [
      { format: '1v1', teamSize: 1, maxTeams: 24, registeredTeams: 0 },
      { format: '2v2', teamSize: 2, maxTeams: 12, registeredTeams: 0 },
    ],
  },
  {
    id: '5',
    title: 'Snooker Masters',
    sportType: 'Snooker',
    description: 'Professional snooker singles tournament',
    date: '2026-02-09',
    location: 'Snooker Lounge',
    organizer: 'Cue Sports Association',
    status: 'UPCOMING',
    formats: [
      { format: '1v1', teamSize: 1, maxTeams: 16, registeredTeams: 0 },
    ],
  },
];

export const eventApiService = {
  getEvents: async (): Promise<Event[]> => {
    return [...events];
  },

  getEventById: async (id: string): Promise<Event | undefined> => {
    return events.find(currentEvent => currentEvent.id === id);
  },

  createEvent: async (
    event: Omit<Event, 'id'>
  ): Promise<Event> => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    };

    events.push(newEvent);
    return newEvent;
  },

  updateEvent: async (updatedEvent: Event): Promise<Event> => {
    events = events.map(currentEvent =>
      currentEvent.id === updatedEvent.id ? updatedEvent : currentEvent
    );
    return updatedEvent;
  },

  deleteEvent: async (eventId: string): Promise<void> => {
    events = events.filter(currentEvent => currentEvent.id !== eventId);
  },

  registerTeam: async (
    eventId: string,
    format: PlayFormat
  ): Promise<Event> => {
    const eventFound = events.find(currentEvent => currentEvent.id === eventId);
    if (!eventFound) throw new Error(validationStrings.EVENT_NOT_EXISTS);

    const selectedFormat = eventFound.formats.find(
      currentFormat => currentFormat.format === format
    );
    if (!selectedFormat) throw new Error(validationStrings.FORMAT_FULL);

    if (selectedFormat.registeredTeams >= selectedFormat.maxTeams) {
      throw new Error(validationStrings.REGISTRATION_FULL);
    }

    selectedFormat.registeredTeams += 1;
    return eventFound;
  },
};
