// Servicio local Node.js para conectar mercadopago con firebase
const { createServer } = require('node:http');
const { loadEnvFile } = require('node:process');
const { createHash } = require('node:crypto');
const { initializeApp, applicationDefault, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

loadEnvFile('.env');

const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID;
const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const port = Number(process.env.PAYMENTS_PORT || 8787);

if (!projectId || !mpToken) {
  throw new Error('Faltan EXPO_PUBLIC_FIREBASE_PROJECT_ID o MERCADOPAGO_ACCESS_TOKEN en .env.');
}
if (!getApps().length) {
  initializeApp({ credential: applicationDefault(), projectId });
}
const db = getFirestore();

const mpEndpoint = 'https://api.mercadopago.com/v1/orders';
const checkoutPrefix = 'https://www.mercadopago.com.co/checkout/';
const createPath = '/api/payments/create-order';
const statusPath = /^\/api\/payments\/([^/]+)\/status$/;

function sendError(res, status, error) {
  res.status(status).json({ error });
}

function getTripId(value) {
  return typeof value === 'string' && value.length <= 64 &&
    /^[a-zA-Z0-9_-]+$/.test(value) ? value : null;
}

// AI-assisted: see docs/AI_LOG.md #18.
async function requestMercadoPago(path, options = {}) {
  const response = await fetch(mpEndpoint + path, {
    ...options,
    headers: {
      Authorization: 'Bearer ' + mpToken,
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    // Mercado Pago puede responder con "errors" (plural), no solo "error".
    // Registrar únicamente los campos de diagnóstico, nunca el token ni la solicitud.
    const errors = Array.isArray(data?.errors) ? data.errors.map((item) => ({
      code: item?.code ?? null,
      message: item?.message ?? null,
      details: item?.details ?? null,
    })) : null;
    console.error('Mercado Pago API error:', JSON.stringify({
      httpStatus: response.status,
      code: typeof data?.error === 'string' ? data.error : null,
      message: typeof data?.message === 'string' ? data.message : null,
      errors,
    }));
    const error = new Error('Mercado Pago no pudo procesar la solicitud (' + response.status + ').');
    error.httpStatus = response.status;
    throw error;
  }
  return data;
}

function classifyOrder(order, expectedAmount, tripId) {
  const amount = Number(order?.total_amount);
  const paidAmount = Number(order?.total_paid_amount);
  const matches = order?.external_reference === tripId &&
    order?.currency === 'COP' &&
    Number.isFinite(amount) && Math.abs(amount - expectedAmount) < 0.01;
  if (!matches) throw new Error('La orden no coincide con el viaje.');

  const accredited = order.status === 'processed' &&
    order.status_detail === 'accredited' &&
    Number.isFinite(paidAmount) && paidAmount + 0.01 >= amount;
  const rejected = ['failed', 'canceled', 'cancelled'].includes(order.status);
  return {
    status: accredited ? 'approved' : rejected ? 'rejected' : 'pending',
    accredited,
    orderStatus: order.status,
    orderStatusDetail: order.status_detail ?? null,
  };
}

async function authenticate(req) {
  const bearer = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || '');
  if (!bearer) return null;
  const decoded = await getAuth().verifyIdToken(bearer[1], true);
  return decoded.uid;
}

async function getAuthorizedTrip(tripId, uid) {
  const ref = db.collection('trips').doc(tripId);
  const snapshot = await ref.get();
  if (!snapshot.exists || snapshot.data().driverId !== uid) return null;
  return { ref, trip: snapshot.data() };
}

async function createOrder(req, res, uid) {
  const tripId = getTripId(req.body?.tripId);
  if (!tripId) return sendError(res, 400, 'Identificador del viaje inválido.');

  const found = await getAuthorizedTrip(tripId, uid);
  if (!found) return sendError(res, 404, 'Viaje no encontrado.');
  const { ref } = found;
  const claim = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return { error: 'Viaje no encontrado.' };
    const trip = snap.data();
    if (trip.driverId !== uid || trip.paymentMethod !== 'mercadopago' ||
        trip.status !== 'completed' || trip.paymentStatus === 'approved') {
      return { error: 'El viaje no admite un nuevo cobro.' };
    }
    const amount = Number(trip.fare);
    if (!Number.isFinite(amount) || amount <= 0) {
      return { error: 'La tarifa del viaje no es válida.' };
    }
    if (trip.mpOrderId && trip.mpCheckoutUrl) {
      return { existing: true, orderId: trip.mpOrderId, checkoutUrl: trip.mpCheckoutUrl };
    }
    if (trip.mpOrderCreatingAt) {
      return { busy: true };
    }
    // Un intento por viaje. El ID de idempotencia se reutiliza en reintentos.
    const idempotencyKey = createHash('sha256')
      .update('uberclone-order:' + uid + ':' + tripId).digest('hex');
    tx.update(ref, { mpOrderCreatingAt: FieldValue.serverTimestamp(),
      mpIdempotencyKey: idempotencyKey });
    return { amount, idempotencyKey };
  });

  if (claim.error) return sendError(res, 409, claim.error);
  if (claim.busy) return sendError(res, 409, 'La orden se está creando. Intenta consultar nuevamente.');
  if (claim.existing) {
    return res.json({ checkoutUrl: claim.checkoutUrl, orderId: claim.orderId });
  }

  try {
    // Para COP enviar pesos enteros sin decimales (p. ej. "7800").
    // Evita el rechazo de patrón observado en Orders API para "7800.00".
    if (!Number.isSafeInteger(claim.amount)) {
      throw new Error('La tarifa en COP debe ser un número entero de pesos.');
    }
    const amount = String(claim.amount);
    console.log('Diagnóstico Mercado Pago:', {
      fareFromFirestore: claim.amount,
      totalAmount: amount,
      unitPrice: amount,
      amountType: typeof amount,
      amountLength: amount.length,
      amountAsJSON: JSON.stringify(amount),
      isValidNumber: Number.isFinite(Number(amount)),
    });
    const order = await requestMercadoPago('', {
      method: 'POST',
      headers: { 'X-Idempotency-Key': claim.idempotencyKey },
      body: JSON.stringify({
        type: 'online',
        processing_mode: 'manual',
        capture_mode: 'automatic',
        total_amount: amount,
        external_reference: tripId,
        description: 'Viaje UberClone',
        items: [{ title: 'Viaje UberClone', quantity: 1, unit_price: amount }],
      }),
    });
    if (!order?.id || !order.checkout_url ||
        !order.checkout_url.startsWith(checkoutPrefix) ||
        order.external_reference !== tripId) {
      throw new Error('Mercado Pago devolvió una orden inesperada.');
    }
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (!snap.exists || snap.data().driverId !== uid ||
          snap.data().paymentMethod !== 'mercadopago' ||
          snap.data().status !== 'completed') {
        throw new Error('El viaje cambió mientras se generaba el pago.');
      }
      tx.update(ref, {
        mpOrderId: order.id,
        mpCheckoutUrl: order.checkout_url,
        mpOrderStatus: order.status ?? 'created',
        mpOrderCreatingAt: FieldValue.delete(),
        paymentStatus: 'pending',
      });
    });
    return res.json({ checkoutUrl: order.checkout_url, orderId: order.id });
  } catch (error) {
    console.error('Error creando orden:', error.message);
    if (error.httpStatus === 400) {
      // Respuesta HTTP 400 explícita: Mercado Pago rechazó la creación.
      // Desbloquear únicamente si sigue siendo este intento y no hay orden.
      await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (snap.exists && snap.data().mpIdempotencyKey === claim.idempotencyKey &&
            !snap.data().mpOrderId && snap.data().mpOrderCreatingAt) {
          tx.update(ref, {
            mpOrderCreatingAt: FieldValue.delete(),
            mpIdempotencyKey: FieldValue.delete(),
          });
        }
      }).catch((cleanupError) => console.error('Error liberando intento rechazado:', cleanupError.message));
      return sendError(res, 422, 'Mercado Pago rechazó los datos de la orden. Consulta el registro del servidor.');
    }
    // Errores de red/5xx: conservar bloqueo porque el resultado puede ser incierto.
    return sendError(res, 502, 'No se pudo completar la creación de la orden. Revisa los registros antes de reintentar.');
  }
}

