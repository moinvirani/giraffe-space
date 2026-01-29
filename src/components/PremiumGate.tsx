import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Crown, Lock, Sparkles } from 'lucide-react-native';
import { colors } from '@/lib/colors';
import { usePremium } from '@/lib/usePremium';

interface PremiumGateProps {
  children: React.ReactNode;
  feature?: string;
}

/**
 * Wraps content that requires premium access.
 * Shows the children if user is premium, otherwise shows an upgrade prompt.
 */
export function PremiumGate({ children, feature }: PremiumGateProps) {
  const router = useRouter();
  const { isPremium, isLoading } = usePremium();

  if (isLoading) {
    return <>{children}</>;
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <Animated.View entering={FadeIn} className="flex-1 items-center justify-center p-6">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: colors.primary[100] }}
      >
        <Lock size={36} color={colors.primary[500]} />
      </View>

      <Text
        className="text-xl text-center mb-2"
        style={{
          fontFamily: 'Nunito_700Bold',
          color: colors.jackal[800],
        }}
      >
        Premium Feature
      </Text>

      <Text
        className="text-base text-center mb-6 px-4"
        style={{
          fontFamily: 'Nunito_500Medium',
          color: colors.jackal[500],
          lineHeight: 24,
        }}
      >
        {feature
          ? `Upgrade to Premium to ${feature}`
          : 'Upgrade to Premium to unlock this feature'}
      </Text>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/paywall');
        }}
      >
        <LinearGradient
          colors={[colors.primary[400], colors.primary[500], colors.primary[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
            paddingHorizontal: 28,
            borderRadius: 16,
            shadowColor: colors.primary[600],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
          }}
        >
          <Crown size={20} color="#FFFFFF" />
          <Text
            className="text-base ml-2"
            style={{
              fontFamily: 'Nunito_700Bold',
              color: '#FFFFFF',
            }}
          >
            Unlock Premium
          </Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

interface PremiumBadgeProps {
  size?: 'small' | 'medium';
}

/**
 * A small badge to indicate premium-only features
 */
export function PremiumBadge({ size = 'small' }: PremiumBadgeProps) {
  const isSmall = size === 'small';

  return (
    <View
      className="flex-row items-center rounded-full"
      style={{
        backgroundColor: colors.primary[100],
        paddingHorizontal: isSmall ? 8 : 12,
        paddingVertical: isSmall ? 3 : 5,
      }}
    >
      <Crown
        size={isSmall ? 12 : 14}
        color={colors.primary[600]}
        fill={colors.primary[300]}
      />
      <Text
        className={isSmall ? 'text-xs' : 'text-sm'}
        style={{
          fontFamily: 'Nunito_700Bold',
          color: colors.primary[600],
          marginLeft: 4,
        }}
      >
        PRO
      </Text>
    </View>
  );
}

interface UpgradePromptProps {
  title?: string;
  message?: string;
  compact?: boolean;
}

/**
 * An inline prompt to upgrade to premium
 */
export function UpgradePrompt({
  title = 'Want more?',
  message = 'Upgrade to Premium for unlimited access',
  compact = false,
}: UpgradePromptProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/paywall');
      }}
    >
      <LinearGradient
        colors={[colors.primary[50], colors.primary[100]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 16,
          padding: compact ? 12 : 16,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.primary[200],
        }}
      >
        <View
          className="rounded-full items-center justify-center mr-3"
          style={{
            width: compact ? 36 : 44,
            height: compact ? 36 : 44,
            backgroundColor: colors.primary[200],
          }}
        >
          <Sparkles size={compact ? 18 : 22} color={colors.primary[600]} />
        </View>

        <View className="flex-1">
          <Text
            className={compact ? 'text-sm' : 'text-base'}
            style={{
              fontFamily: 'Nunito_700Bold',
              color: colors.primary[700],
            }}
          >
            {title}
          </Text>
          <Text
            className={compact ? 'text-xs' : 'text-sm'}
            style={{
              fontFamily: 'Nunito_500Medium',
              color: colors.primary[600],
            }}
          >
            {message}
          </Text>
        </View>

        <Crown size={20} color={colors.primary[500]} />
      </LinearGradient>
    </Pressable>
  );
}
