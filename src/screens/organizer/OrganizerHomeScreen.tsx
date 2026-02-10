import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customHeader';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../constants/colors';
import { validationStrings } from '../../constants/validationStrings';
import { useOrganizerHomeViewModel, type MenuItem } from '../../viewmodels/organizerHomeViewModel';
import styles from './OrganizerScreenStyle';

const OrganizerHomeScreen = () => {
  const viewModel = useOrganizerHomeViewModel();

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuCard}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIconContainer, { backgroundColor: item.color + Colors.action_icon_bg_opacity }]}>
        <Icon name={item.icon} size={28} color={item.color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={24} color={Colors.menu_chevron} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        title={validationStrings.ORGANISER_TITLE}
        showProfile={true}
        showNotifications={true}
        notificationCount={5}
        userRole={validationStrings.ORGANIZER}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeContent}>
            <Text style={styles.welcomeTitle}>
              {validationStrings.HELLO_ORGANIZER.replace('{name}', viewModel.user?.name || 'Organizer')}
            </Text>
            <Text style={styles.welcomeSubtitle}>
              {validationStrings.MAKE_EVENT_AMAZING}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={viewModel.handleLogout}
            activeOpacity={0.7}
          >
            <Icon name="logout" size={20} color={Colors.logout_icon} />
            <Text style={styles.logoutText}>{validationStrings.LOGOUT}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.stats_background }]}>
              <Icon name="event" size={24} color={Colors.info} />
            </View>
            <Text style={styles.statValue}>{viewModel.myEventsCount}</Text>
            <Text style={styles.statLabel}>{validationStrings.MY_EVENTS}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.bg_green_light }]}>
              <Icon name="groups" size={24} color={Colors.success} />
            </View>
            <Text style={styles.statValue}>{viewModel.totalRegistrations}</Text>
            <Text style={styles.statLabel}>{validationStrings.TOTAL_REGISTRATIONS}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createEventButton}
          onPress={viewModel.navigateToCreateEvent}
          activeOpacity={0.8}
        >
          <View style={styles.createEventContent}>
            <View style={styles.createEventIcon}>
              <Icon name="add-circle" size={32} color={Colors.white} />
            </View>
            <View style={styles.createEventText}>
              <Text style={styles.createEventTitle}>{validationStrings.CREATE_NEW_EVENT}</Text>
              <Text style={styles.createEventSubtitle}>
                {validationStrings.START_ORGANIZING}
              </Text>
            </View>
            <Icon name="arrow-forward" size={24} color={Colors.white} />
          </View>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{validationStrings.MANAGEMENT}</Text>
        </View>

        <View style={styles.menuList}>
          {viewModel.menuItems.map(renderMenuItem)}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{validationStrings.RECENT_ACTIVITY}</Text>
        </View>

        <View style={styles.activityCard}>
          {viewModel.activityItems.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityTime}>{activity.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrganizerHomeScreen;