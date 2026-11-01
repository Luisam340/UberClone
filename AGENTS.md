# Bitácora de aprendizaje — UberClone

**Proyecto:** UberClone  
**Tecnologías:** React Native, Expo y JavaScript  
**Entorno:** VS Code, macOS, Xcode 27 y dispositivo iOS  
**Fecha:** 31 de octubre de 2026

---

## 1. Personalización de la aplicación

**Luisa preguntó:** ¿Cómo funcionan los íconos adaptables de Android y qué propósito cumple cada imagen configurada en Expo?

**ChatGPT respondió:**

Android permite utilizar íconos adaptables compuestos por distintas capas. La imagen principal (`foregroundImage`) contiene los elementos visuales destacados, mientras que `backgroundImage` proporciona el fondo.

También puede definirse `monochromeImage`, que Android utiliza para adaptar el ícono a los colores del sistema, y `backgroundColor`, que sirve como color de respaldo.

**Implementación realizada:**

Se diseñaron los íconos de UberClone con una estética kawaii, utilizando la paleta lavanda, menta y morado.

**Aprendizaje:** Los íconos adaptables permiten que Android ajuste la apariencia del ícono sin perder sus elementos principales.

---

## 2. Configuración de una pantalla de inicio personalizada

**Luisa preguntó:** ¿Cómo se implementa un splash screen en Expo y qué configuraciones permiten personalizar su imagen, tamaño y fondo?

**ChatGPT respondió:**

Expo ofrece el plugin `expo-splash-screen`, que permite configurar la imagen mostrada durante el inicio de la aplicación.

Se explicó el propósito de `image`, `imageWidth`, `resizeMode` y `backgroundColor`, así como la estructura correcta para registrar el plugin en `app.json`.

**Implementación realizada:**

Se instaló el paquete correspondiente:

```bash
npx expo install expo-splash-screen
```

Se incorporó el splash kawaii y se configuró el fondo `#FAF9FC`.

**Aprendizaje:** La pantalla de inicio forma parte de la configuración nativa y sus modificaciones requieren una nueva compilación.

---

## 3. Incompatibilidad entre Expo SDK 57 y Xcode 27

**Luisa preguntó:** ¿Por qué UberClone presenta problemas al ejecutarse en iOS y qué configuración necesita Expo para funcionar correctamente con Xcode 27?

**ChatGPT respondió:**

Durante el desarrollo se identificó un problema de compatibilidad entre Expo SDK 57 y Xcode 27, relacionado con la configuración del ciclo de vida de las aplicaciones iOS mediante `UIScene`.

Para solucionarlo se utilizó `expo-build-properties`, que permite establecer determinadas propiedades nativas del proyecto desde la configuración de Expo.

### Solución aplicada

**Paso 1. Instalación de la dependencia**

Se ejecutó:

```bash
npx expo install expo-build-properties
```

**Paso 2. Modificación de app.json**

Se agregó la siguiente configuración:

```json
[
  "expo-build-properties",
  {
    "ios": {
      "enableSceneSupport": true
    }
  }
]
```

Esta configuración habilita el soporte de escenas de iOS, necesario para el comportamiento nativo que se estaba corrigiendo.

**Paso 3. Regeneración del proyecto nativo**

Se ejecutó:

```bash
npx expo prebuild --clean
```

Y posteriormente:

```bash
npx expo run:ios --device
```

De esta manera se regeneraron los archivos nativos para incorporar la configuración y se compiló nuevamente la aplicación.

### Diagnósticos adicionales

Durante las pruebas también se revisaron:

- Firma digital mediante `codesign`.
- Certificado de desarrollo de Apple.
- Identificador de la aplicación.
- Perfil de aprovisionamiento.
- Autorización y confianza del dispositivo.

Se confirmó que la firma era válida, el perfil estaba vigente y el iPhone estaba autorizado.

### Causa y solución

**Causa identificada:** Incompatibilidad entre Expo SDK 57 y Xcode 27, asociada con la configuración de soporte para escenas de iOS.

**Solución aplicada:** Instalar `expo-build-properties`, habilitar `ios.enableSceneSupport` en `app.json` y regenerar el proyecto nativo.

**Aprendizaje:** Un problema de ejecución nativa no siempre se origina en el código JavaScript o en los certificados. Es necesario comprobar la compatibilidad de las herramientas y conocer las propiedades nativas que Expo permite configurar.

---

## 4. Ejecución del código JavaScript mediante Metro

