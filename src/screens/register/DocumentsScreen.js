import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { ExpirationDateInput } from '../../components/ExpirationDateInput';
import { ImageInput } from '../../components/ImageInput';
import { PrimaryButton } from '../../components/PrimaryButton';
import { Checkbox } from '../../components/Checkbox';
import { ValidationError } from '../../components/ValidationError';

import { colors } from '../../themes/colors';
import { styles } from '../../styles/app.styles';
import { validateDocuments } from '../../utils/registrationValidators';
import { initialDocumentErrors, getDocumentErrors } from '../../data/document';
import { useDriverRegistration } from '../../hooks/useDriverRegistration';

export function DocumentsScreen() {
  const {
    documentsData,
    isSubmitting,
    handleDocumentsChange,
    handleDocumentsSave,
  } = useDriverRegistration();

  const [licenseNumber, setLicenseNumber] = useState(
    documentsData.licenseNumber,
  );
  const [licenseExpiration, setLicenseExpiration] = useState(
    documentsData.licenseExpiration,
  );
  const [licensePhoto, setLicensePhoto] = useState(documentsData.licensePhoto);

  const [soatExpiration, setSoatExpiration] = useState(
    documentsData.soatExpiration,
  );
  const [soatPhoto, setSoatPhoto] = useState(documentsData.soatPhoto);

  const [technicalExpiration, setTechnicalExpiration] = useState(
    documentsData.technicalExpiration,
  );
  const [technicalPhoto, setTechnicalPhoto] = useState(
    documentsData.technicalPhoto,
  );

  const [mercadoPagoEmail, setMercadoPagoEmail] = useState(
    documentsData.mercadoPagoEmail,
  );
  const [acceptedTerms, setAcceptedTerms] = useState(
    documentsData.acceptedTerms,
  );

  const [errors, setErrors] = useState(initialDocumentErrors);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    handleDocumentsChange({
      licenseNumber,
      licenseExpiration,
      licensePhoto,
      soatExpiration,
      soatPhoto,
      technicalExpiration,
      technicalPhoto,
      mercadoPagoEmail,
      acceptedTerms,
    });
  }, [
    licenseNumber,
    licenseExpiration,
    licensePhoto,
    soatExpiration,
    soatPhoto,
    technicalExpiration,
    technicalPhoto,
    mercadoPagoEmail,
    acceptedTerms,
    handleDocumentsChange,
  ]);

  const handleSubmit = () => {
    const data = {
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

    const validationErrors = validateDocuments(data);

    setErrors(getDocumentErrors(validationErrors));

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    handleDocumentsSave(data);
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
          <ValidationError message={errors.licenseNumber} />
        </View>

        <View>
          <ExpirationDateInput
            label="Fecha de vencimiento *"
            value={licenseExpiration}
            onChange={setLicenseExpiration}
          />
          <ValidationError message={errors.licenseExpiration} />
        </View>

        <View>
          <ImageInput
            label="Fotografía de la licencia *"
            value={licensePhoto}
            onChange={setLicensePhoto}
          />
          <ValidationError message={errors.licensePhoto} />
        </View>
      </View>

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

        <View>
          <ExpirationDateInput
            label="Fecha de vencimiento del SOAT *"
            value={soatExpiration}
            onChange={setSoatExpiration}
          />
          <ValidationError message={errors.soatExpiration} />
        </View>

        <View>
          <ImageInput
            label="Fotografía del SOAT *"
            value={soatPhoto}
            onChange={setSoatPhoto}
          />
          <ValidationError message={errors.soatPhoto} />
        </View>
      </View>

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

        <View>
          <ExpirationDateInput
            label="Fecha de vencimiento"
            value={technicalExpiration}
            onChange={setTechnicalExpiration}
          />
          <ValidationError message={errors.technicalExpiration} />
        </View>

        <View>
          <ImageInput
            label="Fotografía de la revisión técnico-mecánica"
            value={technicalPhoto}
            onChange={setTechnicalPhoto}
          />
          <ValidationError message={errors.technicalPhoto} />
        </View>
      </View>

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
          <ValidationError message={errors.mercadoPagoEmail} />
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
          <Checkbox
            label="Acepto los términos y condiciones y la comisión del 20 % de UberClone."
            value={acceptedTerms}
            onChange={setAcceptedTerms}
          />
        </View>

        <ValidationError message={errors.acceptedTerms} />
      </View>

      <PrimaryButton
        title={isSubmitting ? 'Registrando...' : 'Enviar registro'}
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
    </ScrollView>
  );
}
