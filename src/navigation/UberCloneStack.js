import { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';
import { AuthTabs } from '../screens/auth/AuthTabs';
import { DriverRegistrationScreen } from '../screens/register/DriverRegistrationScreen';
import { colors } from '../themes/colors';
import DriverDrawer from './DriverDrawer';

const Stack = createNativeStackNavigator();

// AI-assisted: see docs/AI_LOG.md #5.
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
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {user ? (
        <Stack.Screen name="Driver" component={DriverDrawer} />
      ) : (
        <>
          <Stack.Screen name="Autenticacion" component={AuthTabs} />

          <Stack.Screen
            name="RegisterDriver"
            component={DriverRegistrationScreen}
            options={{
              headerShown: true,
              title: 'Registro del conductor',
              headerBackTitle: 'Atrás',
              headerTintColor: colors.primary,
              headerStyle: {
                backgroundColor: colors.background,
              },
              headerShadowVisible: false,
              headerTitleStyle: {
                color: colors.text,
                fontWeight: '600',
              },
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
