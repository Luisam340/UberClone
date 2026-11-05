import { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import { AuthContext } from '../../context/AuthContext';
import { logoutUser } from '../../services/authentication';
import { styles } from '../../styles/app.styles';
import { PrimaryButton } from '../../components/PrimaryButton';

export function SettingsScreen() {
  const { user } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logoutUser();
    } catch (error) {
      //   Alert.alert(
      //     'Error',
      //     'No fue posible cerrar sesión. Inténtalo nuevamente.',
      //   );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mi perfil</Text>

      <View style={styles.card}>
        <Text style={styles.email}>{user?.name || 'No disponible'}</Text>
        <Text style={styles.label}>Correo electróndco</Text>
        <Text style={styles.email}>{user?.email || 'No disponible'}</Text>
      </View>

      <PrimaryButton
        title={isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
        onPress={handleLogout}
        disabled={isLoggingOut}
      />
    </View>
  );
}
