import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { DocumentsScreen } from './DocumentsScreen';
import { PersonalDataScreen } from './PersonalDataScreen';
import { VehicleScreen } from './VehicleScreen';

import { DriverRegistrationProvider } from '../../context/DriverRegistrationContext';

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
