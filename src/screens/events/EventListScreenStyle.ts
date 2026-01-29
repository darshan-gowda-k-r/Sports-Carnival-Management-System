import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_color,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 15,
    textAlign : 'center'
  },
  card: {
    backgroundColor: Colors.white,
    padding: 18,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
  },
  eventType: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 4,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  createButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  adminActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    marginLeft: 15,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});
