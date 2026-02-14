import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Target,
  Eye,
  Heart,
  Compass,
  MessageSquare,
  Shuffle,
  ChevronRight,
  Play,
  Sparkles,
  Clock,
  Crown,
  Lock,
  BookOpen,
} from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';
import { NVCCategory } from '@/lib/types';
import { PrimaryButton } from '@/components/Button';
import { usePremium } from '@/lib/usePremium';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CategoryCardProps {
  title: string;
  description: string;
  icon: typeof Target;
  iconColor: string;
  category: NVCCategory;
  exerciseCount: number;
  onPress: () => void;
  delay?: number;
  isPremium?: boolean;
  isLocked?: boolean;
}

function CategoryCard({
  title,
  description,
  icon: Icon,
  iconColor,
  exerciseCount,
  onPress,
  delay = 0,
  isPremium = false,
  isLocked = false,
}: CategoryCardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()}>
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.97);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={animatedStyle}
      >
        <View
          className="rounded-2xl p-4 mb-3"
          style={{
            backgroundColor: isLocked ? colors.cream[200] : colors.cream[100],
            shadowColor: isLocked ? colors.jackal[300] : iconColor,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isLocked ? 0.05 : 0.1,
            shadowRadius: 8,
            elevation: isLocked ? 1 : 2,
            opacity: isLocked ? 0.85 : 1,
          }}
        >
          <View className="flex-row items-center">
            <View
              className="w-12 h-12 rounded-xl items-center justify-center mr-4"
              style={{ backgroundColor: isLocked ? colors.jackal[100] : `${iconColor}20` }}
            >
              {isLocked ? (
                <Lock size={24} color={colors.jackal[400]} />
              ) : (
                <Icon size={24} color={iconColor} />
              )}
            </View>

            <View className="flex-1">
              <View className="flex-row items-center">
                <Text
                  className="text-base mb-0.5"
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    color: isLocked ? colors.jackal[500] : colors.jackal[800],
                  }}
                >
                  {title}
                </Text>
                {isPremium && (
                  <View
                    className="flex-row items-center ml-2 px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: colors.primary[100] }}
                  >
                    <Crown size={10} color={colors.primary[600]} fill={colors.primary[300]} />
                    <Text
                      className="text-xs ml-1"
                      style={{
                        fontFamily: 'Nunito_700Bold',
                        color: colors.primary[600],
                      }}
                    >
                      PRO
                    </Text>
                  </View>
                )}
              </View>
              <Text
                className="text-sm"
                style={{
                  fontFamily: 'Nunito_400Regular',
                  color: colors.jackal[400],
                }}
              >
                {isLocked ? 'Upgrade to unlock' : description}
              </Text>
            </View>

            <View className="items-center">
              <Text
                className="text-xs"
                style={{
                  fontFamily: 'Nunito_600SemiBold',
                  color: colors.jackal[400],
                }}
              >
                {exerciseCount}
              </Text>
              <ChevronRight size={20} color={colors.jackal[300]} />
            </View>
          </View>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

