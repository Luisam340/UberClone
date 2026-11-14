// Formatear valores monetarios en pesos colombianos.
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

// Mostrar el tiempo restante en minutos y segundos.
export const formatTime = (seconds) => {
  const remaining = Math.max(0, Math.floor(seconds ?? 0));
  const minutes = Math.floor(remaining / 60);
  const secondsPart = remaining % 60;

  return `${String(minutes).padStart(2, '0')}:${String(secondsPart).padStart(2, '0')}`;
};

// Mostrar distancias con un decimal.
export const formatDistance = (distance) =>
  Number(distance || 0).toLocaleString('es-CO', {
    maximumFractionDigits: 1,
  });

// Obtener el nombre visible de la categoria del vehiculo.
export const getCategoryLabel = (category) => {
  const categories = {
    economy: 'Económico',
    xl: 'XL',
    premium: 'Premium',
  };

  return categories[category] ?? 'Económico';
};
