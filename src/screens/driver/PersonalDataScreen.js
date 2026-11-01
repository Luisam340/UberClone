import { useState } from 'react';
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

export function PersonalDataScreen({ navigation }) {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [error, setError] = useState(true);

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

          <DateInput
            label="Fecha de nacimiento"
            value={birthDate}
            onChange={setBirthDate}
          />

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

          <PrimaryButton
            title="Siguiente"
            onPress={() => navigation.navigate('VehicleData')}
            //disabled={error}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
