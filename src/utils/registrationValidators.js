const PRIVATE_VEHICLE_REVIEW_YEARS = 5;
const PUBLIC_VEHICLE_REVIEW_YEARS = 2;
const MINIMUM_VEHICLE_YEAR = 1886;

const isEmpty = (value) =>
  value === null || value === undefined || String(value).trim() === '';

const isValidDate = (value) =>
  value instanceof Date && !Number.isNaN(value.getTime());

const normalizeDate = (value) => {
  if (isValidDate(value)) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }

  if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());

    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  }

  return null;
};

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const isFutureDate = (value) => {
  const date = normalizeDate(value);
  return date !== null && date > getToday();
};

const isAdult = (birthDate) => {
  if (!isValidDate(birthDate)) return false;

  const today = getToday();

  if (birthDate > today) return false;

  let age = today.getFullYear() - birthDate.getFullYear();

  const birthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!birthdayPassed) age--;

  return age >= 18;
};

const isValidEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export function validateVehicleYear(vehicleYear, currentDate = new Date()) {
  const yearText = String(vehicleYear ?? '').trim();
  const currentYear = currentDate.getFullYear();
  const maximumYear = currentYear + 1;

  if (!/^\d{4}$/.test(yearText)) {
    return 'Selecciona un año modelo válido de cuatro dígitos.';
  }

  const year = Number(yearText);

  if (year < MINIMUM_VEHICLE_YEAR) {
    return 'Selecciona un año modelo válido.';
  }

  if (year > maximumYear) {
    return `El año modelo no puede superar ${maximumYear}.`;
  }

  return null;
}

export function validateFirstRegistrationDate(value) {
  if (isEmpty(value)) {
    return 'La fecha de primera matrícula es obligatoria.';
  }

  const date = normalizeDate(value);

  if (!date) {
    return 'Selecciona una fecha de matrícula válida.';
  }

  if (date > getToday()) {
    return 'La fecha de matrícula no puede ser futura.';
  }

  return null;
}

export function requiresTechnicalReview(
  firstRegistrationDate,
  serviceType = 'private',
) {
  if (validateFirstRegistrationDate(firstRegistrationDate)) {
    return null;
  }

  if (!['private', 'public'].includes(serviceType)) {
    return null;
  }

  const registrationDate = normalizeDate(firstRegistrationDate);

  const reviewYears =
    serviceType === 'public'
      ? PUBLIC_VEHICLE_REVIEW_YEARS
      : PRIVATE_VEHICLE_REVIEW_YEARS;

  const firstReviewDate = new Date(
    registrationDate.getFullYear() + reviewYears,
    registrationDate.getMonth(),
    registrationDate.getDate(),
  );

  return getToday() >= firstReviewDate;
}

export function validatePersonalData(data) {
  const errors = {};

  if (isEmpty(data.profilePhoto)) {
    errors.profilePhoto = 'La foto de perfil es obligatoria.';
  }

  if (isEmpty(data.name)) {
    errors.name = 'El nombre completo es obligatorio.';
  } else if (!/^[\p{L}\s]+$/u.test(data.name.trim())) {
    errors.name = 'El nombre solo puede contener letras y espacios.';
  } else if (data.name.trim().length > 50) {
    errors.name = 'El nombre no puede superar los 50 caracteres.';
  }

  if (isEmpty(data.idNumber)) {
    errors.idNumber = 'El documento de identidad es obligatorio.';
  } else if (!/^\d{6,10}$/.test(data.idNumber)) {
    errors.idNumber = 'El documento debe tener entre 6 y 10 dígitos.';
  }

  if (isEmpty(data.phoneNumber)) {
    errors.phoneNumber = 'El número de celular es obligatorio.';
  } else if (!/^\d{10}$/.test(data.phoneNumber)) {
    errors.phoneNumber = 'El celular debe tener exactamente 10 dígitos.';
  }

  if (!isValidDate(data.birthDate)) {
    errors.birthDate = 'Selecciona tu fecha de nacimiento.';
  } else if (!isAdult(data.birthDate)) {
    errors.birthDate = 'Debes tener al menos 18 años.';
  }

  if (isEmpty(data.gender)) {
    errors.gender = 'Selecciona un género.';
  }

  if (isEmpty(data.email)) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (isEmpty(data.password)) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (data.password.length < 8) {
    errors.password = 'La contraseña debe tener mínimo 8 caracteres.';
  }

  if (isEmpty(data.passwordRepeat)) {
    errors.passwordRepeat = 'Debes confirmar la contraseña.';
  } else if (data.password !== data.passwordRepeat) {
    errors.passwordRepeat = 'Las contraseñas no coinciden.';
  }

  return errors;
}

