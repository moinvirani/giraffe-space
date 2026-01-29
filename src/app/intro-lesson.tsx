import { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Dimensions, FlatList, ViewToken, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { ChevronRight, ChevronLeft, Check, X, Sparkles } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';
import { getIntroLesson, IntroLesson, IntroSlide } from '@/lib/intro-lessons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SlideContentProps {
  slide: IntroSlide;
  lessonColor: string;
}

function SlideContent({ slide, lessonColor }: SlideContentProps) {
  return (
    <Animated.View
      entering={FadeInDown.springify()}
      className="flex-1 px-6 pt-8"
    >
      {/* Big emoji */}
      <View
        className="w-28 h-28 rounded-3xl items-center justify-center self-center mb-8"
        style={{ backgroundColor: `${lessonColor}20` }}
      >
        <Text className="text-6xl">{slide.image}</Text>
      </View>

      {/* Title */}
      <Text
        className="text-center mb-5"
        style={{
          fontFamily: 'Nunito_800ExtraBold',
          color: colors.jackal[800],
          fontSize: 26,
          lineHeight: 32,
        }}
      >
        {slide.title}
      </Text>

      {/* Content - LARGER TEXT for better readability */}
      <Text
        className="text-center"
        style={{
          fontFamily: 'Nunito_500Medium',
          color: colors.jackal[600],
          fontSize: 18,
          lineHeight: 28,
        }}
      >
        {slide.highlight ? (
          <>
            {slide.content.split(slide.highlight)[0]}
            <Text style={{ fontFamily: 'Nunito_700Bold', color: lessonColor }}>
              {slide.highlight}
            </Text>
            {slide.content.split(slide.highlight)[1]}
          </>
        ) : (
          slide.content
        )}
      </Text>
    </Animated.View>
  );
}

interface QuizScreenProps {
  lesson: IntroLesson;
  onComplete: (correct: boolean) => void;
}

