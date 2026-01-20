export enum UserRole {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  PARTICIPANT = 'participant',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
