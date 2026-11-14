import { formatCurrency, getCategoryLabel } from './formatters';

export const HISTORY_PERIODS = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
  { key: 'range', label: 'Rango' },
];

export const HISTORY_PAYMENT_METHODS = [
  { key: 'all', label: 'Todos' },
  { key: 'mercadopago', label: 'Mercado Pago' },
  { key: 'cash', label: 'Efectivo' },
];

export function getTripHistoryDateBounds(period, start, end) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  if (period === 'today') return { startDate: today, endDate: tomorrow };
  if (period === 'week') {
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return { startDate: monday, endDate: tomorrow };
  }
  if (period === 'month') {
    return {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: tomorrow,
    };
  }
  if (
    period === 'range' &&
    start instanceof Date &&
    end instanceof Date &&
    start <= end
  ) {
    return {
      startDate: new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
      ),
      endDate: new Date(end.getFullYear(), end.getMonth(), end.getDate() + 1),
    };
  }
  return { startDate: null, endDate: null };
}

export function isTripHistoryRangeInvalid(period, start, end) {
  return (
    period === 'range' &&
    (!(start instanceof Date) || !(end instanceof Date) || start > end)
  );
}

export function tripTimestampToDate(timestamp) {
  if (!timestamp) return null;
  const date =
    typeof timestamp.toDate === 'function'
      ? timestamp.toDate()
      : new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getTripPaymentLabel(trip) {
  if (trip?.paymentStatus === 'approved' || trip?.paymentStatus === 'cash')
    return 'Aprobado';
  if (
    ['rejected', 'failed', 'canceled', 'cancelled'].includes(
      trip?.paymentStatus,
    )
  )
    return 'Rechazado';
  return 'Pendiente';
}

export function isFinishedTrip(trip) {
  return ['completed', 'paid'].includes(trip?.status);
}

export function matchesTripPaymentMethod(trip, method) {
  return method === 'all' || trip?.paymentMethod === method;
}

export function normalizeTripCoordinate(value) {
  if (!value) return null;
  const latitude = Number(value.latitude ?? value.lat);
  const longitude = Number(value.longitude ?? value.lng);
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  )
    return null;
  return { latitude, longitude };
}

export function getTripHistoryMapData(trip) {
  const origin = normalizeTripCoordinate(trip?.origin);
  const destination = normalizeTripCoordinate(trip?.destination);
  const path = Array.isArray(trip?.tripRoute)
    ? trip.tripRoute.map(normalizeTripCoordinate).filter(Boolean)
    : [];
  const points = path.length > 1 ? path : [origin, destination].filter(Boolean);
  if (!points.length) return { origin, destination, path, region: null };

  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);
  const region = {
    latitude: (minLatitude + maxLatitude) / 2,
    longitude: (minLongitude + maxLongitude) / 2,
    latitudeDelta: Math.max(0.01, (maxLatitude - minLatitude) * 1.45),
    longitudeDelta: Math.max(0.01, (maxLongitude - minLongitude) * 1.45),
  };
  return { origin, destination, path, region };
}

export function getTripHistorySummary(trip) {
  const date =
    tripTimestampToDate(trip?.completedAt) ??
    tripTimestampToDate(trip?.createdAt);
  return {
    dateLabel: date
      ? date.toLocaleString('es-CO', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : 'Fecha no disponible',
    categoryLabel: getCategoryLabel(trip?.category),
    originLabel: trip?.origin?.address || 'Origen no disponible',
    destinationLabel: trip?.destination?.address || 'Destino no disponible',
    fareLabel: trip?.fare == null ? 'No disponible' : formatCurrency(trip.fare),
    earningsLabel:
      trip?.driverEarnings == null
        ? 'No disponible'
        : formatCurrency(trip.driverEarnings),
    paymentLabel: getTripPaymentLabel(trip),
  };
}

export function getTripHistoryDetails(trip) {
  const date =
    tripTimestampToDate(trip?.completedAt) ??
    tripTimestampToDate(trip?.createdAt);
  const currency = (value) =>
    value == null ? 'No disponible' : formatCurrency(value);
  const rating = trip?.rating;
  return {
    dateLabel: date
      ? date.toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })
      : 'Fecha no disponible',
    routeFields: [
      { label: 'Origen', value: trip?.origin?.address || 'No disponible' },
      {
        label: 'Destino',
        value: trip?.destination?.address || 'No disponible',
      },
      { label: 'Categoría', value: getCategoryLabel(trip?.category) },
      {
        label: 'Duración estimada',
        value:
          trip?.durationMin == null
            ? 'No disponible'
            : `${Math.round(trip.durationMin)} min`,
      },
      {
        label: 'Distancia estimada',
        value:
          trip?.distanceKm == null
            ? 'No disponible'
            : `${Number(trip.distanceKm).toFixed(1)} km`,
      },
    ],
    earningsFields: [
      { label: 'Tarifa', value: currency(trip?.fare) },
      { label: 'Comisión', value: currency(trip?.commission) },
      {
        label: 'Porcentaje de comisión',
        value:
          trip?.commissionRate == null
            ? 'No disponible'
            : `${(Number(trip.commissionRate) * 100).toFixed(0)} %`,
      },
      { label: 'Propina', value: currency(trip?.tip) },
      { label: 'Ganancia neta', value: currency(trip?.driverEarnings) },
    ],
    paymentFields: [
      {
        label: 'Método',
        value:
          trip?.paymentMethod === 'mercadopago'
            ? 'Mercado Pago'
            : trip?.paymentMethod === 'cash'
              ? 'Efectivo'
              : 'No disponible',
      },
      { label: 'Estado del pago', value: getTripPaymentLabel(trip) },
      {
        label: 'Calificación del pasajero',
        value:
          rating != null && Number.isFinite(Number(rating))
            ? String(rating)
            : 'Sin calificación',
      },
    ],
  };
}
