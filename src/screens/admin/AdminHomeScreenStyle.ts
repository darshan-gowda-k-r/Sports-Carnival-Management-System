import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_color,
  },

  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 25,
    textAlign: 'center',
  },

  card: {
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 18,

    shadowColor: 'shadow',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,

    elevation: 5,
  },

  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },

  cardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },
});
