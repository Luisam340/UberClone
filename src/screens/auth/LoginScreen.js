import { useState } from 'react';
import {
  ScrollView,
  TextInput,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import { styles } from '../../styles/app.styles';
import { colors } from '../../themes/colors';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ValidationError } from '../../components/ValidationError';

import { loginUser } from '../../services/authentication';
import {
  validateAuthentication,
  validateLoginData,
} from '../../utils/authenticationValidators';
import { authErrors, getAuthErrors } from '../../data/auth';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(authErrors);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    if (isSubmitting) {
      return;
    }

    const data = { email, password };

    const validationErrors = validateLoginData(data);

    setErrors(getAuthErrors(validationErrors));

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await loginUser(email, password);
    } catch (error) {
      const authenticationErrors = validateAuthentication(error);

      setErrors(getAuthErrors(authenticationErrors));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.formContent}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
    >
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

      <ValidationError message={errors.email || errors.invalidEmail} />

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
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </Text>
        </TouchableOpacity>
      </View>

      <ValidationError
        message={
          errors.password ||
          errors.invalidCredential ||
          errors.manyRequest ||
          errors.networkRequestFailed ||
          errors.defaultError
        }
      />

      <PrimaryButton
        title={isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
        onPress={handleSignIn}
        disabled={isSubmitting}
      />

      <TouchableOpacity>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
