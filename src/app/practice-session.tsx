import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Dimensions, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { X, Check, AlertCircle, ChevronRight, Trophy, Zap } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';
import { Exercise, NVCCategory } from '@/lib/types';
import { getDailyExercises, getExercisesByCategory, getExerciseTypeName } from '@/lib/exercises';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ExerciseScreenProps {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

function ExerciseScreen({ exercise, onAnswer, questionNumber, totalQuestions }: ExerciseScreenProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Reset state when exercise changes (new question)
  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  }, [exercise.id]);

  const handleOptionPress = (index: number) => {
    if (showFeedback) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedAnswer(index);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === exercise.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleContinue = () => {
    onAnswer(isCorrect);
  };

  const progress = questionNumber / totalQuestions;

  return (
    <View className="flex-1">
      {/* Progress bar */}
      <View className="px-5 mb-4">
        <View
          className="h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.cream[200] }}
        >
          <Animated.View
            className="h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: colors.primary[500],
            }}
          />
        </View>
        <Text
          className="text-xs text-center mt-2"
          style={{
            fontFamily: 'Nunito_500Medium',
            color: colors.jackal[400],
          }}
        >
          Question {questionNumber} of {totalQuestions}
        </Text>
      </View>

      {/* Scrollable content area */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Exercise type badge */}
        <View className="px-5 mb-4">
          <View
            className="self-start px-3 py-1.5 rounded-full"
            style={{ backgroundColor: colors.primary[100] }}
          >
            <Text
              className="text-xs"
              style={{
                fontFamily: 'Nunito_600SemiBold',
                color: colors.primary[600],
              }}
            >
              {getExerciseTypeName(exercise.type)}
            </Text>
          </View>
        </View>

        {/* Question */}
        <Animated.View
          entering={FadeInDown.springify()}
          className="px-5 mb-6"
        >
          <Text
            className="text-xl leading-7"
            style={{
              fontFamily: 'Nunito_700Bold',
              color: colors.jackal[800],
            }}
          >
            {exercise.question}
          </Text>
        </Animated.View>

        {/* Options */}
        <View className="px-5">
          {exercise.options?.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectOption = index === exercise.correctAnswer;
            const showAsCorrect = showFeedback && isCorrectOption;
            const showAsWrong = showFeedback && isSelected && !isCorrectOption;

            return (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(100 + index * 50).springify()}
              >
                <Pressable
                  onPress={() => handleOptionPress(index)}
                  className="mb-3"
                  disabled={showFeedback}
                >
                  <View
                    className="rounded-2xl p-4 flex-row items-center"
                    style={{
                      backgroundColor: showAsCorrect
                        ? colors.sage[100]
                        : showAsWrong
                        ? `${colors.error}20`
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
              </Animated.View>
            );
          })}
        </View>

        {/* Feedback panel - now scrollable */}
        {showFeedback && (
          <Animated.View
            entering={FadeInUp.springify()}
            className="px-5 mt-2"
          >
            <View
              className="rounded-2xl p-4"
              style={{
                backgroundColor: isCorrect ? colors.sage[50] : colors.coral[50],
              }}
            >
              <View className="flex-row items-center mb-2">
                {isCorrect ? (
                  <Check size={20} color={colors.sage[600]} />
                ) : (
                  <AlertCircle size={20} color={colors.coral[600]} />
                )}
                <Text
                  className="ml-2 text-base"
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    color: isCorrect ? colors.sage[700] : colors.coral[700],
                  }}
                >
                  {isCorrect ? 'Correct!' : 'Not quite...'}
                </Text>
                {isCorrect && (
                  <View className="flex-row items-center ml-auto">
                    <Zap size={14} color={colors.primary[500]} />
                    <Text
                      className="ml-1 text-sm"
                      style={{
                        fontFamily: 'Nunito_700Bold',
                        color: colors.primary[600],
                      }}
                    >
                      +{exercise.xpReward} XP
                    </Text>
                  </View>
                )}
              </View>
              <Text
                className="text-sm leading-5"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: isCorrect ? colors.sage[600] : colors.coral[600],
                }}
              >
                {exercise.explanation}
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Action button - fixed at bottom */}
      <View className="px-5 pb-4">
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
              shadowColor: selectedAnswer === null && !showFeedback ? colors.jackal[300] : showFeedback ? (isCorrect ? colors.sage[600] : colors.coral[600]) : colors.primary[600],
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
    </View>
  );
}

