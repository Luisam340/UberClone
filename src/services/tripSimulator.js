import { getRandomLocation } from '../data/simulatedLocations';
import { PRICING } from '../config/pricing';
import { calculateFare } from '../utils/calculateFare';
import { reverseGeocode } from './reverseGeocode';
import { splitTripRoute } from '../utils/routePickup';
import {
  validateCoordinates,
  validateSimulatedTrip,
} from '../utils/tripSimulationValidators';

const MAX_ROUTE_ATTEMPTS = 12;
const MIN_TRIP_DISTANCE_KM = 1;
const MAX_PICKUP_DISTANCE_KM = 10;

export async function getSimulatedDrivingRoute({
  origin,
  destination,
  routingUrl,
}) {
  if (!validateCoordinates(origin) || !validateCoordinates(destination)) {
    throw new Error('Las coordenadas para consultar la ruta no son válidas.');
  }

  if (typeof routingUrl !== 'string' || !routingUrl.trim()) {
    throw new Error('No se ha configurado el servicio de rutas.');
  }

  const coordinates = [
    `${origin.longitude},${origin.latitude}`,
    `${destination.longitude},${destination.latitude}`,
  ].join(';');

  const url =
    `${routingUrl.replace(/\/$/, '')}/route/v1/driving/${coordinates}` +
    '?overview=full&geometries=geojson';

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('No fue posible consultar la ruta del viaje.');
  }

  const data = await response.json();

  if (data.code !== 'Ok' || !data.routes?.[0]) {
    throw new Error('No se encontró una ruta para el viaje.');
  }

  const route = data.routes[0];

  if (
    !Number.isFinite(route.distance) ||
    !Number.isFinite(route.duration) ||
    !Array.isArray(route.geometry?.coordinates)
  ) {
    throw new Error('El servicio devolvió una ruta incompleta.');
  }

  const coordinatesList = route.geometry.coordinates.map(
    ([longitude, latitude]) => ({
      latitude,
      longitude,
    }),
  );

  if (
    coordinatesList.length < 2 ||
    !coordinatesList.every(validateCoordinates)
  ) {
    throw new Error('El recorrido recibido no es válido.');
  }

  return {
    coordinates: coordinatesList,
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
  };
}

export async function createSimulatedTrip({
  passenger,
  driverPosition,
  category = 'economy',
  routingUrl,
}) {
  if (!validateCoordinates(driverPosition)) {
    throw new Error('La ubicación actual del conductor no es válida.');
  }

  if (!passenger?.id || !passenger?.name) {
    throw new Error('No se pudo generar la información del pasajero.');
  }

  let lastError = null;

  for (let attempt = 0; attempt < MAX_ROUTE_ATTEMPTS; attempt++) {
    try {
      const destinationCandidate = getRandomLocation();

      // Buscar primero una ruta y elegir la recogida sobre esa via.
      const candidateRoute = await getSimulatedDrivingRoute({
        origin: driverPosition,
        destination: destinationCandidate,
        routingUrl,
      });

      // Usar una sola ruta válida para ambos tramos del viaje.
      const splitRoute = splitTripRoute(
        candidateRoute,
        MAX_PICKUP_DISTANCE_KM,
        MIN_TRIP_DISTANCE_KM,
      );

      if (!splitRoute) {
        continue;
      }

      const { pickupRoute, tripRoute } = splitRoute;

      if (
        pickupRoute.distanceKm <= 0 ||
        pickupRoute.distanceKm > MAX_PICKUP_DISTANCE_KM
      ) {
        continue;
      }

      if (
        tripRoute.distanceKm < MIN_TRIP_DISTANCE_KM ||
        tripRoute.durationMin <= 0
      ) {
        continue;
      }

      const pickup =
        pickupRoute.coordinates[pickupRoute.coordinates.length - 1];

      const destination =
        tripRoute.coordinates[tripRoute.coordinates.length - 1];

      const fareDetails = calculateFare({
        distanceKm: tripRoute.distanceKm,
        durationMin: tripRoute.durationMin,
        category,
      });

      // Obtener direcciones para los puntos del recorrido.
      const pickupAddress = await reverseGeocode(pickup);
      const destinationAddress = await reverseGeocode(destination);

      const trip = {
        id: passenger.id,
        passengerName: passenger.name,
        passengerRating: passenger.rating,
        passengerCount: passenger.passengerCount,
        category,

        pickup,
        destination,

        pickupAddress,
        destinationAddress,

        pickupRoute: pickupRoute.coordinates,
        tripRoute: tripRoute.coordinates,

        pickupDistanceKm: pickupRoute.distanceKm,
        pickupDurationMin: pickupRoute.durationMin,

        distanceKm: tripRoute.distanceKm,
        durationMin: tripRoute.durationMin,

        estimatedFare: fareDetails.fare,
        commission: fareDetails.commission,
        driverEarnings: fareDetails.driverEarnings,

        commissionRate: PRICING.commissionRate,
        // El simulador actual solo permite confirmar cobros en efectivo.
        paymentMethod: 'cash',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
      };

      const validationError = validateSimulatedTrip(trip);

      if (validationError) {
        throw new Error(validationError);
      }
      return trip;
    } catch (error) {
      lastError = error;
    }
  }
  throw new Error(
    lastError instanceof Error
      ? `No se pudo generar una ruta válida: ${lastError.message}`
      : 'No se pudo encontrar una solicitud con rutas válidas.',
  );
}
