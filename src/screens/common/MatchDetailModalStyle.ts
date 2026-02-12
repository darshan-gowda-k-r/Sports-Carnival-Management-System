import { StyleSheet } from 'react-native';
import Colors from '../../constants/colors';

export default StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border_light,
    backgroundColor: Colors.white,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text_dark,
  },
  closeButton: {
    padding: 4,
  },

  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.bg_light,
  },
  matchNumberBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  matchNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    textTransform: 'uppercase',
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },

  teamsSection: {
    padding: 16,
  },
  teamsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  teamIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.bg_blue_light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text_dark,
    textAlign: 'center',
  },
  scoreDisplay: {
    backgroundColor: Colors.bg_light,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 4,
    minWidth: 50,
  },
  winnerScoreDisplay: {
    backgroundColor: Colors.primary,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text_dark,
    textAlign: 'center',
  },
  winnerScoreText: {
    color: Colors.white,
  },

  vsSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  vsText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text_lighter,
  },

  winnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.winner_background,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    gap: 8,
  },
  winnerText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.winner_text,
  },

  infoSection: {
    padding: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: Colors.bg_light,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text_dark,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text_light,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text_dark,
  },

  scoreEntrySection: {
    padding: 20,
    paddingTop: 16,
    gap: 16,
  },
  scoreInputsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreInputWrapper: {
    flex: 1,
    gap: 8,
  },
  scoreInputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text_light,
    textAlign: 'center',
  },
  scoreInput: {
    backgroundColor: Colors.bg_light,
    borderWidth: 2,
    borderColor: Colors.border_light,
    borderRadius: 12,
    padding: 12,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text_dark,
    textAlign: 'center',
  },
  scoreInputDivider: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  scoreInputDividerText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text_lighter,
  },

  actionButtons: {
    gap: 12,
  },
  liveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.status_rejected,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  liveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.success,
    padding: 14,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonDisabled: {
    backgroundColor: Colors.button_disabled,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },

  participantNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: Colors.info_background,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  participantNoteText: {
    flex: 1,
    fontSize: 14,
    color: Colors.info_text,
    lineHeight: 20,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
});