import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import { useFixtureCreationViewModel } from '../../viewmodels/fixtureCreationViewModel';
import styles from './FixtureCreationScreenStyle';
import Colors from '../../constants/colors';
import { validationStrings } from '../../constants/validationStrings';
import { Gender } from '../../models/user';

const FixtureCreationScreen = () => {
  const {
    event,
    format,
    teams,
    participants,
    loading,
    selectedGenderTab,
    selectedTournamentType,
    maleTeams,
    femaleTeams,
    mixedTeams,
    maleParticipants,
    femaleParticipants,
    is1v1,
    fixturesGenerated,
    existingMatches,
    setSelectedGenderTab,
    setSelectedTournamentType,
    handleCreateFixtures,
    getItemsForSelectedTab,
  } = useFixtureCreationViewModel();

  const renderTournamentTypeCard = (type: 'round-robin' | 'knockout') => {
    const isSelected = selectedTournamentType === type;
    const isRoundRobin = type === validationStrings.ROUND_ROBIN.toLowerCase().replace(' ', '-');

    return (
      <TouchableOpacity
        style={[
          styles.tournamentTypeCard,
          isSelected && styles.tournamentTypeCardSelected,
        ]}
        onPress={() => setSelectedTournamentType(type)}
        activeOpacity={0.7}
        disabled={fixturesGenerated}
      >
        <View style={styles.tournamentTypeHeader}>
          <Icon
            name={isRoundRobin ? 'sync' : 'military-tech'}
            size={32}
            color={isSelected ? Colors.primary : Colors.iconSecondary}
          />
          <View
            style={[
              styles.tournamentTypeRadio,
              isSelected && styles.tournamentTypeRadioSelected,
            ]}
          >
            {isSelected && <View style={styles.tournamentTypeRadioDot} />}
          </View>
        </View>
        <Text style={[styles.tournamentTypeName, isSelected && styles.tournamentTypeNameSelected]}>
          {isRoundRobin ? validationStrings.ROUND_ROBIN : validationStrings.KNOCKOUT}
        </Text>
        <Text style={styles.tournamentTypeDescription}>
          {isRoundRobin ? validationStrings.ALL_VS_ALL : validationStrings.SINGLE_ELIMINATION}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderItemsList = () => {
    const displayItems = getItemsForSelectedTab();
    let tabTitle = validationStrings.ALL_FIXTURES;

    if (selectedGenderTab === 'male') {
      tabTitle = validationStrings.MALE_FIXTURES;
    } else if (selectedGenderTab === 'female') {
      tabTitle = validationStrings.FEMALE_FIXTURES;
    } else if (selectedGenderTab === 'mixed') {
      tabTitle = validationStrings.MIXED_FIXTURES;
    }

    const itemLabel = is1v1 ? validationStrings.PARTICIPANTS_LOWERCASE : validationStrings.TEAMS.toLowerCase();

    return (
      <View style={styles.teamsSection}>
        <Text style={styles.teamsSectionTitle}>
          {tabTitle} ({displayItems.length} {itemLabel})
        </Text>
        {displayItems.map((item: any, index: number) => {
          const displayName = is1v1 ? item.participantName : item.teamName;
          const displayDetails = is1v1
            ? item.participantEmail
            : item.members.map((m: any) => m.name).join(', ');
          const itemType = is1v1
            ? item.participantGender
            : item.teamType;

          return (
            <View key={is1v1 ? item.id : item.id} style={styles.teamItem}>
              <View style={styles.teamNumber}>
                <Text style={styles.teamNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.teamDetails}>
                <Text style={styles.teamName}>{displayName}</Text>
                <Text style={styles.teamMembers}>{displayDetails}</Text>
              </View>
              <View
                style={[
                  styles.teamTypeBadge,
                  { backgroundColor: getItemTypeColor(itemType) },
                ]}
              >
                <Text style={styles.teamTypeBadgeText}>{itemType}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case validationStrings.MALE:
      case Gender.MALE:
        return Colors.COLOR_BLUE;
      case validationStrings.FEMALE:
      case Gender.FEMALE:
        return Colors.COLOR_FEMALE;
      case validationStrings.MIXED:
        return Colors.COLOR_PURPLE;
      default:
        return Colors.iconSecondary;
    }
  };

  const getTotalCount = () => {
    if (is1v1) {
      return selectedGenderTab === 'all'
        ? participants.length
        : selectedGenderTab === 'male'
        ? maleParticipants.length
        : femaleParticipants.length;
    } else {
      return selectedGenderTab === 'all'
        ? teams.length
        : selectedGenderTab === 'male'
        ? maleTeams.length
        : selectedGenderTab === 'female'
        ? femaleTeams.length
        : mixedTeams.length;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <CustomHeader
          title={validationStrings.FIXTURE_CREATION}
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
        title={validationStrings.FIXTURE_CREATION}
        showBackButton={true}
        userRole={validationStrings.ADMIN}
      />

      <View style={styles.eventInfoCard}>
        <Text style={styles.eventTitle}>{event?.title}</Text>
        <View style={styles.eventMeta}>
          <Icon name="sports" size={16} color={Colors.text_light} />
          <Text style={styles.eventMetaText}>{event?.sportType}</Text>
          <Text style={styles.eventDivider}>{validationStrings.DIVIDER_DOT}</Text>
          <Text style={styles.eventMetaText}>{format}</Text>
        </View>
      </View>

      {fixturesGenerated && (
        <View style={styles.fixturesExistBanner}>
          <Icon name={validationStrings.ICON_CHECK_CIRCLE} size={24} color={Colors.success} />
          <Text style={styles.fixturesExistText}>
            {existingMatches.length} {validationStrings.FIXTURES_ALREADY_CREATED}
          </Text>
        </View>
      )}

      <View style={styles.genderTabs}>
        <TouchableOpacity
          style={[styles.genderTab, selectedGenderTab === 'all' && styles.genderTabActive]}
          onPress={() => setSelectedGenderTab('all')}
        >
          <Text style={[styles.genderTabText, selectedGenderTab === 'all' && styles.genderTabTextActive]}>
            {validationStrings.ALL} ({is1v1 ? participants.length : teams.length})
          </Text>
        </TouchableOpacity>

        {((is1v1 && maleParticipants.length > 0) || (!is1v1 && maleTeams.length > 0)) && (
          <TouchableOpacity
            style={[styles.genderTab, selectedGenderTab === 'male' && styles.genderTabActive]}
            onPress={() => setSelectedGenderTab('male')}
          >
            <Text style={[styles.genderTabText, selectedGenderTab === 'male' && styles.genderTabTextActive]}>
              {validationStrings.MALE} ({is1v1 ? maleParticipants.length : maleTeams.length})
            </Text>
          </TouchableOpacity>
        )}

        {((is1v1 && femaleParticipants.length > 0) || (!is1v1 && femaleTeams.length > 0)) && (
          <TouchableOpacity
            style={[styles.genderTab, selectedGenderTab === 'female' && styles.genderTabActive]}
            onPress={() => setSelectedGenderTab('female')}
          >
            <Text style={[styles.genderTabText, selectedGenderTab === 'female' && styles.genderTabTextActive]}>
              {validationStrings.FEMALE} ({is1v1 ? femaleParticipants.length : femaleTeams.length})
            </Text>
          </TouchableOpacity>
        )}

        {!is1v1 && mixedTeams.length > 0 && (
          <TouchableOpacity
            style={[styles.genderTab, selectedGenderTab === 'mixed' && styles.genderTabActive]}
            onPress={() => setSelectedGenderTab('mixed')}
          >
            <Text style={[styles.genderTabText, selectedGenderTab === 'mixed' && styles.genderTabTextActive]}>
              {validationStrings.MIXED} ({mixedTeams.length})
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{validationStrings.SELECT_TOURNAMENT_TYPE}</Text>
          <View style={styles.tournamentTypeContainer}>
            {renderTournamentTypeCard('round-robin')}
            {renderTournamentTypeCard('knockout')}
          </View>
        </View>

        {renderItemsList()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.createButton,
            fixturesGenerated && styles.createButtonDisabled,
          ]}
          onPress={() => handleCreateFixtures(getItemsForSelectedTab())}
          activeOpacity={0.8}
          disabled={fixturesGenerated}
        >
          <Icon
            name={fixturesGenerated ? validationStrings.ICON_CHECK_CIRCLE : 'sports-soccer'}
            size={24}
            color={Colors.white}
          />
          <Text style={styles.createButtonText}>
            {fixturesGenerated ? validationStrings.FIXTURES_CREATED_TEXT : validationStrings.CREATE_FIXTURES}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FixtureCreationScreen;