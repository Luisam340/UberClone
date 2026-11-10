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
}) {
  const mapRef = useRef(null);
  const positionRef = useRef(null);
  const headingRef = useRef(0);
  const speedRef = useRef(VEHICLE_SPEED);
  const callbackRef = useRef(onLocationChange);
  const initializedRef = useRef(false);

  const [initialLocation] = useState(() => origin || getRandomLocation());

  const [tracking, setTracking] = useState(() => {
    const position = {
      latitude: initialLocation.latitude,
      longitude: initialLocation.longitude,
    };

    positionRef.current = position;

    return {
      position,
      heading: 0,
      path: [position],
    };
  });

  const vehicleSource = getVehicleImage('red');

  useEffect(() => {
    callbackRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    if (!moving) return;

    let cancelled = false;
    let interval = null;
    let finishAnimation = null;
    let frameCount = 0;

    const startSimulation = async () => {
      while (!cancelled) {
        let coordinates;

        try {
          coordinates = await getDrivingRoute(
            positionRef.current,
            getRandomLocation(),
          );
        } catch (error) {
          if (!cancelled) {
            console.error('[Map] Routing error:', error);
          }

          return;
        }

        if (cancelled) return;

        if (!coordinates || coordinates.length < 2) {
          console.warn('[Map] Invalid route');
          return;
        }

        const drivingRoute = buildRoute(coordinates);

        if (drivingRoute.points.length < 2 || drivingRoute.totalDistance <= 0) {
          return;
        }

        if (!initializedRef.current) {
          const initialHeading = getSmoothedHeading(drivingRoute, 0);

          if (initialHeading !== null) {
            headingRef.current = initialHeading;
          }

          initializedRef.current = true;

          setTracking((previous) => ({
            ...previous,
            heading: headingRef.current,
          }));
        }

        let traveledDistance = 0;
        let lastUpdate = Date.now();

        await new Promise((resolve) => {
          let finished = false;

          const finish = () => {
            if (finished) return;

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

            const now = Date.now();

            const elapsed = Math.min(
              Math.max((now - lastUpdate) / 1000, 0),
              0.2,
            );

            lastUpdate = now;

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
            frameCount++;

            const shouldUpdatePath =
              frameCount % PATH_UPDATE_FRAMES === 0 ||
              traveledDistance >= drivingRoute.totalDistance;

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

            if (traveledDistance >= drivingRoute.totalDistance) {
              finish();
            }
          }, UPDATE_INTERVAL);
        });
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
  }, [moving]);

  const centerOnDriver = () => {
    const position = positionRef.current;

    if (!position) return;

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
          <View
            collapsable={false}
            style={{
              width: VEHICLE_ICON_SIZE,
              height: VEHICLE_ICON_SIZE,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={vehicleSource}
              resizeMode="contain"
              style={{
                width: VEHICLE_ICON_SIZE,
                height: VEHICLE_ICON_SIZE,
                transform: [{ rotate: `${vehicleRotation}deg` }],
              }}
            />
          </View>
        </Marker>

        {route && tracking.path.length > 1 && (
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
