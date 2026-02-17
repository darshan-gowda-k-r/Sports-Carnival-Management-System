import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { headerStrings, validationStrings } from '../../constants/validationStrings';
import { eventImages } from '../../constants/eventImages';
import CustomHeader from '../../components/customHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import { useEventListViewModel } from '../../viewmodels/eventListViewModel';
import { isRegistrationOpen, getTotalRegistered, getTotalMaxParticipants } from '../../models/event';
import styles from './EventListScreenStyle';

const EventListScreen = () => {
  const {
    activeTab,
    filteredEvents,
    role,
    shouldShowMyEventsTab,

    handleTabChange,
    handleNavigateToCreate,
    handleNavigateToDetails,
    handleNavigateToEdit,
    handleDeleteWithStopPropagation,
    canManageEvent,
    canDeleteEvent,
    isMyEvent,
    getStatusStyle,
    getEmptyStateTitle,
    getEmptyStateSubtitle,
  } = useEventListViewModel();

  const formatDisplayDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={headerStrings.EVENTS_LIST}
        showBackButton={true}
        showAddButton={role === validationStrings.ADMIN || role === validationStrings.ORGANIZER}
        userRole={role}
        onAddPress={handleNavigateToCreate}
      />

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => handleTabChange('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            {validationStrings.ALL_EVENTS_TAB}
          </Text>
          {activeTab === 'all' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        {shouldShowMyEventsTab && (
          <TouchableOpacity
            style={[styles.tab, activeTab === 'myEvents' && styles.activeTab]}
            onPress={() => handleTabChange('myEvents')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === 'myEvents' && styles.activeTabText]}>
              {headerStrings.MY_EVENTS}
            </Text>
            {activeTab === 'myEvents' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.tab, activeTab === 'today' && styles.activeTab]}
          onPress={() => handleTabChange('today')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>
            {validationStrings.TODAY_TAB}
          </Text>
          {activeTab === 'today' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => handleTabChange('upcoming')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            {validationStrings.UPCOMING}
          </Text>
          {activeTab === 'upcoming' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const showMyEventBadge = isMyEvent(item) && role === validationStrings.ORGANIZER;
          const canManage = canManageEvent(item);
          const canDelete = canDeleteEvent(item);
          const regOpen = isRegistrationOpen(item);

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleNavigateToDetails(item)}
              activeOpacity={0.9}
            >
              <Image
                source={eventImages[item.sportType] || eventImages.DEFAULT}
                style={styles.eventImage}
                resizeMode="cover"
              />

              <View style={styles.eventInfo}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventName} numberOfLines={1}>
                    {item.title}
                  </Text>
                  {showMyEventBadge && (
                    <View style={styles.myEventBadge}>
                      <Text style={styles.myEventBadgeText}>{validationStrings.MY_EVENT_BADGE}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.eventType}>{item.sportType}</Text>

                <View style={styles.eventMeta}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>
                      {validationStrings.MATCH_EMOJI} {validationStrings.MATCH_LABEL} {formatDisplayDate(item.matchDate)}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>
                      {validationStrings.CLOCK_EMOJI} {validationStrings.REG_DEADLINE_SHORT} {formatDisplayDate(item.registrationDeadline)}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>{validationStrings.LOCATION_EMOJI} {item.location}</Text>
                  </View>
                </View>

                {role === validationStrings.PART && (
                  <View style={styles.registrationStatus}>
                    {regOpen ? (
                      <Text style={styles.registrationOpenText}>
                        {validationStrings.REGISTRATION_OPEN_CHECK}
                      </Text>
                    ) : (
                      <Text style={styles.registrationClosedText}>
                        {validationStrings.REGISTRATION_CLOSED_WARNING}
                      </Text>
                    )}
                  </View>
                )}

                <View style={styles.formatBadges}>
                  {item.availableFormats.filter(f => f.isAvailable).map((format) => (
                    <View key={format.format} style={styles.formatBadge}>
                      <Text style={styles.formatBadgeText}>
                        {format.format}: {getTotalRegistered(format)}/{getTotalMaxParticipants(format)} {validationStrings.PARTICIPANTS_LOWERCASE}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              {canManage && (
                <View style={styles.adminActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={(e) => handleNavigateToEdit(item, () => e.stopPropagation())}
                    activeOpacity={0.7}
                  >
                    <Icon name="edit" size={18} color={Colors.white} />
                    <Text style={styles.editButtonText}>{headerStrings.EDIT}</Text>
                  </TouchableOpacity>

                  {canDelete && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={(e) => handleDeleteWithStopPropagation(item.id, () => e.stopPropagation())}
                      activeOpacity={0.7}
                    >
                      <Icon name="delete" size={18} color={Colors.white} />
                      <Text style={styles.deleteButtonText}>{headerStrings.DELETE}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{validationStrings.EMPTY_MAILBOX_EMOJI}</Text>
            <Text style={styles.emptyTitle}>{getEmptyStateTitle()}</Text>
            <Text style={styles.emptySubtitle}>{getEmptyStateSubtitle()}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default EventListScreen;