import { Pressable, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HouseHeart,
  HandCoins,
  FileStack,
  User,
  Settings,
  Menu,
} from 'lucide-react-native';

import { colors } from '../themes/colors';
import { styles } from '../styles/app.styles';
import HomeScreen from '../screens/driver/HomeScreen';
import TripStageScreen from '../screens/driver/TripStageScreen';
import { TripFlowProvider } from '../context/TripFlowContext';
import HistoryScreen from '../screens/driver/HistoryScreen';
import EarningsScreen from '../screens/driver/EarningsScreen';
import TripHistoryDetailScreen from '../screens/driver/TripHistoryDetailScreen';
import ProfileScreen from '../screens/driver/ProfileScreen';
import SettingsScreen from '../screens/driver/SettingsScreen';

const Drawer = createDrawerNavigator();
const TripStack = createNativeStackNavigator();
const HistoryStack = createNativeStackNavigator();

function TripNavigator() {
  return (
    <TripFlowProvider>
      <View style={styles.screen}>
        <HomeScreen />
        <View pointerEvents="none" style={styles.tripFlowStackHost}>
          <TripStack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'none',
              gestureEnabled: false,
            }}
          >
            <TripStack.Screen name="TripHome" component={TripStageScreen} />
            <TripStack.Screen name="TripPickup" component={TripStageScreen} />
            <TripStack.Screen
              name="TripInProgress"
              component={TripStageScreen}
            />
            <TripStack.Screen name="TripPayment" component={TripStageScreen} />
          </TripStack.Navigator>
        </View>
      </View>
    </TripFlowProvider>
  );
}

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

const drawerItems = [
  { name: 'Inicio', component: TripNavigator, icon: HouseHeart },
  { name: 'Perfil', component: ProfileScreen, icon: User },
  { name: 'Historial', component: HistoryNavigator, icon: FileStack },
  { name: 'Ganancias', component: EarningsScreen, icon: HandCoins },
  { name: 'Configuración', component: SettingsScreen, icon: Settings },
];

export default function DriverDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Inicio"
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        sceneStyle: styles.drawerScene,
        headerLeft: () => (
          <Pressable
            onPress={() => navigation.openDrawer()}
            accessibilityRole="button"
            accessibilityLabel="Abrir menú"
            hitSlop={12}
            style={styles.drawerMenuButton}
          >
            <Menu size={24} color={colors.primary} />
          </Pressable>
        ),
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: colors.lavender,
        drawerStyle: styles.drawerPanel,
        drawerLabelStyle: styles.drawerLabel,
      })}
    >
      {drawerItems.map(({ name, component, icon: Icon }) => (
        <Drawer.Screen
          key={name}
          name={name}
          component={component}
          options={{
            drawerIcon: ({ color, size }) => <Icon color={color} size={size} />,
          }}
        />
      ))}
    </Drawer.Navigator>
  );
}
