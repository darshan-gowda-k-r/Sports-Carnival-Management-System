import { Event } from '../models/event';

const today = new Date();
const getDateDaysFromNow = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export const defaultEvents: Event[] = [
  {
    id: 'default_1',
    title: 'Carrom Championship',
    sportType: 'Carrom',
    description: 'Singles carrom tournament with separate male and female categories',
    registrationDeadline: getDateDaysFromNow(10),
    matchDate: getDateDaysFromNow(20),
    location: 'Indoor Hall A',
    status: 'UPCOMING',
    availableFormats: [
      {
        format: '1v1',
        isAvailable: true,
        maxMaleParticipants: 32,
        maxFemaleParticipants: 32,
        registeredMaleCount: 0,
        registeredFemaleCount: 0,
      },
    ],
    allowsMixedGender: false,
    organizerId: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default_2',
    title: 'Table Tennis Open',
    sportType: 'Table Tennis',
    description: 'Singles table tennis competition',
    registrationDeadline: getDateDaysFromNow(30),
    matchDate: getDateDaysFromNow(35),
    location: 'Sports Arena',
    status: 'UPCOMING',
    availableFormats: [
      {
        format: '1v1',
        isAvailable: true,
        maxMaleParticipants: 24,
        maxFemaleParticipants: 24,
        registeredMaleCount: 0,
        registeredFemaleCount: 0,
      },
    ],
    allowsMixedGender: false,
    organizerId: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default_3',
    title: 'Badminton League',
    sportType: 'Badminton',
    description: 'Singles badminton league',
    registrationDeadline: getDateDaysFromNow(35),
    matchDate: getDateDaysFromNow(40),
    location: 'Badminton Court',
    status: 'UPCOMING',
    availableFormats: [
      {
        format: '1v1',
        isAvailable: true,
        maxMaleParticipants: 4,
        maxFemaleParticipants: 4,
        registeredMaleCount: 0,
        registeredFemaleCount: 0,
      },
    ],
    allowsMixedGender: false,
    organizerId: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default_4',
    title: 'Foosball Faceoff',
    sportType: 'Foosball',
    description: 'Doubles foosball tournament - Admin will create teams from registered participants',
    registrationDeadline: getDateDaysFromNow(40),
    matchDate: getDateDaysFromNow(45),
    location: 'Recreation Room',
    status: 'UPCOMING',
    availableFormats: [
      {
        format: '2v2',
        isAvailable: true,
        maxMaleParticipants: 24,
        maxFemaleParticipants: 24,
        registeredMaleCount: 0,
        registeredFemaleCount: 0,
      },
    ],
    allowsMixedGender: false,
    organizerId: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default_5',
    title: 'Snooker Masters',
    sportType: 'Snooker',
    description: 'Professional snooker singles tournament',
    registrationDeadline: getDateDaysFromNow(45),
    matchDate: getDateDaysFromNow(50),
    location: 'Snooker Lounge',
    status: 'UPCOMING',
    availableFormats: [
      {
        format: '1v1',
        isAvailable: true,
        maxMaleParticipants: 16,
        maxFemaleParticipants: 16,
        registeredMaleCount: 0,
        registeredFemaleCount: 0,
      },
    ],
    allowsMixedGender: false,
    organizerId: 'system',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'default_6',
    title: 'Chess Championship',
    sportType: 'Chess',
    description: 'Open chess tournament - males and females compete together',
    registrationDeadline: getDateDaysFromNow(50),
    matchDate: getDateDaysFromNow(55),
    location: 'Conference Hall',
    status: 'UPCOMING',
    availableFormats: [
      {
        format: '1v1',
        isAvailable: true,
        maxMaleParticipants: 32,
        maxFemaleParticipants: 32,
        registeredMaleCount: 0,
        registeredFemaleCount: 0,
      },
    ],
    allowsMixedGender: true,
    organizerId: 'system',
    createdAt: new Date().toISOString(),
  },
];