import {Text, Pressable, View } from 'react-native';
import { CircleDot, MapPin, UserRound } from 'lucide-react-native';
import { styles } from '../styles/app.styles';
import { colors } from '../themes/colors';
import { formatCurrency } from '../utils/formatters';
import { calculateFare } from '../utils/calculateFare';
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
  onPayCash,
  cashPaymentLoading = false,
  onOpenMercadoPago,
  onCheckMercadoPago,
  paymentLoading = false,
  paymentError,
  paymentResult,
  onResetTrip,
}) {
  if (!trip) return null;

  // Mostrar la distancia y el tiempo del viaje.
  const isPickup = status === TRIP_STATUS.PICKUP;
  const distance = isPickup ? trip.pickupDistanceKm : trip.distanceKm;
  const duration = isPickup ? trip.pickupDurationMin : trip.durationMin;
  const summary = calculateFare({
    distanceKm: trip.distanceKm,
    durationMin: trip.durationMin,
    category: trip.category,
    tip: trip.tip ?? 0,
  });
  const isMercadoPago = trip.paymentMethod === 'mercadopago';
  const paymentStatusLabel = !isMercadoPago
    ? 'Efectivo'
    : paymentResult?.accredited || paymentResult?.status === 'approved'
      ? 'Aprobado'
      : ['rejected', 'failed', 'cancelled', 'canceled'].includes(paymentResult?.status)
        ? 'Rechazado'
        : 'Pendiente';
  const mercadoPagoStatusMessage = paymentResult?.accredited
    ? 'Pago aprobado. Esperando la actualización del viaje.'
    : paymentResult?.status === 'rejected'
      ? 'Pago rechazado. No se ha acreditado el cobro.'
      : 'Pago pendiente de confirmación de Mercado Pago.';

  return (
    <View
      style={[
        styles.tripRequestActiveContainer,
        styles.tripActiveCompactContainer,
      ]}
    >
      <View
        style={[
          styles.tripRequestPassengerCard,
          styles.tripActiveCompactPassengerCard,
        ]}
      >
        <View
          style={[styles.tripRequestAvatar, styles.tripActiveCompactAvatar]}
        >
          <UserRound size={22} color={colors.primary} />
        </View>
        <View style={styles.tripRequestPassengerInfo}>
          <Text
            style={[
              styles.tripRequestPassengerName,
              styles.tripActiveCompactName,
            ]}
            numberOfLines={2}
          >
            {trip.passengerName}
          </Text>
          <Text
            style={[
              styles.tripRequestPassengerDetails,
              styles.tripActiveCompactSecondary,
            ]}
          >
            {trip.passengerCount}{' '}
            {trip.passengerCount === 1 ? 'pasajero' : 'pasajeros'}
          </Text>
        </View>
        <Text style={[styles.tripRequestFare, styles.tripActiveCompactFare]}>
          {formatCurrency(trip.estimatedFare)}
        </Text>
      </View>

      <View
        style={[
          styles.tripRequestRouteContainer,
          styles.tripActiveCompactRoute,
        ]}
      >
        <View style={styles.tripRequestRouteIcons}>
          <CircleDot size={20} color={colors.successText} />
          <View
            style={[
              styles.tripRequestRouteLine,
              styles.tripActiveCompactRouteLine,
            ]}
          />
          <MapPin size={20} color={colors.error} />
        </View>
        <View
          style={[
            styles.tripRequestRouteDetails,
            styles.tripActiveCompactRouteDetails,
          ]}
        >
          <View style={styles.tripRequestRouteLocation}>
            <Text
              style={[
                styles.tripRequestRouteLabel,
                styles.tripActiveCompactLabel,
              ]}
            >
              RECOGIDA
            </Text>
            <Text
              style={[
                styles.tripRequestRouteAddress,
                styles.tripActiveCompactAddress,
              ]}
            >
              {trip.pickupAddress}
            </Text>
          </View>
          <View style={styles.tripRequestRouteLocation}>
            <Text
              style={[
                styles.tripRequestRouteLabel,
                styles.tripActiveCompactLabel,
              ]}
            >
              DESTINO
            </Text>
            <Text
              style={[
                styles.tripRequestRouteAddress,
                styles.tripActiveCompactAddress,
              ]}
            >
              {trip.destinationAddress}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.tripRequestMetricsContainer,
          styles.tripActiveCompactMetrics,
        ]}
      >
        <View
          style={[
            styles.tripRequestMetricCard,
            styles.tripActiveCompactMetricCard,
          ]}
        >
          <Text
            style={[
              styles.tripRequestMetricValue,
              styles.tripActiveCompactMetricValue,
            ]}
          >
            {Number(distance || 0).toFixed(1)} km
          </Text>
          <Text
            style={[
              styles.tripRequestMetricLabel,
              styles.tripActiveCompactSecondary,
            ]}
          >
            {isPickup ? 'Hasta recogida' : 'Distancia del viaje'}
          </Text>
        </View>
        <View
          style={[
            styles.tripRequestMetricCard,
            styles.tripActiveCompactMetricCard,
          ]}
        >
          <Text
            style={[
              styles.tripRequestMetricValue,
              styles.tripActiveCompactMetricValue,
            ]}
          >
            {Math.round(duration || 0)} min
          </Text>
          <Text
            style={[
              styles.tripRequestMetricLabel,
              styles.tripActiveCompactSecondary,
            ]}
          >
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
            Pasajero a bordo
          </Text>
        </Pressable>
      )}

      {status === TRIP_STATUS.IN_PROGRESS &&
        !destinationArrived &&
        !navigationError && (
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

      {(status === TRIP_STATUS.COMPLETED || status === TRIP_STATUS.PAID) && (
        <View style={styles.tripPaymentSummary}>
          <Text style={styles.tripRequestActiveTitle}>Resumen del viaje</Text>
          <Text style={styles.muted}>
            Tarifa final: {formatCurrency(summary.fare)}
          </Text>
          <Text style={styles.muted}>
            Comisión (20 %): {formatCurrency(summary.commission)}
          </Text>
          <Text style={styles.muted}>
            Propina: {formatCurrency(trip.tip ?? 0)}
          </Text>
          <Text style={styles.tripRequestActiveTitle}>
            Ganancia neta: {formatCurrency(summary.driverEarnings)}
          </Text>
          <Text style={styles.muted}>
            Método de pago: {isMercadoPago ? 'Mercado Pago' : 'Efectivo'}
          </Text>
          <Text style={styles.muted}>
            Estado del pago: {paymentStatusLabel}
          </Text>
          {status === TRIP_STATUS.COMPLETED ? (
            isMercadoPago ? (
              <View style={styles.tripNavigationMessage}>
                <Text style={styles.muted}>
                  {mercadoPagoStatusMessage}
                </Text>
                {paymentError ? (
                  <Text style={styles.tripRequestErrorText}>{paymentError}</Text>
                ) : null}
                <Pressable
                  style={styles.tripRequestSimulateButton}
                  onPress={onOpenMercadoPago}
                  disabled={paymentLoading || paymentResult?.accredited || typeof onOpenMercadoPago !== 'function'}
                  accessibilityRole="button"
                  accessibilityLabel="Abrir Mercado Pago para pagar el viaje"
                >
                  <Text style={styles.tripRequestSimulateButtonText}>
                    {paymentLoading ? 'Procesando…' : 'Abrir Mercado Pago'}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.tripRequestSimulateButton}
                  onPress={onCheckMercadoPago}
                  disabled={paymentLoading || typeof onCheckMercadoPago !== 'function'}
                  accessibilityRole="button"
                  accessibilityLabel="Consultar estado del pago"
                >
                  <Text style={styles.tripRequestSimulateButtonText}>
                    Consultar estado del pago
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.tripRequestSimulateButton}
                onPress={onPayCash}
                disabled={cashPaymentLoading || typeof onPayCash !== 'function'}
              >
                <Text style={styles.tripRequestSimulateButtonText}>
                  {cashPaymentLoading ? 'Confirmando efectivo…' : 'Confirmar efectivo recibido'}
                </Text>
              </Pressable>
            )
          ) : (
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
      )}
    </View>
  );
}
