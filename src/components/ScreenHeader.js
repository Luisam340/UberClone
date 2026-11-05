import { View, Pressable, Text } from 'react-native';
import { styles } from '../styles/app.styles';

export function ScreenHeader({ title, subtitle, back, onBack }) {
  return (
    <View style={styles.header}>
      {back && (
        <Pressable onPress={onBack} style={styles.iconButton}>
          <Text style={styles.illustrationIcon}>‹</Text>
        </Pressable>
      )}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>LM</Text>
      </View>
    </View>
  );
}
