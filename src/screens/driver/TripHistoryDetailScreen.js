import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { TripHistoryMap } from '../../components/TripHistoryMap';
import { TripHistoryDetailSection } from '../../components/TripHistoryDetailSection';
import { useTripHistoryDetail } from '../../hooks/useTripHistoryDetail';
import { colors } from '../../themes/colors';
import { styles } from '../../styles/app.styles';

export default function TripHistoryDetailScreen({ route }) {
  const { loading, error, details, mapData } = useTripHistoryDetail(
    route.params?.tripId,
  );

  if (loading) {
    return (
      <View style={styles.profileCentered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !details) {
    return (
      <View style={styles.profileCentered}>
        <Text style={styles.profileEmptyText}>
          {error || 'Viaje no disponible.'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.historyDetailContent}
    >
      <Text style={styles.historyTitle}>Detalle del viaje</Text>
      <Text style={styles.historySubtitle}>{details.dateLabel}</Text>

      <TripHistoryMap {...mapData} />
      <TripHistoryDetailSection fields={details.routeFields} />
      <TripHistoryDetailSection
        title="Resumen de ganancias"
        fields={details.earningsFields}
      />
      <TripHistoryDetailSection
        title="Pago y pasajero"
        fields={details.paymentFields}
      />
    </ScrollView>
  );
}
