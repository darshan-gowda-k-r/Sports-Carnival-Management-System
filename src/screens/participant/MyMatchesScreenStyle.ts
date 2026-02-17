import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background_color,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_bottom,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statBorder: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.border_bottom,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.stats_value,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.stats_label,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.stats_label,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.stats_value,
    marginBottom: 12,
  },
  matchCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    textTransform: 'uppercase',
  },
  matchNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.stats_label,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.bg_light,
    borderRadius: 8,
  },
  myTeamBox: {
    backgroundColor: Colors.bg_blue,
    borderWidth: 2,
    borderColor: Colors.status_scheduled,
  },
  teamName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.stats_value,
    marginTop: 8,
    textAlign: 'center',
  },
  myTeamName: {
    color: Colors.status_scheduled,
  },
  score: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.stats_value,
    marginTop: 4,
  },
  vsContainer: {
    paddingHorizontal: 16,
  },
  vsText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.stats_label,
  },
  winnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.badge_captain,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  winnerText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.badge_captain_text,
  },
  matchDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.stats_border,
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: Colors.stats_label,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.stats_value,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.stats_label,
    textAlign: 'center',
  },
});

export default styles;