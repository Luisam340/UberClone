import { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { colors } from '../themes/colors';
import { styles } from '../styles/app.styles';

export function ImageInput({ label, value, onChange, disabled = false }) {
  const [loading, setLoading] = useState(false);

  // AI-assisted: see docs/AI_LOG.md #9.
  // AI-assisted: see docs/AI_LOG.md #10.
  const checkCameraPermission = async () => {
    let permission = await ImagePicker.getCameraPermissionsAsync();

    if (permission.granted) {
      return true;
    }

    if (!permission.canAskAgain) {
      Alert.alert(
        'Permiso de cámara bloqueado',
        'Debes habilitar el acceso a la cámara desde la configuración de tu iPhone.',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Abrir configuración',
            onPress: () => Linking.openSettings(),
          },
        ],
      );

      return false;
    }

    permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permiso necesario',
        'Debes permitir el acceso a la cámara para tomar fotografías.',
      );

      return false;
    }

    return true;
  };

  const selectImage = async (source) => {
    if (loading || disabled) return;
    try {
      setLoading(true);

      let result;
      if (source === 'camera') {
        const hasPermission = await checkCameraPermission();

        if (!hasPermission) {
          return;
        }

        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.8,
        });
      }

      if (result.canceled) {
        return;
      }

      if (result.assets?.length > 0) {
        const imageUri = result.assets[0].uri;

        onChange(imageUri);
      }
    } catch (error) {
      Alert.alert('Error', 'No fue posible seleccionar la imagen.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = () => {
    if (loading || disabled) return;

    Alert.alert(label, '¿De dónde quieres obtener la imagen?', [
      {
        text: 'Cámara',
        onPress: () => selectImage('camera'),
      },
      {
        text: 'Galería',
        onPress: () => selectImage('gallery'),
      },
      {
        text: 'Cancelar',
        style: 'cancel',
      },
    ]);
  };

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={{
          backgroundColor: colors.mint,
          borderRadius: 24,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 16,
          opacity: loading || disabled ? 0.5 : 1,
        }}
        activeOpacity={0.8}
        onPress={handleSelectImage}
        disabled={loading || disabled}
        accessibilityRole="button"
        accessibilityLabel={value ? `Cambiar ${label}` : `Seleccionar ${label}`}
        accessibilityState={{
          disabled: loading || disabled,
        }}
      >
        {value ? (
          <Image
            source={{ uri: value }}
            style={{
              width: 65,
              height: 65,
              borderRadius: 12,
            }}
            resizeMode="cover"
          />
        ) : (
          <Camera size={38} color={colors.primary} strokeWidth={2} />
        )}

        <View style={{ flex: 1, gap: 6 }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 18,
              fontWeight: '600',
            }}
          >
            {loading
              ? 'Cargando imagen...'
              : value
                ? 'Imagen seleccionada'
                : 'Seleccionar imagen'}
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
            }}
          >
            {value ? 'Cambiar foto' : 'Tomar foto o elegir de la galería'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
