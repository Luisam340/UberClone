import { Alert } from "react-native";

export function validateAuthentication(error) {
  switch (error.code) {
    case 'auth/invalid-email':
      Alert.alert('', 'El correo electrónico no es válido');
      break;

    case 'auth/invalid-credential':
      Alert.alert('', 'Correo o contraseña incorrectos');
      break;

    case 'auth/too-many-requests':
      Alert.alert(
        '',
        'Demasiados intentos para iniciar sesión. Intenta iniciar sesión más tarde',
      );
      break;

    case 'auth/network-request-failed':
      Alert.alert('', 'Comprueba tu conexión a internet');
      break;

    default:
      Alert.alert('', 'Ocurrió un problema al iniciar sesión');
  }
}
