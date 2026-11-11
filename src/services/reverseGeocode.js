import * as Location from 'expo-location';
import { validateCoordinates } from '../utils/tripSimulationValidators';

const formatCoordinates = (position) =>
  `${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`;

export async function reverseGeocode(position) {
  if (!validateCoordinates(position)) {
    throw new Error('Las coordenadas no son válidas.');
  }

  try {
    const results = await Location.reverseGeocodeAsync({
      latitude: position.latitude,
      longitude: position.longitude,
    });

    const address = results?.[0];

    if (!address) {
      return formatCoordinates(position);
    }

    const street = [address.street, address.streetNumber]
      .filter(Boolean)
      .join(' ');

    const neighborhood = address.district || address.subregion || address.name;
    const city = address.city || address.region;
    const parts = [street, neighborhood, city].filter(Boolean);
    const uniqueParts = [...new Set(parts)];
    return uniqueParts.length > 0
      ? uniqueParts.join(', ')
      : formatCoordinates(position);
  } catch {
    return formatCoordinates(position);
  }
}
