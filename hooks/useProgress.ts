import { useContext } from 'react';
import { ProgressContext } from '@/contexts/ProgressContext';

/**
 * @hook useProgress
 * @description A custom hook that provides access to the progress context.
 * @returns The progress context, containing functions to track and manage user progress.
 */
export const useProgress = () => {
  return useContext(ProgressContext);
};