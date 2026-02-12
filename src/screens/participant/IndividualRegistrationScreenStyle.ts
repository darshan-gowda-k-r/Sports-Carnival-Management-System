import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

const styles = StyleSheet.create({
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
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.input_text,
    marginBottom: 8,
  },
  eventSport: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.section_link,
    marginBottom: 12,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  eventMetaText: {
    fontSize: 14,
    color: Colors.menu_subtitle,
    marginLeft: 4,
  },
  divider: {
    fontSize: 14,
    color: Colors.empty_icon,
    marginHorizontal: 8,
  },

  infoCard: {
    backgroundColor: Colors.event_date_badge,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.info_border,
  },
  infoCardText: {
    flex: 1,
    fontSize: 14,
    color: Colors.info_text,
    marginLeft: 12,
    lineHeight: 20,
  },

  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.event_title,
    marginLeft: 12,
  },

  formatInfoCard: {
    backgroundColor: Colors.format_selected_background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.format_selected_border,
  },
  formatInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  formatInfoContent: {
    flex: 1,
    marginLeft: 12,
  },
  formatInfoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.format_title,
    marginBottom: 4,
  },
  formatInfoDesc: {
    fontSize: 14,
    color: Colors.format_description,
    lineHeight: 20,
  },
  availabilityCard: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.format_border,
  },
  availabilityText: {
    flex: 1,
    fontSize: 15,
    color: Colors.input_text,
    fontWeight: '600',
    marginLeft: 10,
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  availabilityBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },

  formatOption: {
    borderWidth: 2,
    borderColor: Colors.format_border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  formatOptionSelected: {
    borderColor: Colors.format_selected_border,
    backgroundColor: Colors.format_selected_background,
  },
  formatOptionDisabled: {
    borderColor: Colors.format_disabled_border,
    backgroundColor: Colors.format_disabled_background,
    opacity: 0.6,
  },
  formatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formatTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  formatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.format_title,
    marginBottom: 4,
  },
  formatTitleDisabled: {
    color: Colors.format_title_disabled,
  },
  formatDescription: {
    fontSize: 14,
    color: Colors.format_description,
  },

  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.radio_border,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  radioButtonSelected: {
    borderColor: Colors.radio_selected_border,
    backgroundColor: Colors.radio_selected_background,
  },
  radioButtonDisabled: {
    borderColor: Colors.radio_disabled_border,
    backgroundColor: Colors.radio_disabled_background,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.white,
  },

  fullBadge: {
    backgroundColor: Colors.rejection_background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  fullBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.rejection_text,
  },
  spotsBadge: {
    backgroundColor: Colors.badge_spots,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  spotsText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.badge_spots_text,
  },

  genderStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.format_border,
  },
  genderStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  genderStatText: {
    fontSize: 13,
    color: Colors.format_description,
    fontWeight: '500',
  },
  totalStatsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.format_border,
  },
  totalStatsText: {
    fontSize: 13,
    color: Colors.format_description,
    fontWeight: '500',
    textAlign: 'center',
  },

  userInfoCard: {
    backgroundColor: Colors.match_team_background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.match_header_border,
  },
  userInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  userInfoLabel: {
    fontSize: 14,
    color: Colors.match_team_icon,
    fontWeight: '500',
  },
  genderBadge: {
    backgroundColor: Colors.badge_gender,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.badge_gender_text,
    textTransform: 'capitalize',
  },

  processCard: {
    backgroundColor: Colors.process_background,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.process_border,
  },
  processTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.process_title,
    marginBottom: 16,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  processNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.process_number_bg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  processNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  processText: {
    fontSize: 14,
    color: Colors.process_text,
    flex: 1,
    lineHeight: 20,
  },

  registerButton: {
    backgroundColor: Colors.info_icon,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.info_icon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonDisabled: {
    backgroundColor: Colors.format_title_disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginLeft: 8,
  },

  loadingButton: {
    backgroundColor: Colors.format_selected_border,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  loadingButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginLeft: 12,
  },
});

export default styles;