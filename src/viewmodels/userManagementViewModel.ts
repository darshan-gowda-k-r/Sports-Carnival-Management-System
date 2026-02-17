import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ApiService } from '../api/apiService';
import { validationStrings, headerStrings } from '../constants/validationStrings';
import { User, UserRole } from '../models/user';

export const useUserManagementViewModel = () => {
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'ALL' | UserRole>('ALL');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const allUsers = await ApiService.getAllUsers();
      setUsers(allUsers);
      setFilteredUsers(allUsers);
    } catch (error) {
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_LOAD);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [loadUsers])
  );

  useEffect(() => {
    let filtered = users;

    if (filterRole !== 'ALL') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterRole, users]);

  const handleDeleteUser = useCallback((email: string, name: string) => {
    Alert.alert(
      validationStrings.DELETE_CONFIRMATION,
      validationStrings.DELETE_MESSAGE(name),
      [
        { text: validationStrings.CANCEL, style: validationStrings.CANCEL },
        {
          text: validationStrings.DELETE,
              style: validationStrings.DESTRUCTIVE,
          onPress: async () => {
            try {
              await ApiService.deleteUser(email);
              Alert.alert(validationStrings.SUCCESS, validationStrings.USER_DELETED);
              loadUsers();
            } catch (error: any) {
              Alert.alert(validationStrings.ERROR, error.message || validationStrings.FAILED_TO_DELETE_USER);
            }
          },
        },
      ]
    );
  }, [loadUsers]);

  const getStats = useCallback(() => {
    return {
      total: users.length,
      organizers: users.filter(u => u.role === UserRole.ORGANIZER).length,
      participants: users.filter(u => u.role === UserRole.PARTICIPANT).length,
    };
  }, [users]);

  const getRoleBadgeStyle = useCallback((role: UserRole, styles: any) => {
    switch (role) {
      case UserRole.ADMIN:
        return styles.adminBadge;
      case UserRole.ORGANIZER:
        return styles.organizerBadge;
      case UserRole.PARTICIPANT:
        return styles.participantBadge;
    }
  }, []);

  const getRoleIcon = useCallback((role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return validationStrings.ADMIN_PANEL;
      case UserRole.ORGANIZER:
        return validationStrings.EVENT;
      case UserRole.PARTICIPANT:
        return validationStrings.PERSON;
    }
  }, []);

  return {
    users,
    filteredUsers,
    loading,
    searchQuery,
    setSearchQuery,
    filterRole,
    setFilterRole,
    handleDeleteUser,
    loadUsers,
    getStats,
    getRoleBadgeStyle,
    getRoleIcon,
  };
};