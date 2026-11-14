export const initialPersonalData = {
  profilePhoto: null,
  name: '',
  idNumber: '',
  phoneNumber: '',
  email: '',
  gender: '',
  password: '',
  passwordRepeat: '',
  birthDate: null,
};

export const initialPersonalErrors = {
  profilePhoto: '',
  name: '',
  idNumber: '',
  phoneNumber: '',
  birthDate: '',
  gender: '',
  email: '',
  password: '',
  passwordRepeat: '',
};

export const getPersonalErrors = (validationErrors) => ({
  ...initialPersonalErrors,
  ...validationErrors,
});

export const currentDate = new Intl.DateTimeFormat('es-CO', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'America/Bogota',
}).format(new Date());

export const formattedDate =
  currentDate.charAt(0).toUpperCase() + currentDate.slice(1);
