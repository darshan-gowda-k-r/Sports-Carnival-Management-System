import { PlayFormat } from './event';
import { validationStrings, headerStrings } from '../constants/validationStrings';

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Match {
  id: string;
  eventId: string;
  format: PlayFormat;
  matchNumber: number;
  team1Id: string;
  team1Name: string;
  team2Id: string;
  team2Name: string;
  scheduledDate: string;
  scheduledTime: string;
  venue: string;
  status: MatchStatus;
  team1Score?: number;
  team2Score?: number;
  winnerId?: string;
  createdBy: string;
  createdAt: string;
}