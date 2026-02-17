import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { registrationApiService } from '../api/registrationApiService';
import { eventApiService } from '../api/eventApiService';
import { teamApiService } from '../api/teamApiService';
import { useAuth } from '../context/authContext';
import { ParticipantRegistration, RegistrationStatus } from '../models/participantRegistration';
import { Event } from '../models/event';
import { PlayFormat } from '../models/event';
import Colors from '../constants/colors';
import { headerStrings, validationStrings } from '../constants/validationStrings';

interface RegistrationWithEvent extends ParticipantRegistration {
  eventDetails?: Event;
}

type FilterType = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface EventFormatGroup {
  eventId: string;
  eventTitle: string;
  format: PlayFormat;
  approvedCount: number;
  teamsCreated: number;
  canCreateTeams: boolean;
}

export const useManageRegistrationsViewModel = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();
  const role = route.params?.role;

  const [registrations, setRegistrations] = useState<RegistrationWithEvent[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<RegistrationWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');

  const [eventFormatGroups, setEventFormatGroups] = useState<EventFormatGroup[]>([]);

  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationWithEvent | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const calculateEventFormatGroups = async (regs: RegistrationWithEvent[]) => {
    const approvedRegs = regs.filter(r => r.status === RegistrationStatus.APPROVED);
    const groupMap = new Map<string, EventFormatGroup>();

    for (const reg of approvedRegs) {
      const key = `${reg.eventId}_${reg.format}`;

      if (!groupMap.has(key)) {
        const existingTeams = await teamApiService.getTeamsByEventAndFormat(
          reg.eventId,
          reg.format
        );

        groupMap.set(key, {
          eventId: reg.eventId,
          eventTitle: reg.eventDetails?.title || validationStrings.UNKNOWN_EVENT,
          format: reg.format,
          approvedCount: 1,
          teamsCreated: existingTeams.length,
          canCreateTeams: true,
        });
      } else {
        const group = groupMap.get(key)!;
        group.approvedCount++;
      }
    }

    setEventFormatGroups(Array.from(groupMap.values()));
  };

  const loadRegistrations = async () => {
    try {
      const allRegs = await registrationApiService.getAllRegistrations();

      const regsWithEvents = await Promise.all(
        allRegs.map(async (reg) => {
          const event = await eventApiService.getEventById(reg.eventId);
          return { ...reg, eventDetails: event };
        })
      );

      let filteredRegs = regsWithEvents;
      if (role === validationStrings.ORGANIZER) {
        const currentOrganizerId = user?.email || user?.id;
        filteredRegs = regsWithEvents.filter(
          reg => reg.eventDetails?.organizerId === currentOrganizerId
        );
      }

      setRegistrations(filteredRegs);
      applyFilters(filteredRegs, filter, searchQuery);

      await calculateEventFormatGroups(filteredRegs);
    } catch (error) {
      console.error(validationStrings.FAILED_TO_LOAD_REGISTRATIONS, error);
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_LOAD_REGISTRATIONS_MESSAGE);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRegistrations();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadRegistrations();
  };

  const applyFilters = (
    regs: RegistrationWithEvent[],
    statusFilter: FilterType,
    query: string
  ) => {
    let filtered = regs;

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(reg => {
        switch (statusFilter) {
          case 'PENDING':
            return reg.status === RegistrationStatus.PENDING;
          case 'APPROVED':
            return reg.status === RegistrationStatus.APPROVED;
          case 'REJECTED':
            return reg.status === RegistrationStatus.REJECTED;
          default:
            return true;
        }
      });
    }

    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        reg =>
          reg.participantName.toLowerCase().includes(lowerQuery) ||
          reg.participantEmail.toLowerCase().includes(lowerQuery) ||
          reg.eventDetails?.title.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredRegistrations(filtered);
  };

  useEffect(() => {
    applyFilters(registrations, filter, searchQuery);
  }, [filter, searchQuery, registrations]);

  const handleApprove = async (registration: RegistrationWithEvent) => {
    try {
      const isFull = await eventApiService.isFormatFull(
        registration.eventId,
        registration.format
      );

      if (isFull) {
        Alert.alert(
          validationStrings.FORMAT_FULL_TITLE,
          validationStrings.FORMAT_FULL_MESSAGE,
          [{ text: validationStrings.OK }]
        );
        return;
      }

      const approverEmail = user?.email || validationStrings.ADMIN_EMAIL;

      await registrationApiService.approveRegistration(
        registration.id,
        approverEmail
      );

      await eventApiService.registerTeam(
        registration.eventId,
        registration.format
      );

      Alert.alert(validationStrings.SUCCESS, validationStrings.REGISTRATION_APPROVED_SUCCESS);
      loadRegistrations();
    } catch (error: any) {
      Alert.alert(validationStrings.ERROR, error.message || validationStrings.FAILED_TO_APPROVE_REGISTRATION);
    }
  };

  const handleReject = (registration: RegistrationWithEvent) => {
    setSelectedRegistration(registration);
    setRejectionReason('');
    setShowRejectionModal(true);
  };

  const confirmReject = async () => {
    if (!selectedRegistration) return;

    if (!rejectionReason.trim()) {
      Alert.alert(validationStrings.ERROR, validationStrings.PROVIDE_REJECTION_REASON);
      return;
    }

    try {
      const rejecterEmail = user?.email || validationStrings.ADMIN_EMAIL;

      await registrationApiService.rejectRegistration(
        selectedRegistration.id,
        rejecterEmail,
        rejectionReason
      );

      Alert.alert(validationStrings.SUCCESS, validationStrings.REGISTRATION_REJECTED_SUCCESS);
      setShowRejectionModal(false);
      setSelectedRegistration(null);
      setRejectionReason('');
      loadRegistrations();
    } catch (error) {
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_REJECT_REGISTRATION);
    }
  };

  const handleBulkApprove = () => {
    const pendingRegs = filteredRegistrations.filter(
      r => r.status === RegistrationStatus.PENDING
    );

    if (pendingRegs.length === 0) {
      Alert.alert(validationStrings.NO_PENDING_REGISTRATIONS, validationStrings.NO_PENDING_TO_APPROVE);
      return;
    }

    Alert.alert(
      validationStrings.BULK_APPROVE_TITLE,
      validationStrings.BULK_APPROVE_MESSAGE(pendingRegs.length),
      [
        { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
        {
          text: validationStrings.APPROVE_ALL,
          onPress: async () => {
            let successCount = 0;
            let failCount = 0;

            const approverEmail = user?.email || validationStrings.ADMIN_EMAIL;

            for (const reg of pendingRegs) {
              try {
                const isFull = await eventApiService.isFormatFull(
                  reg.eventId,
                  reg.format
                );

                if (!isFull) {
                  await registrationApiService.approveRegistration(reg.id, approverEmail);
                  await eventApiService.registerTeam(reg.eventId, reg.format);
                  successCount++;
                } else {
                  failCount++;
                }
              } catch (error) {
                failCount++;
              }
            }

            Alert.alert(
              validationStrings.BULK_APPROVE_COMPLETE,
              validationStrings.BULK_APPROVE_RESULT(successCount, failCount),
              [
                {
                  text: validationStrings.OK,
                  onPress: () => loadRegistrations(),
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleCreateTeams = (group: EventFormatGroup) => {
    navigation.navigate(validationStrings.SCREEN_CREATE_TEAMS, {
      eventId: group.eventId,
      format: group.format,
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const closeRejectionModal = () => {
    setShowRejectionModal(false);
    setSelectedRegistration(null);
    setRejectionReason('');
  };

  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === RegistrationStatus.PENDING).length,
    approved: registrations.filter(r => r.status === RegistrationStatus.APPROVED).length,
    rejected: registrations.filter(r => r.status === RegistrationStatus.REJECTED).length,
  };

  const getStatusColor = (status: RegistrationStatus) => {
    switch (status) {
      case RegistrationStatus.APPROVED:
        return Colors.COLOR_GREEN;
      case RegistrationStatus.PENDING:
        return Colors.COLOR_ORANGE;
      case RegistrationStatus.REJECTED:
        return Colors.iconDelete;
      default:
        return Colors.iconSecondary;
    }
  };

  return {
    filteredRegistrations,
    loading,
    refreshing,
    filter,
    searchQuery,
    eventFormatGroups,
    showRejectionModal,
    selectedRegistration,
    rejectionReason,
    stats,

    setFilter,
    setSearchQuery,
    setRejectionReason,
    onRefresh,
    handleApprove,
    handleReject,
    confirmReject,
    handleBulkApprove,
    handleCreateTeams,
    clearSearch,
    closeRejectionModal,

    getStatusColor,
  };
};

export type { RegistrationWithEvent, FilterType, EventFormatGroup };