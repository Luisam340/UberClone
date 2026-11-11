export function validateCoordinates(position) {
  return (
    position !== null &&
    typeof position === 'object' &&
    Number.isFinite(position.latitude) &&
    Number.isFinite(position.longitude) &&
    position.latitude >= -90 &&
    position.latitude <= 90 &&
    position.longitude >= -180 &&
    position.longitude <= 180
  );
}

export function validateTripGenerator(createTrip) {
  if (typeof createTrip !== 'function') {
    return 'No se ha configurado el generador de solicitudes.';
  }

  return null;
}

export function validateSimulatedTrip(tripData) {
  if (!tripData || typeof tripData !== 'object' || Array.isArray(tripData)) {
    return 'No fue posible generar una solicitud válida.';
  }

  if (typeof tripData.then === 'function') {
    return 'La solicitud todavía no ha terminado de generarse.';
  }

  if (
    !validateCoordinates(tripData.pickup) ||
    !validateCoordinates(tripData.destination)
  ) {
    return 'Las ubicaciones del viaje no son válidas.';
  }

  if (!Number.isFinite(tripData.distanceKm) || tripData.distanceKm <= 0) {
    return 'La distancia del viaje no es válida.';
  }

  if (!Number.isFinite(tripData.durationMin) || tripData.durationMin <= 0) {
    return 'La duración del viaje no es válida.';
  }

  if (!Number.isFinite(tripData.estimatedFare) || tripData.estimatedFare <= 0) {
    return 'La tarifa estimada no es válida.';
  }

  return null;
}

export function getTripSimulationError(error) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'No fue posible generar la solicitud de viaje.';
}
