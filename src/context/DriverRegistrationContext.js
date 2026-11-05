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
import { saveDriver } from '../services/driver';
import { uploadImage } from '../services/cloudinary';

export const DriverRegistrationContext = createContext(Object.create(null));

export function DriverRegistrationProvider({ children }) {
  const [personalData, setPersonalData] = useState(initialPersonalData);
  const [vehicleData, setVehicleData] = useState(initialVehicle);
  const [documentsData, setDocumentsData] = useState(initialDocuments);

  const [personalCompleted, setPersonalCompleted] = useState(false);
  const [vehicleCompleted, setVehicleCompleted] = useState(false);
  const [documentsCompleted, setDocumentsCompleted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const createdUserRef = useRef(null);

  const vehicleYear = vehicleData.vehicleYear;

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
      setDocumentsCompleted(false);

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
        return;
      }

      submittingRef.current = true;
      setIsSubmitting(true);
      setDocumentsCompleted(false);

      try {
        let user = createdUserRef.current;

        if (
          !user ||
          user.email?.toLowerCase() !== personalData.email.trim().toLowerCase()
        ) {
          user = await registerUser(personalData.email, personalData.password);

          createdUserRef.current = user;
        }

        const profileImage = await uploadImage(personalData.profilePhoto);
        const vehicleImage = await uploadImage(vehicleData.vehiclePhoto);
        const licenseImage = await uploadImage(data.licensePhoto);
        const soatImage = await uploadImage(data.soatPhoto);

        let technicalImage = null;

        if (data.technicalPhoto) {
          technicalImage = await uploadImage(data.technicalPhoto);
        }

        const {
          password,
          passwordRepeat,
          showPassword,
          showPasswordRepeat,
          ...safePersonalData
        } = personalData;

        const registration = {
          personal: {
            ...safePersonalData,
            profilePhotoUrl: profileImage.url,
            profilePhotoPublicId: profileImage.publicId,
          },
          vehicle: {
            ...vehicleData,
            vehiclePhotoUrl: vehicleImage.url,
            vehiclePhotoPublicId: vehicleImage.publicId,
          },
          documents: {
            ...data,
            licensePhotoUrl: licenseImage.url,
            licensePhotoPublicId: licenseImage.publicId,
            soatPhotoUrl: soatImage.url,
            soatPhotoPublicId: soatImage.publicId,
            technicalPhotoUrl: technicalImage?.url || null,
            technicalPhotoPublicId: technicalImage?.publicId || null,
          },
        };

        await saveDriver(user.uid, registration);

        setDocumentsCompleted(true);
      } catch (error) {
        setDocumentsCompleted(false);

        console.error(
          '[REGISTRATION] Registration failed:',
          error?.message || error,
        );
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