async function checkOrder(req, res, uid, tripId) {
  const found = await getAuthorizedTrip(tripId, uid);
  if (!found) return sendError(res, 404, 'Viaje no encontrado.');
  const { ref, trip } = found;
  if (trip.paymentMethod !== 'mercadopago' || !trip.mpOrderId) {
    return sendError(res, 409, 'Este viaje todavía no tiene una orden.');
  }

  const order = await requestMercadoPago('/' + encodeURIComponent(trip.mpOrderId));
  if (order.id !== trip.mpOrderId) {
    return sendError(res, 502, 'Mercado Pago devolvió un identificador inesperado.');
  }
  const amount = Number(trip.fare);
  const result = classifyOrder(order, amount, tripId);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists || snap.data().mpOrderId !== order.id ||
        snap.data().driverId !== uid || snap.data().paymentMethod !== 'mercadopago') {
      throw new Error('La orden cambió durante la verificación.');
    }
    const current = snap.data();
    if (current.status === 'paid' && current.paymentStatus === 'approved') return;
    if (current.status !== 'completed') {
      throw new Error('El viaje todavía no está finalizado.');
    }
    tx.update(ref, {
      mpOrderStatus: order.status,
      mpOrderStatusDetail: order.status_detail ?? null,
      paymentStatus: result.status,
      updatedAt: FieldValue.serverTimestamp(),
      ...(result.accredited ? {
        status: 'paid',
        paymentId: String(order.id),
        paidAt: FieldValue.serverTimestamp(),
      } : {}),
    });
  });
  res.json(result);
}

