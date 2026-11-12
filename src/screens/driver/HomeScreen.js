import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { createTripPaymentOrder, getTripPaymentStatus, openTripPaymentCheckout } from '../../services/mercadoPago';
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
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const paymentBusyRef = useRef(false);

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
    payCash,
    cashPaymentLoading,
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

  // La creación de una orden se solicita al servicio seguro, nunca desde
  // la app directamente a Mercado Pago con un Access Token privado.
  const handleOpenMercadoPago = useCallback(async () => {
    if (!activeTrip?.id || activeTrip.paymentMethod !== 'mercadopago' ||
        status !== TRIP_STATUS.COMPLETED || paymentBusyRef.current) return;

    paymentBusyRef.current = true;
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      const order = await createTripPaymentOrder(String(activeTrip.id));
      if (!order?.checkoutUrl) {
        throw new Error('No recibimos el enlace de pago de Mercado Pago.');
      }
      setPaymentResult(null);
      await openTripPaymentCheckout(order.checkoutUrl);
    } catch (error) {
      setPaymentError(error.message ?? 'No fue posible abrir Mercado Pago.');
    } finally {
      paymentBusyRef.current = false;
      setPaymentLoading(false);
    }
  }, [activeTrip, status]);

  // La respuesta del navegador no acredita el pago.
  // Consultamos el estado real validado por el servicio.
  const handleCheckMercadoPago = useCallback(async () => {
    if (!activeTrip?.id || activeTrip.paymentMethod !== 'mercadopago' ||
        status !== TRIP_STATUS.COMPLETED || paymentBusyRef.current) return;

    paymentBusyRef.current = true;
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      const result = await getTripPaymentStatus(String(activeTrip.id));
      setPaymentResult(result);
    } catch (error) {
      setPaymentError(error.message ?? 'No fue posible consultar el pago.');
    } finally {
      paymentBusyRef.current = false;
      setPaymentLoading(false);
    }
  }, [activeTrip, status]);

  useEffect(() => {
    setPaymentError(null);
    setPaymentResult(null);
  }, [activeTrip?.id]);

  // Cuando Firestore confirme el pago, liberar el viaje y plegar el panel.
  // No basarse únicamente en el retorno de Checkout Pro ni en una consulta
  // que todavía no haya sincronizado el estado del viaje.
  useEffect(() => {
    if (!activeTrip?.id || status !== TRIP_STATUS.COMPLETED) return;

    const tripRef = doc(db, 'trips', String(activeTrip.id));
    const unsubscribe = onSnapshot(
      tripRef,
      (snapshot) => {
        const trip = snapshot.data();
        if (
          trip?.driverId === user?.uid &&
          (trip.paymentStatus === 'approved' ||
            (trip.paymentMethod === 'cash' && trip.paymentStatus === 'cash')) &&
          trip.status === 'paid'
        ) {
          if (resetTrip()) {
            sheetRef.current?.snapToIndex(0);
          }
        }
      },
      (error) => {
        console.warn('No fue posible escuchar el estado del pago:', error.message);
      },
    );
    return unsubscribe;
  }, [activeTrip?.id, status, user?.uid, resetTrip]);

  // Evitar cambios de disponibilidad durante un viaje.
  const availabilityDisabled =
    loadingApproval ||
    !accountValidated ||
    !vehicleCategory ||
    isTripActive ||
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
