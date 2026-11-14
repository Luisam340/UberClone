import { useSharedValue } from 'react-native-reanimated';
import { useIsFocused } from '@react-navigation/native';
import { Text, View } from 'react-native';

import { Map } from '../../components/Map';
import { DriverHomeSheet } from '../../components/DriverHomeSheet';
import { TripRequestAlerts } from '../../components/TripRequestAlerts';
import { useTripFlow } from '../../context/TripFlowContext';
import { styles } from '../../styles/app.styles';

export default function HomeScreen() {
  const screenFocused = useIsFocused();
  const sheetPosition = useSharedValue(0);
  const {
    origin,
    sheetRef,
    isDriverFocused,
    availability,
    simulation,
    navigation,
    availabilityDisabled,
    paymentLoading,
    paymentError,
    paymentResult,
    handleOpenMercadoPago,
    handleCheckMercadoPago,
  } = useTripFlow();

  const {
    available,
    seconds,
    accountValidated,
    vehicleCategory,
    loadingApproval,
    driverPositionRef,
    handleLocationChange,
    toggleAvailability,
    stopAvailability,
  } = availability;
  const {
    status,
    activeTrip,
    pendingRequests,
    error: tripError,
    isTripActive,
    acceptTrip,
    rejectTrip,
    payCash,
    cashPaymentLoading,
  } = simulation;

  const mapOrigin = driverPositionRef.current || origin;
  const canAnimate = screenFocused && isDriverFocused;

  return (
    <View style={styles.screen}>
      <Map
        origin={mapOrigin}
        sheetPosition={sheetPosition}
        moving={
          canAnimate &&
          available &&
          !loadingApproval &&
          accountValidated &&
          !activeTrip
        }
        route={canAnimate && available && !activeTrip}
        onLocationChange={handleLocationChange}
        navigationTarget={canAnimate ? navigation.navigationTarget : null}
        navigationId={canAnimate ? navigation.navigationId : null}
        onNavigationComplete={navigation.handleNavigationComplete}
        onNavigationError={navigation.handleNavigationError}
      >
        <View style={styles.mapTop}>
          <View style={styles.location}>
            <Text style={styles.small}>{origin.name}</Text>
          </View>
        </View>
      </Map>

      <DriverHomeSheet
        ref={sheetRef}
        sheetPosition={sheetPosition}
        available={available}
        seconds={seconds}
        accountValidated={accountValidated}
        vehicleCategory={vehicleCategory}
        loadingApproval={loadingApproval}
        status={status}
        activeTrip={activeTrip}
        pendingRequests={pendingRequests}
        tripError={tripError}
        availabilityDisabled={availabilityDisabled}
        onToggle={() => toggleAvailability(availabilityDisabled)}
        pickupArrived={navigation.pickupArrived}
        destinationArrived={navigation.destinationArrived}
        navigationError={navigation.navigationError}
        onRetryNavigation={navigation.retryNavigation}
        onStartTrip={navigation.handleStartTrip}
        onFinishTrip={navigation.handleFinishTrip}
        onPayCash={payCash}
        cashPaymentLoading={cashPaymentLoading}
        onOpenMercadoPago={handleOpenMercadoPago}
        onCheckMercadoPago={handleCheckMercadoPago}
        paymentLoading={paymentLoading}
        paymentError={paymentError}
        paymentResult={paymentResult}
        onResetTrip={navigation.handleResetTrip}
      />

      {!activeTrip && (
        <TripRequestAlerts
          requests={pendingRequests}
          onAccept={acceptTrip}
          onReject={rejectTrip}
          onGoOffline={stopAvailability}
        />
      )}
    </View>
  );
}
