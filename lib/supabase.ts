import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * @const ExpoSecureStoreAdapter
 * @description An adapter that allows Supabase to use Expo's SecureStore for session persistence on native platforms,
 * and localStorage on the web. This ensures that the user's session is securely stored and retrieved across app launches.
 */
const ExpoSecureStoreAdapter = {
  /**
   * @function getItem
   * @description Retrieves an item from storage.
   * @param {string} key - The key of the item to retrieve.
   * @returns {Promise<string | null> | string | null} The value of the item, or null if not found.
   */
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  /**
   * @function setItem
   * @description Stores an item in storage.
   * @param {string} key - The key of the item to store.
   * @param {string} value - The value of the item to store.
   * @returns {Promise<void>}
   */
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  /**
   * @function removeItem
   * @description Removes an item from storage.
   * @param {string} key - The key of the item to remove.
   * @returns {Promise<void>}
   */
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * @const supabase
 * @description The Supabase client instance. This is the main entry point for interacting with the Supabase backend,
 * including authentication, database operations, and storage.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});