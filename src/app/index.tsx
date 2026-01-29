import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';

export default function IndexScreen() {
  const router = useRouter();
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const hasCompletedOnboarding = useAppStore(s => s.hasCompletedOnboarding);

  useEffect(() => {
    // Small delay to ensure state is loaded
    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else if (!isAuthenticated) {
        router.replace('/auth');
      } else {
        router.replace('/(tabs)');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasCompletedOnboarding, router]);

  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.cream[50] }}>
      <ActivityIndicator size="large" color={colors.primary[500]} />
    </View>
  );
}
