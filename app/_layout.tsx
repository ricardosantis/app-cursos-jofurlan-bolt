import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
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
      <AuthProvider>
        <ProgressProvider>
          <NotificationProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="course/[id]" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="module/[id]" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="lesson/[id]" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
              <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
            </Stack>
            <StatusBar style="auto" />
          </NotificationProvider>
        </ProgressProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}