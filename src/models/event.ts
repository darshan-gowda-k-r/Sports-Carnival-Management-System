export type PlayFormat = '1v1' | '2v2';

export interface EventFormat {
  format: PlayFormat;
  teamSize: number; 
  maxTeams: number;
  registeredTeams: number;
}

export type EventStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export interface Event {
  id: string;
  title: string;
  sportType: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  status: EventStatus;
  formats: EventFormat[];
}
