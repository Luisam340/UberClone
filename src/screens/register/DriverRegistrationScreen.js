import { useCallback, useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { DocumentsScreen } from '../driver/DocumentsScreen';
import { PersonalDataScreen } from '../driver/PersonalDataScreen';
import { VehicleScreen } from '../driver/VehicleScreen';

import { initialPersonalData } from '../../data/personal';
import { initialVehicle } from '../../data/vehicle';
import { initialDocuments } from '../../data/document';

const Tabs = createMaterialTopTabNavigator();

export function DriverRegistrationScreen({ navigation }) {
  const [vehicleYear, setVehicleYear] = useState(null);

  const [personalData, setPersonalData] = useState(initialPersonalData);
  const [vehicleData, setVehicleData] = useState(initialVehicle);
  const [documentsData, setDocumentsData] = useState(initialDocuments);

  const [personalCompleted, setPersonalCompleted] = useState(false);
  const [vehicleCompleted, setVehicleCompleted] = useState(false);
  const [documentsCompleted, setDocumentsCompleted] = useState(false);

  const handlePersonalChange = useCallback((data) => {
    setPersonalData(data);
    setPersonalCompleted(false);
  }, []);

  const handlePersonalSave = useCallback((data) => {
    setPersonalData(data);
    setPersonalCompleted(true);
  }, []);

  const handleVehicleChange = useCallback((data) => {
    setVehicleData(data);
    setVehicleCompleted(false);
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
    (data) => {
      setDocumentsData(data);

      if (!personalCompleted || !vehicleCompleted) {
        setDocumentsCompleted(false);
        return;
      }

      setDocumentsCompleted(true);

      const registration = {
        personal: personalData,
        vehicle: vehicleData,
        documents: data,
      };
      // Aquí usaré registration
    },
    [personalCompleted, vehicleCompleted, personalData, vehicleData],
  );
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Información Personal">
        {(props) => (
          <PersonalDataScreen
            {...props}
            initialData={personalData}
            onChange={handlePersonalChange}
            onSave={handlePersonalSave}
          />
        )}
      </Tabs.Screen>

      <Tabs.Screen name="Vehículo">
        {(props) => (
          <VehicleScreen
            {...props}
            initialData={vehicleData}
            vehicleYear={vehicleYear}
            setVehicleYear={setVehicleYear}
            onChange={handleVehicleChange}
            onSave={handleVehicleSave}
          />
        )}
      </Tabs.Screen>

      <Tabs.Screen name="Documentos">
        {(props) => (
          <DocumentsScreen
            {...props}
            initialData={documentsData}
            vehicleYear={vehicleYear}
            onChange={handleDocumentsChange}
            onSave={handleDocumentsSave}
          />
        )}
      </Tabs.Screen>
    </Tabs.Navigator>
  );
}
