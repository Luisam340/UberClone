import { use, useState } from 'react';
import {
  Platform,
  ScrollView,
  TextInput,
  View,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import { styles } from '../../styles/app.styles';
import { colors } from '../../themes/colors';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SelectInput } from '../../components/SelectInput';
import { vehicleCategories, vehicleColors } from '../../data/vehicle';
import { DateInput, YearInput } from '../../components/DateInput';
import { ImageInput } from '../../components/ImageInput';

export function VehicleScreen({ navigation }) {
  const [vehiclePhoto, setVehiclePhoto] = useState(null);
  const [category, setCategory] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(null);
  const [color, setColor] = useState(null);
  const [passengerCapacity, setPassengerCapacity] = useState('');
  const [error, setError] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Regístrate en UberClone</Text>
        <Text style={styles.subtitle}>
          Ingresa la información de tu vehículo.
        </Text>
      </View>

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <ImageInput
            label="Foto del vehículo"
            value={vehiclePhoto}
            onChange={setVehiclePhoto}
          />
          <SelectInput
            label="Categoría del vehículo"
            value={category}
            onChange={setCategory}
            options={vehicleCategories}
          />

          <Text style={styles.label}>Placa</Text>
          <TextInput
            style={styles.input}
            placeholder="ABC321"
            placeholderTextColor={colors.textSecondary}
            keyboardType="default"
            autoCapitalize="characters"
            maxLength={6}
            value={licensePlate}
            onChangeText={(text) => setLicensePlate(text.toUpperCase())}
          />

          <Text style={styles.label}>Marca</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa la marca"
            placeholderTextColor={colors.textSecondary}
            keyboardType="default"
            autoCapitalize="words"
            value={brand}
            onChangeText={setBrand}
          />

          <Text style={styles.label}>Modelo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa el modelo"
            placeholderTextColor={colors.textSecondary}
            keyboardType="default"
            autoCapitalize="words"
            value={model}
            onChangeText={setModel}
          />

          <YearInput label="Año" value={year} onChange={setYear} />

          <SelectInput
            label="Color del vehículo"
            value={color}
            onChange={setColor}
            options={vehicleColors}
          />

          <Text style={styles.label}>Capacidad de pasajeros</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa la cantidad de pasajeros"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            autoCapitalize="words"
            maxLength={1}
            value={passengerCapacity}
            onChangeText={setPassengerCapacity}
          />

          <PrimaryButton
            title="Siguiente"
            onPress={() => navigation.navigate('DocumentData')}
            //disabled={error}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
