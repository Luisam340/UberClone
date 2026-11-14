# Bitácora de uso de inteligencia artificial — UberClone

## Información general

- Proyecto: UberClone
- Integrante: Luisa Mosquera
- Tecnologías: React Native, Expo, JavaScript y Firebase
- Herramienta utilizada: ChatGPT
- Entorno de desarrollo: VS Code, macOS, Xcode 27 y dispositivo iOS

## Alcance del uso de IA

Durante el desarrollo se utilizó ChatGPT como apoyo para comprender errores, revisar fragmentos de código, organizar archivos y conocer posibles soluciones.

En la mayoría de las consultas se compartió código que ya había sido escrito para recibir explicaciones, ejemplos o recomendaciones de corrección. Las respuestas se revisaron y se adaptaron a las necesidades y a la estructura de UberClone.

> Nota: Los prompts de este documento fueron reconstruidos a partir de la bitácora de aprendizaje existente. Antes de la entrega se deben reemplazar por el texto literal de las conversaciones cuando esté disponible.

---

### Entrada #1

- Fecha: 2026-10-28
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Organizar las carpetas, los estilos y los archivos iniciales del proyecto
- Prompt reconstruido: “tengo los colores, estilos y pantallas mezclados y no sé muy bien dónde debería guardar cada cosa, me ayudas a organizar las carpetas y me dices en qué ruta debería poner los colores, las tipografías, los estilos de las pantallas y los componentes que se repiten?”
- Resumen de la respuesta: Se explicó la diferencia entre temas globales, estilos particulares de las pantallas, componentes reutilizables, datos y funciones auxiliares. También se recomendaron rutas como `src/themes`, `src/styles`, `src/components`, `src/screens`, `src/data` y `src/utils`.
- Qué se usó / modificó / descartó: Se tomó como referencia la separación general de responsabilidades. Los nombres y las rutas se adaptaron a las necesidades de UberClone. La organización se realizó gradualmente y no se trasladaron todos los archivos al mismo tiempo.
- Archivos y commit: `src/themes/colors.js` — `bceb6aa`, `src/themes/typography.js` y `src/styles/app.styles.js` — `0d8f0a7`
- Verificación: Se revisó que las importaciones continuaran funcionando y que las pantallas conservaran sus colores, tipografías y estilos.
- Aprendizaje: Se comprendió que la ruta de un archivo debe reflejar su responsabilidad y que separar estilos y constantes facilita el mantenimiento.

---

### Entrada #2

- Fecha: 2026-10-31
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Configurar los íconos adaptables y el splash screen de Expo
- Prompt reconstruido: “estoy cambiando la imagen de UberClone en Expo, pero en `app.json` aparecen `foregroundImage`, `backgroundImage`, `monochromeImage` y `backgroundColor`, qué hace cada uno?, también quiero poner mi splash con fondo claro, cómo debería configurarlo?”
- Resumen de la respuesta: Se explicó que Android construye el ícono adaptable mediante diferentes capas y que la imagen monocromática puede utilizarse con los colores del sistema. También se explicaron las propiedades principales de `expo-splash-screen`.
- Qué se usó / modificó / descartó: Se utilizaron las explicaciones como referencia para configurar los recursos gráficos. Las imágenes y los colores fueron creados y seleccionados para UberClone. Algunas versiones iniciales se descartaron porque no tenían el tamaño o el encuadre apropiado.
- Archivos y commit: `app.json`, `assets/android-icon-background.png`, `assets/android-icon-foreground.png`, `assets/android-icon-monochrome.png` y `assets/uber-clone-splash-icon.png` — `0d8f0a7`
- Verificación: Se compiló la aplicación y se revisaron el ícono y el splash en el dispositivo. El splash necesitó ajustes visuales posteriores.
- Aprendizaje: Se comprendió que los recursos gráficos forman parte de la configuración nativa y que sus dimensiones afectan el resultado.

---

### Entrada #3

