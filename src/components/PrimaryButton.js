import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/app.styles';

export function PrimaryButton({ title, onPress, disabled = false }) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}
