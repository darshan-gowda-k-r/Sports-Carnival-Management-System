import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_color,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  formCard: {
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

  inputGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: Colors.info_background,
      padding: 12,
      borderRadius: 10,
      marginTop: 8,
      gap: 8,
    },
    infoText: {
      flex: 1,
      fontSize: 13,
      color: Colors.info_text,
      lineHeight: 18,
    },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text_dark,
  },
  input: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text_dark,
    borderWidth: 1,
    borderColor: Colors.border_light,
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  helperText: {
    fontSize: 13,
    color: Colors.text_light,
    marginTop: 6,
    fontStyle: 'italic',
  },

  dateText: {
    fontSize: 15,
    color: Colors.text_dark,
  },
  datePlaceholder: {
    fontSize: 15,
    color: Colors.text_lighter,
  },

  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  datePickerButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  datePickerButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: Colors.border_light,
  },
  cancelButtonText: {
    color: Colors.text_dark,
    fontSize: 16,
    fontWeight: '600',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text_dark,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.text_light,
    lineHeight: 20,
  },

  formatCard: {
    backgroundColor: Colors.stats_background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  formatCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border_light,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  formatInfo: {
    flex: 1,
  },
  formatLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text_dark,
    marginBottom: 2,
  },
  formatDescription: {
    fontSize: 13,
    color: Colors.text_light,
  },

  formatInputContainer: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text_dark,
    marginBottom: 6,
  },
  formatInput: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: Colors.text_dark,
    borderWidth: 1,
    borderColor: Colors.border_light,
  },

  createButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});