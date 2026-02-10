import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { eventImages } from '../../constants/eventImages';
import { useEventDetailsViewModel } from '../../viewmodels/eventDetailsViewModel';
import { isRegistrationOpen, hasDeadlinePassed, getTotalRegistered, getTotalMaxParticipants, canCreateFixtures } from '../../models/event';
import { validationStrings, headerStrings } from '../../constants/validationStrings';
import Colors from '../../constants/colors';
import styles from './EventDetailsScreenStyle';

const EventDetailsScreen = () => {
  const {
    event,
    role,
    userRegistrations,
    userTeams,
    loading,
    navigateToRegistration,
    navigateToMyTeams,
    navigateToMyRegistrations,
    navigateToFixtureCreation,
    getUserStatus,
    getStatusStyle,
  } = useEventDetailsViewModel();

  const registrationOpen = isRegistrationOpen(event);
  const deadlinePassed = hasDeadlinePassed(event.registrationDeadline);
  const canProceedToFixtures = canCreateFixtures(event);

  const getParticipantActionUI = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{validationStrings.LOADING}</Text>
        </View>
      );
    }

    const userStatus = getUserStatus();

    if (deadlinePassed && userStatus === 'not_registered') {
      return (
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon name="event-busy" size={32} color={Colors.error} />
            <Text style={styles.statusTitle}>{validationStrings.REGISTRATION_CLOSED}</Text>
          </View>
          <Text style={styles.statusMessage}>
            {validationStrings.REGISTRATION_CLOSED_MESSAGE}
          </Text>
        </View>
      );
    }

    if (userStatus === 'in_team') {
      return (
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon name="check-circle" size={32} color={Colors.success} />
            <Text style={styles.statusTitle}>{validationStrings.YOU_ARE_IN_TEAM}</Text>
          </View>
          <Text style={styles.statusMessage}>
            {validationStrings.TEAM_ASSIGNED_MESSAGE}
          </Text>
          <TouchableOpacity
            style={styles.viewTeamsButton}
            onPress={navigateToMyTeams}
            activeOpacity={0.8}
          >
            <Icon name="groups" size={20} color={Colors.white} />
            <Text style={styles.viewTeamsButtonText}>{validationStrings.VIEW_MY_TEAMS}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (userStatus === 'approved') {
      return (
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon name="schedule" size={32} color={Colors.warning} />
            <Text style={styles.statusTitle}>{validationStrings.REGISTRATION_APPROVED}</Text>
          </View>
          <Text style={styles.statusMessage}>
            {validationStrings.REGISTRATION_APPROVED_MESSAGE}
          </Text>
          <TouchableOpacity
            style={styles.viewRegistrationsButton}
            onPress={navigateToMyRegistrations}
            activeOpacity={0.8}
          >
            <Icon name="assignment" size={20} color={Colors.info} />
            <Text style={styles.viewRegistrationsButtonText}>{validationStrings.VIEW_MY_REGISTRATIONS}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (userStatus === 'pending') {
      return (
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon name="pending" size={32} color={Colors.warning} />
            <Text style={styles.statusTitle}>{validationStrings.REGISTRATION_PENDING}</Text>
          </View>
          <Text style={styles.statusMessage}>
            {validationStrings.REGISTRATION_REVIEW_MESSAGE}
          </Text>
          <TouchableOpacity
            style={styles.viewRegistrationsButton}
            onPress={navigateToMyRegistrations}
            activeOpacity={0.8}
          >
            <Icon name="assignment" size={20} color={Colors.info} />
            <Text style={styles.viewRegistrationsButtonText}>{validationStrings.VIEW_STATUS}</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (userStatus === 'rejected') {
      return (
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon name="cancel" size={32} color={Colors.error} />
            <Text style={styles.statusTitle}>{validationStrings.REGISTRATION_REJECTED}</Text>
          </View>
          <Text style={styles.statusMessage}>
            {validationStrings.REGISTRATION_REJECTED_MESSAGE}
          </Text>
          {registrationOpen && (
            <TouchableOpacity
              style={styles.registerButton}
              onPress={navigateToRegistration}
              activeOpacity={0.8}
            >
              <Icon name="how-to-reg" size={20} color={Colors.white} />
              <Text style={styles.registerButtonText}>{validationStrings.REGISTER_AGAIN}</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (registrationOpen) {
      return (
        <TouchableOpacity
          style={styles.registerButton}
          onPress={navigateToRegistration}
          activeOpacity={0.8}
        >
          <Icon name="how-to-reg" size={24} color={Colors.white} />
          <Text style={styles.registerButtonText}>{validationStrings.REGISTER_FOR_EVENT}</Text>
        </TouchableOpacity>
      );
    }

    return null;
  };

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
        title={headerStrings.EVENT_DETAILS}
        showBackButton={true}
        userRole={role}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Image
          source={eventImages[event.sportType] || eventImages.DEFAULT}
          style={styles.eventImage}
          resizeMode="cover"
        />

        <View style={styles.headerCard}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={[styles.statusBadge, getStatusStyle(event.status)]}>
              <Text style={styles.statusText}>{event.status}</Text>
            </View>
          </View>
          <Text style={styles.sportType}>{event.sportType}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="event-available" size={24} color={Colors.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{validationStrings.REGISTRATION_DEADLINE_LABEL}</Text>
              <Text style={styles.infoValue}>
                {formatDisplayDate(event.registrationDeadline)}
              </Text>
              {deadlinePassed && (
                <Text style={styles.deadlinePassed}>{validationStrings.REGISTRATION_CLOSED_EXCLAIM}</Text>
              )}
              {!deadlinePassed && (
                <Text style={styles.deadlineOpen}>{validationStrings.REGISTRATION_OPEN_EXCLAIM}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="event" size={24} color={Colors.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{validationStrings.MATCH_DATE_LABEL}</Text>
              <Text style={styles.infoValue}>
                {formatDisplayDate(event.matchDate)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="location-on" size={24} color={Colors.gray} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{validationStrings.LOCATION_LABEL}</Text>
              <Text style={styles.infoValue}>{event.location}</Text>
            </View>
          </View>

          {event.description && (
            <View style={styles.infoRow}>
              <Icon name="description" size={24} color={Colors.gray} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{validationStrings.DESCRIPTION}</Text>
                <Text style={styles.infoValue}>{event.description}</Text>
              </View>
            </View>
          )}

          {event.allowsMixedGender && (
            <View style={styles.infoRow}>
              <Icon name="people" size={24} color={Colors.gray} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{validationStrings.GENDER_RULES_LABEL}</Text>
                <Text style={styles.infoValue}>{validationStrings.MIXED_GENDER_ALLOWED}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.formatsCard}>
          <View style={styles.formatsHeader}>
            <Icon name="format-list-bulleted" size={24} color={Colors.text_dark} />
            <Text style={styles.formatsTitle}>{validationStrings.PARTICIPANT_REGISTRATION_TITLE}</Text>
          </View>

          {event.availableFormats
            .filter(format => format.isAvailable)
            .map((format) => (
              <View key={format.format} style={styles.formatItem}>
                <View style={styles.formatHeader}>
                  <Text style={styles.formatName}>{format.format}</Text>
                  <Text style={styles.formatTeamSize}>
                    {format.format === '1v1'
                      ? validationStrings.INDIVIDUAL_PARTICIPANTS
                      : validationStrings.PARTICIPANTS_ADMIN_CREATES_TEAMS}
                  </Text>
                </View>

                <View style={styles.participantStats}>
                  <View style={styles.genderStatContainer}>
                    <Text style={styles.genderLabel}>{validationStrings.MALE_PARTICIPANTS_LABEL}</Text>
                    <View style={styles.statRow}>
                      <Text style={styles.statValue}>
                        {format.registeredMaleCount} / {format.maxMaleParticipants}
                      </Text>
                      <Text style={styles.statLabel}>{validationStrings.REGISTERED_LABEL}</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${(format.registeredMaleCount / format.maxMaleParticipants) * 100}%`,
                            backgroundColor: format.registeredMaleCount >= format.maxMaleParticipants ? Colors.error : Colors.COLOR_BLUE
                          }
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.genderStatDivider} />

                  <View style={styles.genderStatContainer}>
                    <Text style={styles.genderLabel}>{validationStrings.FEMALE_PARTICIPANTS_LABEL}</Text>
                    <View style={styles.statRow}>
                      <Text style={styles.statValue}>
                        {format.registeredFemaleCount} / {format.maxFemaleParticipants}
                      </Text>
                      <Text style={styles.statLabel}>{validationStrings.REGISTERED_LABEL}</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${(format.registeredFemaleCount / format.maxFemaleParticipants) * 100}%`,
                            backgroundColor: format.registeredFemaleCount >= format.maxFemaleParticipants ? Colors.error : Colors.COLOR_FEMALE
                          }
                        ]}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.totalStats}>
                  <Text style={styles.totalLabel}>{validationStrings.TOTAL_REGISTERED_LABEL}</Text>
                  <Text style={styles.totalValue}>
                    {getTotalRegistered(format)} / {getTotalMaxParticipants(format)}
                  </Text>
                </View>
              </View>
            ))}
        </View>

        {role === validationStrings.PART && getParticipantActionUI()}

        {(role === validationStrings.ADMIN || role === validationStrings.ORGANIZER) && canProceedToFixtures && (
          <TouchableOpacity
            style={styles.createFixturesButton}
            onPress={navigateToFixtureCreation}
            activeOpacity={0.8}
          >
            <Icon name="sports-soccer" size={24} color={Colors.white} />
            <Text style={styles.createFixturesButtonText}>{validationStrings.CREATE_FIXTURES}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventDetailsScreen;