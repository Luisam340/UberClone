import { StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { typography } from '../../themes/typography';
import { VEHICLE_ICON_SIZE } from '../../data/vehicle';

export const styles = StyleSheet.create({
  tripAlertsOverlay: {
    position: 'absolute',
    top: 16,
    left: 12,
    right: 12,
    bottom: 0,
    zIndex: 20,
    elevation: 20,
  },

  tripAlertsHeader: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },

  tripAlertsTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },

  tripAlertsScroll: {
    flexGrow: 0,
    flexShrink: 1,
    maxHeight: '100%',
  },

  tripAlertsList: {
    paddingBottom: 12,
    gap: 10,
  },

  tripAlertCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },

  tripAlertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tripAlertPassenger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  tripAlertAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lavender,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tripAlertPassengerInfo: {
    flex: 1,
    gap: 2,
  },

  tripAlertPassengerName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },

  tripAlertSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
  },

  tripAlertClose: {
    padding: 6,
    marginLeft: 8,
  },

  tripAlertRoute: {
    gap: 9,
  },

  tripAlertLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  tripAlertLocationInfo: {
    flex: 1,
    gap: 2,
  },

  tripAlertLocationLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: '700',
  },

  tripAlertAddress: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
  },

  tripAlertDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  tripAlertFare: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: '800',
  },

  tripAlertMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  tripAlertMetricText: {
    color: colors.textSecondary,
    fontSize: 11,
  },

  tripAlertFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  tripAlertTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.lavender,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },

  tripAlertAcceptButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  tripAlertAcceptText: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '700',
  },

});
