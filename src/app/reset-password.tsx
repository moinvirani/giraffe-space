import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '@/lib/colors';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react-native';
import { PrimaryButton } from '@/components/Button';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; general?: string }>({});

  const confirmPasswordRef = useRef<TextInput>(null);

  // Extract token from deep link params
  const accessToken = params.access_token as string | undefined;
  const refreshToken = params.refresh_token as string | undefined;

  useEffect(() => {
    // Check if we have the required tokens
    if (!accessToken) {
      Alert.alert(
        'Invalid Link',
        'This password reset link is invalid or has expired. Please request a new one.',
        [{ text: 'OK', onPress: () => router.replace('/auth') }]
      );
    }
  }, [accessToken, router]);

  const handleResetPassword = async () => {
    const newErrors: typeof errors = {};

    if (!password.trim()) {
      newErrors.password = 'Please enter a new password';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirm = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirm = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // Use the access token from the deep link to update the password
      const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || data.msg || data.message || 'Failed to update password');
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsSuccess(true);
    } catch (error) {
      let message = error instanceof Error ? error.message : 'Something went wrong';

      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('expired') || lowerMessage.includes('invalid')) {
        message = 'This reset link has expired. Please request a new password reset.';
      } else if (lowerMessage.includes('rate limit')) {
        message = 'Too many attempts. Please wait a moment and try again.';
      }

      setErrors({ general: message });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.cream[50] }}>
        <LinearGradient
          colors={[colors.cream[50], colors.sage[50], colors.cream[100]]}
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
                <View
                  className="w-24 h-24 rounded-full items-center justify-center mb-6"
                  style={{ backgroundColor: colors.sage[100] }}
                >
                  <CheckCircle2 size={48} color={colors.sage[600]} strokeWidth={1.5} />
                </View>

                <Text
                  className="text-2xl text-center mb-2"
                  style={{
                    fontFamily: 'Nunito_800ExtraBold',
                    color: colors.jackal[800],
                  }}
                >
                  Password Updated!
                </Text>

                <Text
                  className="text-base text-center mb-8 px-4"
                  style={{
                    fontFamily: 'Nunito_500Medium',
                    color: colors.jackal[500],
                  }}
                >
                  Your password has been successfully changed. You can now sign in with your new password.
                </Text>
              </Animated.View>

              <Animated.View entering={FadeIn.delay(300)} className="w-full">
                <PrimaryButton
                  title="Sign In"
                  onPress={() => router.replace('/auth')}
                />
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
          <View className="flex-1 px-6 justify-center">
            <Animated.View
              entering={FadeInDown.springify()}
              className="items-center mb-8"
            >
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-4"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <Lock size={40} color={colors.primary[600]} strokeWidth={1.5} />
              </View>

              <Text
                className="text-2xl text-center mb-2"
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  color: colors.jackal[800],
                }}
              >
                Set New Password
              </Text>

              <Text
                className="text-sm text-center px-4"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[500],
                }}
              >
                Enter your new password below
              </Text>
            </Animated.View>

            {/* Form */}
            <Animated.View
              entering={FadeIn.delay(200)}
              className="gap-4"
            >
              {/* New Password */}
              <View>
                <Text
                  className="text-sm mb-2 ml-1"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.jackal[600],
                  }}
                >
                  New Password
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
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
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
              </View>

              {/* Confirm Password */}
              <View>
                <Text
                  className="text-sm mb-2 ml-1"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.jackal[600],
                  }}
                >
                  Confirm Password
                </Text>
                <View
                  className="flex-row items-center rounded-2xl px-4"
                  style={{
                    backgroundColor: colors.cream[100],
                    borderWidth: 2,
                    borderColor: errors.confirm ? colors.error : colors.cream[200],
                  }}
                >
                  <Lock size={20} color={colors.jackal[400]} />
                  <TextInput
                    ref={confirmPasswordRef}
                    className="flex-1 py-3.5 px-3 text-base"
                    style={{
                      fontFamily: 'Nunito_500Medium',
                      color: colors.jackal[800],
                    }}
                    placeholder="••••••••"
                    placeholderTextColor={colors.jackal[300]}
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      if (errors.confirm) setErrors({ ...errors, confirm: undefined });
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={handleResetPassword}
                  />
                  <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={colors.jackal[400]} />
                    ) : (
                      <Eye size={20} color={colors.jackal[400]} />
                    )}
                  </Pressable>
                </View>
                {errors.confirm && (
                  <Text
                    className="text-xs mt-1 ml-1"
                    style={{
                      fontFamily: 'Nunito_500Medium',
                      color: colors.error,
                    }}
                  >
                    {errors.confirm}
                  </Text>
                )}
              </View>

              {/* General error */}
              {errors.general && (
                <Animated.View
                  entering={FadeIn}
                  className="p-4 rounded-xl"
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
            </Animated.View>

            {/* Submit button */}
            <Animated.View entering={FadeIn.delay(400)} className="mt-8">
              <PrimaryButton
                title={isLoading ? 'Updating...' : 'Update Password'}
                onPress={handleResetPassword}
                loading={isLoading}
                disabled={isLoading}
              />

              <Pressable
                onPress={() => router.replace('/auth')}
                className="mt-4"
              >
                <Text
                  className="text-sm text-center"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.primary[600],
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
