import { View, Text, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser, UserButton } from '@stackframe/react';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { stackClientApp } from '@/stack/client';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const user = useUser();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {user ? (
          <>
            <UserButton />
            <Text style={styles.title}>Welcome, {user.displayName || 'User'}</Text>
            <Text style={styles.email}>{user.primaryEmail}</Text>
            <Button title="Sign Out" onPress={() => user.signOut()} />
          </>
        ) : (
          <>
            <Text style={styles.title}>Você não está logado</Text>
            <Button title="Login" onPress={() => router.push('/(auth)/login')} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h2,
    marginVertical: SIZES.padding,
    color: COLORS.black,
  },
  email: {
    ...FONTS.body3,
    marginBottom: SIZES.padding * 2,
    color: COLORS.gray,
  },
});
