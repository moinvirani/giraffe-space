import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';

// Key to track if user has ever signed up (persists across logouts)
const HAS_SIGNED_UP_KEY = '@giraffe_has_signed_up';

export default function IndexScreen() {
  const router = useRouter();
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const hasCompletedOnboarding = useAppStore(s => s.hasCompletedOnboarding);
  const [isChecking, setIsChecking] = useState(true);
  const [hasEverSignedUp, setHasEverSignedUp] = useState(false);

  useEffect(() => {
    // Check if user has ever signed up on this device
    const checkSignupHistory = async () => {
      try {
        const hasSignedUp = await AsyncStorage.getItem(HAS_SIGNED_UP_KEY);
        setHasEverSignedUp(hasSignedUp === 'true');
      } catch (error) {
        console.log('Error checking signup history:', error);
      } finally {
        setIsChecking(false);
      }
    };
    checkSignupHistory();
  }, []);

  useEffect(() => {
    if (isChecking) return;

    // Small delay to ensure state is loaded
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        // User is logged in - go to main app
        router.replace('/(tabs)');
      } else if (hasEverSignedUp) {
        // User has signed up before but logged out - go to auth
        router.replace('/auth');
      } else if (!hasCompletedOnboarding) {
        // New user - show onboarding first
        router.replace('/onboarding');
      } else {
        // Completed onboarding but not signed up yet (edge case)
        router.replace('/auth');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding, hasEverSignedUp, isChecking, router]);

  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.cream[50] }}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
    </View>
  );
}