- Fecha: 2026-10-31
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Diagnosticar problemas de ejecución de Expo con Xcode 27
- Prompt reconstruido: “la aplicación compila para el iphone pero no inicia correctamente con Xcode 27, ya revisé la firma, el certificado y el perfil, puede ser un problema de Expo SDK 57?, qué debería revisar antes de seguir cambiando el código?”
- Resumen de la respuesta: Se explicó la diferencia entre un error de JavaScript y un problema de configuración nativa. Se indicó revisar el soporte de `UIScene`, la configuración de `expo-build-properties` y la regeneración del proyecto nativo.
- Qué se usó / modificó / descartó: Se siguieron los pasos de diagnóstico antes de modificar la configuración. Se instaló `expo-build-properties`, se habilitó `ios.enableSceneSupport` y se regeneró el proyecto de iOS.
- Archivos y commit: `app.json`, `package.json` y `package-lock.json` — `0d8f0a7`
- Verificación: Se ejecutaron `npx expo prebuild --clean` y `npx expo run:ios --device`. La aplicación se compiló y pudo instalarse en el iPhone.
- Aprendizaje: Se comprendió que un problema de ejecución puede estar relacionado con la compatibilidad entre Expo y Xcode aunque el código JavaScript sea correcto.

---

### Entrada #4

- Fecha: 2026-10-31
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Solucionar el error `No script URL provided` y entender el funcionamiento de Metro
- Prompt reconstruido: “la aplicación ya está instalada en el iphone pero muestra `No script URL provided`, eso significa que la compilación quedó mal o hace falta iniciar algo de React Native?”
- Resumen de la respuesta: Se explicó que durante el desarrollo la aplicación instalada necesita conectarse a Metro para recibir el bundle de JavaScript. Se indicó reiniciar Metro limpiando la caché.
- Qué se usó / modificó / descartó: Se utilizó el comando recomendado para reiniciar Metro. No fue necesario modificar la lógica de las pantallas.
- Archivos y commit: No produjo un cambio independiente de código. Estuvo relacionado con la configuración incluida en `0d8f0a7`.
- Verificación: Se ejecutó `npx expo start --clear` y se confirmó que la aplicación cargara su pantalla inicial.
- Aprendizaje: Se aprendió a diferenciar la aplicación nativa instalada del código JavaScript servido por Metro.

---

### Entrada #5

- Fecha: 2026-10-31
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Definir la navegación inicial y las pantallas del registro
- Prompt reconstruido: “tengo una pantalla de inicio de sesión y quiero que el registro del conductor tenga varias etapas, me conviene usar un Stack y unas pestañas?, también necesito que los datos no se pierdan cuando pase de una pantalla a otra”
- Resumen de la respuesta: Se explicó cómo separar la navegación de autenticación de la navegación correspondiente al registro. También se indicó que los datos compartidos podían mantenerse en un componente superior o mediante Context.
- Qué se usó / modificó / descartó: Se tomó como referencia la separación de navegadores y se adaptaron las rutas a las pantallas de UberClone. La propuesta inicial de conservar el estado en una sola pantalla se reemplazó posteriormente por Context.
- Archivos y commit: `App.js`, `src/navigation/UberCloneStack.js`, `src/screens/auth/AuthTabs.js`, `src/screens/auth/LoginScreen.js`, `src/screens/register/DriverRegistrationScreen.js` y `src/screens/register/RegisterWelcomeScreen.js` — `0d8f0a7` y `de165eb`
- Verificación: Se recorrió el flujo desde la autenticación hasta las etapas de información personal, vehículo y documentos.
- Aprendizaje: Se comprendió que la navegación controla las pantallas, mientras que el estado compartido conserva la información utilizada por varias de ellas.

---

### Entrada #6

- Fecha: 2026-11-01
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Corregir el comportamiento del teclado y el desplazamiento de los formularios
- Prompt reconstruido: “te paso el código que hice para el formulario, en el iphone el teclado me tapa algunos campos y cuando intento bajar se cierra, cómo puedo acomodar `KeyboardAvoidingView` y `ScrollView` sin cambiar todo lo que ya hice?”
- Resumen de la respuesta: Se revisó la estructura compartida y se explicó el uso de `KeyboardAvoidingView`, `ScrollView`, `keyboardShouldPersistTaps`, `keyboardDismissMode` y `flex: 1`.
- Qué se usó / modificó / descartó: Se tomó como referencia el ejemplo de organización de los contenedores. Se conservaron los campos y los estilos existentes. Se corrigieron la jerarquía de los componentes y algunas propiedades relacionadas con el teclado.
- Archivos y commit: `src/screens/driver/PersonalDataScreen.js`, `src/screens/driver/VehicleScreen.js`, `src/screens/driver/DocumentsScreen.js` y `src/styles/app.styles.js` — `de165eb`
- Verificación: Se probaron los formularios en el iPhone, se abrió el teclado y se realizó desplazamiento hasta los campos inferiores.
- Aprendizaje: Se comprendió que el manejo del teclado depende tanto de sus propiedades como del espacio ocupado por los contenedores.

