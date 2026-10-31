import { ScrollView, View, Text } from 'react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { styles } from '../../styles/app.styles';

export function RegisterWelcomeScreen({ navigation }) {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.registerContent}
    >
      <View style={styles.illustration}>
        <Text style={styles.illustrationSymbol}>✦</Text>
        <Text style={styles.illustrationIcon}>✧</Text>
      </View>

      <Text style={styles.sectionTitle}>Crea tu cuenta de conductor</Text>

      <Text style={styles.description}>
        Regístrate y completa tu información para empezar en UberClone.
      </Text>

      <PrimaryButton
        title="Comenzar registro"
        onPress={() => navigation.navigate('RegistroConductor')}
      />
    </ScrollView>
  );
}
