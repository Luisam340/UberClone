import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  HandCoins,
  CalendarDays,
  CalendarRange,
  Calendar,
} from 'lucide-react-native';
import { EarningsDonutChart } from '../../components/EarningsDonutChart';
import { useEarnings } from '../../hooks/useEarnings';
import {
  EARNINGS_PERIODS,
  formatEarnings,
} from '../../utils/earningsFunctions';
import { colors } from '../../themes/colors';
import { styles } from '../../styles/app.styles';

const PERIOD_ICONS = {
  today: CalendarDays,
  week: CalendarRange,
  month: Calendar,
};

export default function EarningsScreen() {
  const {
    period,
    setPeriod,
    summary,
    chartData,
    loading,
    refreshing,
    error,
    refresh,
  } = useEarnings();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.earningsContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.earningsHeading}>
        <Text style={styles.historyTitle}>Mis ganancias</Text>
        <Text style={styles.historySubtitle}>
          Consulta lo que has ganado con tus viajes pagados.
        </Text>
      </View>

      <View style={styles.earningsTotals}>
        {EARNINGS_PERIODS.map((item) => {
          const Icon = PERIOD_ICONS[item.key];
          const selected = period === item.key;
          return (
            <Pressable
              key={item.key}
              onPress={() => setPeriod(item.key)}
              style={[
                styles.earningsTotalCard,
                selected && styles.earningsTotalCardActive,
              ]}
              accessibilityRole="button"
            >
              <Icon
                size={19}
                color={selected ? colors.primary : colors.textSecondary}
              />
              <Text style={styles.earningsTotalLabel}>{item.label}</Text>
              <Text
                style={styles.earningsTotalValue}
                adjustsFontSizeToFit
                numberOfLines={1}
              >
                {formatEarnings(summary.totals[item.key])}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.earningsPanel}>
        <Text style={styles.earningsSectionTitle}>
          Distribución de ganancias
        </Text>
        <Text style={styles.earningsSectionSubtitle}>
          {period === 'today'
            ? 'Hoy'
            : period === 'week'
              ? 'Esta semana'
              : 'Este mes'}{' '}
          · por método de pago
        </Text>

        {loading ? (
          <View style={styles.earningsLoading}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : error ? (
          <View style={styles.earningsLoading}>
            <Text style={styles.earningsEmptyText}>{error}</Text>
            <Pressable onPress={refresh} style={styles.earningsRetry}>
              <Text style={styles.earningsRetryText}>Reintentar</Text>
            </Pressable>
          </View>
        ) : (
          <EarningsDonutChart data={chartData} total={summary.totals[period]} />
        )}
      </View>

      <View style={styles.earningsSummaryCard}>
        <Text style={styles.earningsSectionTitle}>Resumen del período</Text>
        <View style={styles.earningsSummaryRow}>
          <Text style={styles.earningsSummaryLabel}>Viajes pagados</Text>
          <Text style={styles.earningsSummaryValue}>
            {summary.periods[period].count}
          </Text>
        </View>
        <View style={styles.earningsSummaryRow}>
          <Text style={styles.earningsSummaryLabel}>Propinas recibidas</Text>
          <Text style={styles.earningsSummaryValue}>
            {formatEarnings(summary.periods[period].tips)}
          </Text>
        </View>
        <View style={styles.earningsSummaryRow}>
          <Text style={styles.earningsSummaryLabel}>Ganancia neta</Text>
          <Text style={styles.earningsSummaryValue}>
            {formatEarnings(summary.totals[period])}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