// Adaptar las respuestas mínimas a la interfaz utilizada por el servicio.
function reply(response) {
  return {
    status(code) { response.statusCode = code; return this; },
    json(body) {
      if (response.writableEnded) return;
      response.setHeader('Content-Type', 'application/json; charset=utf-8');
      response.end(JSON.stringify(body));
    },
  };
}

const server = createServer(async (request, response) => {
  const res = reply(response);
  try {
    const path = new URL(request.url, 'http://localhost').pathname;
    if (request.method === 'GET' && path === '/health') {
      return res.json({ ok: true, service: 'mercado-pago-local' });
    }

    // Todas las rutas de pago requieren sesión Firebase válida.
    const uid = await authenticate(request);
    if (!uid) return sendError(res, 401, 'Sesión no autorizada.');

    const req = { method: request.method, path, headers: request.headers, body: null };
    if (req.method === 'POST' && path === createPath) {
      const chunks = [];
      let size = 0;
      for await (const chunk of request) {
        size += chunk.length;
        if (size > 4096) return sendError(res, 413, 'Solicitud demasiado grande.');
        chunks.push(chunk);
      }
      try {
        req.body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      } catch {
        return sendError(res, 400, 'JSON inválido.');
      }
      return await createOrder(req, res, uid);
    }

    const match = statusPath.exec(path);
    if (req.method === 'GET' && match) {
      const tripId = getTripId(decodeURIComponent(match[1]));
      if (!tripId) return sendError(res, 400, 'Identificador inválido.');
      return await checkOrder(req, res, uid, tripId);
    }
    return sendError(res, 404, 'Ruta no encontrada.');
  } catch (error) {
    console.error('Error de Mercado Pago:', error.message);
    return sendError(res, 500, 'No fue posible procesar la solicitud de pago.');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log('Mercado Pago local listo en http://127.0.0.1:' + port);
});

