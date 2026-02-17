import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import { useIndividualRegistrationViewModel } from '../../viewmodels/individualRegistrationViewModel';
import styles from './IndividualRegistrationScreenStyle';
import Colors from '../../constants/colors';
import { validationStrings } from '../../constants/validationStrings';

const IndividualRegistrationScreen = () => {
  const {
    event,
    user,
    selectedFormat,
    loading,
    availableFormats,
    hasMultipleFormats,

    handleFormatSelect,
    handleRegister,

    getSpotsLeft,
    isFormatFull,
    getFormatDescription,
  } = useIndividualRegistrationViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={validationStrings.REGISTER_FOR_EVENT}
        showBackButton={true}
        userRole={validationStrings.PARTICIPANT}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventSport}>{event.sportType}</Text>
          <View style={styles.eventMeta}>
            <Icon name={validationStrings.ICON_EVENT} size={16} color={Colors.menu_subtitle}/>
            <Text style={styles.eventMetaText}>
              {new Date(event.matchDate).toLocaleDateString('en-GB')}
            </Text>
            <Text style={styles.divider}>{validationStrings.DIVIDER_DOT}</Text>
            <Icon name="location-on" size={16} color={Colors.menu_subtitle} />
            <Text style={styles.eventMetaText}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Icon name="info" size={20} color={Colors.section_link} />
          <Text style={styles.infoCardText}>
            {validationStrings.INDIVIDUAL_REGISTRATION_INFO}
          </Text>
        </View>

        {hasMultipleFormats ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="sports" size={24} color={Colors.input_text} />
              <Text style={styles.sectionTitle}>
                {validationStrings.SELECT_FORMAT_TITLE}
              </Text>
            </View>

            {availableFormats.map((format) => {
              const spotsLeft = getSpotsLeft(format);
              const isFull = isFormatFull(format);
              const isSelected = selectedFormat === format.format;

              return (
                <TouchableOpacity
                  key={format.format}
                  style={[
                    styles.formatOption,
                    isSelected && styles.formatOptionSelected,
                    isFull && styles.formatOptionDisabled,
                  ]}
                  onPress={() => handleFormatSelect(format.format, isFull)}
                  disabled={isFull}
                >
                  <View style={styles.formatHeader}>
                    <View style={styles.formatTitleSection}>
                      <View style={[
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected,
                        isFull && styles.radioButtonDisabled,
                      ]}>
                        {isSelected && <View style={styles.radioButtonInner} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[
                          styles.formatTitle,
                          isFull && styles.formatTitleDisabled,
                        ]}>
                          {format.format}
                        </Text>
                        <Text style={styles.formatDescription}>
                          {getFormatDescription(format.format)}
                        </Text>
                      </View>
                    </View>
                    {isFull ? (
                      <View style={styles.fullBadge}>
                        <Text style={styles.fullBadgeText}>
                          {validationStrings.FULL}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.spotsBadge}>
                        <Text style={styles.spotsText}>
                          {spotsLeft} {validationStrings.SPOTS}
                        </Text>
                      </View>
                    )}
                  </View>

                  {!event.allowsMixedGender && (
                    <View style={styles.genderStatsContainer}>
                      <View style={styles.genderStat}>
                        <Icon name="man" size={16} color={Colors.COLOR_BLUE} />
                        <Text style={styles.genderStatText}>
                          {validationStrings.MALE}: {format.registeredMaleCount}/{format.maxMaleParticipants}
                        </Text>
                      </View>
                      <View style={styles.genderStat}>
                        <Icon name="woman" size={16} color={Colors.COLOR_FEMALE} />
                        <Text style={styles.genderStatText}>
                          {validationStrings.FEMALE}: {format.registeredFemaleCount}/{format.maxFemaleParticipants}
                        </Text>
                      </View>
                    </View>
                  )}

                  {event.allowsMixedGender && (
                    <View style={styles.totalStatsContainer}>
                      <Text style={styles.totalStatsText}>
                        {validationStrings.TOTAL_REGISTERED_LABEL}: {format.registeredMaleCount + format.registeredFemaleCount}/
                        {format.maxMaleParticipants + format.maxFemaleParticipants}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="sports" size={24} color={Colors.input_text} />
              <Text style={styles.sectionTitle}>{validationStrings.EVENT_FORMAT_TITLE}</Text>
            </View>

            {availableFormats.length > 0 && (
              <View style={styles.formatInfoCard}>
                <View style={styles.formatInfoHeader}>
                  <Icon name={validationStrings.ICON_TROPHY} size={32} color={Colors.section_link} />
                  <View style={styles.formatInfoContent}>
                    <Text style={styles.formatInfoTitle}>{availableFormats[0].format}</Text>
                    <Text style={styles.formatInfoDesc}>
                      {getFormatDescription(availableFormats[0].format)}
                    </Text>
                  </View>
                </View>

                <View style={styles.availabilityCard}>
                  {!event.allowsMixedGender ? (
                    <>
                      <View style={styles.availabilityRow}>
                        <Icon name="man" size={20} color={Colors.COLOR_BLUE} />
                        <Text style={styles.availabilityText}>
                          {validationStrings.MALE_SPOTS}: {availableFormats[0].registeredMaleCount}/{availableFormats[0].maxMaleParticipants}
                        </Text>
                        <View style={[
                          styles.availabilityBadge,
                          { backgroundColor: availableFormats[0].registeredMaleCount < availableFormats[0].maxMaleParticipants
                            ? Colors.badge_spots : Colors.rejection_background }
                        ]}>
                          <Text style={styles.availabilityBadgeText}>
                            {availableFormats[0].maxMaleParticipants - availableFormats[0].registeredMaleCount} {validationStrings.LEFT_TEXT}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.availabilityRow}>
                        <Icon name="woman" size={20} color={Colors.COLOR_FEMALE} />
                        <Text style={styles.availabilityText}>
                          {validationStrings.FEMALE_SPOTS}: {availableFormats[0].registeredFemaleCount}/{availableFormats[0].maxFemaleParticipants}
                        </Text>
                        <View style={[
                          styles.availabilityBadge,
                          { backgroundColor: availableFormats[0].registeredFemaleCount < availableFormats[0].maxFemaleParticipants
                            ? Colors.badge_spots : Colors.rejection_background }
                        ]}>
                          <Text style={styles.availabilityBadgeText}>
                            {availableFormats[0].maxFemaleParticipants - availableFormats[0].registeredFemaleCount} {validationStrings.LEFT_TEXT}
                          </Text>
                        </View>
                      </View>
                    </>
                  ) : (
                    <View style={styles.availabilityRow}>
                      <Icon name={validationStrings.ICON_PEOPLE} size={20} color={Colors.section_link} />
                      <Text style={styles.availabilityText}>
                        {validationStrings.TOTAL_SPOTS}: {availableFormats[0].registeredMaleCount + availableFormats[0].registeredFemaleCount}/
                        {availableFormats[0].maxMaleParticipants + availableFormats[0].maxFemaleParticipants}
                      </Text>
                      <View style={[
                        styles.availabilityBadge,
                        { backgroundColor: (availableFormats[0].registeredMaleCount + availableFormats[0].registeredFemaleCount) <
                          (availableFormats[0].maxMaleParticipants + availableFormats[0].maxFemaleParticipants)
                          ? Colors.badge_spots : Colors.rejection_background }
                      ]}>
                        <Text style={styles.availabilityBadgeText}>
                          {(availableFormats[0].maxMaleParticipants + availableFormats[0].maxFemaleParticipants) -
                           (availableFormats[0].registeredMaleCount + availableFormats[0].registeredFemaleCount)} {validationStrings.LEFT_TEXT}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        )}

        {user?.gender && (
          <View style={styles.userInfoCard}>
            <Icon name={validationStrings.PERSON} size={20} color={Colors.menu_subtitle} />
            <View style={styles.userInfoContent}>
              <Text style={styles.userInfoLabel}>
                {validationStrings.YOUR_GENDER}
              </Text>
              <View style={styles.genderBadge}>
                <Text style={styles.genderText}>{user.gender}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.processCard}>
          <Text style={styles.processTitle}>
            {validationStrings.WHAT_HAPPENS_NEXT}
          </Text>
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>1</Text>
            </View>
            <Text style={styles.processText}>
              {validationStrings.SUBMIT_REGISTRATION_STEP}
            </Text>
          </View>
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>2</Text>
            </View>
            <Text style={styles.processText}>
              {validationStrings.REVIEW_REGISTRATION_STEP(event.organizerId ? 'Event organizer' : 'Admin')}
            </Text>
          </View>
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>3</Text>
            </View>
            <Text style={styles.processText}>
              {validationStrings.APPROVAL_NOTIFICATION_STEP}
            </Text>
          </View>
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>4</Text>
            </View>
            <Text style={styles.processText}>
              {event.sportType === validationStrings.SPORT_TYPE_FOOSBALL
                ? validationStrings.TEAMS_AND_FIXTURES_STEP
                : validationStrings.FIXTURES_CREATION_STEP}
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingButton}>
            <ActivityIndicator size="small" color={Colors.white} />
            <Text style={styles.loadingButtonText}>
              {validationStrings.SUBMITTING}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.registerButton,
              (hasMultipleFormats && !selectedFormat) && styles.registerButtonDisabled
            ]}
            onPress={handleRegister}
            disabled={hasMultipleFormats && !selectedFormat}
          >
            <Icon name={validationStrings.ICON_HOW_TO_REG} size={24} color={Colors.white} />
            <Text style={styles.registerButtonText}>
              {validationStrings.SUBMIT_REGISTRATION}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default IndividualRegistrationScreen;