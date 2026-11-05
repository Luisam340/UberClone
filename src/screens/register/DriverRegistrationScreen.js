import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { PersonalDataScreen } from '../driver/PersonalDataScreen';
import { VehicleScreen } from '../driver/VehicleScreen';

import { DriverRegistrationProvider } from '../../context/DriverRegistrationContext';
import { DocumentsScreen } from '../driver/DocumentsScreen';

const Tabs = createMaterialTopTabNavigator();

export function DriverRegistrationScreen() {
  return (
    <DriverRegistrationProvider>
      <Tabs.Navigator>
        <Tabs.Screen
          name="Información Personal"
          component={PersonalDataScreen}
        />
        <Tabs.Screen name="Vehículo" component={VehicleScreen} />
        <Tabs.Screen name="Documentos" component={DocumentsScreen} />
      </Tabs.Navigator>
    </DriverRegistrationProvider>
  );
}
