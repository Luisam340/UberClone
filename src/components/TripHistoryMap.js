import { Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { colors } from '../themes/colors';
import { styles } from '../styles/app.styles';

export function TripHistoryMap({ origin, destination, path, region }) {
  if (!region) {
    return (
      <View style={styles.historyMapFallback}>
        <Text style={styles.historyCaption}>
          No hay coordenadas para mostrar el recorrido.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.historyMapContainer}>
      <MapView
        style={styles.historyMap}
        initialRegion={region}
        scrollEnabled={false}
        pitchEnabled={false}
      >
        {origin && (
          <Marker
            coordinate={origin}
            title="Origen"
            pinColor={colors.successText}
          />
        )}
        {destination && (
          <Marker
            coordinate={destination}
            title="Destino"
            pinColor={colors.primary}
          />
        )}
        {path.length > 1 && (
          <Polyline
            coordinates={path}
            strokeColor={colors.primary}
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
}
