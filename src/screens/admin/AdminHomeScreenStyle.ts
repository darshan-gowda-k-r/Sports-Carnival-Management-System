import Colors from '../../constants/colors';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  subtitle: {
    marginTop: 10,
    color: Colors.gray,
  },
});

export default styles;