function StartPracticeButton({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(100).springify()} className="mx-5 mb-6">
      <AnimatedPressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.97);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={animatedStyle}
      >
        <View
          style={{
            backgroundColor: colors.primary[500],
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: colors.primary[600],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 14,
            }}
          >
            <Sparkles size={24} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 17,
                color: '#FFFFFF',
              }}
            >
              Start Daily Practice
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
              <Clock size={13} color="rgba(255,255,255,0.8)" />
              <Text
                style={{
                  fontFamily: 'Nunito_500Medium',
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.8)',
                  marginLeft: 4,
                }}
              >
                5 exercises · ~5 min
              </Text>
            </View>
          </View>
          <ChevronRight size={22} color="#FFFFFF" />
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function PracticeTabScreen() {
  const router = useRouter();
  const todayExercises = useAppStore(s => s.todayExercisesCompleted);
  const completedExercisesCount = useAppStore(s => s.user?.completedExercises ?? 0);
  const { isPremium } = usePremium();

  // Free exercise limit
  const FREE_EXERCISE_LIMIT = 40;
  const hasHitFreeLimit = !isPremium && completedExercisesCount >= FREE_EXERCISE_LIMIT;

  const categories = [
    {
      title: 'Observations',
      description: 'Spot judgments vs facts',
      icon: Eye,
      iconColor: colors.primary[500],
      category: 'observations' as NVCCategory,
      exerciseCount: 15,
      isPremium: false,
    },
    {
      title: 'Feelings',
      description: 'Real feelings vs faux feelings',
      icon: Heart,
      iconColor: colors.coral[500],
      category: 'feelings' as NVCCategory,
      exerciseCount: 21,
      isPremium: false,
    },
    {
      title: 'Needs',
      description: 'Uncover universal human needs',
      icon: Compass,
      iconColor: colors.sage[500],
      category: 'needs' as NVCCategory,
      exerciseCount: 11,
      isPremium: true,
    },
    {
      title: 'Requests',
      description: 'Requests vs demands',
      icon: MessageSquare,
      iconColor: colors.primary[600],
      category: 'requests' as NVCCategory,
      exerciseCount: 7,
      isPremium: true,
    },
    {
      title: 'Integration',
      description: 'Put it all together',
      icon: Shuffle,
      iconColor: colors.jackal[500],
      category: 'integration' as NVCCategory,
      exerciseCount: 46,
      isPremium: true,
    },
  ];

  const handleStartPractice = () => {
    if (hasHitFreeLimit) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/paywall');
      return;
    }
    router.push('/practice-session');
  };

  const handleCategoryPress = (category: NVCCategory, categoryIsPremium: boolean) => {
    // Check free exercise limit first
    if (hasHitFreeLimit) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/paywall');
      return;
    }
    // Then check if specific category requires premium
    if (categoryIsPremium && !isPremium) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push('/paywall');
      return;
    }
    router.push({ pathname: '/practice-session', params: { category } });
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.cream[50] }}>
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="px-5 pt-4 pb-6">
            <Animated.View entering={FadeIn.delay(50)}>
              <Text
                className="text-2xl"
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  color: colors.jackal[800],
                }}
              >
                Practice
              </Text>
              <Text
                className="text-base mt-1"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[400],
                }}
              >
                Build your giraffe communication skills
              </Text>
            </Animated.View>

            {/* Today's progress */}
            {todayExercises > 0 && (
              <Animated.View
                entering={FadeInDown.delay(100).springify()}
                className="mt-4 flex-row items-center gap-2 py-2 px-3 rounded-xl self-start"
                style={{ backgroundColor: colors.sage[50] }}
              >
                <Target size={16} color={colors.sage[500]} />
                <Text
                  className="text-sm"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.sage[600],
                  }}
                >
                  {todayExercises} completed today
                </Text>
              </Animated.View>
            )}
          </View>

          {/* Start Practice Button */}
          <StartPracticeButton onPress={handleStartPractice} />

          {/* NVC Vocabulary Reference */}
          <Animated.View entering={FadeInDown.delay(150).springify()} className="mx-5 mb-6">
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/nvc-vocabulary');
              }}
            >
              <View
                className="rounded-2xl p-4 flex-row items-center"
                style={{
                  backgroundColor: colors.sage[50],
                  borderWidth: 1.5,
                  borderColor: colors.sage[200],
                }}
              >
                <View
                  className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                  style={{ backgroundColor: colors.sage[100] }}
                >
                  <BookOpen size={22} color={colors.sage[600]} />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-base"
                    style={{
                      fontFamily: 'Nunito_700Bold',
                      color: colors.sage[700],
                    }}
                  >
                    NVC Vocabulary
                  </Text>
                  <Text
                    className="text-sm"
                    style={{
                      fontFamily: 'Nunito_500Medium',
                      color: colors.sage[500],
                    }}
                  >
                    Feelings & Needs reference guide
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.sage[400]} />
              </View>
            </Pressable>
          </Animated.View>

          {/* Categories */}
          <View className="px-5">
            <Text
              className="text-lg mb-4"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[800],
              }}
            >
              Practice by Topic
            </Text>

            {categories.map((cat, index) => (
              <CategoryCard
                key={cat.category}
                {...cat}
                onPress={() => handleCategoryPress(cat.category, cat.isPremium)}
                delay={200 + index * 50}
                isLocked={cat.isPremium && !isPremium}
              />
            ))}
          </View>

          {/* Learning tip */}
          <Animated.View
            entering={FadeInDown.delay(500).springify()}
            className="mx-5 mt-4 mb-8"
          >
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.primary[50] }}
            >
              <Text
                className="text-sm"
                style={{
                  fontFamily: 'Nunito_700Bold',
                  color: colors.primary[700],
                }}
              >
                💡 Learning Tip
              </Text>
              <Text
                className="text-sm mt-1 leading-5"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.primary[600],
                }}
              >
                Consistent daily practice beats long irregular sessions. Even 5 minutes a day builds lasting skills!
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
