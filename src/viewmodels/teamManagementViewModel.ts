import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { teamApiService } from '../api/teamApiService';
import { validationStrings, headerStrings } from '../constants/validationStrings';
import { Team, TeamStatus } from '../models/team';
import { useEvents } from '../context/eventContext';
import { useAuthViewModel } from './authViewModel';

export const useTeamManagementViewModel = (role: string) => {
  const navigation = useNavigation<any>();
  const { user } = useAuthViewModel();
  const { events } = useEvents();

  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'ALL' | TeamStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadTeams = useCallback(async () => {
    setLoading(true);
    try {
      let allTeams: Team[];

      if (role === validationStrings.ADMIN) {
        allTeams = await teamApiService.getAllTeams();
      } else {
        const myEventIds = events
          .filter(e => e.organizerId === user?.email)
          .map(e => e.id);
        const allTeamsForEvents = await teamApiService.getAllTeams();
        allTeams = allTeamsForEvents.filter(t => myEventIds.includes(t.eventId));
      }

      setTeams(allTeams);
      setFilteredTeams(allTeams);
    } catch (error) {
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_LOAD_TEAMS);
    } finally {
      setLoading(false);
    }
  }, [role, user, events]);

  useFocusEffect(
    useCallback(() => {
      loadTeams();
    }, [loadTeams])
  );

  useEffect(() => {
    let filtered = teams;

    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(team => team.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(team => {
        const event = events.find(e => e.id === team.eventId);
        return (
          event?.title.toLowerCase().includes(query) ||
          team.members.some(m => m.name.toLowerCase().includes(query))
        );
      });
    }

    setFilteredTeams(filtered);
  }, [searchQuery, filterStatus, teams, events]);

  const handleApprove = useCallback(async (teamId: string) => {
    try {
      await teamApiService.approveTeam(teamId, user?.email || '');
      Alert.alert(validationStrings.SUCCESS, validationStrings.TEAM_APPROVED_SUCCESSFULLY);
      loadTeams();
    } catch (error: any) {
      Alert.alert(validationStrings.ERROR, error.message || validationStrings.TEAM_APPROVAL_FAILED);
    }
  }, [user, loadTeams]);

  const handleReject = useCallback((teamId: string) => {
    Alert.prompt(
      validationStrings.REJECT_TEAM,
      validationStrings.REASON_FOR_REJECTION,
      [
        { text: validationStrings.CANCEL, style: 'cancel' },
        {
          text: validationStrings.REJECT,
          style: 'destructive',
          onPress: async (reason: any) => {
            if (!reason || !reason.trim()) {
              Alert.alert(validationStrings.ERROR, validationStrings.PROVIDE_REASON);
              return;
            }
            try {
              await teamApiService.rejectTeam(teamId, user?.email || '', reason);
              Alert.alert(validationStrings.SUCCESS, validationStrings.TEAM_REJECTED);
              loadTeams();
            } catch (error: any) {
              Alert.alert(validationStrings.ERROR, error.message || validationStrings.REJECT_FAIL);
            }
          },
        },
      ],
      'plain-text'
    );
  }, [user, loadTeams]);

  const handleDelete = useCallback((teamId: string) => {
    Alert.alert(
      validationStrings.DELETE_CONFIRMATION,
      validationStrings.CONFIRM_DELETE_EVENT,
      [
        { text: validationStrings.CANCEL, style: 'cancel' },
        {
          text: validationStrings.DELETE,
          style: 'destructive',
          onPress: async () => {
            try {
              await teamApiService.deleteTeam(teamId);
              Alert.alert(validationStrings.SUCCESS, validationStrings.TEAM_DELETE_SUCCESS);
              loadTeams();
            } catch (error: any) {
              Alert.alert(validationStrings.ERROR, error.message || validationStrings.TEAM_DELETE_FAIL);
            }
          },
        },
      ]
    );
  }, [loadTeams]);

  const getStats = useCallback(() => {
    return {
      pending: teams.filter(t => t.status === TeamStatus.PENDING).length,
      approved: teams.filter(t => t.status === TeamStatus.APPROVED).length,
      rejected: teams.filter(t => t.status === TeamStatus.REJECTED).length,
    };
  }, [teams]);

  const getStatusBadgeStyle = useCallback((status: TeamStatus, styles: any) => {
    switch (status) {
      case TeamStatus.PENDING:
        return styles.pendingBadge;
      case TeamStatus.APPROVED:
        return styles.approvedBadge;
      case TeamStatus.REJECTED:
        return styles.rejectedBadge;
    }
  }, []);

  const getStatusIcon = useCallback((status: TeamStatus) => {
    switch (status) {
      case TeamStatus.PENDING:
        return 'pending';
      case TeamStatus.APPROVED:
        return 'check-circle';
      case TeamStatus.REJECTED:
        return 'cancel';
    }
  }, []);

  const getEventForTeam = useCallback((eventId: string) => {
    return events.find(e => e.id === eventId);
  }, [events]);

  return {
    teams,
    filteredTeams,
    loading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    handleApprove,
    handleReject,
    handleDelete,
    loadTeams,
    getStats,
    getStatusBadgeStyle,
    getStatusIcon,
    getEventForTeam,
  };
};