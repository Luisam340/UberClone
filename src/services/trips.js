import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const FIRESTORE_TRIP_STATUS = Object.freeze({
  REQUESTED: 'requested',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
  DRIVER_ARRIVING: 'driver_arriving',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
});

// Datos del viaje que se guardan desde que la solicitud aparece en pantalla.
// No se incluye completedAt: el historial ordena por ese campo y una
// solicitud sin finalizar no debe aparecer en sus páginas.
function buildRequestedTripDocument(driverId, trip) {
  return {
    driverId,
    passengerId: String(trip.id),
    passengerName: trip.passengerName ?? 'Pasajero',
    passengerRating: trip.passengerRating ?? null,
    passengerCount: trip.passengerCount ?? 1,
    origin: {
      latitude: trip.pickup.latitude,
      longitude: trip.pickup.longitude,
      address: trip.pickupAddress ?? '',
    },
    destination: {
      latitude: trip.destination.latitude,
      longitude: trip.destination.longitude,
      address: trip.destinationAddress ?? '',
    },
    pickupRoute: trip.pickupRoute ?? [],
    tripRoute: trip.tripRoute ?? [],
    pickupDistanceKm: trip.pickupDistanceKm,
    pickupDurationMin: trip.pickupDurationMin,
    distanceKm: trip.distanceKm,
    durationMin: trip.durationMin,
    category: trip.category,
    estimatedFare: trip.estimatedFare,
    fare: trip.estimatedFare,
    commission: trip.commission,
    tip: 0,
    driverEarnings: trip.driverEarnings,
    commissionRate: trip.commissionRate,
    paymentMethod: trip.paymentMethod ?? null,
    paymentStatus: 'pending',
    paymentId: null,
    status: FIRESTORE_TRIP_STATUS.REQUESTED,
    createdAt: serverTimestamp(),
  };
}

// Registrar la solicitud antes de mostrarla al conductor.
export async function createRequestedTrip(driverId, trip) {
  if (!driverId || !trip?.id) {
    throw new Error('No se pudo identificar el conductor o el viaje.');
  }
  const reference = doc(db, 'trips', String(trip.id));
  const document = buildRequestedTripDocument(driverId, trip);

  // Evitar sobrescribir viajes que ya estén registrados.
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (snapshot.exists()) {
      throw new Error('Este viaje ya fue registrado.');
    }
    transaction.set(reference, document);
  });
  return reference.id;
}

// Aceptar una solicitud solo si sigue pendiente para este conductor.
export async function acceptRequestedTrip(driverId, tripId) {
  if (!driverId || !tripId) {
    throw new Error('No se pudo identificar el conductor o el viaje.');
  }
  const reference = doc(db, 'trips', String(tripId));
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists() || snapshot.data().driverId !== driverId) {
      throw new Error('No se encontró la solicitud del conductor.');
    }
    const currentStatus = snapshot.data().status;
    // Un reintento de la misma aceptación no debe fallar.
    if (currentStatus === FIRESTORE_TRIP_STATUS.ACCEPTED) return;
    if (currentStatus !== FIRESTORE_TRIP_STATUS.REQUESTED) {
      throw new Error('La solicitud ya no está disponible.');
    }
    transaction.update(reference, {
      status: FIRESTORE_TRIP_STATUS.ACCEPTED,
      acceptedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

// Registrar por qué una solicitud no se tomó (rechazo, expiración,
// desconexión u otra solicitud aceptada).
export async function rejectRequestedTrip(driverId, tripId, reason) {
  if (!driverId || !tripId) {
    throw new Error('No se pudo identificar el conductor o el viaje.');
  }
  const reference = doc(db, 'trips', String(tripId));
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    // Si la solicitud nunca llegó a guardarse, no hay nada que rechazar.
    if (!snapshot.exists()) return;
    if (snapshot.data().driverId !== driverId) {
      throw new Error('No se encontró la solicitud del conductor.');
    }
    const currentStatus = snapshot.data().status;
    if (currentStatus === FIRESTORE_TRIP_STATUS.REJECTED) return;
    if (currentStatus !== FIRESTORE_TRIP_STATUS.REQUESTED) {
      throw new Error('La solicitud ya fue aceptada y no puede rechazarse.');
    }
    transaction.update(reference, {
      status: FIRESTORE_TRIP_STATUS.REJECTED,
      rejectionReason: reason ?? 'driver_rejected',
      rejectedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

// Confirmación manual del efectivo, solo para el conductor de este viaje.
// Esta operación no se utiliza para pagos digitales.
export async function confirmCashTripPayment(driverId, tripId) {
  if (!driverId || !tripId) {
    throw new Error('No se pudo identificar el conductor o el viaje.');
  }

  const reference = doc(db, 'trips', String(tripId));
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists() || snapshot.data().driverId !== driverId) {
      throw new Error('No se encontró un viaje del conductor.');
    }

    const trip = snapshot.data();
    if (trip.status === FIRESTORE_TRIP_STATUS.PAID &&
        trip.paymentMethod === 'cash' && trip.paymentStatus === 'cash') {
      return;
    }
    if (trip.status !== FIRESTORE_TRIP_STATUS.COMPLETED ||
        trip.paymentMethod !== 'cash' || trip.paymentStatus !== 'pending') {
      throw new Error('Este viaje no admite confirmación de efectivo.');
    }

    transaction.update(reference, {
      status: FIRESTORE_TRIP_STATUS.PAID,
      paymentStatus: 'cash',
      paidAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
}

const ALLOWED_TRANSITIONS = {
  requested: ['accepted', 'rejected'],
  accepted: ['driver_arriving', 'cancelled'],
  driver_arriving: ['in_progress', 'cancelled'],
  in_progress: ['completed'],
  completed: ['paid'],
};

// Actualizar el estado solo si la transición es válida.
export async function updateTripStatus(driverId, tripId, nextStatus) {
  if (!driverId || !tripId) {
    throw new Error('No se pudo identificar el viaje.');
  }
  const reference = doc(db, 'trips', String(tripId));
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists() || snapshot.data().driverId !== driverId) {
      throw new Error('No se encontró un viaje del conductor.');
    }
    const currentStatus = snapshot.data().status;
    if (currentStatus === nextStatus) return;
    if (!ALLOWED_TRANSITIONS[currentStatus]?.includes(nextStatus)) {
      throw new Error('La transición del viaje no está permitida.');
    }
    const changes = {
      status: nextStatus,
      updatedAt: serverTimestamp(),
    };
    if (nextStatus === FIRESTORE_TRIP_STATUS.COMPLETED) {
      changes.completedAt = serverTimestamp();
    }
    transaction.update(reference, changes);
  });
}
