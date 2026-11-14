import { useState } from 'react';
import { Modal, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles/app.styles';
import { colors } from '../themes/colors';

export function SelectInput({
  label,
  placeholder = 'Seleccionar opción',
  options,
  value,
  onChange,
}) {
  const [visible, setVisible] = useState(false);
  const [temporaryValue, setTemporaryValue] = useState(value ?? '');
  const selectedOption = options.find((option) => option.value === value);
  const openPicker = () => {
    setTemporaryValue(value ?? '');
    setVisible(true);
  };

  const picker = (
    <Picker selectedValue={temporaryValue} onValueChange={setTemporaryValue}>
      <Picker.Item label={placeholder} value="" />
      {options.map((option) => (
        <Picker.Item
          key={String(option.value)}
          label={option.label}
          value={option.value}
        />
      ))}
    </Picker>
  );

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dateInput}
        activeOpacity={0.8}
        onPress={openPicker}
      >
        <Text
          style={[
            styles.dateText,
            !selectedOption && { color: colors.textSecondary },
          ]}
        >
          {selectedOption?.label ?? placeholder}
        </Text>

        <Text style={styles.dateIcon}>⌄</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={() => setVisible(false)}
        >
          <View style={styles.selectOverlay}>
            <View style={styles.selectModal}>
              {picker}

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  onChange(temporaryValue);
                  setVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Listo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : (
        visible && (
          <View>
            {picker}
            <TouchableOpacity
              onPress={() => {
                onChange(temporaryValue);
                setVisible(false);
              }}
            >
              <Text>Listo</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </View>
  );
}
