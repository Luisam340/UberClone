import { Text, TouchableOpacity } from "react-native";
import { styles } from "../styles/app.styles";

export function PrimaryButton({ title, onPress }) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
