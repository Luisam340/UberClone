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
    // fontFamily: typography.family.bold,
    fontSize: typography.size.welcome,
    color: colors.text,
    textAlign: 'center',
  },

  subtitle: {
    // fontFamily: typography.family.regular,
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
    // fontFamily: typography.family.bold,
    fontSize: typography.size.body,
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
    // fontFamily: typography.family.regular,
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
    // fontFamily: typography.family.regular,
  },

  showPassword: {
    color: colors.primary,
    // fontFamily: typography.family.bold,
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
    // fontFamily: typography.family.bold,
    fontSize: typography.size.button,
    color: colors.surface,
  },

  helper: {
    // fontFamily: typography.family.regular,
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },

  link: {
    color: colors.primary,
    textAlign: 'center',
    // fontFamily: typography.family.bold,
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

  sectionTitle: {
    // fontFamily: typography.family.bold,
    fontSize: typography.size.sectionTitle,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },

  description: {
    // fontFamily: typography.family.regular,
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
    // fontFamily: typography.family.body,
    fontSize: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  selectModal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
});
