import { useContext } from 'react';
import { ProgressContext } from '@/contexts/ProgressContext';

export const useProgress = () => {
  return useContext(ProgressContext);
};