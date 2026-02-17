import Colors from '../../constants/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: Colors.Background_color,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    marginVertical: 10,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    color: Colors.black,
  },
  eyeIcon: {
    padding: 4,
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
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginTop: 12,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  roleSelected: {
    backgroundColor: Colors.primary,
  },
  roleText: {
    color: Colors.gray,
  },
  roleTextSelected: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  error: {
    color: Colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  loginText: {
    marginTop: 16,
    textAlign: 'center',
    color: Colors.gray,
  },
  link: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default styles;