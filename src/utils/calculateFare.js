import { PRICING } from '../config/pricing';

export function calculateFare({ distanceKm, durationMin, category, tip = 0 }) {
  const multiplier = PRICING.multipliers[category];

  if (
    multiplier === undefined ||
    !Number.isFinite(distanceKm) ||
    !Number.isFinite(durationMin) ||
    !Number.isFinite(tip) ||
    distanceKm < 0 ||
    durationMin < 0 ||
    tip < 0
  ) {
    throw new Error('Los datos para calcular la tarifa no son válidos.');
  }

  const subtotal =
    PRICING.baseFare +
    distanceKm * PRICING.pricePerKm +
    durationMin * PRICING.pricePerMinute;
  const fare =
    Math.round(Math.max(PRICING.minimumFare, subtotal * multiplier) / 100) *
    100;
  const commission = Math.round(fare * PRICING.commissionRate);
  const driverEarnings = fare - commission + tip;
  return {
    fare,
    commission,
    driverEarnings,
  };
}
