import { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { TRIP_STATUS } from '../../hooks/useTripSimulation';
import { useTripFlow } from '../../context/TripFlowContext';

const SCREEN_FOR_STATUS = {
  [TRIP_STATUS.PICKUP]: 'TripPickup',
  [TRIP_STATUS.IN_PROGRESS]: 'TripInProgress',
  [TRIP_STATUS.COMPLETED]: 'TripPayment',
};

// El Stack representa cada etapa, pero no monta el mapa. El mapa,
// el BottomSheet y las solicitudes viven una sola vez en TripNavigator.
export default function TripStageScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { simulation } = useTripFlow();
  const expectedScreen = SCREEN_FOR_STATUS[simulation.status] ?? 'TripHome';

  useEffect(() => {
    if (route.name === expectedScreen) return;

    if (expectedScreen === 'TripHome') {
      navigation.reset({ index: 0, routes: [{ name: 'TripHome' }] });
    } else {
      navigation.replace(expectedScreen);
    }
  }, [expectedScreen, navigation, route.name]);

  return null;
}
