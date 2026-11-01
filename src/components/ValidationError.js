import { Text } from 'react-native';
import { colors } from '../themes/colors';

export function ValidationError({ message }) {
  if (!message) return null;

  return (
    <Text
      accessibilityRole="alert"
      style={{
        color: colors.error,
        fontSize: 12,
        marginTop: 5,
        marginBottom: 5,
      }}
    >
      {message}
    </Text>
  );
}
