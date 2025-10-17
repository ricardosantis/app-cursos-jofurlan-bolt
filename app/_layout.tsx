import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { StackProvider, StackTheme, useUser } from '@stackframe/react';
import { stackClientApp } from '@/stack/client';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

// Keep the splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

/**
 * @function RootLayout
 * @description This is the root layout of the application. It wraps all other components with necessary providers
 * such as AuthProvider, ProgressProvider, and NotificationProvider. It also handles font loading and the splash screen.
 * @returns {JSX.Element | null} The rendered component, or null if fonts are not yet loaded.
 */
function AuthLayout() {
  const user = useUser();
  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (user && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [user, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StackProvider app={stackClientApp}>
        <StackTheme>
          <ProgressProvider>
            <NotificationProvider>
              <AuthLayout />
              <StatusBar style="auto" />
            </NotificationProvider>
          </ProgressProvider>
        </StackTheme>
      </StackProvider>
    </GestureHandlerRootView>
  );
}
