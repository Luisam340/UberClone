import { useEffect, useRef, useState } from 'react';
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
import {
  vehicleCategories,
  vehicleColors,
  initialVehicle,
  initialVehicleErrors,
  getVehicleErrors,
} from '../../data/vehicle';
import { YearInput } from '../../components/DateInput';
import { ImageInput } from '../../components/ImageInput';
import { ValidationError } from '../../components/ValidationError';
import { validateVehicleData } from '../../utils/registrationValidators';

export function VehicleScreen({
  navigation,
  initialData = initialVehicle,
  vehicleYear,
  setVehicleYear,
  onChange,
  onSave,
}) {
  const [vehiclePhoto, setVehiclePhoto] = useState(initialData.vehiclePhoto);
  const [category, setCategory] = useState(initialData.category);
  const [licensePlate, setLicensePlate] = useState(initialData.licensePlate);
  const [brand, setBrand] = useState(initialData.brand);
  const [model, setModel] = useState(initialData.model);
  const [color, setColor] = useState(initialData.color);
  const [passengerCapacity, setPassengerCapacity] = useState(
    initialData.passengerCapacity,
  );

  const [errors, setErrors] = useState(initialVehicleErrors);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const vehicleData = {
      vehiclePhoto,
      category,
      licensePlate,
      brand,
      model,
      vehicleYear,
      color,
      passengerCapacity,
    };

    onChange(vehicleData);
  }, [
    vehiclePhoto,
    category,
    licensePlate,
    brand,
    model,
    vehicleYear,
    color,
    passengerCapacity,
    onChange,
  ]);

  const handleNext = () => {
    const vehicleData = {
      vehiclePhoto,
      category,
      licensePlate,
      brand,
      model,
      vehicleYear,
      color,
      passengerCapacity,
    };

    const validationErrors = validateVehicleData(vehicleData);

    setErrors(getVehicleErrors(validationErrors));

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    onSave(vehicleData);
    navigation.navigate('Documentos');
  };

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
          <ValidationError message={errors.vehiclePhoto} />

          <SelectInput
            label="Categoría del vehículo"
            value={category}
            onChange={setCategory}
            options={vehicleCategories}
          />
          <ValidationError message={errors.category} />

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
          <ValidationError message={errors.licensePlate} />

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
          <ValidationError message={errors.brand} />

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
          <ValidationError message={errors.model} />

          <YearInput
            label="Año"
            value={vehicleYear}
            onChange={setVehicleYear}
          />
          <ValidationError message={errors.vehicleYear} />

          <SelectInput
            label="Color del vehículo"
            value={color}
            onChange={setColor}
            options={vehicleColors}
          />
          <ValidationError message={errors.color} />

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
          <ValidationError message={errors.passengerCapacity} />

          <PrimaryButton title="Siguiente" onPress={handleNext} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
