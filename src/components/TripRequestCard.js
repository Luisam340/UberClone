import { Text, TouchableOpacity, View } from 'react-native';
import {
  CircleDot,
  Clock3,
  MapPin,
  Route,
  Timer,
  UserRound,
} from 'lucide-react-native';
import { colors } from '../themes/colors';
import { styles } from '../styles/app.styles';
import {
  formatCurrency,
  formatTime,
  getCategoryLabel,
} from '../utils/formatters';

export function TripRequestCard({
  trip,
  remainingSeconds,
  onAccept,
  onReject,
}) {
  if (!trip) {
    return null;
  }

  const {
    passengerName = 'Pasajero',
    category = 'economy',
    passengerCount = 1,
    pickupAddress = 'Ubicación de recogida',
    destinationAddress = 'Destino del viaje',
    distanceKm = 0,
    durationMin = 0,
    estimatedFare = 0,
  } = trip;

  const isExpired = remainingSeconds <= 0;
  const isUrgent = remainingSeconds <= 10;

  return (
    <View style={styles.tripRequestContainer}>
      <View style={styles.tripRequestHeader}>
        <Text style={styles.tripRequestTitle}>Nueva solicitud</Text>

        <View
          style={[
            styles.tripRequestTimerContainer,
            isUrgent && styles.tripRequestUrgentTimer,
          ]}
        >
          <Timer size={18} color={isUrgent ? colors.error : colors.primary} />

          <Text
            style={[
              styles.tripRequestTimerText,
              isUrgent && styles.tripRequestUrgentTimerText,
            ]}
          >
            {formatTime(remainingSeconds)}
          </Text>
        </View>
      </View>

      <View style={styles.tripRequestPassengerCard}>
        <View style={styles.tripRequestAvatar}>
          <UserRound size={24} color={colors.primary} />
        </View>

        <View style={styles.tripRequestPassengerInfo}>
          <Text style={styles.tripRequestPassengerName} numberOfLines={2}>
            {passengerName}
          </Text>

          <Text style={styles.tripRequestPassengerDetails}>
            {getCategoryLabel(category)} · {passengerCount}{' '}
            {passengerCount === 1 ? 'pasajero' : 'pasajeros'}
          </Text>
        </View>

        <Text style={styles.tripRequestFare}>
          {formatCurrency(estimatedFare)}
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

            <Text style={styles.tripRequestRouteAddress} numberOfLines={2}>
              {pickupAddress}
            </Text>
          </View>

          <View style={styles.tripRequestRouteLocation}>
            <Text style={styles.tripRequestRouteLabel}>DESTINO</Text>

            <Text style={styles.tripRequestRouteAddress} numberOfLines={2}>
              {destinationAddress}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tripRequestMetricsContainer}>
        <View style={styles.tripRequestMetricCard}>
          <Route size={20} color={colors.primary} />

          <Text style={styles.tripRequestMetricValue}>
            {Number(distanceKm).toLocaleString('es-CO', {
              maximumFractionDigits: 1,
            })}{' '}
            km
          </Text>

          <Text style={styles.tripRequestMetricLabel}>Distancia estimada</Text>
        </View>

        <View style={styles.tripRequestMetricCard}>
          <Clock3 size={20} color={colors.primary} />

          <Text style={styles.tripRequestMetricValue}>
            {Math.round(Number(durationMin) || 0)} min
          </Text>

          <Text style={styles.tripRequestMetricLabel}>Duración estimada</Text>
        </View>
      </View>

      <View style={styles.tripRequestActions}>
        <TouchableOpacity
          style={styles.tripRequestRejectButton}
          activeOpacity={0.8}
          onPress={onReject}
          disabled={isExpired}
          accessibilityRole="button"
          accessibilityLabel="Rechazar solicitud"
        >
          <Text style={styles.tripRequestRejectText}>Rechazar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tripRequestAcceptButton,
            isExpired && styles.tripRequestDisabledButton,
          ]}
          activeOpacity={0.8}
          onPress={onAccept}
          disabled={isExpired}
          accessibilityRole="button"
          accessibilityLabel="Aceptar viaje"
        >
          <Text style={styles.tripRequestAcceptText}>Aceptar viaje</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
