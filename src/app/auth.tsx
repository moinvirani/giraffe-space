import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';
import { User, Mail, ArrowRight, Lock, Eye, EyeOff, CheckCircle2, MailCheck, ExternalLink } from 'lucide-react-native';
import { PrimaryButton } from '@/components/Button';
import { signUpWithEmail, signInWithEmail, resetPassword } from '@/lib/supabase';

// Key to track if user has ever signed up
const HAS_SIGNED_UP_KEY = '@giraffe_has_signed_up';

type AuthMode = 'signup' | 'signin';
type AuthState = 'form' | 'reset-sent';

export default function AuthScreen() {
  const router = useRouter();
  const login = useAppStore(s => s.login);
  const [mode, setMode] = useState<AuthMode>('signup'); // Will be updated on mount
  const [authState, setAuthState] = useState<AuthState>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPreviousUser, setIsCheckingPreviousUser] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});

  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Check if user has previously signed up - show login by default if so
  useEffect(() => {
    const checkPreviousUser = async () => {
      try {
        const hasSignedUp = await AsyncStorage.getItem(HAS_SIGNED_UP_KEY);
        if (hasSignedUp === 'true') {
          setMode('signin');
        }
      } catch (error) {
        console.log('Error checking previous user:', error);
      } finally {
        setIsCheckingPreviousUser(false);
      }
    };
    checkPreviousUser();
  }, []);

  // Mark that user has signed up (called after successful signup)
  const markAsSignedUp = async () => {
    try {
      await AsyncStorage.setItem(HAS_SIGNED_UP_KEY, 'true');
    } catch (error) {
      console.log('Error marking signup:', error);
    }
  };

  const validateEmail = (emailValue: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  // Helper to navigate user based on their progress
  const navigateBasedOnProgress = () => {
    const currentUser = useAppStore.getState().user;
    const onboardingDone = useAppStore.getState().hasCompletedOnboarding;

    if (!onboardingDone) {
      // User hasn't done intake questionnaire
      router.replace('/intake');
    } else if (currentUser && !currentUser.hasCompletedIntro) {
      // User did intake but hasn't finished intro lessons
      router.replace('/intro-lesson');
    } else {
      // Fully onboarded user
      router.replace('/(tabs)');
    }
  };

  const handleAuth = async () => {
    const newErrors: typeof errors = {};

    if (mode === 'signup' && !name.trim()) {
      newErrors.name = 'Please enter your name';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Please enter a password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { session } = await signUpWithEmail(email.trim(), password, name.trim());

        // With email verification disabled, we always get a session back
        if (session) {
          await markAsSignedUp(); // Remember user has signed up
          await login(name.trim(), email.trim(), 'adult');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          navigateBasedOnProgress();
        } else {
          // Fallback - should not happen with email verification disabled
          // but if it does, just log them in anyway
          await markAsSignedUp(); // Remember user has signed up
          await login(name.trim(), email.trim(), 'adult');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          navigateBasedOnProgress();
        }
      } else {
        const { user: supabaseUser } = await signInWithEmail(email.trim(), password);
        if (supabaseUser) {
          await markAsSignedUp(); // Also mark on successful sign in
          const userName = supabaseUser.user_metadata?.name || email.split('@')[0];
          await login(userName, email.trim(), 'adult');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          navigateBasedOnProgress();
        }
      }
    } catch (error) {
      let message = error instanceof Error ? error.message : 'Something went wrong';

      // Handle common Supabase error messages with friendlier text
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('user already registered') ||
          lowerMessage.includes('already been registered') ||
          lowerMessage.includes('email already')) {
        message = 'This email is already registered. Try signing in instead.';
      } else if (lowerMessage.includes('invalid login credentials') ||
                 lowerMessage.includes('invalid email or password')) {
        message = 'Invalid email or password. Please check your credentials and try again.';
      } else if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many requests') || lowerMessage.includes('too many attempts')) {
        message = 'Too many attempts. Please wait 2-3 minutes before trying again. This helps protect your account.';
      } else if (lowerMessage.includes('network') || lowerMessage.includes('fetch')) {
        message = 'Connection error. Please check your internet and try again.';
      }

      setErrors({ general: message });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMode(mode === 'signup' ? 'signin' : 'signup');
    setErrors({});
    setAuthState('form');
  };

  const handleBackToForm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAuthState('form');
    setMode('signin');
  };

  const handleOpenEmailApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Try to open the default mail app on iOS
    try {
      await Linking.openURL('message://');
    } catch {
      // If that fails, try mailto which should open the mail app
      try {
        await Linking.openURL('mailto:');
      } catch {
        // If all fails, just continue - user can manually open email
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrors({ email: 'Please enter your email first' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!validateEmail(email.trim())) {
      setErrors({ email: 'Please enter a valid email' });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await resetPassword(email.trim());
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAuthState('reset-sent');
    } catch (error) {
      // Don't reveal if email exists or not for security
      // Just show success message anyway
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setAuthState('reset-sent');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking if user has previously signed up
  if (isCheckingPreviousUser) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.cream[50] }}>
        <Text className="text-4xl mb-4">🦒</Text>
      </View>
    );
  }

  // Password reset email sent screen
  if (authState === 'reset-sent') {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.cream[50] }}>
        <LinearGradient
          colors={[colors.cream[50], colors.primary[50], colors.cream[100]]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView className="flex-1">
            <View className="flex-1 px-6 justify-center items-center">
              <Animated.View
                entering={FadeInDown.springify()}
                className="items-center"
              >
                {/* Success icon */}
                <View
                  className="w-24 h-24 rounded-full items-center justify-center mb-6"
                  style={{ backgroundColor: colors.primary[100] }}
                >
                  <MailCheck size={48} color={colors.primary[600]} strokeWidth={1.5} />
                </View>

                <Text
                  className="text-2xl text-center mb-2"
                  style={{
                    fontFamily: 'Nunito_800ExtraBold',
                    color: colors.jackal[800],
                  }}
                >
                  Check Your Email!
                </Text>

                <Text
                  className="text-base text-center mb-2 px-4"
                  style={{
                    fontFamily: 'Nunito_500Medium',
                    color: colors.jackal[500],
                  }}
                >
                  We sent a password reset link to:
                </Text>

                <View
                  className="px-4 py-2 rounded-full mb-6"
                  style={{ backgroundColor: colors.primary[100] }}
                >
                  <Text
                    className="text-base"
                    style={{
                      fontFamily: 'Nunito_700Bold',
                      color: colors.primary[700],
                    }}
                  >
                    {email}
                  </Text>
                </View>

                <View
                  className="p-5 rounded-2xl mb-6 w-full"
                  style={{ backgroundColor: colors.cream[100] }}
                >
                  <Text
                    className="text-sm text-center leading-6"
                    style={{
                      fontFamily: 'Nunito_500Medium',
                      color: colors.jackal[600],
                    }}
                  >
                    Tap the link in your email to reset your password. After resetting, come back here to sign in with your new password.
                  </Text>
                </View>

                {/* Tips */}
                <View className="gap-2 mb-6 w-full">
                  <View className="flex-row items-center">
                    <CheckCircle2 size={16} color={colors.primary[500]} />
                    <Text
                      className="text-sm ml-2"
                      style={{
                        fontFamily: 'Nunito_500Medium',
                        color: colors.jackal[500],
                      }}
                    >
                      Check your spam folder if you don't see it
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <CheckCircle2 size={16} color={colors.primary[500]} />
                    <Text
                      className="text-sm ml-2"
                      style={{
                        fontFamily: 'Nunito_500Medium',
                        color: colors.jackal[500],
                      }}
                    >
                      The link expires in 1 hour
                    </Text>
                  </View>
                </View>
              </Animated.View>

              <Animated.View entering={FadeIn.delay(300)} className="w-full gap-3">
                {/* Open Email App button */}
                <Pressable
                  onPress={handleOpenEmailApp}
                  className="flex-row items-center justify-center py-4 px-6 rounded-full"
                  style={{ backgroundColor: colors.primary[500] }}
                >
                  <ExternalLink size={20} color="#fff" />
                  <Text
                    className="text-base ml-2"
                    style={{
                      fontFamily: 'Nunito_700Bold',
                      color: '#fff',
                    }}
                  >
                    Open Email App
                  </Text>
                </Pressable>

                {/* Back to Sign In button */}
                <Pressable
                  onPress={handleBackToForm}
                  className="flex-row items-center justify-center py-4 px-6 rounded-full"
                  style={{ backgroundColor: colors.cream[200] }}
                >
                  <Text
                    className="text-base"
                    style={{
                      fontFamily: 'Nunito_600SemiBold',
                      color: colors.jackal[600],
                    }}
                  >
                    Back to Sign In
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.cream[50] }}>
      <LinearGradient
        colors={[colors.cream[50], colors.primary[50], colors.cream[100]]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="flex-1">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
          >
            <ScrollView
              className="flex-1"
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-1 px-6 pt-8 pb-6">
                {/* Header */}
                <Animated.View
                  entering={FadeInDown.delay(100).springify()}
                  className="items-center mb-8"
                >
                  <View
                    className="w-20 h-20 rounded-full items-center justify-center mb-4"
                    style={{ backgroundColor: colors.primary[100] }}
                  >
                    <Text className="text-4xl">🦒</Text>
                  </View>

                  <Text
                    className="text-2xl text-center mb-1"
                    style={{
                      fontFamily: 'Nunito_800ExtraBold',
                      color: colors.jackal[800],
                    }}
                  >
                    {mode === 'signup' ? 'Join the Herd' : 'Welcome Back'}
                  </Text>
                  <Text
                    className="text-sm text-center"
                    style={{
                      fontFamily: 'Nunito_400Regular',
                      color: colors.jackal[500],
                    }}
                  >
                    {mode === 'signup' ? 'Learn compassionate communication with NVC' : 'Continue your NVC practice'}
                  </Text>
                </Animated.View>

                {/* Form */}
                <Animated.View
                  entering={FadeInUp.delay(200).springify()}
                  className="gap-4"
                >
                  {/* Name input (signup only) */}
                  {mode === 'signup' && (
                  <View>
                    <Text
                      className="text-sm mb-2 ml-1"
                      style={{
                        fontFamily: 'Nunito_600SemiBold',
                        color: colors.jackal[600],
                      }}
                    >
                      Your Name
                    </Text>
                    <View
                      className="flex-row items-center rounded-2xl px-4"
                      style={{
                        backgroundColor: colors.cream[100],
                        borderWidth: 2,
                        borderColor: errors.name ? colors.error : colors.cream[200],
                      }}
                    >
                      <User size={20} color={colors.jackal[400]} />
                      <TextInput
                        className="flex-1 py-3.5 px-3 text-base"
                        style={{
                          fontFamily: 'Nunito_500Medium',
                          color: colors.jackal[800],
                        }}
                        placeholder="What should we call you?"
                        placeholderTextColor={colors.jackal[300]}
                        value={name}
                        onChangeText={(text) => {
                          setName(text);
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        autoCapitalize="words"
                        autoCorrect={false}
                        returnKeyType="next"
                        onSubmitEditing={() => emailInputRef.current?.focus()}
                      />
                    </View>
                    {errors.name && (
                      <Text
                        className="text-xs mt-1 ml-1"
                        style={{
                          fontFamily: 'Nunito_500Medium',
                          color: colors.error,
                        }}
                      >
                        {errors.name}
                      </Text>
                    )}
                  </View>
                  )}

                  {/* Email input */}
                  <View>
                    <Text
                      className="text-sm mb-2 ml-1"
                      style={{
                        fontFamily: 'Nunito_600SemiBold',
                        color: colors.jackal[600],
                      }}
                    >
                      Email Address
                    </Text>
                    <View
                      className="flex-row items-center rounded-2xl px-4"
                      style={{
                        backgroundColor: colors.cream[100],
                        borderWidth: 2,
                        borderColor: errors.email ? colors.error : colors.cream[200],
                      }}
                    >
                      <Mail size={20} color={colors.jackal[400]} />
                      <TextInput
                        ref={emailInputRef}
                        className="flex-1 py-3.5 px-3 text-base"
                        style={{
                          fontFamily: 'Nunito_500Medium',
                          color: colors.jackal[800],
                        }}
                        placeholder="your@email.com"
                        placeholderTextColor={colors.jackal[300]}
                        value={email}
                        onChangeText={(text) => {
                          setEmail(text);
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordInputRef.current?.focus()}
                      />
                    </View>
                    {errors.email && (
                      <Text
                        className="text-xs mt-1 ml-1"
                        style={{
                          fontFamily: 'Nunito_500Medium',
                          color: colors.error,
                        }}
                      >
                        {errors.email}
                      </Text>
                    )}
                  </View>

                  {/* Password input */}
                  <View>
                    <Text
                      className="text-sm mb-2 ml-1"
                      style={{
                        fontFamily: 'Nunito_600SemiBold',
                        color: colors.jackal[600],
                      }}
                    >
                      Password
                    </Text>
                    <View
                      className="flex-row items-center rounded-2xl px-4"
                      style={{
                        backgroundColor: colors.cream[100],
                        borderWidth: 2,
                        borderColor: errors.password ? colors.error : colors.cream[200],
                      }}
                    >
                      <Lock size={20} color={colors.jackal[400]} />
                      <TextInput
                        ref={passwordInputRef}
                        className="flex-1 py-3.5 px-3 text-base"
                        style={{
                          fontFamily: 'Nunito_500Medium',
                          color: colors.jackal[800],
                        }}
                        placeholder="••••••••"
                        placeholderTextColor={colors.jackal[300]}
                        value={password}
                        onChangeText={(text) => {
                          setPassword(text);
                          if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                      />
                      <Pressable
                        onPress={() => setShowPassword(!showPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        {showPassword ? (
                          <EyeOff size={20} color={colors.jackal[400]} />
                        ) : (
                          <Eye size={20} color={colors.jackal[400]} />
                        )}
                      </Pressable>
                    </View>
                    {errors.password && (
                      <Text
                        className="text-xs mt-1 ml-1"
                        style={{
                          fontFamily: 'Nunito_500Medium',
                          color: colors.error,
                        }}
                      >
                        {errors.password}
                      </Text>
                    )}

                    {/* Forgot Password link (signin only) */}
                    {mode === 'signin' && (
                      <Pressable onPress={handleForgotPassword} className="mt-2 self-end">
                        <Text
                          className="text-sm"
                          style={{
                            fontFamily: 'Nunito_600SemiBold',
                            color: colors.primary[600],
                          }}
                        >
                          Forgot Password?
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </Animated.View>

                {/* Spacer */}
                <View className="flex-1 min-h-4" />

                {/* General error */}
                {errors.general && (
                  <Animated.View
                    entering={FadeIn}
                    className="mb-4 p-4 rounded-xl"
                    style={{ backgroundColor: colors.coral[100] }}
                  >
                    <Text
                      className="text-sm text-center"
                      style={{
                        fontFamily: 'Nunito_600SemiBold',
                        color: colors.coral[700],
                      }}
                    >
                      {errors.general}
                    </Text>
                  </Animated.View>
                )}

                {/* Sign up button */}
                <Animated.View entering={FadeIn.delay(400)} className="pb-2">
                  <PrimaryButton
                    title={isLoading ? (mode === 'signup' ? 'Creating Account...' : 'Signing In...') : (mode === 'signup' ? 'Get Started' : 'Sign In')}
                    onPress={handleAuth}
                    icon={ArrowRight}
                    loading={isLoading}
                    disabled={isLoading}
                  />

                  {/* Toggle mode */}
                  <Pressable onPress={toggleMode} className="mt-4">
                    <Text
                      className="text-sm text-center"
                      style={{
                        fontFamily: 'Nunito_500Medium',
                        color: colors.jackal[500],
                      }}
                    >
                      {mode === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                      <Text
                        style={{
                          fontFamily: 'Nunito_700Bold',
                          color: colors.primary[600],
                        }}
                      >
                        {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                      </Text>
                    </Text>
                  </Pressable>

                  <Text
                    className="text-xs text-center mt-3"
                    style={{
                      fontFamily: 'Nunito_400Regular',
                      color: colors.jackal[400],
                    }}
                  >
                    By continuing, you agree to our{' '}
                    <Text
                      onPress={() => router.push('/privacy')}
                      style={{
                        fontFamily: 'Nunito_600SemiBold',
                        color: colors.primary[600],
                        textDecorationLine: 'underline',
                      }}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </Animated.View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
