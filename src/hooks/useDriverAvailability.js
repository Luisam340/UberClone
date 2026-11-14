import { useCallback, useEffect, useRef, useState } from 'react';
import {
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { vehicleCategories } from '../data/vehicle';

// Temporal: evita escrituras frecuentes de ubicacion en Firestore.
// El mapa y la posicion simulada del conductor siguen funcionando localmente.
const PERSIST_DRIVER_LOCATION = true;

export function useDriverAvailability(userId, origin) {
  const [available, setAvailable] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [accountValidated, setAccountValidated] = useState(false);
  const [vehicleCategory, setVehicleCategory] = useState(null);
  const [loadingApproval, setLoadingApproval] = useState(true);
  const availableRef = useRef(false);
  const writeInProgress = useRef(false);
  const driverPositionRef = useRef(origin);

  // Leer aprobacion y categoria directamente del perfil del conductor.
  useEffect(() => {
    if (!userId) {
      availableRef.current = false;
      setAccountValidated(false);
      setVehicleCategory(null);
      setLoadingApproval(false);
      return;
    }

    setLoadingApproval(true);
    setAccountValidated(false);
    setVehicleCategory(null);

    return onSnapshot(
      doc(db, 'drivers', userId),
      (snapshot) => {
        const driverData = snapshot.data();
        const category = driverData?.vehicle?.category;
        const validCategory = vehicleCategories.some(
          ({ value }) => value === category,
        );

        setAccountValidated(driverData?.accountValidated === true);
        setVehicleCategory(validCategory ? category : null);
        setLoadingApproval(false);
      },
      (error) => {
        availableRef.current = false;
        setAccountValidated(false);
        setVehicleCategory(null);
        setLoadingApproval(false);
      },
    );
  }, [userId]);

  // Detener la disponibilidad si la cuenta no esta aprobada.
  useEffect(() => {
    if (loadingApproval || !accountValidated) {
      availableRef.current = false;
      setAvailable(false);
      setSeconds(0);
    }
  }, [loadingApproval, accountValidated]);

  useEffect(() => {
    availableRef.current = available;
    return () => {
      availableRef.current = false;
    };
  }, [available]);

  useEffect(() => {
    if (!available) return;

    const intervalId = setInterval(() => {
      setSeconds((previous) => previous + 3);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [available]);

  const handleLocationChange = useCallback(
    (position) => {
      if (
        !Number.isFinite(position?.latitude) ||
        !Number.isFinite(position?.longitude)
      ) {
        return;
      }

      driverPositionRef.current = {
        latitude: position.latitude,
        longitude: position.longitude,
      };

      if (!PERSIST_DRIVER_LOCATION || !userId || !availableRef.current || writeInProgress.current) {
        return;
      }

      writeInProgress.current = true;

      updateDoc(doc(db, 'drivers', userId), {
        location: {
          latitude: position.latitude,
          longitude: position.longitude,
          simulated: true,
          updatedAt: serverTimestamp(),
        },
      })
        .catch((error) => {})
        .finally(() => {
          writeInProgress.current = false;
        });
    },
    [userId],
  );

  // Detener disponibilidad y escritura de ubicaciones al salir de Inicio.
  const stopAvailability = useCallback(() => {
    availableRef.current = false;
    setAvailable(false);
    setSeconds(0);
  }, []);

  const toggleAvailability = useCallback((disabled) => {
    if (disabled) return;

    const nextAvailable = !availableRef.current;
    availableRef.current = nextAvailable;
    setAvailable(nextAvailable);
    setSeconds(0);
  }, []);

  return {
    available,
    seconds,
    accountValidated,
    vehicleCategory,
    loadingApproval,
    driverPositionRef,
    handleLocationChange,
    toggleAvailability,
    stopAvailability,
  };
}
