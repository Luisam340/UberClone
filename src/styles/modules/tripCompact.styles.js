import { StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { typography } from '../../themes/typography';
import { VEHICLE_ICON_SIZE } from '../../data/vehicle';

export const styles = StyleSheet.create({
  tripRequestHomeScroll: {
    flex: 1,
  },

  tripAlertCompactCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  tripAlertCompactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  tripAlertCompactName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },

  tripAlertCompactFare: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },

  tripAlertCompactClose: {
    padding: 4,
  },

  tripAlertCompactRoute: {
    backgroundColor: colors.background,
    borderRadius: 13,
    padding: 7,
    gap: 6,
  },

  tripAlertCompactLocation: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
  },

  tripAlertCompactLocationText: {
    flex: 1,
    gap: 2,
  },

  tripAlertCompactLocationLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  tripAlertCompactAddress: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },

  tripAlertCompactMetrics: {
    flexDirection: 'row',
    gap: 4,
  },

  tripAlertCompactMetric: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.background,
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },

  tripAlertCompactMetricValue: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
  },

  tripAlertCompactMetricLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    textAlign: 'center',
  },

  tripAlertCompactEarnings: {
    backgroundColor: colors.mint,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  tripAlertCompactEarningsLabel: {
    color: colors.successText,
    fontWeight: '600',
    fontSize: 11,
    flexShrink: 1,
  },

  tripAlertCompactEarningsValue: {
    color: colors.successText,
    fontWeight: '800',
    fontSize: 14,
  },

  tripAlertCompactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  tripAlertCompactTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.lavender,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  tripAlertCompactTimerText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },

  tripAlertCompactReject: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 9,
    alignItems: 'center',
  },

  tripAlertCompactRejectText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },

  tripAlertCompactAccept: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 9,
    alignItems: 'center',
  },

  tripAlertCompactAcceptText: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '700',
  },

  vehicleMarkerContainer: {
    width: VEHICLE_ICON_SIZE,
    height: VEHICLE_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  vehicleMarkerImage: {
    width: VEHICLE_ICON_SIZE,
    height: VEHICLE_ICON_SIZE,
  },

  mapCenterButton: {
    position: 'absolute',
    right: 16,
    top: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    zIndex: 10,
  },

  mapCenterButtonInner: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tripNavigationMessage: {
    gap: 10,
  },
});
