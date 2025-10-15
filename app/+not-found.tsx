import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

/**
 * @function NotFoundScreen
 * @description This component renders a "Not Found" screen when the user navigates to a route that does not exist.
 * It provides a link to return to the home screen.
 * @returns {JSX.Element} The rendered component.
 */
export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
