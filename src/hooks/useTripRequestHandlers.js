import { useCallback, useRef } from 'react';
import { saveAcceptedTrip, updateTripStatus, FIRESTORE_TRIP_STATUS } from '../services/trips';

export function useTripRequestHandlers({
  driverId,
  pendingRequests,
  removeRequest,
  takeRequest,
  beginPickup,
  setLastRequestResult,
  setError,
}) {
  const acceptingRef = useRef(false);

  // Rechazar solamente la solicitud seleccionada.
  const rejectTrip = useCallback(
    (requestId) => {
      const selectedId = requestId ?? pendingRequests[0]?.id;

      if (!selectedId) {
        return false;
      }

      const rejected = removeRequest(selectedId);

      if (rejected) {
        setLastRequestResult('rejected');
      }

      return rejected;
    },
    [pendingRequests, removeRequest, setLastRequestResult],
  );

  // Guardar el viaje antes de iniciar la recogida.
  const acceptTrip = useCallback(async (requestId) => {
    if (acceptingRef.current) return false;
    const selectedId = requestId ?? pendingRequests[0]?.id;
    if (!selectedId || !driverId) return false;
    const acceptedTrip = takeRequest(selectedId);
    if (!acceptedTrip) {
      setLastRequestResult('expired');
      return false;
    }
    acceptingRef.current = true;
    try {
      await saveAcceptedTrip(driverId, acceptedTrip);
      await updateTripStatus(
        driverId,
        acceptedTrip.id,
        FIRESTORE_TRIP_STATUS.DRIVER_ARRIVING,
      );
      if (!beginPickup(acceptedTrip)) {
        throw new Error('No fue posible activar el viaje.');
      }
      setLastRequestResult('accepted');
      setError(null);
      return true;
    } catch (error) {
      setError(error.message ?? 'No se pudo guardar el viaje.');
      return false;
    } finally {
      acceptingRef.current = false;
    }
  }, [driverId, pendingRequests, takeRequest, beginPickup, setLastRequestResult, setError]);

  return {
    acceptTrip,
    rejectTrip,
  };
}
