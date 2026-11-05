import { createContext, useCallback, useRef, useState } from 'react';

import { initialPersonalData } from '../data/personal';
import { initialVehicle } from '../data/vehicle';
import { initialDocuments } from '../data/document';

import {
  validatePersonalData,
  validateVehicleData,
  validateDocuments,
} from '../utils/registrationValidators';

import { registerUser } from '../services/register';

export const DriverRegistrationContext = createContext(null);

export function DriverRegistrationProvider({ children }) {
  const [personalData, setPersonalData] = useState(initialPersonalData);
  const [vehicleData, setVehicleData] = useState(initialVehicle);
  const [documentsData, setDocumentsData] = useState(initialDocuments);

  const [personalCompleted, setPersonalCompleted] = useState(false);
  const [vehicleCompleted, setVehicleCompleted] = useState(false);
  const [documentsCompleted, setDocumentsCompleted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  // El año del vehículo se obtiene del mismo objeto vehicleData.
  const vehicleYear = vehicleData.vehicleYear;

  // Se conserva para mantener compatibilidad con VehicleScreen.
  const setVehicleYear = useCallback((year) => {
    setVehicleData((previousData) => ({
      ...previousData,
      vehicleYear: year,
    }));

    setVehicleCompleted(false);
    setDocumentsCompleted(false);
  }, []);

  const handlePersonalChange = useCallback((data) => {
    setPersonalData(data);
    setPersonalCompleted(false);
    setDocumentsCompleted(false);
  }, []);

  const handlePersonalSave = useCallback((data) => {
    const validationErrors = validatePersonalData(data);
    const isValid = !Object.values(validationErrors).some(Boolean);

    setPersonalData(data);
    setPersonalCompleted(isValid);

    if (!isValid) {
      setDocumentsCompleted(false);
    }

    return isValid;
  }, []);

  const handleVehicleChange = useCallback((data) => {
    setVehicleData((previousData) => ({
      ...previousData,
      ...data,
    }));

    setVehicleCompleted(false);
    setDocumentsCompleted(false);
  }, []);

  const handleVehicleSave = useCallback(
    (data) => {
      const updatedData = {
        ...vehicleData,
        ...data,
      };

      const validationErrors = validateVehicleData(updatedData);
      const isValid = !Object.values(validationErrors).some(Boolean);

      setVehicleData(updatedData);
      setVehicleCompleted(isValid);

      if (!isValid) {
        setDocumentsCompleted(false);
      }

      return isValid;
    },
    [vehicleData],
  );

  const handleDocumentsChange = useCallback((data) => {
    setDocumentsData(data);
    setDocumentsCompleted(false);
  }, []);

  const handleDocumentsSave = useCallback(
    async (data) => {
      if (submittingRef.current) {
        return;
      }

      const personalErrors = validatePersonalData(personalData);
      const vehicleErrors = validateVehicleData(vehicleData);
      const documentErrors = validateDocuments(data, vehicleData.vehicleYear);

      const isPersonalValid = !Object.values(personalErrors).some(Boolean);

      const isVehicleValid = !Object.values(vehicleErrors).some(Boolean);

      const isDocumentsValid = !Object.values(documentErrors).some(Boolean);

      setDocumentsData(data);

      if (
        !personalCompleted ||
        !vehicleCompleted ||
        !isPersonalValid ||
        !isVehicleValid ||
        !isDocumentsValid
      ) {
        setDocumentsCompleted(false);

        console.warn(
          '[REGISTRATION] Registration blocked: incomplete or invalid data.',
        );

        return;
      }

      submittingRef.current = true;
      setIsSubmitting(true);

      try {
        const user = await registerUser(
          personalData.email,
          personalData.password,
        );

        const {
          password,
          passwordRepeat,
          showPassword,
          showPasswordRepeat,
          ...safePersonalData
        } = personalData;

        const registration = {
          uid: user.uid,
          personal: safePersonalData,
          vehicle: vehicleData,
          documents: data,
        };

        // Pendiente: guardar registration en Firestore.
        // Por ahora únicamente se crea el usuario en Firebase Authentication.
        void registration;

        setDocumentsCompleted(true);

        console.log('[AUTH] User created:', user.uid);

        console.log('[REGISTRATION] Ready for Firestore');
      } catch (error) {
        setDocumentsCompleted(false);

        if (error !== null && typeof error === 'object' && 'code' in error) {
          console.error('[AUTH] Registration failed:', error.code);
        } else {
          console.error('[AUTH] Registration failed');
        }
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [personalCompleted, vehicleCompleted, personalData, vehicleData],
  );

  return (
    <DriverRegistrationContext.Provider
      value={{
        personalData,
        vehicleData,
        documentsData,
        vehicleYear,
        setVehicleYear,
        personalCompleted,
        vehicleCompleted,
        documentsCompleted,
        isSubmitting,
        handlePersonalChange,
        handlePersonalSave,
        handleVehicleChange,
        handleVehicleSave,
        handleDocumentsChange,
        handleDocumentsSave,
      }}
    >
      {children}
    </DriverRegistrationContext.Provider>
  );
}
