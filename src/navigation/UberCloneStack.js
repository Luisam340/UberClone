import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthTabs } from '../screens/auth/AuthTabs';
import { DriverRegistrationScreen } from '../screens/register/DriverRegistrationScreen';

const Stack = createNativeStackNavigator();

export default function UberCloneStack() {
  return (
    <Stack.Navigator id="AuthTabs" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Autenticacion" component={AuthTabs} />

      <Stack.Screen
        name="RegisterDriver"
        component={DriverRegistrationScreen}
      />
    </Stack.Navigator>
  );
}
