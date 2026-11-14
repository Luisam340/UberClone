import { StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';

export const styles = StyleSheet.create({
  settingsContent: { padding: 20, paddingTop: 28, gap: 12 },
  settingsIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsTitle: { fontSize: 25, color: colors.text, fontWeight: '800' },
  settingsDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },
});
