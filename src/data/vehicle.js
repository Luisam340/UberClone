export const vehicleCategories = [
  { label: 'Económico', value: 'economy' },
  { label: 'XL', value: 'xl' },
  { label: 'Premium', value: 'premium' },
];

export const vehicleColors = [
  { label: 'Blanco', value: 'white' },
  { label: 'Negro', value: 'black' },
  { label: 'Gris', value: 'gray' },
  { label: 'Plateado', value: 'silver' },
  { label: 'Rojo', value: 'red' },
  { label: 'Azul', value: 'blue' },
  { label: 'Verde', value: 'green' },
  { label: 'Amarillo', value: 'yellow' },
  { label: 'Beige', value: 'beige' },
  { label: 'Café', value: 'brown' },
  { label: 'Naranja', value: 'orange' },
  { label: 'Dorado', value: 'gold' },
  { label: 'Otro', value: 'other' },
];

export const vehicleImages = {
  white: require('../../assets/cars/white.png'),
  black: require('../../assets/cars/black.png'),
  gray: require('../../assets/cars/gray.png'),
  silver: require('../../assets/cars/silver.png'),
  red: require('../../assets/cars/red.png'),
  blue: require('../../assets/cars/blue.png'),
  green: require('../../assets/cars/green.png'),
  yellow: require('../../assets/cars/yellow.png'),
  beige: require('../../assets/cars/beige.png'),
  brown: require('../../assets/cars/brown.png'),
  orange: require('../../assets/cars/orange.png'),
  gold: require('../../assets/cars/gold.png'),
};

export const getVehicleImage = (color) => {
  return vehicleImages[color?.toLowerCase()] ?? vehicleImages.white;
};

export const initialVehicle = {
  vehiclePhoto: null,
  category: '',
  licensePlate: '',
  brand: '',
  model: '',
  vehicleYear: null,
  color: null,
  passengerCapacity: '',
};

export const initialVehicleErrors = {
  vehiclePhoto: '',
  category: '',
  licensePlate: '',
  brand: '',
  model: '',
  vehicleYear: '',
  color: '',
  passengerCapacity: '',
};

export const getVehicleErrors = (validationErrors) => ({
  ...initialVehicleErrors,
  ...validationErrors,
});

export const UPDATE_INTERVAL = 50;
export const VEHICLE_SPEED = 19.89;
export const MIN_TURN_SPEED = 2.5;
export const TURN_SPEED = 180;
export const ACCELERATION = 3;
export const EARTH_RADIUS = 6371000;
export const IMAGE_HEADING_OFFSET = 180;
export const HEADING_LOOKAHEAD = 3;
export const HEADING_LOOKBEHIND = 3;
export const CURVE_DETECTION_DISTANCE = 12;
export const PATH_UPDATE_FRAMES = 5;
export const VEHICLE_ICON_SIZE = 48;