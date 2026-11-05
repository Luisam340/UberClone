import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export function ProfileScreen() {
  const { user } = useContext(AuthContext);
}
