import { validationStrings } from '../constants/validationStrings';

export type PlayFormat = '1v1' | '2v2';

export interface FormatAvailability {
  format: PlayFormat;
  isAvailable: boolean;
  maxMaleParticipants: number;
  maxFemaleParticipants: number;
  registeredMaleCount: number;
  registeredFemaleCount: number;
}

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export interface Event {
  id: string;
  title: string;
  sportType: string;
  description: string;
  registrationDeadline: string;
  matchDate: string;
  location: string;
  status: EventStatus;
  availableFormats: FormatAvailability[];
  allowsMixedGender: boolean;
  organizerId?: string;
  createdAt?: string;
  isDefault?: boolean;
}

export const allowsMixedGender = (sportType: string): boolean => {
  return sportType.toLowerCase() === validationStrings.SPORT_TYPE_CHESS;
};

export const allows2v2Format = (sportType: string): boolean => {
  return sportType.toLowerCase() === validationStrings.SPORT_TYPE_FOOSBALL;
};

export const isChess = (sportType: string): boolean => {
  return sportType.toLowerCase() === validationStrings.SPORT_TYPE_CHESS;
};

export const needsTeamCreation = (sportType: string): boolean => {
  return allows2v2Format(sportType);
};

export const validateMatchDate = (registrationDeadline: Date, matchDate: Date): {
  valid: boolean;
  message?: string;
  diffDays?: number;
} => {
  const diffTime = matchDate.getTime() - registrationDeadline.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  if (diffDays < 0) {
    return {
      valid: false,
      message: validationStrings.MATCH_INVALID
    };
  }

  if (diffDays <= 1) {
    return {
      valid: false,
      message: validationStrings.MATCH_VALID_REGISTRATION,
      diffDays
    };
  }

  return {
    valid: true,
    diffDays
  };
};


export const hasDeadlinePassed = (registrationDeadline: string): boolean => {
  const now = new Date();
  const deadline = new Date(registrationDeadline);

  deadline.setHours(23, 59, 59, 999);

  return now > deadline;
};

export const isRegistrationOpen = (event: Event): boolean => {
  const now = new Date();
  const deadline = new Date(event.registrationDeadline);

  deadline.setHours(23, 59, 59, 999);

  return now <= deadline && event.status.toUpperCase() === validationStrings.UPCOMING.toUpperCase();
};

export const REGISTRATION_THRESHOLD = 0.8;

export const getRegistrationPercentage = (format: FormatAvailability, gender: 'MALE' | 'FEMALE' | 'COMBINED'): number => {
  if (gender === 'COMBINED') {
    const total = format.registeredMaleCount + format.registeredFemaleCount;
    const max = format.maxMaleParticipants + format.maxFemaleParticipants;
    return max > 0 ? (total / max) * 100 : 0;
  }

  if (gender === validationStrings.MALE) {
    return format.maxMaleParticipants > 0
      ? (format.registeredMaleCount / format.maxMaleParticipants) * 100
      : 0;
  }

  return format.maxFemaleParticipants > 0
    ? (format.registeredFemaleCount / format.maxFemaleParticipants) * 100
    : 0;
};

export const meetsThreshold = (percentage: number): boolean => {
  return percentage >= (REGISTRATION_THRESHOLD * 100);
};

export const hasAvailableSpots = (format: FormatAvailability, gender: 'MALE' | 'FEMALE'): boolean => {
  if (gender === validationStrings.MALE) {
    return format.registeredMaleCount < format.maxMaleParticipants;
  }
  return format.registeredFemaleCount < format.maxFemaleParticipants;
};

export const isFormatFull = (format: FormatAvailability): boolean => {
  return (
    format.registeredMaleCount >= format.maxMaleParticipants &&
    format.registeredFemaleCount >= format.maxFemaleParticipants
  );
};

export const getTotalRegistered = (format: FormatAvailability): number => {
  return format.registeredMaleCount + format.registeredFemaleCount;
};

export const getTotalMaxParticipants = (format: FormatAvailability): number => {
  return format.maxMaleParticipants + format.maxFemaleParticipants;
};

export const canCreateFixtures = (event: Event, format: FormatAvailability): boolean => {
  if (!hasDeadlinePassed(event.registrationDeadline)) {
    return false;
  }

  const isChessEvent = isChess(event.sportType);

  if (isChessEvent) {
    const combinedPercentage = getRegistrationPercentage(format, 'COMBINED');
    return meetsThreshold(combinedPercentage);
  } else {
    const malePercentage = getRegistrationPercentage(format, validationStrings.MALE);
    const femalePercentage = getRegistrationPercentage(format, validationStrings.FEMALE);
    return meetsThreshold(malePercentage) && meetsThreshold(femalePercentage);
  }
};