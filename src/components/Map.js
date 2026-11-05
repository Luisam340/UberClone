import { AppleMaps } from 'expo-maps';
import { useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { styles } from '../styles/app.styles';
import { colors } from '../themes/colors';
import { useImage } from 'expo-image';

import { getRandomLocation } from '../data/simulatedLocations';
import { LocateFixed } from 'lucide-react-native';
import { getDrivingRoute } from '../services/routeDriver';
import { getVehicleImage } from '../data/vehicle';

export function Map({
  origin,
  route = false,
  moving = false,
  children,
  onLocationChange,
}) {
  const mapRef = useRef(null);
  const routeIndex = useRef(0);
  const driverVehicle = { color: 'red' };
  const vehicleSource = getVehicleImage(driverVehicle.color);
  const vehicleIcon = useImage(vehicleSource, {
    maxWidth: 64,
    maxHeight: 64,
  });
  const centerOnDriver = () => {
    mapRef.current?.setCameraPosition({
      coordinates: tracking.position,
      zoom: 17,
    });
  };
  const [initialLocation] = useState(() => origin || getRandomLocation());
  const [tracking, setTracking] = useState(() => {
    const initialPosition = {
      latitude: initialLocation.latitude,
      longitude: initialLocation.longitude,
    };

    return {
      position: initialPosition,
      path: [initialPosition],
    };
  });

  useEffect(() => {
    if (!moving) {
      return;
    }

    let cancelled = false;
    let interval;

    const startSimulation = async () => {
      try {
        const destination = getRandomLocation();

        const coordinates = await getDrivingRoute(
          tracking.position,
          destination,
        );

        if (cancelled || coordinates.length === 0) {
          return;
        }

        routeIndex.current = 0;

        setTracking({
          position: coordinates[0],
          path: [coordinates[0]],
        });

        interval = setInterval(() => {
          const nextIndex = routeIndex.current + 1;

          if (nextIndex >= coordinates.length) {
            clearInterval(interval);
            return;
          }

          const nextPosition = coordinates[nextIndex];

          routeIndex.current = nextIndex;

          setTracking((previous) => ({
            position: nextPosition,
            path: [...previous.path.slice(-199), nextPosition],
          }));
          onLocationChange?.(nextPosition);
        }, 3000);
      } catch (error) {
        console.error('[Map] Routing error:', error);
      }
    };

    startSimulation();

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [moving, onLocationChange]);

  return (
    <View style={styles.map}>
      <AppleMaps.View
        ref={mapRef}
        style={styles.mapCanvas}
        cameraPosition={{
          coordinates: {
            latitude: initialLocation.latitude,
            longitude: initialLocation.longitude,
          },
          zoom: 14,
        }}
        annotations={[
          {
            id: 'simulated-driver',
            coordinates: tracking.position,
            icon: vehicleIcon ?? undefined,
          },
        ]}
        polylines={
          route && tracking.path.length > 1
            ? [
                {
                  id: 'simulated-route',
                  coordinates: tracking.path,
                  color: colors.primary,
                  width: 4,
                },
              ]
            : []
        }
        properties={{
          isMyLocationEnabled: false,
          isTrafficEnabled: false,
        }}
        uiSettings={{
          compassEnabled: false,
          myLocationButtonEnabled: false,
        }}
      />

      {children}
      <Pressable
        onPress={centerOnDriver}
        accessibilityRole="button"
        accessibilityLabel="Centrar mapa en el conductor"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 100,
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 4,
          zIndex: 10,
        }}
      >
        <LocateFixed size={24} color={colors.primary} />
      </Pressable>
    </View>
  );
}
