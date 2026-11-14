const isEmpty = (value) =>
  value === null || value === undefined || String(value).trim() === '';
const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export function validateAuthentication(error) {
  const errors = {};
  switch (error.code) {
    case 'auth/invalid-email':
      errors.invalidEmail = 'El correo electrónico no es válido';
      break;
    case 'auth/invalid-credential':
      errors.invalidCredential = 'Correo o contraseña incorrectos';
      break;
    case 'auth/too-many-requests':
      errors.manyRequest =
        'Demasiados intentos para iniciar sesión. Intenta iniciar sesión más tarde';
      break;
    case 'auth/network-request-failed':
      errors.networkRequestFailed = 'Comprueba tu conexión a internet';
      break;
    default:
      errors.defaultError = 'Ocurrió un problema al iniciar sesión';
  }

  return errors;
}

export function validateLoginData(data) {
  const errors = {};
  if (isEmpty(data.email)) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (isEmpty(data.password)) {
    errors.password = 'La contraseña es obligatoria.';
  }

  return errors;
}
