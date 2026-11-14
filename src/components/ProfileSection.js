import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { styles } from '../styles/app.styles';
import { colors } from '../themes/colors';
import { getDisplayFields } from '../utils/profileValidator';

export function ProfileSection({
  title,
  section,
  icon: Icon,
  data,
  expanded,
  onToggle,
}) {
  const fields = useMemo(
    () => getDisplayFields(data, section),
    [data, section],
  );
  return (
    <View style={styles.profileCard}>
      <Pressable
        onPress={onToggle}
        style={styles.profileSectionHeader}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <View style={styles.profileSectionIcon}>
          <Icon size={21} color={colors.primary} />
        </View>

        <View style={styles.profileSectionHeading}>
          <Text style={styles.profileSectionTitle}>{title}</Text>

          <Text style={styles.profileSectionSubtitle}>
            {expanded ? 'Ocultar información' : 'Ver información'}
          </Text>
        </View>

        {expanded ? (
          <ChevronUp size={20} color={colors.textSecondary} />
        ) : (
          <ChevronDown size={20} color={colors.textSecondary} />
        )}
      </Pressable>

      {expanded && (
        <View style={styles.profileSectionContent}>
          {fields.length === 0 ? (
            <Text style={styles.profileEmptyText}>
              No hay información registrada.
            </Text>
          ) : (
            fields.map((field, index) => (
              <View
                key={field.key}
                style={[
                  styles.profileFieldRow,
                  index === fields.length - 1 && styles.profileLastField,
                ]}
              >
                <Text style={styles.profileFieldLabel}>{field.label}</Text>

                <Text style={styles.profileFieldValue}>{field.value}</Text>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
}