function CompletionScreen({
  correctCount,
  totalCount,
  xpEarned,
  onFinish,
}: {
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  onFinish: () => void;
}) {
  const percentage = Math.round((correctCount / totalCount) * 100);
  const isGreat = percentage >= 80;
  const isGood = percentage >= 60;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <View className="flex-1 items-center justify-center px-8">
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        className="items-center"
      >
        <View
          className="w-32 h-32 rounded-full items-center justify-center mb-6"
          style={{
            backgroundColor: isGreat
              ? colors.primary[100]
              : isGood
              ? colors.sage[100]
              : colors.coral[100],
          }}
        >
          <Text className="text-6xl">{isGreat ? '🦒' : isGood ? '👍' : '💪'}</Text>
        </View>

        <Text
          className="text-3xl text-center mb-2"
          style={{
            fontFamily: 'Nunito_800ExtraBold',
            color: colors.jackal[800],
          }}
        >
          {isGreat ? 'Amazing!' : isGood ? 'Good Job!' : 'Keep Going!'}
        </Text>

        <Text
          className="text-base text-center mb-8"
          style={{
            fontFamily: 'Nunito_500Medium',
            color: colors.jackal[500],
          }}
        >
          {isGreat
            ? "You're mastering giraffe speak!"
            : isGood
            ? "You're making great progress!"
            : 'Practice makes perfect!'}
        </Text>
      </Animated.View>

      {/* Stats */}
      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        className="w-full rounded-3xl p-6 mb-8"
        style={{ backgroundColor: colors.cream[100] }}
      >
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text
              className="text-3xl"
              style={{
                fontFamily: 'Nunito_800ExtraBold',
                color: colors.primary[500],
              }}
            >
              {correctCount}/{totalCount}
            </Text>
            <Text
              className="text-sm"
              style={{
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[400],
              }}
            >
              Correct
            </Text>
          </View>

          <View className="w-px bg-cream-300" />

          <View className="items-center">
            <View className="flex-row items-center">
              <Zap size={24} color={colors.primary[500]} />
              <Text
                className="text-3xl ml-1"
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  color: colors.primary[500],
                }}
              >
                {xpEarned}
              </Text>
            </View>
            <Text
              className="text-sm"
              style={{
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[400],
              }}
            >
              XP Earned
            </Text>
          </View>

          <View className="w-px bg-cream-300" />

          <View className="items-center">
            <Text
              className="text-3xl"
              style={{
                fontFamily: 'Nunito_800ExtraBold',
                color: isGreat ? colors.sage[500] : isGood ? colors.primary[500] : colors.coral[500],
              }}
            >
              {percentage}%
            </Text>
            <Text
              className="text-sm"
              style={{
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[400],
              }}
            >
              Accuracy
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Finish button */}
      <Animated.View
        entering={FadeIn.delay(400)}
        className="w-full"
      >
        <Pressable onPress={onFinish}>
          <LinearGradient
            colors={[colors.primary[400], colors.primary[500], colors.primary[600]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 16,
              borderRadius: 16,
              minHeight: 56,
              shadowColor: colors.primary[600],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Trophy size={22} color="#FFFFFF" strokeWidth={2.5} />
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 17,
                color: '#FFFFFF',
                marginLeft: 8,
              }}
            >
              Finish Practice
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function PracticeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const insets = useSafeAreaInsets();

  const addXP = useAppStore(s => s.addXP);
  const completeExercise = useAppStore(s => s.completeExercise);
  const updateStreak = useAppStore(s => s.updateStreak);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Get exercises based on category or random daily practice
    let exerciseList: Exercise[];
    if (params.category) {
      exerciseList = getExercisesByCategory(params.category).slice(0, 5);
    } else {
      exerciseList = getDailyExercises(5);
    }
    setExercises(exerciseList);
  }, [params.category]);

  const handleAnswer = async (correct: boolean) => {
    if (correct) {
      const xp = exercises[currentIndex].xpReward;
      setCorrectCount(c => c + 1);
      setXpEarned(x => x + xp);
      await addXP(xp);
    }

    await completeExercise();

    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      // Update streak when completing practice
      await updateStreak();
      setIsComplete(true);
    }
  };

  const handleFinish = () => {
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  if (exercises.length === 0) {
    return (
      <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.cream[50] }}>
        <Text style={{ fontFamily: 'Nunito_500Medium', color: colors.jackal[500] }}>
          Loading exercises...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.cream[50], paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1">
        {/* Header - extra top padding for Dynamic Island */}
        <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
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

          <Text
            style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: 17,
              color: colors.jackal[700],
            }}
          >
            {params.category ? `${params.category.charAt(0).toUpperCase() + params.category.slice(1)} Practice` : 'Daily Practice'}
          </Text>

          <View style={{ width: 44 }} />
        </View>

        {isComplete ? (
          <CompletionScreen
            correctCount={correctCount}
            totalCount={exercises.length}
            xpEarned={xpEarned}
            onFinish={handleFinish}
          />
        ) : (
          <ExerciseScreen
            exercise={exercises[currentIndex]}
            onAnswer={handleAnswer}
            questionNumber={currentIndex + 1}
            totalQuestions={exercises.length}
          />
        )}
      </View>
    </View>
  );
}
