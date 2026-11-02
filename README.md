# UberClone

Aplicación móvil para conductores desarrollada con React Native y Expo. Incluye registro personal y del vehículo, gestión de viajes, geolocalización, pagos de prueba con Mercado Pago e historial de ganancias. Proyecto académico.

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

# Bitácora de desarrollo — UberClone

**Fecha:** 1 de noviembre de 2026
**Proyecto:** UberClone — Registro del conductor

## 1. Comunicación entre componentes mediante props

### Pregunta

¿Cómo puedo compartir la información de varias pantallas con un mismo componente padre?

### Explicación

Se analizó la comunicación entre componentes en React. Se explicó que un componente padre puede enviar funciones a sus componentes hijos mediante `props`.

El componente hijo puede ejecutar esas funciones para comunicar información al padre, sin acceder directamente a sus estados.

**Ejemplo de aprendizaje:**

```jsx
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

function Formulario({ onSave }) {
  const [ciudad, setCiudad] = useState('');

  return (
    <View>
      <TextInput value={ciudad} onChangeText={setCiudad} placeholder="Ciudad" />
      <Button title="Guardar" onPress={() => onSave(ciudad)} />
    </View>
  );
}

export function PantallaPrincipal() {
  const [ciudadGuardada, setCiudadGuardada] = useState('');

  return (
    <View>
      <Formulario onSave={setCiudadGuardada} />
      <Text>Ciudad: {ciudadGuardada}</Text>
    </View>
  );
}
```

En el ejemplo, `Formulario` no modifica directamente el estado de `PantallaPrincipal`. En su lugar, ejecuta `onSave` para comunicar el valor.

### Implementación trabajada

Se revisó la comunicación entre los tres formularios del registro y `DriverRegistrationScreen`, identificando las llamadas a `onSave` que hacían falta después de validar los campos.

### Verificación

Se indicó utilizar `console.log` dentro de un `useEffect` para comprobar las actualizaciones recibidas por el componente padre.

```text
[REGISTRATION] Personal saved: true
[REGISTRATION] Vehicle saved: true
[REGISTRATION] Documents saved: true
```

**Aprendizaje:** Las funciones enviadas mediante props permiten que los componentes hijos comuniquen información al padre y que este mantenga los datos necesarios para coordinar diferentes pantallas.

---

## 2. Diferencia entre `onChange` y `onSave`

### Pregunta

¿Qué sucede si regreso a una pantalla, modifico un dato y avanzo directamente a otra pestaña?

### Explicación

Se identificó que el formulario únicamente comunicaba los datos al presionar «Siguiente». Por eso, las modificaciones posteriores podían no estar reflejadas en el componente padre.

Se estudiaron dos responsabilidades:

- `onChange`: notificar una modificación.
- `onSave`: confirmar una etapa después de validarla.

**Ejemplo de aprendizaje:**

```jsx
import { useState } from 'react';
import { TextInput, Button } from 'react-native';

export function FormularioCiudad({ onChange, onSave }) {
  const [ciudad, setCiudad] = useState('');

  const cambiarCiudad = (valor) => {
    setCiudad(valor);
    onChange(valor);
  };

  return (
    <>
      <TextInput value={ciudad} onChangeText={cambiarCiudad} />

      <Button title="Confirmar" onPress={() => onSave(ciudad)} />
    </>
  );
}
```

Se explicó que `setCiudad()` actualiza el estado para el siguiente renderizado, por lo que dentro de `cambiarCiudad` se utiliza directamente `valor` para comunicar el dato más reciente.

### Implementación trabajada

Se incorporó la sincronización mediante `onChange`, conservando `onSave` para confirmar los formularios después de validarlos.

### Verificación

Se indicó completar Información Personal, modificar posteriormente el correo y repetir la validación.

```text
[REGISTRATION] Personal saved: true
[REGISTRATION] Personal saved: false
[REGISTRATION] Personal saved: true
```

**Aprendizaje:** Sincronizar un dato y validar un formulario son operaciones diferentes. Una etapa completada debe volver a quedar pendiente cuando se modifica su información.

---

## 3. Uso de `useEffect`, `useCallback` y `useRef`

### Pregunta

¿Cómo puedo detectar los cambios de varios campos sin tener que crear una función diferente para cada uno?

### Explicación

Se estudiaron tres hooks de React:

**`useEffect`**

