const isEmpty = (value) =>
  value === null || value === undefined || String(value).trim() === '';

const isValidDate = (value) =>
  value instanceof Date && !Number.isNaN(value.getTime());

const isFutureDate = (value) => {
  if (!isValidDate(value)) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(value);
  date.setHours(0, 0, 0, 0);

  return date > today;
};

const isAdult = (birthDate) => {
  if (!isValidDate(birthDate)) return false;

  const today = new Date();

  if (birthDate > today) return false;

  let age = today.getFullYear() - birthDate.getFullYear();

  const birthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!birthdayPassed) age--;

  return age >= 18;
};

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

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
  const currentYear = new Date().getFullYear();

  if (isEmpty(data.vehiclePhoto)) {
    errors.vehiclePhoto = 'La fotografía del vehículo es obligatoria.';
  }

  if (!['economy', 'xl', 'premium'].includes(data.category)) {
    errors.category = 'Selecciona una categoría válida.';
  }

  if (isEmpty(data.licensePlate)) {
    errors.licensePlate = 'La placa es obligatoria.';
  } else if (!/^[A-Z]{3}\d{3}$/.test(data.licensePlate.trim())) {
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

  if (
    !Number.isInteger(Number(data.vehicleYear)) ||
    !/^\d{4}$/.test(String(data.vehicleYear ?? '')) ||
    Number(data.vehicleYear) > currentYear
  ) {
    errors.vehicleYear = 'Selecciona un año válido, no futuro.';
  }

  if (isEmpty(data.color)) {
    errors.color = 'Selecciona el color del vehículo.';
  }

  const capacity = Number(data.passengerCapacity);

  if (isEmpty(data.passengerCapacity)) {
    errors.passengerCapacity = 'La capacidad es obligatoria.';
  } else if (
    !/^\d+$/.test(data.passengerCapacity) ||
    !Number.isInteger(capacity) ||
    capacity < 1
  ) {
    errors.passengerCapacity = 'Ingresa una capacidad válida.';
  } else if (data.category === 'xl' && capacity < 6) {
    errors.passengerCapacity = 'La categoría XL requiere mínimo 6 pasajeros.';
  }

  return errors;
}

export function validateDocuments(data) {
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

  const hasTechnicalDate = data.technicalExpiration != null;
  const hasTechnicalPhoto = !isEmpty(data.technicalPhoto);

  if (hasTechnicalDate || hasTechnicalPhoto) {
    if (!hasTechnicalDate) {
      errors.technicalExpiration = 'Selecciona la fecha de vencimiento.';
    } else if (!isFutureDate(data.technicalExpiration)) {
      errors.technicalExpiration = 'La revisión debe estar vigente.';
    }

    if (!hasTechnicalPhoto) {
      errors.technicalPhoto = 'Adjunta la fotografía de la revisión.';
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
