import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import { UserRole } from '../../models/user';
import Colors from '../../constants/colors';
import { headerStrings, validationStrings } from '../../constants/validationStrings';
import { useUserManagementViewModel } from '../../viewmodels/userManagementViewModel';
import styles from './UserManagementScreenStyle';

const UserManagementScreen = () => {
  const {
    filteredUsers,
    loading,
    searchQuery,
    setSearchQuery,
    filterRole,
    setFilterRole,
    handleDeleteUser,
    getStats,
    getRoleBadgeStyle,
    getRoleIcon,
  } = useUserManagementViewModel();

  const stats = getStats();

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CustomHeader title={headerStrings.USER_MANAGEMENT} showBackButton={true} userRole={validationStrings.ADMIN} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{validationStrings.LOADING_USERS}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={headerStrings.USER_MANAGEMENT}
        showBackButton={true}
        userRole={validationStrings.ADMIN}
      />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={Colors.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={validationStrings.SEARCH_NAME_EMAIL}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.text_lighter}
          />
        </View>

        <View style={styles.filterContainer}>
          {(['ALL', UserRole.ADMIN, UserRole.ORGANIZER, UserRole.PARTICIPANT] as const).map(role => (
            <TouchableOpacity
              key={role}
              style={[styles.filterButton, filterRole === role && styles.filterButtonActive]}
              onPress={() => setFilterRole(role)}
            >
              <Text style={[styles.filterButtonText, filterRole === role && styles.filterButtonTextActive]}>
                {role}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.total}</Text>
            <Text style={styles.statLabel}>{validationStrings.TOTAL_USERS_LABEL}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.organizers}</Text>
            <Text style={styles.statLabel}>{validationStrings.ORGANIZERS}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.participants}</Text>
            <Text style={styles.statLabel}>{validationStrings.PARTICIPANTS}</Text>
          </View>
        </View>

        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.email}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={styles.userIconContainer}>
                <Icon name={getRoleIcon(item.role)} size={28} color={Colors.primary} />
              </View>

              <View style={styles.userInfo}>
                <View style={styles.userHeader}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <View style={[styles.roleBadge, getRoleBadgeStyle(item.role, styles)]}>
                    <Text style={styles.roleBadgeText}>{item.role}</Text>
                  </View>
                </View>

                <Text style={styles.userEmail}>{item.email}</Text>

                {item.gender && (
                  <View style={styles.userMeta}>
                    <Icon name="person" size={14} color={Colors.gray} />
                    <Text style={styles.userMetaText}>{item.gender}</Text>
                  </View>
                )}

                <Text style={styles.userDate}>
                  {validationStrings.JOINED} {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>

              {item.role !== UserRole.ADMIN && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(item.email, item.name)}
                >
                  <Icon name="delete" size={20} color={Colors.error} />
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="people-outline" size={64} color={Colors.border_lighter} />
              <Text style={styles.emptyTitle}>{validationStrings.NO_USERS_FOUND}</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || filterRole !== validationStrings.ALL
                  ? validationStrings.TRY_ADJUSTING_FILTERS
                  : validationStrings.NO_USERS_REGISTERED}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default UserManagementScreen;