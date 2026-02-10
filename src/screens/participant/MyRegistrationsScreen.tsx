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

    return (
      <View key={registration.id} style={styles.registrationCard}>
        <View style={styles.cardHeader}>
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle} numberOfLines={1}>
              {event?.title || validationStrings.UNKNOWN_EVENT}
            </Text>
            <Text style={styles.sportType}>{event?.sportType || ''}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: viewModel.getStatusColor(registration.status) },
            ]}
          >
            <Icon
              name={viewModel.getStatusIcon(registration.status)}
              size={16}
              color={Colors.white}
            />
            <Text style={styles.statusText}>{registration.status}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Icon name="sports" size={20} color={Colors.text_light} />
            <Text style={styles.infoText}>{validationStrings.FORMAT} {registration.format}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="event" size={20} color={Colors.text_light} />
            <Text style={styles.infoText}>{event?.date || validationStrings.DATE_TBD}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="location-on" size={20} color={Colors.text_light} />
            <Text style={styles.infoText}>{event?.location || validationStrings.LOCATION_TBD}</Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="access-time" size={20} color={Colors.text_light} />
            <Text style={styles.infoText}>
              {validationStrings.REGISTERED} {new Date(registration.registeredAt).toLocaleDateString()}
            </Text>
          </View>

          {registration.status === RegistrationStatus.APPROVED && registration.assignedTeamId && (
            <View style={[styles.infoRow, styles.teamAssigned]}>
              <Icon name="group" size={20} color={Colors.COLOR_GREEN} />
              <Text style={styles.teamAssignedText}>{validationStrings.TEAM_ASSIGNED}</Text>
            </View>
          )}

          {registration.status === RegistrationStatus.REJECTED && registration.rejectionReason && (
            <View style={styles.rejectionBox}>
              <Text style={styles.rejectionLabel}>{validationStrings.REASON}</Text>
              <Text style={styles.rejectionText}>{registration.rejectionReason}</Text>
            </View>
          )}
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => viewModel.navigateToEventDetails(event!)}
            activeOpacity={0.7}
          >
            <Icon name="visibility" size={20} color={Colors.COLOR_BLUE} />
            <Text style={styles.viewButtonText}>{validationStrings.VIEW_EVENT}</Text>
          </TouchableOpacity>

          {canCancel && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => viewModel.handleCancelRegistration(registration)}
              activeOpacity={0.7}
            >
              <Icon name="close" size={20} color={Colors.error} />
              <Text style={styles.cancelButtonText}>{validationStrings.CANCEL}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="event-busy" size={80} color={Colors.empty_icon} />
      <Text style={styles.emptyTitle}>{validationStrings.NO_REGISTRATIONS_YET}</Text>
      <Text style={styles.emptySubtitle}>
        {validationStrings.BROWSE_EVENTS_GET_STARTED}
      </Text>
      <TouchableOpacity
        style={styles.browseButton}
        onPress={viewModel.navigateToEventList}
        activeOpacity={0.8}
      >
        <Icon name="explore" size={24} color={Colors.white} />
        <Text style={styles.browseButtonText}>{validationStrings.BROWSE_EVENTS}</Text>
      </TouchableOpacity>
    </View>
  );

  const stats = viewModel.getStats();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={validationStrings.MY_REGISTRATIONS_TITLE}
        showBackButton={true}
        userRole={validationStrings.PARTICIPANT}
      />

      {viewModel.loading && viewModel.registrations.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{validationStrings.LOADING_REGISTRATIONS}</Text>
        </View>
      ) : viewModel.registrations.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>{validationStrings.TOTAL}</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxBorder]}>
              <Text style={[styles.statNumber, { color: Colors.COLOR_ORANGE }]}>
                {stats.pending}
              </Text>
              <Text style={styles.statLabel}>{validationStrings.PENDING}</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxBorder]}>
              <Text style={[styles.statNumber, { color: Colors.COLOR_GREEN }]}>
                {stats.approved}
              </Text>
              <Text style={styles.statLabel}>{validationStrings.APPROVED}</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxBorder]}>
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
              />
            }
          >
            {viewModel.registrations.map(renderRegistrationCard)}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

export default MyRegistrationsScreen;