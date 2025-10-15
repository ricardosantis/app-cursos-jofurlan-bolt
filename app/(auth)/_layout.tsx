import { Stack } from 'expo-router';

/**
 * @function AuthLayout
 * @description This component defines the layout for the authentication screens.
 * It uses a Stack navigator to manage the login, register, and forgot-password screens.
 * @returns {JSX.Element} The rendered component.
 */
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}