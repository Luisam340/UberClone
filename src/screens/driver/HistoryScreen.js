import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { CalendarDays } from 'lucide-react-native';

import { DateInput } from '../../components/DateInput';
import { TripHistoryCard } from '../../components/TripHistoryCard';
import { useTripHistory } from '../../hooks/useTripHistory';
import {
  HISTORY_PERIODS,
  HISTORY_PAYMENT_METHODS,
} from '../../utils/tripHistoryFunctions';
import { colors } from '../../themes/colors';
import { styles } from '../../styles/app.styles';

export default function HistoryScreen({ navigation }) {
  const {
    period,
    setPeriod,
    method,
    setMethod,
    rangeStart,
    setRangeStart,
    rangeEnd,
    setRangeEnd,
    rangeInvalid,
    visibleTrips,
    hasMore,
    loading,
    loadingMore,
    error,
    refresh,
    loadMore,
  } = useTripHistory();

  const header = (
    <View style={styles.historyHeader}>
      <Text style={styles.historyTitle}>Historial de carreras</Text>
      <Text style={styles.historySubtitle}>
        Consulta tus recorridos y ganancias.
      </Text>

      <Text style={styles.historyFilterTitle}>Período</Text>
      <View style={styles.historyChips}>
        {HISTORY_PERIODS.map((option) => (
          <Pressable
            key={option.key}
            style={[
              styles.historyChip,
              period === option.key && styles.historyChipSelected,
            ]}
            onPress={() => setPeriod(option.key)}
          >
            <Text
              style={[
                styles.historyChipText,
                period === option.key && styles.historyChipTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {period === 'range' && (
        <View style={styles.historyRange}>
          <View style={styles.historyRangeField}>
            <DateInput
              label="Desde"
              value={rangeStart}
              onChange={setRangeStart}
            />
          </View>
          <View style={styles.historyRangeField}>
            <DateInput label="Hasta" value={rangeEnd} onChange={setRangeEnd} />
          </View>
          {rangeInvalid && (
            <Text style={styles.historyHint}>
              Selecciona un rango de fechas válido.
            </Text>
          )}
        </View>
      )}

      <Text style={styles.historyFilterTitle}>Método de pago</Text>
      <View style={styles.historyChips}>
        {HISTORY_PAYMENT_METHODS.map((option) => (
          <Pressable
            key={option.key}
            style={[
              styles.historyChip,
              method === option.key && styles.historyChipSelected,
            ]}
            onPress={() => setMethod(option.key)}
          >
            <Text
              style={[
                styles.historyChipText,
                method === option.key && styles.historyChipTextSelected,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.historySectionRow}>
        <Text style={styles.historySectionTitle}>Viajes finalizados</Text>
        <CalendarDays color={colors.primary} size={18} />
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={visibleTrips}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.historyList}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <TripHistoryCard
            trip={item}
            onPress={() =>
              navigation.navigate('TripHistoryDetail', { tripId: item.id })
            }
          />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <Text style={styles.historyEmpty}>
              {rangeInvalid
                ? 'Selecciona las fechas para consultar tus viajes.'
                : error ||
                  (hasMore
                    ? 'No hay viajes con estos filtros en esta página. Desliza para cargar más.'
                    : 'No tienes viajes para los filtros seleccionados.')}
            </Text>
          )
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color={colors.primary} />
          ) : error && hasMore ? (
            <Pressable onPress={loadMore}>
              <Text style={styles.historyHint}>
                No se pudieron cargar más viajes. Toca para reintentar.
              </Text>
            </Pressable>
          ) : null
        }
        refreshing={loading && visibleTrips.length > 0}
        onRefresh={refresh}
      />
    </View>
  );
}