**Luisa preguntó:** ¿Qué significa el error `No script URL provided` y cómo se relaciona con el funcionamiento de React Native durante el desarrollo?

**ChatGPT respondió:**

Metro Bundler es el sistema encargado de preparar y servir el código JavaScript de React Native.

Durante el desarrollo, una aplicación puede necesitar conectarse a Metro para obtener el código que debe ejecutar.

**Solución aplicada:**

```bash
npx expo start --clear
```

**Resultado:** La aplicación consiguió cargar el código JavaScript y mostrar su pantalla inicial.

**Aprendizaje:** Es necesario diferenciar el código nativo de la aplicación del bundle JavaScript que Metro proporciona durante el desarrollo.

---

## 5. Regeneración de recursos nativos

**Luisa preguntó:** ¿Cómo se puede realizar una regeneración limpia del proyecto iOS para aplicar cambios en recursos nativos, como el splash screen?

**ChatGPT respondió:**

Se explicó que `expo prebuild --clean` regenera el proyecto nativo, mientras que `expo run:ios --device` compila e instala la aplicación en un dispositivo físico.

**Comando utilizado:**

```bash
npx expo prebuild --platform ios --clean && npx expo run:ios --device
```

También se explicó el operador `&&`, que permite ejecutar el segundo comando únicamente si el primero termina correctamente.

**Resultado:** Se regeneró el proyecto, pero persistió el problema visual del splash.

**Aprendizaje:** Limpiar y regenerar una compilación no corrige necesariamente problemas presentes en los propios archivos gráficos.

---

## 6. Planificación de la navegación

**Luisa preguntó:** ¿Qué componentes de navegación conviene utilizar en React Native para separar el inicio de sesión del registro de conductores y conservar la información de los formularios?

**ChatGPT respondió:**

Se propuso utilizar React Navigation para administrar dos niveles de navegación: el acceso a la aplicación y las etapas del registro del conductor.

También se identificó la necesidad de compartir el estado de los formularios para conservar los datos al cambiar entre pestañas.

**Estado:** Pendiente de implementación.

**Próximo aprendizaje:** Stack Navigator, Tab Navigator, componentes, props, `useState` y Context.
# Bitácora de aprendizaje — UberClone

## 7. Organización de estilos en React Native

**Luisa preguntó:** ¿Es posible definir los estilos de React Native en archivos independientes y reutilizarlos mediante importaciones para mantener una arquitectura más organizada?

**ChatGPT respondió:**

React Native permite exportar objetos creados mediante `StyleSheet.create()` desde módulos de JavaScript e importarlos en los componentes que los necesitan.

Se explicó la diferencia entre la configuración visual global (*theme*) y los estilos particulares de cada pantalla.

**Organización propuesta:**

- `theme/`: colores, tipografías y espaciados compartidos.
- `styles/`: estilos particulares de cada pantalla.
- `screens/`: componentes responsables de presentar la interfaz y gestionar su comportamiento.

**Aprendizaje:** Separar la lógica de presentación de las definiciones de estilo facilita el mantenimiento, la reutilización y la consistencia visual.

**Estado:** Organización propuesta, pendiente de implementación.


## 8. Manejo del teclado y desplazamiento de formularios con KeyboardAvoidingView y ScrollView

**Luisa preguntó:** ¿Cómo puedo evitar que el teclado del iPhone cubra los campos del formulario y permitir que el usuario se desplace por la pantalla sin que el teclado desaparezca inesperadamente?

**ChatGPT respondió:**

En React Native existen componentes que permiten controlar el comportamiento de la interfaz cuando aparece el teclado virtual y cuando el contenido de una pantalla supera el espacio disponible.

Se estudiaron principalmente dos componentes:

**KeyboardAvoidingView**

Es un componente de React Native que ajusta el espacio disponible para sus elementos hijos cuando aparece el teclado virtual.

Puede utilizar diferentes comportamientos mediante la propiedad `behavior`:

- `padding`: agrega espacio para compensar la aparición del teclado.
- `height`: modifica la altura disponible del contenedor.
- `position`: ajusta la posición del contenido.

En iOS se puede utilizar `behavior="padding"` para ayudar a mantener visibles los campos del formulario.

**ScrollView**

Permite desplazar vertical u horizontalmente el contenido de una pantalla cuando este ocupa más espacio del disponible.

Se explicaron algunas de sus propiedades:

