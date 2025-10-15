import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

/**
 * @hook useAuth
 * @description A custom hook that provides access to the authentication context.
 * @returns The authentication context, containing user information and auth functions.
 */
export const useAuth = () => {
  return useContext(AuthContext);
};