function QuizScreen({ lesson, onComplete }: QuizScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const isCorrect = selectedAnswer === lesson.quiz.correctAnswer;

  const handleSelect = (index: number) => {
    if (showFeedback) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAnswer(index);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    setShowFeedback(true);
    if (selectedAnswer === lesson.quiz.correctAnswer) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleContinue = () => {
    onComplete(isCorrect);
  };

  return (
    <Animated.View entering={FadeIn} className="flex-1 px-6 pt-4">
      {/* Quiz badge */}
      <View
        className="self-center px-4 py-2 rounded-full mb-6"
        style={{ backgroundColor: colors.primary[100] }}
      >
        <Text
          className="text-sm"
          style={{
            fontFamily: 'Nunito_700Bold',
            color: colors.primary[600],
          }}
        >
          Quick Quiz
        </Text>
      </View>

      {/* Question */}
      <Text
        className="text-xl text-center mb-6"
        style={{
          fontFamily: 'Nunito_700Bold',
          color: colors.jackal[800],
        }}
      >
        {lesson.quiz.question}
      </Text>

      {/* Options */}
      <View className="gap-3">
        {lesson.quiz.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = index === lesson.quiz.correctAnswer;
          const showAsCorrect = showFeedback && isCorrectOption;
          const showAsWrong = showFeedback && isSelected && !isCorrectOption;

          return (
            <Pressable
              key={index}
              onPress={() => handleSelect(index)}
              disabled={showFeedback}
            >
              <View
                className="rounded-2xl p-4 flex-row items-center"
                style={{
                  backgroundColor: showAsCorrect
                    ? colors.sage[100]
                    : showAsWrong
                    ? `${colors.error}15`
                    : isSelected
                    ? colors.primary[100]
                    : colors.cream[100],
                  borderWidth: 2,
                  borderColor: showAsCorrect
                    ? colors.sage[500]
                    : showAsWrong
                    ? colors.error
                    : isSelected
                    ? colors.primary[500]
                    : colors.cream[200],
                }}
              >
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor: showAsCorrect
                      ? colors.sage[500]
                      : showAsWrong
                      ? colors.error
                      : isSelected
                      ? colors.primary[500]
                      : colors.cream[300],
                  }}
                >
                  {showAsCorrect ? (
                    <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  ) : showAsWrong ? (
                    <X size={16} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <Text
                      className="text-sm"
                      style={{
                        fontFamily: 'Nunito_700Bold',
                        color: isSelected ? '#FFFFFF' : colors.jackal[500],
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </Text>
                  )}
                </View>
                <Text
                  className="flex-1 text-base"
                  style={{
                    fontFamily: isSelected ? 'Nunito_600SemiBold' : 'Nunito_500Medium',
                    color: colors.jackal[700],
                  }}
                >
                  {option}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Feedback */}
      {showFeedback && (
        <Animated.View
          entering={FadeInUp.springify()}
          className="mt-4 rounded-2xl p-4"
          style={{
            backgroundColor: isCorrect ? colors.sage[50] : colors.coral[50],
          }}
        >
          <Text
            className="text-sm leading-5"
            style={{
              fontFamily: 'Nunito_500Medium',
              color: isCorrect ? colors.sage[700] : colors.coral[700],
            }}
          >
            {lesson.quiz.explanation}
          </Text>
        </Animated.View>
      )}

      {/* Spacer */}
      <View className="flex-1" />

      {/* Action button */}
      <View className="pb-6">
        <Pressable
          onPress={showFeedback ? handleContinue : handleCheck}
          disabled={selectedAnswer === null && !showFeedback}
        >
          <LinearGradient
            colors={
              selectedAnswer === null && !showFeedback
                ? [colors.jackal[200], colors.jackal[300]]
                : showFeedback
                ? isCorrect
                  ? [colors.sage[400], colors.sage[500], colors.sage[600]]
                  : [colors.coral[400], colors.coral[500], colors.coral[600]]
                : [colors.primary[400], colors.primary[500], colors.primary[600]]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 16,
              borderRadius: 16,
              minHeight: 56,
              shadowColor: selectedAnswer === null && !showFeedback ? colors.jackal[300] : colors.primary[600],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: selectedAnswer === null && !showFeedback ? 0 : 0.25,
              shadowRadius: 12,
              elevation: selectedAnswer === null && !showFeedback ? 0 : 6,
            }}
          >
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 17,
                color: '#FFFFFF',
                marginRight: 8,
              }}
            >
              {showFeedback ? 'Continue' : 'Check Answer'}
            </Text>
            <ChevronRight size={22} color="#FFFFFF" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export default function IntroLessonScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAppStore(s => s.user);
  const completeIntroLesson = useAppStore(s => s.completeIntroLesson);
  const addXP = useAppStore(s => s.addXP);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const currentLessonNumber = (user?.introProgress ?? 0) + 1;
  const lesson = getIntroLesson(currentLessonNumber);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentSlide(viewableItems[0].index);
    }
  }).current;

  // Handle navigation when all lessons are completed - use useEffect to avoid setState during render
  useEffect(() => {
    if (!lesson) {
      router.replace('/(tabs)');
    }
  }, [lesson, router]);

  // Show loading state while redirecting
  if (!lesson) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.cream[50] }}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  const totalSlides = lesson.slides.length;
  const isLastSlide = currentSlide === totalSlides - 1;

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLastSlide) {
      setShowQuiz(true);
    } else {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      flatListRef.current?.scrollToIndex({ index: nextSlide, animated: true });
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (showQuiz) {
      setShowQuiz(false);
    } else if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      flatListRef.current?.scrollToIndex({ index: prevSlide, animated: true });
    }
  };

  const handleQuizComplete = async (correct: boolean) => {
    // Award XP for completing lesson
    const xpEarned = correct ? 25 : 15;
    await addXP(xpEarned);
    await completeIntroLesson();

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Check if this was the last lesson
    if (currentLessonNumber >= 4) {
      router.replace('/(tabs)');
    } else {
      // Navigate to tabs to see progress and continue
      router.replace('/(tabs)');
    }
  };

  const handleClose = () => {
    // Navigate to tabs instead of back since navigation stack may be empty
    router.replace('/(tabs)');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.cream[50], paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1">
        {/* Header - extra top padding for Dynamic Island */}
        <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
          {/* X Button - larger hit area for better responsiveness */}
          <Pressable
            onPress={handleClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.cream[200],
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={24} color={colors.jackal[600]} strokeWidth={2.5} />
          </Pressable>

          <View className="flex-row items-center">
            <Text className="text-2xl mr-2">{lesson.icon}</Text>
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 17,
                color: colors.jackal[700],
              }}
            >
              Lesson {currentLessonNumber}
            </Text>
          </View>

          <View style={{ width: 44 }} />
        </View>

        {/* Progress dots */}
        {!showQuiz && (
          <View className="flex-row items-center justify-center gap-2 mb-4">
            {lesson.slides.map((_, index) => (
              <View
                key={index}
                className="h-2 rounded-full"
                style={{
                  width: index === currentSlide ? 24 : 8,
                  backgroundColor: index === currentSlide ? lesson.color : colors.cream[300],
                }}
              />
            ))}
          </View>
        )}

        {/* Content */}
        {showQuiz ? (
          <QuizScreen lesson={lesson} onComplete={handleQuizComplete} />
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={lesson.slides}
              keyExtractor={(_, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
              renderItem={({ item }) => (
                <View style={{ width: SCREEN_WIDTH }}>
                  <SlideContent slide={item} lessonColor={lesson.color} />
                </View>
              )}
            />

            {/* Navigation */}
            <View className="flex-row gap-3 px-5 pb-6">
              {currentSlide > 0 && (
                <Pressable
                  onPress={handleBack}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 16,
                    backgroundColor: colors.cream[200],
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 56,
                  }}
                >
                  <ChevronLeft size={20} color={colors.jackal[500]} />
                  <Text
                    style={{
                      fontFamily: 'Nunito_600SemiBold',
                      fontSize: 16,
                      color: colors.jackal[600],
                      marginLeft: 4,
                    }}
                  >
                    Back
                  </Text>
                </Pressable>
              )}

              <Pressable onPress={handleNext} style={{ flex: 1 }}>
                <LinearGradient
                  colors={[lesson.color, lesson.color]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 16,
                    borderRadius: 16,
                    minHeight: 56,
                    shadowColor: lesson.color,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Nunito_700Bold',
                      fontSize: 17,
                      color: '#FFFFFF',
                      marginRight: 8,
                    }}
                  >
                    {isLastSlide ? 'Take Quiz' : 'Continue'}
                  </Text>
                  <ChevronRight size={22} color="#FFFFFF" strokeWidth={2.5} />
                </LinearGradient>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </View>
  );
}
