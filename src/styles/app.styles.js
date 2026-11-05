import { StyleSheet } from 'react-native';
import { colors } from '../themes/colors';
import { typography } from '../themes/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: colors.background,
  },

  logo: {
    width: 190,
    height: 145,
    marginBottom: 10,
    borderRadius: 20,
  },

  welcome: {
    fontSize: typography.size.welcome,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '800',
  },

  subtitle: {
    fontSize: typography.size.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },

  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  formContent: {
    padding: 24,
    paddingBottom: 50,
  },

  label: {
    fontSize: typography.size.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginTop: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    fontSize: typography.size.body,
    color: colors.text,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
  },

  passwordInput: {
    flex: 1,
    fontSize: typography.size.body,
    color: colors.text,
  },

  showPassword: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: typography.size.sm,
  },

  button: {
    backgroundColor: colors.primary,
    borderRadius: 17,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 28,
    marginHorizontal: 2,
  },

  buttonText: {
    fontSize: typography.size.button,
    color: colors.surface,
    fontWeight: '700',
  },

  helper: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },

  link: {
    color: colors.primary,
    textAlign: 'center',
    fontWeight: '700',
    marginTop: 20,
    textDecorationLine: 'underline',
  },

  registerContent: {
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },

  illustration: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  illustrationSymbol: {
    fontSize: 80,
    color: colors.primary,
  },

  illustrationIcon: {
    position: 'absolute',
    right: 30,
    top: 15,
    fontSize: 32,
    color: colors.primary,
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sectionTitle: {
    fontSize: typography.size.sectionTitle,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },

  description: {
    fontSize: typography.size.body,
    lineHeight: 23,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 25,
  },

  placeholderScreen: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 30,
  },

  dateContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    minHeight: 54,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },

  datePicker: {
    alignSelf: 'flex-start',
    marginLeft: -8,
    backgroundColor: colors.surface,
  },

  dateInput: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    height: 54,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateText: {
    color: colors.text,
    fontSize: typography.size.body,
  },

  dateIcon: {
    color: colors.primary,
    fontSize: 20,
  },

  selectContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 17,
    overflow: 'hidden',
  },

  selectOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(41, 37, 53, 0.35)',
  },

  selectModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },

  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  email: {
    fontSize: typography.size.body,
    fontWeight: '600',
    color: colors.text,
  },

  avatar: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: colors.surface,
    fontWeight: '800',
    fontSize: typography.size.sm,
  },

  tabIcon: {
    fontSize: 20,
    color: colors.textSecondary,
  },

  tabLabel: {
    fontSize: 10,
    color: colors.label,
    marginTop: 2,
  },

  active: {
    color: colors.brand,
    fontWeight: '800',
  },

  mapCanvas: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  tabs: {
    height: 72,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderColor: colors.line,
    flexDirection: 'row',
    paddingBottom: 7,
  },

  tab: {
    flex: 1,
    textAlign: 'center',
    padding: 9,
    borderRadius: 10,
    fontSize: 11,
    color: colors.textSecondary,
  },

  road: {
    position: 'absolute',
    height: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  park: {
    position: 'absolute',
    width: 90,
    height: 120,
    right: 35,
    bottom: 20,
    backgroundColor: colors.mint,
    opacity: 0.8,
  },

  routePath: {
    position: 'absolute',
    width: 8,
    height: 270,
    backgroundColor: colors.primary,
    left: '52%',
    top: 60,
    borderRadius: 10,
    transform: [{ rotate: '28deg' }],
    opacity: 0.8,
  },

  locationPulse: {
    position: 'absolute',
    left: '46%',
    top: '45%',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(104, 80, 161, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  locationDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    borderWidth: 5,
    borderColor: colors.surface,
  },

  mapTop: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  location: {
    backgroundColor: colors.surface,
    padding: 9,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },

  small: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.ink,
  },

  simBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,.9)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
  },

  simText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1,
  },

  sheet: {
    flex: 1,
    marginTop: -25,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
  },

  drag: {
    width: 40,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.line,
    alignSelf: 'center',
    marginBottom: 20,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  muted: { fontSize: 11, color: colors.textSecondary, marginTop: 3 },
  switch: {
    width: 54,
    height: 30,
    borderRadius: 18,
    backgroundColor: colors.disabled,
    padding: 4,
  },

  switchOn: {
    backgroundColor: colors.success,
  },

  radar: {
    fontSize: 22,
    color: colors.successText,
  },

  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'colors.surface',
  },

  knobOn: {
    transform: [{ translateX: 24 }],
  },

  tracking: {
    marginTop: 18,
    padding: 13,
    borderRadius: 15,
    backgroundColor: colors.mint,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  trackingContent: {
    flex: 1,
  },

  trackTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.successDark,
  },

  trackText: {
    fontSize: 9,
    color: colors.successMuted,
  },

  map: {
    height: 390,
    backgroundColor: colors.mapBackground,
    overflow: 'hidden',
  },

  roadOne: {
    top: 55,
    left: -30,
    width: 500,
    transform: [{ rotate: '14deg' }],
  },

  roadTwo: {
    top: 190,
    left: -50,
    width: 500,
    transform: [{ rotate: '-10deg' }],
  },

  roadThree: {
    top: 0,
    left: 78,
    height: 400,
    width: 11,
    transform: [{ rotate: '7deg' }],
  },

  roadFour: {
    top: 0,
    left: 250,
    height: 400,
    width: 11,
    transform: [{ rotate: '-8deg' }],
  },

  movingMarker: {
    position: 'absolute',
    left: '46%',
    top: '45%',
  },

  availabilityButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E9E5ED',
    alignItems: 'center',
    justifyContent: 'center',
  },

  availabilityButtonActive: {
    backgroundColor: '#6850A1',
  },

  sheetContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 24,
  },

  profileScrollContent: {
    paddingBottom: 32,
  },

  profileCentered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },

  profileLoadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 13,
  },

  profileHero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 26,
    backgroundColor: colors.lavender,
  },

  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileAvatarText: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: '800',
  },

  profileName: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },

  profileRole: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },

  profileStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 12,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },

  profileStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  profileBody: {
    padding: 16,
    gap: 12,
  },

  profileHeading: {
    marginTop: 6,
    marginBottom: 3,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.textSecondary,
  },

  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  profileSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 12,
  },

  profileSectionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.lavender,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileSectionHeading: {
    flex: 1,
  },

  profileSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },

  profileSectionSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },

  profileSectionContent: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 16,
  },

  profileFieldRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 4,
  },

  profileLastField: {
    borderBottomWidth: 0,
  },

  profileFieldLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  profileFieldValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },

  profileEmptyText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 14,
  },
});
