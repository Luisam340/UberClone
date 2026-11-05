const CITY_CENTER = {
  latitude: 6.2442,
  longitude: -75.5812,
};

const MAX_LATITUDE_OFFSET = 0.055;
const MAX_LONGITUDE_OFFSET = 0.045;

export const getRandomLocation = () => {
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.sqrt(Math.random());

  return {
    name: 'Ubicación simulada',
    latitude:
      CITY_CENTER.latitude + Math.cos(angle) * distance * MAX_LATITUDE_OFFSET,
    longitude:
      CITY_CENTER.longitude + Math.sin(angle) * distance * MAX_LONGITUDE_OFFSET,
  };
};

export const getRandomNearbyPosition = (position, origin) => {
  const latitudeChange = (Math.random() - 0.5) * 0.00035;
  const longitudeChange = (Math.random() - 0.5) * 0.00035;

  return {
    latitude: Math.max(
      origin.latitude - 0.002,
      Math.min(origin.latitude + 0.002, position.latitude + latitudeChange),
    ),
    longitude: Math.max(
      origin.longitude - 0.002,
      Math.min(origin.longitude + 0.002, position.longitude + longitudeChange),
    ),
  };
};
