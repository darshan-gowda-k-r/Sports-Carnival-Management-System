import { validationStrings, headerStrings } from '../constants/validationStrings';
import { Gender } from './user';
import { PlayFormat } from './event';

export enum RegistrationStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export interface ParticipantRegistration {
  id: string;
  eventId: string;
  participantEmail: string;
  participantName: string;
  participantGender: Gender;
  format: PlayFormat;
  status: RegistrationStatus;
  registeredAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  assignedTeamId?: string;
}