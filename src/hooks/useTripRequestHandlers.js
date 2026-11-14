import { useCallback, useRef } from 'react';
import {
  acceptRequestedTrip,
  rejectRequestedTrip,
  updateTripStatus,
  FIRESTORE_TRIP_STATUS,
} from '../services/trips';

export function useTripRequestHandlers({
  driverId,
  pendingRequests,
  removeRequest,
  lockRequest,
  unlockRequest,
  takeRequest,
  beginPickup,
  setLastRequestResult,
  setError,
}) {
  const acceptingRef = useRef(false);

  // En un rechazo manual, confirmar el cambio en Firestore antes de ocultar la oferta.
  const rejectTrip = useCallback(
    async (requestId) => {
      const selectedId = requestId ?? pendingRequests[0]?.id;
      if (!selectedId || !driverId) return false;

      const request = pendingRequests.find((item) => item.id === selectedId);
      if (!request) return false;
      if (Date.now() >= request.expiresAt) {
        removeRequest(selectedId, 'expired');
        setLastRequestResult('expired');
        return false;
      }
      if (!lockRequest(selectedId)) return false;

      try {
        await rejectRequestedTrip(driverId, selectedId, 'driver_rejected');
        // Ya está persistido; no lanzar un segundo rechazo en segundo plano.
        const removed = removeRequest(selectedId, 'driver_rejected', false);
        if (removed) {
          setLastRequestResult('rejected');
          setError(null);
        }
        return removed;
      } catch (error) {
        setError(error.message ?? 'No fue posible rechazar la solicitud.');
        return false;
      } finally {
        unlockRequest(selectedId);
      }
    },
    [
      driverId,
      pendingRequests,
      removeRequest,
      lockRequest,
      unlockRequest,
      setLastRequestResult,
      setError,
    ],
  );

  const acceptTrip = useCallback(
    async (requestId) => {
      if (acceptingRef.current) return false;
      const selectedId = requestId ?? pendingRequests[0]?.id;
      if (!selectedId || !driverId) return false;
      const request = pendingRequests.find((item) => item.id === selectedId);
      if (!request || Date.now() >= request.expiresAt) {
        removeRequest(selectedId, 'expired');
        setLastRequestResult('expired');
        return false;
      }

      if (!lockRequest(selectedId)) return false;
      acceptingRef.current = true;
      try {
        await acceptRequestedTrip(driverId, request.id);
        await updateTripStatus(
          driverId,
          request.id,
          FIRESTORE_TRIP_STATUS.DRIVER_ARRIVING,
        );
        const trip = takeRequest(selectedId);
        if (!trip || !beginPickup(trip)) {
          throw new Error(
            'La solicitud fue aceptada, pero no pudo iniciarse en pantalla.',
          );
        }
        setLastRequestResult('accepted');
        setError(null);
        return true;
      } catch (error) {
        setError(error.message ?? 'No fue posible aceptar la solicitud.');
        return false;
      } finally {
        unlockRequest(selectedId);
        acceptingRef.current = false;
      }
    },
    [
      driverId,
      pendingRequests,
      takeRequest,
      removeRequest,
      lockRequest,
      unlockRequest,
      beginPickup,
      setLastRequestResult,
      setError,
    ],
  );

  return { acceptTrip, rejectTrip };
}
