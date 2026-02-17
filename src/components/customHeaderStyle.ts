import { StyleSheet } from 'react-native';
import Colors from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray + '30',
    elevation: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerSection: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.background,
  },
  backIcon: {
    color: Colors.primary,
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  addButtonIcon: {
    color: Colors.white,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },

  iconButton: {
    padding: 8,
    position: 'relative',
    borderRadius: 20,
  },
  icon: {
    color: Colors.primary,
  },
  deleteIcon: {
    color: Colors.error,
  },
  logoutIcon: {
    color: Colors.error,
  },

  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    flexShrink: 1,
  },
  roleBadge: {
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  adminBadge: {
    backgroundColor: Colors.error,
  },
  organizerBadge: {
    backgroundColor: Colors.primary,
  },
  playerBadge: {
    backgroundColor: Colors.participantAccent,
  },
  defaultBadge: {
    backgroundColor: Colors.gray,
  },
  roleBadgeText: {
    fontSize: 9,
    color: Colors.white,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
});

export default styles;