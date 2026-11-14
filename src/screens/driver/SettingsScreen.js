import { ScrollView, Text, View } from 'react-native';
import { Settings } from 'lucide-react-native';

import { colors } from '../../themes/colors';
import { styles } from '../../styles/app.styles';

export default function SettingsScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.settingsContent}
    >
      <View style={styles.settingsIconContainer}>
        <Settings size={26} color={colors.primary} />
      </View>
      <Text style={styles.settingsTitle}>Configuración</Text>
      <Text style={styles.settingsDescription}>
        Aquí podrás consultar las opciones de configuración del conductor cuando
        estén disponibles.
      </Text>
    </ScrollView>
  );
}
