import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_color,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text_light,
    marginTop: 16,
  },
  eventInfoCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_light,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text_dark,
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventMetaText: {
    fontSize: 14,
    color: Colors.text_light,
  },
  eventDivider: {
    fontSize: 14,
    color: Colors.border_lighter,
  },

  fixturesExistBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bg_green_light,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.success,
  },
  fixturesExistText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
    flex: 1,
  },

  genderTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_light,
    gap: 8,
  },
  genderTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.bg_light,
  },
  genderTabActive: {
    backgroundColor: Colors.primary,
  },
  genderTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text_light,
  },
  genderTabTextActive: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text_dark,
    marginBottom: 16,
  },
  tournamentTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tournamentTypeCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border_light,
    alignItems: 'center',
  },
  tournamentTypeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.info_background,
  },
  tournamentTypeHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tournamentTypeRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border_light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tournamentTypeRadioSelected: {
    borderColor: Colors.primary,
  },
  tournamentTypeRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  tournamentTypeName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text_dark,
    marginBottom: 8,
  },
  tournamentTypeNameSelected: {
    color: Colors.primary,
  },
  tournamentTypeDescription: {
    fontSize: 13,
    color: Colors.text_light,
    textAlign: 'center',
  },
  teamsSection: {
    marginTop: 8,
  },
  teamsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text_dark,
    marginBottom: 12,
  },
  teamItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  teamNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.stats_background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  teamNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  teamDetails: {
    flex: 1,
  },
  teamName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text_dark,
    marginBottom: 4,
  },
  teamMembers: {
    fontSize: 12,
    color: Colors.text_light,
  },
  teamTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  teamTypeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border_light,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  createButtonDisabled: {
    backgroundColor: Colors.text_lighter,
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});