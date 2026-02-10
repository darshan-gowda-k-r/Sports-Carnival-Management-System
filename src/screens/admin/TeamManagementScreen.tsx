import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import Colors from '../../constants/colors';
import { headerStrings, validationStrings } from '../../constants/validationStrings';
import { TeamStatus } from '../../models/team';
import { useTeamManagementViewModel } from '../../viewmodels/teamManagementViewModel';
import styles from './TeamManagementScreenStyle';

const TeamManagementScreen = ({ route }: any) => {
  const { role } = route.params || { role: validationStrings.ADMIN };

  const {
    filteredTeams,
    loading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    handleApprove,
    handleReject,
    handleDelete,
    getStats,
    getStatusBadgeStyle,
    getStatusIcon,
    getEventForTeam,
  } = useTeamManagementViewModel(role);

  const stats = getStats();

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CustomHeader title={headerStrings.TEAM_MANAGEMENT} showBackButton={true} userRole={role} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>{validationStrings.LOADING_TEAMS}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={headerStrings.TEAM_MANAGEMENT}
        showBackButton={true}
        userRole={role}
      />

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={Colors.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={validationStrings.SEARCH_EVENT_MEMBER}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.text_lighter}
          />
        </View>

        <View style={styles.filterContainer}>
          {([validationStrings.ALL, TeamStatus.PENDING, TeamStatus.APPROVED, TeamStatus.REJECTED] as const).map(status => (
            <TouchableOpacity
              key={status}
              style={[styles.filterButton, filterStatus === status && styles.filterButtonActive]}
              onPress={() => setFilterStatus(status)}
            >
              <Text style={[styles.filterButtonText, filterStatus === status && styles.filterButtonTextActive]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>{validationStrings.PENDING}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.approved}</Text>
            <Text style={styles.statLabel}>{validationStrings.APPROVED}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.rejected}</Text>
            <Text style={styles.statLabel}>{validationStrings.REJECTED}</Text>
          </View>
        </View>

        <FlatList
          data={filteredTeams}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const event = getEventForTeam(item.eventId);
            return (
              <View style={styles.teamCard}>
                <View style={styles.teamHeader}>
                  <View style={styles.teamTitleSection}>
                    <Text style={styles.eventTitle}>{event?.title || validationStrings.UNKNOWN_EVENT}</Text>
                    <View style={styles.formatBadge}>
                      <Text style={styles.formatText}>{item.format}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, getStatusBadgeStyle(item.status, styles)]}>
                    <Icon name={getStatusIcon(item.status)} size={16} color={Colors.white} />
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                <View style={styles.teamMembers}>
                  <Text style={styles.membersLabel}>{validationStrings.TEAM_MEMBERS_LABEL}</Text>
                  {item.members.map((member, index) => (
                    <View key={index} style={styles.memberRow}>
                      <Icon name="person" size={16} color={Colors.gray} />
                      <Text style={styles.memberName}>{member.name}</Text>
                      <View style={styles.genderBadge}>
                        <Text style={styles.genderText}>{member.gender}</Text>
                      </View>
                      {member.userId === item.captainId && (
                        <View style={styles.captainBadge}>
                          <Text style={styles.captainText}>{validationStrings.CAPTAIN}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                <View style={styles.teamMeta}>
                  <Text style={styles.metaText}>
                    {validationStrings.CREATED} {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                  {item.approvedBy && (
                    <Text style={styles.metaText}>
                      {validationStrings.BY} {item.approvedBy}
                    </Text>
                  )}
                </View>

                {item.rejectedReason && (
                  <View style={styles.rejectionReasonContainer}>
                    <Icon name="info" size={16} color={Colors.error} />
                    <Text style={styles.rejectionReason}>{item.rejectedReason}</Text>
                  </View>
                )}

                {item.status === TeamStatus.PENDING && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={() => handleApprove(item.id)}
                    >
                      <Icon name="check" size={20} color={Colors.white} />
                      <Text style={styles.approveButtonText}>{validationStrings.APPROVE}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={() => handleReject(item.id)}
                    >
                      <Icon name="close" size={20} color={Colors.white} />
                      <Text style={styles.rejectButtonText}>{validationStrings.REJECT}</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {role === validationStrings.ADMIN && (
                  <TouchableOpacity
                    style={styles.deleteIconButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Icon name="delete" size={20} color={Colors.error} />
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="groups" size={64} color={Colors.border_lighter} />
              <Text style={styles.emptyTitle}>{validationStrings.NO_TEAMS_FOUND}</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery || filterStatus !== validationStrings.ALL
                  ? validationStrings.TRY_ADJUSTING_FILTERS
                  : validationStrings.NO_TEAM_REGISTRATIONS}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default TeamManagementScreen;