export function validateVehicleData(data) {
  const errors = {};

  if (isEmpty(data.vehiclePhoto)) {
    errors.vehiclePhoto = 'La fotografía del vehículo es obligatoria.';
  }

  if (!['economy', 'xl', 'premium'].includes(data.category)) {
    errors.category = 'Selecciona una categoría válida.';
  }

  if (isEmpty(data.licensePlate)) {
    errors.licensePlate = 'La placa es obligatoria.';
  } else if (
    !/^[A-Z]{3}\d{3}$/.test(String(data.licensePlate).trim().toUpperCase())
  ) {
    errors.licensePlate = 'La placa debe tener el formato ABC123.';
  }

  if (isEmpty(data.brand)) {
    errors.brand = 'La marca es obligatoria.';
  } else if (data.brand.trim().length > 30) {
    errors.brand = 'La marca no puede superar los 30 caracteres.';
  }

  if (isEmpty(data.model)) {
    errors.model = 'El modelo es obligatorio.';
  } else if (data.model.trim().length > 30) {
    errors.model = 'El modelo no puede superar los 30 caracteres.';
  }

  if (isEmpty(data.color)) {
    errors.color = 'Selecciona el color del vehículo.';
  }

  const yearError = validateVehicleYear(data.vehicleYear);

  if (yearError) {
    errors.vehicleYear = yearError;
  }

  const registrationError = validateFirstRegistrationDate(
    data.firstRegistrationDate,
  );

  if (registrationError) {
    errors.firstRegistrationDate = registrationError;
  }

  const capacity = Number(data.passengerCapacity);

  if (isEmpty(data.passengerCapacity)) {
    errors.passengerCapacity = 'La capacidad es obligatoria.';
  } else if (
    !/^\d+$/.test(String(data.passengerCapacity)) ||
    !Number.isInteger(capacity) ||
    capacity < 1
  ) {
    errors.passengerCapacity = 'Ingresa una capacidad válida.';
  } else if (data.category === 'xl' && capacity < 6) {
    errors.passengerCapacity = 'La categoría XL requiere mínimo 6 pasajeros.';
  }

  return errors;
}

export function validateDocuments(
  data,
  firstRegistrationDate,
  serviceType = 'private',
) {
  const errors = {};

  if (isEmpty(data.licenseNumber)) {
    errors.licenseNumber = 'El número de licencia es obligatorio.';
  }

  if (!isValidDate(data.licenseExpiration)) {
    errors.licenseExpiration = 'Selecciona el vencimiento de la licencia.';
  } else if (!isFutureDate(data.licenseExpiration)) {
    errors.licenseExpiration = 'La licencia debe vencer después de hoy.';
  }

  if (isEmpty(data.licensePhoto)) {
    errors.licensePhoto = 'La fotografía de la licencia es obligatoria.';
  }

  if (!isValidDate(data.soatExpiration)) {
    errors.soatExpiration = 'Selecciona el vencimiento del SOAT.';
  } else if (!isFutureDate(data.soatExpiration)) {
    errors.soatExpiration = 'El SOAT debe vencer después de hoy.';
  }

  if (isEmpty(data.soatPhoto)) {
    errors.soatPhoto = 'La fotografía del SOAT es obligatoria.';
  }

  const technicalReviewRequired = requiresTechnicalReview(
    firstRegistrationDate,
    serviceType,
  );

  if (technicalReviewRequired === null) {
    errors.technicalExpiration =
      'Verifica la fecha de primera matrícula del vehículo.';
  } else if (technicalReviewRequired) {
    if (!isValidDate(data.technicalExpiration)) {
      errors.technicalExpiration = 'Selecciona la fecha de vencimiento.';
    } else if (!isFutureDate(data.technicalExpiration)) {
      errors.technicalExpiration =
        'La revisión técnico-mecánica debe estar vigente.';
    }

    if (isEmpty(data.technicalPhoto)) {
      errors.technicalPhoto =
        'Adjunta la fotografía de la revisión técnico-mecánica.';
    }
  }

  if (isEmpty(data.mercadoPagoEmail)) {
    errors.mercadoPagoEmail = 'El correo de Mercado Pago es obligatorio.';
  } else if (!isValidEmail(data.mercadoPagoEmail)) {
    errors.mercadoPagoEmail = 'Ingresa un correo electrónico válido.';
  }

  if (data.acceptedTerms !== true) {
    errors.acceptedTerms = 'Debes aceptar los términos y condiciones.';
  }

  return errors;
}
