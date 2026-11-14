import { Text, View } from 'react-native';
import { styles } from '../styles/app.styles';

export function TripHistoryDetailField({ label, value }) {
  return (
    <View style={styles.historyDetailField}>
      <Text style={styles.historyCaption}>{label}</Text>
      <Text style={styles.historyDetailValue}>{value}</Text>
    </View>
  );
}
