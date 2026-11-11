import { TRIP_STATUS } from '../hooks/useTripSimulation';

// Obtener el título según el estado del conductor y del viaje.
export function getDriverStatusTitle({
  loadingApproval,
  accountValidated,
  vehicleCategory,
  status,
  pickupArrived,
  destinationArrived,
  available,
  pendingRequests,
}) {
  if (loadingApproval) return 'Verificando cuenta';
  if (!accountValidated) return 'Cuenta pendiente de aprobación';
  if (!vehicleCategory) return 'Vehículo sin categoría válida';

  if (status === TRIP_STATUS.PICKUP) {
    return pickupArrived ? 'Llegaste al pasajero' : 'En camino al pasajero';
  }

  if (status === TRIP_STATUS.IN_PROGRESS) {
    return destinationArrived ? 'Llegaste al destino' : 'Viaje en curso';
  }

  if (status === TRIP_STATUS.COMPLETED) return 'Viaje finalizado';
  if (!available) return 'No estás disponible';

  return pendingRequests.length > 0
    ? 'Tienes solicitudes disponibles'
    : 'Buscando solicitudes';
}

// Obtener la descripción del estado o del pasajero activo.
export function getDriverStatusDescription({
  loadingApproval,
  accountValidated,
  vehicleCategory,
  activeTrip,
  available,
}) {
  if (loadingApproval) return 'Verificando estado de la cuenta...';
  if (!accountValidated) return 'Tu cuenta está pendiente de aprobación';
  if (!vehicleCategory) {
    return 'Revisa la categoría registrada de tu vehículo.';
  }

  if (activeTrip) return activeTrip.passengerName;
  if (available) return 'Simulando ubicación del conductor';

  return 'Activa la disponibilidad para comenzar';
}