Permite ejecutar una acción después de que React actualiza el componente, según las dependencias indicadas.

```javascript
useEffect(() => {
  console.log('[FORM] Value changed:', valor);
}, [valor]);
```

**`useCallback`**

Permite conservar la referencia de una función entre renderizados mientras sus dependencias no cambien.

```javascript
const guardar = useCallback((dato) => {
  setResultado(dato);
}, []);
```

**`useRef`**

Permite conservar un valor entre renderizados sin provocar otro renderizado al modificarlo.

```javascript
const primeraEjecucion = useRef(true);

useEffect(() => {
  if (primeraEjecucion.current) {
    primeraEjecucion.current = false;
    return;
  }

  console.log('[FORM] Data modified');
}, [valor]);
```

### Implementación trabajada

Se utilizaron estos conceptos para sincronizar los formularios y distinguir su inicialización de los cambios posteriores.

### Verificación

Se indicó comprobar que ingresar por primera vez a una pantalla no invalidara automáticamente la etapa y que modificar un campo sí produjera el cambio de estado correspondiente.

**Aprendizaje:** Cada hook tiene una responsabilidad diferente. `useEffect` permite reaccionar a cambios, `useCallback` mantiene referencias de funciones y `useRef` conserva valores auxiliares sin generar renderizados adicionales.

---

## 4. Conservación de información entre pestañas

### Pregunta

¿Cómo puedo evitar que los valores ingresados desaparezcan cuando cambio de pestaña?

### Explicación

Se explicó que la información puede mantenerse en un componente padre y utilizarse para inicializar nuevamente un formulario cuando sea necesario.

**Ejemplo de aprendizaje:**

```jsx
function FormularioProducto({ initialData }) {
  const [producto, setProducto] = useState(initialData.nombre);

  return <TextInput value={producto} onChangeText={setProducto} />;
}
```

En este ejemplo, `initialData` proporciona el valor inicial del campo. También se aclaró que `useState` no vuelve a inicializarse automáticamente cada vez que cambia una prop.

### Implementación trabajada

Se revisó la recuperación de datos de cada formulario desde los estados compartidos del registro.

### Verificación

Se indicó completar Vehículo, avanzar a Documentos y regresar para comprobar que continuaran visibles la fotografía, placa, marca y año.

Se confirmó que los datos no desaparecían al cambiar entre pestañas.

**Aprendizaje:** Mantener la información en un componente común permite compartirla entre pantallas. También es importante distinguir entre un valor inicial y un valor que debe mantenerse sincronizado continuamente.

---

## 5. Organización de errores con el operador de propagación

### Pregunta

¿Puedo llevar las estructuras utilizadas por `setErrors` a los archivos de datos?

### Explicación

Se aclaró que `setErrors` pertenece al estado del componente, pero que la construcción de sus mensajes puede realizarse mediante funciones independientes.

Se estudió el operador de propagación (`...`), que permite copiar propiedades de un objeto y sobrescribirlas con otros valores.

**Ejemplo de aprendizaje:**

```javascript
const erroresIniciales = {
  usuario: '',
  correo: '',
  telefono: '',
};

const erroresValidacion = {
  correo: 'Correo inválido',
};

const errores = {
  ...erroresIniciales,
  ...erroresValidacion,
};

console.log(errores);
```

**Resultado:**

```javascript
{
  usuario: '',
  correo: 'Correo inválido',
  telefono: ''
}
```

### Implementación trabajada

Se organizaron las funciones auxiliares que preparan los errores de Datos personales, Vehículo y Documentos.

### Verificación

Se indicó comprobar que los mensajes continuaran apareciendo debajo de los campos incorrectos.

No quedó registrado un resultado específico de esta prueba independiente.

**Aprendizaje:** El operador de propagación facilita reutilizar estructuras y evita repetir todas las propiedades al preparar los mensajes de error.

---

## 7. Persistencia de autenticación con AsyncStorage

### Pregunta

¿Por qué Firebase indica que la sesión del usuario no se conservará cuando se cierre la aplicación?

### Explicación

Se analizó la advertencia de Firebase Authentication y se explicó la diferencia entre conservar información en memoria y almacenarla de forma persistente.

Se estudió AsyncStorage como una solución de almacenamiento local para React Native.

**Ejemplo de aprendizaje:**

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

async function guardarPreferencia() {
  await AsyncStorage.setItem('tema', 'oscuro');
}

