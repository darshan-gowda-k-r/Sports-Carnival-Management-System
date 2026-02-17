import React from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import { useRegisterForEventViewModel, type FormatInfo } from '../../viewmodels/registerForEventViewModel';
import { Event } from '../../models/event';
import Colors from '../../constants/colors';
import { headerStrings, validationStrings } from '../../constants/validationStrings';
import styles from './RegisterForEventScreenStyle';

const RegisterForEventScreen = () => {
  const route = useRoute<any>();
  const { event }: { event: Event } = route.params;
  const viewModel = useRegisterForEventViewModel(event);

  const renderFormatOption = (formatInfo: FormatInfo) => {
    const isSelected = viewModel.isFormatSelected(formatInfo.format);

    return (
      <TouchableOpacity
        key={formatInfo.format}
        style={[
          styles.formatOption,
          isSelected && styles.formatOptionSelected,
          formatInfo.isFull && styles.formatOptionDisabled,
        ]}
        onPress={() => !formatInfo.isFull && viewModel.setSelectedFormat(formatInfo.format)}
        disabled={formatInfo.isFull}
      >
        <View style={styles.formatHeader}>
          <View style={styles.formatTitleSection}>
            <View style={[
              styles.radioButton,
              isSelected && styles.radioButtonSelected,
              formatInfo.isFull && styles.radioButtonDisabled,
            ]}>
              {isSelected && <View style={styles.radioButtonInner} />}
            </View>
            <View>
              <Text style={[
                styles.formatTitle,
                formatInfo.isFull && styles.formatTitleDisabled,
              ]}>
                {formatInfo.format}
              </Text>
              <Text style={styles.formatDescription}>
                {viewModel.getFormatDescription(formatInfo.format)}
              </Text>
            </View>
          </View>
          {formatInfo.isFull ? (
            <View style={styles.fullBadge}>
              <Text style={styles.fullBadgeText}>{validationStrings.FULL}</Text>
            </View>
          ) : (
            <View style={styles.spotsBadge}>
              <Text style={styles.spotsText}>{formatInfo.spotsLeft}{validationStrings.SPOTS_LEFT}</Text>
            </View>
          )}
        </View>

        <View style={styles.formatStats}>
          <Text style={styles.formatStatsText}>
            {formatInfo.registeredTeams} / {formatInfo.maxTeams} {validationStrings.TEAMS_REGISTERED}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title="Register for Event"
        showBackButton={true}
        userRole="PARTICIPANT"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>{viewModel.event.title}</Text>
          <Text style={styles.eventSport}>{viewModel.event.sportType}</Text>
          <View style={styles.eventMeta}>
            <Icon name="event" size={16} color={Colors.stats_label} />
            <Text style={styles.eventMetaText}>{viewModel.event.date}</Text>
            <Text style={styles.divider}>•</Text>
            <Icon name="location-on" size={16} color={Colors.stats_label} />
            <Text style={styles.eventMetaText}>{viewModel.event.location}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="sports" size={24} color={Colors.stats_value} />
            <Text style={styles.sectionTitle}>{validationStrings.SELECT_FORMAT_TITLE}</Text>
          </View>

          {viewModel.availableFormats.map(renderFormatOption)}
        </View>

        {viewModel.shouldShowTeammateForm() && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Icon name="person-add" size={24} color={Colors.stats_value} />
              <Text style={styles.sectionTitle}>{validationStrings.TEAMMATE_INFORMATION}</Text>
            </View>

            <Text style={styles.inputLabel}>{validationStrings.TEAMMATE_NAME_LABEL}</Text>
            <TextInput
              style={styles.input}
              value={viewModel.teammateName}
              onChangeText={viewModel.setTeammateName}
              placeholder={validationStrings.ENTER_TEAMMATE_NAME_PLACEHOLDER}
              placeholderTextColor={Colors.button_disabled}
            />

            <Text style={styles.inputLabel}>{validationStrings.TEAMMATE_EMAIL_LABEL}</Text>
            <TextInput
              style={styles.input}
              value={viewModel.teammateEmail}
              onChangeText={viewModel.setTeammateEmail}
              placeholder={validationStrings.ENTER_TEAMMATE_EMAIL_PLACEHOLDER}
              placeholderTextColor={Colors.button_disabled}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.infoBox}>
              <Icon name="info" size={20} color={Colors.COLOR_BLUE} />
              <Text style={styles.infoText}>
                {validationStrings.TEAMMATE_MUST_BE_REGISTERED}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.infoCard}>
          <Icon name="schedule" size={20} color={Colors.COLOR_ORANGE} />
          <Text style={styles.infoCardText}>
            {validationStrings.REGISTRATION_REVIEW_INFO}
          </Text>
        </View>

        {viewModel.user?.gender && (
          <View style={styles.userInfoCard}>
            <Text style={styles.userInfoLabel}>{validationStrings.YOUR_GENDER}</Text>
            <View style={styles.genderBadge}>
              <Text style={styles.genderText}>{viewModel.user.gender}</Text>
            </View>
          </View>
        )}

        {viewModel.loading ? (
          <View style={styles.loadingButton}>
            <ActivityIndicator size="small" color={Colors.white} />
            <Text style={styles.loadingButtonText}>{validationStrings.SUBMITTING}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.registerButton,
              !viewModel.canSubmit() && styles.registerButtonDisabled
            ]}
            onPress={viewModel.handleRegister}
            disabled={!viewModel.canSubmit()}
          >
            <Icon name="how-to-reg" size={24} color={Colors.white} />
            <Text style={styles.registerButtonText}>{validationStrings.SUBMIT_REGISTRATION}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterForEventScreen;