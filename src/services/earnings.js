import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Usa el mismo índice driverId + completedAt que Historial.
export async function getDriverEarningsTrips({ driverId, startDate, endDate }) {
  if (!driverId) throw new Error('No se pudo identificar el conductor.');

  const tripsQuery = query(
    collection(db, 'trips'),
    where('driverId', '==', driverId),
    where('completedAt', '>=', Timestamp.fromDate(startDate)),
    where('completedAt', '<', Timestamp.fromDate(endDate)),
    orderBy('completedAt', 'desc'),
  );

  const snapshot = await getDocs(tripsQuery);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}
