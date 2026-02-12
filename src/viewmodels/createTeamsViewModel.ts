import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { registrationApiService } from '../api/registrationApiService';
import { teamApiService } from '../api/teamApiService';
import { matchApiService } from '../api/matchApiService';
import { eventApiService } from '../api/eventApiService';
import { ParticipantRegistration, RegistrationStatus } from '../models/participantRegistration';
import { Team, TeamMember, TeamType } from '../models/team';
import { PlayFormat, getRegistrationPercentage, meetsThreshold, REGISTRATION_THRESHOLD, isChess } from '../models/event';
import { Gender } from '../models/user';
import Colors from '../constants/colors';
import { validationStrings } from '../constants/validationStrings';

export const useCreateTeamsViewModel = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { eventId, format }: { eventId: string; format: PlayFormat } = route.params;
  const isMountedRef = useRef(true);

  const [approvedParticipants, setApprovedParticipants] = useState<ParticipantRegistration[]>([]);
  const [existingTeams, setExistingTeams] = useState<Team[]>([]);
  const [existingMatches, setExistingMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail] = useState(validationStrings.ADMIN_EMAIL);
  const [event, setEvent] = useState<any>(null);

  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const is1v1 = format === validationStrings.FORMAT_1V1;
  const teamSize = is1v1 ? 1 : 2;

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

      const eventData = await eventApiService.getEventById(eventId);
      if (eventData && isMountedRef.current) {
        setEvent(eventData);
      }

      const registrations = await registrationApiService.getRegistrationsByEventAndFormat(
        eventId,
        format
      );
      const approved = registrations.filter(
        r => r.status === RegistrationStatus.APPROVED
      );

      const teams = await teamApiService.getTeamsByEventAndFormat(eventId, format);
      const matches = await matchApiService.getMatchesByEventAndFormat(eventId, format);

      const assignedParticipantIds = new Set(
        teams.flatMap(team => team.members.map(m => m.userId))
      );
      const unassigned = approved.filter(
        p => !assignedParticipantIds.has(p.participantEmail)
      );

      if (isMountedRef.current) {
        setApprovedParticipants(unassigned);
        setExistingTeams(teams);
        setExistingMatches(matches);

        await checkDeadlineAndThreshold(eventData, unassigned, teams);
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

  const checkDeadlineAndThreshold = useCallback(async (
    eventData: any,
    unassigned: ParticipantRegistration[],
    teams: Team[]
  ) => {
    if (!eventData) return;

    const now = new Date();
    const deadline = new Date(eventData.registrationDeadline);
    const deadlineReached = now >= deadline;

    if (!deadlineReached) return;

    const formatData = eventData.availableFormats.find((f: any) => f.format === format);
    if (!formatData) return;

    const isChessEvent = isChess(eventData.sportType);

    if (isChessEvent) {
      const combinedPercentage = getRegistrationPercentage(formatData, validationStrings.TOTAL);

      if (meetsThreshold(combinedPercentage)) {
        showReadyToCreateFixturesDialog(
          formatData.registeredMaleCount + formatData.registeredFemaleCount,
          formatData.maxMaleParticipants + formatData.maxFemaleParticipants,
          combinedPercentage,
          teams.length > 0
        );
      } else {
        showExtendDeadlineDialogChess(
          formatData.registeredMaleCount + formatData.registeredFemaleCount,
          formatData.maxMaleParticipants + formatData.maxFemaleParticipants,
          combinedPercentage,
          teams.length > 0
        );
      }
    } else {
      const malePercentage = getRegistrationPercentage(formatData, validationStrings.MALE);
      const femalePercentage = getRegistrationPercentage(formatData, validationStrings.FEMALE);

      const maleThresholdMet = meetsThreshold(malePercentage);
      const femaleThresholdMet = meetsThreshold(femalePercentage);

      if (maleThresholdMet && femaleThresholdMet) {
        showReadyToCreateFixturesDialogGender(
          formatData.registeredMaleCount,
          formatData.maxMaleParticipants,
          malePercentage,
          formatData.registeredFemaleCount,
          formatData.maxFemaleParticipants,
          femalePercentage,
          teams.length > 0
        );
      } else {
        showExtendDeadlineDialogGender(
          formatData.registeredMaleCount,
          formatData.maxMaleParticipants,
          malePercentage,
          formatData.registeredFemaleCount,
          formatData.maxFemaleParticipants,
          femalePercentage,
          maleThresholdMet,
          femaleThresholdMet,
          teams.length > 0
        );
      }
    }
  }, [eventId, format, event, navigation]);

  const showReadyToCreateFixturesDialog = useCallback((
    totalCount: number,
    totalMax: number,
    percentage: number,
    hasTeams: boolean
  ) => {
    setTimeout(() => {
      Alert.alert(
        validationStrings.REGISTRATION_COMPLETE_EMOJI,
        validationStrings.READY_CREATE_FIXTURES_DETAIL(totalCount, totalMax, percentage),
        [
          {
            text: hasTeams ? validationStrings.CREATE_FIXTURES : validationStrings.CREATE_TEAM,
            onPress: () => {
              if (hasTeams) {
                navigation.navigate(validationStrings.SCREEN_FIXTURE_CREATION, {
                  eventId,
                  format,
                  event,
                });
              }
            },
          },
          { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
        ]
      );
    }, 500);
  }, [eventId, format, event, navigation]);

  const showReadyToCreateFixturesDialogGender = useCallback((
    maleCount: number,
    maleMax: number,
    malePercentage: number,
    femaleCount: number,
    femaleMax: number,
    femalePercentage: number,
    hasTeams: boolean
  ) => {
    setTimeout(() => {
      Alert.alert(
        validationStrings.REGISTRATION_COMPLETE,
        `${validationStrings.READY_TO_CREATE_FIXTURES}\n\n${validationStrings.MALE_REGISTRATIONS_PERCENTAGE(maleCount, maleMax, Math.round(malePercentage))}\n${validationStrings.FEMALE_REGISTRATIONS_PERCENTAGE(femaleCount, femaleMax, Math.round(femalePercentage))}`,
        [
          {
            text: hasTeams ? validationStrings.CREATE_FIXTURES : validationStrings.CREATE_TEAM,
            onPress: () => {
              if (hasTeams) {
                navigation.navigate(validationStrings.SCREEN_FIXTURE_CREATION, {
                  eventId,
                  format,
                  event,
                });
              }
            },
          },
          { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
        ]
      );
    }, 500);
  }, [eventId, format, event, navigation]);

  const showExtendDeadlineDialogChess = useCallback((
    totalCount: number,
    totalMax: number,
    percentage: number,
    hasTeams: boolean
  ) => {
    setTimeout(() => {
      Alert.alert(
        validationStrings.REGISTRATION_THRESHOLD_NOT_MET,
        `Registration below ${REGISTRATION_THRESHOLD * 100}% threshold.\n\nTotal: ${totalCount}/${totalMax} (${Math.round(percentage)}%)\n\n${validationStrings.EXTEND_DEADLINE_QUESTION}`,
        [
          {
            text: validationStrings.EXTEND_BY_DAYS(1),
            onPress: () => handleExtendDeadline(1),
          },
          {
            text: validationStrings.EXTEND_BY_DAYS(3),
            onPress: () => handleExtendDeadline(3),
          },
          {
            text: validationStrings.EXTEND_BY_DAYS(7),
            onPress: () => handleExtendDeadline(7),
          },
          {
            text: hasTeams ? validationStrings.CREATE_FIXTURES_ANYWAY : validationStrings.PROCEED_WITH_FIXTURES,
            onPress: () => {
              if (hasTeams) {
                navigation.navigate(validationStrings.SCREEN_FIXTURE_CREATION, {
                  eventId,
                  format,
                  event,
                });
              }
            },
          },
          { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
        ]
      );
    }, 500);
  }, [eventId, format, event, navigation]);

  const showExtendDeadlineDialogGender = useCallback((
    maleCount: number,
    maleMax: number,
    malePercentage: number,
    femaleCount: number,
    femaleMax: number,
    femalePercentage: number,
    maleThresholdMet: boolean,
    femaleThresholdMet: boolean,
    hasTeams: boolean
  ) => {
    const message = !maleThresholdMet && !femaleThresholdMet
      ? validationStrings.BOTH_GENDERS_BELOW_THRESHOLD
      : validationStrings.ONE_GENDER_BELOW_THRESHOLD;

    setTimeout(() => {
      Alert.alert(
        validationStrings.REGISTRATION_THRESHOLD_NOT_MET,
        `${message}\n\n${validationStrings.MALE_REGISTRATIONS_PERCENTAGE(maleCount, maleMax, Math.round(malePercentage))}\n${validationStrings.FEMALE_REGISTRATIONS_PERCENTAGE(femaleCount, femaleMax, Math.round(femalePercentage))}\n\n${validationStrings.EXTEND_DEADLINE_QUESTION}`,
        [
          {
            text: validationStrings.EXTEND_BY_DAYS(1),
            onPress: () => handleExtendDeadline(1),
          },
          {
            text: validationStrings.EXTEND_BY_DAYS(3),
            onPress: () => handleExtendDeadline(3),
          },
          {
            text: validationStrings.EXTEND_BY_DAYS(7),
            onPress: () => handleExtendDeadline(7),
          },
          {
            text: hasTeams ? validationStrings.CREATE_FIXTURES_ANYWAY : validationStrings.PROCEED_WITH_FIXTURES,
            onPress: () => {
              if (hasTeams) {
                navigation.navigate(validationStrings.SCREEN_FIXTURE_CREATION, {
                  eventId,
                  format,
                  event,
                });
              }
            },
          },
          { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
        ]
      );
    }, 500);
  }, [eventId, format, event, navigation]);

  const handleExtendDeadline = useCallback(async (days: number) => {
    try {
      const currentDeadline = new Date(event.registrationDeadline);
      currentDeadline.setDate(currentDeadline.getDate() + days);
      const newDeadline = currentDeadline.toISOString().split(validationStrings.DATE_SEPARATOR)[0];

      await eventApiService.extendDeadline(eventId, newDeadline);
      Alert.alert(validationStrings.SUCCESS, validationStrings.DEADLINE_EXTENDED_SUCCESS);
      loadData();
    } catch (error) {
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_UPDATE);
    }
  }, [event, eventId, loadData]);

  const handleAutoGenerate = useCallback(() => {
    if (!isMountedRef.current) return;

    if (approvedParticipants.length === 0) {
      Alert.alert(validationStrings.NO_PARTICIPANT, validationStrings.NO_UNASSAIGNED_PART);
      return;
    }

    const requiredCount = is1v1 ? 2 : 2;
    if (approvedParticipants.length < requiredCount) {
      Alert.alert(
        validationStrings.INSUFFICIENT_PARTICIPANTS,
        `Need at least ${requiredCount} participants to create ${is1v1 ? 'matches' : 'teams'} for ${format} format`
      );
      return;
    }

    if (existingMatches.length > 0) {
      Alert.alert(
        validationStrings.FIXTURES_ALREADY_EXIST,
        validationStrings.FIXTURES_DELETE_BEFORE_CREATE(existingMatches.length),
        [{ text: validationStrings.OK }]
      );
      return;
    }

    const actionText = is1v1
      ? validationStrings.AUTO_GENERATE_MATCHES_DETAIL(approvedParticipants.length)
      : validationStrings.AUTO_GENERATE_TEAMS_DETAIL(approvedParticipants.length);

    Alert.alert(
      is1v1 ? validationStrings.AUTO_GENERATE_MATCHES : validationStrings.AUTO_GENERATE_TEAM_AND_MATCHES,
      `${actionText}\n\nProceed?`,
      [
        { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
        {
          text: validationStrings.GENERATE,
          onPress: async () => {
            try {
              if (is1v1) {
                await handle1v1DirectFixtureCreation();
              } else {
                await handle2v2TeamCreation();
              }
            } catch (error: any) {
              console.error(validationStrings.AUTO_GENERATION_ERROR, error);
              Alert.alert(validationStrings.ERROR, error.message || validationStrings.FAILED_TO_CREATE);
            }
          },
        },
      ]
    );
  }, [approvedParticipants, format, is1v1, existingMatches.length, eventId, adminEmail]);

  const handle1v1DirectFixtureCreation = useCallback(async () => {
    navigation.navigate(validationStrings.SCREEN_FIXTURE_CREATION, {
      eventId,
      format,
      event,
      directParticipants: approvedParticipants,
    });
  }, [approvedParticipants, eventId, format, event, navigation]);

  const handle2v2TeamCreation = useCallback(async () => {
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

    Alert.alert(
      validationStrings.SUCCESS,
      validationStrings.TEAMS_CREATED_SUCCESS_DETAIL(teams.length),
      [
        {
          text: validationStrings.GENERATE_FIXTURES_NOW,
          onPress: () => {
            navigation.navigate(validationStrings.SCREEN_FIXTURE_CREATION, {
              eventId,
              format,
              event,
            });
          },
        },
        {
          text: validationStrings.LATER,
          style: validationStrings.ALERT_STYLE_CANCEL,
          onPress: () => loadData(),
        },
      ]
    );
  }, [approvedParticipants, format, eventId, adminEmail, navigation, loadData]);

  const handleManualCreate = useCallback(() => {
    if (!isMountedRef.current) return;

    if (approvedParticipants.length === 0) {
      Alert.alert(validationStrings.NO_PARTICIPANT, validationStrings.NO_UNASSIGNED_PART);
      return;
    }

    if (is1v1) {
      Alert.alert(
        validationStrings.MANUAL_NOT_AVAILABLE_1V1,
        validationStrings.USE_AUTO_GENERATE_1V1,
        [{ text: validationStrings.OK }]
      );
      return;
    }

    setSelectedParticipants([]);
    setShowManualModal(true);
  }, [approvedParticipants.length, is1v1]);

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

      if (!is1v1 && members.length === 2) {
        const genders = members.map(m => m.gender);
        const uniqueGenders = [...new Set(genders)];

        if (uniqueGenders.length > 1) {
          Alert.alert(
            validationStrings.INVALID_TEAM_GENDER_COMPOSITION,
            validationStrings.TEAMS_SAME_GENDER_ONLY,
            [{ text: validationStrings.OK }]
          );
          return;
        }
      }

      await teamApiService.createTeam(eventId, format, members, adminEmail);

      Alert.alert(validationStrings.SUCCESS, validationStrings.TEAM_SUCCESSFULLY_CREATED);
      setShowManualModal(false);
      setSelectedParticipants([]);
      loadData();
    } catch (error: any) {
      Alert.alert(validationStrings.ERROR, error.message || validationStrings.CREATE_TEAM_FAILED);
    }
  }, [selectedParticipants, teamSize, format, approvedParticipants, eventId, adminEmail, loadData, is1v1]);

  const handleDeleteTeam = useCallback((team: Team) => {
    if (!isMountedRef.current) return;

    Alert.alert(
      validationStrings.DELETE_CONFIRMATION,
      `Delete ${team.teamName}?\n\nMembers will become available for reassignment.`,
      [
        { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
        {
          text: validationStrings.DELETE,
          style: validationStrings.ALERT_STYLE_DESTRUCTIVE,
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

    if (existingMatches.length > 0) {
      Alert.alert(
        validationStrings.FIXTURES_ALREADY_EXIST,
        validationStrings.FIXTURES_EXIST_VIEW(existingMatches.length),
        [
          {
            text: validationStrings.VIEW_FIXTURES,
            onPress: () => {
              navigation.navigate(validationStrings.SCREEN_FIXTURE_CREATION, {
                eventId,
                format,
                event,
              });
            },
          },
          { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
        ]
      );
      return;
    }

    if (is1v1) {
      if (approvedParticipants.length < 2) {
        Alert.alert(
          validationStrings.INSUFFICIENT_PARTICIPANTS,
          validationStrings.TWO_PARTICIPANTS_NEEDED
        );
        return;
      }

      navigation.navigate(validationStrings.SCREEN_FIXTURE_CREATION, {
        eventId,
        format,
        event,
        directParticipants: approvedParticipants,
      });
    } else {
      if (existingTeams.length < 2) {
        Alert.alert(
          validationStrings.INSUFFICIENT_TEAMS,
          validationStrings.NEED_ATLEAST_MIN_TEAMS
        );
        return;
      }

      navigation.navigate(validationStrings.SCREEN_FIXTURE_CREATION, {
        eventId,
        format,
        event,
      });
    }
  }, [existingTeams, existingMatches.length, approvedParticipants, is1v1, eventId, format, event, navigation]);

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
        return validationStrings.MALE_ICON;
      case TeamType.FEMALE:
        return validationStrings.FEMALE_ICON;
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
    is1v1,
    existingMatches,
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