import { useState, useRef } from 'react';
import { View, Text, Pressable, Dimensions, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';
import { Heart, MessageCircleHeart, BookHeart, Sparkles, ChevronRight } from 'lucide-react-native';
import { PrimaryButton } from '@/components/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  iconType: 'heart' | 'sparkles' | 'book' | 'message';
  gradientColors: readonly [string, string, string];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to Giraffe',
    subtitle: 'Speak from the heart',
    description:
      "Learn Nonviolent Communication (NVC), the transformative framework developed by Dr. Marshall Rosenberg to create deeper connections and resolve conflicts with compassion.",
    iconType: 'heart',
    gradientColors: [colors.cream[50], colors.primary[50], colors.coral[50]] as const,
  },
  {
    id: '2',
    title: 'Daily Practice',
    subtitle: 'Small steps, big changes',
    description:
      "Fun, bite-sized exercises help you master the art of compassionate communication. Just 5 minutes a day!",
    iconType: 'sparkles',
    gradientColors: [colors.cream[50], colors.primary[100], colors.sage[50]] as const,
  },
  {
    id: '3',
    title: 'Giraffe Journal',
    subtitle: 'Process your feelings',
    description:
      "Turn reactive thoughts into understanding. Our guided journal helps you identify feelings and needs beneath the surface.",
    iconType: 'book',
    gradientColors: [colors.cream[50], colors.sage[100], colors.cream[100]] as const,
  },
  {
    id: '4',
    title: 'Gigi is here to help',
    subtitle: 'Your compassionate AI companion',
    description:
      "Stuck on how to phrase something? Gigi helps you craft the perfect words for any difficult conversation.",
    iconType: 'message',
    gradientColors: [colors.cream[50], colors.coral[50], colors.primary[50]] as const,
  },
];

function SlideIcon({ type }: { type: OnboardingSlide['iconType'] }) {
  switch (type) {
    case 'heart':
      return <Heart size={80} color={colors.coral[400]} strokeWidth={1.5} fill={colors.coral[200]} />;
    case 'sparkles':
      return <Sparkles size={80} color={colors.primary[500]} strokeWidth={1.5} />;
    case 'book':
      return <BookHeart size={80} color={colors.sage[500]} strokeWidth={1.5} />;
    case 'message':
      return <MessageCircleHeart size={80} color={colors.primary[500]} strokeWidth={1.5} />;
  }
}