- `contentContainerStyle`: aplica estilos al contenedor interno donde se encuentran los elementos.
- `keyboardShouldPersistTaps`: controla cómo se procesan las pulsaciones mientras el teclado está abierto.
- `keyboardDismissMode`: determina cuándo debe ocultarse el teclado durante el desplazamiento.

Se identificó que `keyboardDismissMode="interactive"` permite un comportamiento de desplazamiento más natural en iOS.

### Implementación trabajada

Se utilizó una estructura de este tipo para los formularios de UberClone:

```jsx
<View style={{ flex: 1 }}>
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior="padding"
  >
    <ScrollView
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      contentContainerStyle={{
        padding: 20,
        paddingBottom: 40,
      }}
    >
      {/* Campos del formulario */}
    </ScrollView>
  </KeyboardAvoidingView>
</View>
```

### Problema encontrado

Durante las pruebas del formulario se observó un comportamiento incómodo: el teclado podía desaparecer al intentar desplazarse por los campos.

También fue necesario revisar el uso de `flex: 1` para que los contenedores ocuparan el espacio disponible.

### Solución aplicada

Se trabajó con `KeyboardAvoidingView` y `ScrollView`, ajustando el comportamiento mediante `keyboardDismissMode="interactive"`.

**Aprendizaje:** En React Native, el teclado virtual debe considerarse al diseñar formularios. `KeyboardAvoidingView` permite adaptar el contenido a su aparición, mientras que `ScrollView` facilita desplazarse entre campos cuando la pantalla no tiene suficiente espacio.

---

**Fecha:** 1 de noviembre de 2026

---

## 9. Propiedades de TextInput y manejo de entradas de usuario

**Luisa preguntó:** ¿Cómo puedo configurar los campos de texto de UberClone para controlar el tipo de teclado, las mayúsculas, la longitud máxima y la visibilidad de las contraseñas? ¿Existe una propiedad equivalente a `required` o `minLength` de HTML?

**ChatGPT respondió:**

`TextInput` es el componente de React Native utilizado para recibir información escrita por el usuario.

Se estudiaron las siguientes propiedades:

| Propiedad | Función |
|---|---|
| `value` | Establece el valor mostrado en el campo. |
| `onChangeText` | Ejecuta una función cuando cambia el texto. |
| `placeholder` | Muestra un texto orientativo. |
| `placeholderTextColor` | Define el color del texto orientativo. |
| `keyboardType` | Permite elegir el tipo de teclado. |
| `autoCapitalize` | Configura la capitalización automática. |
| `maxLength` | Limita la cantidad máxima de caracteres. |
| `secureTextEntry` | Oculta el contenido de un campo. |
| `autoCorrect` | Controla la autocorrección. |

### Implementación realizada

**Campo de nombre completo:**

```jsx
<TextInput
  style={styles.input}
  placeholder="Ingresa tu nombre"
  placeholderTextColor={colors.textSecondary}
  keyboardType="default"
  autoCapitalize="words"
  value={name}
  onChangeText={setName}
/>
```

**Campo de placa del vehículo:**

```jsx
<TextInput
  style={styles.input}
  placeholder="ABC123"
  autoCapitalize="characters"
  maxLength={6}
  value={plate}
  onChangeText={(text) => setPlate(text.toUpperCase())}
/>
```

Se explicó que `autoCapitalize` controla principalmente el comportamiento del teclado, mientras que `toUpperCase()` convierte directamente el texto recibido.

**Campo de contraseña:**

```jsx
<TextInput
  secureTextEntry={!showPassword}
  value={password}
  onChangeText={setPassword}
/>
```

Se utilizaron estados independientes para mostrar u ocultar la contraseña y su confirmación.

### Problemas y dudas encontradas

Se investigó si React Native dispone de propiedades equivalentes a `required` y `minLength` de HTML.

Se aclaró que `TextInput` no proporciona esas validaciones automáticas, por lo que deben implementarse mediante JavaScript o una biblioteca de formularios.

También se exploró React Hook Form, pero se decidió conservar el manejo de estados con `useState`.

**Estado:** Se trabajó en la configuración de los campos y sus propiedades. Las validaciones completas quedaron pendientes.

**Aprendizaje:** `TextInput` permite controlar cómo se introduce la información, pero no garantiza automáticamente que los datos sean correctos. Es necesario diferenciar las propiedades de entrada de las reglas de validación.

---

## 10. Advertencia de DateTimePicker y propiedades obsoletas

**Luisa preguntó:** ¿Por qué aparece una advertencia indicando que `onChange` está obsoleto en DateTimePicker si mi componente utiliza `onConfirm` y `onCancel`?

