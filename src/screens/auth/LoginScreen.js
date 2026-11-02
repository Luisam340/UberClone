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
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { loginUser } from '../../services/authentication';
import { validateAuthentication } from '../../utils/authenticationValidators';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

      <PrimaryButton
        title="Iniciar sesión"
        onPress={() => {
          signIn(email, password);
        }}
      />

      <Text style={styles.helper}>
        El inicio de sesión estará disponible cuando integremos la
        autenticación.
      </Text>

      <TouchableOpacity>
        <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

async function signIn(email, password) {
  try {
    const user = await loginUser(email, password);
  } catch (error) {
    validateAuthentication(error);
  }
}