function GiraffeCharacter({ animated = false }: { animated?: boolean }) {
  const neckHeight = useSharedValue(1);

  const neckStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: neckHeight.value }],
  }));

  if (animated) {
    neckHeight.value = withDelay(
      500,
      withSequence(
        withSpring(1.1, { damping: 4, stiffness: 80 }),
        withSpring(1, { damping: 8, stiffness: 100 })
      )
    );
  }

  return (
    <View className="items-center justify-center">
      {/* Head */}
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        className="items-center"
      >
        <View
          className="w-20 h-16 rounded-t-full items-center justify-center"
          style={{ backgroundColor: colors.primary[400] }}
        >
          {/* Eyes */}
          <View className="flex-row gap-4 mt-2">
            <View className="w-3 h-4 rounded-full" style={{ backgroundColor: colors.jackal[800] }} />
            <View className="w-3 h-4 rounded-full" style={{ backgroundColor: colors.jackal[800] }} />
          </View>
          {/* Smile */}
          <View
            className="w-6 h-3 rounded-b-full mt-1"
            style={{ borderWidth: 2, borderTopWidth: 0, borderColor: colors.jackal[700] }}
          />
        </View>
        {/* Ossicones (horns) */}
        <View className="absolute -top-4 flex-row gap-8">
          <View
            className="w-2 h-6 rounded-full"
            style={{ backgroundColor: colors.primary[600] }}
          />
          <View
            className="w-2 h-6 rounded-full"
            style={{ backgroundColor: colors.primary[600] }}
          />
        </View>
        {/* Ears */}
        <View className="absolute top-1 -left-2">
          <View
            className="w-4 h-6 rounded-full -rotate-12"
            style={{ backgroundColor: colors.primary[300] }}
          />
        </View>
        <View className="absolute top-1 -right-2">
          <View
            className="w-4 h-6 rounded-full rotate-12"
            style={{ backgroundColor: colors.primary[300] }}
          />
        </View>
      </Animated.View>

      {/* Neck */}
      <Animated.View
        style={[neckStyle, { transformOrigin: 'top' }]}
        entering={FadeIn.delay(100)}
      >
        <View
          className="w-10 h-24 rounded-b-lg"
          style={{ backgroundColor: colors.primary[400] }}
        >
          {/* Spots */}
          <View
            className="absolute top-4 left-2 w-3 h-4 rounded-full"
            style={{ backgroundColor: colors.primary[600] }}
          />
          <View
            className="absolute top-12 right-2 w-4 h-3 rounded-full"
            style={{ backgroundColor: colors.primary[600] }}
          />
          <View
            className="absolute top-20 left-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.primary[600] }}
          />
        </View>
      </Animated.View>

      {/* Heart badge */}
      <Animated.View
        entering={FadeInUp.delay(600).springify()}
        className="absolute -bottom-4 -right-4"
      >
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.coral[100] }}
        >
          <Heart size={24} color={colors.coral[500]} fill={colors.coral[400]} />
        </View>
      </Animated.View>
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const completeOnboarding = useAppStore(s => s.completeOnboarding);
  const [currentPage, setCurrentPage] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentPage + 1, animated: true });
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace('/auth');
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => (
    <View style={{ width: SCREEN_WIDTH }} className="flex-1">
      <LinearGradient
        colors={item.gradientColors as unknown as [string, string, ...string[]]}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView className="flex-1">
          <View className="flex-1 px-8 pt-8">
            {/* Skip button */}
            {index < slides.length - 1 && (
              <Pressable
                onPress={handleComplete}
                className="self-end py-2 px-4"
              >
                <Text
                  className="text-base"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.jackal[400],
                  }}
                >
                  Skip
                </Text>
              </Pressable>
            )}

            {/* Content */}
            <View className="flex-1 items-center justify-center -mt-12">
              {index === 0 ? (
                <GiraffeCharacter animated={currentPage === 0} />
              ) : (
                <View
                  className="w-40 h-40 rounded-full items-center justify-center"
                  style={{ backgroundColor: `${colors.cream[100]}90` }}
                >
                  <SlideIcon type={item.iconType} />
                </View>
              )}

              <View className="mt-12 items-center">
                <Text
                  className="text-sm uppercase tracking-widest mb-2"
                  style={{
                    fontFamily: 'Quicksand_600SemiBold',
                    color: colors.primary[600],
                  }}
                >
                  {item.subtitle}
                </Text>
                <Text
                  className="text-3xl text-center mb-4"
                  style={{
                    fontFamily: 'Nunito_800ExtraBold',
                    color: colors.jackal[800],
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-base text-center leading-6 px-4"
                  style={{
                    fontFamily: 'Nunito_400Regular',
                    color: colors.jackal[500],
                  }}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.cream[50] }}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setCurrentPage(index);
        }}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Bottom navigation */}
      <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-0">
        <View className="px-6 pb-4">
          {/* Page indicators */}
          <View className="flex-row justify-center gap-2 mb-6">
            {slides.map((_, index) => (
              <View
                key={index}
                className="h-2 rounded-full"
                style={{
                  width: currentPage === index ? 24 : 8,
                  backgroundColor:
                    currentPage === index ? colors.primary[500] : colors.cream[300],
                }}
              />
            ))}
          </View>

          {/* Continue button */}
          <PrimaryButton
            title={currentPage === slides.length - 1 ? "Let's Begin" : 'Continue'}
            onPress={handleNext}
            icon={ChevronRight}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
