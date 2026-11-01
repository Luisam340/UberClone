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
import {
  initialPersonalData,
  initialPersonalErrors,
  getPersonalErrors,
} from '../../data/personal';

export function PersonalDataScreen({
  navigation,
  initialData = initialPersonalData,
  onChange,
  onSave,
}) {
  const [profilePhoto, setProfilePhoto] = useState(initialData.profilePhoto);
  const [name, setName] = useState(initialData.name);
  const [idNumber, setIdNumber] = useState(initialData.idNumber);
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber);
  const [showPassword, setShowPassword] = useState(initialData.showPassword);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(
    initialData.showPasswordRepeat,
  );
  const [email, setEmail] = useState(initialData.email);
  const [gender, setGender] = useState(initialData.gender);
  const [password, setPassword] = useState(initialData.password);
  const [passwordRepeat, setPasswordRepeat] = useState(
    initialData.passwordRepeat,
  );
  const [birthDate, setBirthDate] = useState(initialData.birthDate);

  const [errors, setErrors] = useState(initialPersonalErrors);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const personalData = {
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

    onChange(personalData);
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
    onChange,
  ]);

  const handleNext = () => {
    const personalData = {
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

    const validationErrors = validatePersonalData(personalData);

    setErrors(getPersonalErrors(validationErrors));

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    onSave(personalData);
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
            autoCapitalize="words"
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
            autoCapitalize="words"
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
