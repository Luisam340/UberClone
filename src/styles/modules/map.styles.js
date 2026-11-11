import { StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';
import { typography } from '../../themes/typography';
import { VEHICLE_ICON_SIZE } from '../../data/vehicle';

export const styles = StyleSheet.create({
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
    flex: 1,
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
});
