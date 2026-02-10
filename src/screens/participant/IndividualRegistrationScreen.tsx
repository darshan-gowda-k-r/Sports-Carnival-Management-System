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
import { headerStrings, validationStrings } from '../../constants/validationStrings';

const IndividualRegistrationScreen = () => {
  const {
    event,
    user,
    selectedFormat,
    loading,
    availableFormats,

    handleFormatSelect,
    handleRegister,

    getSpotsLeft,
    isFormatFull,
    getFormatDescription,
  } = useIndividualRegistrationViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title="Register for Event"
        showBackButton={true}
        userRole="PLAYER"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventSport}>{event.sportType}</Text>
          <View style={styles.eventMeta}>
            <Icon name="event" size={16} color={Colors.menu_subtitle}/>
            <Text style={styles.eventMetaText}>{event.date}</Text>
            <Text style={styles.divider}>•</Text>
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

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="sports" size={24} color={Colors.input_text} />
            <Text style={styles.sectionTitle}>{validationStrings.SELECT_FORMAT_TITLE}</Text>
          </View>

          {availableFormats.map((format) => {
            const spotsLeft = getSpotsLeft(format.maxTeams, format.registeredTeams);
            const isFull = isFormatFull(format.maxTeams, format.registeredTeams);
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
                    <View>
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
                      <Text style={styles.fullBadgeText}>{validationStrings.FULL}</Text>
                    </View>
                  ) : (
                    <View style={styles.spotsBadge}>
                      <Text style={styles.spotsText}>{spotsLeft} {validationStrings.SPOTS   }</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {user?.gender && (
          <View style={styles.userInfoCard}>
            <Icon name="person" size={20} color={Colors.menu_subtitle} />
            <View style={styles.userInfoContent}>
              <Text style={styles.userInfoLabel}>{validationStrings.YOUR_GENDER} </Text>
              <View style={styles.genderBadge}>
                <Text style={styles.genderText}>{user.gender}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.processCard}>
          <Text style={styles.processTitle}>{validationStrings.WHAT_HAPPENS_NEXT}</Text>
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>1</Text>
            </View>
            <Text style={styles.processText}>{validationStrings.STEP_1}</Text>
          </View>
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>2</Text>
            </View>
            <Text style={styles.processText}>{validationStrings.STEP_2}</Text>
          </View>
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>3</Text>
            </View>
            <Text style={styles.processText}>{validationStrings.STEP_3}</Text>
          </View>
          <View style={styles.processStep}>
            <View style={styles.processNumber}>
              <Text style={styles.processNumberText}>4</Text>
            </View>
            <Text style={styles.processText}>{validationStrings.STEP_4}</Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingButton}>
            <ActivityIndicator size="small" color={Colors.white} />
            <Text style={styles.loadingButtonText}>{validationStrings.SUBMITTING}</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.registerButton, !selectedFormat && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={!selectedFormat}
          >
            <Icon name="how-to-reg" size={24} color={Colors.white} />
            <Text style={styles.registerButtonText}>{validationStrings.SUBMIT_REGISTRATION}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default IndividualRegistrationScreen;