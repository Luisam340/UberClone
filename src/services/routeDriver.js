const ROUTING_URL = process.env.EXPO_PUBLIC_ROUTE_URL;

export async function getDrivingRoute(origin, destination) {
  const coordinates = [
    `${origin.longitude},${origin.latitude}`,
    `${destination.longitude},${destination.latitude}`,
  ].join(';');

  const url =
    `${ROUTING_URL}/route/v1/driving/${coordinates}` +
    '?overview=full&geometries=geojson';

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Could not fetch driving route');
  }

  const data = await response.json();

  if (data.code !== 'Ok' || !data.routes?.[0]) {
    throw new Error('No driving route found');
  }

  return data.routes[0].geometry.coordinates.map(([longitude, latitude]) => ({
    latitude,
    longitude,
  }));
}
