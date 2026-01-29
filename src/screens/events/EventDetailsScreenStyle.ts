import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_color,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign : 'center',
    color: Colors.primary,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.value,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 4,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  editButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  assignButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  assignButtonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  adminActions: {
    marginTop: 20,
  },
});
