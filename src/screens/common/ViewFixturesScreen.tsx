import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import { useViewFixturesViewModel } from '../../viewmodels/viewFixturesViewModel';
import { Match, MatchStatus } from '../../models/match';
import MatchDetailModal from './MatchDetailModal';
import styles from './ViewFixturesScreenStyle';
import Colors from '../../constants/colors';
import { validationStrings } from '../../constants/validationStrings';

const ViewFixturesScreen = () => {
  const {
    role,
    userEmail,
    matches,
    loading,
    refreshing,
    selectedGenderTab,
    selectedStatusTab,
    isChessEvent,
    maleMatches,
    femaleMatches,
    mixedMatches,
    myFixtures,
    otherFixtures,
    liveMatches,
    upcomingMatches,
    completedMatches,
    setSelectedGenderTab,
    setSelectedStatusTab,
    onRefresh,
    getStatusColor,
    getMatchesForDisplay,
  } = useViewFixturesViewModel();

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isMatchDetailVisible, setIsMatchDetailVisible] = useState(false);

  const handleMatchPress = (match: Match) => {
    console.log('Match pressed:', match.id);
    setTimeout(() => {
      setSelectedMatch(match);
      setIsMatchDetailVisible(true);
    }, 0);
  };

  const handleCloseMatchDetail = () => {
    console.log('Closing modal');
    setIsMatchDetailVisible(false);
    setTimeout(() => {
      setSelectedMatch(null);
    }, 300);
  };

  const handleMatchUpdate = () => {
    onRefresh();
  };

  const renderMatch = (match: Match) => {
    const isCompleted = match.status === MatchStatus.COMPLETED;
    const isLive = match.status === MatchStatus.IN_PROGRESS;
    const isMyMatch = role === validationStrings.PARTICIPANT &&
      myFixtures.some(m => m.id === match.id);

    return (
      <TouchableOpacity
        key={match.id}
        style={[
          styles.matchCard,
          isMyMatch && styles.myMatchCard
        ]}
        onPress={() => handleMatchPress(match)}
        activeOpacity={0.7}
      >
        <View style={styles.matchHeader}>
          <View style={styles.matchNumberBadge}>
            <Text style={styles.matchNumberText}>
              {validationStrings.MATCH_NUMBER}{match.matchNumber || 1}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {isMyMatch && (
              <View style={styles.myMatchBadge}>
                <Text style={styles.myMatchText}>{validationStrings.MY_MATCH}</Text>
              </View>
            )}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(match.status) }]}>
              {isLive && <View style={styles.livePulse} />}
              <Text style={styles.statusText}>{match.status}</Text>
            </View>
          </View>
        </View>

        <View style={styles.teamsContainer}>
          <View style={styles.teamBox}>
            <Icon name={validationStrings.ICON_GROUP} size={24} color={Colors.match_team_icon} />
            <Text style={styles.teamName} numberOfLines={1}>{match.team1Name}</Text>
            {isCompleted && (
              <Text style={[
                styles.score,
                match.winnerId === match.team1Id && styles.winnerScore
              ]}>
                {match.team1Score ?? '-'}
              </Text>
            )}
          </View>

          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>{validationStrings.VS}</Text>
          </View>

          <View style={styles.teamBox}>
            <Icon name={validationStrings.ICON_GROUP} size={24} color={Colors.match_team_icon} />
            <Text style={styles.teamName} numberOfLines={1}>{match.team2Name}</Text>
            {isCompleted && (
              <Text style={[
                styles.score,
                match.winnerId === match.team2Id && styles.winnerScore
              ]}>
                {match.team2Score ?? '-'}
              </Text>
            )}
          </View>
        </View>

        {isCompleted && match.winnerId && (
          <View style={styles.winnerBanner}>
            <Icon name={validationStrings.ICON_TROPHY} size={20} color={Colors.winner_icon} />
            <Text style={styles.winnerText}>
              {validationStrings.WINNER}: {match.winnerId === match.team1Id ? match.team1Name : match.team2Name}
            </Text>
          </View>
        )}

        <View style={styles.matchDetails}>
          <View style={styles.detailRow}>
            <Icon name={validationStrings.ICON_EVENT} size={16} color={Colors.text_light} />
            <Text style={styles.detailText}>{match.scheduledDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="access-time" size={16} color={Colors.text_light} />
            <Text style={styles.detailText}>{match.scheduledTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Icon name="location-on" size={16} color={Colors.text_light} />
            <Text style={styles.detailText} numberOfLines={1}>{match.venue}</Text>
          </View>
        </View>

        <View style={styles.tapHintContainer}>
          <Text style={styles.tapHint}>{validationStrings.TAP_TO_VIEW_DETAILS}</Text>
          <Icon name={validationStrings.ICON_CHEVRON_RIGHT} size={16} color={Colors.text_lighter} />
        </View>
      </TouchableOpacity>
    );
  };

  const displayMatches = getMatchesForDisplay();

  const renderGenderTabs = () => {
    if (isChessEvent) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.genderTabs}
      >
        <TouchableOpacity
          style={[styles.tab, selectedGenderTab === 'all' && styles.tabActive]}
          onPress={() => setSelectedGenderTab('all')}
        >
          <Text style={[styles.tabText, selectedGenderTab === 'all' && styles.tabTextActive]}>
            {validationStrings.ALL} ({matches.length})
          </Text>
        </TouchableOpacity>

        {maleMatches.length > 0 && (
          <TouchableOpacity
            style={[styles.tab, selectedGenderTab === 'male' && styles.tabActive]}
            onPress={() => setSelectedGenderTab('male')}
          >
            <Text style={[styles.tabText, selectedGenderTab === 'male' && styles.tabTextActive]}>
              {validationStrings.MALE} ({maleMatches.length})
            </Text>
          </TouchableOpacity>
        )}

        {femaleMatches.length > 0 && (
          <TouchableOpacity
            style={[styles.tab, selectedGenderTab === 'female' && styles.tabActive]}
            onPress={() => setSelectedGenderTab('female')}
          >
            <Text style={[styles.tabText, selectedGenderTab === 'female' && styles.tabTextActive]}>
              {validationStrings.FEMALE} ({femaleMatches.length})
            </Text>
          </TouchableOpacity>
        )}

        {mixedMatches.length > 0 && (
          <TouchableOpacity
            style={[styles.tab, selectedGenderTab === 'mixed' && styles.tabActive]}
            onPress={() => setSelectedGenderTab('mixed')}
          >
            <Text style={[styles.tabText, selectedGenderTab === 'mixed' && styles.tabTextActive]}>
              {validationStrings.MIXED} ({mixedMatches.length})
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  const renderParticipantTabs = () => {
    if (role !== validationStrings.PARTICIPANT || isChessEvent) return null;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.participantTabs}
      >
        <TouchableOpacity
          style={[styles.tab, selectedGenderTab === 'my' && styles.tabActive]}
          onPress={() => setSelectedGenderTab('my')}
        >
          <Text style={[styles.tabText, selectedGenderTab === 'my' && styles.tabTextActive]}>
            {validationStrings.MY_FIXTURES} ({myFixtures.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedGenderTab === 'others' && styles.tabActive]}
          onPress={() => setSelectedGenderTab('others')}
        >
          <Text style={[styles.tabText, selectedGenderTab === 'others' && styles.tabTextActive]}>
            {validationStrings.OTHER_FIXTURES} ({otherFixtures.length})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderStatusTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.statusTabs}
    >
      <TouchableOpacity
        style={[styles.statusTab, selectedStatusTab === 'all' && styles.statusTabActive]}
        onPress={() => setSelectedStatusTab('all')}
      >
        <Text style={[styles.statusTabText, selectedStatusTab === 'all' && styles.statusTabTextActive]}>
          {validationStrings.ALL}
        </Text>
      </TouchableOpacity>

      {liveMatches.length > 0 && (
        <TouchableOpacity
          style={[styles.statusTab, selectedStatusTab === 'live' && styles.statusTabActive]}
          onPress={() => setSelectedStatusTab('live')}
        >
          <View style={styles.liveIndicator} />
          <Text style={[styles.statusTabText, selectedStatusTab === 'live' && styles.statusTabTextActive]}>
            {validationStrings.LIVE} ({liveMatches.length})
          </Text>
        </TouchableOpacity>
      )}

      {upcomingMatches.length > 0 && (
        <TouchableOpacity
          style={[styles.statusTab, selectedStatusTab === 'upcoming' && styles.statusTabActive]}
          onPress={() => setSelectedStatusTab('upcoming')}
        >
          <Text style={[styles.statusTabText, selectedStatusTab === 'upcoming' && styles.statusTabTextActive]}>
            {validationStrings.UPCOMING} ({upcomingMatches.length})
          </Text>
        </TouchableOpacity>
      )}

      {completedMatches.length > 0 && (
        <TouchableOpacity
          style={[styles.statusTab, selectedStatusTab === 'completed' && styles.statusTabActive]}
          onPress={() => setSelectedStatusTab('completed')}
        >
          <Text style={[styles.statusTabText, selectedStatusTab === 'completed' && styles.statusTabTextActive]}>
            {validationStrings.COMPLETED} ({completedMatches.length})
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );

  console.log('Render - Modal visible:', isMatchDetailVisible, 'Selected match:', selectedMatch?.id);

  return (
    <>
      <SafeAreaView style={styles.container} edges={['top']}>
        <CustomHeader
          title={validationStrings.FIXTURES}
          showBackButton={true}
          userRole={role}
        />

        <View style={styles.tabsContainer}>
          {role === validationStrings.PARTICIPANT && !isChessEvent && renderParticipantTabs()}
          {(role !== validationStrings.PARTICIPANT || isChessEvent) && renderGenderTabs()}
          {renderStatusTabs()}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{validationStrings.LOADING}</Text>
          </View>
        ) : displayMatches.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="sports-soccer" size={80} color={Colors.border_lighter} />
            <Text style={styles.emptyTitle}>{validationStrings.NO_FIXTURES_YET}</Text>
            <Text style={styles.emptySubtitle}>{validationStrings.NO_FIXTURES_CREATED}</Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {displayMatches.map(renderMatch)}
          </ScrollView>
        )}
      </SafeAreaView>

      {isMatchDetailVisible && selectedMatch && (
        <Modal
          visible={true}
          transparent={true}
          animationType={validationStrings.ANIMATION_SLIDE}
          onRequestClose={handleCloseMatchDetail}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              width: '90%',
              maxWidth: 500,
              height: '85%',
              backgroundColor: Colors.white,
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 10,
            }}>
              <MatchDetailModal
                match={selectedMatch}
                role={role}
                userEmail={userEmail}
                onClose={handleCloseMatchDetail}
                onUpdate={handleMatchUpdate}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default ViewFixturesScreen;