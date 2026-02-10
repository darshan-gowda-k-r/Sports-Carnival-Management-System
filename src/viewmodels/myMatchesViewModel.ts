import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { matchApiService } from '../api/matchApiService';
import { teamApiService } from '../api/teamApiService';
import { useAuthViewModel } from './authViewModel';
import { Match, MatchStatus } from '../models/match';
import { Team } from '../models/team';
import Colors from '../constants/colors';
import { headerStrings, validationStrings } from '../constants/validationStrings';

export const useMyMatchesViewModel = () => {
  const { user } = useAuthViewModel();

  const [matches, setMatches] = useState<Match[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    if (!user?.email) return;

    try {
      const teams = await teamApiService.getTeamsByParticipant(user.email);
      setMyTeams(teams);

      const allMatches: Match[] = [];
      for (const team of teams) {
        const teamMatches = await matchApiService.getMatchesByTeam(team.id);
        allMatches.push(...teamMatches);
      }

      const uniqueMatches = Array.from(
        new Map(allMatches.map(m => [m.id, m])).values()
      ).sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

      setMatches(uniqueMatches);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const getStatusColor = useCallback((status: MatchStatus) => {
    switch (status) {
      case MatchStatus.SCHEDULED:
        return Colors.COLOR_BLUE;
      case MatchStatus.IN_PROGRESS:
        return Colors.COLOR_ORANGE;
      case MatchStatus.COMPLETED:
        return Colors.COLOR_GREEN;
      case MatchStatus.CANCELLED:
        return Colors.iconDelete;
      default:
        return Colors.iconSecondary;
    }
  }, []);

  const getUpcomingMatches = useCallback(() => {
    return matches.filter(
      m => m.status === MatchStatus.SCHEDULED || m.status === MatchStatus.IN_PROGRESS
    );
  }, [matches]);

  const getCompletedMatches = useCallback(() => {
    return matches.filter(m => m.status === MatchStatus.COMPLETED);
  }, [matches]);

  const getStats = useCallback(() => {
    const upcomingMatches = getUpcomingMatches();
    const completedMatches = getCompletedMatches();

    return {
      total: matches.length,
      upcoming: upcomingMatches.length,
      completed: completedMatches.length,
    };
  }, [matches, getUpcomingMatches, getCompletedMatches]);

  const isMyTeam = useCallback((teamId: string) => {
    return myTeams.some(t => t.id === teamId);
  }, [myTeams]);

  const getMyTeam = useCallback((match: Match) => {
    const team1 = myTeams.find(t => t.id === match.team1Id);
    const team2 = myTeams.find(t => t.id === match.team2Id);
    return team1 || team2;
  }, [myTeams]);

  return {
    matches,
    myTeams,
    loading,
    refreshing,

    onRefresh,

    getUpcomingMatches,
    getCompletedMatches,
    getStats,

    getStatusColor,
    isMyTeam,
    getMyTeam,
  };
};