import { useCallback, useRef, useState } from 'react';

export const TRIP_STATUS = Object.freeze({
  IDLE: 'idle',
  GENERATING: 'generating',
  PENDING: 'pending',
  PICKUP: 'pickup',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
});

export function useTripLifecycle() {
  const [activeTrip, setActiveTrip] = useState(null);
  const [tripPhase, setTripPhase] = useState(TRIP_STATUS.IDLE);

  const activeTripRef = useRef(null);
  const tripPhaseRef = useRef(TRIP_STATUS.IDLE);

  const updateTripPhase = useCallback((nextPhase) => {
    tripPhaseRef.current = nextPhase;
    setTripPhase(nextPhase);
  }, []);

  // Guardar el viaje elegido por el conductor.
  const beginPickup = useCallback(
    (trip) => {
      if (!trip || activeTripRef.current) {
        return false;
      }

      activeTripRef.current = trip;
      setActiveTrip(trip);
      updateTripPhase(TRIP_STATUS.PICKUP);

      return true;
    },
    [updateTripPhase],
  );

  // Iniciar el recorrido hacia el destino.
  const startTrip = useCallback(() => {
    if (!activeTripRef.current || tripPhaseRef.current !== TRIP_STATUS.PICKUP) {
      return false;
    }

    updateTripPhase(TRIP_STATUS.IN_PROGRESS);
    return true;
  }, [updateTripPhase]);

  // Marcar el viaje como finalizado.
  const completeTrip = useCallback(() => {
    if (
      !activeTripRef.current ||
      tripPhaseRef.current !== TRIP_STATUS.IN_PROGRESS
    ) {
      return false;
    }

    updateTripPhase(TRIP_STATUS.COMPLETED);
    return true;
  }, [updateTripPhase]);

  // Limpiar el viaje cuando termina la simulacion.
  const resetTrip = useCallback(() => {
    if (!activeTripRef.current) {
      return false;
    }

    activeTripRef.current = null;
    setActiveTrip(null);
    updateTripPhase(TRIP_STATUS.IDLE);

    return true;
  }, [updateTripPhase]);

  const isTripActive =
    tripPhase === TRIP_STATUS.PICKUP || tripPhase === TRIP_STATUS.IN_PROGRESS;

  return {
    activeTrip,
    tripPhase,
    isTripActive,
    beginPickup,
    startTrip,
    completeTrip,
    resetTrip,
  };
}
