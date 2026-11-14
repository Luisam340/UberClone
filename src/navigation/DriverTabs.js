import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { iconsTabs } from '../data/icons';
import { colors } from '../themes/colors';
import HomeScreen from '../screens/driver/HomeScreen';
import HistoryScreen from '../screens/driver/HistoryScreen';
import EarningsScreen from '../screens/driver/EarningsScreen';
import TripHistoryDetailScreen from '../screens/driver/TripHistoryDetailScreen';
import ProfileScreen from '../screens/driver/ProfileScreen';

const Tab = createBottomTabNavigator();
const HistoryStack = createNativeStackNavigator();

// AI-assisted: see docs/AI_LOG.md #15.
function HistoryNavigator() {
  return (
    <HistoryStack.Navigator
      screenOptions={{
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
      }}
    >
      <HistoryStack.Screen
        name="HistoryList"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
      <HistoryStack.Screen
        name="TripHistoryDetail"
        component={TripHistoryDetailScreen}
        options={{ title: 'Detalle de carrera' }}
      />
    </HistoryStack.Navigator>
  );
}

export default function DriverTabs() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => {
        const tab = iconsTabs.find((item) => item.key === route.name);
        const Icon = tab?.icon;

        return {
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarIcon: ({ color, focused }) =>
            Icon ? <Icon size={22} color={color} strokeWidth={focused ? 2.5 : 2} /> : null,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          tabBarLabelStyle: { fontSize: 12 },
        };
      }}
    >
      <Tab.Screen name="home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="earnings" component={EarningsScreen} options={{ title: 'Ganancias' }} />
      <Tab.Screen name="history" component={HistoryNavigator} options={{ title: 'Historial' }} />
      <Tab.Screen name="profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
