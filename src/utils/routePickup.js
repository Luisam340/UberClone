// Calcular la distancia entre dos puntos de una ruta.
function getSegmentDistanceKm(start, end) {
  const latitude1 = (start.latitude * Math.PI) / 180;
  const latitude2 = (end.latitude * Math.PI) / 180;
  const latitudeDelta = latitude2 - latitude1;
  const longitudeDelta = ((end.longitude - start.longitude) * Math.PI) / 180;

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitude1) *
      Math.cos(latitude2) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 12742 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Dividir una ruta válida en recogida y recorrido del pasajero.
export function splitTripRoute(route, maxPickupKm = 10, minTripKm = 1) {
  const coordinates = route?.coordinates;
  const totalDistanceKm = route?.distanceKm;
  const totalDurationMin = route?.durationMin;

  if (
    !Array.isArray(coordinates) ||
    coordinates.length < 2 ||
    !Number.isFinite(totalDistanceKm) ||
    !Number.isFinite(totalDurationMin) ||
    totalDistanceKm <= minTripKm + 0.3 ||
    totalDurationMin <= 0
  ) {
    return null;
  }

  const segmentDistances = [];
  let geometryDistanceKm = 0;

  for (let index = 1; index < coordinates.length; index += 1) {
    const distance = getSegmentDistanceKm(
      coordinates[index - 1],
      coordinates[index],
    );
    segmentDistances.push(distance);
    geometryDistanceKm += distance;
  }

  if (geometryDistanceKm <= 0) return null;

  // Dejar al menos un kilometro para el viaje del pasajero.
  const maximumPickupKm = Math.min(
    maxPickupKm,
    totalDistanceKm - minTripKm - 0.1,
  );
  if (maximumPickupKm <= 0.2) return null;

  const pickupDistanceKm = 0.2 + Math.random() * (maximumPickupKm - 0.2);
  const targetGeometryKm =
    (pickupDistanceKm / totalDistanceKm) * geometryDistanceKm;

  let traveledKm = 0;

  for (let index = 1; index < coordinates.length; index += 1) {
    const segmentKm = segmentDistances[index - 1];

    if (segmentKm <= 0) continue;
    if (traveledKm + segmentKm < targetGeometryKm) {
      traveledKm += segmentKm;
      continue;
    }

    const previous = coordinates[index - 1];
    const current = coordinates[index];
    const fraction = Math.min(
      1,
      Math.max(0, (targetGeometryKm - traveledKm) / segmentKm),
    );
    const pickup = {
      latitude:
        previous.latitude + (current.latitude - previous.latitude) * fraction,
      longitude:
        previous.longitude +
        (current.longitude - previous.longitude) * fraction,
    };

    const pickupCoordinates = [...coordinates.slice(0, index), pickup];
    const tripCoordinates = [pickup, ...coordinates.slice(index)];
    const pickupFraction = pickupDistanceKm / totalDistanceKm;

    return {
      pickup,
      pickupRoute: {
        coordinates: pickupCoordinates,
        distanceKm: pickupDistanceKm,
        durationMin: totalDurationMin * pickupFraction,
      },
      tripRoute: {
        coordinates: tripCoordinates,
        distanceKm: totalDistanceKm - pickupDistanceKm,
        durationMin: totalDurationMin * (1 - pickupFraction),
      },
    };
  }

  return null;
}
