import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import { RegistrationStatus } from '../../models/participantRegistration';
import styles from './ManageRegistrationsScreenStyle';
import {
  useManageRegistrationsViewModel,
  type RegistrationWithEvent,
  type FilterType,
  type EventFormatGroup
} from '../../viewmodels/manageRegistrationsViewModel';
import Colors from '../../constants/colors';
import { headerStrings, validationStrings } from '../../constants/validationStrings';

const ManageRegistrationsScreen = () => {
  const route = useRoute<any>();
  const role = route.params?.role || validationStrings.ADMIN;
  const viewModel = useManageRegistrationsViewModel();

  const renderFilterButton = (filterType: FilterType, label: string, count: number) => {
    const isActive = viewModel.filter === filterType;
    return (
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.filterButtonActive]}
        onPress={() => viewModel.setFilter(filterType)}
        activeOpacity={0.7}
      >
        <Text style={[styles.filterButtonText, isActive && styles.filterButtonTextActive]}>
          {label}
        </Text>
        <View
          style={[
            styles.filterBadge,
            isActive ? styles.filterBadgeActive : styles.filterBadgeInactive,
          ]}
        >
          <Text
            style={[
              styles.filterBadgeText,
              isActive ? styles.filterBadgeTextActive : styles.filterBadgeTextInactive,
            ]}
          >
            {count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRegistrationCard = (registration: RegistrationWithEvent) => {
    const event = registration.eventDetails;
    const isPending = registration.status === RegistrationStatus.PENDING;

    return (
      <View key={registration.id} style={styles.registrationCard}>
        <View style={styles.cardHeader}>
          <View style={styles.participantInfo}>
            <View style={styles.avatarContainer}>
              <Icon name={validationStrings.PERSON} size={24} color={Colors.white} />
            </View>
            <View style={styles.participantDetails}>
              <Text style={styles.participantName}>{registration.participantName}</Text>
              <Text style={styles.participantEmail}>{registration.participantEmail}</Text>
              <View style={styles.genderBadge}>
                <Icon
                  name={registration.participantGender === validationStrings.MALE ? validationStrings.MALE_ICON : validationStrings.FEMALE_ICON}
                  size={14}
                  color={Colors.stats_label}
                />
                <Text style={styles.genderText}>{registration.participantGender}</Text>
              </View>
            </View>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: viewModel.getStatusColor(registration.status) },
            ]}
          >
            <Text style={styles.statusText}>{registration.status}</Text>
          </View>
        </View>

        <View style={styles.eventDetails}>
          <Text style={styles.eventTitle}>{event?.title || validationStrings.UNKNOWN_EVENT}</Text>
          <View style={styles.eventMeta}>
            <View style={styles.metaItem}>
              <Icon name="sports" size={16} color={Colors.stats_label} />
              <Text style={styles.metaText}>{event?.sportType}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="category" size={16} color={Colors.stats_label} />
              <Text style={styles.metaText}>{registration.format}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name={validationStrings.EVENT} size={16} color={Colors.stats_label} />
              <Text style={styles.metaText}>{event?.date}</Text>
            </View>
          </View>
          <Text style={styles.registrationDate}>
            {validationStrings.REGISTERED} {new Date(registration.registeredAt).toLocaleString()}
          </Text>
        </View>

        {registration.status === RegistrationStatus.REJECTED && registration.rejectionReason && (
          <View style={styles.rejectionBox}>
            <Text style={styles.rejectionLabel}>{validationStrings.REJECTION_REASON}</Text>
            <Text style={styles.rejectionText}>{registration.rejectionReason}</Text>
          </View>
        )}

        {isPending && (
          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => viewModel.handleApprove(registration)}
              activeOpacity={0.8}
            >
              <Icon name="check-circle" size={20} color={Colors.white} />
              <Text style={styles.approveButtonText}>{validationStrings.APPROVE}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => viewModel.handleReject(registration)}
              activeOpacity={0.8}
            >
              <Icon name="cancel" size={20} color={Colors.white} />
              <Text style={styles.rejectButtonText}>{validationStrings.REJECT}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderTeamCreationSuggestion = (group: EventFormatGroup) => {
    return (
      <View key={`${group.eventId}_${group.format}`} style={styles.teamSuggestionCard}>
        <View style={styles.suggestionHeader}>
          <View style={styles.suggestionIcon}>
            <Icon name="groups" size={24} color={Colors.event_sport} />
          </View>
          <View style={styles.suggestionInfo}>
            <Text style={styles.suggestionTitle}>{group.eventTitle}</Text>
            <Text style={styles.suggestionFormat}>{group.format} {headerStrings.FORMAT}</Text>
          </View>
        </View>

        <View style={styles.suggestionStats}>
          <View style={styles.suggestionStat}>
            <Text style={styles.suggestionStatValue}>{group.approvedCount}</Text>
            <Text style={styles.suggestionStatLabel}>{validationStrings.APPROVED}</Text>
          </View>
          <View style={styles.suggestionStat}>
            <Text style={styles.suggestionStatValue}>{group.teamsCreated}</Text>
            <Text style={styles.suggestionStatLabel}>{validationStrings.TEAMS_CREATED}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createTeamsButton}
          onPress={() => viewModel.handleCreateTeams(group)}
          activeOpacity={0.8}
        >
          <Icon name="add-circle" size={20} color={Colors.white} />
          <Text style={styles.createTeamsButtonText}>{validationStrings.CREATE_TEAM}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={headerStrings.MANAGE_REGISTRATIONS}
        showBackButton={true}
        userRole={role}
      />

      <View style={styles.fixedHeaderSection}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={Colors.text_lighter} />
          <TextInput
            style={styles.searchInput}
            placeholder={validationStrings.SEARCH_PLACEHOLDER}
            value={viewModel.searchQuery}
            onChangeText={viewModel.setSearchQuery}
            placeholderTextColor={Colors.text_lighter}
          />
          {viewModel.searchQuery.length > 0 && (
            <TouchableOpacity onPress={viewModel.clearSearch}>
              <Icon name="close" size={20} color={Colors.text_lighter} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {renderFilterButton('ALL', validationStrings.ALL, viewModel.stats.total)}
          {renderFilterButton('PENDING', validationStrings.PENDING, viewModel.stats.pending)}
          {renderFilterButton('APPROVED', validationStrings.APPROVED, viewModel.stats.approved)}
          {renderFilterButton('REJECTED', validationStrings.REJECTED, viewModel.stats.rejected)}
        </ScrollView>

        {viewModel.stats.pending > 0 && viewModel.filter === 'PENDING' && (
          <View style={styles.bulkActionBar}>
            <Text style={styles.bulkActionText}>
              {viewModel.stats.pending} {validationStrings.PENDING_REGISTRATION}{viewModel.stats.pending !== 1 ? 's' : ''}
            </Text>
            <TouchableOpacity
              style={styles.bulkApproveButton}
              onPress={viewModel.handleBulkApprove}
              activeOpacity={0.8}
            >
              <Icon name="done-all" size={20} color={Colors.white} />
              <Text style={styles.bulkApproveText}>{validationStrings.APPROVE_ALL}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {viewModel.loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{validationStrings.LOADING_REGISTRATIONS}</Text>
        </View>
      ) : viewModel.filteredRegistrations.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="inbox" size={80} color={Colors.empty_icon} />
          <Text style={styles.emptyTitle}>{validationStrings.NO_REGISTRATIONS_FOUND}</Text>
          <Text style={styles.emptySubtitle}>
            {viewModel.searchQuery
              ? validationStrings.ADJUST_SEARCH_FILTERS
              : validationStrings.NO_REGISTRATIONS_MATCH_FILTER}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={viewModel.refreshing} onRefresh={viewModel.onRefresh} />
          }
        >
          {viewModel.filter === 'APPROVED' && viewModel.eventFormatGroups.length > 0 && (
            <View style={styles.teamSuggestionsSection}>
              <View style={styles.sectionHeader}>
                <Icon name="lightbulb" size={24} color={Colors.warning} />
                <Text style={styles.sectionTitle}>{validationStrings.READY_TO_CREATE_TEAMS}</Text>
              </View>
              {viewModel.eventFormatGroups.map(renderTeamCreationSuggestion)}
            </View>
          )}

          {viewModel.filteredRegistrations.map(renderRegistrationCard)}
        </ScrollView>
      )}

      <Modal
        visible={viewModel.showRejectionModal}
        transparent
        animationType="slide"
        onRequestClose={viewModel.closeRejectionModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{validationStrings.REJECT_REGISTRATION}</Text>
              <TouchableOpacity onPress={viewModel.closeRejectionModal}>
                <Icon name="close" size={24} color={Colors.stats_label} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {viewModel.selectedRegistration?.participantName}
            </Text>

            <Text style={styles.inputLabel}>{validationStrings.REASON_FOR_REJECTION_REQUIRED}</Text>
            <TextInput
              style={styles.textArea}
              placeholder={validationStrings.ENTER_REJECTION_REASON}
              value={viewModel.rejectionReason}
              onChangeText={viewModel.setRejectionReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={Colors.text_lighter}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={viewModel.closeRejectionModal}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>{validationStrings.CANCEL}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={viewModel.confirmReject}
                activeOpacity={0.8}
              >
                <Text style={styles.modalConfirmText}>{validationStrings.REJECT}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ManageRegistrationsScreen;