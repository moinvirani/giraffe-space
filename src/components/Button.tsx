import { Pressable, Text, View, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '@/lib/colors';
import { LucideIcon } from 'lucide-react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'sage' | 'coral';
}

export function PrimaryButton({
  title,
  onPress,
  icon: Icon,
  disabled = false,
  loading = false,
  variant = 'primary',
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const getGradientColors = (): [string, string, string] => {
    if (disabled || loading) {
      return [colors.jackal[200], colors.jackal[300], colors.jackal[300]];
    }
    switch (variant) {
      case 'sage':
        return [colors.sage[400], colors.sage[500], colors.sage[600]];
      case 'coral':
        return [colors.coral[400], colors.coral[500], colors.coral[600]];
      default:
        return [colors.primary[400], colors.primary[500], colors.primary[600]];
    }
  };

  const getShadowColor = () => {
    if (disabled || loading) return colors.jackal[300];
    switch (variant) {
      case 'sage':
        return colors.sage[600];
      case 'coral':
        return colors.coral[600];
      default:
        return colors.primary[600];
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={animatedStyle}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 16,
          minHeight: 56,
          shadowColor: getShadowColor(),
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: disabled || loading ? 0 : 0.25,
          shadowRadius: 12,
          elevation: disabled || loading ? 0 : 6,
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 17,
                color: '#FFFFFF',
                marginRight: Icon ? 8 : 0,
              }}
            >
              {title}
            </Text>
            {Icon && <Icon size={22} color="#FFFFFF" strokeWidth={2.5} />}
          </>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
}

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export function SecondaryButton({
  title,
  onPress,
  icon: Icon,
  iconPosition = 'left',
}: SecondaryButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 16,
          backgroundColor: colors.cream[200],
          minHeight: 56,
        }}
      >
        {Icon && iconPosition === 'left' && (
          <Icon size={20} color={colors.jackal[600]} style={{ marginRight: 6 }} />
        )}
        <Text
          style={{
            fontFamily: 'Nunito_600SemiBold',
            fontSize: 16,
            color: colors.jackal[700],
          }}
        >
          {title}
        </Text>
        {Icon && iconPosition === 'right' && (
          <Icon size={20} color={colors.jackal[600]} style={{ marginLeft: 6 }} />
        )}
      </View>
    </AnimatedPressable>
  );
}
