import { useEffect } from 'react';

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

/**
 * @hook useFrameworkReady
 * @description A custom hook that signals when the React Native framework is ready.
 * This is primarily used for automation and testing purposes, allowing external scripts
 * to wait for the app to be fully loaded before interacting with it.
 */
export function useFrameworkReady() {
  useEffect(() => {
    window.frameworkReady?.();
  });
}