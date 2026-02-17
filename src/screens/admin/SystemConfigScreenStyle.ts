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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text_dark,
    marginLeft: 12,
  },

  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_light,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text_dark,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: Colors.text_light,
  },
  numberBadge: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  numberBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  changeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },

  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.error,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: Colors.info_background,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.info_border,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: Colors.info_text,
    lineHeight: 20,
  },
});