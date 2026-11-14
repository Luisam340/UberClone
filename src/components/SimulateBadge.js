import { View, Text } from "react-native";
import { styles } from "../styles/app.styles";

export function SimulatedBadge({ label = 'SIMULADO' }) {
  return (
    <View style={styles.simBadge}>
      <Text style={styles.simText}>{label}</Text>
    </View>
  );
}
