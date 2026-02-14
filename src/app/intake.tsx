import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react-native';
import { colors } from '@/lib/colors';
import { useAppStore } from '@/lib/store';
import { Gender, AgeRange, NVCGoal, UserProfile } from '@/lib/types';
import { syncUserProfile } from '@/lib/api/profile';

type IntakeStep = 'welcome' | 'about-you' | 'goals' | 'complete';

const GENDER_OPTIONS: { id: Gender; label: string }[] = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'non-binary', label: 'Non-binary' },
  { id: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const AGE_OPTIONS: { id: AgeRange; label: string }[] = [
  { id: '18-24', label: '18-24' },
  { id: '25-34', label: '25-34' },
  { id: '35-44', label: '35-44' },
  { id: '45-54', label: '45-54' },
  { id: '55+', label: '55+' },
];

const GOAL_OPTIONS: { id: NVCGoal; label: string; description: string; emoji: string }[] = [
  { id: 'relationship', label: 'Strengthen my relationship', description: 'Connect deeper with my partner', emoji: '💑' },
  { id: 'parenting', label: 'Be a more connected parent', description: 'Communicate better with my kids', emoji: '👨‍👩‍👧' },
  { id: 'family', label: 'Heal family dynamics', description: 'Navigate difficult family relationships', emoji: '🏠' },
  { id: 'workplace', label: 'Handle workplace conflicts', description: 'Navigate professional relationships', emoji: '💼' },
  { id: 'anxiety', label: 'Ease my anxiety', description: 'Find calm through self-compassion', emoji: '🧘' },
  { id: 'anger', label: 'Transform my anger', description: 'Turn frustration into understanding', emoji: '🔥' },
  { id: 'self-talk', label: 'Be kinder to myself', description: 'Develop a gentler inner voice', emoji: '💭' },
  { id: 'communication', label: 'Express myself clearly', description: 'Say what I mean with confidence', emoji: '🗣️' },
  { id: 'boundaries', label: 'Set healthy boundaries', description: 'Say no without guilt', emoji: '🛡️' },
];

function SelectableChip({
  selected,
  onPress,
  label,
}: {
  selected: boolean;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        className="px-5 py-3 rounded-full mr-2 mb-2"
        style={{
          backgroundColor: selected ? colors.primary[500] : colors.cream[100],
          borderWidth: 2,
          borderColor: selected ? colors.primary[500] : colors.cream[200],
        }}
      >
        <Text
          className="text-base"
          style={{
            fontFamily: selected ? 'Nunito_700Bold' : 'Nunito_500Medium',
            color: selected ? '#FFFFFF' : colors.jackal[600],
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

function GoalCard({
  selected,
  onPress,
  label,
  description,
  emoji,
}: {
  selected: boolean;
  onPress: () => void;
  label: string;
  description: string;
  emoji: string;
}) {
  return (
    <Pressable onPress={onPress}>
      <View
        className="flex-row items-center p-4 rounded-2xl mb-3"
        style={{
          backgroundColor: selected ? colors.primary[50] : colors.cream[100],
          borderWidth: 2,
          borderColor: selected ? colors.primary[500] : colors.cream[200],
        }}
      >
        <View
          className="w-14 h-14 rounded-full items-center justify-center mr-4"
          style={{
            backgroundColor: selected ? colors.primary[100] : colors.cream[200],
          }}
        >
          <Text className="text-2xl">{emoji}</Text>
        </View>
        <View className="flex-1">
          <Text
            className="text-[17px] mb-1"
            style={{
              fontFamily: selected ? 'Nunito_700Bold' : 'Nunito_600SemiBold',
              color: selected ? colors.primary[700] : colors.jackal[700],
            }}
          >
            {label}
          </Text>
          <Text
            className="text-[15px]"
            style={{
              fontFamily: 'Nunito_400Regular',
              color: colors.jackal[500],
            }}
          >
            {description}
          </Text>
        </View>
        {selected && (
          <View
            className="w-7 h-7 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary[500] }}
          >
            <Check size={16} color="#FFFFFF" strokeWidth={3} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function IntakeScreen() {
  const router = useRouter();
  const updateUser = useAppStore(s => s.updateUser);
  const userName = useAppStore(s => s.user?.name) ?? 'friend';
  const userEmail = useAppStore(s => s.user?.email) ?? '';

  const [step, setStep] = useState<IntakeStep>('welcome');
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [selectedAge, setSelectedAge] = useState<AgeRange | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<NVCGoal[]>([]);

  const toggleGoal = (goal: NVCGoal) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedGoals(prev =>
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : prev.length < 3 ? [...prev, goal] : prev
    );
  };

  const handleNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (step === 'welcome') {
      setStep('about-you');
    } else if (step === 'about-you') {
      setStep('goals');
    } else if (step === 'goals') {
      // Save profile and mark intake as complete
      const profile: UserProfile = {
        gender: selectedGender ?? undefined,
        ageRange: selectedAge ?? undefined,
        goals: selectedGoals.length > 0 ? selectedGoals : undefined,
      };
      await updateUser({ profile, hasCompletedIntake: true });

      // Sync profile to backend for analytics (non-blocking)
      if (userEmail) {
        syncUserProfile({
          email: userEmail,
          name: userName,
          gender: selectedGender ?? undefined,
          ageRange: selectedAge ?? undefined,
          goals: selectedGoals.length > 0 ? selectedGoals : undefined,
        }).catch(err => console.log('[INTAKE] Background sync error:', err));
      }

      setStep('complete');
    } else if (step === 'complete') {
      // Go to intro-lesson to start learning the basics
      router.replace('/intro-lesson');
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 'about-you') setStep('welcome');
    else if (step === 'goals') setStep('about-you');
  };

  const handleSkip = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Mark intake as complete even if skipped
    await updateUser({ hasCompletedIntake: true });

    // Sync basic profile to backend (non-blocking)
    if (userEmail) {
      syncUserProfile({
        email: userEmail,
        name: userName,
      }).catch(err => console.log('[INTAKE] Background sync error:', err));
    }

    // Go to intro-lesson to start learning the basics
    router.replace('/intro-lesson');
  };

  const canProceed = () => {
    if (step === 'about-you') {
      return selectedGender !== null && selectedAge !== null;
    }
    return true;
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.cream[50] }}>
      <SafeAreaView className="flex-1">
        {/* Progress indicator */}
        {step !== 'welcome' && step !== 'complete' && (
          <View className="flex-row px-6 pt-4 gap-2">
            {['about-you', 'goals'].map((s, i) => (
              <View
                key={s}
                className="flex-1 h-1 rounded-full"
                style={{
                  backgroundColor:
                    (step === 'about-you' && i === 0) ||
                    (step === 'goals' && i <= 1)
                      ? colors.primary[500]
                      : colors.cream[300],
                }}
              />
            ))}
          </View>
        )}

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome Step */}
          {step === 'welcome' && (
            <View
              className="flex-1 px-6 pt-12"
            >
              <View className="items-center mb-8">
                <Text className="text-6xl mb-4">🦒</Text>
                <Text
                  className="text-3xl text-center mb-3"
                  style={{
                    fontFamily: 'Nunito_800ExtraBold',
                    color: colors.jackal[800],
                  }}
                >
                  Welcome, {userName}!
                </Text>
                <Text
                  className="text-lg text-center px-4 leading-7"
                  style={{
                    fontFamily: 'Nunito_500Medium',
                    color: colors.jackal[500],
                  }}
                >
                  You're about to learn Nonviolent Communication (NVC), a powerful approach to connecting with yourself and others.
                </Text>
              </View>

              {/* Dr. Marshall Rosenberg credit */}
              <View
                className="p-5 rounded-2xl mb-6"
                style={{ backgroundColor: colors.sage[50] }}
              >
                <Text
                  className="text-base leading-7 mb-3"
                  style={{
                    fontFamily: 'Nunito_500Medium',
                    color: colors.sage[700],
                  }}
                >
                  NVC was developed by{' '}
                  <Text style={{ fontFamily: 'Nunito_700Bold' }}>
                    Dr. Marshall Rosenberg
                  </Text>
                  , a psychologist who dedicated his life to creating peace through compassionate communication.
                </Text>
                <Text
                  className="text-base italic leading-6"
                  style={{
                    fontFamily: 'Nunito_400Regular',
                    color: colors.sage[600],
                  }}
                >
                  "What I want in my life is compassion, a flow between myself and others based on a mutual giving from the heart."
                </Text>
                <Text
                  className="text-sm mt-2"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.sage[500],
                  }}
                >
                  — Dr. Marshall Rosenberg
                </Text>
              </View>

              <Text
                className="text-base text-center mb-2"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[400],
                }}
              >
                Let's personalize your experience with a few quick questions.
              </Text>
            </View>
          )}

          {/* About You Step */}
          {step === 'about-you' && (
            <View
              className="flex-1 px-6 pt-8"
            >
              <Text
                className="text-2xl mb-6"
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  color: colors.jackal[800],
                }}
              >
                A little about you
              </Text>

              {/* Gender */}
              <Text
                className="text-base mb-3"
                style={{
                  fontFamily: 'Nunito_700Bold',
                  color: colors.jackal[700],
                }}
              >
                I identify as
              </Text>
              <View className="flex-row flex-wrap mb-6">
                {GENDER_OPTIONS.map(option => (
                  <SelectableChip
                    key={option.id}
                    selected={selectedGender === option.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedGender(option.id);
                    }}
                    label={option.label}
                  />
                ))}
              </View>

              {/* Age */}
              <Text
                className="text-base mb-3"
                style={{
                  fontFamily: 'Nunito_700Bold',
                  color: colors.jackal[700],
                }}
              >
                My age range
              </Text>
              <View className="flex-row flex-wrap mb-6">
                {AGE_OPTIONS.map(option => (
                  <SelectableChip
                    key={option.id}
                    selected={selectedAge === option.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedAge(option.id);
                    }}
                    label={option.label}
                  />
                ))}
              </View>

              <View
                className="p-4 rounded-xl"
                style={{ backgroundColor: colors.cream[100] }}
              >
                <Text
                  className="text-xs text-center leading-5"
                  style={{
                    fontFamily: 'Nunito_400Regular',
                    color: colors.jackal[400],
                  }}
                >
                  This helps us personalize your experience. Your information is private and never shared.
                </Text>
              </View>
            </View>
          )}

          {/* Goals Step */}
          {step === 'goals' && (
            <View
              className="flex-1 px-6 pt-8"
            >
              <Text
                className="text-2xl mb-2"
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  color: colors.jackal[800],
                }}
              >
                What brings you here?
              </Text>
              <Text
                className="text-sm mb-6"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[500],
                }}
              >
                Select up to 3 goals (optional)
              </Text>

              {GOAL_OPTIONS.map(option => (
                <GoalCard
                  key={option.id}
                  selected={selectedGoals.includes(option.id)}
                  onPress={() => toggleGoal(option.id)}
                  label={option.label}
                  description={option.description}
                  emoji={option.emoji}
                />
              ))}

              {/* Disclaimer */}
              <View
                className="p-4 rounded-xl mt-4"
                style={{ backgroundColor: colors.cream[100] }}
              >
                <Text
                  className="text-xs text-center leading-5"
                  style={{
                    fontFamily: 'Nunito_400Regular',
                    color: colors.jackal[400],
                  }}
                >
                  This app is for educational purposes and personal growth. It is not a substitute for professional mental health care or therapy.
                </Text>
              </View>
            </View>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <View
              className="flex-1 px-6 pt-12 items-center"
            >
              <Text className="text-6xl mb-4">🎉</Text>
              <Text
                className="text-3xl text-center mb-3"
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  color: colors.jackal[800],
                }}
              >
                You're all set!
              </Text>
              <Text
                className="text-lg text-center px-4 leading-7 mb-8"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[500],
                }}
              >
                Let's start with a quick introduction to NVC basics. This will only take a few minutes!
              </Text>

              <View
                className="w-full p-5 rounded-2xl"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <Text
                  className="text-base text-center mb-3"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.primary[700],
                  }}
                >
                  In the next few lessons, you'll learn:
                </Text>
                <View className="gap-2">
                  <Text
                    className="text-[15px]"
                    style={{
                      fontFamily: 'Nunito_500Medium',
                      color: colors.primary[600],
                    }}
                  >
                    • What NVC is and why it works
                  </Text>
                  <Text
                    className="text-[15px]"
                    style={{
                      fontFamily: 'Nunito_500Medium',
                      color: colors.primary[600],
                    }}
                  >
                    • The 4 key components of NVC
                  </Text>
                  <Text
                    className="text-[15px]"
                    style={{
                      fontFamily: 'Nunito_500Medium',
                      color: colors.primary[600],
                    }}
                  >
                    • How to apply it in real conversations
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom buttons */}
        <View className="px-6 pb-6">
          <View className="flex-row gap-3">
            {(step === 'about-you' || step === 'goals') && (
              <Pressable
                onPress={handleBack}
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.cream[200] }}
              >
                <ArrowLeft size={24} color={colors.jackal[600]} />
              </Pressable>
            )}

            <Pressable
              onPress={handleNext}
              disabled={!canProceed()}
              className="flex-1 h-14 rounded-full flex-row items-center justify-center"
              style={{
                backgroundColor: canProceed() ? colors.primary[500] : colors.jackal[200],
              }}
            >
              <Text
                className="text-base mr-2"
                style={{
                  fontFamily: 'Nunito_700Bold',
                  color: '#FFFFFF',
                }}
              >
                {step === 'welcome' ? "Let's Go" : step === 'complete' ? 'Begin First Lesson' : 'Continue'}
              </Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {step === 'goals' && (
            <Pressable onPress={handleSkip} className="mt-3">
              <Text
                className="text-sm text-center"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[400],
                }}
              >
                Skip for now
              </Text>
            </Pressable>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
