import { validationStrings, headerStrings } from '../constants/validationStrings';
import { PlayFormat } from './event';
import { Gender } from './user';

export enum TeamType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  MIXED = 'MIXED',
}

export enum TeamStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface TeamMember {
  userId: string;
  name: string;
  gender: Gender;
}

export interface Team {
  id: string;
  eventId: string;
  format: PlayFormat;
  teamType: TeamType;
  teamName: string;
  members: TeamMember[];
  status: TeamStatus;
  createdBy: string;
  createdAt: string;
  captainId?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
}