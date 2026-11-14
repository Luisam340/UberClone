import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { AuthContext } from '../context/AuthContext';
import { getDriverTripHistoryPage } from '../services/tripHistory';
import {
  getTripHistoryDateBounds,
  isTripHistoryRangeInvalid,
  isFinishedTrip,
  matchesTripPaymentMethod,
} from '../utils/tripHistoryFunctions';

export function useTripHistory() {
  const { user } = useContext(AuthContext);
  const [period, setPeriod] = useState('month');
  const [method, setMethod] = useState('all');
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [trips, setTrips] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const requestRef = useRef(0);
  const busyRef = useRef(false);

  const dates = useMemo(
    () => getTripHistoryDateBounds(period, rangeStart, rangeEnd),
    [period, rangeStart, rangeEnd],
  );
  const rangeInvalid = isTripHistoryRangeInvalid(period, rangeStart, rangeEnd);

  const refresh = useCallback(async () => {
    const request = ++requestRef.current;
    busyRef.current = true;
    setLoading(true);
    setError(null);
    setTrips([]);
    setCursor(null);
    setHasMore(false);

    if (!user?.uid || rangeInvalid) {
      setLoading(false);
      busyRef.current = false;
      return;
    }

    try {
      const result = await getDriverTripHistoryPage({
        driverId: user.uid,
        ...dates,
      });
      if (request !== requestRef.current) return;
      setTrips(result.trips);
      setCursor(result.cursor);
      setHasMore(result.hasMore);
    } catch (loadError) {
      if (request === requestRef.current) {
        setError(loadError.message || 'No fue posible consultar los viajes.');
      }
    } finally {
      if (request === requestRef.current) {
        setLoading(false);
        busyRef.current = false;
      }
    }
  }, [user?.uid, dates, rangeInvalid]);

  useFocusEffect(
    useCallback(() => {
      refresh();
      return () => {
        requestRef.current += 1;
        busyRef.current = false;
      };
    }, [refresh]),
  );

  const loadMore = useCallback(async () => {
    if (!user?.uid || busyRef.current || !hasMore || !cursor || rangeInvalid)
      return;
    const request = requestRef.current;
    busyRef.current = true;
    setLoadingMore(true);
    setError(null);

    try {
      const result = await getDriverTripHistoryPage({
        driverId: user.uid,
        cursor,
        ...dates,
      });
      if (request !== requestRef.current) return;
      setTrips((previous) => [...previous, ...result.trips]);
      setCursor(result.cursor);
      setHasMore(result.hasMore);
    } catch (loadError) {
      if (request === requestRef.current) {
        setError(loadError.message || 'No fue posible cargar más viajes.');
      }
    } finally {
      if (request === requestRef.current) {
        setLoadingMore(false);
        busyRef.current = false;
      }
    }
  }, [user?.uid, hasMore, cursor, dates, rangeInvalid]);

  const visibleTrips = useMemo(
    () =>
      trips.filter(
        (trip) =>
          isFinishedTrip(trip) && matchesTripPaymentMethod(trip, method),
      ),
    [trips, method],
  );

  return {
    period,
    setPeriod,
    method,
    setMethod,
    rangeStart,
    setRangeStart,
    rangeEnd,
    setRangeEnd,
    rangeInvalid,
    visibleTrips,
    hasMore,
    loading,
    loadingMore,
    error,
    refresh,
    loadMore,
  };
}
