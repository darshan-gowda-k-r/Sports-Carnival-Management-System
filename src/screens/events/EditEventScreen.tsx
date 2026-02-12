import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { validationStrings, headerStrings } from '../../constants/validationStrings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useEditEventViewModel } from '../../viewmodels/editEventViewModel';
import { allows2v2Format, allowsMixedGender, getTotalRegistered, isChess } from '../../models/event';
import { useAuth } from '../../context/authContext';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors';
import styles from './EditEventScreenStyle';

const EditEventScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { event } = route.params;

  const currentUserId = user?.email || user?.id;
  const isAdmin = user?.role === validationStrings.ADMIN;
  const isOwner = event.organizerId === currentUserId;
  const canEdit = isAdmin || isOwner;

  useEffect(() => {
    if (!canEdit) {
      Alert.alert(
        validationStrings.ERROR,
        validationStrings.NO_EDIT_PERMISSION,
        [
          {
            text: validationStrings.OK,
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  }, [canEdit, navigation]);

  const {
    title,
    sportType,
    description,
    registrationDeadline,
    matchDate,
    showDeadlinePicker,
    showMatchDatePicker,
    tempDeadline,
    tempMatchDate,
    location,
    format1v1Available,
    format2v2Available,
    maxMaleParticipants1v1,
    maxFemaleParticipants1v1,
    maxMaleParticipants2v2,
    maxFemaleParticipants2v2,
    maxTotalParticipants,
    format1v1,
    format2v2,

    setTitle,
    setSportType,
    setDescription,
    setLocation,
    setMaxMaleParticipants1v1,
    setMaxFemaleParticipants1v1,
    setMaxMaleParticipants2v2,
    setMaxFemaleParticipants2v2,
    setMaxTotalParticipants,

    formatDate,
    onDeadlineChange,
    handleDeadlineConfirm,
    handleDeadlineCancel,
    handleShowDeadlinePicker,
    onMatchDateChange,
    handleMatchDateConfirm,
    handleMatchDateCancel,
    handleShowMatchDatePicker,
    toggleFormat1v1,
    toggleFormat2v2,
    handleUpdate,
  } = useEditEventViewModel();

  const isFoosball = allows2v2Format(sportType);
  const isMixedGender = allowsMixedGender(sportType);
  const isChessGame = isChess(sportType);

  const getMinMatchDate = () => {
    if (!registrationDeadline) return new Date();
    const minDate = new Date(registrationDeadline);
    minDate.setDate(minDate.getDate() + 2);
    return minDate;
  };

  if (!canEdit) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={headerStrings.EDIT_EVENT}
        showBackButton={true}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {event.organizerId && (
          <View style={styles.organizerBadge}>
            <Icon name={validationStrings.PERSON} size={16} color={Colors.primary} />
            <Text style={styles.organizerText}>
              {validationStrings.CREATED_BY} {event.organizerId}
              {isOwner && ' (You)'}
            </Text>
          </View>
        )}

        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Icon name="title" size={20} color={Colors.gray} />
              <Text style={styles.label}>{validationStrings.EVENT_TITLE}</Text>
            </View>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder={validationStrings.EVENT_TITLE}
              placeholderTextColor={Colors.text_lighter}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Icon name="sports" size={20} color={Colors.gray} />
              <Text style={styles.label}>{validationStrings.SPORT_TYPE_TITLE}</Text>
            </View>
            <TextInput
              style={[styles.input, { backgroundColor: Colors.border_light }]}
              value={sportType}
              onChangeText={setSportType}
              placeholder={validationStrings.GAMES}
              placeholderTextColor={Colors.text_lighter}
              editable={false}
            />
            {sportType && isMixedGender && (
              <View style={styles.infoBox}>
                <Icon name="info" size={16} color={Colors.info} />
                <Text style={styles.infoText}>
                  ♟️ {validationStrings.CHESS_MIXED_ALLOWED}
                </Text>
              </View>
            )}
            {sportType && isFoosball && (
              <View style={styles.infoBox}>
                <Icon name="info" size={16} color={Colors.warning} />
                <Text style={styles.infoText}>
                  ⚽ {validationStrings.FOOSBALL_RULES}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Icon name="description" size={20} color={Colors.gray} />
              <Text style={styles.label}>{validationStrings.DESCRIPTION}</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder={validationStrings.EVENT_DES}
              placeholderTextColor={Colors.text_lighter}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Icon name="event-available" size={20} color={Colors.gray} />
              <Text style={styles.label}>{validationStrings.REG_DEADLINE}</Text>
            </View>
            <TouchableOpacity
              style={styles.input}
              onPress={handleShowDeadlinePicker}
              activeOpacity={0.7}
            >
              <Text style={registrationDeadline ? styles.dateText : styles.datePlaceholder}>
                {registrationDeadline ? formatDate(registrationDeadline) : validationStrings.SELECT_DEADLINE}
              </Text>
            </TouchableOpacity>
            <Text style={styles.helperText}>{validationStrings.REG_CLOSES_ON_THIS_DAY}</Text>

            {showDeadlinePicker && (
              <DateTimePicker
                value={tempDeadline}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDeadlineChange}
                minimumDate={new Date()}
              />
            )}

            {showDeadlinePicker && Platform.OS === 'ios' && (
              <View style={styles.datePickerButtons}>
                <TouchableOpacity
                  style={[styles.datePickerButton, styles.cancelButton]}
                  onPress={handleDeadlineCancel}
                >
                  <Text style={styles.cancelButtonText}>{validationStrings.CANCEL}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={handleDeadlineConfirm}
                >
                  <Text style={styles.datePickerButtonText}>{validationStrings.DONE}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Icon name={validationStrings.ICON_EVENT} size={20} color={Colors.gray} />
              <Text style={styles.label}>{validationStrings.MATCH_DATE_DISPLAY}</Text>
            </View>
            <TouchableOpacity
              style={styles.input}
              onPress={handleShowMatchDatePicker}
              activeOpacity={0.7}
            >
              <Text style={matchDate ? styles.dateText : styles.datePlaceholder}>
                {matchDate ? formatDate(matchDate) : validationStrings.FORMAT_DATE}
              </Text>
            </TouchableOpacity>
            <Text style={styles.helperText}>
              {validationStrings.MATCH_VALID_REGISTRATION}
            </Text>

            {showMatchDatePicker && (
              <DateTimePicker
                value={tempMatchDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onMatchDateChange}
                minimumDate={getMinMatchDate()}
              />
            )}

            {showMatchDatePicker && Platform.OS === 'ios' && (
              <View style={styles.datePickerButtons}>
                <TouchableOpacity
                  style={[styles.datePickerButton, styles.cancelButton]}
                  onPress={handleMatchDateCancel}
                >
                  <Text style={styles.cancelButtonText}>{validationStrings.CANCEL}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={handleMatchDateConfirm}
                >
                  <Text style={styles.datePickerButtonText}>{validationStrings.DONE}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelContainer}>
              <Icon name="location-on" size={20} color={Colors.gray} />
              <Text style={styles.label}>{validationStrings.LOCATIONS}</Text>
            </View>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder={validationStrings.EVENT_LOCATION}
              placeholderTextColor={Colors.text_lighter}
            />
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.sectionHeader}>
            <Icon name="format-list-bulleted" size={24} color={Colors.text_dark} />
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>{validationStrings.PART_LIMIT}</Text>
              <Text style={styles.sectionSubtitle}>
                {isChessGame
                  ? validationStrings.TOTAL_MIXED_SUBTITLE
                  : isFoosball
                  ? validationStrings.MAX_FOR_TEAM_CREATION
                  : validationStrings.MAX_FOR_EACH_GENDER}
              </Text>
            </View>
          </View>

          {isChessGame && (
            <View style={styles.formatCard}>
              <TouchableOpacity
                style={styles.formatCheckbox}
                onPress={toggleFormat1v1}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, format1v1Available && styles.checkboxActive]}>
                  {format1v1Available && <Icon name="check" size={18} color={Colors.white} />}
                </View>
                <View style={styles.formatInfo}>
                  <Text style={styles.formatLabel}>♟️ {validationStrings.CHESS_1V1_FORMAT}</Text>
                  <Text style={styles.formatDescription}>
                    {validationStrings.INDIVIDUAL_MIXED}
                    {format1v1 && getTotalRegistered(format1v1) > 0 &&
                      ` ${validationStrings.DIVIDER_DOT} ${getTotalRegistered(format1v1)} ${validationStrings.REGISTERED_LABEL}`}
                  </Text>
                </View>
              </TouchableOpacity>

              {format1v1Available && (
                <View style={styles.formatInputContainer}>
                  <Text style={styles.inputLabel}>{validationStrings.MAX_TOTAL_PARTICIPANTS}</Text>
                  <TextInput
                    style={styles.formatInput}
                    keyboardType="numeric"
                    value={maxTotalParticipants}
                    onChangeText={setMaxTotalParticipants}
                    placeholder={validationStrings.ENTER_TOTAL_NUMBER}
                    placeholderTextColor={Colors.text_lighter}
                  />
                  <Text style={styles.helperText}>
                    Current: {format1v1?.registeredMaleCount || 0} males, {format1v1?.registeredFemaleCount || 0} females
                  </Text>
                </View>
              )}
            </View>
          )}

          {isFoosball && (
            <View style={styles.formatCard}>
              <TouchableOpacity
                style={styles.formatCheckbox}
                onPress={toggleFormat2v2}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, format2v2Available && styles.checkboxActive]}>
                  {format2v2Available && <Icon name="check" size={18} color={Colors.white} />}
                </View>
                <View style={styles.formatInfo}>
                  <Text style={styles.formatLabel}>⚽ {validationStrings.TVT_FORMAT}</Text>
                  <Text style={styles.formatDescription}>
                    {validationStrings.TEAM_CREATE}
                    {format2v2 && getTotalRegistered(format2v2) > 0 &&
                      ` ${validationStrings.DIVIDER_DOT} ${format2v2.registeredMaleCount}M / ${format2v2.registeredFemaleCount}F ${validationStrings.REGISTERED_LABEL}`}
                  </Text>
                </View>
              </TouchableOpacity>

              {format2v2Available && (
                <>
                  <View style={styles.formatInputContainer}>
                    <Text style={styles.inputLabel}>{validationStrings.MAX_MALE_PAR}</Text>
                    <TextInput
                      style={styles.formatInput}
                      keyboardType="numeric"
                      value={maxMaleParticipants2v2}
                      onChangeText={setMaxMaleParticipants2v2}
                      placeholder={validationStrings.ENTER_EVEN_NUMBER}
                      placeholderTextColor={Colors.text_lighter}
                    />
                    <Text style={styles.helperText}>
                      {validationStrings.LIMIT_RULES}
                    </Text>
                  </View>
                  <View style={styles.formatInputContainer}>
                    <Text style={styles.inputLabel}>{validationStrings.MAX_FEMALE_PAR}</Text>
                    <TextInput
                      style={styles.formatInput}
                      keyboardType="numeric"
                      value={maxFemaleParticipants2v2}
                      onChangeText={setMaxFemaleParticipants2v2}
                      placeholder={validationStrings.ENTER_EVEN_NUMBER}
                      placeholderTextColor={Colors.text_lighter}
                    />
                    <Text style={styles.helperText}>
                      {validationStrings.LIMIT_RULES}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}

          {!isFoosball && !isChessGame && (
            <View style={styles.formatCard}>
              <TouchableOpacity
                style={styles.formatCheckbox}
                onPress={toggleFormat1v1}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, format1v1Available && styles.checkboxActive]}>
                  {format1v1Available && <Icon name="check" size={18} color={Colors.white} />}
                </View>
                <View style={styles.formatInfo}>
                  <Text style={styles.formatLabel}>{validationStrings.OVO_FORMAT}</Text>
                  <Text style={styles.formatDescription}>
                    {validationStrings.INDIVIDUAL_MATCHS}
                    {format1v1 && getTotalRegistered(format1v1) > 0 &&
                      ` ${validationStrings.DIVIDER_DOT} ${format1v1.registeredMaleCount}M / ${format1v1.registeredFemaleCount}F ${validationStrings.REGISTERED_LABEL}`}
                  </Text>
                </View>
              </TouchableOpacity>

              {format1v1Available && (
                <>
                  <View style={styles.formatInputContainer}>
                    <Text style={styles.inputLabel}>{validationStrings.MAX_MALE_PAR}</Text>
                    <TextInput
                      style={styles.formatInput}
                      keyboardType="numeric"
                      value={maxMaleParticipants1v1}
                      onChangeText={setMaxMaleParticipants1v1}
                      placeholder={validationStrings.ENTER_NUMBER_PLACEHOLDER}
                      placeholderTextColor={Colors.text_lighter}
                    />
                  </View>
                  <View style={styles.formatInputContainer}>
                    <Text style={styles.inputLabel}>{validationStrings.MAX_FEMALE_PAR}</Text>
                    <TextInput
                      style={styles.formatInput}
                      keyboardType="numeric"
                      value={maxFemaleParticipants1v1}
                      onChangeText={setMaxFemaleParticipants1v1}
                      placeholder={validationStrings.ENTER_NUMBER_PLACEHOLDER}
                      placeholderTextColor={Colors.text_lighter}
                    />
                  </View>
                </>
              )}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleUpdate}
          activeOpacity={0.8}
        >
          <Icon name="save" size={24} color={Colors.white} />
          <Text style={styles.createButtonText}>{validationStrings.UPDATE_EVENT}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditEventScreen;