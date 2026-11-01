import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthTabs } from '../screens/auth/AuthTabs';
import { DriverRegistrationScreen } from '../screens/register/DriverRegistrationScreen';
import { PersonalDataScreen } from '../screens/driver/PersonalDataScreen';
import { VehicleScreen } from '../screens/driver/VehicleScreen';
import { DocumentsScreen } from '../screens/driver/DocumentsScreen';

export default function UberCloneStack() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator id="AuthTabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Autenticacion" component={AuthTabs} />
      <Stack.Screen
        name="RegisterDriver"
        component={DriverRegistrationScreen}
      />
      <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
      <Stack.Screen name="VehicleData" component={VehicleScreen} />
      <Stack.Screen name="DocumentData" component={DocumentsScreen} />
    </Stack.Navigator>
  );
}
