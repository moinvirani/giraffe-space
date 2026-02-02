import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RevenueCatUI from 'react-native-purchases-ui';
import { PurchasesError } from 'react-native-purchases';
import * as Haptics from 'expo-haptics';
import { colors } from '@/lib/colors';
import { useState, useEffect } from 'react';
import { getOfferings } from '@/lib/revenuecatClient';
import { X, AlertCircle, Clock, RefreshCw } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useQueryClient } from '@tanstack/react-query';
import { premiumKeys } from '@/lib/usePremium';

type PaywallState = 'loading' | 'ready' | 'error' | 'no_products';

export default function PaywallScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const [paywallState, setPaywallState] = useState<PaywallState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    checkOfferings();
  }, []);

  const checkOfferings = async () => {
    setPaywallState('loading');
    setErrorMessage('');

    try {
      const result = await getOfferings();

      if (!result.ok) {
        if (result.reason === 'web_not_supported') {
          setErrorMessage('Subscriptions are only available in the mobile app.');
          setPaywallState('error');
        } else if (result.reason === 'not_configured') {
          setErrorMessage('Subscriptions are being set up. Please check back soon!');
          setPaywallState('error');
        } else {
          setErrorMessage('Unable to load subscription options. Please try again later.');
          setPaywallState('error');
        }
        return;
      }

      // Check if we have valid offerings with products
      const offerings = result.data;
      const currentOffering = offerings?.current;
      const hasPackages = currentOffering?.availablePackages && currentOffering.availablePackages.length > 0;

      if (!hasPackages) {
        setPaywallState('no_products');
        return;
      }

      setPaywallState('ready');
    } catch (error) {
      console.log('[Paywall] Error checking offerings:', error);
      setErrorMessage('Something went wrong. Please try again.');
      setPaywallState('error');
    }
  };

  const handleDismiss = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handlePurchaseCompleted = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Immediately invalidate the premium status cache so the app refreshes
    queryClient.invalidateQueries({ queryKey: premiumKeys.status() });
    router.back();
  };

  const handleRestoreCompleted = (info: { customerInfo: unknown }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Immediately invalidate the premium status cache so the app refreshes
    queryClient.invalidateQueries({ queryKey: premiumKeys.status() });
    router.back();
  };

  const handlePurchaseError = ({ error }: { error: PurchasesError }) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    // Error code 23 = Configuration error (products not approved yet)
    // Check if error code contains "23" or is CONFIGURATION_ERROR
    const errorMessage = error?.message || '';
    const isConfigError = errorMessage.includes('23') || errorMessage.toLowerCase().includes('configuration');

    if (isConfigError) {
      setErrorMessage('Subscriptions are pending App Store approval. Please try again in a few days.');
      setPaywallState('no_products');
    }
  };

  // Loading state
  if (paywallState === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream[50] }}>
        <View style={{ paddingTop: insets.top }} className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary[500]} />
          <Text style={{ color: colors.jackal[500] }} className="mt-4 text-base">
            Loading subscription options...
          </Text>
        </View>
      </View>
    );
  }

  // Error state or no products state
  if (paywallState === 'error' || paywallState === 'no_products') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.cream[50], paddingTop: insets.top }}>
        {/* Header with close button */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="w-10" />
          <Text style={{ color: colors.jackal[800] }} className="text-lg font-semibold">
            Premium
          </Text>
          <Pressable
            onPress={handleDismiss}
            className="w-10 h-10 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.cream[200] }}
          >
            <X size={20} color={colors.jackal[600]} />
          </Pressable>
        </View>

        {/* Content */}
        <Animated.View
          entering={FadeIn.duration(300)}
          className="flex-1 items-center justify-center px-8"
        >
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            className="items-center"
          >
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: colors.primary[100] }}
            >
              {paywallState === 'no_products' ? (
                <Clock size={40} color={colors.primary[500]} />
              ) : (
                <AlertCircle size={40} color={colors.coral[500]} />
              )}
            </View>

            <Text
              style={{ color: colors.jackal[800] }}
              className="text-2xl font-bold text-center mb-3"
            >
              {paywallState === 'no_products' ? 'Coming Soon!' : 'Oops!'}
            </Text>

            <Text
              style={{ color: colors.jackal[500] }}
              className="text-base text-center leading-6 mb-8"
            >
              {paywallState === 'no_products'
                ? "Premium subscriptions are being reviewed by Apple. We'll notify you when they're ready!"
                : errorMessage || 'Unable to load subscription options.'}
            </Text>

            {/* Retry button */}
            <Pressable
              onPress={checkOfferings}
              className="flex-row items-center px-6 py-3 rounded-full"
              style={{ backgroundColor: colors.primary[500] }}
            >
              <RefreshCw size={18} color="#fff" />
              <Text className="text-white font-semibold ml-2">Try Again</Text>
            </Pressable>

            {/* Feature preview */}
            <View
              className="mt-10 p-5 rounded-2xl w-full"
              style={{ backgroundColor: colors.cream[200] }}
            >
              <Text
                style={{ color: colors.jackal[700] }}
                className="text-sm font-semibold mb-3"
              >
                Premium features include:
              </Text>
              {['Unlimited access to all content', 'Ad-free experience', 'Exclusive features'].map((feature, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View
                    className="w-2 h-2 rounded-full mr-3"
                    style={{ backgroundColor: colors.primary[500] }}
                  />
                  <Text style={{ color: colors.jackal[600] }} className="text-sm">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </Animated.View>

        {/* Bottom dismiss button */}
        <View style={{ paddingBottom: insets.bottom + 16 }} className="px-6">
          <Pressable
            onPress={handleDismiss}
            className="py-4 rounded-full items-center"
            style={{ backgroundColor: colors.cream[300] }}
          >
            <Text style={{ color: colors.jackal[600] }} className="font-semibold">
              Maybe Later
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // Ready state - show RevenueCat paywall
  return (
    <View style={{ flex: 1, backgroundColor: colors.cream[50] }}>
      <RevenueCatUI.Paywall
        style={{ flex: 1 }}
        options={{
          displayCloseButton: true,
        }}
        onDismiss={handleDismiss}
        onPurchaseCompleted={handlePurchaseCompleted}
        onRestoreCompleted={handleRestoreCompleted}
        onPurchaseError={handlePurchaseError}
      />
    </View>
  );
}
