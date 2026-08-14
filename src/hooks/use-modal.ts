/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

export const useModal = <T extends Record<string, any>>(initialStates: T) => {
  const [modals, setModals] = useState<T>(initialStates);

  const toggle = <K extends keyof T>(key: K, value?: T[K]) => {
    setModals((prev) => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }));
  };

  return { modals, toggle };
};