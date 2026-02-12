import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import { headerStrings, validationStrings } from '../../constants/validationStrings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCreateEventViewModel } from '../../viewmodels/createEventViewModel';
import { allows2v2Format, allowsMixedGender, isChess } from '../../models/event';
import Colors from '../../constants/colors';
import styles from './CreateEventScreenStyle';

const CreateEventScreen = ({ route }: any) => {
  const { role } = route.params;

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
    handleCreate,
  } = useCreateEventViewModel(role);

  const isFoosball = allows2v2Format(sportType);
  const isMixedGender = allowsMixedGender(sportType);
  const isChessGame = isChess(sportType);

  const getMinMatchDate = () => {
    if (!registrationDeadline) return new Date();
    const minDate = new Date(registrationDeadline);
    minDate.setDate(minDate.getDate() + 2);
    return minDate;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={headerStrings.CREATE_EVENT}
        showBackButton={true}
        userRole={role}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
              style={styles.input}
              value={sportType}
              onChangeText={setSportType}
              placeholder={validationStrings.SPORT_PLACEHOLDER}
              placeholderTextColor={Colors.text_lighter}
            />
            {sportType && isMixedGender && (
              <View style={styles.infoBox}>
                <Icon name="info" size={16} color={Colors.info} />
                <Text style={styles.infoText}>
                  ♟️ {validationStrings.CHESS_MIXED_INFO}
                </Text>
              </View>
            )}
            {sportType && isFoosball && (
              <View style={styles.infoBox}>
                <Icon name="info" size={16} color={Colors.warning} />
                <Text style={styles.infoText}>
                  ⚽ {validationStrings.FOOSBALL_2V2_INFO}
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
              <Icon name="event" size={20} color={Colors.gray} />
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
                  ? validationStrings.PARTICIPANTS_PER_GENDER_ADMIN
                  : validationStrings.PARTICIPANTS_PER_GENDER
                }
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
                  <Text style={styles.formatDescription}>{validationStrings.INDIVIDUAL_MIXED}</Text>
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
                    {validationStrings.CHESS_AUTO_MATCH}
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
                  <Text style={styles.formatDescription}>{validationStrings.TEAM_CREATE}</Text>
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
                  <Text style={styles.formatDescription}>{validationStrings.INDIVIDUAL_MATCHS}</Text>
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
          onPress={handleCreate}
          activeOpacity={0.8}
        >
          <Icon name="add-circle" size={24} color={Colors.white} />
          <Text style={styles.createButtonText}>{validationStrings.CREATE_EVENT}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateEventScreen;