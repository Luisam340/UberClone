
export const initialDocuments = {
  licenseNumber: '',
  licenseExpiration: null,
  licensePhoto: null,
  soatExpiration: null,
  soatPhoto: null,
  technicalExpiration: null,
  technicalPhoto: null,
  mercadoPagoEmail: '',
  acceptedTerms: false,
};

export const initialDocumentErrors = {
  licenseNumber: '',
  licenseExpiration: '',
  licensePhoto: '',
  soatExpiration: '',
  soatPhoto: '',
  technicalExpiration: '',
  technicalPhoto: '',
  mercadoPagoEmail: '',
  acceptedTerms: '',
};

export const getDocumentErrors = (validationErrors) => ({
  ...initialDocumentErrors,
  ...validationErrors,
});
