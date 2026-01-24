import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_color,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign : 'center',
    color: Colors.primary,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
});
