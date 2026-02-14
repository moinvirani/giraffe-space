import { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, Dimensions, ScrollView, Alert, Platform } from 'react-native';
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
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { X, Check, AlertCircle, ChevronRight, Trophy, Zap, Lightbulb, BookOpen, Bell } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';
import { Exercise, NVCCategory, FillBlankData, ExerciseType } from '@/lib/types';
import { getDailyExercises, getExercisesByCategory, getExerciseTypeName, EXERCISES } from '@/lib/exercises';
import { usePremiumStatus } from '@/lib/usePremium';

// Free exercise limit - users need premium after this many exercises
const FREE_EXERCISE_LIMIT = 40;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Concept teaching content - shown before exercises introduce new concepts
interface ConceptTeaching {
  id: string;
  title: string;
  concept: string;
  bullets: string[];
  example?: { before: string; after: string };
  appliesTo: ExerciseType[];
}

const CONCEPT_TEACHINGS: ConceptTeaching[] = [
  {
    id: 'four-ways-receive',
    title: '4 Ways to Receive Messages',
    concept: 'When someone says something hurtful, NVC teaches we have 4 choices:',
    bullets: [
      '1. Blame ourselves ("They\'re right, I\'m terrible")',
      '2. Blame them back ("Well, you\'re no saint!")',
      '3. Sense our own feelings & needs',
      '4. Sense their feelings & needs',
    ],
    example: {
      before: '"You\'re so selfish!"',
      after: 'Giraffe response: "Are you frustrated because you need more consideration?"',
    },
    appliesTo: ['empathy-check', 'fill-blank'],
  },
  {
    id: 'observations-vs-judgments',
    title: 'Observations vs Judgments',
    concept: 'NVC starts with pure observations - what a camera would record, not our interpretations.',
    bullets: [
      'Judgment: "You\'re always late" ❌',
      'Observation: "You arrived at 3:15, we agreed on 3:00" ✓',
      'Judgment: "He\'s lazy" ❌',
      'Observation: "He didn\'t do the dishes today" ✓',
    ],
    appliesTo: ['spot-judgment'],
  },
  {
    id: 'feelings-vs-faux',
    title: 'Real Feelings vs Faux Feelings',
    concept: 'Faux feelings are thoughts disguised as feelings - they imply someone is doing something TO you.',
    bullets: [
      'Faux: "I feel abandoned" (implies they abandoned you)',
      'Real: "I feel lonely" (your actual feeling)',
      'Faux: "I feel manipulated" (blames them)',
      'Real: "I feel confused" (your actual state)',
    ],
    appliesTo: ['feeling-or-faux'],
  },
  {
    id: 'needs-universal',
    title: 'Universal Human Needs',
    concept: 'Behind every feeling is a need. Needs are universal - everyone has them.',
    bullets: [
      'Connection: belonging, love, acceptance, empathy',
      'Autonomy: freedom, choice, independence',
      'Meaning: purpose, contribution, growth',
      'Physical: rest, food, safety, comfort',
    ],
    appliesTo: ['need-finder'],
  },
  {
    id: 'jackal-to-giraffe',
    title: 'Jackal vs Giraffe Language',
    concept: 'Jackal language judges and blames. Giraffe language connects through feelings and needs.',
    bullets: [
      'Jackal: "You never listen to me!"',
      'Giraffe: "When you look at your phone while I talk, I feel hurt because I need to be heard."',
    ],
    example: {
      before: '"You\'re so inconsiderate!"',
      after: '"I feel frustrated because I need consideration."',
    },
    appliesTo: ['jackal-to-giraffe'],
  },
  {
    id: 'requests-not-demands',
    title: 'Requests vs Demands',
    concept: 'A true request allows the other person to say no. A demand has consequences for refusal.',
    bullets: [
      'Demand: "You need to call me when you\'re late"',
      'Request: "Would you be willing to text me if you\'re running late?"',
      'Key phrase: "Would you be willing to..."',
    ],
    appliesTo: ['scenario'],
  },
];

