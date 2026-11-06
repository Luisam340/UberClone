import {
  BadgeCheck,
  UserRound,
  CarFront,
  FileText,
  LogOut,
} from 'lucide-react-native';
import { useContext, useState, useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  ScrollView,
  Text,
  Pressable,
  Alert,
} from 'react-native';
import { signOut } from 'firebase/auth';

import { ProfileSection } from '../../components/ProfileSection';
import { AuthContext } from '../../context/AuthContext';
import { subscribeToDriverProfile } from '../../services/driver';
import { auth } from '../../config/firebaseConfig';
import { styles } from '../../styles/app.styles';
import { colors } from '../../themes/colors';

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    vehicle: false,
    documents: false,
  });

  useEffect(() => {
    if (!user?.uid) {
      setDriver(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setDriver(null);

    const unsubscribe = subscribeToDriverProfile(
      user.uid,
      (driverData) => {
        setDriver(driverData);
        setError(null);
        setLoading(false);
      },
      (profileError) => {
        console.error('[ProfileScreen] Error loading driver:', profileError);

        setDriver(null);
        setError('No fue posible consultar el perfil.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const toggleSection = (section) => {
    setExpandedSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que deseas cerrar sesión?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);

          try {
            await signOut(auth);
          } catch (logoutError) {
            console.error('[ProfileScreen] Logout error:', logoutError);

            Alert.alert(
              'Error',
              'No fue posible cerrar sesión. Inténtalo nuevamente.',
            );
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  const fullName =
    driver?.personal?.name ||
    [driver?.personal?.firstName, driver?.personal?.lastName]
      .filter(Boolean)
      .join(' ') ||
    user?.displayName ||
    'Conductor';

  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  if (loading) {
    return (
      <View style={styles.profileCentered}>
        <ActivityIndicator size="large" color={colors.primary} />

        <Text style={styles.profileLoadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.profileCentered}>
        <Text style={styles.profileEmptyText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.profileScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHero}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{initials}</Text>
          </View>

          <Text style={styles.profileName}>{fullName}</Text>

          <Text style={styles.profileRole}>Cuenta de conductor</Text>

          <View style={styles.profileStatus}>
            <BadgeCheck
              size={17}
              color={
                driver?.accountValidated ? colors.success : colors.textSecondary
              }
            />

            <Text
              style={[
                styles.profileStatusText,
                {
                  color: driver?.accountValidated
                    ? '#4E8464'
                    : colors.textSecondary,
                },
              ]}
            >
              {driver?.accountValidated
                ? 'Cuenta aprobada'
                : 'Pendiente de aprobación'}
            </Text>
          </View>
        </View>

        <View style={styles.profileBody}>
          <Text style={styles.profileHeading}>INFORMACIÓN DE MI CUENTA</Text>

          <ProfileSection
            title="Datos personales"
            section="personal"
            icon={UserRound}
            data={driver?.personal}
            expanded={expandedSections.personal}
            onToggle={() => toggleSection('personal')}
          />

          <ProfileSection
            title="Mi vehículo"
            section="vehicle"
            icon={CarFront}
            data={driver?.vehicle}
            expanded={expandedSections.vehicle}
            onToggle={() => toggleSection('vehicle')}
          />

          <ProfileSection
            title="Documentos"
            section="documents"
            icon={FileText}
            data={driver?.documents}
            expanded={expandedSections.documents}
            onToggle={() => toggleSection('documents')}
          />

          <Pressable
            onPress={handleLogout}
            disabled={loggingOut}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginTop: 28,
              marginBottom: 24,
              paddingVertical: 16,
              borderRadius: 16,
              backgroundColor: colors.lavender,
              borderWidth: 1,
              borderColor: colors.border,
              opacity: loggingOut ? 0.6 : 1,
            }}
          >
            {loggingOut ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <LogOut size={20} color={colors.primary} strokeWidth={2} />
            )}

            <Text
              style={{
                color: colors.primary,
                fontSize: 16,
                fontWeight: '600',
              }}
            >
              {loggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
