import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../components/customHeader';
import { useSystemConfigViewModel } from '../../viewmodels/systemConfigViewModel';
import styles from './SystemConfigScreenStyle';
import Colors from '../../constants/colors';
import { headerStrings, validationStrings } from '../../constants/validationStrings';

const SystemConfigScreen = () => {
  const {
    config,
    loading,
    updateConfig,
    resetToDefaults,
  } = useSystemConfigViewModel();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={validationStrings.SYSTEM_CONFIGURATION}
        showBackButton={true}
        userRole={validationStrings.ADMIN}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <Icon name={validationStrings.ICON_SETTINGS} size={24} color={Colors.primary} />
          <Text style={styles.sectionTitle}>{validationStrings.SYSTEM_SETTINGS}</Text>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name={validationStrings.ICON_HOW_TO_REG} size={20} color={Colors.text_medium} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{validationStrings.AUTO_APPROVE_REGISTRATIONS}</Text>
                <Text style={styles.settingDescription}>
                  {validationStrings.AUTO_APPROVE_DESCRIPTION}
                </Text>
              </View>
            </View>
            <Switch
              value={config.autoApproveRegistrations}
              onValueChange={(value) => updateConfig('autoApproveRegistrations', value)}
              trackColor={{ false: Colors.border_lighter, true: Colors.primary + '60' }}
              thumbColor={config.autoApproveRegistrations ? Colors.primary : Colors.bg_light}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="notifications" size={20} color={Colors.text_medium} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{validationStrings.EMAIL_NOTIFICATIONS_LABEL}</Text>
                <Text style={styles.settingDescription}>
                  {validationStrings.EMAIL_NOTIFICATIONS_DESCRIPTION}
                </Text>
              </View>
            </View>
            <Switch
              value={config.emailNotifications}
              onValueChange={(value) => updateConfig('emailNotifications', value)}
              trackColor={{ false: Colors.border_lighter, true: Colors.primary + '60' }}
              thumbColor={config.emailNotifications ? Colors.primary : Colors.bg_light}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="block" size={20} color={Colors.text_medium} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{validationStrings.ALLOW_LATE_REGISTRATION}</Text>
                <Text style={styles.settingDescription}>
                  {validationStrings.ALLOW_LATE_DESCRIPTION}
                </Text>
              </View>
            </View>
            <Switch
              value={config.allowLateRegistration}
              onValueChange={(value) => updateConfig('allowLateRegistration', value)}
              trackColor={{ false: Colors.border_lighter, true: Colors.primary + '60' }}
              thumbColor={config.allowLateRegistration ? Colors.primary : Colors.bg_light}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetToDefaults}
          activeOpacity={0.8}
        >
          <Icon name="restore" size={20} color={Colors.error} />
          <Text style={styles.resetButtonText}>{validationStrings.RESET_TO_DEFAULTS}</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Icon name="info" size={20} color={Colors.info_icon} />
          <Text style={styles.infoText}>
            {validationStrings.SETTINGS_INFO}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SystemConfigScreen;