**ChatGPT respondió:**

Se explicó que `react-native-modal-datetime-picker` funciona como un componente que envuelve al selector nativo de `@react-native-community/datetimepicker`.

Una propiedad obsoleta (*deprecated*) es una funcionalidad que todavía puede utilizarse, pero cuyo uso ya no es recomendado.

Durante el desarrollo apareció la advertencia:

```text
DateTimePicker: onChange is deprecated.
Use onValueChange, onDismiss and
onNeutralButtonPress instead.
```

### Implementación utilizada

```jsx
<DateTimePickerModal
  isVisible={visible}
  mode="date"
  display="inline"
  locale="es-CO"
  date={value ?? new Date(2000, 0, 1)}
  maximumDate={new Date()}
  onConfirm={(date) => {
    setVisible(false);
    onChange(date);
  }}
  onCancel={() => setVisible(false)}
/>
```

### Diagnóstico realizado

Se inspeccionó el código de la dependencia instalada en `node_modules`.

Se identificó que `react-native-modal-datetime-picker` utilizaba internamente `onChange` para comunicarse con el componente nativo.

Esto permitió comprender que la advertencia no se originaba directamente en las funciones `onConfirm` y `onCancel` definidas en UberClone.

### Decisión tomada

Se consideraron alternativas como modificar la implementación o revisar las versiones de las dependencias.

Sin embargo, se decidió conservar la implementación existente y no introducir cambios adicionales en ese momento.

**Estado:** El selector de fechas quedó implementado. La advertencia continúa pendiente de solución.

**Aprendizaje:** Una advertencia puede originarse en el código interno de una dependencia. Es importante identificar su procedencia antes de modificar el código de la aplicación.

---

## 11. Diagnóstico del cierre inesperado al solicitar acceso a la cámara

**Luisa preguntó:** ¿Por qué UberClone se cierra completamente en mi iPhone cuando selecciono la opción Cámara del componente `ImageInput`?

**ChatGPT respondió:**

Se explicó que un cierre completo de una aplicación iOS puede estar relacionado con una operación nativa, como solicitar permisos o abrir la cámara.

A diferencia de algunos errores de JavaScript, un fallo nativo puede cerrar la aplicación antes de que el bloque `try/catch` reciba una excepción.

### Implementación inicial

Se utilizó `expo-image-picker` para permitir que el conductor tomara una fotografía o seleccionara una imagen de la galería.

La autorización se solicitaba mediante:

```javascript
const permission =
  await ImagePicker.requestCameraPermissionsAsync();
```

Y la cámara se abría con:

```javascript
const result = await ImagePicker.launchCameraAsync({
  mediaTypes: ['images'],
  allowsEditing: false,
  quality: 1,
});
```

### Primer diagnóstico

Se agregaron mensajes mediante `console.log()` para determinar en qué momento se cerraba la aplicación.

Los registros mostraron:

```text
[IMAGE] Source: camera
[CAMERA] Requesting permission
```

Después de este punto, UberClone se cerraba.

Esto permitió localizar el fallo durante la solicitud del permiso de cámara, antes de intentar abrirla.

### Segundo diagnóstico

Se utilizó `getCameraPermissionsAsync()` para consultar la autorización existente sin solicitarla nuevamente:

```javascript
const permission =
  await ImagePicker.getCameraPermissionsAsync();

console.log('[CAMERA] Status:', permission.status);
console.log('[CAMERA] Granted:', permission.granted);
console.log(
  '[CAMERA] Can ask again:',
  permission.canAskAgain
);
```

Se obtuvieron los siguientes resultados:

```text
[CAMERA] Status: denied
[CAMERA] Granted: false
[CAMERA] Can ask again: false
```

Se aprendió que:

- `status` indica el estado del permiso.
- `granted` indica si el acceso está autorizado.
- `canAskAgain` indica si puede volver a solicitarse desde la aplicación.

### Solución implementada

Se creó una función para comprobar los permisos antes de intentar abrir la cámara.

Cuando `canAskAgain` era `false`, se ofrecía abrir la configuración de iOS mediante `Linking.openSettings()`.

```javascript
if (!permission.canAskAgain) {
  Alert.alert(
    'Permiso de cámara bloqueado',
    'Debes habilitar el acceso a la cámara desde la configuración de tu iPhone.',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Abrir configuración',
        onPress: () => Linking.openSettings(),
      },
    ]
  );

  return false;
}
```

### Diagnósticos adicionales

