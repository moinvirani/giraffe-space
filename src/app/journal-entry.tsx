import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { X, Check, Trash2, ChevronRight, ChevronLeft } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';
import { JournalTemplate, FEELINGS, NEEDS } from '@/lib/types';

const TEMPLATES: { id: JournalTemplate; title: string; description: string; emoji: string }[] = [
  {
    id: 'free-write',
    title: 'Free Write',
    description: "Just let it out — we'll help you find the NVC pieces",
    emoji: '✏️',
  },
  {
    id: 'hurt-by-words',
    title: 'Something hurt me',
    description: 'Process words or actions that left you feeling wounded',
    emoji: '💔',
  },
  {
    id: 'frustrated-with-someone',
    title: "I'm frustrated",
    description: 'Unpack frustration and find needs underneath',
    emoji: '😤',
  },
  {
    id: 'difficult-conversation',
    title: 'Difficult conversation ahead',
    description: 'Prepare to speak from the heart',
    emoji: '💬',
  },
  {
    id: 'repair-reaction',
    title: 'I want to repair',
    description: 'Reflect on a reaction and plan how to reconnect',
    emoji: '🔧',
  },
];

const MOODS = [
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'frustrated', emoji: '😤', label: 'Frustrated' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'anxious', emoji: '😰', label: 'Anxious' },
  { id: 'hopeful', emoji: '🌱', label: 'Hopeful' },
  { id: 'peaceful', emoji: '🕊️', label: 'Peaceful' },
] as const;

type Step = 'template' | 'situation' | 'observation' | 'feelings' | 'needs' | 'request' | 'mood';

const STEPS_ORDER: Step[] = ['template', 'situation', 'observation', 'feelings', 'needs', 'request', 'mood'];

