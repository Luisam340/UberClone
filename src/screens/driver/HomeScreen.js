import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { Map } from '../../components/Map';
import { DriverHomeSheet } from '../../components/DriverHomeSheet';
import { TripRequestAlerts } from '../../components/TripRequestAlerts';
import { getRandomLocation } from '../../data/simulatedLocations';
import { createSimulatedTrip } from '../../services/tripSimulator';
import { useDriverAvailability } from '../../hooks/useDriverAvailability';
import { useDriverTripNavigation } from '../../hooks/useDriverTripNavigation';
import { TRIP_STATUS, useTripSimulation } from '../../hooks/useTripSimulation';
import { AuthContext } from '../../context/AuthContext';
import { styles } from '../../styles/app.styles';

const ROUTING_URL = process.env.EXPO_PUBLIC_ROUTE_URL;

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [origin] = useState(getRandomLocation);
  const sheetRef = useRef(null);
  const isFocused = useIsFocused();

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
  } = useDriverAvailability(user?.uid, origin);

  // Desconectar la simulación cuando Inicio pierde el foco.
  useEffect(() => {
    if (!isFocused) stopAvailability();
  }, [isFocused, stopAvailability]);

  // Generar ofertas de la categoria registrada del vehiculo.
  const createTrip = useCallback(
    ({ passenger }) =>
      createSimulatedTrip({
        passenger,
        driverPosition: driverPositionRef.current,
        category: vehicleCategory,
        routingUrl: ROUTING_URL,
      }),
    [vehicleCategory, driverPositionRef],
  );

  // Gestionar las solicitudes y el estado del viaje.
  const {
    status,
    activeTrip,
    pendingRequests,
    error: tripError,
    isGenerating,
    isRequestPending,
    isTripActive,
    acceptTrip,
    rejectTrip,
    startTrip,
    completeTrip,
    resetTrip,
  } = useTripSimulation({
    driverId: user?.uid,
    isAvailable:
      isFocused &&
      available &&
      accountValidated &&
      !loadingApproval &&
      Boolean(vehicleCategory),
    createTrip,
    autoGenerate: true,
  });

  // Controlar la recogida y la llegada al destino.
  const navigation = useDriverTripNavigation({
    activeTrip,
    status,
    startTrip,
    completeTrip,
    resetTrip,
    sheetRef,
  });

  // Evitar cambios de disponibilidad durante un viaje.
  const availabilityDisabled =
    loadingApproval ||
    !accountValidated ||
    !vehicleCategory ||
    isTripActive ||
    isRequestPending ||
    isGenerating ||
    status === TRIP_STATUS.COMPLETED;

  return (
    <View style={styles.screen}>
      <Map
        origin={origin}
        moving={
          isFocused &&
          available &&
          !loadingApproval &&
          accountValidated &&
          !activeTrip
        }
        route={isFocused && available && !activeTrip}
        onLocationChange={handleLocationChange}
        navigationTarget={isFocused ? navigation.navigationTarget : null}
        navigationId={isFocused ? navigation.navigationId : null}
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
        onResetTrip={navigation.handleResetTrip}
      />

      {!activeTrip && (
        <TripRequestAlerts
          requests={pendingRequests}
          onAccept={acceptTrip}
          onReject={rejectTrip}
        />
      )}
    </View>
  );
}