// Track which concepts user has seen in this session
const SEEN_CONCEPTS_KEY = '@giraffe_seen_concepts';

async function loadSeenConcepts(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(SEEN_CONCEPTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

async function saveSeenConcept(conceptId: string): Promise<void> {
  try {
    const seen = await loadSeenConcepts();
    if (!seen.includes(conceptId)) {
      await AsyncStorage.setItem(SEEN_CONCEPTS_KEY, JSON.stringify([...seen, conceptId]));
    }
  } catch {
    // Ignore errors
  }
}

// Keys for persisting practice session state
const PRACTICE_SESSION_KEY = '@giraffe_practice_session';
const LAST_SESSION_EXERCISES_KEY = '@giraffe_last_session_exercises';

interface PracticeSessionState {
  exerciseIds: string[];
  currentIndex: number;
  correctCount: number;
  xpEarned: number;
  category?: string;
  savedAt: string;
}

// Save practice session to AsyncStorage
async function savePracticeSession(state: PracticeSessionState): Promise<void> {
  try {
    await AsyncStorage.setItem(PRACTICE_SESSION_KEY, JSON.stringify(state));
  } catch (error) {
    console.log('[PRACTICE] Error saving session:', error);
  }
}

// Save last session exercise IDs (for avoiding repeats across sessions)
async function saveLastSessionExercises(exerciseIds: string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_SESSION_EXERCISES_KEY, JSON.stringify(exerciseIds));
  } catch (error) {
    console.log('[PRACTICE] Error saving last session exercises:', error);
  }
}

// Load last session exercise IDs
async function loadLastSessionExercises(): Promise<string[]> {
  try {
    const stored = await AsyncStorage.getItem(LAST_SESSION_EXERCISES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.log('[PRACTICE] Error loading last session exercises:', error);
    return [];
  }
}

// Load practice session from AsyncStorage
async function loadPracticeSession(category?: string): Promise<PracticeSessionState | null> {
  try {
    const stored = await AsyncStorage.getItem(PRACTICE_SESSION_KEY);
    if (!stored) return null;

    const session: PracticeSessionState = JSON.parse(stored);

    // Check if it's the same type of practice (daily vs category)
    if (session.category !== category) {
      // Different practice type, start fresh
      return null;
    }

    // Check if session is from today (for daily practice) or still valid
    const savedDate = new Date(session.savedAt);
    const now = new Date();
    const isToday = savedDate.toDateString() === now.toDateString();

    // For daily practice, restore if it's from today
    if (!category && !isToday) {
      return null;
    }

    // For category practice, restore if it's from today
    if (category && !isToday) {
      return null;
    }

    return session;
  } catch (error) {
    console.log('[PRACTICE] Error loading session:', error);
    return null;
  }
}

// Clear practice session
async function clearPracticeSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PRACTICE_SESSION_KEY);
  } catch (error) {
    console.log('[PRACTICE] Error clearing session:', error);
  }
}
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Concept Teaching Screen - shown before exercises to teach new concepts
interface ConceptTeachingScreenProps {
  concept: ConceptTeaching;
  onContinue: () => void;
}

