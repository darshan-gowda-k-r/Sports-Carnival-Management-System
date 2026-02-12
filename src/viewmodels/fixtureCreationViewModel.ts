import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { eventApiService } from '../api/eventApiService';
import { teamApiService } from '../api/teamApiService';
import { matchApiService } from '../api/matchApiService';
import { Team, TeamType } from '../models/team';
import { PlayFormat } from '../models/event';
import { validationStrings } from '../constants/validationStrings';
import { ParticipantRegistration } from '../models/participantRegistration';
import { Gender } from '../models/user';

export const useFixtureCreationViewModel = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const {
    eventId,
    format,
    event: eventParam,
    directParticipants,
  } = route.params;

  const [event, setEvent] = useState<any>(eventParam);
  const [teams, setTeams] = useState<Team[]>([]);
  const [participants, setParticipants] = useState<ParticipantRegistration[]>(directParticipants || []);
  const [existingMatches, setExistingMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenderTab, setSelectedGenderTab] = useState<'all' | 'male' | 'female' | 'mixed'>('all');
  const [selectedTournamentType, setSelectedTournamentType] = useState<'round-robin' | 'knockout'>('round-robin');
  const [adminEmail] = useState(validationStrings.ADMIN_EMAIL);
  const [fixturesGenerated, setFixturesGenerated] = useState(false);

  const is1v1 = format === validationStrings.FORMAT_1V1;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      if (!event) {
        const eventData = await eventApiService.getEventById(eventId);
        setEvent(eventData);
      }

      const matches = await matchApiService.getMatchesByEventAndFormat(eventId, format);
      setExistingMatches(matches);

      if (matches.length > 0) {
        setFixturesGenerated(true);
      }

      if (is1v1 && directParticipants) {
        setParticipants(directParticipants);
      } else {
        const teamsData = await teamApiService.getTeamsByEventAndFormat(eventId, format);
        setTeams(teamsData);
      }
    } catch (error) {
      console.error(validationStrings.FAILED_TO_LOAD_DATA, error);
      Alert.alert(validationStrings.ERROR, validationStrings.FAILED_TO_LOAD_DATA);
    } finally {
      setLoading(false);
    }
  }, [eventId, format, event, is1v1, directParticipants]);

  const maleParticipants = participants.filter(p => p.participantGender === Gender.MALE);
  const femaleParticipants = participants.filter(p => p.participantGender === Gender.FEMALE);

  const maleTeams = teams.filter(t => t.teamType === TeamType.MALE);
  const femaleTeams = teams.filter(t => t.teamType === TeamType.FEMALE);
  const mixedTeams = teams.filter(t => t.teamType === TeamType.MIXED);

  const generateRoundRobinMatches = useCallback((items: any[], isParticipant: boolean) => {
    const matches: any[] = [];

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        matches.push({
          item1: items[i],
          item2: items[j],
        });
      }
    }

    return matches;
  }, []);

  const generateKnockoutMatches = useCallback((items: any[]) => {
    const matches: any[] = [];

    for (let i = 0; i < items.length - 1; i += 2) {
      if (items[i + 1]) {
        matches.push({
          item1: items[i],
          item2: items[i + 1],
        });
      }
    }

    return matches;
  }, []);

  const handleCreateFixtures = useCallback(async (itemsToUse: any[]) => {
    if (fixturesGenerated || existingMatches.length > 0) {
      Alert.alert(
        validationStrings.FIXTURES_ALREADY_EXIST,
        validationStrings.FIXTURES_EXIST_COUNT(existingMatches.length),
        [{ text: validationStrings.OK }]
      );
      return;
    }

    if (itemsToUse.length < 2) {
      Alert.alert(
        is1v1 ? validationStrings.INSUFFICIENT_PARTICIPANTS : validationStrings.INSUFFICIENT_TEAMS,
        is1v1 ? validationStrings.NEED_TWO_PARTICIPANTS : validationStrings.NEED_ATLEAST_MIN_TEAMS
      );
      return;
    }

    const matchesToCreate = selectedTournamentType === validationStrings.ROUND_ROBIN.toLowerCase().replace(' ', '-')
      ? generateRoundRobinMatches(itemsToUse, is1v1)
      : generateKnockoutMatches(itemsToUse);

    if (matchesToCreate.length === 0) {
      Alert.alert(validationStrings.ERROR, validationStrings.NO_MATCHES_YET);
      return;
    }

    Alert.alert(
      validationStrings.CREATE_FIXTURES,
      validationStrings.CREATE_TOURNAMENT_FIXTURES(
        selectedTournamentType,
        itemsToUse.length,
        is1v1,
        matchesToCreate.length
      ),
      [
        { text: validationStrings.CANCEL, style: validationStrings.ALERT_STYLE_CANCEL },
        {
          text: validationStrings.CREATE,
          onPress: async () => {
            try {
              const createdMatches: any[] = [];
              let matchCounter = 1;

              for (const matchPair of matchesToCreate) {
                if (is1v1) {
                  const match = await matchApiService.createMatch(
                    eventId,
                    format,
                    {
                      id: matchPair.item1.participantEmail,
                      teamName: matchPair.item1.participantName,
                    } as any,
                    {
                      id: matchPair.item2.participantEmail,
                      teamName: matchPair.item2.participantName,
                    } as any,
                    matchCounter,
                    new Date().toISOString().split(validationStrings.DATE_SEPARATOR)[0],
                    validationStrings.DEFAULT_TIME,
                    validationStrings.MAIN_VENUE,
                    adminEmail
                  );
                  createdMatches.push(match);
                } else {
                  const match = await matchApiService.createMatch(
                    eventId,
                    format,
                    matchPair.item1,
                    matchPair.item2,
                    matchCounter,
                    new Date().toISOString().split(validationStrings.DATE_SEPARATOR)[0],
                    validationStrings.DEFAULT_TIME,
                    validationStrings.MAIN_VENUE,
                    adminEmail
                  );
                  createdMatches.push(match);
                }
                matchCounter++;
              }

              setFixturesGenerated(true);
              setExistingMatches(createdMatches);

              Alert.alert(
                validationStrings.SUCCESS,
                validationStrings.FIXTURES_SUCCESS_DETAIL(createdMatches.length, selectedTournamentType),
                [
                  {
                    text: validationStrings.OK,
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error: any) {
              Alert.alert(validationStrings.ERROR, error.message || validationStrings.FAILED_TO_CREATE);
            }
          },
        },
      ]
    );
  }, [
    eventId,
    format,
    adminEmail,
    selectedTournamentType,
    navigation,
    is1v1,
    fixturesGenerated,
    existingMatches.length,
    generateRoundRobinMatches,
    generateKnockoutMatches,
  ]);

  const getItemsForSelectedTab = useCallback(() => {
    if (is1v1) {
      if (selectedGenderTab === validationStrings.MALE.toLowerCase()) return maleParticipants;
      if (selectedGenderTab === validationStrings.FEMALE.toLowerCase()) return femaleParticipants;
      return participants;
    } else {
      if (selectedGenderTab === validationStrings.MALE.toLowerCase()) return maleTeams;
      if (selectedGenderTab === validationStrings.FEMALE.toLowerCase()) return femaleTeams;
      if (selectedGenderTab === validationStrings.MIXED.toLowerCase()) return mixedTeams;
      return teams;
    }
  }, [selectedGenderTab, is1v1, participants, maleParticipants, femaleParticipants, teams, maleTeams, femaleTeams, mixedTeams]);

  return {
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
  };
};