---

### Entrada #7

- Fecha: 2026-11-01
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Revisar las propiedades de `TextInput` y las reglas de validación
- Prompt reconstruido: “te paso los `TextInput` que hice para nombre, correo, placa y contraseña, me ayudas a corregir sus propiedades?, quiero controlar el teclado, las mayúsculas y la cantidad de caracteres, también quiero saber si React Native tiene algo como `required` y `minLength`”
- Resumen de la respuesta: Se explicaron propiedades como `keyboardType`, `autoCapitalize`, `maxLength`, `secureTextEntry` y `autoCorrect`. También se indicó que React Native no realiza automáticamente las validaciones de `required` o `minLength`.
- Qué se usó / modificó / descartó: Se aplicaron algunas propiedades a los campos existentes y se utilizaron ejemplos para crear reglas de validación propias. Se evaluó React Hook Form pero se decidió continuar utilizando `useState`.
- Archivos y commit: `src/screens/driver/PersonalDataScreen.js`, `src/screens/driver/VehicleScreen.js` y `src/utils/registrationValidators.js` — `de165eb` y `ee69377`
- Verificación: Se ingresaron valores válidos e inválidos, se comprobó el teclado mostrado y se revisaron los mensajes de validación.
- Aprendizaje: Se comprendió que las propiedades del campo orientan la entrada del usuario pero no reemplazan las validaciones.

---

### Entrada #8

- Fecha: 2026-11-01
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Investigar la advertencia de `DateTimePicker`
- Prompt reconstruido: “mi componente usa `onConfirm` y `onCancel` pero la consola dice que `onChange` está obsoleto, por qué aparece esa advertencia si yo no lo estoy usando directamente?, te paso el código del selector”
- Resumen de la respuesta: Se explicó que `react-native-modal-datetime-picker` envuelve el selector nativo y puede utilizar internamente propiedades que no aparecen directamente en el componente de UberClone.
- Qué se usó / modificó / descartó: Se siguió la recomendación de revisar la dependencia instalada para identificar el origen de la advertencia. Se decidió conservar la implementación porque el selector funcionaba y no se modificó el contenido de `node_modules`.
- Archivos y commit: `src/components/DateInput.js`, `src/components/ExpirationDateInput.js` y `package.json` — `de165eb` y `ee69377`
- Verificación: Se abrió el selector, se confirmaron y cancelaron fechas y se comprobó que el valor se actualizara.
- Aprendizaje: Se comprendió que una advertencia puede originarse dentro de una dependencia y no necesariamente en el componente escrito para la aplicación.

---

### Entrada #9

- Fecha: 2026-11-01
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Diagnosticar el cierre de la aplicación al solicitar acceso a la cámara
- Prompt reconstruido: “cuando selecciono cámara en mi componente `ImageInput` la aplicación se cierra completamente en el iphone, con la galería no pasa lo mismo, te paso el código que tengo, me ayudas a poner unos `console.log` para saber en qué parte está fallando antes de cambiarlo?”
- Resumen de la respuesta: Se recomendó agregar registros antes y después de consultar el permiso y diferenciar un error nativo de una excepción de JavaScript. Los registros permitieron localizar el cierre durante la solicitud del permiso.
- Qué se usó / modificó / descartó: Se utilizaron los ejemplos de registros para diagnosticar el flujo. Se consultó el permiso con `getCameraPermissionsAsync()` y se agregó el manejo del caso `canAskAgain === false`. Se conservó la estructura general de `ImageInput`.
- Archivos y commit: `src/components/ImageInput.js`, `app.json` y `package.json` — `de165eb`
- Verificación: Se probaron la cámara y la galería en el iPhone. Cuando el permiso estaba bloqueado se mostró una alerta para abrir la configuración.
- Aprendizaje: Se comprendió que un cierre nativo puede ocurrir antes de que un bloque `catch` de JavaScript reciba el error.

---

### Entrada #10

