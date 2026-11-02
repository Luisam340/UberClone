import { createContext, useCallback, useEffect, useRef, useState } from 'react';

import { initialPersonalData } from '../data/personal';
import { initialVehicle } from '../data/vehicle';
import { initialDocuments } from '../data/document';
import { registerUser } from '../services/register';

export const DriverRegistrationContext = createContext(Object.create(null));

export function DriverRegistrationProvider({ children }) {
  const [vehicleYear, setVehicleYear] = useState(null);

  const [personalData, setPersonalData] = useState(initialPersonalData);
  const [vehicleData, setVehicleData] = useState(initialVehicle);
  const [documentsData, setDocumentsData] = useState(initialDocuments);

  const [personalCompleted, setPersonalCompleted] = useState(false);
  const [vehicleCompleted, setVehicleCompleted] = useState(false);
  const [documentsCompleted, setDocumentsCompleted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const handlePersonalChange = useCallback((data) => {
    setPersonalData(data);
    setPersonalCompleted(false);
    setDocumentsCompleted(false);
  }, []);

  const handlePersonalSave = useCallback((data) => {
    setPersonalData(data);
    setPersonalCompleted(true);
  }, []);

  const handleVehicleChange = useCallback((data) => {
    setVehicleData(data);
    setVehicleCompleted(false);
    setDocumentsCompleted(false);
  }, []);

  const handleVehicleSave = useCallback((data) => {
    setVehicleData(data);
    setVehicleCompleted(true);
  }, []);

  const handleDocumentsChange = useCallback((data) => {
    setDocumentsData(data);
    setDocumentsCompleted(false);
  }, []);

  const handleDocumentsSave = useCallback(
    async (data) => {
      if (submittingRef.current) {
        return;
      }

      setDocumentsData(data);

      if (!personalCompleted || !vehicleCompleted) {
        setDocumentsCompleted(false);
        console.log('[REGISTRATION] Previous steps are incomplete');
        return;
      }

      submittingRef.current = true;
      setIsSubmitting(true);

      try {
        const user = await registerUser(
          personalData.email,
          personalData.password,
        );

        setDocumentsCompleted(true);

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

        console.log('[AUTH] User created:', user.uid);
        console.log('[REGISTRATION] Ready for Firestore');

        // registration se utilizará en el servicio de Firestore.
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

  useEffect(() => {
    console.log('[REGISTRATION] Personal saved:', personalCompleted);
    console.log('[REGISTRATION] Vehicle saved:', vehicleCompleted);
    console.log('[REGISTRATION] Documents saved:', documentsCompleted);
  }, [personalCompleted, vehicleCompleted, documentsCompleted]);

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
