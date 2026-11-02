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
  initialVehicleErrors,
  getVehicleErrors,
} from '../../data/vehicle';
import { YearInput } from '../../components/DateInput';
import { ImageInput } from '../../components/ImageInput';
import { ValidationError } from '../../components/ValidationError';
import { validateVehicleData } from '../../utils/registrationValidators';
import { useDriverRegistration } from '../../hooks/useDriverRegistration';

export function VehicleScreen({ navigation }) {
  const {
    vehicleData,
    vehicleYear,
    setVehicleYear,
    handleVehicleChange,
    handleVehicleSave,
  } = useDriverRegistration();

  const [vehiclePhoto, setVehiclePhoto] = useState(vehicleData.vehiclePhoto);
  const [category, setCategory] = useState(vehicleData.category);
  const [licensePlate, setLicensePlate] = useState(vehicleData.licensePlate);
  const [brand, setBrand] = useState(vehicleData.brand);
  const [model, setModel] = useState(vehicleData.model);
  const [color, setColor] = useState(vehicleData.color);
  const [passengerCapacity, setPassengerCapacity] = useState(
    vehicleData.passengerCapacity,
  );

  const [errors, setErrors] = useState(initialVehicleErrors);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    handleVehicleChange({
      vehiclePhoto,
      category,
      licensePlate,
      brand,
      model,
      vehicleYear,
      color,
      passengerCapacity,
    });
  }, [
    vehiclePhoto,
    category,
    licensePlate,
    brand,
    model,
    vehicleYear,
    color,
    passengerCapacity,
    handleVehicleChange,
  ]);

  const handleNext = () => {
    const data = {
      vehiclePhoto,
      category,
      licensePlate,
      brand,
      model,
      vehicleYear,
      color,
      passengerCapacity,
    };

    const validationErrors = validateVehicleData(data);

    setErrors(getVehicleErrors(validationErrors));

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    handleVehicleSave(data);
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
