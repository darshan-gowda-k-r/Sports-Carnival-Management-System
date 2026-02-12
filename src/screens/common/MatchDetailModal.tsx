import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Match, MatchStatus } from '../../models/match';
import { matchApiService } from '../../api/matchApiService';
import { validationStrings } from '../../constants/validationStrings';
import Colors from '../../constants/colors';
import styles from './MatchDetailModalStyle';

interface MatchDetailModalProps {
  match: Match;
  role: string;
  userEmail: string;
  onClose: () => void;
  onUpdate: () => void;
}

const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  role,
  userEmail,
  onClose,
  onUpdate,
}) => {
  const [team1Score, setTeam1Score] = useState(
    match.team1Score?.toString() || ''
  );
  const [team2Score, setTeam2Score] = useState(
    match.team2Score?.toString() || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canEditScore =
    role === validationStrings.ADMIN || role === validationStrings.ORGANIZER;
  const isCompleted = match.status === MatchStatus.COMPLETED;
  const isLive = match.status === MatchStatus.IN_PROGRESS;

  const handleSaveScore = async () => {
    const score1 = parseInt(team1Score);
    const score2 = parseInt(team2Score);

    if (isNaN(score1) || isNaN(score2)) {
      Alert.alert(
        validationStrings.ERROR,
        validationStrings.ENTER_VALID_SCORES
      );
      return;
    }

    if (score1 < 0 || score2 < 0) {
      Alert.alert(validationStrings.ERROR, validationStrings.SCORES_CANNOT_BE_NEGATIVE);
      return;
    }

    if (score1 === score2) {
      Alert.alert(
        validationStrings.WARNING,
        validationStrings.SCORES_EQUAL_DRAW,
        [
          { text: validationStrings.CANCEL, style: 'cancel' },
          {
            text: validationStrings.YES_SAVE_DRAW,
            onPress: () => submitScore(score1, score2, null),
          },
        ]
      );
      return;
    }

    const winnerId = score1 > score2 ? match.team1Id : match.team2Id;
    submitScore(score1, score2, winnerId);
  };

  const submitScore = async (
    score1: number,
    score2: number,
    winnerId: string | null
  ) => {
    try {
      setIsSubmitting(true);

      await matchApiService.recordMatchResult(
        match.id,
        score1,
        score2,
        winnerId || ''
      );

      Alert.alert(
        validationStrings.SUCCESS,
        validationStrings.MATCH_RESULT_RECORDED
      );
      onUpdate();
      onClose();
    } catch (error) {
      console.error(validationStrings.ERROR_SAVING_EVENTS, error);
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_SAVE_MATCH_RESULT);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsLive = async () => {
    try {
      setIsSubmitting(true);
      await matchApiService.updateMatchStatus(match.id, MatchStatus.IN_PROGRESS);
      Alert.alert(validationStrings.SUCCESS, validationStrings.MATCH_MARKED_LIVE);
      onUpdate();
      onClose();
    } catch (error) {
      console.error(validationStrings.ERROR_SAVING_EVENTS, error);
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_UPDATE_MATCH_STATUS);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = () => {
    switch (match.status) {
      case MatchStatus.IN_PROGRESS:
        return Colors.status_rejected;
      case MatchStatus.SCHEDULED:
        return Colors.primary;
      case MatchStatus.COMPLETED:
        return Colors.status_approved;
      case MatchStatus.CANCELLED:
        return Colors.iconSecondary;
      default:
        return Colors.text_lighter;
    }
  };

  console.log('MatchDetailModal rendering for match:', match.id, match.team1Name, validationStrings.VS.toLowerCase(), match.team2Name);

  return (
    <View style={{ height: '100%', width: '100%', backgroundColor: Colors.white }}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="sports" size={24} color={Colors.primary} />
          <Text style={styles.headerTitle}>{validationStrings.MATCH_DETAILS}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon name={validationStrings.ICON_CLOSE} size={24} color={Colors.text_dark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.matchHeader}>
          <View style={styles.matchNumberBadge}>
            <Text style={styles.matchNumberText}>
              {validationStrings.MATCH_NUMBER}
              {match.matchNumber || 1}
            </Text>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}
          >
            {isLive && <View style={styles.livePulse} />}
            <Text style={styles.statusText}>{match.status}</Text>
          </View>
        </View>

        <View style={styles.teamsSection}>
          <View style={styles.teamsRow}>
            <View style={styles.teamContainer}>
              <View style={styles.teamIconContainer}>
                <Icon name={validationStrings.ICON_GROUP} size={28} color={Colors.primary} />
              </View>
              <Text style={styles.teamName}>{match.team1Name}</Text>
              {isCompleted && (
                <View
                  style={[
                    styles.scoreDisplay,
                    match.winnerId === match.team1Id && styles.winnerScoreDisplay,
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreText,
                      match.winnerId === match.team1Id && styles.winnerScoreText,
                    ]}
                  >
                    {match.team1Score ?? 0}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.vsSection}>
              <Text style={styles.vsText}>{validationStrings.VS}</Text>
            </View>

            <View style={styles.teamContainer}>
              <View style={styles.teamIconContainer}>
                <Icon name={validationStrings.ICON_GROUP} size={28} color={Colors.primary} />
              </View>
              <Text style={styles.teamName}>{match.team2Name}</Text>
              {isCompleted && (
                <View
                  style={[
                    styles.scoreDisplay,
                    match.winnerId === match.team2Id && styles.winnerScoreDisplay,
                  ]}
                >
                  <Text
                    style={[
                      styles.scoreText,
                      match.winnerId === match.team2Id && styles.winnerScoreText,
                    ]}
                  >
                    {match.team2Score ?? 0}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {isCompleted && match.winnerId && (
          <View style={styles.winnerBanner}>
            <Icon name={validationStrings.ICON_TROPHY} size={24} color={Colors.winner_icon} />
            <Text style={styles.winnerText}>
              {validationStrings.WINNER}:{' '}
              {match.winnerId === match.team1Id
                ? match.team1Name
                : match.team2Name}
            </Text>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>{validationStrings.MATCH_INFO}</Text>

          <View style={styles.infoRow}>
            <Icon name={validationStrings.ICON_EVENT} size={20} color={Colors.text_light} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{validationStrings.DATE_LABEL}</Text>
              <Text style={styles.infoValue}>{match.scheduledDate}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="access-time" size={20} color={Colors.text_light} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{validationStrings.TIME_LABEL}</Text>
              <Text style={styles.infoValue}>{match.scheduledTime}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="location-on" size={20} color={Colors.text_light} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>{validationStrings.VENUE_LABEL}</Text>
              <Text style={styles.infoValue}>{match.venue}</Text>
            </View>
          </View>
        </View>

        {canEditScore && !isCompleted && (
          <View style={styles.scoreEntrySection}>
            <Text style={styles.sectionTitle}>{validationStrings.ENTER_MATCH_RESULT}</Text>

            <View style={styles.scoreInputsContainer}>
              <View style={styles.scoreInputWrapper}>
                <Text style={styles.scoreInputLabel}>{match.team1Name}</Text>
                <TextInput
                  style={styles.scoreInput}
                  value={team1Score}
                  onChangeText={setTeam1Score}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={Colors.text_lighter}
                  editable={!isSubmitting}
                />
              </View>

              <View style={styles.scoreInputDivider}>
                <Text style={styles.scoreInputDividerText}>:</Text>
              </View>

              <View style={styles.scoreInputWrapper}>
                <Text style={styles.scoreInputLabel}>{match.team2Name}</Text>
                <TextInput
                  style={styles.scoreInput}
                  value={team2Score}
                  onChangeText={setTeam2Score}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={Colors.text_lighter}
                  editable={!isSubmitting}
                />
              </View>
            </View>

            <View style={styles.actionButtons}>
              {match.status === MatchStatus.SCHEDULED && (
                <TouchableOpacity
                  style={styles.liveButton}
                  onPress={handleMarkAsLive}
                  disabled={isSubmitting}
                >
                  <Icon name="play-circle-outline" size={20} color={Colors.white} />
                  <Text style={styles.liveButtonText}>{validationStrings.MARK_AS_LIVE}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  isSubmitting && styles.saveButtonDisabled,
                ]}
                onPress={handleSaveScore}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <>
                    <Icon name={validationStrings.ICON_CHECK_CIRCLE} size={20} color={Colors.white} />
                    <Text style={styles.saveButtonText}>
                      {validationStrings.SAVE_FINISH_MATCH}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!canEditScore && (
          <View style={styles.participantNote}>
            <Icon name="info-outline" size={20} color={Colors.info} />
            <Text style={styles.participantNoteText}>
              {isCompleted
                ? validationStrings.MATCH_COMPLETED_FINAL_RESULTS
                : validationStrings.MATCH_UPDATED_BY_ORGANIZER}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MatchDetailModal;