- Fecha: 2026-11-01
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Configurar y verificar los permisos nativos de cámara y galería
- Prompt reconstruido: “ya agregué el manejo del permiso en JavaScript pero en el iphone sigue apareciendo denegado, tengo que agregar `expo-image-picker` en `app.json`?, cómo reviso si las descripciones sí llegaron al `Info.plist`?”
- Resumen de la respuesta: Se explicó la función del config plugin de `expo-image-picker`, la diferencia entre `prebuild`, `run:ios` y Metro. También se proporcionó un comando con `plutil` para verificar las claves de privacidad.
- Qué se usó / modificó / descartó: Se tomó como referencia la configuración indicada para agregar los mensajes de cámara, fotografías y micrófono en `app.json`. Después se sincronizó el proyecto nativo y se comprobaron las claves generadas.
- Archivos y commit: `app.json`, `package.json` y `src/components/ImageInput.js` — `de165eb`
- Verificación: Se ejecutó `npx expo prebuild --platform ios` y se comprobó la presencia de `NSCameraUsageDescription`, `NSMicrophoneUsageDescription` y `NSPhotoLibraryUsageDescription`.
- Aprendizaje: Se comprendió que solicitar un permiso desde JavaScript no reemplaza las descripciones de privacidad requeridas por iOS.

---

### Entrada #11

- Fecha: 2026-11-01
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Separar las validaciones y los datos constantes de las pantallas
- Prompt reconstruido: “mis pantallas ya están muy largas porque tienen campos, mensajes y validaciones en el mismo archivo, me ayudas a revisar el código y a decirme qué puedo mover a `data` y qué debería ir en una función de validación sin cambiar cómo funciona el formulario?”
- Resumen de la respuesta: Se recomendó separar las opciones y estructuras iniciales en `src/data` y las reglas en `src/utils`. También se explicó el operador de propagación para combinar errores iniciales con errores encontrados.
- Qué se usó / modificó / descartó: Se siguió la recomendación de separar constantes y validaciones de las pantallas. Las reglas se adaptaron a los datos solicitados por UberClone y dentro de las pantallas se conservaron el estado y la presentación.
- Archivos y commit: `src/data/personal.js`, `src/data/vehicle.js`, `src/data/document.js`, `src/utils/registrationValidators.js` y pantallas del registro — `ee69377`
- Verificación: Se probaron formularios vacíos, valores incorrectos y datos válidos. Se comprobó que los mensajes aparecieran en el campo correspondiente.
- Aprendizaje: Se comprendió que separar las reglas permite reutilizarlas y mantener las pantallas más pequeñas.

---

### Entrada #12

- Fecha: 2026-11-02
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Conservar y sincronizar la información entre las etapas del registro
- Prompt reconstruido: “yo envío los datos al padre con `onSave` pero si regreso, cambio algo y me voy por otra pestaña, el padre se queda con el valor anterior, cómo puedo avisar cada cambio sin crear una función diferente para todos los campos y sin perder lo que ya llené?”
- Resumen de la respuesta: Se explicó la diferencia entre `onChange` y `onSave`, además del uso de `useEffect`, `useCallback` y `useRef`. Posteriormente se indicó que el estado compartido podía trasladarse a Context.
- Qué se usó / modificó / descartó: Se tomaron como referencia los ejemplos de comunicación mediante props y posteriormente se adaptó el manejo del estado a `DriverRegistrationContext`. Se conservaron las validaciones antes de marcar una etapa como terminada.
- Archivos y commit: `src/context/DriverRegistrationContext.js`, `src/hooks/useDriverRegistration.js`, `src/screens/register/DriverRegistrationScreen.js` y pantallas del registro — `2988fe5`
- Verificación: Se completó una etapa, se regresó a modificar un campo y se comprobó que la etapa volviera a quedar pendiente sin perder los demás datos.
- Aprendizaje: Se comprendió que sincronizar los datos y confirmar la validez de una etapa son responsabilidades diferentes.

---

### Entrada #13