Durante la investigación se revisaron:

- Los permisos otorgados a UberClone en iOS.
- La configuración nativa de la aplicación.
- El estado del emparejamiento con Xcode.
- La conexión inalámbrica entre el Mac y el iPhone.

Después de un restablecimiento de permisos del dispositivo se presentaron dificultades con la conexión inalámbrica de Xcode. Posteriormente, se recuperaron tanto la conectividad a Internet como la conexión del iPhone.

### Resultado

Después de corregir la configuración nativa y volver a ejecutar la aplicación, se confirmó que **la cámara y la galería funcionaban correctamente**.

**Aprendizaje:** Los mensajes de diagnóstico permiten localizar el punto donde ocurre un fallo. También es necesario diferenciar errores de JavaScript de problemas relacionados con permisos y configuración nativa de iOS.

Los restablecimientos generales del dispositivo deben evitarse cuando existen alternativas de diagnóstico más específicas.

---

## 12. Configuración de permisos nativos mediante app.json y Expo Prebuild

**Luisa preguntó:** ¿Cómo puedo configurar correctamente los permisos de cámara y galería para una aplicación Expo instalada directamente en un iPhone?

**ChatGPT respondió:**

Expo utiliza el archivo `app.json` para definir la configuración de la aplicación.

Los *config plugins* permiten aplicar determinadas configuraciones nativas durante la generación o sincronización de los proyectos de iOS y Android.

### Problema encontrado

Inicialmente, `app.json` contenía los plugins `expo-splash-screen`, `expo-build-properties`, `expo-font` y `@react-native-community/datetimepicker`, pero no incluía una entrada explícita para `expo-image-picker`.

### Configuración implementada

Se agregó el siguiente plugin:

```json
[
  "expo-image-picker",
  {
    "photosPermission": "UberClone necesita acceder a tus fotos para completar el registro del conductor.",
    "cameraPermission": "UberClone necesita acceder a la cámara para tomar fotografías del conductor, vehículo y documentos.",
    "microphonePermission": "UberClone necesita acceder al micrófono cuando se utilicen funciones de captura audiovisual."
  }
]
```

### Primera compilación

Se ejecutó:

```bash
npx expo run:ios --device
```

La compilación terminó correctamente:

```text
Build Succeeded

0 error(s), and 0 warning(s)
```

Sin embargo, el permiso continuaba denegado.

### Verificación del archivo Info.plist

Se utilizó el comando:

```bash
plutil -p ios/UberClone/Info.plist | grep -E "NSCameraUsageDescription|NSMicrophoneUsageDescription|NSPhotoLibraryUsageDescription"
```

Inicialmente, el comando no devolvió resultados.

Se explicó que `Info.plist` contiene propiedades de configuración de las aplicaciones iOS, incluidas descripciones de privacidad necesarias para solicitar acceso a determinados recursos.

### Solución aplicada

Se ejecutó:

```bash
npx expo prebuild --platform ios
```

Después se volvió a consultar `Info.plist`.

Esta vez se encontraron las siguientes claves:

```text
NSCameraUsageDescription
NSMicrophoneUsageDescription
NSPhotoLibraryUsageDescription
```

Sus valores correspondían a los mensajes configurados previamente en `app.json`.

Esto confirmó que las descripciones de privacidad habían sido incorporadas al proyecto nativo.

### Diferencia entre los comandos

**`npx expo prebuild --platform ios`**

Prepara o sincroniza el proyecto nativo de iOS según la configuración de Expo.

**`npx expo run:ios --device`**

Compila e instala la aplicación en un dispositivo físico.

**`npx expo start`**

Inicia Metro para servir el código JavaScript durante el desarrollo.

Se explicó que modificar el código JavaScript normalmente no requiere recompilar la aplicación nativa, pero los cambios de permisos pueden necesitar una nueva compilación.

### Resultado final

Se confirmó que las claves de permisos aparecían en `Info.plist`.

Posteriormente, se comprobó que la cámara y la galería funcionaban correctamente desde UberClone.

No se realizó una prueba aislada que permitiera atribuir el resultado exclusivamente a un cambio, pero la actualización de la configuración nativa formó parte del proceso que permitió recuperar el funcionamiento.

**Aprendizaje:** Los cambios declarados en `app.json` deben reflejarse en los archivos nativos utilizados durante la compilación.

También aprendí a utilizar `plutil` para verificar propiedades de iOS y a distinguir entre preparar el proyecto nativo, compilar la aplicación y ejecutar Metro.