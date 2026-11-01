export const initialPersonalData = {
  profilePhoto: null,
  name: '',
  idNumber: '',
  phoneNumber: '',
  showPassword: false,
  showPasswordRepeat: false,
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
