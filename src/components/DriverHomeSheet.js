import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { MapPin, ToggleLeft, ToggleRight } from 'lucide-react-native';
import { styles } from '../styles/app.styles';
import { colors } from '../themes/colors';
import {
  getDriverStatusTitle,
  getDriverStatusDescription,
} from '../utils/driverStatus';
import { ActiveTripDetails } from './ActiveTripDetails';

export const DriverHomeSheet = forwardRef(function DriverHomeSheet(
  {
    available,
    sheetPosition,
    seconds,
    accountValidated,
    vehicleCategory,
    loadingApproval,
    status,
    activeTrip,
    pendingRequests,
    tripError,
    availabilityDisabled,
    onToggle,
    pickupArrived,
    destinationArrived,
    navigationError,
    onRetryNavigation,
    onStartTrip,
    onFinishTrip,
    onPayCash,
    cashPaymentLoading,
    onOpenMercadoPago,
    onCheckMercadoPago,
    paymentLoading,
    paymentError,
    paymentResult,
    onResetTrip,
  },
  ref,
) {
  const { height: windowHeight } = useWindowDimensions();
  const [headerHeight, setHeaderHeight] = useState(90);
  const compactInset = activeTrip ? 42 : 50;
  const snapPoints = useMemo(
    () => [headerHeight + compactInset],
    [headerHeight, compactInset],
  );
  const statusTitle = getDriverStatusTitle({
    loadingApproval,
    accountValidated,
    vehicleCategory,
    status,
    pickupArrived,
    destinationArrived,
    available,
    pendingRequests,
  });
  const statusDescription = getDriverStatusDescription({
    loadingApproval,
    accountValidated,
    vehicleCategory,
    activeTrip,
    available,
  });

  // Abrir el panel al cambiar de etapa.
  const previousStage = useRef(null);
  const currentStage = `${activeTrip?.id ?? 'idle'}:${statusTitle}`;

  useEffect(() => {
    if (previousStage.current === null) {
      previousStage.current = currentStage;
      return;
    }
    if (previousStage.current === currentStage) return;
    previousStage.current = currentStage;
    const frame = requestAnimationFrame(() => ref?.current?.expand());
    return () => cancelAnimationFrame(frame);
  }, [currentStage, ref]);

  return (
    <View pointerEvents="box-none" style={styles.tripRequestHomeOverlay}>
      <BottomSheet
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        enableDynamicSizing
        animatedPosition={sheetPosition}
        maxDynamicContentSize={windowHeight * 0.85}
        enablePanDownToClose={false}
        enableHandlePanningGesture
        enableContentPanningGesture
        backgroundStyle={styles.tripRequestHomeSheetBackground}
        handleIndicatorStyle={styles.tripRequestHomeSheetHandle}
      >
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.sheetContent,
            activeTrip && styles.tripActiveSheetContent,
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={styles.row}
            onLayout={({ nativeEvent }) => {
              const height = Math.ceil(nativeEvent.layout.height);
              setHeaderHeight((previous) =>
                previous === height ? previous : height,
              );
            }}
          >
            <View style={styles.tripRequestHomeStatusContent}>
              <Text
                style={[
                  styles.sectionTitle,
                  styles.tripHomeHeading,
                  activeTrip && styles.tripActiveHeading,
                ]}
              >
                {statusTitle}
              </Text>
              {!activeTrip && (
                <Text style={styles.muted}>{statusDescription}</Text>
              )}
            </View>
            <Pressable
              onPress={onToggle}
              disabled={availabilityDisabled}
              accessibilityRole="switch"
              accessibilityLabel="Disponibilidad del conductor"
              accessibilityState={{
                checked: available,
                disabled: availabilityDisabled,
              }}
              hitSlop={10}
            >
              {available ? (
                <ToggleRight size={32} color={colors.primary} strokeWidth={2} />
              ) : (
                <ToggleLeft
                  size={32}
                  color={
                    availabilityDisabled ? colors.border : colors.textSecondary
                  }
                  strokeWidth={2}
                />
              )}
            </Pressable>
          </View>

          {available && !activeTrip && (
            <View style={styles.tracking}>
              <MapPin size={14} color={colors.successText} strokeWidth={2} />
              <View style={styles.trackingContent}>
                <Text style={styles.trackText}>
                  Posición simulada cada 3 segundos
                </Text>
              </View>
              <Text style={styles.trackText}>{`Disponible: ${seconds}s`}</Text>
            </View>
          )}

          {tripError && !activeTrip && (
            <Text style={styles.tripRequestErrorText}>{tripError}</Text>
          )}

          <ActiveTripDetails
            trip={activeTrip}
            tripError={tripError}
            status={status}
            pickupArrived={pickupArrived}
            destinationArrived={destinationArrived}
            navigationError={navigationError}
            onRetryNavigation={onRetryNavigation}
            onStartTrip={onStartTrip}
            onFinishTrip={onFinishTrip}
            onPayCash={onPayCash}
            cashPaymentLoading={cashPaymentLoading}
            onOpenMercadoPago={onOpenMercadoPago}
            onCheckMercadoPago={onCheckMercadoPago}
            paymentLoading={paymentLoading}
            paymentError={paymentError}
            paymentResult={paymentResult}
            onResetTrip={onResetTrip}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
});
