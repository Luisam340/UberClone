import { Pressable, ScrollView, Text, View } from 'react-native';
import {
  CarFront,
  CircleDot,
  Clock3,
  MapPin,
  Route,
  Timer,
  Wallet,
} from 'lucide-react-native';
import { colors } from '../themes/colors';
import { styles } from '../styles/app.styles';
import {
  formatCurrency,
  formatDistance,
  formatTime,
  getCategoryLabel,
} from '../utils/formatters';

function TripAlertCard({ request, onAccept, onReject }) {
  const {
    id,
    passengerName = 'Pasajero',
    pickupAddress = 'Ubicación de recogida',
    destinationAddress = 'Destino',
    estimatedFare = 0,
    driverEarnings = 0,
    distanceKm = 0,
    durationMin = 0,
    category = 'economy',
    paymentMethod = 'cash',
    remainingSeconds = 0,
  } = request;

  const isExpired = remainingSeconds <= 0;
  const isUrgent = remainingSeconds <= 10;

  return (
    <View style={styles.tripAlertCompactCard}>
      <View style={styles.tripAlertCompactHeader}>
        <Text style={styles.tripAlertCompactName} numberOfLines={1}>
          {passengerName}
        </Text>

        <Text style={styles.tripAlertCompactFare}>
          {formatCurrency(estimatedFare)}
        </Text>
      </View>

      <View style={styles.tripAlertCompactRoute}>
        <View style={styles.tripAlertCompactLocation}>
          <CircleDot size={17} color={colors.successText} />
          <View style={styles.tripAlertCompactLocationText}>
            <Text style={styles.tripAlertCompactLocationLabel}>Recogida</Text>
            <Text style={styles.tripAlertCompactAddress} numberOfLines={2}>
              {pickupAddress}
            </Text>
          </View>
        </View>
        <View style={styles.tripAlertCompactLocation}>
          <MapPin size={17} color={colors.error} />
          <View style={styles.tripAlertCompactLocationText}>
            <Text style={styles.tripAlertCompactLocationLabel}>Destino</Text>
            <Text style={styles.tripAlertCompactAddress} numberOfLines={2}>
              {destinationAddress}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tripAlertCompactMetrics}>
        <View style={styles.tripAlertCompactMetric}>
          <Route size={16} color={colors.primary} />
          <Text style={styles.tripAlertCompactMetricValue}>
            {formatDistance(distanceKm)} km
          </Text>
          <Text style={styles.tripAlertCompactMetricLabel}>Distancia</Text>
        </View>
        <View style={styles.tripAlertCompactMetric}>
          <Clock3 size={16} color={colors.primary} />
          <Text style={styles.tripAlertCompactMetricValue}>
            {Math.round(durationMin)} min
          </Text>
          <Text style={styles.tripAlertCompactMetricLabel}>Duración</Text>
        </View>
        <View style={styles.tripAlertCompactMetric}>
          <CarFront size={16} color={colors.primary} />
          <Text style={styles.tripAlertCompactMetricValue}>
            {getCategoryLabel(category)}
          </Text>
          <Text style={styles.tripAlertCompactMetricLabel}>Categoría</Text>
        </View>
        <View style={styles.tripAlertCompactMetric}>
          <Wallet size={16} color={colors.primary} />
          <Text style={styles.tripAlertCompactMetricValue}>
            {paymentMethod === 'cash'
              ? 'Efectivo'
              : paymentMethod === 'mercadopago'
                ? 'Mercado Pago'
                : 'Por definir'}
          </Text>
          <Text style={styles.tripAlertCompactMetricLabel}>Pago</Text>
        </View>
      </View>

      <View style={styles.tripAlertCompactEarnings}>
        <Text style={styles.tripAlertCompactEarningsLabel}>
          Ganancia estimada (80 %)
        </Text>
        <Text style={styles.tripAlertCompactEarningsValue}>
          {formatCurrency(driverEarnings)}
        </Text>
      </View>

      <View style={styles.tripAlertCompactFooter}>
        <View
          style={[
            styles.tripAlertCompactTimer,
            isUrgent && styles.tripRequestUrgentTimer,
          ]}
        >
          <Timer size={15} color={isUrgent ? colors.error : colors.primary} />

          <Text
            style={[
              styles.tripAlertCompactTimerText,
              isUrgent && styles.tripRequestUrgentTimerText,
            ]}
          >
            {formatTime(remainingSeconds)}
          </Text>
        </View>

        <Pressable
          onPress={() => onReject(id)}
          disabled={isExpired}
          style={[
            styles.tripAlertCompactReject,
            isExpired && styles.tripRequestDisabledButton,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Rechazar viaje de ${passengerName}`}
        >
          <Text style={styles.tripAlertCompactRejectText}>Rechazar</Text>
        </Pressable>

        <Pressable
          onPress={() => onAccept(id)}
          disabled={isExpired}
          style={[
            styles.tripAlertCompactAccept,
            isExpired && styles.tripRequestDisabledButton,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Aceptar viaje de ${passengerName}`}
        >
          <Text style={styles.tripAlertCompactAcceptText}>Aceptar</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function TripRequestAlerts({
  requests = [],
  onAccept,
  onReject,
  onGoOffline,
}) {
  if (requests.length === 0) {
    return null;
  }

  return (
    <View style={styles.tripAlertsOverlay} pointerEvents="box-none">
      <View style={styles.tripAlertsHeader}>
        <Text style={styles.tripAlertsTitle}>
          Solicitudes cercanas ({requests.length})
        </Text> 
      </View>

      <ScrollView
        style={styles.tripAlertsScroll}
        contentContainerStyle={styles.tripAlertsList}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {requests.map((request) => (
          <TripAlertCard
            key={request.id}
            request={request}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))}
      </ScrollView>
    </View>
  );
}
