import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_color,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  eventImage: {
    width: '100%',
    height: 280,
  },

  headerCard: {
    backgroundColor: Colors.white,
    padding: 24,
    marginBottom: 2,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  title: {
    flex: 1,
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text_dark,
    marginRight: 16,
    lineHeight: 34,
  },

  sportType: {
    fontSize: 17,
    color: Colors.gray,
    fontWeight: '600',
    marginTop: 4,
  },

  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },

  statusText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  infoCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  infoRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },

  infoContent: {
    flex: 1,
    marginLeft: 16,
  },

  infoLabel: {
    fontSize: 12,
    color: Colors.text_lighter,
    marginBottom: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  infoValue: {
    fontSize: 16,
    color: Colors.text_dark,
    fontWeight: '600',
    lineHeight: 24,
  },

  deadlinePassed: {
    fontSize: 13,
    color: Colors.error,
    fontWeight: '700',
    marginTop: 8,
    backgroundColor: Colors.bg_red_light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  deadlineOpen: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '700',
    marginTop: 8,
    backgroundColor: Colors.bg_green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  formatsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  formatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: Colors.border_light,
  },

  formatsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text_dark,
    marginLeft: 12,
  },

  formatItem: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.border_light,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  formatHeader: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },

  formatName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text_dark,
    marginBottom: 8,
  },

  formatTeamSize: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
    lineHeight: 20,
  },

  participantStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },

  genderStatContainer: {
    flex: 1,
    backgroundColor: Colors.bg_light,
    padding: 16,
    borderRadius: 12,
  },

  genderLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.gray,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 10,
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text_dark,
  },

  statLabel: {
    fontSize: 13,
    color: Colors.gray,
    fontWeight: '500',
  },

  genderStatDivider: {
    width: 2,
    backgroundColor: Colors.border_lighter,
    marginHorizontal: 4,
  },

  progressBar: {
    height: 12,
    backgroundColor: Colors.border_light,
    borderRadius: 6,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 6,
  },

  totalStats: {
    marginTop: 4,
    padding: 16,
    backgroundColor: Colors.bg_light,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border_light,
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text_dark,
  },

  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
  },

  loadingText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '600',
  },

  statusCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },

  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },

  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text_dark,
    marginLeft: 12,
    flex: 1,
  },

  statusMessage: {
    fontSize: 15,
    color: Colors.gray,
    lineHeight: 24,
    marginBottom: 20,
  },

  viewTeamsButton: {
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  viewTeamsButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  viewRegistrationsButton: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.info,
    gap: 10,
  },

  viewRegistrationsButtonText: {
    color: Colors.info,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  registerButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    gap: 10,
  },

  registerButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  createFixturesButton: {
    backgroundColor: Colors.COLOR_PURPLE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 10,
    shadowColor: Colors.COLOR_PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  createFixturesButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});