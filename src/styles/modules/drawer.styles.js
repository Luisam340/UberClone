import { StyleSheet } from 'react-native';
import { colors } from '../../themes/colors';

export const styles = StyleSheet.create({
  drawerMenuButton: { marginLeft: 16 },
  tripFlowStackHost: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    overflow: 'hidden',
  },
  drawerScene: { backgroundColor: colors.background },
  drawerPanel: { backgroundColor: colors.surface },
  drawerLabel: { fontSize: 15, fontWeight: '600' },
});
