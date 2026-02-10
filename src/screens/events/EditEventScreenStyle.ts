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
    shadowOpacity: 0.05,
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
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text_medium,
    marginLeft: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.border_light,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text_dark,
    backgroundColor: Colors.bg_light,
  },

  textArea: {
    height: 100,
    paddingTop: 14,
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
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_light,
  },

  sectionHeaderText: {
    flex: 1,
    marginLeft: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text_dark,
    marginBottom: 4,
  },

  sectionSubtitle: {
    fontSize: 13,
    color: Colors.gray,
    lineHeight: 18,
  },

  formatCard: {
    backgroundColor: Colors.bg_light,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border_light,
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
  },

  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  formatInfo: {
    flex: 1,
    marginLeft: 12,
  },

  formatLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text_dark,
    marginBottom: 2,
  },

  formatDescription: {
    fontSize: 13,
    color: Colors.gray,
  },

  formatInputContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border_light,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.gray,
    marginBottom: 8,
  },

  formatInput: {
    borderWidth: 1,
    borderColor: Colors.border_light,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: Colors.text_dark,
    backgroundColor: Colors.white,
  },

  createButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  createButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});