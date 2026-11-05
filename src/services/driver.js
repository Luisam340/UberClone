import { doc, setDoc } from 'firebase/firestore';
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
  });
};
