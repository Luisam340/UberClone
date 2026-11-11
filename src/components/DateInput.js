import { useState } from 'react';
import {
  FlatList,
  LogBox,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { CalendarDays } from 'lucide-react-native';
import { colors } from '../themes/colors';
import { styles } from '../styles/app.styles';

LogBox.ignoreLogs(['DateTimePicker: `onChange` is deprecated.']);

export function DateInput({ label, value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dateInput}
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
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
        date={value ?? new Date(2000, 0, 1)}
        maximumDate={new Date()}
        onConfirm={(date) => {
          setVisible(false);
          onChange(date);
        }}
        onCancel={() => setVisible(false)}
      />
    </View>
  );
}

export function YearInput({ label, value, onChange }) {
  const [visible, setVisible] = useState(false);

  const currentYear = new Date().getFullYear();
  const maxVehicleYear = currentYear + 1;

  const years = Array.from(
    { length: 50 },
    (_, index) => maxVehicleYear - index,
  );

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dateInput}
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
      >
        <Text
          style={[
            styles.dateText,
            (value === null || value === undefined) && {
              color: colors.textSecondary,
            },
          ]}
        >
          {value ?? 'Seleccionar año'}
        </Text>

        <CalendarDays size={22} color={colors.primary} strokeWidth={2} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: 24,
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 20,
              maxHeight: 400,
            }}
          >
            <Text
              style={[
                styles.label,
                {
                  textAlign: 'center',
                  marginBottom: 16,
                },
              ]}
            >
              Seleccionar año
            </Text>

            <FlatList
              data={years}
              keyExtractor={(item) => String(item)}
              initialNumToRender={15}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onChange(item);
                    setVisible(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    alignItems: 'center',
                    borderRadius: 8,
                    backgroundColor:
                      value === item ? colors.lavender : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: value === item ? colors.primary : colors.text,
                      fontSize: 17,
                      fontWeight: value === item ? '700' : '400',
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={{
                alignItems: 'center',
                paddingTop: 16,
              }}
            >
              <Text style={{ color: colors.primary }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
