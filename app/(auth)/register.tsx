import { SignUp } from '@stackframe/react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

export default function RegisterScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create an account</Text>
        <SignUp />
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
    justifyContent: 'center',
    padding: SIZES.padding,
  },
  title: {
    ...FONTS.h1,
    textAlign: 'center',
    marginBottom: SIZES.padding * 2,
    color: COLORS.primary,
  },
});
