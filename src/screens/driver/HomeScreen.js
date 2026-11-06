import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Pressable, Text, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { MapPin, ToggleLeft, ToggleRight } from 'lucide-react-native';
import {
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { ScreenHeader } from '../../components/ScreenHeader';
import { Map } from '../../components/Map';
import { getRandomLocation } from '../../data/simulatedLocations';
import { styles } from '../../styles/app.styles';
import { colors } from '../../themes/colors';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../config/firebaseConfig';

export default function HomeScreen() {
  const { user } = useContext(AuthContext);

  const [origin] = useState(getRandomLocation);
  const [available, setAvailable] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [accountValidated, setAccountValidated] = useState(false);
  const [loadingApproval, setLoadingApproval] = useState(true);
  const [driverName, setDriverName] = useState('Conductor');

  const snapPoints = useMemo(() => ['25%', '45%', '65%'], []);

  const availableRef = useRef(false);
  const writeInProgress = useRef(false);

  // Consultar el nombre y la aprobación desde Firestore.
  useEffect(() => {
    if (!user?.uid) {
      availableRef.current = false;
      setDriverName('Conductor');
      setAccountValidated(false);
      setLoadingApproval(false);
      return;
    }

    setLoadingApproval(true);
    setAccountValidated(false);
    setDriverName('Conductor');

    const driverRef = doc(db, 'drivers', user.uid);

    const unsubscribe = onSnapshot(
      driverRef,
      (snapshot) => {
        const driverData = snapshot.data();

        const approved = driverData?.accountValidated === true;

        const name =
          driverData?.personal?.name || user?.displayName || 'Conductor';

        setAccountValidated(approved);
        setDriverName(name);
        setLoadingApproval(false);
      },
      (error) => {
        console.error('[HomeScreen] Approval error:', error);

        availableRef.current = false;
        setDriverName('Conductor');
        setAccountValidated(false);
        setLoadingApproval(false);
      },
    );

    return () => unsubscribe();
  }, [user?.uid, user?.displayName]);

  // Detener el seguimiento si la cuenta pierde aprobación.
  useEffect(() => {
    if (loadingApproval || !accountValidated) {
      availableRef.current = false;
      setAvailable(false);
      setSeconds(0);
    }
  }, [loadingApproval, accountValidated]);

  // Sincronizar la disponibilidad.
  useEffect(() => {
    availableRef.current = available;

    return () => {
      availableRef.current = false;
    };
  }, [available]);

  // Guardar la ubicación simulada en Firestore.
  const saveDriverLocation = useCallback(
    async (position) => {
      if (!user?.uid || !availableRef.current || writeInProgress.current) {
        return;
      }

      if (
        !Number.isFinite(position?.latitude) ||
        !Number.isFinite(position?.longitude)
      ) {
        console.warn('[HomeScreen] Invalid location:', position);
        return;
      }

      writeInProgress.current = true;

      try {
        const driverRef = doc(db, 'drivers', user.uid);

        await updateDoc(driverRef, {
          location: {
            latitude: position.latitude,
            longitude: position.longitude,
            simulated: true,
            updatedAt: serverTimestamp(),
          },
        });
      } catch (error) {
        console.error('[HomeScreen] Location update failed:', error);
      } finally {
        writeInProgress.current = false;
      }
    },
    [user?.uid],
  );

  // Tiempo transcurrido desde que se activa Disponible.
  useEffect(() => {
    if (!available) {
      return;
    }

    const interval = setInterval(() => {
      setSeconds((previousSeconds) => previousSeconds + 3);
    }, 3000);

    return () => clearInterval(interval);
  }, [available]);

  const toggle = () => {
    if (loadingApproval || !accountValidated) {
      return;
    }

    const nextAvailable = !available;

    availableRef.current = nextAvailable;
    setAvailable(nextAvailable);
    setSeconds(0);
  };

  const availabilityDisabled = loadingApproval || !accountValidated;

  // Datos dinámicos del encabezado.
  const firstName = driverName.trim().split(/\s+/)[0] || 'Conductor';

  const currentDate = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Bogota',
  }).format(new Date());

  const formattedDate =
    currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={`Hola, ${firstName}`}
        subtitle={formattedDate}
        // profilePhotoUrl={profilePhotoUrl}
        initials={driverName
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part.charAt(0).toUpperCase())
          .join('')}
      />
      <Map
        origin={origin}
        moving={available && !availabilityDisabled}
        route={available}
        onLocationChange={saveDriverLocation}
      >
        <View style={styles.mapTop}>
          <View style={styles.location}>
            <Text style={styles.small}>{origin.name}</Text>
          </View>
        </View>
      </Map>

      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 5,
        }}
      >
        <BottomSheet
          index={1}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose={false}
          enableHandlePanningGesture={true}
          enableContentPanningGesture={true}
          backgroundStyle={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}
          handleIndicatorStyle={{
            backgroundColor: colors.border,
            width: 44,
            height: 5,
          }}
        >
          <BottomSheetView style={styles.sheetContent}>
            <View style={styles.row}>
              <View
                style={{
                  flex: 1,
                  paddingRight: 12,
                }}
              >
                <Text style={styles.sectionTitle}>
                  {available ? 'Estás disponible' : 'No estás disponible'}
                </Text>

                <Text style={styles.muted}>
                  {loadingApproval
                    ? 'Verificando estado de la cuenta...'
                    : !accountValidated
                      ? 'Tu cuenta está pendiente de aprobación'
                      : available
                        ? 'Simulando ubicación del conductor'
                        : 'Activa la disponibilidad para comenzar'}
                </Text>
              </View>

              <Pressable
                onPress={toggle}
                disabled={availabilityDisabled}
                accessibilityRole="switch"
                accessibilityLabel="Disponibilidad del conductor"
                accessibilityState={{
                  checked: available,
                  disabled: availabilityDisabled,
                }}
                hitSlop={10}
              >
                {available ? (
                  <ToggleRight
                    size={32}
                    color={colors.primary}
                    strokeWidth={2}
                  />
                ) : (
                  <ToggleLeft
                    size={32}
                    color={
                      availabilityDisabled
                        ? colors.border
                        : colors.textSecondary
                    }
                    strokeWidth={2}
                  />
                )}
              </Pressable>
            </View>

            {available && (
              <View style={styles.tracking}>
                <MapPin size={14} color={colors.successText} strokeWidth={2} />

                <View style={styles.trackingContent}>
                  <Text style={styles.trackText}>
                    Posición simulada cada 3 segundos
                  </Text>
                </View>

                <Text style={styles.trackText}>
                  {`Disponible: ${seconds}s`}
                </Text>
              </View>
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </View>
  );
}
