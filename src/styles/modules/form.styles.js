import { StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { typography } from '../../themes/typography';
import { VEHICLE_ICON_SIZE } from '../../data/vehicle';

export const styles = StyleSheet.create({
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
    color: colors.border,
    fontWeight: '800',
  },

});
