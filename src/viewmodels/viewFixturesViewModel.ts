import { useState, useEffect, useCallback } from 'react';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { matchApiService } from '../api/matchApiService';
import { teamApiService } from '../api/teamApiService';
import { eventApiService } from '../api/eventApiService';
import { Match, MatchStatus } from '../models/match';
import { Team, TeamType } from '../models/team';
import { Event, isChess } from '../models/event';
import Colors from '../constants/colors';
import { validationStrings } from '../constants/validationStrings';

type GenderTab = 'all' | 'male' | 'female' | 'mixed' | 'my' | 'others';
type StatusTab = 'all' | 'live' | 'upcoming' | 'completed';

export const useViewFixturesViewModel = () => {
  const route = useRoute<any>();
  const { role, eventId, organizerId } = route.params || {};

  const [userEmail, setUserEmail] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedGenderTab, setSelectedGenderTab] = useState<GenderTab>('all');
  const [selectedStatusTab, setSelectedStatusTab] = useState<StatusTab>('all');

  const isChessEvent = useCallback(() => {
    if (!eventId) return false;
    const event = events.find(e => e.id === eventId);
    return event ? isChess(event.sportType) : false;
  }, [eventId, events]);

  const getUserTeamIds = useCallback(
    (allTeams: Team[]): string[] => {
      if (!userEmail) return [];

      const userTeams = allTeams.filter(team =>
        team.members.some(member =>
          member.userId === userEmail ||
          member.email === userEmail ||
          member.userEmail === userEmail ||
          member.id === userEmail
        )
      );

      return userTeams.map(team => team.id);
    },
    [userEmail]
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      let allMatches: Match[] = [];
      let allTeams: Team[] = [];
      let allEvents: Event[] = [];

      allEvents = await eventApiService.getEvents();

      try {
        const teamsDataString = await AsyncStorage.getItem('TEAMS_DATA');
        if (teamsDataString) {
          allTeams = JSON.parse(teamsDataString);
        }
      } catch (storageError) {
        console.error(validationStrings.ERROR_LOADING_TEAMS, storageError);
      }

      if (role === validationStrings.ADMIN) {
        allMatches = await matchApiService.getAllMatches();
      } else if (role === validationStrings.ORGANIZER && organizerId) {
        allMatches = await matchApiService.getAllMatches();

        const organizerEventIds = allMatches
          .map(m => m.eventId)
          .filter((id, index, self) => self.indexOf(id) === index);

        allMatches = allMatches.filter(m => organizerEventIds.includes(m.eventId));
        if (allTeams.length > 0) {
          allTeams = allTeams.filter(t => organizerEventIds.includes(t.eventId));
        }
      } else if (role === validationStrings.PARTICIPANT || role === 'PLAYER') {
        allMatches = await matchApiService.getAllMatches();
      } else if (eventId) {
        allMatches = await matchApiService.getMatchesByEvent(eventId);
        if (allTeams.length > 0) {
          allTeams = allTeams.filter(t => t.eventId === eventId);
        }
      } else {
        allMatches = await matchApiService.getAllMatches();
      }

      setMatches(allMatches);
      setTeams(allTeams);
      setEvents(allEvents);

      if ((role === validationStrings.PARTICIPANT || role === 'PLAYER') && !isChessEvent()) {
        const userTeamIds = getUserTeamIds(allTeams);

        const myMatchesArray = allMatches.filter(m => {
          const isInTeam = userTeamIds.includes(m.team1Id) || userTeamIds.includes(m.team2Id);
          const isDirectMatch = userEmail && (m.team1Id === userEmail || m.team2Id === userEmail);
          return isInTeam || isDirectMatch;
        });

        const hasMyMatches = myMatchesArray.length > 0;

        if (hasMyMatches) {
          setSelectedGenderTab('my');
        } else {
          setSelectedGenderTab('others');
        }
      }
    } catch (error) {
      console.error(validationStrings.FAILED_LOAD_FIXTURES, error);
    } finally {
      setLoading(false);
    }
  }, [role, eventId, organizerId, userEmail, isChessEvent, getUserTeamIds]);

  useEffect(() => {
    const loadEmail = async () => {
      try {
        const authenticatedUserString = await AsyncStorage.getItem('AUTHENTICATED_USER');

        if (authenticatedUserString) {
          const authenticatedUser = JSON.parse(authenticatedUserString);

          const email = authenticatedUser.email ||
                       authenticatedUser.userEmail ||
                       authenticatedUser.userId ||
                       authenticatedUser.id;

          if (email) {
            setUserEmail(email);
          }
        }
      } catch (error) {
        console.error(validationStrings.FAILED_TO_LOAD_EMAIL, error);
      }
    };

    loadEmail();
  }, []);

  useEffect(() => {
    loadData();
  }, [userEmail, role, eventId, organizerId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const getTeamType = useCallback(
    (teamId: string): TeamType | null => {
      const team = teams.find(t => t.id === teamId);
      return team ? team.teamType : null;
    },
    [teams]
  );

  const maleMatches = matches.filter(m => {
    const team1Type = getTeamType(m.team1Id);
    const team2Type = getTeamType(m.team2Id);
    return team1Type === TeamType.MALE && team2Type === TeamType.MALE;
  });

  const femaleMatches = matches.filter(m => {
    const team1Type = getTeamType(m.team1Id);
    const team2Type = getTeamType(m.team2Id);
    return team1Type === TeamType.FEMALE && team2Type === TeamType.FEMALE;
  });

  const mixedMatches = matches.filter(m => {
    const team1Type = getTeamType(m.team1Id);
    const team2Type = getTeamType(m.team2Id);
    return team1Type === TeamType.MIXED ||
           team2Type === TeamType.MIXED ||
           (team1Type === TeamType.MALE && team2Type === TeamType.FEMALE) ||
           (team1Type === TeamType.FEMALE && team2Type === TeamType.MALE);
  });

  const userTeamIds = getUserTeamIds(teams);

  const myFixtures = matches.filter(m => {
    const isInTeam = userTeamIds.includes(m.team1Id) || userTeamIds.includes(m.team2Id);
    const isDirectMatch = userEmail && (m.team1Id === userEmail || m.team2Id === userEmail);
    return isInTeam || isDirectMatch;
  });

  const otherFixtures = matches.filter(m => {
    const isInTeam = userTeamIds.includes(m.team1Id) || userTeamIds.includes(m.team2Id);
    const isDirectMatch = userEmail && (m.team1Id === userEmail || m.team2Id === userEmail);
    return !isInTeam && !isDirectMatch;
  });

  const liveMatches = matches.filter(m => m.status === MatchStatus.IN_PROGRESS);
  const upcomingMatches = matches.filter(m => m.status === MatchStatus.SCHEDULED);
  const completedMatches = matches.filter(m => m.status === MatchStatus.COMPLETED);

  const getStatusColor = useCallback((status: MatchStatus) => {
    switch (status) {
      case MatchStatus.IN_PROGRESS:
        return Colors.status_rejected;
      case MatchStatus.SCHEDULED:
        return Colors.primary;
      case MatchStatus.COMPLETED:
        return Colors.status_approved;
      case MatchStatus.CANCELLED:
        return Colors.iconSecondary;
      default:
        return Colors.text_lighter;
    }
  }, []);

  const getMatchesForDisplay = useCallback(() => {
    let filtered = matches;

    if ((role === validationStrings.PARTICIPANT || role === 'PLAYER') && !isChessEvent()) {
      if (selectedGenderTab === 'my') {
        filtered = myFixtures;
      } else if (selectedGenderTab === 'others') {
        filtered = otherFixtures;
      }
    } else {
      if (selectedGenderTab === 'male') {
        filtered = maleMatches;
      } else if (selectedGenderTab === 'female') {
        filtered = femaleMatches;
      } else if (selectedGenderTab === 'mixed') {
        filtered = mixedMatches;
      }
    }

    if (selectedStatusTab === 'live') {
      filtered = filtered.filter(m => m.status === MatchStatus.IN_PROGRESS);
    } else if (selectedStatusTab === 'upcoming') {
      filtered = filtered.filter(m => m.status === MatchStatus.SCHEDULED);
    } else if (selectedStatusTab === 'completed') {
      filtered = filtered.filter(m => m.status === MatchStatus.COMPLETED);
    }

    return filtered;
  }, [
    matches,
    selectedGenderTab,
    selectedStatusTab,
    maleMatches,
    femaleMatches,
    mixedMatches,
    myFixtures,
    otherFixtures,
    role,
    isChessEvent,
  ]);

  return {
    role: role || validationStrings.PARTICIPANT,
    userEmail,
    matches,
    events,
    loading,
    refreshing,
    selectedGenderTab,
    selectedStatusTab,
    isChessEvent: isChessEvent(),
    maleMatches,
    femaleMatches,
    mixedMatches,
    myFixtures,
    otherFixtures,
    liveMatches,
    upcomingMatches,
    completedMatches,
    setSelectedGenderTab,
    setSelectedStatusTab,
    onRefresh,
    getStatusColor,
    getMatchesForDisplay,
  };
};