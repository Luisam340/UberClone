# UberClone

Aplicación móvil para conductores desarrollada con React Native y Expo. Incluye registro personal y del vehículo, gestión de viajes, geolocalización, pagos de prueba con Mercado Pago e historial de ganancias. Proyecto académico.

## Backend de pagos Mercado Pago

El servidor Node.js que crea y consulta órdenes de **Checkout Pro (Orders API)** está en `backend/mercadoPagoApi.js`. El servicio de la app que lo llama continúa en `src/services/mercadoPago.js`. Los estados del viaje y del pago no se modificaron en esta reorganización.

### Ejecución

Desde la raíz de `UberClone/`, con las dependencias de Node ya instaladas:

```bash
npm run payments:server
```

El backend no tiene un `package.json` propio; utiliza las dependencias instaladas en la raíz del proyecto. Para funcionar requiere que `firebase-admin` esté disponible en `node_modules`.

En otra terminal, mantener ngrok activo hacia el mismo puerto:

```bash
ngrok http 8787
```

El backend sigue usando `UberClone/.env`, sin copiar secretos a `backend/`. Requiere `EXPO_PUBLIC_FIREBASE_PROJECT_ID` y `MERCADOPAGO_ACCESS_TOKEN`; `PAYMENTS_PORT` es opcional (por defecto, `8787`). La autenticación de Firebase Admin conserva las credenciales de aplicación predeterminadas que ya tengas configuradas.

En Expo, `EXPO_PUBLIC_PAYMENTS_API_URL` debe contener la URL HTTPS del túnel ngrok que apunta a ese puerto. Si cambia la URL del túnel, actualiza esa variable y reinicia Expo.

La app solicita órdenes y consulta el resultado a través del backend; el acceso secreto de Mercado Pago nunca debe incluirse en código de React Native. No se ha cambiado la lógica de estados de pago ni se ha agregado un webhook.

## Mensajes de los commits

Escribimos los commits en español, indicando de forma breve y clara qué se hizo.

Cada commit debe reunir cambios relacionados con una misma tarea. Evitamos mensajes como “cambios”, “actualización” o “ya funciona”, porque no explican qué se modificó.

Ejemplos:

- Agrega el formulario de datos personales
- Configura la conexión con Firebase
- Corrige la validación de la placa
- Conserva los datos al cambiar de pestaña
- Agrega instrucciones de instalación al README
- Registra el uso de IA en la bitácora

## Uso de IA

Durante el desarrollo de UberClone se utilizó ChatGPT como apoyo para
comprender errores, revisar fragmentos de código, organizar archivos y
evaluar posibles soluciones.

Las consultas, decisiones tomadas, modificaciones y métodos de verificación
se encuentran en la [bitácora de uso de IA](docs/AI_LOG.md).
