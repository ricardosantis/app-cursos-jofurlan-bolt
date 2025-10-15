import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { COLORS, FONTS, SIZES } from '@/constants/theme';

/**
 * @function LoginScreen
 * @description This component renders the login screen, allowing users to sign in with their email and password.
 * It includes form validation, a "show password" toggle, and navigation to the registration and forgot password screens.
 * @returns {JSX.Element} The rendered component.
 */
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  /**
   * @function handleLogin
   * @description Handles the login process when the user presses the "Entrar" button.
   * It performs basic validation, calls the `signIn` function from the auth context, and navigates to the main app on success.
   */
  const handleLogin = async () => {
    if (!email || !password) return;
    
    setIsLoading(true);
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/5428827/pexels-photo-5428827.jpeg' }} 
              style={styles.logo} 
            />
            <Text style={styles.logoText}>EduCourse</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.titleContainer}>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Faça login para continuar sua jornada de aprendizado</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                placeholderTextColor={COLORS.gray}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Digite sua senha"
                  placeholderTextColor={COLORS.gray}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon} 
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={COLORS.gray} />
                  ) : (
                    <Eye size={20} color={COLORS.gray} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => router.push('/(auth)/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
              onPress={handleLogin}
              disabled={isLoading || !email || !password}
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
              <ArrowRight color="white" size={20} />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.footer}>
            <Text style={styles.footerText}>Não tem uma conta?</Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.registerText}>Registrar</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SIZES.padding,
    paddingTop: SIZES.padding * 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
  },
  logoText: {
    marginTop: SIZES.base,
    ...FONTS.h2,
    color: COLORS.primary,
  },
  titleContainer: {
    marginBottom: SIZES.padding * 2,
  },
  title: {
    ...FONTS.h1,
    marginBottom: SIZES.base,
    color: COLORS.black,
    textAlign: 'center',
  },
  subtitle: {
    ...FONTS.body3,
    color: COLORS.gray,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: SIZES.padding * 2,
  },
  inputContainer: {
    marginBottom: SIZES.padding,
  },
  label: {
    ...FONTS.body4,
    color: COLORS.darkGray,
    marginBottom: SIZES.base / 2,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    ...FONTS.body3,
    color: COLORS.black,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    ...FONTS.body3,
    color: COLORS.black,
  },
  eyeIcon: {
    padding: SIZES.padding,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.padding * 2,
  },
  forgotPasswordText: {
    ...FONTS.body4,
    color: COLORS.primary,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    paddingVertical: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: SIZES.base,
  },
  loginButtonDisabled: {
    backgroundColor: COLORS.gray,
  },
  loginButtonText: {
    color: COLORS.white,
    ...FONTS.h3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: SIZES.padding,
    gap: SIZES.base,
  },
  footerText: {
    ...FONTS.body4,
    color: COLORS.darkGray,
  },
  registerText: {
    ...FONTS.h4,
    color: COLORS.primary,
  },
});