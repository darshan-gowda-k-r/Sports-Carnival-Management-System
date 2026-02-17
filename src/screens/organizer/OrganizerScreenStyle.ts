import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_color,
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 40,
  },

  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeContent: {
    flex: 1,
    marginRight: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '400',
  },

  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
  },

  createEventButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  createEventContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createEventIcon: {
    marginRight: 16,
  },
  createEventText: {
    flex: 1,
  },
  createEventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  createEventSubtitle: {
    fontSize: 13,
    color: Colors.white,
    opacity: 0.9,
  },

  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
  },

  menuList: {
    gap: 12,
    marginBottom: 24,
  },
  menuCard: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  menuIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  menuContent: {
    flex: 1,
    minWidth: 0,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: Colors.gray,
  },

  activityCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 14,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginRight: 12,
    flexShrink: 0,
  },
  activityContent: {
    flex: 1,
    minWidth: 0,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.gray,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.black,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.gray,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  eventFormatList: {
    paddingHorizontal: 20,
  },
  eventFormatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border_light,
  },
  eventFormatLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventFormatIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.stats_background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventFormatInfo: {
    flex: 1,
  },
  eventFormatTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
  },
  eventFormatSubtitle: {
    fontSize: 13,
    color: Colors.gray,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 16,
    textAlign: 'center',
  },
});