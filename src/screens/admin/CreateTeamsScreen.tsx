import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import { ParticipantRegistration } from '../../models/participantRegistration';
import { Team } from '../../models/team';
import { Gender } from '../../models/user';
import { useCreateTeamsViewModel } from '../../viewmodels/createTeamsViewModel';
import styles from './CreateTeamsScreenStyle';
import Colors from '../../constants/colors';
import { headerStrings, validationStrings } from '../../constants/validationStrings';

const CreateTeamsScreen = () => {
  const {
    format,
    approvedParticipants,
    existingTeams,
    loading,
    showManualModal,
    selectedParticipants,
    teamSize,
    stats,
    handleAutoGenerate,
    handleManualCreate,
    toggleParticipantSelection,
    createManualTeam,
    handleDeleteTeam,
    handleGenerateMatches,
    handleCloseModal,
    getTeamTypeColor,
    getTeamTypeIcon,
  } = useCreateTeamsViewModel();

  const renderParticipantItem = ({ item }: { item: ParticipantRegistration }) => {
    const isSelected = selectedParticipants.includes(item.participantEmail);

    return (
      <TouchableOpacity
        style={[
          styles.participantItem,
          isSelected && styles.participantItemSelected,
        ]}
        onPress={() => toggleParticipantSelection(item.participantEmail)}
        activeOpacity={0.7}
      >
        <View style={styles.participantLeft}>
          <View
            style={[
              styles.participantAvatar,
              isSelected && styles.participantAvatarSelected,
            ]}
          >
            <Icon
              name={isSelected ? 'check' : 'person'}
              size={24}
              color={isSelected ? Colors.white : Colors.iconSecondary}
            />
          </View>
          <View style={styles.participantInfo}>
            <Text style={styles.participantName}>{item.participantName}</Text>
            <Text style={styles.participantEmail}>{item.participantEmail}</Text>
          </View>
        </View>
        <View
          style={[
            styles.genderBadge,
            {
              backgroundColor:
                item.participantGender === Gender.MALE
                  ? Colors.badge_gender
                  : item.participantGender === Gender.FEMALE
                  ? Colors.FEMALE_GENDER_BADGE
                  : Colors.background,
            },
          ]}
        >
          <Icon
            name={item.participantGender === Gender.MALE ? validationStrings.MALE : validationStrings.FEMALE}
            size={14}
            color={item.participantGender === Gender.MALE ? Colors.badge_gender_text : Colors.badge_gender_text_female}
          />
          <Text
            style={[
              styles.genderText,
              {
                color: item.participantGender === Gender.MALE ? Colors.badge_gender_text : Colors.badge_gender_text_female,
              },
            ]}
          >
            {item.participantGender}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTeamCard = (team: Team) => {
    return (
      <View key={team.id} style={styles.teamCard}>
        <View style={styles.teamHeader}>
          <View style={styles.teamTitleRow}>
            <View
              style={[
                styles.teamTypeIcon,
                { backgroundColor: getTeamTypeColor(team.teamType) },
              ]}
            >
              <Icon
                name={getTeamTypeIcon(team.teamType)}
                size={20}
                color={Colors.white}
              />
            </View>
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{team.teamName}</Text>
              <Text style={styles.teamType}>{team.teamType} Team</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteTeamButton}
            onPress={() => handleDeleteTeam(team)}
            activeOpacity={0.7}
          >
            <Icon name="delete-outline" size={22} color={Colors.status_rejected} />
          </TouchableOpacity>
        </View>

        <View style={styles.teamMembers}>
          {team.members.map((member, index) => (
            <View key={index} style={styles.memberRow}>
              <View style={styles.memberAvatar}>
                <Icon name="person" size={18} color={Colors.status_rejected} />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberEmail}>{member.userId}</Text>
              </View>
              <View style={styles.memberGenderBadge}>
                <Icon
                  name={member.gender === Gender.MALE ? validationStrings.MALE : validationStrings.FEMALE}
                  size={12}
                  color={Colors.badge_general}
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.teamFooter}>
          <Text style={styles.createdText}>
            Created: {new Date(team.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={`Create ${format} Teams`}
        showBackButton={true}
        userRole="ADMIN"
      />

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.totalApproved}</Text>
          <Text style={styles.statLabel}>{validationStrings.APPROVED}</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={[styles.statValue, { color: Colors.COLOR_ORANGE }]}>
            {stats.unassigned}
          </Text>
          <Text style={styles.statLabel}>{validationStrings.UNASSIGNED}</Text>
        </View>
        <View style={[styles.statItem, styles.statBorder]}>
          <Text style={[styles.statValue, { color: Colors.COLOR_GREEN }]}>
            {stats.teamsCreated}
          </Text>
          <Text style={styles.statLabel}>{validationStrings.TEAMS}</Text>
        </View>
      </View>

      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.autoButton}
          onPress={handleAutoGenerate}
          activeOpacity={0.8}
          disabled={approvedParticipants.length === 0}
        >
          <Icon name="auto-fix-high" size={20} color={Colors.white} />
          <Text style={styles.autoButtonText}>{validationStrings.AUTO_GENERATE_MATCH}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.manualButton}
          onPress={handleManualCreate}
          activeOpacity={0.8}
          disabled={approvedParticipants.length === 0}
        >
          <Icon name="group-add" size={20} color={Colors.status_scheduled} />
          <Text style={styles.manualButtonText}>{validationStrings.MANUAL_CREATE}</Text>
        </TouchableOpacity>
      </View>

      {existingTeams.length >= 2 && (
        <View style={styles.matchGenerationBar}>
          <View style={styles.matchInfo}>
            <Icon name="sports" size={20} color={Colors.status_approved} />
            <Text style={styles.matchInfoText}>
              {existingTeams.length} {validationStrings.TEAMS_READY_FOR_MATCHES}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.generateMatchesButton}
            onPress={handleGenerateMatches}
            activeOpacity={0.8}
          >
            <Icon name="sports-soccer" size={20} color={Colors.white}/>
            <Text style={styles.generateMatchesText}>{validationStrings.GENERATE_MATCHES}</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{validationStrings.LOADING}</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {existingTeams.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="groups" size={24} color={Colors.stats_value} />
                <Text style={styles.sectionTitle}>{validationStrings.CREATED_TEAMS}</Text>
              </View>
              {existingTeams.map(renderTeamCard)}
            </View>
          )}

          {approvedParticipants.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Icon name="person-outline" size={24} color={Colors.stats_value} />
                <Text style={styles.sectionTitle}>{validationStrings.UNASSIGNED_PARTICIPANTS}</Text>
              </View>
              {approvedParticipants.map((participant, index) => (
                <View key={index} style={styles.unassignedItem}>
                  <View style={styles.unassignedAvatar}>
                    <Icon name="person" size={20} color={Colors.stats_label} />
                  </View>
                  <View style={styles.unassignedInfo}>
                    <Text style={styles.unassignedName}>{participant.participantName}</Text>
                    <Text style={styles.unassignedEmail}>{participant.participantEmail}</Text>
                  </View>
                  <View
                    style={[
                      styles.genderBadge,
                      {
                        backgroundColor:
                          participant.participantGender === Gender.MALE
                            ? Colors.badge_gender
                            : participant.participantGender === Gender.FEMALE
                            ? Colors.FEMALE_GENDER_BADGE
                            : Colors.radio_disabled_background,
                      },
                    ]}
                  >
                    <Icon
                      name={
                        participant.participantGender === Gender.FEMALE
                          ? 'female'
                          : 'male'
                      }
                      size={14}
                      color={
                        participant.participantGender === Gender.FEMALE
                          ? Colors.badge_gender_text_female
                          : Colors.badge_gender_text
                      }
                    />

                  </View>
                </View>
              ))}
            </View>
          )}

          {existingTeams.length === 0 && approvedParticipants.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="group-off" size={80} color={Colors.border_lighter}/>
              <Text style={styles.emptyTitle}>{validationStrings.NO_PARTICIPANTS_AVAILABLE}</Text>
              <Text style={styles.emptySubtitle}>
                {validationStrings.APPROVED_TEAM_ASSIGNED}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <Modal
        visible={showManualModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{validationStrings.MANUAL_TEAM_CREATE}</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon name="close" size={24} color={Colors.MANUAL_TEAM} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Select {teamSize} participant{teamSize > 1 ? 's' : ''} for this {format} team
            </Text>

            <View style={styles.selectionCounter}>
              <Text style={styles.counterText}>
                Selected: {selectedParticipants.length} / {teamSize}
              </Text>
            </View>

            <FlatList
              data={approvedParticipants}
              renderItem={renderParticipantItem}
              keyExtractor={item => item.id}
              style={styles.participantList}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
              style={[
                styles.createButton,
                selectedParticipants.length !== teamSize && styles.createButtonDisabled,
              ]}
              onPress={createManualTeam}
              disabled={selectedParticipants.length !== teamSize}
              activeOpacity={0.8}
            >
              <Icon name="check" size={20} color={Colors.white} />
              <Text style={styles.createButtonText}>{validationStrings.CREATE_TEAM}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateTeamsScreen;