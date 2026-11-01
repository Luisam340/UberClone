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
