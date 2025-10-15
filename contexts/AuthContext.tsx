import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { User } from '@/types';

// Initialize Supabase client
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * @interface AuthContextType
 * @description Defines the shape of the authentication context.
 * @property {User | null} user - The current user object, or null if not authenticated.
 * @property {boolean} isLoading - True if an authentication operation is in progress.
 * @property {(email: string, password: string) => Promise<void>} signIn - Function to sign in a user.
 * @property {(name: string, email: string, password: string) => Promise<void>} signUp - Function to sign up a new user.
 * @property {() => Promise<void>} signOut - Function to sign out the current user.
 */
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * @const AuthContext
 * @description The authentication context.
 */
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

/**
 * @interface AuthProviderProps
 * @description Defines the props for the AuthProvider component.
 * @property {React.ReactNode} children - The child components.
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * @const storage
 * @description A helper object for handling storage across different platforms (web and native).
 */
const storage = {
  /**
   * @function getItem
   * @description Retrieves an item from storage.
   * @param {string} key - The key of the item to retrieve.
   * @returns {Promise<string | null>} The value of the item, or null if not found.
   */
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },

  /**
   * @function setItem
   * @description Stores an item in storage.
   * @param {string} key - The key of the item to store.
   * @param {string} value - The value of the item to store.
   * @returns {Promise<void>}
   */
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  /**
   * @function removeItem
   * @description Removes an item from storage.
   * @param {string} key - The key of the item to remove.
   * @returns {Promise<void>}
   */
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

/**
 * @function AuthProvider
 * @description Provides authentication state and functions to its children.
 * @param {AuthProviderProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from storage on mount
    loadUser();
  }, []);

  /**
   * @function loadUser
   * @description Loads the user from storage.
   */
  const loadUser = async () => {
    try {
      const userJSON = await storage.getItem('user');
      if (userJSON) {
        setUser(JSON.parse(userJSON));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @function signIn
   * @description Signs in a user with email and password.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const user: User = {
          id: data.user.id,
          name: profile?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          avatar: profile?.avatar_url || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
        };
      
        await storage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      throw new Error('Falha ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @function signUp
   * @description Signs up a new user.
   * @param {string} name - The user's name.
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  const signUp = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
            },
          ]);

        if (profileError) throw profileError;

        const user: User = {
          id: data.user.id,
          name,
          email: data.user.email || '',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
        };
      
        await storage.setItem('user', JSON.stringify(user));
        setUser(user);
      }
    } catch (error) {
      console.error('Sign up failed:', error);
      throw new Error('Falha ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * @function signOut
   * @description Signs out the current user.
   */
  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Remove user from storage
      await storage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};