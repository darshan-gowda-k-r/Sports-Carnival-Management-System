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

  welcomeBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  bannerContent: {
    flex: 1,
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    lineHeight: 20,
  },
  bannerIcon: {
    opacity: 0.3,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.black,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.gray,
    fontWeight: '500',
    textAlign: 'center',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 11,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 16,
  },

  eventsList: {
    gap: 12,
    marginBottom: 24,
  },
  eventCard: {
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
  eventDateBadge: {
    backgroundColor: Colors.bg_blue_light,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 16,
    minWidth: 60,
    alignItems: 'center',
  },
  eventDateText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.COLOR_BLUE,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 6,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventMetaText: {
    fontSize: 12,
    color: Colors.text_light,
  },
  eventDivider: {
    fontSize: 12,
    color: Colors.border_lighter,
    marginHorizontal: 4,
  },

  featuredBanner: {
    backgroundColor: Colors.success,
    borderRadius: 16,
    padding: 24,
    shadowColor: Colors.success,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  featuredContent: {
    alignItems: 'flex-start',
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 8,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 20,
  },
  featuredButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg_alpha_white_20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  featuredButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
});