async function consultarPreferencia() {
  const tema = await AsyncStorage.getItem('tema');

  console.log('[STORAGE] Theme:', tema);
}
```

Se explicó que `setItem` guarda un valor y `getItem` permite recuperarlo posteriormente.

Este ejemplo utiliza una preferencia sencilla para comprender el almacenamiento local. No representa la implementación interna de persistencia de Firebase Authentication.

### Implementación trabajada

Se instaló AsyncStorage `2.2.0` y se configuró su uso con Firebase Authentication `13.1.0`.

### Verificación

Se indicó reiniciar Expo y comprobar que desapareciera la advertencia de Firebase sobre la ausencia de AsyncStorage.

La prueba de persistencia de una sesión real quedó pendiente hasta implementar el inicio de sesión.

**Aprendizaje:** La persistencia permite conservar información entre ejecuciones de una aplicación. En React Native, algunos servicios necesitan un mecanismo de almacenamiento específico para mantener sus estados.

---

## 9. Diagnóstico de tipos y manejo de errores

### Pregunta

¿Por qué Visual Studio Code indica que `getReactNativePersistence` no existe y que `error` es de tipo `unknown`?

### Explicación

Se estudiaron las diferencias entre las declaraciones de tipos y los módulos utilizados durante la ejecución.

También se explicó que un error capturado no necesariamente tiene una propiedad `code`, por lo que debe comprobarse antes de acceder a ella.

**Ejemplo de aprendizaje:**

```javascript
try {
  throw { code: 'DEMO_ERROR', message: 'Error de ejemplo' };
} catch (error) {
  if (error !== null && typeof error === 'object' && 'code' in error) {
    console.log('[ERROR] Code:', error.code);
  }
}
```

También se revisó cómo `moduleResolution` y `customConditions` participan en la resolución de módulos del proyecto.

### Implementación trabajada

Se revisaron las configuraciones del editor y las comprobaciones necesarias para manejar errores de forma segura.

### Verificación

Se indicó reiniciar el servidor de TypeScript en Visual Studio Code y revisar nuevamente los diagnósticos.

Los ajustes iniciales no eliminaron completamente el problema de reconocimiento de tipos.

**Aprendizaje:** Un error del analizador estático no siempre equivale a un error de ejecución. Es necesario revisar ambos por separado y comprobar las características de los valores antes de acceder a sus propiedades.

---

## 10. Error nativo de AsyncStorage en iOS

### Pregunta

¿Por qué aparece `NativeModule: AsyncStorage is null` si la dependencia ya está instalada?

### Problema encontrado

Al ejecutar UberClone en el iPhone apareció:

```text
[@RNC/AsyncStorage]: NativeModule: AsyncStorage is null.
```

### Explicación

Se explicó que AsyncStorage contiene código nativo y que instalarlo en las dependencias JavaScript no significa que ya esté incluido en la aplicación compilada.

Se aclaró la diferencia entre dos procesos:

- **Metro y Fast Refresh:** actualizan el código JavaScript.
- **Compilación nativa:** incorpora nuevas dependencias de iOS o Android.

### Implementación trabajada

Se reconstruyó la aplicación para iOS utilizando:

```bash
npx expo run:ios --device
```

### Verificación

Se indicó volver a ejecutar UberClone y comprobar que desapareciera el error de AsyncStorage.

**Resultado:** Después de recompilar, el error desapareció.

**Aprendizaje:** Las dependencias nativas requieren una nueva compilación de la aplicación. Actualizar únicamente el código JavaScript no incorpora módulos nativos que no estén incluidos en la versión instalada.

---

## Conclusión de la jornada

Se avanzó en la comunicación de datos entre los formularios, su sincronización, la organización de validaciones y la preparación de Firebase para UberClone.

Las pruebas con `console.log` permitieron comprobar los cambios de estado y confirmar que los formularios conservaban la información durante la navegación.

También se comprendió la diferencia entre las dependencias JavaScript y las nativas, resolviendo el error de AsyncStorage mediante una nueva compilación para iOS.

**Estado actual:** Formularios sincronizados, información conservada entre pestañas y aplicación ejecutándose nuevamente con AsyncStorage integrado.

**Pendiente:** Implementar el registro mediante Firebase Authentication, comprobar la persistencia real de la sesión y realizar las primeras operaciones de lectura y escritura en Cloud Firestore.
