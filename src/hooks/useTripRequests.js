import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { generateSimulatedPassenger } from '../data/simulatedPassengers';
import {
  MAX_REQUEST_DELAY_MS,
  MIN_REQUEST_DELAY_MS,
  REQUEST_DURATION_SECONDS,
} from '../data/simulatedTrips';
import {
  validateTripGenerator,
  validateSimulatedTrip,
  getTripSimulationError,
} from '../utils/tripSimulationValidators';

export const MAX_PENDING_REQUESTS = 2;

const getRandomDelay = () =>
  Math.floor(
    Math.random() * (MAX_REQUEST_DELAY_MS - MIN_REQUEST_DELAY_MS + 1),
  ) + MIN_REQUEST_DELAY_MS;

const getRemainingSeconds = (expiresAt, now) =>
  Math.max(0, Math.ceil((expiresAt - now) / 1000));

// AI-assisted: see docs/AI_LOG.md #17.
export function useTripRequests({
  isAvailable = false,
  createTrip,
  onCreateRequest,
  onDiscardRequest,
  autoGenerate = false,
  requestDuration = REQUEST_DURATION_SECONDS,
} = {}) {
  const [requests, setRequests] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [error, setError] = useState(null);

  const requestsRef = useRef([]);
  const acceptingRequestsRef = useRef(new Set());
  const generatingRef = useRef(false);
  const generationRef = useRef(0);
  const availableRef = useRef(isAvailable);
  const discardRef = useRef(onDiscardRequest);
  discardRef.current = onDiscardRequest;

  const discardRequests = useCallback((items, reason) => {
    if (!items.length) return;
    items.forEach((item) => {
      Promise.resolve(discardRef.current?.(item, reason)).catch((err) => {
        setError(
          err?.message ?? 'No se pudo registrar el rechazo de una solicitud.',
        );
      });
    });
  }, []);

  availableRef.current = isAvailable;

  // Sincronizar las solicitudes para gestionar varios eventos.
  const updateRequests = useCallback((nextRequests) => {
    requestsRef.current = nextRequests;
    setRequests(nextRequests);
  }, []);

  // Invalidar cualquier consulta que siga pendiente.
  const invalidateGeneration = useCallback(() => {
    generationRef.current += 1;
    generatingRef.current = false;
    setIsGenerating(false);
  }, []);

  // Al desconectarse, rechazar las ofertas libres sin interferir con una
  // aceptación o un rechazo que todavía se está confirmando en Firestore.
  const clearRequests = useCallback(() => {
    invalidateGeneration();

    const locked = requestsRef.current.filter((request) =>
      acceptingRequestsRef.current.has(request.id),
    );
    const discarded = requestsRef.current.filter(
      (request) => !acceptingRequestsRef.current.has(request.id),
    );

    if (discarded.length > 0) {
      updateRequests(locked);
      discardRequests(discarded, 'availability_ended');
    }
  }, [invalidateGeneration, updateRequests, discardRequests]);

  // Agregar una solicitud sin reemplazar las anteriores.
  const startRequest = useCallback(async () => {
    if (
      !availableRef.current ||
      generatingRef.current ||
      requestsRef.current.length >= MAX_PENDING_REQUESTS
    ) {
      return false;
    }

    const generatorError = validateTripGenerator(createTrip);

    if (generatorError) {
      setError(generatorError);
      return false;
    }

    const generationId = ++generationRef.current;

    generatingRef.current = true;
    setIsGenerating(true);
    setError(null);

    try {
      const passenger = generateSimulatedPassenger();
      const tripData = await createTrip({ passenger });

      if (generationId !== generationRef.current || !availableRef.current) {
        return false;
      }

      const validationError = validateSimulatedTrip(tripData);

      if (validationError) {
        throw new Error(validationError);
      }

      if (requestsRef.current.length >= MAX_PENDING_REQUESTS) {
        return false;
      }

      const createdAt = Date.now();

      const duration = Math.max(
        1,
        Math.floor(Number(requestDuration) || REQUEST_DURATION_SECONDS),
      );

      const trip = {
        ...tripData,
        id: tripData.id ?? passenger.id ?? `${createdAt}-${generationId}`,
        passengerName: tripData.passengerName ?? passenger.name,
        passengerCount: tripData.passengerCount ?? passenger.passengerCount,
        passengerRating: tripData.passengerRating ?? passenger.rating,
        expiresAt: createdAt + duration * 1000,
      };

      if (requestsRef.current.some((request) => request.id === trip.id)) {
        throw new Error('La solicitud generada tiene un ID duplicado.');
      }

      // No mostrar una oferta hasta que exista realmente en Firestore.
      await onCreateRequest?.(trip);
      if (generationId !== generationRef.current || !availableRef.current) {
        discardRequests([trip], 'availability_ended');
        return false;
      }
      // El contador inicia cuando la solicitud ya es visible, no mientras guarda.
      trip.expiresAt = Date.now() + duration * 1000;
      updateRequests([...requestsRef.current, trip]);
      setNow(Date.now());
      return true;
    } catch (requestError) {
      if (generationId !== generationRef.current) {
        return false;
      }
      setError(getTripSimulationError(requestError));
      return false;
    } finally {
      if (generationId === generationRef.current) {
        generatingRef.current = false;
        setIsGenerating(false);
      }
    }
  }, [
    createTrip,
    requestDuration,
    updateRequests,
    onCreateRequest,
    discardRequests,
  ]);

  // Mantener la solicitud en memoria durante la aceptación remota.
  const lockRequest = useCallback((requestId) => {
    if (
      acceptingRequestsRef.current.has(requestId) ||
      !requestsRef.current.some((item) => item.id === requestId)
    ) {
      return false;
    }
    acceptingRequestsRef.current.add(requestId);
    return true;
  }, []);
  const unlockRequest = useCallback(
    (requestId) => {
      acceptingRequestsRef.current.delete(requestId);

      // Si se desconectó durante la operación y no se aceptó la oferta,
      // registrar su rechazo en vez de dejarla pendiente en Firestore.
      if (!availableRef.current) {
        const request = requestsRef.current.find(
          (item) => item.id === requestId,
        );
        if (request) {
          updateRequests(
            requestsRef.current.filter((item) => item.id !== requestId),
          );
          discardRequests([request], 'availability_ended');
        }
      }
    },
    [updateRequests, discardRequests],
  );

  // Eliminar una oferta especifica.
  const removeRequest = useCallback(
    (requestId, reason = 'driver_rejected', persistRejection = true) => {
      const request = requestsRef.current.find((item) => item.id === requestId);

      if (!request) {
        return false;
      }

      updateRequests(
        requestsRef.current.filter((item) => item.id !== requestId),
      );
      // En un rechazo manual la transacción ya se confirmó en Firestore.
      if (persistRejection) discardRequests([request], reason);
      return true;
    },
    [updateRequests, discardRequests],
  );

  // Tomar una oferta valida y cancelar las demas.
  const takeRequest = useCallback(
    (requestId) => {
      const request = requestsRef.current.find((item) => item.id === requestId);

      if (!request) {
        return null;
      }

      if (
        Date.now() >= request.expiresAt &&
        !acceptingRequestsRef.current.has(requestId)
      ) {
        removeRequest(requestId, 'expired');
        return null;
      }

      invalidateGeneration();
      acceptingRequestsRef.current.delete(requestId);
      const otherRequests = requestsRef.current.filter(
        (item) => item.id !== requestId,
      );
      updateRequests([]);
      discardRequests(otherRequests, 'another_request_accepted');

      const { expiresAt, ...acceptedTrip } = request;

      return acceptedTrip;
    },
    [invalidateGeneration, removeRequest, updateRequests, discardRequests],
  );

  const pendingRequests = useMemo(
    () =>
      requests.map((request) => ({
        ...request,
        remainingSeconds: getRemainingSeconds(request.expiresAt, now),
      })),
    [requests, now],
  );

  // Actualizar los cronometros y quitar ofertas expiradas.
  useEffect(() => {
    if (requests.length === 0) {
      return;
    }

    const intervalId = setInterval(() => {
      const currentTime = Date.now();

      setNow(currentTime);

      const validRequests = requestsRef.current.filter(
        (request) =>
          request.expiresAt > currentTime ||
          acceptingRequestsRef.current.has(request.id),
      );

      if (validRequests.length !== requestsRef.current.length) {
        const expired = requestsRef.current.filter(
          (item) =>
            item.expiresAt <= currentTime &&
            !acceptingRequestsRef.current.has(item.id),
        );
        updateRequests(validRequests);
        discardRequests(expired, 'expired');
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, [requests.length, updateRequests, discardRequests]);

  // Cancelar todas las ofertas si el conductor se desconecta.
  useEffect(() => {
    if (!isAvailable) {
      clearRequests();
    }
  }, [isAvailable, clearRequests]);

  // Programar nuevas solicitudes mientras exista espacio.
  useEffect(() => {
    if (
      !autoGenerate ||
      !isAvailable ||
      isGenerating ||
      requests.length >= MAX_PENDING_REQUESTS
    ) {
      return;
    }

    const timeoutId = setTimeout(startRequest, getRandomDelay());

    return () => clearTimeout(timeoutId);
  }, [autoGenerate, isAvailable, isGenerating, requests.length, startRequest]);

  // Evitar usar resultados de consultas despues de desmontar.
  useEffect(() => {
    return () => {
      generationRef.current += 1;
      generatingRef.current = false;
    };
  }, []);

  return {
    pendingRequests,
    isGenerating,
    error,
    setError,
    startRequest,
    removeRequest,
    lockRequest,
    unlockRequest,
    takeRequest,
    clearRequests,
    maxPendingRequests: MAX_PENDING_REQUESTS,
  };
}
