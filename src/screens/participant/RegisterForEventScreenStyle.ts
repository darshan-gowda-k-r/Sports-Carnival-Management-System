import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_color,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },

  eventCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 4,
  },
  eventSport: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 12,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  eventMetaText: {
    fontSize: 13,
    color: Colors.text_light,
  },
  divider: {
    fontSize: 13,
    color: Colors.border_lighter,
  },

  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_light,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text_dark,
  },

  formatOption: {
    backgroundColor: Colors.bg_light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.border_light,
  },
  formatOptionSelected: {
    backgroundColor: Colors.bg_blue_light,
    borderColor: Colors.primary,
  },
  formatOptionDisabled: {
    opacity: 0.5,
  },
  formatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  formatTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border_lighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonDisabled: {
    borderColor: Colors.border_light,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  formatTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: 2,
  },
  formatTitleDisabled: {
    color: Colors.text_lighter,
  },
  formatDescription: {
    fontSize: 12,
    color: Colors.text_light,
  },
  fullBadge: {
    backgroundColor: Colors.bg_red,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  fullBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  spotsBadge: {
    backgroundColor: Colors.bg_green_light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  spotsText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  formatStats: {
    marginTop: 4,
  },
  formatStatsText: {
    fontSize: 12,
    color: Colors.text_light,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text_medium,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border_light,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text_dark,
    backgroundColor: Colors.bg_light,
    marginBottom: 12,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.INFOBOX_BACK,
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: Colors.COLOR_BLUE,
    lineHeight: 18,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.INFO_CARD_BACK,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoCardText: {
    flex: 1,
    fontSize: 13,
    color: Colors.INFO_CARD,
    lineHeight: 18,
  },

  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  userInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.USER_INFO,
    marginRight: 8,
  },
  genderBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  genderText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },

  registerButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.primary + '60',
  },
  registerButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  loadingButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  loadingButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});