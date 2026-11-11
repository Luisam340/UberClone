import { View, Pressable, Text } from 'react-native';
import { styles } from '../styles/app.styles';
import { colors } from '../themes/colors';
import { iconsTabs } from '../data/icons';

export function BottomTabs({ active, onNavigate }) {
  return (
    <View style={styles.tabs}>
      {iconsTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;

        return (
          <Pressable
            key={tab.key}
            style={styles.tab}
            onPress={() => onNavigate(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 2}
              color={isActive ? colors.primary : colors.textSecondary}
            />

            <Text style={[styles.tabLabel, isActive && styles.active]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
˝