import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getDriverEarningsTrips } from '../services/earnings';
import {
  calculateEarnings,
  getEarningsChartData,
  getEarningsDateBounds,
} from '../utils/earningsFunctions';

const EMPTY_SUMMARY = {
  totals: { today: 0, week: 0, month: 0 },
  periods: {
    today: { cash: 0, mercadopago: 0, count: 0, tips: 0 },
    week: { cash: 0, mercadopago: 0, count: 0, tips: 0 },
    month: { cash: 0, mercadopago: 0, count: 0, tips: 0 },
  },
};

export function useEarnings() {
  const { user } = useContext(AuthContext);
  const [period, setPeriod] = useState('month');
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const requestRef = useRef(0);

  const refresh = useCallback(
    async (manual = false) => {
      const requestId = ++requestRef.current;
      if (manual) setRefreshing(true);
      else setLoading(true);
      setError(null);

      if (!user?.uid) {
        setSummary(EMPTY_SUMMARY);
        setError('Inicia sesión para consultar tus ganancias.');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      try {
        const bounds = getEarningsDateBounds();
        const trips = await getDriverEarningsTrips({
          driverId: user.uid,
          startDate: bounds.start,
          endDate: bounds.tomorrow,
        });
        if (requestId === requestRef.current) {
          setSummary(calculateEarnings(trips, bounds));
        }
      } catch (loadError) {
        if (requestId === requestRef.current) {
          setError(
            loadError?.code === 'failed-precondition'
              ? 'Las ganancias requieren un índice de Firestore. Verifica que el índice del historial esté habilitado.'
              : loadError?.code === 'permission-denied'
                ? 'No tienes permisos para consultar las ganancias.'
                : 'No fue posible cargar las ganancias. Inténtalo nuevamente.',
          );
        }
      } finally {
        if (requestId === requestRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [user?.uid],
  );

  useFocusEffect(
    useCallback(() => {
      refresh();
      return () => {
        requestRef.current += 1;
      };
    }, [refresh]),
  );

  const chartData = useMemo(
    () => getEarningsChartData(summary, period),
    [summary, period],
  );

  return {
    period,
    setPeriod,
    summary,
    chartData,
    loading,
    refreshing,
    error,
    refresh: () => refresh(true),
  };
}
