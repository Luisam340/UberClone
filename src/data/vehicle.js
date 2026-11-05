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
