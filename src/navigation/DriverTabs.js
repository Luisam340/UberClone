import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { iconsTabs } from '../data/icons';
import { colors } from '../themes/colors';
import HomeScreen from '../screens/driver/HomeScreen';
import ProfileScreen from '../screens/driver/PrifileScreen';

const Tab = createBottomTabNavigator();

export default function DriverTabs() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => {
        const tab = iconsTabs.find(
          (item) => item.key === route.name,
        );

        const Icon = tab?.icon;

        return {
          headerShown: false,

          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,

          tabBarIcon: ({ color, focused }) =>
            Icon ? (
              <Icon
                size={22}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            ) : null,

          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },

          tabBarLabelStyle: {
            fontSize: 12,
          },
        };
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />

      {/* <Tab.Screen
        name="earnings"
        component={EarningsScreen}
        options={{ title: 'Ganancias' }}
      />

      <Tab.Screen
        name="history"
        component={HistoryScreen}
        options={{ title: 'Historial' }}
      />
*/}
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      /> 
    </Tab.Navigator>
  );
}