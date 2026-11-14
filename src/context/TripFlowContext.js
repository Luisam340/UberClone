import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useIsFocused } from '@react-navigation/native';
import { doc, onSnapshot } from 'firebase/firestore';

import { db } from '../config/firebaseConfig';
import { AuthContext } from './AuthContext';
import { getRandomLocation } from '../data/simulatedLocations';
import { createSimulatedTrip } from '../services/tripSimulator';
import { useDriverAvailability } from '../hooks/useDriverAvailability';
import { useDriverTripNavigation } from '../hooks/useDriverTripNavigation';
import { TRIP_STATUS, useTripSimulation } from '../hooks/useTripSimulation';
import {
  createTripPaymentOrder,
  getTripPaymentStatus,
  openTripPaymentCheckout,
} from '../services/mercadoPago';

const ROUTING_URL = process.env.EXPO_PUBLIC_ROUTE_URL;
const TripFlowContext = createContext(null);

export function TripFlowProvider({ children }) {
  const { user } = useContext(AuthContext);
  // Este foco pertenece a la entrada del Drawer y NO a las pantallas
  // del Stack. Cambiar de Recogida a Recorrido no desconecta al conductor.
  const isDriverFocused = useIsFocused();
  const [origin] = useState(getRandomLocation);
  const sheetRef = useRef(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const paymentBusyRef = useRef(false);

  const availability = useDriverAvailability(user?.uid, origin);
  const {
    available,
    accountValidated,
    vehicleCategory,
    loadingApproval,
    driverPositionRef,
    stopAvailability,
  } = availability;

  useEffect(() => {
    if (!isDriverFocused) stopAvailability();
  }, [isDriverFocused, stopAvailability]);

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

  const simulation = useTripSimulation({
    driverId: user?.uid,
    isAvailable:
      isDriverFocused &&
      available &&
      accountValidated &&
      !loadingApproval &&
      Boolean(vehicleCategory),
    createTrip,
    autoGenerate: true,
  });
  const { status, activeTrip, startTrip, completeTrip, resetTrip } = simulation;

  const navigation = useDriverTripNavigation({
    activeTrip,
    status,
    startTrip,
    completeTrip,
    resetTrip,
  });

  const handleOpenMercadoPago = useCallback(async () => {
    if (
      !activeTrip?.id ||
      activeTrip.paymentMethod !== 'mercadopago' ||
      status !== TRIP_STATUS.COMPLETED ||
      paymentBusyRef.current
    )
      return;
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

  const handleCheckMercadoPago = useCallback(async () => {
    if (
      !activeTrip?.id ||
      activeTrip.paymentMethod !== 'mercadopago' ||
      status !== TRIP_STATUS.COMPLETED ||
      paymentBusyRef.current
    )
      return;
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

  useEffect(() => {
    if (!activeTrip?.id || status !== TRIP_STATUS.COMPLETED) return;
    const unsubscribe = onSnapshot(
      doc(db, 'trips', String(activeTrip.id)),
      (snapshot) => {
        const trip = snapshot.data();
        if (
          trip?.driverId === user?.uid &&
          (trip.paymentStatus === 'approved' ||
            (trip.paymentMethod === 'cash' && trip.paymentStatus === 'cash')) &&
          trip.status === 'paid'
        ) {
          resetTrip();
        }
      },
      (error) =>
        console.warn(
          'No fue posible escuchar el estado del pago:',
          error.message,
        ),
    );
    return unsubscribe;
  }, [activeTrip?.id, status, user?.uid, resetTrip]);

  const availabilityDisabled =
    loadingApproval ||
    !accountValidated ||
    !vehicleCategory ||
    simulation.isTripActive ||
    status === TRIP_STATUS.COMPLETED;

  return (
    <TripFlowContext.Provider
      value={{
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
      }}
    >
      {children}
    </TripFlowContext.Provider>
  );
}

export function useTripFlow() {
  const context = useContext(TripFlowContext);
  if (!context) {
    throw new Error('useTripFlow debe utilizarse dentro de TripFlowProvider.');
  }
  return context;
}
