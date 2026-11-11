import { useCallback, useEffect, useRef, useState } from 'react';
import { FIRESTORE_TRIP_STATUS, updateTripStatus } from '../services/trips';
import { TRIP_STATUS, useTripLifecycle } from './useTripLifecycle';
import { useTripRequests } from './useTripRequests';
import { useTripRequestHandlers } from './useTripRequestHandlers';

export { TRIP_STATUS };

export function useTripSimulation({
  isAvailable = false,
  driverId,
  createTrip,
  autoGenerate = false,
  requestDuration,
} = {}) {
  const [lastRequestResult, setLastRequestResult] = useState(null);
  const updatingRef = useRef(false);
  const {
    activeTrip,
    tripPhase,
    isTripActive,
    beginPickup,
    startTrip: startActiveTrip,
    completeTrip: completeActiveTrip,
    resetTrip: resetActiveTrip,
  } = useTripLifecycle();
  const {
    pendingRequests,
    isGenerating,
    error,
    setError,
    startRequest,
    removeRequest,
    takeRequest,
    maxPendingRequests,
  } = useTripRequests({
    isAvailable: isAvailable && !activeTrip,
    createTrip,
    autoGenerate,
    requestDuration,
  });
  const { acceptTrip, rejectTrip } = useTripRequestHandlers({
    driverId,
    pendingRequests,
    removeRequest,
    takeRequest,
    beginPickup,
    setLastRequestResult,
    setError,
  });

  // Limpiar el resultado cuando aparecen nuevas solicitudes.
  useEffect(() => {
    if (pendingRequests.length > 0) setLastRequestResult(null);
  }, [pendingRequests.length]);

  // Confirmar el inicio del recorrido en Firestore.
  const startTrip = useCallback(async () => {
    if (
      !driverId ||
      !activeTrip ||
      tripPhase !== TRIP_STATUS.PICKUP ||
      updatingRef.current
    ) {
      return false;
    }
    updatingRef.current = true;
    try {
      await updateTripStatus(
        driverId,
        activeTrip.id,
        FIRESTORE_TRIP_STATUS.IN_PROGRESS,
      );
      return startActiveTrip();
    } catch (updateError) {
      setError(updateError.message ?? 'No se pudo iniciar el viaje.');
      return false;
    } finally {
      updatingRef.current = false;
    }
  }, [driverId, activeTrip, tripPhase, startActiveTrip, setError]);

  // Confirmar la finalización del recorrido en Firestore.
  const completeTrip = useCallback(async () => {
    if (
      !driverId ||
      !activeTrip ||
      tripPhase !== TRIP_STATUS.IN_PROGRESS ||
      updatingRef.current
    ) {
      return false;
    }
    updatingRef.current = true;
    try {
      await updateTripStatus(
        driverId,
        activeTrip.id,
        FIRESTORE_TRIP_STATUS.COMPLETED,
      );
      return completeActiveTrip();
    } catch (updateError) {
      setError(updateError.message ?? 'No se pudo finalizar el viaje.');
      return false;
    } finally {
      updatingRef.current = false;
    }
  }, [driverId, activeTrip, tripPhase, completeActiveTrip, setError]);

  // Limpiar un viaje finalizado sin borrar su historial.
  const resetTrip = useCallback(() => {
    if (tripPhase !== TRIP_STATUS.COMPLETED || updatingRef.current)
      return false;
    const reset = resetActiveTrip();
    if (reset) {
      setLastRequestResult(null);
      setError(null);
    }
    return reset;
  }, [resetActiveTrip, setError, tripPhase]);

  const isRequestPending = pendingRequests.length > 0;
  const status = activeTrip
    ? tripPhase
    : isRequestPending
      ? TRIP_STATUS.PENDING
      : isGenerating
        ? TRIP_STATUS.GENERATING
        : TRIP_STATUS.IDLE;
  const currentTrip = activeTrip ?? pendingRequests[0] ?? null;
  const remainingSeconds =
    !activeTrip && isRequestPending ? pendingRequests[0].remainingSeconds : 0;
  const canSimulateRequest =
    isAvailable &&
    !activeTrip &&
    !isGenerating &&
    pendingRequests.length < maxPendingRequests;

  return {
    status,
    currentTrip,
    activeTrip,
    pendingRequests,
    remainingSeconds,
    lastRequestResult,
    error,
    isGenerating,
    isRequestPending,
    isTripActive,
    canSimulateRequest,
    maxPendingRequests,
    startRequest,
    acceptTrip,
    rejectTrip,
    startTrip,
    completeTrip,
    resetTrip,
  };
}
