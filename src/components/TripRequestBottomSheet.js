import { useCallback, useEffect, useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { styles } from '../styles/app.styles';
import { TripRequestCard } from './TripRequestCard';

export function TripRequestBottomSheet({
  trip,
  visible,
  remainingSeconds,
  onAccept,
  onReject,
}) {
  const bottomSheetRef = useRef(null);
  const isPresentedRef = useRef(false);

  const { height } = useWindowDimensions();
  const maxSheetHeight = Math.round(height * 0.75);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="none"
        opacity={0.4}
      />
    ),
    [],
  );

  const handleSheetChange = useCallback((index) => {
  }, []);

  // Registrar cuando el modal termina de cerrarse.
  const handleDismiss = useCallback(() => {
    isPresentedRef.current = false;
  }, []);

  // Abrir solo cuando hay una solicitud y cerrar solo si ya se presento.
  useEffect(() => {
    if (visible && trip) {
      if (!isPresentedRef.current) {
        isPresentedRef.current = true;
        bottomSheetRef.current?.present();
      }

      return;
    }

    if (isPresentedRef.current) {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible, trip]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      enableDynamicSizing={true}
      maxDynamicContentSize={maxSheetHeight}
      enablePanDownToClose={false}
      enableOverDrag={false}
      enableHandlePanningGesture={false}
      enableContentPanningGesture={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.tripRequestBottomSheetBackground}
      handleIndicatorStyle={styles.tripRequestBottomSheetHandle}
      onChange={handleSheetChange}
      onDismiss={handleDismiss}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tripRequestScrollContent}
      >
        <TripRequestCard
          trip={trip}
          remainingSeconds={remainingSeconds}
          onAccept={onAccept}
          onReject={onReject}
        />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
