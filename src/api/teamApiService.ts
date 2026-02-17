import AsyncStorage from '@react-native-async-storage/async-storage';
import { Team, TeamType, TeamMember, TeamStatus } from '../models/team';
import { PlayFormat } from '../models/event';
import { Gender } from '../models/user';
import { validationStrings } from '../constants/validationStrings';

const TEAMS_KEY = 'TEAMS_DATA';

const getStoredTeams = async (): Promise<Team[]> => {
  try {
    const data = await AsyncStorage.getItem(TEAMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(validationStrings.TEAM_GET_ERROR, error);
    return [];
  }
};

const saveTeams = async (teams: Team[]) => {
  try {
    await AsyncStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
  } catch (error) {
    console.error(validationStrings.TEAM_SAVING_ERROR, error);
    throw new Error(validationStrings.TEAM_SAVING_ERROR);
  }
};

const generateTeamName = (members: TeamMember[], teamType: TeamType, teamNumber?: number): string => {
  if (members.length === 1) {
    return `${members[0].name} (${teamType})`;
  } else {
    const letter = teamNumber ? String.fromCharCode(64 + teamNumber) : 'A';
    const typeLabel = teamType === TeamType.MALE ? validationStrings.MALE : teamType === TeamType.FEMALE ? validationStrings.FEMALE : validationStrings.MIXED;
    return `Team ${letter} - ${typeLabel}`;
  }
};

const determineTeamType = (members: TeamMember[]): TeamType => {
  const genders = [...new Set(members.map(m => m.gender))];
  
  if (genders.length === 1) {
    return genders[0] === Gender.MALE ? TeamType.MALE : TeamType.FEMALE;
  }
  return TeamType.MIXED;
};

export const teamApiService = {
  createTeam: async (
    eventId: string,
    format: PlayFormat,
    members: TeamMember[],
    createdBy: string
  ): Promise<Team> => {
    const teams = await getStoredTeams();
    const teamType = determineTeamType(members);
    
    const sameTypeTeams = teams.filter(
      t => t.eventId === eventId && t.format === format && t.teamType === teamType
    );
    const teamNumber = sameTypeTeams.length + 1;
    
    const newTeam: Team = {
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      format,
      teamType,
      teamName: generateTeamName(members, teamType, teamNumber),
      members,
      status: TeamStatus.PENDING,
      createdBy,
      createdAt: new Date().toISOString(),
      captainId: members[0]?.userId,
    };

    teams.push(newTeam);
    await saveTeams(teams);
    return newTeam;
  },

  autoCreateTeams: async (
    eventId: string,
    format: PlayFormat,
    approvedRegistrations: any[],
    createdBy: string
  ): Promise<Team[]> => {
    const newTeams: Team[] = [];
    
    const maleRegs = approvedRegistrations.filter(r => r.participantGender === Gender.MALE);
    const femaleRegs = approvedRegistrations.filter(r => r.participantGender === Gender.FEMALE);

    const teamSize = format === '1v1' ? 1 : format === '2v2' ? 2 : 5;

    const createTeamsFromGroup = async (
      registrations: any[],
      gender: Gender
    ) => {
      for (let i = 0; i < registrations.length; i += teamSize) {
        const teamRegs = registrations.slice(i, i + teamSize);
        
        if (teamRegs.length === teamSize) {
          const members: TeamMember[] = teamRegs.map(reg => ({
            userId: reg.participantEmail,
            name: reg.participantName,
            gender: reg.participantGender,
          }));

          const team = await teamApiService.createTeam(
            eventId,
            format,
            members,
            createdBy
          );
          
          newTeams.push(team);
        }
      }
    };

    await createTeamsFromGroup(maleRegs, Gender.MALE);
    await createTeamsFromGroup(femaleRegs, Gender.FEMALE);

    return newTeams;
  },

  getAllTeams: async (): Promise<Team[]> => {
    return await getStoredTeams();
  },

  getTeamsByEvent: async (eventId: string): Promise<Team[]> => {
    const teams = await getStoredTeams();
    return teams.filter(t => t.eventId === eventId);
  },

  getTeamsByEventAndFormat: async (
    eventId: string,
    format: PlayFormat
  ): Promise<Team[]> => {
    const teams = await getStoredTeams();
    return teams.filter(t => t.eventId === eventId && t.format === format);
  },

  getTeamsByParticipant: async (participantEmail: string): Promise<Team[]> => {
    const teams = await getStoredTeams();
    return teams.filter(t => 
      t.members.some(m => m.userId === participantEmail)
    );
  },

  getTeamById: async (teamId: string): Promise<Team | null> => {
    const teams = await getStoredTeams();
    return teams.find(t => t.id === teamId) || null;
  },

  updateTeam: async (teamId: string, updates: Partial<Team>): Promise<Team> => {
    const teams = await getStoredTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) {
      throw new Error(validationStrings.TEAM_NOT_FOUND);
    }

    teams[teamIndex] = {
      ...teams[teamIndex],
      ...updates,
      id: teams[teamIndex].id,
    };

    await saveTeams(teams);
    return teams[teamIndex];
  },

  approveTeam: async (teamId: string, approverEmail: string): Promise<Team> => {
    const teams = await getStoredTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) {
      throw new Error(validationStrings.TEAM_NOT_FOUND);
    }

    teams[teamIndex] = {
      ...teams[teamIndex],
      status: TeamStatus.APPROVED,
      approvedBy: approverEmail,
      approvedAt: new Date().toISOString(),
      rejectedReason: undefined,
    };

    await saveTeams(teams);
    return teams[teamIndex];
  },

  rejectTeam: async (
    teamId: string,
    approverEmail: string,
    reason: string
  ): Promise<Team> => {
    const teams = await getStoredTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);

    if (teamIndex === -1) {
      throw new Error(validationStrings.TEAM_NOT_FOUND);
    }

    teams[teamIndex] = {
      ...teams[teamIndex],
      status: TeamStatus.REJECTED,
      approvedBy: approverEmail,
      approvedAt: new Date().toISOString(),
      rejectedReason: reason,
    };

    await saveTeams(teams);
    return teams[teamIndex];
  },

  getPendingTeamsForOrganizer: async (
    organizerEmail: string,
    eventIds: string[]
  ): Promise<Team[]> => {
    const teams = await getStoredTeams();
    return teams.filter(
      t => eventIds.includes(t.eventId) && t.status === TeamStatus.PENDING
    );
  },

  deleteTeam: async (teamId: string): Promise<void> => {
    const teams = await getStoredTeams();
    const filtered = teams.filter(t => t.id !== teamId);
    await saveTeams(filtered);
  },

  deleteTeamsByEventAndFormat: async (
    eventId: string,
    format: PlayFormat
  ): Promise<void> => {
    const teams = await getStoredTeams();
    const filtered = teams.filter(
      t => !(t.eventId === eventId && t.format === format)
    );
    await saveTeams(filtered);
  },

  getTeamStats: async (eventId: string, format: PlayFormat) => {
    const teams = await getStoredTeams();
    const eventTeams = teams.filter(
      t => t.eventId === eventId && t.format === format
    );

    return {
      total: eventTeams.length,
      male: eventTeams.filter(t => t.teamType === TeamType.MALE).length,
      female: eventTeams.filter(t => t.teamType === TeamType.FEMALE).length,
      mixed: eventTeams.filter(t => t.teamType === TeamType.MIXED).length,
      pending: eventTeams.filter(t => t.status === TeamStatus.PENDING).length,
      approved: eventTeams.filter(t => t.status === TeamStatus.APPROVED).length,
      rejected: eventTeams.filter(t => t.status === TeamStatus.REJECTED).length,
    };
  },
};
