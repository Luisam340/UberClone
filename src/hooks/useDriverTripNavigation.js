import { useCallback, useEffect, useState } from 'react';
import { TRIP_STATUS } from './useTripSimulation';

export function useDriverTripNavigation({
  activeTrip,
  status,
  startTrip,
  completeTrip,
  resetTrip,
  sheetRef,
}) {
  const [pickupArrived, setPickupArrived] = useState(false);
  const [destinationArrived, setDestinationArrived] = useState(false);
  const [navigationError, setNavigationError] = useState(null);
  const [navigationAttempt, setNavigationAttempt] = useState(0);

  // Preparar la navegacion al elegir otro viaje.
  useEffect(() => {
    setPickupArrived(false);
    setDestinationArrived(false);
    setNavigationError(null);
    setNavigationAttempt(0);

    // Mantener el mapa visible: los detalles pueden desplegarse manualmente.
    sheetRef.current?.snapToIndex(0);
  }, [activeTrip?.id]);

  // Elegir la siguiente parada del conductor.
  const navigationTarget =
    status === TRIP_STATUS.PICKUP && !pickupArrived
      ? activeTrip?.pickup
      : status === TRIP_STATUS.IN_PROGRESS && !destinationArrived
        ? activeTrip?.destination
        : null;

  const navigationId =
    navigationTarget && activeTrip
      ? `${activeTrip.id}:${status}:${navigationAttempt}`
      : null;

  // Detectar si el conductor llego al pasajero o al destino.
  const handleNavigationComplete = useCallback(
    (completedNavigationId) => {
      if (!completedNavigationId || completedNavigationId !== navigationId) {
        return;
      }

      setNavigationError(null);

      if (status === TRIP_STATUS.PICKUP) {
        setPickupArrived(true);
      } else if (status === TRIP_STATUS.IN_PROGRESS) {
        setDestinationArrived(true);
        sheetRef.current?.snapToIndex(2);
      }
    },
    [navigationId, status, sheetRef],
  );

  // Mostrar los errores al calcular o recorrer la ruta.
  const handleNavigationError = useCallback((error) => {
    setNavigationError(
      error instanceof Error
        ? error.message
        : 'No fue posible calcular la ruta.',
    );
  }, []);

  // Volver a calcular la ruta cuando falle.
  const retryNavigation = useCallback(() => {
    setNavigationError(null);
    setNavigationAttempt((previous) => previous + 1);
  }, []);

  // Iniciar el viaje cuando el pasajero este a bordo.
  const handleStartTrip = useCallback(async () => {
    if (!pickupArrived) return false;
    const started = await startTrip();
    if (started) {
      setNavigationError(null);
      setNavigationAttempt(0);
    }
    return started;
  }, [pickupArrived, startTrip]);

  // Finalizar solo cuando el carro realmente haya llegado al destino.
  const handleFinishTrip = useCallback(async () => {
    if (!destinationArrived || status !== TRIP_STATUS.IN_PROGRESS) {
      return false;
    }
    return completeTrip();
  }, [destinationArrived, status, completeTrip]);

  return {
    pickupArrived,
    destinationArrived,
    navigationError,
    navigationTarget,
    navigationId,
    handleNavigationComplete,
    handleNavigationError,
    retryNavigation,
    handleStartTrip,
    handleFinishTrip,
    handleResetTrip: resetTrip,
  };
}
