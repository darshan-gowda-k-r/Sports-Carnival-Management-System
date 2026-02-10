import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { registrationApiService } from '../api/registrationApiService';
import { teamApiService } from '../api/teamApiService';
import { matchApiService } from '../api/matchApiService';
import { ParticipantRegistration, RegistrationStatus } from '../models/participantRegistration';
import { Team, TeamMember, TeamType } from '../models/team';
import { PlayFormat } from '../models/event';
import { Gender } from '../models/user';
import Colors from '../constants/colors';
import { headerStrings, validationStrings } from '../constants/validationStrings';

export const useCreateTeamsViewModel = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { eventId, format }: { eventId: string; format: PlayFormat } = route.params;
  const isMountedRef = useRef(true);

  const [approvedParticipants, setApprovedParticipants] = useState<ParticipantRegistration[]>([]);
  const [existingTeams, setExistingTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail] = useState('admin@gmail.com');

  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const teamSize = format === '1v1' ? 1 : 2;

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      setLoading(true);

      const registrations = await registrationApiService.getRegistrationsByEventAndFormat(
        eventId,
        format
      );
      const approved = registrations.filter(
        r => r.status === RegistrationStatus.APPROVED
      );

      const teams = await teamApiService.getTeamsByEventAndFormat(eventId, format);

      const assignedParticipantIds = new Set(
        teams.flatMap(team => team.members.map(m => m.userId))
      );
      const unassigned = approved.filter(
        p => !assignedParticipantIds.has(p.participantEmail)
      );

      if (isMountedRef.current) {
        setApprovedParticipants(unassigned);
        setExistingTeams(teams);
      }
    } catch (error) {
      console.error(validationStrings.FAILED_TO_LOAD_DATA, error);
      if (isMountedRef.current) {
        Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_LOAD_PART);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [eventId, format]);

  const handleAutoGenerate = useCallback(() => {
    if (!isMountedRef.current) return;

    if (approvedParticipants.length === 0) {
      Alert.alert(validationStrings.NO_PARTICIPANT, validationStrings.NO_UNASSAIGNED_PART);
      return;
    }

    const requiredCount = format === '1v1' ? 1 : 2;
    if (approvedParticipants.length < requiredCount) {
      Alert.alert(
        validationStrings.INSUFFICIENT_PARTICIPANTS,
        `Need at least ${requiredCount} participant(s) to create a team for ${format} format`
      );
      return;
    }

    Alert.alert(
      validationStrings.AUTO_GENERATE_TEAM_AND_MATCHES,
      `This will:\n• Create teams from ${approvedParticipants.length} participants\n• Generate matches between teams of same gender\n\nProceed?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            try {
              const teams = await teamApiService.autoCreateTeams(
                eventId,
                format,
                approvedParticipants as ParticipantRegistration[],
                adminEmail
              );

              if (teams.length === 0) {
                Alert.alert(validationStrings.NO_TEAMS_CREATED, validationStrings.NOT_ENOUGH_PART);
                loadData();
                return;
              }

              const matches = await matchApiService.autoGenerateMatches(
                eventId,
                format,
                teams,
                new Date().toISOString().split('T')[0],
                '10:00 AM',
                'Main Venue',
                adminEmail,
                'round-robin'
              );

              Alert.alert(
                validationStrings.SUCCESS,
                `Created:\n• ${teams.length} team(s)\n• ${matches.length} match(es)\n\nMatches grouped by gender (same gender teams play each other)`,
                [
                  {
                    text: 'OK',
                    onPress: () => loadData(),
                  },
                ]
              );
            } catch (error: any) {
              console.error(validationStrings.AUTO_GENERATION_ERROR, error);
              Alert.alert(validationStrings.ERROR, error.message || 'Failed to generate teams and matches');
            }
          },
        },
      ]
    );
  }, [approvedParticipants, format, eventId, adminEmail, loadData]);

  const handleManualCreate = useCallback(() => {
    if (!isMountedRef.current) return;

    if (approvedParticipants.length === 0) {
      Alert.alert(validationStrings.NO_PARTICIPANT, validationStrings.NO_UNASSIGNED_PART);
      return;
    }

    setSelectedParticipants([]);
    setShowManualModal(true);
  }, [approvedParticipants.length]);

  const toggleParticipantSelection = useCallback((participantEmail: string) => {
    if (!isMountedRef.current) return;

    setSelectedParticipants(prev => {
      if (prev.includes(participantEmail)) {
        return prev.filter(id => id !== participantEmail);
      } else {
        if (prev.length < teamSize) {
          return [...prev, participantEmail];
        } else {
          Alert.alert(
            validationStrings.TEAM_FULL,
            `${format} teams can have maximum ${teamSize} member(s)`
          );
          return prev;
        }
      }
    });
  }, [teamSize, format]);

  const createManualTeam = useCallback(async () => {
    if (!isMountedRef.current) return;

    if (selectedParticipants.length !== teamSize) {
      Alert.alert(
        validationStrings.INVALID_TEAM_SIZE,
        `${format} teams must have exactly ${teamSize} member(s)`
      );
      return;
    }

    try {
      const members = approvedParticipants
        .filter(p => selectedParticipants.includes(p.participantEmail))
        .map(
          p =>
            ({
              userId: p.participantEmail,
              name: p.participantName,
              gender: p.participantGender,
            } as TeamMember)
        );

      await teamApiService.createTeam(eventId, format, members, adminEmail);

      Alert.alert(validationStrings.SUCCESS, validationStrings.TEAM_SUCCESSFULLY_CREATED);
      setShowManualModal(false);
      setSelectedParticipants([]);
      loadData();
    } catch (error: any) {
      Alert.alert(validationStrings.ERROR, error.message || validationStrings.CREATE_TEAM_FAILED);
    }
  }, [selectedParticipants, teamSize, format, approvedParticipants, eventId, adminEmail, loadData]);

  const handleDeleteTeam = useCallback((team: Team) => {
    if (!isMountedRef.current) return;

    Alert.alert(
      'Delete Team',
      `Delete ${team.teamName}?\n\nMembers will become available for reassignment.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await teamApiService.deleteTeam(team.id);
              Alert.alert(validationStrings.SUCCESS, validationStrings.TEAM_DELETE_SUCCESS);
              loadData();
            } catch (error) {
              Alert.alert(validationStrings.ERROR, validationStrings.TEAM_DELETE_FAIL);
            }
          },
        },
      ]
    );
  }, [loadData]);

  const handleGenerateMatches = useCallback(async () => {
    if (!isMountedRef.current) return;

    if (existingTeams.length < 2) {
      Alert.alert(
        validationStrings.INSUFFICIENT_TEAMS,
        validationStrings.NEED_ATLEAST_MIN_TEAMS
      );
      return;
    }

    Alert.alert(
      validationStrings.GENERATE_MATCHES,
      `Create matches from ${existingTeams.length} existing teams?\n\nMatches will be grouped by gender.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            try {
              const matches = await matchApiService.autoGenerateMatches(
                eventId,
                format,
                existingTeams,
                new Date().toISOString().split('T')[0],
                '10:00 AM',
                'Main Venue',
                adminEmail,
                'round-robin'
              );

              Alert.alert(
                validationStrings.SUCCESS,
                `Created ${matches.length} match(es) successfully`
              );
            } catch (error: any) {
              Alert.alert(validationStrings.ERROR, error.message || 'Failed to generate matches');
            }
          },
        },
      ]
    );
  }, [existingTeams, eventId, format, adminEmail]);

  const handleCloseModal = useCallback(() => {
    setShowManualModal(false);
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

  const getTeamTypeIcon = useCallback((teamType: TeamType) => {
    switch (teamType) {
      case TeamType.MALE:
        return 'male';
      case TeamType.FEMALE:
        return 'female';
      case TeamType.MIXED:
        return 'transgender';
      default:
        return 'group';
    }
  }, []);

  const stats = {
    totalApproved: approvedParticipants.length + existingTeams.reduce((sum, t) => sum + t.members.length, 0),
    unassigned: approvedParticipants.length,
    teamsCreated: existingTeams.length,
  };

  return {
    format,
    approvedParticipants,
    existingTeams,
    loading,
    showManualModal,
    selectedParticipants,
    teamSize,
    stats,
    setShowManualModal,
    handleAutoGenerate,
    handleManualCreate,
    toggleParticipantSelection,
    createManualTeam,
    handleDeleteTeam,
    handleGenerateMatches,
    handleCloseModal,
    getTeamTypeColor,
    getTeamTypeIcon,
  };
};