- Fecha: 2026-11-02
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Configurar Firebase Authentication y manejar errores del inicio de sesión
- Prompt reconstruido: “ya hice las funciones de registro, login y logout con Firebase pero tengo lógica repetida y no sé dónde debería quedar cada función, también VS Code dice que `getReactNativePersistence` no existe y que el error del `catch` es `unknown`, me ayudas a revisar lo que hice?”
- Resumen de la respuesta: Se recomendó separar el registro de las operaciones de autenticación, centralizar el estado en `AuthContext` y comprobar la forma del error antes de leer `code`. También se explicó el uso de AsyncStorage para la persistencia.
- Qué se usó / modificó / descartó: Se tomó como referencia la separación propuesta para organizar los servicios y el contexto. El manejo de errores se adaptó a los códigos de Firebase y se evitó acceder directamente a `error.code` sin comprobar el valor recibido.
- Archivos y commit: `src/config/firebaseConfig.js`, `src/services/authentication.js`, `src/services/register.js`, `src/context/AuthContext.js`, `src/utils/authenticationValidators.js` y pantallas de autenticación — `2988fe5`, `0442781`, `23390f9`, `0b5ee0f` y `d77360c`
- Verificación: Se probaron el registro, el inicio de sesión, el cierre de sesión y el uso de credenciales incorrectas. También se revisó la advertencia relacionada con la persistencia.
- Aprendizaje: Se comprendió la diferencia entre el estado global de autenticación y las funciones encargadas de comunicarse con Firebase.

---

### Entrada #14

- Fecha: 2026-11-05
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Revisar la carga de imágenes a Cloudinary y el almacenamiento de sus URL
- Prompt reconstruido: “ya puedo seleccionar las fotos del registro pero ahora necesito subirlas a Cloudinary y guardar en Firebase la URL, no la ruta local del iphone, te paso el servicio y el contexto que hice, me ayudas a corregir el flujo y a decirme en qué archivo debería quedar cada parte?”
- Resumen de la respuesta: Se explicó la diferencia entre seleccionar una imagen local, subirla a Cloudinary y almacenar la URL resultante. También se recomendó separar el servicio de carga del componente visual.
- Qué se usó / modificó / descartó: Se utilizó la explicación para reorganizar el flujo. Se conservó el componente `ImageInput` y se adaptaron el servicio y el contexto para trabajar con las URL remotas. Se descartó colocar la lógica de Cloudinary directamente en la pantalla.
- Archivos y commit: `src/components/ImageInput.js`, `src/services/cloudinary.js`, `src/services/driver.js` y `src/context/DriverRegistrationContext.js` — `bbc2bb7`
- Verificación: Se seleccionaron imágenes desde el dispositivo, se comprobó la carga y se revisó que Firebase almacenara las URL.
- Aprendizaje: Se comprendió que seleccionar una imagen, subirla y guardar su referencia son procesos diferentes.

---

### Entrada #15

- Fecha: 2026-11-05
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Organizar el perfil, el mapa y la navegación principal del conductor
- Prompt reconstruido: “ya tengo la información del conductor guardada, ahora quiero mostrarla en el perfil y agregar las pantallas principales con mapa y pestañas, me ayudas a revisar mi estructura y a decidir qué debería ser un componente, qué debería quedar en la pantalla y en qué ruta pongo la navegación?”
- Resumen de la respuesta: Se recomendó separar los componentes del perfil, la navegación por pestañas, las pantallas y los servicios relacionados con el mapa. También se dieron ejemplos sobre la responsabilidad de cada archivo.
- Qué se usó / modificó / descartó: Se tomó la organización propuesta como referencia y se adaptó a las pantallas existentes. Se dividió la interfaz en componentes reutilizables y se corrigieron posteriormente algunos nombres de archivos.
- Archivos y commit: `src/navigation/DriverTabs.js`, `src/navigation/UberCloneStack.js`, `src/components/Map.js`, `src/components/ProfileSection.js`, `src/screens/driver/HomeScreen.js`, `src/screens/driver/ProfileScreen.js` y `src/utils/profileValidator.js` — `9e8d68d` y `15c63c8`
- Verificación: Se inició sesión, se recorrieron las pestañas, se abrió el perfil y se revisó la información mostrada junto con el mapa.
- Aprendizaje: Se comprendió que una pantalla coordina la información y que un componente reutilizable debe resolver una parte específica de la interfaz.

---

### Entrada #16