export default function JournalEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; template?: JournalTemplate }>();
  const insets = useSafeAreaInsets();
  const isEditing = !!params.id;
  const preselectedTemplate = params.template as JournalTemplate | undefined;

  const journalEntries = useAppStore(s => s.journalEntries);
  const addJournalEntry = useAppStore(s => s.addJournalEntry);
  const updateJournalEntry = useAppStore(s => s.updateJournalEntry);
  const deleteJournalEntry = useAppStore(s => s.deleteJournalEntry);

  // If template is preselected (from Quick Note), skip template selection step
  const initialStep: Step = preselectedTemplate ? 'situation' : 'template';
  const [currentStep, setCurrentStep] = useState<Step>(initialStep);
  const [template, setTemplate] = useState<JournalTemplate>(preselectedTemplate || 'free-write');
  const [situation, setSituation] = useState('');
  const [observation, setObservation] = useState('');
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [request, setRequest] = useState('');
  const [mood, setMood] = useState<typeof MOODS[number]['id']>('calm');

  // Load existing entry if editing
  useEffect(() => {
    if (params.id) {
      const entry = journalEntries.find(e => e.id === params.id);
      if (entry) {
        setTemplate(entry.template);
        setSituation(entry.situation);
        setObservation(entry.observation);
        setSelectedFeelings(entry.feelings);
        setSelectedNeeds(entry.needs);
        setRequest(entry.request);
        setMood(entry.mood);
        setCurrentStep('situation'); // Start at situation when editing
      }
    }
  }, [params.id, journalEntries]);

  const currentStepIndex = STEPS_ORDER.indexOf(currentStep);
  // If template was preselected, the effective first step is 'situation' (index 1)
  const effectiveFirstStepIndex = preselectedTemplate ? 1 : 0;
  const isFirstStep = currentStepIndex <= effectiveFirstStepIndex;
  const isLastStep = currentStepIndex === STEPS_ORDER.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleSave();
    } else {
      setCurrentStep(STEPS_ORDER[currentStepIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > effectiveFirstStepIndex) {
      setCurrentStep(STEPS_ORDER[currentStepIndex - 1]);
    }
  };

  const handleSave = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const entryData = {
      template,
      situation,
      observation,
      feelings: selectedFeelings,
      needs: selectedNeeds,
      request,
      mood,
    };

    if (isEditing && params.id) {
      await updateJournalEntry(params.id, entryData);
    } else {
      await addJournalEntry(entryData);
    }

    router.back();
  };

  const handleDelete = async () => {
    if (params.id) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      await deleteJournalEntry(params.id);
      router.back();
    }
  };

  const toggleFeeling = (feeling: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedFeelings(prev =>
      prev.includes(feeling) ? prev.filter(f => f !== feeling) : [...prev, feeling]
    );
  };

  const toggleNeed = (need: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedNeeds(prev =>
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'template':
        return (
          <View className="flex-1 px-5">
            <Text
              className="text-xl mb-2"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[800],
              }}
            >
              What brings you here?
            </Text>
            <Text
              className="text-sm mb-6"
              style={{
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[400],
              }}
            >
              Choose a starting point for your reflection
            </Text>

            {TEMPLATES.map((t, index) => (
              <Animated.View
                key={t.id}
                entering={FadeInDown.delay(100 + index * 50).springify()}
              >
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setTemplate(t.id);
                  }}
                  className="mb-3"
                >
                  <View
                    className="rounded-2xl p-4 flex-row items-center"
                    style={{
                      backgroundColor: template === t.id ? colors.sage[100] : colors.cream[100],
                      borderWidth: 2,
                      borderColor: template === t.id ? colors.sage[500] : colors.cream[200],
                    }}
                  >
                    <Text className="text-2xl mr-3">{t.emoji}</Text>
                    <View className="flex-1">
                      <Text
                        className="text-base"
                        style={{
                          fontFamily: 'Nunito_600SemiBold',
                          color: colors.jackal[700],
                        }}
                      >
                        {t.title}
                      </Text>
                      <Text
                        className="text-sm"
                        style={{
                          fontFamily: 'Nunito_400Regular',
                          color: colors.jackal[400],
                        }}
                      >
                        {t.description}
                      </Text>
                    </View>
                    {template === t.id && (
                      <Check size={20} color={colors.sage[600]} />
                    )}
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        );

      case 'situation':
        return (
          <View className="flex-1 px-5">
            <Text
              className="text-xl mb-2"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[800],
              }}
            >
              What happened?
            </Text>
            <Text
              className="text-sm mb-4"
              style={{
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[400],
              }}
            >
              No judgment here — just let it out
            </Text>

            <TextInput
              className="flex-1 rounded-2xl p-4 text-base"
              style={{
                backgroundColor: colors.cream[100],
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[700],
                textAlignVertical: 'top',
              }}
              placeholder="Describe what's on your mind..."
              placeholderTextColor={colors.jackal[300]}
              value={situation}
              onChangeText={setSituation}
              multiline
              numberOfLines={8}
            />
          </View>
        );

      case 'observation':
        return (
          <View className="flex-1 px-5">
            <Text
              className="text-xl mb-2"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[800],
              }}
            >
              Just the facts
            </Text>
            <Text
              className="text-sm mb-4"
              style={{
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[400],
              }}
            >
              What would a camera have recorded? No interpretations, just what happened.
            </Text>

            <TextInput
              className="flex-1 rounded-2xl p-4 text-base"
              style={{
                backgroundColor: colors.cream[100],
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[700],
                textAlignVertical: 'top',
              }}
              placeholder="They said/did... I saw/heard..."
              placeholderTextColor={colors.jackal[300]}
              value={observation}
              onChangeText={setObservation}
              multiline
              numberOfLines={6}
            />

            <View
              className="rounded-xl p-4 mt-4"
              style={{ backgroundColor: colors.sage[50], borderWidth: 1, borderColor: colors.sage[200] }}
            >
              <Text
                className="text-sm leading-5"
                style={{
                  fontFamily: 'Nunito_600SemiBold',
                  color: colors.sage[700],
                }}
              >
                💡 Tip: Replace "You always..." with specific times. Replace "You're being..." with what was said or done.
              </Text>
            </View>
          </View>
        );

      case 'feelings':
        return (
          <View className="flex-1 px-5">
            <Text
              className="text-xl mb-2"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[800],
              }}
            >
              How are you feeling?
            </Text>
            <Text
              className="text-sm mb-4"
              style={{
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[400],
              }}
            >
              Pick 1-3 that resonate most
            </Text>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Primary feelings - needs not met (most common for journaling) */}
              <Text
                className="text-xs uppercase tracking-wide mb-3"
                style={{
                  fontFamily: 'Nunito_700Bold',
                  color: colors.coral[500],
                }}
              >
                When needs aren't met
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {FEELINGS.whenNeedsNotMet.slice(0, 12).map(feeling => {
                  const isSelected = selectedFeelings.includes(feeling);
                  const canSelect = selectedFeelings.length < 3 || isSelected;
                  return (
                    <Pressable
                      key={feeling}
                      onPress={() => canSelect && toggleFeeling(feeling)}
                      style={{ opacity: canSelect ? 1 : 0.4 }}
                    >
                      <View
                        className="px-4 py-2.5 rounded-xl"
                        style={{
                          backgroundColor: isSelected
                            ? colors.coral[500]
                            : colors.coral[50],
                          borderWidth: 1.5,
                          borderColor: isSelected
                            ? colors.coral[500]
                            : colors.coral[200],
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'Nunito_600SemiBold',
                            fontSize: 15,
                            color: isSelected ? '#FFFFFF' : colors.coral[700],
                          }}
                        >
                          {feeling}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {/* Positive feelings */}
              <Text
                className="text-xs uppercase tracking-wide mb-3"
                style={{
                  fontFamily: 'Nunito_700Bold',
                  color: colors.sage[500],
                }}
              >
                When needs are met
              </Text>
              <View className="flex-row flex-wrap gap-2 pb-4">
                {FEELINGS.whenNeedsMet.slice(0, 10).map(feeling => {
                  const isSelected = selectedFeelings.includes(feeling);
                  const canSelect = selectedFeelings.length < 3 || isSelected;
                  return (
                    <Pressable
                      key={feeling}
                      onPress={() => canSelect && toggleFeeling(feeling)}
                      style={{ opacity: canSelect ? 1 : 0.4 }}
                    >
                      <View
                        className="px-4 py-2.5 rounded-xl"
                        style={{
                          backgroundColor: isSelected
                            ? colors.sage[500]
                            : colors.sage[50],
                          borderWidth: 1.5,
                          borderColor: isSelected
                            ? colors.sage[500]
                            : colors.sage[200],
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'Nunito_600SemiBold',
                            fontSize: 15,
                            color: isSelected ? '#FFFFFF' : colors.sage[700],
                          }}
                        >
                          {feeling}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Selection indicator */}
            {selectedFeelings.length > 0 && (
              <View
                className="rounded-xl p-3 mt-2"
                style={{ backgroundColor: colors.cream[100] }}
              >
                <Text
                  className="text-sm text-center"
                  style={{
                    fontFamily: 'Nunito_500Medium',
                    color: colors.jackal[500],
                  }}
                >
                  Selected: {selectedFeelings.join(', ')}
                </Text>
              </View>
            )}
          </View>
        );

      case 'needs':
        return (
          <View className="flex-1 px-5">
            <Text
              className="text-xl mb-2"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[800],
              }}
            >
              What needs are alive?
            </Text>
            <Text
              className="text-sm mb-4"
              style={{
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[400],
              }}
            >
              Behind every feeling is a universal human need
            </Text>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              <View className="flex-row flex-wrap gap-2 pb-4">
                {NEEDS.map(need => (
                  <Pressable key={need} onPress={() => toggleNeed(need)}>
                    <View
                      className="px-3 py-2 rounded-full"
                      style={{
                        backgroundColor: selectedNeeds.includes(need)
                          ? colors.primary[500]
                          : '#FFFFFF',
                        borderWidth: 1,
                        borderColor: selectedNeeds.includes(need)
                          ? colors.primary[500]
                          : colors.cream[300],
                      }}
                    >
                      <Text
                        className="text-sm"
                        style={{
                          fontFamily: 'Nunito_600SemiBold',
                          color: selectedNeeds.includes(need)
                            ? '#FFFFFF'
                            : colors.jackal[600],
                        }}
                      >
                        {need}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        );

      case 'request':
        return (
          <View className="flex-1 px-5">
            <Text
              className="text-xl mb-2"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[800],
              }}
            >
              What would you like?
            </Text>
            <Text
              className="text-sm mb-4"
              style={{
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[400],
              }}
            >
              A clear, doable request (of yourself or others)
            </Text>

            <TextInput
              className="flex-1 rounded-2xl p-4 text-base"
              style={{
                backgroundColor: colors.cream[100],
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[700],
                textAlignVertical: 'top',
              }}
              placeholder="Would you be willing to... / I'd like to..."
              placeholderTextColor={colors.jackal[300]}
              value={request}
              onChangeText={setRequest}
              multiline
              numberOfLines={5}
            />

            <View
              className="rounded-xl p-4 mt-4"
              style={{ backgroundColor: colors.sage[50], borderWidth: 1, borderColor: colors.sage[200] }}
            >
              <Text
                className="text-sm leading-5"
                style={{
                  fontFamily: 'Nunito_600SemiBold',
                  color: colors.sage[700],
                }}
              >
                💡 Tip: Good requests are specific, doable, and leave room for "no". They focus on what you want, not what you don't want.
              </Text>
            </View>
          </View>
        );

      case 'mood':
        return (
          <View className="flex-1 px-5">
            <Text
              className="text-xl mb-2"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[800],
              }}
            >
              How do you feel now?
            </Text>
            <Text
              className="text-sm mb-6"
              style={{
                fontFamily: 'Nunito_500Medium',
                color: colors.jackal[400],
              }}
            >
              After this reflection, what's your current state?
            </Text>

            <View className="flex-row flex-wrap justify-center gap-4">
              {MOODS.map(m => (
                <Pressable
                  key={m.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setMood(m.id);
                  }}
                >
                  <View
                    className="items-center p-4 rounded-2xl"
                    style={{
                      backgroundColor: mood === m.id ? colors.sage[100] : colors.cream[100],
                      borderWidth: 2,
                      borderColor: mood === m.id ? colors.sage[500] : colors.cream[200],
                      width: 100,
                    }}
                  >
                    <Text className="text-4xl mb-2">{m.emoji}</Text>
                    <Text
                      className="text-sm"
                      style={{
                        fontFamily: 'Nunito_600SemiBold',
                        color: mood === m.id ? colors.sage[700] : colors.jackal[500],
                      }}
                    >
                      {m.label}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        );
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.cream[50], paddingTop: insets.top }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
          <Pressable
            onPress={() => router.back()}
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

          {/* Progress dots */}
          <View className="flex-row gap-1.5">
            {STEPS_ORDER.filter((step) => !(preselectedTemplate && step === 'template')).map((step, index) => {
              const actualIndex = STEPS_ORDER.indexOf(step);
              return (
                <View
                  key={step}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      actualIndex === currentStepIndex
                        ? colors.sage[500]
                        : actualIndex < currentStepIndex
                        ? colors.sage[300]
                        : colors.cream[300],
                  }}
                />
              );
            })}
          </View>

          {isEditing ? (
            <Pressable
              onPress={handleDelete}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.coral[100] }}
            >
              <Trash2 size={20} color={colors.coral[500]} />
            </Pressable>
          ) : (
            <View className="w-10" />
          )}
        </View>

        {/* Content */}
        <View className="flex-1">{renderStepContent()}</View>

        {/* Navigation */}
        <View className="flex-row gap-3 px-5 pt-2" style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}>
          {!isFirstStep && (
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
              colors={[colors.sage[400], colors.sage[500], colors.sage[600]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: 16,
                borderRadius: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 56,
                shadowColor: colors.sage[600],
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
                {isLastStep ? 'Save Entry' : 'Continue'}
              </Text>
              {isLastStep ? (
                <Check size={22} color="#FFFFFF" strokeWidth={2.5} />
              ) : (
                <ChevronRight size={22} color="#FFFFFF" strokeWidth={2.5} />
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
