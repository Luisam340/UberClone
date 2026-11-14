import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { CalendarDays } from 'lucide-react-native';
import { colors } from '../themes/colors';
import { styles } from '../styles/app.styles';

export function ExpirationDateInput({ label, value, onChange }) {
  const [visible, setVisible] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dateInput}
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text
          style={[styles.dateText, !value && { color: colors.textSecondary }]}
        >
          {value ? value.toLocaleDateString('es-CO') : 'Seleccionar fecha'}
        </Text>

        <CalendarDays size={22} color={colors.primary} strokeWidth={2} />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        display="inline"
        locale="es-CO"
        date={value instanceof Date && value >= tomorrow ? value : tomorrow}
        minimumDate={tomorrow}
        onConfirm={(date) => {
          setVisible(false);
          onChange(date);
        }}
        onCancel={() => setVisible(false)}
      />
    </View>
  );
}
