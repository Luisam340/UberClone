
const profileFields = {
  personal: [
    { key: 'name', label: 'Nombre completo' },
    { key: 'idNumber', label: 'Identificación' },
    { key: 'email', label: 'Correo electrónico' },
    { key: 'phoneNumber', label: 'Teléfono' },
    { key: 'birthDate', label: 'Fecha de nacimiento', type: 'date' },
    { key: 'gender', label: 'Género', type: 'gender' },
  ],

  vehicle: [
    { key: 'brand', label: 'Marca' },
    { key: 'model', label: 'Modelo' },
    { key: 'licensePlate', label: 'Placa' },
    { key: 'vehicleYear', label: 'Año' },
    { key: 'color', label: 'Color', type: 'color' },
    { key: 'category', label: 'Categoría', type: 'category' },
    {
      key: 'passengerCapacity',
      label: 'Capacidad',
      type: 'capacity',
    },
  ],

  documents: [
    { key: 'licenseNumber', label: 'Número de licencia' },
    {
      key: 'licenseExpiration',
      label: 'Vencimiento de licencia',
      type: 'date',
    },
    {
      key: 'soatExpiration',
      label: 'Vencimiento del SOAT',
      type: 'date',
    },
    {
      key: 'technicalExpiration',
      label: 'Vencimiento de tecnomecánica',
      type: 'date',
    },
  ],
};

const genderLabels = {
  F: 'Femenino',
  M: 'Masculino',
  O: 'Otro',
};

const colorLabels = {
  white: 'Blanco',
  black: 'Negro',
  gray: 'Gris',
  silver: 'Plateado',
  red: 'Rojo',
  blue: 'Azul',
  green: 'Verde',
  yellow: 'Amarillo',
  beige: 'Beige',
  brown: 'Marrón',
  orange: 'Naranja',
  gold: 'Dorado',
  other: 'Otro',
};

const categoryLabels = {
  economy: 'Económico',
  comfort: 'Comfort',
  xl: 'XL',
};

function formatDate(value) {
  const date =
    typeof value?.toDate === 'function'
      ? value.toDate()
      : value instanceof Date
        ? value
        : null;

  if (!date || Number.isNaN(date.getTime())) {
    return 'No registrado';
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Bogota',
  }).format(date);
}

export function formatFieldValue(value, type) {
  if (value === null || value === undefined || value === '') {
    return 'No registrado';
  }

  switch (type) {
    case 'date':
      return formatDate(value);

    case 'gender':
      return genderLabels[value] ?? String(value);

    case 'color':
      return colorLabels[value] ?? String(value);

    case 'category':
      return categoryLabels[value] ?? String(value);

    case 'capacity':
      return `${value} pasajeros`;

    default:
      return String(value);
  }
}

export function getDisplayFields(data, section) {
  const fields = profileFields[section] ?? [];

  return fields.map(({ key, label, type }) => ({
    key,
    label,
    value: formatFieldValue(data?.[key], type),
  }));
}
