import { useState } from 'react';
import { ScrollView, Switch, Text, TextInput, View } from 'react-native';

import { DateInput } from '../../components/DateInput';
import { ImageInput } from '../../components/ImageInput';
import { PrimaryButton } from '../../components/PrimaryButton';

import { colors } from '../../themes/colors';
import { styles } from '../../styles/app.styles';

export function DocumentsScreen() {
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiration, setLicenseExpiration] = useState(null);
  const [licensePhoto, setLicensePhoto] = useState(null);

  const [soatExpiration, setSoatExpiration] = useState(null);
  const [soatPhoto, setSoatPhoto] = useState(null);

  const [technicalExpiration, setTechnicalExpiration] = useState(null);
  const [technicalPhoto, setTechnicalPhoto] = useState(null);

  const [mercadoPagoEmail, setMercadoPagoEmail] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = () => {
    const documents = {
      licenseNumber,
      licenseExpiration,
      licensePhoto,
      soatExpiration,
      soatPhoto,
      technicalExpiration,
      technicalPhoto,
      mercadoPagoEmail,
      acceptedTerms,
    };
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
        gap: 24,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ gap: 8 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: colors.text,
          }}
        >
          Documentos y pagos
        </Text>

        <Text style={{ color: colors.textSecondary }}>
          Completa los documentos necesarios para registrar tu vehículo y
          recibir pagos por tus viajes.
        </Text>
      </View>

      {/* Licencia de conducción */}
      <View style={{ gap: 16 }}>
        <Text
          style={{
            fontSize: 19,
            fontWeight: '700',
            color: colors.primary,
          }}
        >
          Licencia de conducción
        </Text>

        <View>
          <Text style={styles.label}>Número de licencia *</Text>

          <TextInput
            style={styles.input}
            placeholder="Ingresa el número de licencia"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
          />
        </View>

        <DateInput
          label="Fecha de vencimiento *"
          value={licenseExpiration}
          onChange={setLicenseExpiration}
        />

        <ImageInput
          label="Fotografía de la licencia *"
          value={licensePhoto}
          onChange={setLicensePhoto}
        />
      </View>

      {/* SOAT */}
      <View style={{ gap: 16 }}>
        <Text
          style={{
            fontSize: 19,
            fontWeight: '700',
            color: colors.primary,
          }}
        >
          SOAT
        </Text>

        <DateInput
          label="Fecha de vencimiento del SOAT *"
          value={soatExpiration}
          onChange={setSoatExpiration}
        />

        <ImageInput
          label="Fotografía del SOAT *"
          value={soatPhoto}
          onChange={setSoatPhoto}
        />
      </View>

      {/* Revisión técnico-mecánica */}
      <View style={{ gap: 16 }}>
        <Text
          style={{
            fontSize: 19,
            fontWeight: '700',
            color: colors.primary,
          }}
        >
          Revisión técnico-mecánica
        </Text>

        <Text style={{ color: colors.textSecondary }}>
          Este documento se solicita cuando corresponda según el año del
          vehículo.
        </Text>

        <DateInput
          label="Fecha de vencimiento"
          value={technicalExpiration}
          onChange={setTechnicalExpiration}
        />

        <ImageInput
          label="Fotografía de la revisión técnico-mecánica"
          value={technicalPhoto}
          onChange={setTechnicalPhoto}
        />
      </View>

      {/* Pagos */}
      <View style={{ gap: 16 }}>
        <Text
          style={{
            fontSize: 19,
            fontWeight: '700',
            color: colors.primary,
          }}
        >
          Información de pagos
        </Text>

        <View>
          <Text style={styles.label}>Correo de Mercado Pago *</Text>

          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={mercadoPagoEmail}
            onChangeText={setMercadoPagoEmail}
          />
        </View>

        <View
          style={{
            backgroundColor: colors.lavender,
            borderRadius: 16,
            padding: 16,
            gap: 8,
          }}
        >
          <Text
            style={{
              fontWeight: '700',
              color: colors.primary,
              fontSize: 16,
            }}
          >
            Comisión de la plataforma
          </Text>

          <Text
            style={{
              fontSize: 26,
              fontWeight: '700',
              color: colors.text,
            }}
          >
            20 %
          </Text>

          <Text style={{ color: colors.textSecondary }}>
            La plataforma descontará el 20 % de la tarifa de cada viaje. Las
            propinas corresponden completamente al conductor.
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <Switch
            value={acceptedTerms}
            onValueChange={setAcceptedTerms}
            trackColor={{
              false: colors.border,
              true: colors.primary,
            }}
            thumbColor={colors.surface}
            accessibilityLabel="Aceptar términos y condiciones"
          />

          <Text
            style={{
              flex: 1,
              color: colors.text,
              fontSize: 14,
            }}
          >
            Acepto los términos y condiciones y la comisión del 20 % de
            UberClone.
          </Text>
        </View>
      </View>

      <PrimaryButton title="Enviar registro" onPress={handleSubmit} />
    </ScrollView>
  );
}
