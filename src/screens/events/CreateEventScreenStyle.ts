import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.Background_color,
  },
  title: {
    fontSize: 22,
    textAlign : 'center',
    color : Colors.primary,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: Colors.white,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',  
    color: Colors.black,
    marginBottom: 6,
  },

  inputGroup: {
    marginBottom: 14,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});
