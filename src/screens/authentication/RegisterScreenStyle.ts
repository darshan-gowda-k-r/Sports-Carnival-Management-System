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
      marginBottom: 20,
      textAlign: 'center'
  },
  input: {
      borderWidth: 1,
      borderColor: Colors.gray,
      padding: 12,
      borderRadius: 8,
      marginVertical: 10
  },
  fieldError: {
      color: Colors.error,
      fontSize: 12,
      marginTop: -6,
      marginBottom: 10
  },
  roleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16
  },
  roleButton: {
      flex: 1,
      padding: 10,
      borderWidth: 1,
      borderColor: Colors.gray,
      borderRadius: 8,
      marginHorizontal: 4,
      alignItems: 'center'
  },
  roleSelected: {
      backgroundColor: Colors.primary
  },
  roleText: {
      color: Colors.gray
  },
  roleTextSelected: {
      color: Colors.white,
      fontWeight: 'bold'
  },
  error: {
      color: Colors.error,
      marginBottom: 12,
      textAlign: 'center'
  },
  loginText: {
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