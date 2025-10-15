import { StackClientApp } from '@stackframe/react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const tokenStore = {
  async get() {
    return await SecureStore.getItemAsync('stack_token');
  },
  async set(token: string) {
    await SecureStore.setItemAsync('stack_token', token);
  },
  async delete() {
    await SecureStore.deleteItemAsync('stack_token');
  }
};

export const stackClientApp = new StackClientApp({
  projectId: process.env.EXPO_PUBLIC_STACK_PROJECT_ID,
  publishableClientKey: process.env.EXPO_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
  tokenStore: tokenStore,
  redirectMethod: (path) => {
    router.replace(path);
  },
});
