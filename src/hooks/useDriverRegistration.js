import { useContext } from 'react';
import { DriverRegistrationContext } from '../context/DriverRegistrationContext';

export function useDriverRegistration() {
  const context = useContext(DriverRegistrationContext);

  if (!context || !context.handlePersonalSave) {
    throw new Error(
      'useDriverRegistration must be used within DriverRegistrationProvider',
    );
  }

  return context;
}
