import { Linking } from 'react-native';
import { auth } from '../config/firebaseConfig';

// URL HTTPS pública del túnel local hacia el servidor Node.js en tu Mac.
// El Access Token solo se lee en mercadoPagoApi.js (Node), nunca en Expo.
const PAYMENTS_API_URL = process.env.EXPO_PUBLIC_PAYMENTS_API_URL;

// AI-assisted: see docs/AI_LOG.md #18.
function getPaymentsApiUrl() {
  if (!PAYMENTS_API_URL || !/^https:\/\//i.test(PAYMENTS_API_URL)) {
    throw new Error(
      'Configura EXPO_PUBLIC_PAYMENTS_API_URL con una URL HTTPS válida.',
    );
  }
  return PAYMENTS_API_URL.replace(/\/$/, '');
}

async function requestPayment(path, options = {}) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Inicia sesión para gestionar el pago del viaje.');
  }

  const idToken = await user.getIdToken();
  const response = await fetch(`${getPaymentsApiUrl()}${path}`, {
    ...options,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || 'No fue posible consultar el pago.');
  }
  return payload;
}

export async function createTripPaymentOrder(tripId) {
  if (!tripId || typeof tripId !== 'string') {
    throw new Error('Identificador de viaje inválido.');
  }

  return requestPayment('/api/payments/create-order', {
    method: 'POST',
    body: JSON.stringify({ tripId }),
  });
}

export async function getTripPaymentStatus(tripId) {
  if (!tripId || typeof tripId !== 'string') {
    throw new Error('Identificador de viaje inválido.');
  }

  return requestPayment(`/api/payments/${encodeURIComponent(tripId)}/status`);
}

export async function openTripPaymentCheckout(checkoutUrl) {
  if (
    typeof checkoutUrl !== 'string' ||
    !/^https:\/\/www\.mercadopago\.com\.co\/checkout\//i.test(checkoutUrl)
  ) {
    throw new Error('La URL de Checkout Pro no es válida.');
  }

  await Linking.openURL(checkoutUrl);
}
