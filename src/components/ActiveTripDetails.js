import { Pressable, Text, View } from 'react-native';
import { CircleDot, MapPin, UserRound } from 'lucide-react-native';
import { styles } from '../styles/app.styles';
import { colors } from '../themes/colors';
import { formatCurrency } from '../utils/formatters';
import { TRIP_STATUS } from '../hooks/useTripSimulation';

export function ActiveTripDetails({
  trip,
  tripError,
  status,
  pickupArrived,
  destinationArrived,
  navigationError,
  onRetryNavigation,
  onStartTrip,
  onFinishTrip,
  onResetTrip,
}) {
  if (!trip) return null;

  // Mostrar la distancia y el tiempo de la etapa actual.
  const isPickup = status === TRIP_STATUS.PICKUP;
  const distance = isPickup ? trip.pickupDistanceKm : trip.distanceKm;
  const duration = isPickup ? trip.pickupDurationMin : trip.durationMin;

  return (
    <View style={styles.tripRequestActiveContainer}>
      <View style={styles.tripRequestPassengerCard}>
        <View style={styles.tripRequestAvatar}>
          <UserRound size={22} color={colors.primary} />
        </View>
        <View style={styles.tripRequestPassengerInfo}>
          <Text style={styles.tripRequestPassengerName} numberOfLines={2}>
            {trip.passengerName}
          </Text>
          <Text style={styles.tripRequestPassengerDetails}>
            {trip.passengerCount}{' '}
            {trip.passengerCount === 1 ? 'pasajero' : 'pasajeros'}
          </Text>
        </View>
        <Text style={styles.tripRequestFare}>
          {formatCurrency(trip.estimatedFare)}
        </Text>
      </View>

      <View style={styles.tripRequestRouteContainer}>
        <View style={styles.tripRequestRouteIcons}>
          <CircleDot size={20} color={colors.successText} />
          <View style={styles.tripRequestRouteLine} />
          <MapPin size={20} color={colors.error} />
        </View>
        <View style={styles.tripRequestRouteDetails}>
          <View style={styles.tripRequestRouteLocation}>
            <Text style={styles.tripRequestRouteLabel}>RECOGIDA</Text>
            <Text style={styles.tripRequestRouteAddress}>
              {trip.pickupAddress}
            </Text>
          </View>
          <View style={styles.tripRequestRouteLocation}>
            <Text style={styles.tripRequestRouteLabel}>DESTINO</Text>
            <Text style={styles.tripRequestRouteAddress}>
              {trip.destinationAddress}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tripRequestMetricsContainer}>
        <View style={styles.tripRequestMetricCard}>
          <Text style={styles.tripRequestMetricValue}>
            {Number(distance || 0).toFixed(1)} km
          </Text>
          <Text style={styles.tripRequestMetricLabel}>
            {isPickup ? 'Hasta recogida' : 'Distancia del viaje'}
          </Text>
        </View>
        <View style={styles.tripRequestMetricCard}>
          <Text style={styles.tripRequestMetricValue}>
            {Math.round(duration || 0)} min
          </Text>
          <Text style={styles.tripRequestMetricLabel}>
            Tiempo estimado
          </Text>
        </View>
      </View>

      {tripError && (
        <Text style={styles.tripRequestErrorText}>{tripError}</Text>
      )}
      {navigationError && (
        <View style={styles.tripNavigationMessage}>
          <Text style={styles.tripRequestErrorText}>{navigationError}</Text>
          <Pressable
            style={styles.tripRequestSimulateButton}
            onPress={onRetryNavigation}
          >
            <Text style={styles.tripRequestSimulateButtonText}>
              Reintentar ruta
            </Text>
          </Pressable>
        </View>
      )}

      {isPickup && !pickupArrived && !navigationError && (
        <Text style={styles.muted}>
          El conductor se dirige al punto de recogida.
        </Text>
      )}

      {/* Confirmar que el pasajero ya esta a bordo. */}
      {isPickup && pickupArrived && (
        <Pressable
          style={styles.tripRequestSimulateButton}
          onPress={onStartTrip}
        >
          <Text style={styles.tripRequestSimulateButtonText}>
            Iniciar viaje
          </Text>
        </Pressable>
      )}

      {status === TRIP_STATUS.IN_PROGRESS && !destinationArrived && !navigationError && (
        <Text style={styles.muted}>
          Pasajero a bordo. En camino al destino.
        </Text>
      )}

      {/* Finalizar manualmente al llegar al destino. */}
      {status === TRIP_STATUS.IN_PROGRESS && destinationArrived && (
        <View style={styles.tripNavigationMessage}>
          <Text style={styles.muted}>
            Llegaste al destino. Finaliza el viaje para continuar con el cobro.
          </Text>
          <Pressable
            style={styles.tripRequestSimulateButton}
            onPress={onFinishTrip}
            accessibilityRole="button"
            accessibilityLabel="Finalizar viaje"
          >
            <Text style={styles.tripRequestSimulateButtonText}>
              Finalizar viaje
            </Text>
          </Pressable>
        </View>
      )}

      {status === TRIP_STATUS.COMPLETED && (
        <Pressable
          style={styles.tripRequestSimulateButton}
          onPress={onResetTrip}
        >
          <Text style={styles.tripRequestSimulateButtonText}>
            Volver a recibir solicitudes
          </Text>
        </Pressable>
      )}
    </View>
  );
}
