import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../themes/colors';
import { styles } from '../styles/app.styles';
import { formatEarnings } from '../utils/earningsFunctions';

const CHART_SIZE = 224;
const STROKE_WIDTH = 23;
const RADIUS = (CHART_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function EarningsDonutChart({ data, total }) {
  const segments = data.filter((item) => item.value > 0);
  const sum = segments.reduce((acc, item) => acc + item.value, 0);
  const palette = {
    mercadopago: colors.primary,
    cash: colors.success,
  };
  let offset = 0;

  return (
    <View style={styles.earningsChartArea}>
      <View style={styles.earningsDonutWrapper}>
        <Svg
          width={CHART_SIZE}
          height={CHART_SIZE}
          viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
        >
          <Circle
            cx={CHART_SIZE / 2}
            cy={CHART_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={colors.lavender}
            strokeWidth={STROKE_WIDTH}
          />
          {segments.map((item) => {
            const length = (item.value / sum) * CIRCUMFERENCE;
            const rotation = -90 + (offset / CIRCUMFERENCE) * 360;
            offset += length;
            return (
              <Circle
                key={item.key}
                cx={CHART_SIZE / 2}
                cy={CHART_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={palette[item.key] || colors.primary}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${Math.max(0, length - (segments.length > 1 ? 5 : 0))} ${CIRCUMFERENCE}`}
                rotation={rotation}
                origin={`${CHART_SIZE / 2}, ${CHART_SIZE / 2}`}
                strokeLinecap="round"
              />
            );
          })}
        </Svg>
        <View pointerEvents="none" style={styles.earningsDonutCenter}>
          <Text style={styles.earningsDonutCaption}>Ganancia neta</Text>
          <Text
            style={styles.earningsDonutValue}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatEarnings(total)}
          </Text>
        </View>
      </View>

      <View style={styles.earningsLegend}>
        {data.map((item) => (
          <View style={styles.earningsLegendRow} key={item.key}>
            <View
              style={[
                styles.earningsLegendDot,
                { backgroundColor: palette[item.key] || colors.primary },
              ]}
            />
            <Text style={styles.earningsLegendLabel}>{item.label}</Text>
            <Text style={styles.earningsLegendAmount}>
              {formatEarnings(item.value)}
            </Text>
          </View>
        ))}
      </View>
      {sum === 0 && (
        <Text style={styles.earningsEmptyText}>
          Aún no hay pagos confirmados en este período.
        </Text>
      )}
    </View>
  );
}
