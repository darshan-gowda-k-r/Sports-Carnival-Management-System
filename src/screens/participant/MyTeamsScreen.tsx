import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import { useMyTeamsViewModel, type TeamWithEvent } from '../../viewmodels/myTeamsViewModel';
import { TeamStatus } from '../../models/team';
import styles from './MyTeamScreenStyle';
import Colors from '../../constants/colors';
import { headerStrings, validationStrings } from '../../constants/validationStrings';

const MyTeamsScreen = () => {
  const viewModel = useMyTeamsViewModel();

  const renderTeamCard = (team: TeamWithEvent) => {
    const event = team.eventDetails;
    const isCaptain = viewModel.isCaptain(team);

    return (
      <View key={team.id} style={styles.teamCard}>
        <View style={styles.cardHeader}>
          <View style={styles.teamTitleSection}>
            <View
              style={[
                styles.teamTypeIcon,
                { backgroundColor: viewModel.getTeamTypeColor(team.teamType) },
              ]}
            >
              <Icon name="group" size={24} color={Colors.white} />
            </View>
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{team.teamName}</Text>
              <Text style={styles.teamType}>{team.teamType} Team</Text>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: viewModel.getStatusColor(team.status) },
            ]}
          >
            <Text style={styles.statusText}>{team.status}</Text>
          </View>
        </View>

        <View style={styles.eventSection}>
          <Text style={styles.eventTitle}>{event?.title || 'Unknown Event'}</Text>
          <View style={styles.eventMeta}>
            <Icon name="sports" size={16} color={Colors.stats_label} />
            <Text style={styles.eventMetaText}>{event?.sportType}</Text>
            <Text style={styles.divider}>•</Text>
            <Text style={styles.eventMetaText}>{team.format}</Text>
          </View>
          <View style={styles.eventMeta}>
            <Icon name="event" size={16} color={Colors.stats_label} />
            <Text style={styles.eventMetaText}>{event?.date || 'Date TBD'}</Text>
          </View>
        </View>

        <View style={styles.membersSection}>
          <Text style={styles.sectionLabel}>Team Members:</Text>
          {team.members.map((member, index) => (
            <View key={index} style={styles.memberRow}>
              <View style={styles.memberAvatar}>
                <Icon name="person" size={18} color={Colors.white} />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>
                  {member.name}
                  {viewModel.isCurrentUser(member.userId) && ' (You)'}
                </Text>
                <Text style={styles.memberEmail}>{member.userId}</Text>
              </View>
              {member.userId === team.captainId && (
                <View style={styles.captainBadge}>
                  <Icon name="star" size={14} color={Colors.COLOR_ORANGE} />
                  <Text style={styles.captainText}>{validationStrings.CAPTAIN}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {team.status === TeamStatus.REJECTED && team.rejectedReason && (
          <View style={styles.rejectionBox}>
            <Icon name="info" size={18} color={Colors.bg_red} />
            <View style={styles.rejectionContent}>
              <Text style={styles.rejectionLabel}>{validationStrings.REJECTION_REASON}</Text>
              <Text style={styles.rejectionText}>{team.rejectedReason}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.viewEventButton}
          onPress={() => viewModel.navigateToEventDetails(event!)}
          activeOpacity={0.7}
        >
          <Icon name="visibility" size={20} color={Colors.COLOR_BLUE} />
          <Text style={styles.viewEventButtonText}>{validationStrings.VIEW_EVENT_DETAILS}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const stats = viewModel.getStats();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title="My Teams"
        showBackButton={true}
        userRole="PARTICIPANT"
      />

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>{validationStrings.TOTAL}</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={[styles.statValue, { color: Colors.status_pending }]}>
            {stats.pending}
          </Text>
          <Text style={styles.statLabel}>{validationStrings.PENDING}</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={[styles.statValue, { color: Colors.status_approved }]}>
            {stats.approved}
          </Text>
          <Text style={styles.statLabel}>{validationStrings.APPROVED}</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={[styles.statValue, { color: Colors.status_rejected }]}>
            {stats.rejected}
          </Text>
          <Text style={styles.statLabel}>{validationStrings.REJECTED}</Text>
        </View>
      </View>

      {viewModel.loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{validationStrings.LOADING_TEAMS}</Text>
        </View>
      ) : viewModel.teams.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="group-off" size={80} color={Colors.border_lighter} />
          <Text style={styles.emptyTitle}>No Teams Yet</Text>
          <Text style={styles.emptySubtitle}>
            {validationStrings.REGISTER_FOR_EVENT}
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={viewModel.navigateToEventList}
            activeOpacity={0.8}
          >
            <Icon name="explore" size={24} color={Colors.border_lighter} />
            <Text style={styles.browseButtonText}>{validationStrings.BROWSE_EVENTS}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={viewModel.refreshing}
              onRefresh={viewModel.onRefresh}
            />
          }
        >
          {viewModel.teams.map(renderTeamCard)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default MyTeamsScreen;