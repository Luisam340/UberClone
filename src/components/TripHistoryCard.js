import { Pressable, Text, View } from 'react-native';
import { ChevronRight, CircleDot, MapPin } from 'lucide-react-native';

import { getTripHistorySummary } from '../utils/tripHistoryFunctions';
import { colors } from '../themes/colors';
import { styles } from '../styles/app.styles';

export function TripHistoryCard({ trip, onPress }) {
  const summary = getTripHistorySummary(trip);

  return (
    <Pressable
      style={styles.historyCard}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de carrera del ${summary.dateLabel}`}
    >
      <View style={styles.historyCardTop}>
        <View style={styles.historyCardHeading}>
          <Text style={styles.historyDate}>{summary.dateLabel}</Text>
          <Text style={styles.historyCategory}>{summary.categoryLabel}</Text>
        </View>
        <ChevronRight size={20} color={colors.textSecondary} />
      </View>

      <View style={styles.historyRouteRow}>
        <CircleDot size={16} color={colors.successText} />
        <Text numberOfLines={1} style={styles.historyAddress}>
          {summary.originLabel}
        </Text>
      </View>
      <View style={styles.historyRouteRow}>
        <MapPin size={16} color={colors.error} />
        <Text numberOfLines={1} style={styles.historyAddress}>
          {summary.destinationLabel}
        </Text>
      </View>

      <View style={styles.historyCardBottom}>
        <View>
          <Text style={styles.historyCaption}>Tarifa</Text>
          <Text style={styles.historyAmount}>{summary.fareLabel}</Text>
        </View>
        <View>
          <Text style={styles.historyCaption}>Ganancia neta</Text>
          <Text style={styles.historyEarnings}>{summary.earningsLabel}</Text>
        </View>
        <View style={styles.historyStatusBadge}>
          <Text style={styles.historyStatusText}>{summary.paymentLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}
