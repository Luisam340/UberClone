import { Check } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import { colors } from '../themes/colors';

export function Checkbox({ label, value = false, onChange }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onChange(!value)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 7,
          borderWidth: 2,
          borderColor: colors.primary,
          backgroundColor: value ? colors.primary : colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {value && <Check size={17} color={colors.surface} strokeWidth={3} />}
      </View>

      <Text
        style={{
          flex: 1,
          fontSize: 14,
          color: colors.text,
          lineHeight: 21,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
