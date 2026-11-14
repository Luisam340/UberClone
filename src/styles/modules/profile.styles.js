import { StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { typography } from '../../themes/typography';
import { VEHICLE_ICON_SIZE } from '../../data/vehicle';

export const styles = StyleSheet.create({
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

  profileAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
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
