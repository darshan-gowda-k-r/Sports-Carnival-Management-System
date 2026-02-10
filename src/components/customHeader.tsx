import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './customHeaderStyle';
import { validationStrings, headerStrings } from '../constants/validationStrings';

interface CustomHeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenu?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  showAddButton?: boolean;
  showSearch?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showShare?: boolean;
  showSettings?: boolean;
  showFilter?: boolean;
  userRole?: validationStrings.ADMIN | validationStrings.ORGANIZER | validationStrings.PARTICIPANT ;
  notificationCount?: number;
  onMenuPress?: () => void;
  onAddPress?: () => void;
  onSearchPress?: () => void;
  onEditPress?: () => void;
  onDeletePress?: () => void;
  onSharePress?: () => void;
  onSettingsPress?: () => void;
  onFilterPress?: () => void;
  customRightElement?: React.ReactNode;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  showBackButton = false,
  showMenu = false,
  showNotifications = false,
  showProfile = false,
  showAddButton = false,
  showSearch = false,
  showEdit = false,
  showDelete = false,
  showShare = false,
  showSettings = false,
  showFilter = false,
  userRole,
  notificationCount = 0,
  onMenuPress,
  onAddPress,
  onSearchPress,
  onEditPress,
  onDeletePress,
  onSharePress,
  onSettingsPress,
  onFilterPress,
  customRightElement,
}) => {
  const navigation = useNavigation<any>();

  const getRoleBadgeStyle = () => {
    switch (userRole) {
      case validationStrings.ADMIN:
        return styles.adminBadge;
      case validationStrings.ORGANIZER:
        return styles.organizerBadge;
      case validationStrings.PARTICIPANT:
        return styles.playerBadge;
      default:
        return styles.defaultBadge;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} style={styles.backIcon} />
            <Text style={styles.backText}>{headerStrings.BACK}</Text>
          </TouchableOpacity>
        )}
        {showMenu && (
          <TouchableOpacity
            onPress={onMenuPress}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="menu" size={24} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        {userRole && (
          <View style={[styles.roleBadge, getRoleBadgeStyle()]}>
            <Text style={styles.roleBadgeText}>{userRole}</Text>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        {showSearch && (
          <TouchableOpacity
            onPress={onSearchPress}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="search" size={24} style={styles.icon} />
          </TouchableOpacity>
        )}

        {showFilter && (
          <TouchableOpacity
            onPress={onFilterPress}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="filter-list" size={24} style={styles.icon} />
          </TouchableOpacity>
        )}

        {showAddButton && (
          <TouchableOpacity
            onPress={onAddPress}
            style={styles.addButton}
            activeOpacity={0.7}
          >
            <Icon name="add" size={20} style={styles.addButtonIcon} />
            <Text style={styles.addButtonText}>{validationStrings.CREATE}</Text>
          </TouchableOpacity>
        )}

        {showEdit && (
          <TouchableOpacity
            onPress={onEditPress}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="edit" size={24} style={styles.icon} />
          </TouchableOpacity>
        )}

        {showShare && (
          <TouchableOpacity
            onPress={onSharePress}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="share" size={24} style={styles.icon} />
          </TouchableOpacity>
        )}

        {showDelete && (
          <TouchableOpacity
            onPress={onDeletePress}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="delete" size={24} style={styles.deleteIcon} />
          </TouchableOpacity>
        )}

        {showSettings && (
          <TouchableOpacity
            onPress={onSettingsPress}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="settings" size={24} style={styles.icon} />
          </TouchableOpacity>
        )}

        {showNotifications && (
          <TouchableOpacity
            onPress={() => navigation.navigate(headerStrings.NOTIFICATIONS)}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Icon name="notifications-none" size={24} style={styles.icon} />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {showProfile && (
          <TouchableOpacity
            onPress={() => navigation.navigate(headerStrings.PROFILE)}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              <Icon name="account-circle" size={32} style={styles.icon} />
            </View>
          </TouchableOpacity>
        )}

        {customRightElement && customRightElement}
      </View>
    </View>
  );
};

export default CustomHeader;