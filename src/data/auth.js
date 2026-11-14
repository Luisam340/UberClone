export const authErrors = {
  email: '',
  password: '',
  invalidEmail: '',
  invalidCredential: '',
  manyRequest: '',
  networkRequestFailed: '',
  defaultError: '',
};

export const getAuthErrors = (validationErrors) => ({
  ...authErrors,
  ...validationErrors,
});