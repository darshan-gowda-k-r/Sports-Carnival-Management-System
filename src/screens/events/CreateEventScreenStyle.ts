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

  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  inputGroup: {
    marginBottom: 20,
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text_medium,
    marginLeft: 8,
  },

  input: {
    borderWidth: 2,
    borderColor: Colors.border_light,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text_dark,
    backgroundColor: Colors.bg_light,
  },

  textArea: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: 'top',
  },

  dateText: {
    fontSize: 15,
    color: Colors.text_dark,
    fontWeight: '500',
  },

  datePlaceholder: {
    fontSize: 15,
    color: Colors.text_lighter,
  },

  datePickerButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },

  datePickerButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },

  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border_light,
  },

  cancelButtonText: {
    color: Colors.gray,
    fontSize: 15,
    fontWeight: '600',
  },

  datePickerButtonText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },

  helperText: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 6,
    lineHeight: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  sectionHeaderText: {
    marginLeft: 8,
    flex: 1,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text_medium,
  },

  sectionSubtitle: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 2,
  },

  formatCard: {
    backgroundColor: Colors.bg_light,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border_light,
    marginTop: 8,
  },

  formatCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border_lighter,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  formatInfo: {
    flex: 1,
  },

  formatLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text_dark,
    marginBottom: 4,
  },

  formatDescription: {
    fontSize: 14,
    color: Colors.gray,
  },

  formatInputContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border_light,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray,
    marginBottom: 8,
  },

  formatInput: {
    borderWidth: 2,
    borderColor: Colors.border_light,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: Colors.text_dark,
    backgroundColor: Colors.white,
  },

  createButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 14,
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  createButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
  },
});