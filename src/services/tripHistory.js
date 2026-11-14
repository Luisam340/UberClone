import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  Timestamp,
} from 'firebase/firestore';
import { isFinishedTrip } from '../utils/tripHistoryFunctions';
import { db } from '../config/firebaseConfig';

export const HISTORY_PAGE_SIZE = 20;

export async function getDriverTripHistoryDetail({ driverId, tripId }) {
  if (!driverId || !tripId) throw new Error('No se pudo identificar el viaje.');

  const snapshot = await getDoc(doc(db, 'trips', String(tripId)));
  if (!snapshot.exists()) throw new Error('Este viaje no está disponible.');

  const data = snapshot.data();
  if (data.driverId !== driverId || !isFinishedTrip(data)) {
    throw new Error('Este viaje no está disponible.');
  }
  return { id: snapshot.id, ...data };
}

export async function getDriverTripHistoryPage({
  driverId,
  cursor = null,
  startDate = null,
  endDate = null,
}) {
  if (!driverId) throw new Error('No se pudo identificar el conductor.');

  const filters = [where('driverId', '==', driverId)];

  if (startDate)
    filters.push(where('completedAt', '>=', Timestamp.fromDate(startDate)));
  if (endDate)
    filters.push(where('completedAt', '<', Timestamp.fromDate(endDate)));

  filters.push(orderBy('completedAt', 'desc'), limit(HISTORY_PAGE_SIZE));
  if (cursor) filters.push(startAfter(cursor));

  const snapshot = await getDocs(query(collection(db, 'trips'), ...filters));
  return {
    trips: snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data(),
    })),
    cursor: snapshot.docs.at(-1) ?? null,
    hasMore: snapshot.docs.length === HISTORY_PAGE_SIZE,
  };
}
