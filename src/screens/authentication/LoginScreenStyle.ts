import Colors from '../../constants/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Colors.Background_color
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
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    transform: [{ translateX: -30 }, { translateY: -30 }],
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
    fontWeight: 'bold',
    fontSize: 18
  },
});

export default styles;