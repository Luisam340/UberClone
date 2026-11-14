import { StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { typography } from '../../themes/typography';
import { VEHICLE_ICON_SIZE } from '../../data/vehicle';

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

});
