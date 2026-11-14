import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const saveDriver = async (uid, data) => {
  const {
    profilePhoto,
    password,
    passwordRepeat,
    showPassword,
    showPasswordRepeat,
    ...personalData
  } = data.personal;

  const { vehiclePhoto, ...vehicleData } = data.vehicle;

  const { licensePhoto, soatPhoto, technicalPhoto, ...documentsData } =
    data.documents;

  const ref = doc(db, 'drivers', uid);

  await setDoc(ref, {
    personal: personalData,
    vehicle: vehicleData,
    documents: documentsData,
    createdAt: Date.now(),
    accountValidated: false,
  });
};

export const getDriver = async (uid) => {
  const driverRef = doc(db, 'drivers', uid);
  const driverSnapshot = await getDoc(driverRef);

  if (!driverSnapshot.exists()) {
    return null;
  }

  return driverSnapshot.data();
};

export function subscribeToDriverProfile(userId, onProfileChange, onError) {
  const driverRef = doc(db, 'drivers', userId);

  return onSnapshot(
    driverRef,
    (snapshot) => {
      const driverData = snapshot.exists() ? snapshot.data() : null;

      onProfileChange(driverData);
    },
    onError,
  );
}
