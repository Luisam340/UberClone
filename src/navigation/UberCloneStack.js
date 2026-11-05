import { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';
import { AuthTabs } from '../screens/auth/AuthTabs';
import { DriverRegistrationScreen } from '../screens/register/DriverRegistrationScreen';
import HomeScreen from '../screens/driver/HomeScreen';
import { colors } from '../themes/colors';
import DriverTabs from './DriverTabs';

const Stack = createNativeStackNavigator();

export default function UberCloneStack() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Driver" component={DriverTabs} />
      ) : (
        <>
          <Stack.Screen name="Autenticacion" component={AuthTabs} />
          <Stack.Screen
            name="RegisterDriver"
            component={DriverRegistrationScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
