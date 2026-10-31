import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './src/styles/app.styles';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { PrimaryButton } from './src/components/PrimaryButton';
import { DriverRegistrationScreen } from './src/screens/register/DriverRegistrationScreen';
import { AuthTabs } from './src/screens/auth/AuthTabs';


const Stack = createNativeStackNavigator();



export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="dark" />

        <NavigationContainer>
          <Stack.Navigator id="AuthTabs" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Autenticacion" component={AuthTabs} />
            <Stack.Screen
              name="RegistroConductor"
              component={DriverRegistrationScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
