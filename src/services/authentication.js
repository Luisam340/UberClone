import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export const loginUser = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return credential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};
