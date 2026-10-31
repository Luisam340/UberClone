import { View, Text } from "react-native";
import { PrimaryButton } from "../../components/PrimaryButton";
import { styles } from "../../styles/app.styles";

export function DriverRegistrationScreen({ navigation }) {
  return (
    <View style={styles.placeholderScreen}>
      <Text style={styles.sectionTitle}>Registro del conductor</Text>

      <Text style={styles.description}>
        Aquí construiremos las pestañas de Datos personales, Vehículo y
        Documentos y pagos.
      </Text>

      <PrimaryButton title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
}