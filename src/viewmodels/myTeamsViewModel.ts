import { useState, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { teamApiService } from '../api/teamApiService';
import { eventApiService } from '../api/eventApiService';
import { useAuthViewModel } from './authViewModel';
import { Team, TeamStatus, TeamType } from '../models/team';
import { headerStrings, validationStrings } from '../constants/validationStrings';
import { Event } from '../models/event';
import Colors from '../constants/colors';

interface TeamWithEvent extends Team {
  eventDetails?: Event;
}

export const useMyTeamsViewModel = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuthViewModel();

  const [teams, setTeams] = useState<TeamWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTeams = useCallback(async () => {
    if (!user?.email) return;

    try {
      const userTeams = await teamApiService.getTeamsByParticipant(user.email);

      const teamsWithEvents = await Promise.all(
        userTeams.map(async (team) => {
          const event = await eventApiService.getEventById(team.eventId);
          return { ...team, eventDetails: event };
        })
      );

      setTeams(teamsWithEvents);
    } catch (error) {
      console.error(validationStrings.FAILED_TO_LOAD_TEAMS, error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadTeams();
    }, [loadTeams])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTeams();
  }, [loadTeams]);

  const navigateToEventDetails = useCallback((event: Event) => {
    navigation.navigate('EventDetails', {
      event: event,
      role: 'PARTICIPANT',
    });
  }, [navigation]);

  const navigateToEventList = useCallback(() => {
    navigation.navigate('EventList', { role: validationStrings.PART });
  }, [navigation]);

  const getStatusColor = useCallback((status: TeamStatus) => {
    switch (status) {
      case TeamStatus.APPROVED:
        return Colors.COLOR_GREEN;
      case TeamStatus.PENDING:
        return Colors.COLOR_ORANGE;
      case TeamStatus.REJECTED:
        return Colors.iconDelete;
      default:
        return Colors.iconSecondary;
    }
  }, []);

  const getTeamTypeColor = useCallback((teamType: TeamType) => {
    switch (teamType) {
      case TeamType.MALE:
        return Colors.COLOR_BLUE;
      case TeamType.FEMALE:
        return Colors.COLOR_FEMALE;
      case TeamType.MIXED:
        return Colors.COLOR_PURPLE;
      default:
        return Colors.iconSecondary;
    }
  }, []);

  const getStats = useCallback(() => {
    return {
      total: teams.length,
      pending: teams.filter(t => t.status === TeamStatus.PENDING).length,
      approved: teams.filter(t => t.status === TeamStatus.APPROVED).length,
      rejected: teams.filter(t => t.status === TeamStatus.REJECTED).length,
    };
  }, [teams]);

  const isCaptain = useCallback((team: Team) => {
    return team.captainId === user?.email;
  }, [user]);

  const isCurrentUser = useCallback((userId: string) => {
    return userId === user?.email;
  }, [user]);

  return {
    teams,
    loading,
    refreshing,
    user,

    onRefresh,
    navigateToEventDetails,
    navigateToEventList,

    getStatusColor,
    getTeamTypeColor,
    getStats,
    isCaptain,
    isCurrentUser,
  };
};

export type { TeamWithEvent };