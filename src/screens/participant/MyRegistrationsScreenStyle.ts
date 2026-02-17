import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_color,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_light,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.event_date_badge,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.section_link,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.input_text,
    textAlign: 'center',
  },
  roleBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: Colors.participantAccent || Colors.section_link,
  },
  roleBadgeText: {
    fontSize: 9,
    color: Colors.white,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 80,
  },

  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_light,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.input_text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.text_light,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 15,
    color: Colors.text_light,
    marginTop: 16,
  },

  listHeader: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  listHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text_light,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  registrationCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  statusBannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  cardContent: {
    padding: 16,
  },

  titleSection: {
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.event_title,
    marginBottom: 8,
    lineHeight: 26,
  },
  sportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.event_date_badge,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.info_border,
  },
  sportText: {
    fontSize: 13,
    color: Colors.section_link,
    fontWeight: '600',
  },

  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.text_medium,
    flex: 1,
  },

  teamAssignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.reg_back,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    gap: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.badge_test,
  },
  teamAssignedText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.COLOR_GREEN,
  },

  rejectionBox: {
    backgroundColor: Colors.rejection_box,
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.rej_box_back,
  },
  rejectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  rejectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.rejection_text,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rejectionText: {
    fontSize: 14,
    color: Colors.text_medium,
    lineHeight: 20,
  },

  cardFooter: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 4,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.icon_back,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.cancel_button,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.event_date_badge,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.input_text,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.text_light,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    maxWidth: 280,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.section_link,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    gap: 8,
    shadowColor: Colors.section_link,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});

export default styles;