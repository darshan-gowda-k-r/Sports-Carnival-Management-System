import Colors from '../../constants/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: Colors.white
  },
  title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: Colors.primary,
      marginBottom: 24,
      textAlign: 'center'
  },
  input: {
      borderWidth: 1,
      borderColor: Colors.gray,
      padding: 12,
      borderRadius: 8,
      marginBottom: 12
  },
  fieldError: {
      color: Colors.error,
      fontSize: 12,
      marginTop: -6,
      marginBottom: 10
  },
  error: {
      color: Colors.error,
      marginBottom: 12,
      textAlign: 'center'
  },
  registerText: {
      marginTop: 16,
      textAlign: 'center',
      color: Colors.gray
  },
  link: {
      color: Colors.primary,
      fontWeight: 'bold'
  },
});

export default styles;