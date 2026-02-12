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

  useEffect(() => {
    loadUserEmail();
    loadData();
  }, []);

  const loadUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('USER_EMAIL');
      if (email) {
        setUserEmail(email);
      }
    } catch (error) {
      console.error(validationStrings.FAILED_TO_LOAD_EMAIL, error);
    }
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      let allMatches: Match[] = [];
      let allTeams: Team[] = [];
      let allEvents: Event[] = [];

      allEvents = await eventApiService.getEvents();

      if (role === validationStrings.ADMIN) {
        allMatches = await matchApiService.getAllMatches();
        allTeams = await teamApiService.getAllTeams();
      } else if (role === validationStrings.ORGANIZER && organizerId) {
        allMatches = await matchApiService.getAllMatches();
        allTeams = await teamApiService.getAllTeams();

        const organizerEventIds = allMatches
          .map(m => m.eventId)
          .filter((id, index, self) => self.indexOf(id) === index);

        allMatches = allMatches.filter(m => organizerEventIds.includes(m.eventId));
      } else if (role === validationStrings.PARTICIPANT) {
        allMatches = await matchApiService.getAllMatches();
        allTeams = await teamApiService.getAllTeams();
      } else if (eventId) {
        allMatches = await matchApiService.getMatchesByEvent(eventId);
        allTeams = await teamApiService.getTeamsByEvent(eventId);
      } else {
        allMatches = await matchApiService.getAllMatches();
        allTeams = await teamApiService.getAllTeams();
      }

      setMatches(allMatches);
      setTeams(allTeams);
      setEvents(allEvents);

      if (role === validationStrings.PARTICIPANT && !isChessEvent()) {
        const userTeamIds = getUserTeamIds(allTeams);
        const hasMyMatches = allMatches.some(
          m => userTeamIds.includes(m.team1Id) || userTeamIds.includes(m.team2Id)
        );
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
  }, [role, eventId, organizerId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const getUserTeamIds = useCallback(
    (allTeams: Team[]): string[] => {
      if (!userEmail) return [];

      return allTeams
        .filter(team =>
          team.members.some(member => member.userId === userEmail)
        )
        .map(team => team.id);
    },
    [userEmail]
  );

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
    return team1Type === TeamType.MIXED || team2Type === TeamType.MIXED;
  });

  const userTeamIds = getUserTeamIds(teams);

  const myFixtures = matches.filter(
    m => userTeamIds.includes(m.team1Id) || userTeamIds.includes(m.team2Id)
  );

  const otherFixtures = matches.filter(
    m => !userTeamIds.includes(m.team1Id) && !userTeamIds.includes(m.team2Id)
  );

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

    if (role === validationStrings.PARTICIPANT && !isChessEvent()) {
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