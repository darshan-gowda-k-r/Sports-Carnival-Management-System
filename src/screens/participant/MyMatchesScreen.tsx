import React from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import { useMyMatchesViewModel } from '../../viewmodels/myMatchesViewModel';
import { Match, MatchStatus } from '../../models/match';
import styles from './MyMatchesScreenStyle';
import Colors from '../../constants/colors';
import { headerStrings, validationStrings } from '../../constants/validationStrings';

const MyMatchesScreen = () => {
  const viewModel = useMyMatchesViewModel();

  const renderMatchCard = (match: Match) => {
    const isMyTeam1 = viewModel.isMyTeam(match.team1Id);
    const isMyTeam2 = viewModel.isMyTeam(match.team2Id);
    const myTeam = viewModel.getMyTeam(match);

    return (
      <View key={match.id} style={styles.matchCard}>
        <View style={styles.matchHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: viewModel.getStatusColor(match.status) },
            ]}
          >
            <Text style={styles.statusText}>{match.status}</Text>
          </View>
          <Text style={styles.matchNumber}>{validationStrings.MATCH_NUMBER}{match.matchNumber}</Text>
        </View>

        <View style={styles.teamsContainer}>
          <View style={[styles.teamBox, isMyTeam1 && styles.myTeamBox]}>
            <Icon name="group" size={24} color={isMyTeam1 ? Colors.match_my_team_text : Colors.match_team_icon} />
            <Text style={[styles.teamName, isMyTeam1 && styles.myTeamName]}>
              {match.team1Name}
            </Text>
            {match.status === MatchStatus.COMPLETED && (
              <Text style={styles.score}>{match.team1Score ?? '-'}</Text>
            )}
          </View>

          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>{validationStrings.VS}</Text>
          </View>

          <View style={[styles.teamBox, isMyTeam2 && styles.myTeamBox]}>
            <Icon name="group" size={24} color={isMyTeam2 ? Colors.match_my_team_border : Colors.match_team_icon} />
            <Text style={[styles.teamName, isMyTeam2 && styles.myTeamName]}>
              {match.team2Name}
            </Text>
            {match.status === MatchStatus.COMPLETED && (
              <Text style={styles.score}>{match.team2Score ?? '-'}</Text>
            )}
          </View>
        </View>

        {match.status === MatchStatus.COMPLETED && match.winnerId && (
          <View style={styles.winnerBanner}>
            <Icon name="emoji-events" size={20} color={Colors.winner_icon} />
            <Text style={styles.winnerText}>
              {match.winnerId === myTeam?.id ? 'You Won!' : 'Opponent Won'}
            </Text>
          </View>
        )}

        <View style={styles.matchDetails}>
          <View style={styles.detailRow}>
            <Icon name="event" size={18} color={Colors.match_vs}/>
            <Text style={styles.detailText}>{match.scheduledDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="schedule" size={18} color={Colors.match_vs} />
            <Text style={styles.detailText}>{match.scheduledTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="location-on" size={18} color={Colors.match_vs} />
            <Text style={styles.detailText}>{match.venue}</Text>
          </View>
        </View>
      </View>
    );
  };

  const upcomingMatches = viewModel.getUpcomingMatches();
  const completedMatches = viewModel.getCompletedMatches();
  const stats = viewModel.getStats();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title="My Matches"
        showBackButton={true}
        userRole="PARTICIPANT"
      />

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>{validationStrings.TOTAL}</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={[styles.statValue, { color: Colors.match_my_team_icon }]}>
            {stats.upcoming}
          </Text>
          <Text style={styles.statLabel}>{validationStrings.UPCOMING}</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={[styles.statValue, { color: Colors.status_approved }]}>
            {stats.completed}
          </Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
      </View>

      {viewModel.loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{validationStrings.LOADING_MATCHES}</Text>
        </View>
      ) : viewModel.matches.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="event-busy" size={80} color={Colors.border_lighter} />
          <Text style={styles.emptyTitle}>No Matches Yet</Text>
          <Text style={styles.emptySubtitle}>
            {validationStrings.YOUR_SCHEDULED_MATCHES}
          </Text>
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
          {upcomingMatches.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{validationStrings.UPCOMING_MATCHES}</Text>
              {upcomingMatches.map(renderMatchCard)}
            </View>
          )}

          {completedMatches.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{validationStrings.COMPLETED_MATCHES}</Text>
              {completedMatches.map(renderMatchCard)}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default MyMatchesScreen;