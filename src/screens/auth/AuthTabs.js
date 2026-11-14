import { useState } from 'react';
import {
  View,
  Image,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles } from '../../styles/app.styles';
import { colors } from '../../themes/colors';
import { LoginScreen } from './LoginScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RegisterWelcomeScreen } from '../register/RegisterWelcomeScreen';

const Tabs = createMaterialTopTabNavigator();

// AI-assisted: see docs/AI_LOG.md #6.
export function AuthTabs({ navigation }) {
  // @ts-ignore
  const logo = require('../../../assets/uber-clone.png');

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />

          <Text style={styles.welcome}>Bienvenido a UberClone</Text>

          <Text style={styles.subtitle}>
            Inicia sesión o regístrate para comenzar a conducir.
          </Text>
        </View>

        <Tabs.Navigator
          id="AuthTabs"
          screenOptions={{
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarLabelStyle: {
              // fontFamily: 'Fredoka_700Bold',
              fontSize: 13,
              textTransform: 'none',
            },
            tabBarStyle: {
              backgroundColor: colors.lavender,
              marginHorizontal: 20,
              borderRadius: 18,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarIndicatorStyle: {
              backgroundColor: colors.primary,
              height: 3,
              borderRadius: 3,
            },
            swipeEnabled: true,
          }}
        >
          <Tabs.Screen name="Iniciar sesión">
            {() => <LoginScreen />}
          </Tabs.Screen>

          <Tabs.Screen name="Registrarse">
            {() => <RegisterWelcomeScreen navigation={navigation} />}
          </Tabs.Screen>
        </Tabs.Navigator>
      </View>
    </KeyboardAvoidingView>
  );
}
