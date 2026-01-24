import { StyleSheet } from 'react-native';
import Colors from '../constants/colors';

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    backgroundColor: Colors.primary  +'80',
  },
});

export default styles;
