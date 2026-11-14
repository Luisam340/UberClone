import { useContext, useEffect, useMemo, useState } from 'react';

import { AuthContext } from '../context/AuthContext';
import { getDriverTripHistoryDetail } from '../services/tripHistory';
import {
  getTripHistoryDetails,
  getTripHistoryMapData,
} from '../utils/tripHistoryFunctions';

export function useTripHistoryDetail(tripId) {
  const { user } = useContext(AuthContext);
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setTrip(null);

    if (!user?.uid || !tripId) {
      setLoading(false);
      setError('No se pudo identificar el viaje.');
      return () => {
        active = false;
      };
    }

    getDriverTripHistoryDetail({ driverId: user.uid, tripId })
      .then((result) => {
        if (active) setTrip(result);
      })
      .catch((readError) => {
        if (active)
          setError(readError.message || 'No se pudo consultar el viaje.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [tripId, user?.uid]);

  const details = useMemo(
    () => (trip ? getTripHistoryDetails(trip) : null),
    [trip],
  );
  const mapData = useMemo(() => getTripHistoryMapData(trip), [trip]);

  return { trip, loading, error, details, mapData };
}
