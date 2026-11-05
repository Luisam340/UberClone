import { BadgeCheck, UserRound, CarFront, FileText } from 'lucide-react-native';
import { useContext, useState, useEffect } from 'react';
import { View, ActivityIndicator, ScrollView, Text } from 'react-native';
import { ProfileSection } from '../../components/ProfileSection';
import { AuthContext } from '../../context/AuthContext';
import { subscribeToDriverProfile } from '../../services/driver';
import { styles } from '../../styles/app.styles';
import { colors } from '../../themes/colors';

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fullName =
    driver?.personal?.fullName ||
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
                driver?.accountValidated ? '#4E8464' : colors.textSecondary
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
        </View>
      </ScrollView>
    </View>
  );
}
