import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { headerStrings, validationStrings } from '../../constants/validationStrings';
import { useAdminHomeViewModel, EventFormatOption } from '../../viewmodels/adminHomeViewModel';
import styles from './AdminHomeScreenStyle';
import Colors from '../../constants/colors';

const AdminHomeScreen = () => {
  const {
    totalEvents,
    totalRegistrations,
    totalUsers,
    showCreateTeamsModal,
    eventFormatOptions,
    menuItems,
    handleLogout,
    handleSelectEventFormat,
    handleCloseModal,
  } = useAdminHomeViewModel();

  const renderEventFormatOption = ({ item }: { item: EventFormatOption }) => (
    <TouchableOpacity
      style={styles.eventFormatOption}
      onPress={() => handleSelectEventFormat(item)}
      activeOpacity={0.7}
    >
      <View style={styles.eventFormatLeft}>
        <View style={styles.eventFormatIcon}>
          <Icon name={validationStrings.ICON_EVENT} size={24} color={Colors.COLOR_BLUE} />
        </View>
        <View style={styles.eventFormatInfo}>
          <Text style={styles.eventFormatTitle}>{item.eventTitle}</Text>
          <Text style={styles.eventFormatSubtitle}>{item.format} {validationStrings.FORMAT}</Text>
        </View>
      </View>
      <Icon name={validationStrings.ICON_CHEVRON_RIGHT} size={24} color={Colors.button_disabled} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={validationStrings.ADMIN_TITLE}
        showLogout={true}
        onLogoutPress={handleLogout}
        userRole={validationStrings.ADMIN}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>{validationStrings.ADMIN_MSG}</Text>
            <Text style={styles.welcomeSubtitle}>
              {validationStrings.ADMIN_NOTE}
            </Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.stats_background }]}>
              <Icon name={validationStrings.ICON_EVENT} size={24} color={Colors.button_primary}/>
            </View>
            <Text style={styles.statValue}>{totalEvents}</Text>
            <Text style={styles.statLabel}>{validationStrings.TOTAL_EVENTS}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.bg_green_light }]}>
              <Icon name={validationStrings.ICON_PEOPLE} size={24} color={Colors.status_approved} />
            </View>
            <Text style={styles.statValue}>{totalUsers}</Text>
            <Text style={styles.statLabel}>{validationStrings.TOTAL_USERS}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.winner_back }]}>
              <Icon name={validationStrings.ICON_GROUPS} size={24} color={Colors.winner_icon} />
            </View>
            <Text style={styles.statValue}>{totalRegistrations}</Text>
            <Text style={styles.statLabel}>{validationStrings.TOTAL_REG}</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{validationStrings.QUICK_ACTIONS}</Text>
        </View>

        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.color + validationStrings.OPACITY_20 }]}>
                <Icon name={item.icon} size={28} color={item.color} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuText}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.menuSubtext}>{item.subtitle}</Text>
                )}
              </View>
              <Icon name={validationStrings.ICON_CHEVRON_RIGHT} size={20} color={Colors.text_lighter} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showCreateTeamsModal}
        transparent
        animationType={validationStrings.ANIMATION_SLIDE}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{validationStrings.SELECT_EVENT}</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon name={validationStrings.ICON_CLOSE} size={24} color={Colors.text_light} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {validationStrings.CHOOSE_EVENTS_FORMAT}
            </Text>

            <FlatList
              data={eventFormatOptions}
              renderItem={renderEventFormatOption}
              keyExtractor={(item, index) => `${item.eventId}_${item.format}_${index}`}
              style={styles.eventFormatList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Icon name={validationStrings.ICON_EVENT_BUSY} size={60} color={Colors.border_lighter} />
                  <Text style={styles.emptyText}>{validationStrings.NO_EVENTS_AVAILABLE}</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminHomeScreen;