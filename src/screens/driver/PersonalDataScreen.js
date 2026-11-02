import { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Text,
} from 'react-native';

import { styles } from '../../styles/app.styles';
import { colors } from '../../themes/colors';
import { PrimaryButton } from '../../components/PrimaryButton';
import { DateInput } from '../../components/DateInput';
import { SelectInput } from '../../components/SelectInput';
import { Eye, EyeOff } from 'lucide-react-native';
import { ImageInput } from '../../components/ImageInput';
import { ValidationError } from '../../components/ValidationError';
import { validatePersonalData } from '../../utils/registrationValidators';
import { initialPersonalErrors, getPersonalErrors } from '../../data/personal';
import { useDriverRegistration } from '../../hooks/useDriverRegistration';

export function PersonalDataScreen({ navigation }) {
  const { personalData, handlePersonalChange, handlePersonalSave } =
    useDriverRegistration();

  const [profilePhoto, setProfilePhoto] = useState(personalData.profilePhoto);
  const [name, setName] = useState(personalData.name);
  const [idNumber, setIdNumber] = useState(personalData.idNumber);
  const [phoneNumber, setPhoneNumber] = useState(personalData.phoneNumber);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [email, setEmail] = useState(personalData.email);
  const [gender, setGender] = useState(personalData.gender);
  const [password, setPassword] = useState(personalData.password);
  const [passwordRepeat, setPasswordRepeat] = useState(
    personalData.passwordRepeat,
  );
  const [birthDate, setBirthDate] = useState(personalData.birthDate);

  const [errors, setErrors] = useState(initialPersonalErrors);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    handlePersonalChange({
      profilePhoto,
      name,
      idNumber,
      phoneNumber,
      birthDate,
      gender,
      email,
      password,
      passwordRepeat,
    });
  }, [
    profilePhoto,
    name,
    idNumber,
    phoneNumber,
    birthDate,
    gender,
    email,
    password,
    passwordRepeat,
    handlePersonalChange,
  ]);

  const handleNext = () => {
    const data = {
      profilePhoto,
      name,
      idNumber,
      phoneNumber,
      birthDate,
      gender,
      email,
      password,
      passwordRepeat,
    };

    const validationErrors = validatePersonalData(data);

    setErrors(getPersonalErrors(validationErrors));

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    handlePersonalSave(data);
    navigation.navigate('Vehículo');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Regístrate en UberClone</Text>
        <Text style={styles.subtitle}>Ingresa tus datos personales.</Text>
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
            label="Foto de perfil"
            value={profilePhoto}
            onChange={setProfilePhoto}
          />
          <ValidationError message={errors.profilePhoto} />

          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu nombre"
            placeholderTextColor={colors.textSecondary}
            keyboardType="default"
            autoCapitalize="words"
            maxLength={50}
            value={name}
            onChangeText={setName}
          />
          <ValidationError message={errors.name} />

          <Text style={styles.label}>Documento de identidad</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu número de documento"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
            maxLength={10}
            value={idNumber}
            onChangeText={setIdNumber}
          />
          <ValidationError message={errors.idNumber} />

          <Text style={styles.label}>Número de teléfono</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu número de teléfono"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            maxLength={10}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <ValidationError message={errors.phoneNumber} />

          <DateInput
            label="Fecha de nacimiento"
            value={birthDate}
            onChange={setBirthDate}
          />
          <ValidationError message={errors.birthDate} />

          <SelectInput
            label="Género"
            placeholder="Seleccionar género"
            value={gender}
            onChange={setGender}
            options={[
              { label: 'Femenino', value: 'F' },
              { label: 'Masculino', value: 'M' },
              { label: 'Otro', value: 'O' },
              { label: 'Prefiero no indicar', value: 'N' },
            ]}
          />
          <ValidationError message={errors.gender} />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="tucorreo@ejemplo.com"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            value={email}
            onChangeText={setEmail}
          />
          <ValidationError message={errors.email} />

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPassword}
              autoComplete="password"
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showPassword}>
                {showPassword ? (
                  <EyeOff size={22} color={colors.primary} strokeWidth={2} />
                ) : (
                  <Eye size={22} color={colors.primary} strokeWidth={2} />
                )}
              </Text>
            </TouchableOpacity>
          </View>
          <ValidationError message={errors.password} />

          <Text style={styles.label}>Repetir contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry={!showPasswordRepeat}
              autoComplete="password"
              value={passwordRepeat}
              onChangeText={setPasswordRepeat}
            />

            <TouchableOpacity
              onPress={() => setShowPasswordRepeat(!showPasswordRepeat)}
            >
              <Text style={styles.showPassword}>
                {showPasswordRepeat ? (
                  <EyeOff size={22} color={colors.primary} strokeWidth={2} />
                ) : (
                  <Eye size={22} color={colors.primary} strokeWidth={2} />
                )}
              </Text>
            </TouchableOpacity>
          </View>
          <ValidationError message={errors.passwordRepeat} />

          <PrimaryButton title="Siguiente" onPress={handleNext} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
