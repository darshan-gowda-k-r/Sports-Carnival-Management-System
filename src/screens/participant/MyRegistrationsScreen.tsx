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
import { useMyRegistrationsViewModel, type RegistrationWithEvent } from '../../viewmodels/myRegistrationsViewModel';
import { RegistrationStatus } from '../../models/participantRegistration';
import { validationStrings } from '../../constants/validationStrings';
import Colors from '../../constants/colors';
import styles from './MyRegistrationsScreenStyle';

const MyRegistrationsScreen = () => {
  const viewModel = useMyRegistrationsViewModel();

  const renderRegistrationCard = (registration: RegistrationWithEvent) => {
    const event = registration.eventDetails;
    const canCancel = viewModel.canCancelRegistration(registration);
    const statusColor = viewModel.getStatusColor(registration.status);
    const statusIcon = viewModel.getStatusIcon(registration.status);

    return (
      <TouchableOpacity
        key={registration.id}
        style={styles.registrationCard}
        activeOpacity={0.7}
        onPress={() => viewModel.navigateToEventDetails(event!)}
      >
        <View style={[styles.statusBanner, { backgroundColor: statusColor }]}>
          <Icon name={statusIcon} size={18} color={Colors.white} />
          <Text style={styles.statusBannerText}>{registration.status}</Text>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.titleSection}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {event?.title || validationStrings.UNKNOWN_EVENT}
            </Text>
            <View style={styles.sportBadge}>
              <Icon name="sports" size={14} color={Colors.section_link} />
              <Text style={styles.sportText}>{event?.sportType || ''}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Icon name={validationStrings.ICON_EVENT} size={18} color={Colors.text_light} />
              <Text style={styles.detailText}>
                {event?.date ? new Date(event.date).toLocaleDateString('en-GB') : validationStrings.DATE_TBD}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="location-on" size={18} color={Colors.text_light} />
              <Text style={styles.detailText} numberOfLines={1}>
                {event?.location || validationStrings.LOCATION_TBD}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="sports-esports" size={18} color={Colors.text_light} />
              <Text style={styles.detailText}>{registration.format}</Text>
            </View>

            <View style={styles.detailItem}>
              <Icon name="access-time" size={18} color={Colors.text_light} />
              <Text style={styles.detailText}>
                {new Date(registration.registeredAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short'
                })}
              </Text>
            </View>
          </View>

          {registration.status === RegistrationStatus.APPROVED && registration.assignedTeamId && (
            <View style={styles.teamAssignedBadge}>
              <Icon name={validationStrings.ICON_GROUP} size={18} color={Colors.COLOR_GREEN} />
              <Text style={styles.teamAssignedText}>
                {validationStrings.TEAM_ASSIGNED_BULLET} {registration.assignedTeamId}
              </Text>
            </View>
          )}

          {registration.status === RegistrationStatus.REJECTED && registration.rejectionReason && (
            <View style={styles.rejectionBox}>
              <View style={styles.rejectionHeader}>
                <Icon name="info-outline" size={16} color={Colors.rejection_text} />
                <Text style={styles.rejectionLabel}>{validationStrings.REJECTION_REASON}</Text>
              </View>
              <Text style={styles.rejectionText}>{registration.rejectionReason}</Text>
            </View>
          )}
        </View>

        {canCancel && (
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={(e) => {
                e.stopPropagation();
                viewModel.handleCancelRegistration(registration);
              }}
              activeOpacity={0.7}
            >
              <Icon name={validationStrings.ICON_CLOSE} size={18} color={Colors.error} />
              <Text style={styles.cancelButtonText}>{validationStrings.CANCEL_REGISTRATION}</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Icon name={validationStrings.ICON_EVENT_BUSY} size={64} color={Colors.empty_icon} />
      </View>
      <Text style={styles.emptyTitle}>{validationStrings.NO_REGISTRATIONS_YET_TITLE}</Text>
      <Text style={styles.emptySubtitle}>
        {validationStrings.NO_REGISTRATIONS_SUBTITLE}
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={viewModel.navigateToEventList}
        activeOpacity={0.8}
      >
        <Icon name={validationStrings.ICON_EXPLORE} size={22} color={Colors.white} />
        <Text style={styles.browseButtonText}>{validationStrings.BROWSE_EVENTS}</Text>
      </TouchableOpacity>
    </View>
  );

  const stats = viewModel.getStats();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={viewModel.handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color={Colors.section_link} />
          <Text style={styles.backButtonText}>{validationStrings.BACK}</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{validationStrings.MY_REGISTRATIONS_HEADER}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{validationStrings.PARTICIPANT}</Text>
          </View>
        </View>

        <View style={styles.headerRight} />
      </View>

      {viewModel.loading && viewModel.registrations.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Icon name="hourglass-empty" size={48} color={Colors.text_light} />
          <Text style={styles.loadingText}>{validationStrings.LOADING_REGISTRATIONS_TEXT}</Text>
        </View>
      ) : viewModel.registrations.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: Colors.bg_blue }]}>
                <Icon name="sports" size={20} color={Colors.COLOR_BLUE} />
              </View>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>{validationStrings.TOTAL}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: Colors.icon_schedule }]}>
                <Icon name={validationStrings.ICON_SCHEDULE} size={20} color={Colors.COLOR_ORANGE} />
              </View>
              <Text style={[styles.statNumber, { color: Colors.COLOR_ORANGE }]}>
                {stats.pending}
              </Text>
              <Text style={styles.statLabel}>{validationStrings.PENDING}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: Colors.reg_back }]}>
                <Icon name={validationStrings.ICON_CHECK_CIRCLE} size={20} color={Colors.COLOR_GREEN} />
              </View>
              <Text style={[styles.statNumber, { color: Colors.COLOR_GREEN }]}>
                {stats.approved}
              </Text>
              <Text style={styles.statLabel}>{validationStrings.APPROVED}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconCircle, { backgroundColor: Colors.icon_back }]}>
                <Icon name={validationStrings.ICON_CANCEL} size={20} color={Colors.error} />
              </View>
              <Text style={[styles.statNumber, { color: Colors.error }]}>
                {stats.rejected}
              </Text>
              <Text style={styles.statLabel}>{validationStrings.REJECTED}</Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={viewModel.refreshing}
                onRefresh={viewModel.onRefresh}
                colors={[Colors.section_link]}
              />
            }
          >
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>
                {viewModel.registrations.length} {viewModel.registrations.length === 1 ? validationStrings.REGISTRATION_TEXT : validationStrings.REGISTRATIONS_TEXT}
              </Text>
            </View>
            {viewModel.registrations.map(renderRegistrationCard)}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default MyRegistrationsScreen;