function ConceptTeachingScreen({ concept, onContinue }: ConceptTeachingScreenProps) {
  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header badge */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="px-5 mb-5"
        >
          <View
            className="self-start flex-row items-center px-4 py-2.5 rounded-full"
            style={{ backgroundColor: colors.primary[100] }}
          >
            <Lightbulb size={18} color={colors.primary[600]} />
            <Text
              className="ml-2 text-sm"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.primary[600],
              }}
            >
              Learn First
            </Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View
          entering={FadeInDown.delay(150).springify()}
          className="px-5 mb-5"
        >
          <Text
            style={{
              fontFamily: 'Nunito_800ExtraBold',
              fontSize: 26,
              lineHeight: 34,
              color: colors.jackal[800],
            }}
          >
            {concept.title}
          </Text>
        </Animated.View>

        {/* Main concept */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="px-5 mb-6"
        >
          <Text
            style={{
              fontFamily: 'Nunito_500Medium',
              fontSize: 18,
              lineHeight: 28,
              color: colors.jackal[600],
            }}
          >
            {concept.concept}
          </Text>
        </Animated.View>

        {/* Bullet points */}
        <Animated.View
          entering={FadeInDown.delay(250).springify()}
          className="px-5 mb-6"
        >
          <View
            className="rounded-2xl p-5"
            style={{ backgroundColor: colors.cream[100] }}
          >
            {concept.bullets.map((bullet, index) => (
              <Animated.View
                key={index}
                entering={FadeInDown.delay(300 + index * 50).springify()}
                style={{ marginBottom: index < concept.bullets.length - 1 ? 14 : 0 }}
              >
                <Text
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    fontSize: 17,
                    lineHeight: 26,
                    color: colors.jackal[700],
                  }}
                >
                  {bullet}
                </Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Example if provided */}
        {concept.example && (
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            className="px-5"
          >
            <View
              className="rounded-2xl p-5"
              style={{ backgroundColor: colors.sage[50] }}
            >
              <View className="flex-row items-center mb-4">
                <BookOpen size={20} color={colors.sage[600]} />
                <Text
                  className="ml-2"
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    fontSize: 14,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    color: colors.sage[600],
                  }}
                >
                  Example
                </Text>
              </View>

              <View className="mb-4">
                <Text
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    fontSize: 13,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    color: colors.jackal[400],
                    marginBottom: 6,
                  }}
                >
                  Someone says:
                </Text>
                <Text
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    fontSize: 17,
                    lineHeight: 26,
                    fontStyle: 'italic',
                    color: colors.jackal[600],
                  }}
                >
                  {concept.example.before}
                </Text>
              </View>

              <View>
                <Text
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    fontSize: 13,
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    color: colors.sage[500],
                    marginBottom: 6,
                  }}
                >
                  Compassionate response:
                </Text>
                <Text
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    fontSize: 17,
                    lineHeight: 26,
                    color: colors.sage[700],
                  }}
                >
                  {concept.example.after}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Continue button */}
      <View className="px-5 pb-4">
        <Pressable onPress={onContinue}>
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
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 17,
                color: '#FFFFFF',
                marginRight: 8,
              }}
            >
              Got it, let's practice!
            </Text>
            <ChevronRight size={22} color="#FFFFFF" strokeWidth={2.5} />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

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
  const scrollViewRef = useRef<ScrollView>(null);

  // Reset state when exercise changes (new question)
  useEffect(() => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
  }, [exercise.id]);

  // Auto-scroll to bottom when feedback is shown
  useEffect(() => {
    if (showFeedback && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [showFeedback]);

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
        ref={scrollViewRef}
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

// Duolingo-style Fill in the Blank exercise component
interface FillBlankExerciseScreenProps {
  exercise: Exercise;
  onAnswer: (correct: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

function FillBlankExerciseScreen({ exercise, onAnswer, questionNumber, totalQuestions }: FillBlankExerciseScreenProps) {
  const fillData = exercise.fillBlankData!;
  const blankCount = (fillData.sentence.match(/___/g) || []).length;

  const [filledBlanks, setFilledBlanks] = useState<(string | null)[]>(new Array(blankCount).fill(null));
  const [usedChips, setUsedChips] = useState<Set<number>>(new Set());
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shuffledOptions] = useState(() =>
    [...fillData.blankOptions].sort(() => Math.random() - 0.5)
  );
  const scrollViewRef = useRef<ScrollView>(null);

  // Reset state when exercise changes
  useEffect(() => {
    setFilledBlanks(new Array(blankCount).fill(null));
    setUsedChips(new Set());
    setShowFeedback(false);
    setIsCorrect(false);
  }, [exercise.id, blankCount]);

  // Auto-scroll to bottom when feedback is shown
  useEffect(() => {
    if (showFeedback && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [showFeedback]);

  const handleChipPress = (chipIndex: number) => {
    if (showFeedback || usedChips.has(chipIndex)) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Find the first empty blank
    const firstEmptyIndex = filledBlanks.findIndex(b => b === null);
    if (firstEmptyIndex === -1) return;

    const newFilled = [...filledBlanks];
    newFilled[firstEmptyIndex] = shuffledOptions[chipIndex];
    setFilledBlanks(newFilled);

    const newUsed = new Set(usedChips);
    newUsed.add(chipIndex);
    setUsedChips(newUsed);
  };

  const handleBlankPress = (blankIndex: number) => {
    if (showFeedback || filledBlanks[blankIndex] === null) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const word = filledBlanks[blankIndex];
    // Find which chip this word came from and un-use it
    const chipIndex = shuffledOptions.findIndex((opt, i) => opt === word && usedChips.has(i));
    if (chipIndex !== -1) {
      const newUsed = new Set(usedChips);
      newUsed.delete(chipIndex);
      setUsedChips(newUsed);
    }

    const newFilled = [...filledBlanks];
    newFilled[blankIndex] = null;
    setFilledBlanks(newFilled);
  };

  const allFilled = filledBlanks.every(b => b !== null);

  // Check if answers are correct, accounting for interchangeable groups
  const checkAnswers = (): boolean => {
    const interchangeableGroups = fillData.interchangeableGroups || [];

    // Create a copy of correctBlanks to work with
    const expectedAnswers = [...fillData.correctBlanks];

    // For each interchangeable group, check if the user's answers match any permutation
    for (const group of interchangeableGroups) {
      // Get the expected values for this group
      const expectedInGroup = group.map(i => expectedAnswers[i]);
      // Get the user's values for this group
      const userInGroup = group.map(i => filledBlanks[i]);

      // Check if user's values are a valid permutation of expected values
      const sortedExpected = [...expectedInGroup].sort();
      const sortedUser = [...userInGroup].sort();

      if (JSON.stringify(sortedExpected) !== JSON.stringify(sortedUser)) {
        return false; // User's values don't match expected set
      }

      // Mark these indices as "checked" by setting expected to user's values
      // (so the final comparison passes for these indices)
      group.forEach((idx, j) => {
        expectedAnswers[idx] = filledBlanks[idx] as string;
      });
    }

    // Check all blanks (non-interchangeable ones will be checked normally)
    return filledBlanks.every((word, i) => word === expectedAnswers[i]);
  };

  const handleCheck = () => {
    if (!allFilled) return;

    const correct = checkAnswers();
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

  // Get blank styling info for feedback
  const getBlankStatus = (blankIdx: number, value: string | null) => {
    if (!showFeedback || value === null) return { isCorrect: false, isWrong: false };

    const interchangeableGroups = fillData.interchangeableGroups || [];
    const groupContainingThis = interchangeableGroups.find(g => g.includes(blankIdx));

    if (groupContainingThis) {
      const expectedInGroup = groupContainingThis.map(idx => fillData.correctBlanks[idx]);
      const userInGroup = groupContainingThis.map(idx => filledBlanks[idx]);
      const sortedExpected = [...expectedInGroup].sort();
      const sortedUser = [...userInGroup].sort();
      const isCorrect = JSON.stringify(sortedExpected) === JSON.stringify(sortedUser);
      return { isCorrect, isWrong: !isCorrect };
    } else {
      const isCorrect = value === fillData.correctBlanks[blankIdx];
      return { isCorrect, isWrong: !isCorrect };
    }
  };

  // Render inline blank (as pressable text-like element)
  const renderBlank = (blankIdx: number) => {
    const blankValue = filledBlanks[blankIdx];
    const { isCorrect, isWrong } = getBlankStatus(blankIdx, blankValue);

    if (blankValue) {
      // Filled blank - show the word with underline
      return (
        <Pressable
          key={`blank-${blankIdx}`}
          onPress={() => handleBlankPress(blankIdx)}
          disabled={showFeedback}
        >
          <View
            style={{
              borderBottomWidth: 2,
              borderBottomColor: showFeedback
                ? isCorrect
                  ? colors.sage[500]
                  : colors.error
                : colors.primary[400],
              paddingBottom: 2,
              marginHorizontal: 4,
            }}
          >
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 20,
                color: showFeedback
                  ? isCorrect
                    ? colors.sage[700]
                    : colors.error
                  : colors.primary[600],
              }}
            >
              {blankValue}
            </Text>
          </View>
        </Pressable>
      );
    } else {
      // Empty blank - show underline placeholder
      return (
        <View
          key={`blank-${blankIdx}`}
          style={{
            width: 80,
            borderBottomWidth: 2,
            borderBottomColor: colors.jackal[300],
            marginHorizontal: 4,
            height: 26,
          }}
        />
      );
    }
  };

  // Render the sentence with inline blanks
  const renderSentenceWithBlanks = () => {
    const parts = fillData.sentence.split('___');
    const elements: React.ReactNode[] = [];
    let blankIndex = 0;

    parts.forEach((part, partIndex) => {
      // Add text part
      if (part) {
        elements.push(
          <Text
            key={`text-${partIndex}`}
            style={{
              fontFamily: 'Nunito_600SemiBold',
              fontSize: 20,
              lineHeight: 44,
              color: colors.jackal[800],
            }}
          >
            {part}
          </Text>
        );
      }

      // Add blank if not the last part
      if (partIndex < parts.length - 1) {
        elements.push(renderBlank(blankIndex));
        blankIndex++;
      }
    });

    return elements;
  };

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

      <ScrollView
        ref={scrollViewRef}
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
          className="px-5 mb-5"
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

        {/* Sentence with blanks */}
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          className="px-5 mb-8"
        >
          <View
            className="rounded-2xl py-6 px-5"
            style={{
              backgroundColor: colors.cream[50],
              borderWidth: 1,
              borderColor: colors.cream[200],
            }}
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
              {renderSentenceWithBlanks()}
            </View>
          </View>
        </Animated.View>

        {/* Word chips - Duolingo style */}
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          className="px-5 mb-4"
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            {shuffledOptions.map((option, index) => {
              const isUsed = usedChips.has(index);

              return (
                <Animated.View
                  key={index}
                  entering={FadeInDown.delay(250 + index * 50).springify()}
                >
                  <Pressable
                    onPress={() => handleChipPress(index)}
                    disabled={showFeedback || isUsed}
                    style={({ pressed }) => ({
                      transform: [{ scale: pressed && !isUsed && !showFeedback ? 0.95 : 1 }],
                    })}
                  >
                    <View
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor: isUsed ? colors.cream[100] : '#FFFFFF',
                        borderWidth: 1.5,
                        borderBottomWidth: isUsed ? 1.5 : 3,
                        borderColor: isUsed ? colors.cream[200] : colors.jackal[200],
                        opacity: isUsed ? 0.4 : 1,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'Nunito_600SemiBold',
                          fontSize: 16,
                          color: isUsed ? colors.jackal[300] : colors.jackal[700],
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
        </Animated.View>

        {/* Show correct answer if wrong */}
        {showFeedback && !isCorrect && (
          <Animated.View
            entering={FadeInUp.springify()}
            className="px-5 mt-2 mb-2"
          >
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.sage[50] }}
            >
              <Text
                className="text-xs mb-1 uppercase tracking-wider"
                style={{
                  fontFamily: 'Nunito_700Bold',
                  color: colors.sage[600],
                }}
              >
                Correct answer
              </Text>
              <Text
                className="text-base"
                style={{
                  fontFamily: 'Nunito_600SemiBold',
                  color: colors.sage[700],
                }}
              >
                {fillData.sentence.split('___').reduce((result, part, i) => {
                  return result + part + (i < fillData.correctBlanks.length ? fillData.correctBlanks[i] : '');
                }, '')}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Feedback panel */}
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

      {/* Action button */}
      <View className="px-5 pb-4">
        <Pressable
          onPress={showFeedback ? handleContinue : handleCheck}
          disabled={!allFilled && !showFeedback}
        >
          <LinearGradient
            colors={
              !allFilled && !showFeedback
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
              shadowColor: !allFilled && !showFeedback ? colors.jackal[300] : showFeedback ? (isCorrect ? colors.sage[600] : colors.coral[600]) : colors.primary[600],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: !allFilled && !showFeedback ? 0 : 0.25,
              shadowRadius: 12,
              elevation: !allFilled && !showFeedback ? 0 : 6,
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

// Key for tracking if notification prompt has been shown
const NOTIFICATION_PROMPT_SHOWN_KEY = '@giraffe_notification_prompt_shown';

function CompletionScreen({
  correctCount,
  totalCount,
  xpEarned,
  onFinish,
  isFirstPractice,
}: {
  correctCount: number;
  totalCount: number;
  xpEarned: number;
  onFinish: () => void;
  isFirstPractice: boolean;
}) {
  const percentage = Math.round((correctCount / totalCount) * 100);
  const isGreat = percentage >= 80;
  const isGood = percentage >= 60;
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const updateUser = useAppStore(s => s.updateUser);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Check if we should show notification prompt
    // Show after first practice session if user hasn't been prompted yet
    const checkNotificationPrompt = async () => {
      console.log('[NOTIFICATION] Checking notification prompt, isFirstPractice:', isFirstPractice);

      // Only show prompt on first practice (when they haven't done any exercises before this session)
      if (!isFirstPractice) {
        console.log('[NOTIFICATION] Not first practice, skipping prompt');
        return;
      }

      // Check if we've already prompted the user
      const prompted = await AsyncStorage.getItem(NOTIFICATION_PROMPT_SHOWN_KEY);
      console.log('[NOTIFICATION] Already prompted:', prompted);
      if (prompted === 'true') {
        console.log('[NOTIFICATION] Already shown prompt before, skipping');
        return;
      }

      // Show prompt immediately (no delay) for better visibility
      console.log('[NOTIFICATION] Setting showNotificationPrompt to true');
      setShowNotificationPrompt(true);
    };

    checkNotificationPrompt();
  }, [isFirstPractice]);

  const scheduleReminderNotification = async () => {
    // Cancel existing and schedule new
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time for Giraffe Practice! 🦒",
        body: "Take 5 minutes to grow your compassionate communication skills.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 20, // 8:00 PM default
        minute: 0,
      },
    });

    // Update user settings
    await updateUser({
      notificationsEnabled: true,
      reminderTime: '20:00',
    });
  };

  const handleEnableNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const { status } = await Notifications.requestPermissionsAsync();

    if (status === 'granted') {
      await scheduleReminderNotification();
      await AsyncStorage.setItem(NOTIFICATION_PROMPT_SHOWN_KEY, 'true');
      setShowNotificationPrompt(false);

      // Show success feedback
      Alert.alert(
        "Reminders Enabled!",
        "You'll get a daily reminder at 8:00 PM. You can change this in Settings.",
        [{ text: "Great!" }]
      );
    } else {
      await AsyncStorage.setItem(NOTIFICATION_PROMPT_SHOWN_KEY, 'true');
      setShowNotificationPrompt(false);
      Alert.alert(
        "Notifications Disabled",
        "You can enable reminders later in Settings.",
        [{ text: "OK" }]
      );
    }
  };

  const handleSkipNotifications = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await AsyncStorage.setItem(NOTIFICATION_PROMPT_SHOWN_KEY, 'true');
    setShowNotificationPrompt(false);
  };

  // Notification prompt overlay
  if (showNotificationPrompt) {
    console.log('[NOTIFICATION] Rendering notification prompt UI');
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Animated.View
          entering={FadeInDown.springify()}
          className="w-full rounded-3xl p-6"
          style={{ backgroundColor: colors.cream[100] }}
        >
          <View className="items-center mb-5">
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.primary[100] }}
            >
              <Bell size={36} color={colors.primary[500]} />
            </View>
            <Text
              className="text-2xl text-center mb-2"
              style={{
                fontFamily: 'Nunito_800ExtraBold',
                color: colors.jackal[800],
              }}
            >
              Stay on Track!
            </Text>
            <Text
              className="text-base text-center leading-6"
              style={{
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[500],
              }}
            >
              Get a gentle daily reminder to practice. Building a habit takes consistency!
            </Text>
          </View>

          <Pressable onPress={handleEnableNotifications}>
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
                marginBottom: 12,
              }}
            >
              <Bell size={20} color="#FFFFFF" />
              <Text
                style={{
                  fontFamily: 'Nunito_700Bold',
                  fontSize: 17,
                  color: '#FFFFFF',
                  marginLeft: 8,
                }}
              >
                Enable Daily Reminder
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={handleSkipNotifications}>
            <Text
              className="text-center py-3"
              style={{
                fontFamily: 'Nunito_600SemiBold',
                fontSize: 15,
                color: colors.jackal[400],
              }}
            >
              Maybe Later
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    );
  }

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
  const completedExercisesCount = useAppStore(s => s.user?.completedExercises ?? 0);

  // Check premium status for free exercise limit
  const { data: premiumData, isLoading: isPremiumLoading } = usePremiumStatus();
  const isPremium = premiumData?.isPremium ?? false;

  // Check if user has exceeded free exercise limit
  useEffect(() => {
    if (isPremiumLoading) return;

    if (!isPremium && completedExercisesCount >= FREE_EXERCISE_LIMIT) {
      console.log('[PRACTICE] User hit free exercise limit:', completedExercisesCount, '>=', FREE_EXERCISE_LIMIT);
      // Redirect to paywall
      router.replace('/paywall');
    }
  }, [isPremium, isPremiumLoading, completedExercisesCount, router]);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showConceptTeaching, setShowConceptTeaching] = useState(false);
  const [currentConcept, setCurrentConcept] = useState<ConceptTeaching | null>(null);
  const [seenConceptsThisSession, setSeenConceptsThisSession] = useState<Set<string>>(new Set());
  // Track initial count to determine if this is user's first practice session
  const [initialExerciseCount] = useState(() => {
    console.log('[PRACTICE] Initial exercise count at session start:', completedExercisesCount);
    return completedExercisesCount;
  });

  // Check if we should show concept teaching for current exercise
  const checkForConceptTeaching = useCallback(async (exercise: Exercise) => {
    // Find a concept that applies to this exercise type
    const applicableConcept = CONCEPT_TEACHINGS.find(c =>
      c.appliesTo.includes(exercise.type)
    );

    console.log('[CONCEPT] Checking for exercise type:', exercise.type, '| Found concept:', applicableConcept?.id || 'none');

    if (!applicableConcept) return false;

    // Only check if we've already shown this concept THIS SESSION (avoid repeating in same session)
    if (seenConceptsThisSession.has(applicableConcept.id)) {
      console.log('[CONCEPT] Already shown this session:', applicableConcept.id);
      return false;
    }

    // Show the concept - always show when encountering a new exercise type in this session
    console.log('[CONCEPT] Showing concept teaching:', applicableConcept.id);
    setCurrentConcept(applicableConcept);
    setShowConceptTeaching(true);
    return true;
  }, [seenConceptsThisSession]);

  const handleConceptContinue = async () => {
    if (currentConcept) {
      // Mark concept as seen for this session only
      setSeenConceptsThisSession(prev => new Set([...prev, currentConcept.id]));
    }
    setShowConceptTeaching(false);
    setCurrentConcept(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Load or create practice session
  useEffect(() => {
    const initSession = async () => {
      // Try to restore previous session
      const savedSession = await loadPracticeSession(params.category);

      if (savedSession && savedSession.currentIndex < savedSession.exerciseIds.length) {
        // Restore previous session
        const restoredExercises = savedSession.exerciseIds
          .map(id => EXERCISES.find(e => e.id === id))
          .filter((e): e is Exercise => e !== undefined);

        if (restoredExercises.length === savedSession.exerciseIds.length) {
          console.log('[PRACTICE] Restoring session at question', savedSession.currentIndex + 1);
          setExercises(restoredExercises);
          setCurrentIndex(savedSession.currentIndex);
          setCorrectCount(savedSession.correctCount);
          setXpEarned(savedSession.xpEarned);
          setIsLoading(false);
          return;
        }
      }

      // Create new session
      // Get last session's exercise IDs to avoid immediate repeats
      const lastSessionIds = await loadLastSessionExercises();

      let exerciseList: Exercise[];
      if (params.category) {
        exerciseList = getExercisesByCategory(params.category).slice(0, 5);
      } else {
        // Pass last session IDs to avoid showing same questions back-to-back
        exerciseList = getDailyExercises(5, completedExercisesCount, lastSessionIds);
      }

      // Save the new session
      await savePracticeSession({
        exerciseIds: exerciseList.map(e => e.id),
        currentIndex: 0,
        correctCount: 0,
        xpEarned: 0,
        category: params.category,
        savedAt: new Date().toISOString(),
      });

      setExercises(exerciseList);
      setIsLoading(false);

      // Check if we should show concept teaching for the first exercise
      if (exerciseList.length > 0) {
        checkForConceptTeaching(exerciseList[0]);
      }
    };

    initSession();
  }, [params.category, completedExercisesCount, checkForConceptTeaching]);

  const handleAnswer = async (correct: boolean) => {
    let newCorrectCount = correctCount;
    let newXpEarned = xpEarned;

    if (correct) {
      const xp = exercises[currentIndex].xpReward;
      newCorrectCount = correctCount + 1;
      newXpEarned = xpEarned + xp;
      setCorrectCount(newCorrectCount);
      setXpEarned(newXpEarned);
      await addXP(xp);
    }

    await completeExercise();

    // Check if user just hit the free exercise limit
    const newExerciseCount = completedExercisesCount + 1;
    if (!isPremium && newExerciseCount >= FREE_EXERCISE_LIMIT) {
      console.log('[PRACTICE] User just hit free exercise limit after completing exercise:', newExerciseCount);
      // Show paywall after this session completes
      if (currentIndex >= exercises.length - 1) {
        // This was the last exercise in the session - go to paywall
        await saveLastSessionExercises(exercises.map(e => e.id));
        await clearPracticeSession();
        await updateStreak();
        router.replace('/paywall');
        return;
      }
    }

    if (currentIndex < exercises.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);

      // Check if we need to show concept teaching for the next exercise
      const nextExercise = exercises[newIndex];
      await checkForConceptTeaching(nextExercise);

      // Save progress
      await savePracticeSession({
        exerciseIds: exercises.map(e => e.id),
        currentIndex: newIndex,
        correctCount: newCorrectCount,
        xpEarned: newXpEarned,
        category: params.category,
        savedAt: new Date().toISOString(),
      });
    } else {
      // Practice complete - save current exercises for future exclusion, clear session, update streak
      await saveLastSessionExercises(exercises.map(e => e.id));
      await clearPracticeSession();
      await updateStreak();
      setIsComplete(true);
    }
  };

  const handleFinish = () => {
    router.back();
  };

  const handleClose = async () => {
    // Session is already saved, just go back
    router.back();
  };

  if (isLoading || isPremiumLoading || exercises.length === 0) {
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
            isFirstPractice={initialExerciseCount === 0}
          />
        ) : showConceptTeaching && currentConcept ? (
          <ConceptTeachingScreen
            concept={currentConcept}
            onContinue={handleConceptContinue}
          />
        ) : exercises[currentIndex]?.fillBlankData ? (
          <FillBlankExerciseScreen
            exercise={exercises[currentIndex]}
            onAnswer={handleAnswer}
            questionNumber={currentIndex + 1}
            totalQuestions={exercises.length}
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
