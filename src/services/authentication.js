import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { Alert } from 'react-native';
import { validateAuthentication } from '../utils/authenticationValidators';

export const loginUser = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};
