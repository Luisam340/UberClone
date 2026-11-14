import { Text, View } from 'react-native';
import { TripHistoryDetailField } from './TripHistoryDetailField';
import { styles } from '../styles/app.styles';

export function TripHistoryDetailSection({ title, fields }) {
  return (
    <View style={styles.historyDetailCard}>
      {title && <Text style={styles.historySectionTitle}>{title}</Text>}
      {fields.map(({ label, value }) => (
        <TripHistoryDetailField key={label} label={label} value={value} />
      ))}
    </View>
  );
}