- Fecha: 2026-11-10
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Corregir el mapa y agregar la fecha de matrícula del vehículo
- Prompt reconstruido: “modifiqué el mapa y agregué la fecha de matrícula pero la pantalla del vehículo volvió a quedar muy grande, me ayudas a revisar el código, corregir las validaciones de la fecha y mover las funciones que no deberían estar dentro de la pantalla?”
- Resumen de la respuesta: Se recomendó extraer funciones relacionadas con el vehículo a un archivo auxiliar y actualizar las reglas de validación. También se revisaron los cambios realizados en el mapa y en el selector de fecha.
- Qué se usó / modificó / descartó: Se tomó como referencia la organización sugerida para mover funciones a `vehicleFunctions.js`. Las validaciones se adaptaron a los datos solicitados y en la pantalla se conservaron el estado y los componentes visuales.
- Archivos y commit: `src/components/Map.js`, `src/components/DateInput.js`, `src/screens/driver/VehicleScreen.js`, `src/data/vehicle.js`, `src/utils/registrationValidators.js` y `src/utils/vehicleFunctions.js` — `843096f`
- Verificación: Se probaron fechas válidas e inválidas, se revisó la conservación del valor y se comprobó el mapa en el dispositivo.
- Aprendizaje: Se comprendió que las funciones relacionadas con los datos del vehículo pueden reutilizarse y no deben quedar mezcladas con el renderizado.

---

### Entrada #17

- Fecha: 2026-11-10
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Revisar y organizar la implementación de solicitudes de viaje
- Prompt reconstruido: “estoy haciendo la simulación de solicitudes de viaje y ya tengo parte del código pero `HomeScreen` quedó con demasiada lógica, disponibilidad, alertas, viaje activo, mapa y cálculo de la tarifa, me ayudas a corregirlo y a decirme qué debería mover a hooks, servicios, utils y componentes?”
- Resumen de la respuesta: Se explicó cómo dividir el flujo por responsabilidades. Se dieron ejemplos para separar la disponibilidad, las solicitudes, la simulación, el ciclo del viaje, la navegación y el cálculo de la tarifa.
- Qué se usó / modificó / descartó: Se tomó como referencia la separación sugerida para reorganizar el código existente en hooks, servicios, funciones auxiliares y componentes. Las funciones se adaptaron a los estados utilizados por UberClone y se descartó mantener todo el flujo dentro de `HomeScreen`.
- Archivos y commit: `src/hooks/useDriverAvailability.js`, `src/hooks/useTripRequests.js`, `src/hooks/useTripSimulation.js`, `src/hooks/useTripLifecycle.js`, `src/hooks/useDriverTripNavigation.js`, componentes de solicitudes, servicios de viajes, `src/utils/calculateFare.js`, estilos modulares y `src/screens/driver/HomeScreen.js` — `d25a2f3`
- Verificación: Se activó la disponibilidad, se generaron solicitudes simuladas, se aceptaron y rechazaron viajes y se revisaron los cambios de estado y la tarifa.
- Aprendizaje: Se comprendió que los hooks permiten separar comportamientos relacionados y evitar que una pantalla concentre toda la lógica.

---

### Entrada #18

- Fecha: 2026-11-12
- Integrante: Luisa Mosquera
- Herramienta: ChatGPT
- Objetivo: Corregir y organizar la integración de prueba con Mercado Pago
- Prompt reconstruido: “ya empecé la integración con Mercado Pago pero no quiero dejar el `access_token` dentro de React Native, te paso el servicio y el flujo del pago que hice, me ayudas a corregirlo, a ejecutar la parte privada de forma local y a decirme dónde debería quedar cada archivo?”
- Resumen de la respuesta: Se explicó que el token privado no debía incluirse en la aplicación móvil y que la creación y consulta de órdenes debía realizarse desde un servidor. También se proporcionó un ejemplo para separar el servicio de React Native de la API local.
- Qué se usó / modificó / descartó: Se utilizó la explicación sobre por qué las operaciones privadas debían ejecutarse desde un servidor. También se tomó como referencia un ejemplo para separar el servicio de la aplicación y la API local. El flujo de pago y los estados que ya estaban implementados se conservaron. Se descartó llamar directamente a Mercado Pago desde el dispositivo utilizando el token secreto.
- Archivos y commit: `src/services/mercadoPago.js`, implementación local de la API de pagos, `src/components/ActiveTripDetails.js`, `src/screens/driver/HomeScreen.js`, `package.json` y `app.json` — `7d3abcb`, `9c4dd0b` y `d07fe67`
- Verificación: Se ejecutó el servidor local, se expuso el puerto mediante ngrok y se probó la creación y consulta de una orden desde la aplicación. También se comprobó que el token no quedara dentro del código de React Native.
- Aprendizaje: Se comprendió que guardar un token en `.env` no lo protege si su valor termina incorporado en el bundle de la aplicación móvil.
