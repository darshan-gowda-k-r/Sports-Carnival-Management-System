import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../../components/customHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import { headerStrings, validationStrings } from '../../constants/validationStrings';
import { useParticipantHomeViewModel, type QuickAction, type UpcomingEvent } from '../../viewmodels/participantHomeViewModel';
import styles from './ParticipantScreenStyle';

const ParticipantHomeScreen = () => {
  const viewModel = useParticipantHomeViewModel();

  const renderQuickAction = (action: QuickAction) => (
    <TouchableOpacity
      key={action.id}
      style={styles.actionCard}
      onPress={action.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionIconContainer, { backgroundColor: action.color + '20' }]}>
        <Icon name={action.icon} size={28} color={action.color} />
      </View>
      <Text style={styles.actionTitle}>{action.title}</Text>
      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
    </TouchableOpacity>
  );

  const renderUpcomingEvent = (event: UpcomingEvent) => (
    <TouchableOpacity
      key={event.id}
      style={styles.eventCard}
      activeOpacity={0.7}
    >
      <View style={styles.eventDateBadge}>
        <Text style={styles.eventDateText}>{event.date}</Text>
      </View>
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={styles.eventMeta}>
          <Icon name="schedule" size={14} color={Colors.event_meta} />
          <Text style={styles.eventMetaText}>{event.time}</Text>
          <Text style={styles.eventDivider}>•</Text>
          <Icon name="sports" size={14} color={Colors.event_meta} />
          <Text style={styles.eventMetaText}>{event.sport}</Text>
        </View>
      </View>
      <Icon name="chevron-right" size={24} color={Colors.format_title_disabled} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={validationStrings.PARTICIPANT_TITLE}
        showLogout={true}
        onLogoutPress={viewModel.handleLogout}
        userRole="PLAYER"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.welcomeBanner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>{validationStrings.READY_TO_PLAY}</Text>
            <Text style={styles.bannerSubtitle}>
              {validationStrings.JOIN_EXCITING_TOURNAMENTS}
            </Text>
          </View>
          <Icon name="emoji-events" size={48} color={Colors.white} style={styles.bannerIcon} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Icon name="event-available" size={28} color={Colors.match_my_team_icon} />
            <Text style={styles.statValue}>{viewModel.stats.eventsJoined}</Text>
            <Text style={styles.statLabel}>{validationStrings.EVENTS_JOINED}</Text>
          </View>

          <View style={styles.statCard}>
            <Icon name="emoji-events" size={28} color={Colors.status_pending} />
            <Text style={styles.statValue}>{viewModel.stats.upcomingMatches}</Text>
            <Text style={styles.statLabel}>{validationStrings.UPCOMING}</Text>
          </View>

          <View style={styles.statCard}>
            <Icon name="star" size={28} color={Colors.status_completed} />
            <Text style={styles.statValue}>{viewModel.stats.wins}</Text>
            <Text style={styles.statLabel}>{validationStrings.WINS}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{validationStrings.QUICK_ACTIONS}</Text>
        </View>

        <View style={styles.actionsGrid}>
          {viewModel.quickActions.map(renderQuickAction)}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{validationStrings.UPCOMING_EVENTS}</Text>
          <TouchableOpacity onPress={viewModel.navigateToEventList}>
            <Text style={styles.seeAllText}>{validationStrings.SEE_ALL}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventsList}>
          {viewModel.upcomingEvents.map(renderUpcomingEvent)}
        </View>

        <TouchableOpacity
          style={styles.featuredBanner}
          onPress={viewModel.navigateToEventList}
          activeOpacity={0.8}
        >
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>{validationStrings.DISCOVER_NEW_EVENTS}</Text>
            <Text style={styles.featuredSubtitle}>
              {validationStrings.BROWSE_ALL_TOURNAMENTS}
            </Text>
            <View style={styles.featuredButton}>
              <Text style={styles.featuredButtonText}>{validationStrings.EXPLORE_NOW}</Text>
              <Icon name="arrow-forward" size={18} color={Colors.white} />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ParticipantHomeScreen;