import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  screenTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 25,
    textAlign: 'center',
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 6,
  },

  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Colors.black,
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },

  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
});
