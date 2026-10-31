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
