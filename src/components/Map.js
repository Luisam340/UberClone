import MapView, { Marker, Polyline } from 'react-native-maps';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, View } from 'react-native';
import { LocateFixed } from 'lucide-react-native';
import { styles } from '../styles/app.styles';
import { colors } from '../themes/colors';
import { getRandomLocation } from '../data/simulatedLocations';
import { getDrivingRoute } from '../services/routeDriver';
import {
  getVehicleImage,
  UPDATE_INTERVAL,
  VEHICLE_SPEED,
  TURN_SPEED,
  ACCELERATION,
  IMAGE_HEADING_OFFSET,
  PATH_UPDATE_FRAMES,
  VEHICLE_ICON_SIZE,
} from '../data/vehicle';
import {
  buildRoute,
  getPositionAtDistance,
  getSmoothedHeading,
  getTargetSpeed,
  approachValue,
  rotateTowards,
} from '../utils/vehicleFunctions';

export function Map({
  origin,
  route = false,
  moving = false,
  children,
  onLocationChange,
  navigationTarget = null,
  navigationId = null,
  onNavigationComplete,
  onNavigationError,
}) {
  const mapRef = useRef(null);
  const headingRef = useRef(0);
  const speedRef = useRef(VEHICLE_SPEED);
  const callbackRef = useRef(onLocationChange);
  const completionRef = useRef(onNavigationComplete);
  const errorRef = useRef(onNavigationError);
  const initializedRef = useRef(false);
  const [initialLocation] = useState(() => origin || getRandomLocation());
  const positionRef = useRef({
    latitude: initialLocation.latitude,
    longitude: initialLocation.longitude,
  });

  const [tracking, setTracking] = useState(() => {
    const position = {
      latitude: initialLocation.latitude,
      longitude: initialLocation.longitude,
    };

    return {
      position,
      heading: 0,
      path: [position],
    };
  });

  const vehicleSource = getVehicleImage('red');

  // Mantener las funciones actualizadas sin reiniciar el movimiento.
  useEffect(() => {
    callbackRef.current = onLocationChange;
    completionRef.current = onNavigationComplete;
    errorRef.current = onNavigationError;
  }, [onLocationChange, onNavigationComplete, onNavigationError]);

  const targetLatitude = navigationTarget?.latitude;
  const targetLongitude = navigationTarget?.longitude;

  // Reutilizar la animacion tanto para recorridos aleatorios
  // como para llevar al conductor hacia el pasajero.
  useEffect(() => {
    const hasNavigationTarget =
      Number.isFinite(targetLatitude) && Number.isFinite(targetLongitude);

    if (!moving && !hasNavigationTarget) {
      speedRef.current = 0;
      return;
    }

    let cancelled = false;
    let interval = null;
    let finishAnimation = null;
    let frameCount = 0;

    const animateRoute = async (coordinates) => {
      if (!Array.isArray(coordinates) || coordinates.length < 2) {
        throw new Error('La ruta no contiene suficientes puntos.');
      }

      const drivingRoute = buildRoute(coordinates);

      if (drivingRoute.points.length < 2 || drivingRoute.totalDistance <= 0) {
        throw new Error('La ruta del vehículo no es válida.');
      }

      // Reiniciar la linea de recorrido para la nueva ruta.
      setTracking((previous) => ({
        ...previous,
        path: [positionRef.current],
      }));

      if (!initializedRef.current) {
        const initialHeading = getSmoothedHeading(drivingRoute, 0);

        if (initialHeading !== null) {
          headingRef.current = initialHeading;
        }

        initializedRef.current = true;
      }

      let traveledDistance = 0;
      let lastUpdate = Date.now();

      await new Promise((resolve) => {
        let finished = false;

        const finish = () => {
          if (finished) {
            return;
          }

          finished = true;

          if (interval !== null) {
            clearInterval(interval);
            interval = null;
          }

          finishAnimation = null;
          resolve();
        };

        finishAnimation = finish;

        interval = setInterval(() => {
          if (cancelled) {
            finish();
            return;
          }

          const currentTime = Date.now();

          const elapsed = Math.min(
            Math.max((currentTime - lastUpdate) / 1000, 0),
            0.2,
          );

          lastUpdate = currentTime;

          const targetSpeed = getTargetSpeed(drivingRoute, traveledDistance);

          speedRef.current = approachValue(
            speedRef.current,
            targetSpeed,
            ACCELERATION * elapsed,
          );

          traveledDistance = Math.min(
            drivingRoute.totalDistance,
            traveledDistance + speedRef.current * elapsed,
          );

          const nextPosition = getPositionAtDistance(
            drivingRoute,
            traveledDistance,
          );

          const targetHeading = getSmoothedHeading(
            drivingRoute,
            traveledDistance,
          );

          if (targetHeading !== null) {
            headingRef.current = rotateTowards(
              headingRef.current,
              targetHeading,
              TURN_SPEED * elapsed,
            );
          }

          positionRef.current = nextPosition;
          frameCount += 1;

          const reachedDestination =
            traveledDistance >= drivingRoute.totalDistance;

          const shouldUpdatePath =
            frameCount % PATH_UPDATE_FRAMES === 0 || reachedDestination;

          setTracking((previous) => ({
            position: nextPosition,
            heading: headingRef.current,
            path: shouldUpdatePath
              ? [...previous.path.slice(-199), nextPosition]
              : previous.path,
          }));

          if (shouldUpdatePath) {
            callbackRef.current?.(nextPosition);
          }

          if (reachedDestination) {
            speedRef.current = 0;
            finish();
          }
        }, UPDATE_INTERVAL);
      });
    };

    const startSimulation = async () => {
      while (!cancelled) {
        const isNavigation = hasNavigationTarget;

        const destination = isNavigation
          ? {
              latitude: targetLatitude,
              longitude: targetLongitude,
            }
          : getRandomLocation();

        try {
          // Calcular desde la posicion real del carro en ese instante.
          const coordinates = await getDrivingRoute(
            positionRef.current,
            destination,
          );

          if (cancelled) {
            return;
          }

          await animateRoute(coordinates);

          if (cancelled) {
            return;
          }

          if (isNavigation) {
            completionRef.current?.(navigationId);
            return;
          }
        } catch (error) {
          if (cancelled) {
            return;
          }

          if (isNavigation) {
            errorRef.current?.(error);
          }

          return;
        }
      }
    };

    startSimulation();

    return () => {
      cancelled = true;

      if (finishAnimation) {
        finishAnimation();
      }

      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [moving, targetLatitude, targetLongitude, navigationId]);

  const centerOnDriver = () => {
    const position = positionRef.current;

    if (!position) {
      return;
    }

    mapRef.current?.animateToRegion(
      {
        ...position,
        latitudeDelta: 0.006,
        longitudeDelta: 0.006,
      },
      500,
    );
  };

  const vehicleRotation = (tracking.heading - IMAGE_HEADING_OFFSET + 360) % 360;

  const hasNavigationTarget =
    Number.isFinite(targetLatitude) && Number.isFinite(targetLongitude);

  return (
    <View style={styles.map}>
      <MapView
        ref={mapRef}
        style={styles.mapCanvas}
        initialRegion={{
          latitude: initialLocation.latitude,
          longitude: initialLocation.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation={false}
        showsTraffic={false}
        showsCompass={false}
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={tracking.position}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={true}
        >
          <View collapsable={false} style={styles.vehicleMarkerContainer}>
            <Image
              source={vehicleSource}
              resizeMode="contain"
              style={[
                styles.vehicleMarkerImage,
                {
                  transform: [{ rotate: `${vehicleRotation}deg` }],
                },
              ]}
            />
          </View>
        </Marker>

        {hasNavigationTarget && (
          <Marker
            coordinate={{
              latitude: targetLatitude,
              longitude: targetLongitude,
            }}
            pinColor={colors.primary}
            title="Destino actual"
          />
        )}

        {(route || hasNavigationTarget) && tracking.path.length > 1 && (
          <Polyline
            coordinates={tracking.path}
            strokeColor={colors.primary}
            strokeWidth={4}
          />
        )}
      </MapView>

      {children}

      <Pressable
        onPress={centerOnDriver}
        accessibilityRole="button"
        accessibilityLabel="Centrar mapa en el conductor"
        style={styles.mapCenterButton}
      >
        <LocateFixed size={24} color={colors.primary} />
      </Pressable>
    </View>
  );
}
