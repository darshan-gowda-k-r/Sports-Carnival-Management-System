
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Match, MatchStatus } from '../models/match';
import { PlayFormat } from '../models/event';
import { Team, TeamType } from '../models/team';
import { validationStrings } from '../constants/validationStrings';

const MATCHES_KEY = 'MATCHES_DATA';

const getStoredMatches = async (): Promise<Match[]> => {
  try {
    const data = await AsyncStorage.getItem(MATCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(validationStrings.MATCH_GET_ERROR, error);
    return [];
  }
};

const saveMatches = async (matches: Match[]) => {
  try {
    await AsyncStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  } catch (error) {
    console.error(validationStrings.MATCH_SAVING_ERROR, error);
    throw new Error(validationStrings.MATCH_SAVE_FAIL);
  }
};

export const matchApiService = {
  createMatch: async (
    eventId: string,
    format: PlayFormat,
    team1: Team,
    team2: Team,
    matchNumber: number,
    scheduledDate: string,
    scheduledTime: string,
    venue: string,
    createdBy: string
  ): Promise<Match> => {
    const matches = await getStoredMatches();

    const newMatch: Match = {
      id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      eventId,
      format,
      matchNumber,
      team1Id: team1.id,
      team1Name: team1.teamName,
      team2Id: team2.id,
      team2Name: team2.teamName,
      scheduledDate,
      scheduledTime,
      venue,
      status: MatchStatus.SCHEDULED,
      createdBy,
      createdAt: new Date().toISOString(),
    };

    matches.push(newMatch);
    await saveMatches(matches);
    return newMatch;
  },

  autoGenerateMatches: async (
    eventId: string,
    format: PlayFormat,
    teams: Team[],
    startDate: string,
    startTime: string,
    venue: string,
    createdBy: string,
    matchType: validationStrings.ROUND_ROBIN | validationStrings.KNOCKOUT = validationStrings.ROUND_ROBIN
  ): Promise<Match[]> => {
    const newMatches: Match[] = [];
    let matchCounter = 1;

    const maleTeams = teams.filter(t => t.teamType === TeamType.MALE);
    const femaleTeams = teams.filter(t => t.teamType === TeamType.FEMALE);
    const mixedTeams = teams.filter(t => t.teamType === TeamType.MIXED);

    const generateMatchesForGroup = async (
      groupTeams: Team[],
      groupName: string
    ) => {
      if (matchType === validationStrings.ROUND_ROBIN) {
        for (let i = 0; i < groupTeams.length - 1; i++) {
          for (let j = i + 1; j < groupTeams.length; j++) {
            const match = await matchApiService.createMatch(
              eventId,
              format,
              groupTeams[i],
              groupTeams[j],
              matchCounter,
              startDate,
              startTime,
              venue,
              createdBy
            );
            newMatches.push(match);
            matchCounter++;
          }
        }
      } else {
        for (let i = 0; i < groupTeams.length - 1; i += 2) {
          const match = await matchApiService.createMatch(
            eventId,
            format,
            groupTeams[i],
            groupTeams[i + 1],
            matchCounter,
            startDate,
            startTime,
            venue,
            createdBy
          );
          newMatches.push(match);
          matchCounter++;
        }
      }
    };

    if (maleTeams.length >= 2) {
      await generateMatchesForGroup(maleTeams, validationStrings.MALE);
    }
    if (femaleTeams.length >= 2) {
      await generateMatchesForGroup(femaleTeams, validationStrings.FEMALE);
    }
    if (mixedTeams.length >= 2) {
      await generateMatchesForGroup(mixedTeams, validationStrings.MIXED);
    }

    return newMatches;
  },

  getAllMatches: async (): Promise<Match[]> => {
    return await getStoredMatches();
  },

  getMatchesByEvent: async (eventId: string): Promise<Match[]> => {
    const matches = await getStoredMatches();
    return matches.filter(m => m.eventId === eventId);
  },

  getMatchesByEventAndFormat: async (
    eventId: string,
    format: PlayFormat
  ): Promise<Match[]> => {
    const matches = await getStoredMatches();
    return matches.filter(m => m.eventId === eventId && m.format === format);
  },

  getMatchesByTeam: async (teamId: string): Promise<Match[]> => {
    const matches = await getStoredMatches();
    return matches.filter(m => m.team1Id === teamId || m.team2Id === teamId);
  },

  getMatchById: async (matchId: string): Promise<Match | null> => {
    const matches = await getStoredMatches();
    return matches.find(m => m.id === matchId) || null;
  },

  updateMatch: async (matchId: string, updates: Partial<Match>): Promise<Match> => {
    const matches = await getStoredMatches();
    const matchIndex = matches.findIndex(m => m.id === matchId);

    if (matchIndex === -1) {
      throw new Error(validationStrings.MATCHES_NOT_FOUND);
    }

    matches[matchIndex] = {
      ...matches[matchIndex],
      ...updates,
      id: matches[matchIndex].id,
    };

    await saveMatches(matches);
    return matches[matchIndex];
  },

  updateMatchStatus: async (
    matchId: string,
    status: MatchStatus
  ): Promise<Match> => {
    return await matchApiService.updateMatch(matchId, { status });
  },

  recordMatchResult: async (
    matchId: string,
    team1Score: number,
    team2Score: number,
    winnerId: string
  ): Promise<Match> => {
    return await matchApiService.updateMatch(matchId, {
      team1Score,
      team2Score,
      winnerId,
      status: MatchStatus.COMPLETED,
    });
  },

  deleteMatch: async (matchId: string): Promise<void> => {
    const matches = await getStoredMatches();
    const filtered = matches.filter(m => m.id !== matchId);
    await saveMatches(filtered);
  },

  deleteMatchesByEventAndFormat: async (
    eventId: string,
    format: PlayFormat
  ): Promise<void> => {
    const matches = await getStoredMatches();
    const filtered = matches.filter(
      m => !(m.eventId === eventId && m.format === format)
    );
    await saveMatches(filtered);
  },

  getMatchStats: async (eventId: string, format: PlayFormat) => {
    const matches = await getStoredMatches();
    const eventMatches = matches.filter(
      m => m.eventId === eventId && m.format === format
    );

    return {
      total: eventMatches.length,
      scheduled: eventMatches.filter(m => m.status === MatchStatus.SCHEDULED).length,
      ongoing: eventMatches.filter(m => m.status === MatchStatus.IN_PROGRESS).length,
      completed: eventMatches.filter(m => m.status === MatchStatus.COMPLETED).length,
      cancelled: eventMatches.filter(m => m.status === MatchStatus.CANCELLED).length,
    };
  },
};
