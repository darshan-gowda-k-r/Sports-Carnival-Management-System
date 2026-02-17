import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { eventApiService } from '../api/eventApiService';
import { registrationApiService } from '../api/registrationApiService';
import { teamApiService } from '../api/teamApiService';
import { ApiService } from '../api/apiService';
import { UserRole } from '../models/user';
import { RegistrationStatus } from '../models/participantRegistration';
import { validationStrings } from '../constants/validationStrings';

interface SportCount {
  name: string;
  count: number;
}

interface ReportStats {
  totalEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  completedEvents: number;
  totalUsers: number;
  adminUsers: number;
  organizerUsers: number;
  participantUsers: number;
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  totalTeams: number;
  sportBreakdown: SportCount[];
}

export const useReportsViewModel = () => {
  const [stats, setStats] = useState<ReportStats>({
    totalEvents: 0,
    upcomingEvents: 0,
    ongoingEvents: 0,
    completedEvents: 0,
    totalUsers: 0,
    adminUsers: 0,
    organizerUsers: 0,
    participantUsers: 0,
    totalRegistrations: 0,
    pendingRegistrations: 0,
    approvedRegistrations: 0,
    rejectedRegistrations: 0,
    totalTeams: 0,
    sportBreakdown: [],
  });
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);

      const events = await eventApiService.getEvents();
      const users = await ApiService.getAllUsers();
      const registrations = await registrationApiService.getAllRegistrations();
      const teams = await teamApiService.getAllTeams();

      const upcomingEvents = events.filter(e => e.status === validationStrings.UPCOMING).length;
      const ongoingEvents = events.filter(e => e.status === validationStrings.ONGOING).length;
      const completedEvents = events.filter(e => e.status === validationStrings.COMPLETED).length;

      const adminUsers = users.filter(u => u.role === UserRole.ADMIN).length;
      const organizerUsers = users.filter(u => u.role === UserRole.ORGANIZER).length;
      const participantUsers = users.filter(u => u.role === UserRole.PARTICIPANT).length;

      const pendingRegistrations = registrations.filter(
        r => r.status === RegistrationStatus.PENDING
      ).length;
      const approvedRegistrations = registrations.filter(
        r => r.status === RegistrationStatus.APPROVED
      ).length;
      const rejectedRegistrations = registrations.filter(
        r => r.status === RegistrationStatus.REJECTED
      ).length;

      const sportMap = new Map<string, number>();
      events.forEach(event => {
        const count = sportMap.get(event.sportType) || 0;
        sportMap.set(event.sportType, count + 1);
      });

      const sportBreakdown = Array.from(sportMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalEvents: events.length,
        upcomingEvents,
        ongoingEvents,
        completedEvents,
        totalUsers: users.length,
        adminUsers,
        organizerUsers,
        participantUsers,
        totalRegistrations: registrations.length,
        pendingRegistrations,
        approvedRegistrations,
        rejectedRegistrations,
        totalTeams: teams.length,
        sportBreakdown,
      });
    } catch (error) {
      console.error(validationStrings.ERROR_LOADING_USERS, error);
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_LOAD_STATISTICS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const refreshData = useCallback(() => {
    loadStats();
    Alert.alert(validationStrings.SUCCESS, validationStrings.DATA_REFRESHED_SUCCESS);
  }, [loadStats]);

  const exportReport = useCallback(() => {
    Alert.alert(
      validationStrings.EXPORT_REPORT_TITLE,
      validationStrings.EXPORT_REPORT_MESSAGE,
      [{ text: validationStrings.OK }]
    );
  }, []);

  return {
    stats,
    loading,
    refreshData,
    exportReport,
  };
};