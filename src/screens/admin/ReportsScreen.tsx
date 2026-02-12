import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import { useReportsViewModel } from '../../viewmodels/reportsViewModel';
import styles from './ReportsScreenStyle';
import Colors from '../../constants/colors';
import { headerStrings, validationStrings } from '../../constants/validationStrings';

const ReportsScreen = () => {
  const {
    stats,
    loading,
    refreshData,
    exportReport,
  } = useReportsViewModel();

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CustomHeader
          title={headerStrings.REPORTS}
          showBackButton={true}
          userRole={validationStrings.ADMIN}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{validationStrings.LOADING}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={headerStrings.REPORTS}
        showBackButton={true}
        userRole={validationStrings.ADMIN}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Icon name="analytics" size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>{validationStrings.PLATFORM_OVERVIEW}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.stats_background }]}>
              <Icon name={validationStrings.ICON_EVENT} size={32} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{stats.totalEvents}</Text>
            <Text style={styles.statLabel}>{validationStrings.TOTAL_EVENTS_LABEL}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.bg_green_light }]}>
              <Icon name={validationStrings.ICON_PEOPLE} size={32} color={Colors.success} />
            </View>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>{validationStrings.TOTAL_USERS_LABEL}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.bg_yellow }]}>
              <Icon name={validationStrings.ICON_HOW_TO_REG} size={32} color={Colors.warning} />
            </View>
            <Text style={styles.statValue}>{stats.totalRegistrations}</Text>
            <Text style={styles.statLabel}>{validationStrings.REGISTRATIONS_TEXT}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.winner_back }]}>
              <Icon name={validationStrings.ICON_GROUPS} size={32} color={Colors.winner_icon} />
            </View>
            <Text style={styles.statValue}>{stats.totalTeams}</Text>
            <Text style={styles.statLabel}>{validationStrings.TEAMS_CREATED}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Icon name="event-note" size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>{validationStrings.EVENT_STATUS_TITLE}</Text>
        </View>

        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <View style={[styles.breakdownDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.breakdownLabel}>{validationStrings.UPCOMING_LABEL}</Text>
            </View>
            <Text style={styles.breakdownValue}>{stats.upcomingEvents}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <View style={[styles.breakdownDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.breakdownLabel}>{validationStrings.ONGOING_LABEL}</Text>
            </View>
            <Text style={styles.breakdownValue}>{stats.ongoingEvents}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <View style={[styles.breakdownDot, { backgroundColor: Colors.iconSecondary }]} />
              <Text style={styles.breakdownLabel}>{validationStrings.COMPLETED_LABEL}</Text>
            </View>
            <Text style={styles.breakdownValue}>{stats.completedEvents}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Icon name={validationStrings.ICON_ASSIGNMENT} size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>{validationStrings.REGISTRATION_STATUS_TITLE}</Text>
        </View>

        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <View style={[styles.breakdownDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.breakdownLabel}>{validationStrings.PENDING}</Text>
            </View>
            <Text style={styles.breakdownValue}>{stats.pendingRegistrations}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <View style={[styles.breakdownDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.breakdownLabel}>{validationStrings.APPROVED}</Text>
            </View>
            <Text style={styles.breakdownValue}>{stats.approvedRegistrations}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <View style={[styles.breakdownDot, { backgroundColor: Colors.error }]} />
              <Text style={styles.breakdownLabel}>{validationStrings.REJECTED}</Text>
            </View>
            <Text style={styles.breakdownValue}>{stats.rejectedRegistrations}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Icon name={validationStrings.PERSON} size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>{validationStrings.USER_BREAKDOWN_TITLE}</Text>
        </View>

        <View style={styles.breakdownCard}>
          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <Icon name={validationStrings.ADMIN_PANEL} size={20} color={Colors.error} />
              <Text style={styles.breakdownLabel}>{validationStrings.ADMINS_LABEL}</Text>
            </View>
            <Text style={styles.breakdownValue}>{stats.adminUsers}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <Icon name={validationStrings.ICON_EVENT_AVAILABLE} size={20} color={Colors.primary} />
              <Text style={styles.breakdownLabel}>{validationStrings.ORGANIZERS_LABEL}</Text>
            </View>
            <Text style={styles.breakdownValue}>{stats.organizerUsers}</Text>
          </View>

          <View style={styles.breakdownRow}>
            <View style={styles.breakdownLeft}>
              <Icon name="sports" size={20} color={Colors.participantAccent} />
              <Text style={styles.breakdownLabel}>{validationStrings.PARTICIPANTS_LABEL}</Text>
            </View>
            <Text style={styles.breakdownValue}>{stats.participantUsers}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Icon name="sports-soccer" size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>{validationStrings.POPULAR_SPORTS_TITLE}</Text>
        </View>

        <View style={styles.breakdownCard}>
          {stats.sportBreakdown.map((sport, index) => (
            <View key={index} style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <Icon name="sports" size={20} color={Colors.event_sport} />
                <Text style={styles.breakdownLabel}>{sport.name}</Text>
              </View>
              <Text style={styles.breakdownValue}>{sport.count}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refreshData}
            activeOpacity={0.8}
          >
            <Icon name="refresh" size={20} color={Colors.white} />
            <Text style={styles.refreshButtonText}>{validationStrings.REFRESH_DATA}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.exportButton}
            onPress={exportReport}
            activeOpacity={0.8}
          >
            <Icon name="file-download" size={20} color={Colors.primary} />
            <Text style={styles.exportButtonText}>{validationStrings.EXPORT_REPORT}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportsScreen;