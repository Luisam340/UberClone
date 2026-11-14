import { formatCurrency } from './formatters';
import { tripTimestampToDate } from './tripHistoryFunctions';

export const EARNINGS_PERIODS = [
  { key: 'today', label: 'Hoy' },
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mes' },
];

export function getEarningsDateBounds() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const week = new Date(today);
  week.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const month = new Date(today.getFullYear(), today.getMonth(), 1);
  const tomorrow = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );
  return {
    today,
    week,
    month,
    tomorrow,
    start: new Date(Math.min(week.getTime(), month.getTime())),
  };
}

export function calculateEarnings(trips, bounds) {
  const totals = { today: 0, week: 0, month: 0 };
  const periods = {
    today: { cash: 0, mercadopago: 0, count: 0, tips: 0 },
    week: { cash: 0, mercadopago: 0, count: 0, tips: 0 },
    month: { cash: 0, mercadopago: 0, count: 0, tips: 0 },
  };

  for (const trip of trips) {
    // No incluir viajes pendientes o pagos no confirmados.
    if (
      trip.status !== 'paid' ||
      !['cash', 'approved'].includes(trip.paymentStatus)
    )
      continue;
    const date = tripTimestampToDate(trip.completedAt);
    const earnings = Number(trip.driverEarnings);
    const tip = Number(trip.tip ?? 0);
    if (!date || !Number.isFinite(earnings) || earnings < 0) continue;
    if (date >= bounds.tomorrow) continue;
    const validTip = Number.isFinite(tip) && tip > 0 ? tip : 0;

    for (const period of EARNINGS_PERIODS) {
      if (date < bounds[period.key]) continue;
      totals[period.key] += earnings;
      periods[period.key].count += 1;
      periods[period.key].tips += validTip;
      if (
        trip.paymentMethod === 'cash' ||
        trip.paymentMethod === 'mercadopago'
      ) {
        periods[period.key][trip.paymentMethod] += earnings;
      }
    }
  }

  return { totals, periods };
}

export function getEarningsChartData(summary, period) {
  const selected = summary.periods[period] ?? summary.periods.month;
  return [
    { key: 'mercadopago', label: 'Mercado Pago', value: selected.mercadopago },
    { key: 'cash', label: 'Efectivo', value: selected.cash },
  ];
}

export function formatEarnings(value) {
  return formatCurrency(value);
}
