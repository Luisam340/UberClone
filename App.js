import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './src/styles/app.styles';
import UberCloneStack from './src/navigation/UberCloneStack';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar style="dark" />

        <NavigationContainer>
          <UberCloneStack />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
