import { StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { typography } from '../../themes/typography';
import { VEHICLE_ICON_SIZE } from '../../data/vehicle';

export const styles = StyleSheet.create({
  ripRequestContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 20,
  },

  tripRequestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  tripRequestTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.text,
  },

  tripRequestTimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.lavender,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },

  tripRequestUrgentTimer: {
    backgroundColor: colors.errorBackground,
  },

  tripRequestTimerText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },

  tripRequestUrgentTimerText: {
    color: colors.error,
  },

  tripRequestPassengerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lavender,
    padding: 14,
    borderRadius: 16,
    gap: 12,
  },

  tripRequestAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },

  tripRequestPassengerInfo: {
    flex: 1,
    gap: 4,
  },

  tripRequestPassengerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },

  tripRequestPassengerDetails: {
    fontSize: 12,
    color: colors.textSecondary,
  },

  tripRequestFare: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },

  tripRequestRouteContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },

  tripRequestRouteIcons: {
    width: 22,
    alignItems: 'center',
    paddingTop: 3,
  },

  tripRequestRouteLine: {
    width: 2,
    height: 44,
    backgroundColor: colors.border,
    marginVertical: 4,
  },

  tripRequestRouteDetails: {
    flex: 1,
    gap: 22,
  },

  tripRequestRouteLocation: {
    gap: 4,
  },

  tripRequestRouteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },

  tripRequestRouteAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },

  tripRequestMetricsContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  tripRequestMetricCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 7,
  },

  tripRequestMetricValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },

  tripRequestMetricLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  tripRequestActions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 4,
  },

  tripRequestRejectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  tripRequestRejectText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },

  tripRequestAcceptButton: {
    flex: 1.3,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  tripRequestAcceptText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.surface,
  },

  tripRequestDisabledButton: {
    opacity: 0.5,
  },

  tripRequestBottomSheetBackground: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  tripRequestBottomSheetHandle: {
    backgroundColor: colors.border,
    width: 42,
  },

  tripRequestHomeOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },

  tripRequestHomeSheetBackground: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  tripRequestHomeSheetHandle: {
    backgroundColor: colors.border,
    width: 44,
    height: 5,
  },

  tripRequestHomeStatusContent: {
    flex: 1,
    paddingRight: 12,
  },

  tripRequestSimulateButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  tripRequestSimulateButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },

  tripRequestErrorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 12,
  },

  tripRequestActiveContainer: {
    marginTop: 16,
    gap: 10,
  },

  tripActiveSheetContent: {
    paddingTop: 10,
    paddingBottom: 18,
  },

  tripHomeHeading: {
    fontSize: 18,
    lineHeight: 23,
    marginBottom: 4,
  },

  tripActiveHeading: {
    fontSize: 16,
    lineHeight: 21,
    textAlign: 'left',
    marginBottom: 0,
  },

  tripActiveCompactContainer: {
    marginTop: 8,
    gap: 8,
  },

  tripActiveCompactPassengerCard: {
    padding: 10,
    gap: 10,
    borderRadius: 14,
  },

  tripActiveCompactAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },

  tripActiveCompactRoute: {
    paddingVertical: 0,
    gap: 9,
  },

  tripActiveCompactRouteLine: {
    height: 30,
    marginVertical: 2,
  },

  tripActiveCompactRouteDetails: {
    gap: 12,
  },

  tripActiveCompactMetrics: {
    gap: 8,
  },

  tripActiveCompactMetricCard: {
    paddingVertical: 6,
    gap: 2,
  },

  tripActiveCompactName: {
    fontSize: 12,
    lineHeight: 16,
  },

  tripActiveCompactSecondary: {
    fontSize: 10,
  },

  tripActiveCompactFare: {
    fontSize: 14,
  },

  tripActiveCompactLabel: {
    fontSize: 9,
    letterSpacing: 0.3,
  },

  tripActiveCompactAddress: {
    fontSize: 11,
    lineHeight: 15,
  },

  tripActiveCompactMetricValue: {
    fontSize: 13,
  },

  tripPaymentSummary: {
    gap: 4,
    padding: 16,
    marginTop: 12,
    backgroundColor: colors.lavender,
    borderRadius: 16,
  },

  tripRequestActiveTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },

  tripRequestContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    gap: 16,
  },

  tripRequestScrollContent: {
    flexGrow: 0,
    paddingBottom: 12,
  },
});
