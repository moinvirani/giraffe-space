import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { X, Heart, Compass, ChevronRight, Sparkles } from 'lucide-react-native';
import { colors } from '@/lib/colors';
import { FEELINGS, NEEDS_BY_CATEGORY, FAUX_FEELINGS } from '@/lib/types';

type VocabTab = 'feelings-met' | 'feelings-unmet' | 'needs' | 'faux';

const TABS: { id: VocabTab; label: string; emoji: string }[] = [
  { id: 'feelings-met', label: 'When Needs Met', emoji: '😊' },
  { id: 'feelings-unmet', label: 'When Needs Unmet', emoji: '😔' },
  { id: 'needs', label: 'Universal Needs', emoji: '💚' },
  { id: 'faux', label: 'Faux Feelings', emoji: '⚠️' },
];

const NEEDS_CATEGORIES = [
  { key: 'connection', label: 'Connection', emoji: '🤝', color: colors.coral[500] },
  { key: 'autonomy', label: 'Autonomy', emoji: '🦅', color: colors.primary[500] },
  { key: 'physicalWellBeing', label: 'Physical Well-being', emoji: '💪', color: colors.sage[500] },
  { key: 'honesty', label: 'Honesty', emoji: '💎', color: colors.jackal[500] },
  { key: 'play', label: 'Play', emoji: '🎉', color: colors.coral[400] },
  { key: 'peace', label: 'Peace', emoji: '🕊️', color: colors.sage[400] },
  { key: 'meaning', label: 'Meaning', emoji: '✨', color: colors.primary[600] },
] as const;

function WordChip({ word, color, isHighlighted = false }: { word: string; color: string; isHighlighted?: boolean }) {
  return (
    <View
      className="px-3 py-2 rounded-xl mr-2 mb-2"
      style={{
        backgroundColor: isHighlighted ? color : `${color}15`,
        borderWidth: 1,
        borderColor: isHighlighted ? color : `${color}30`,
      }}
    >
      <Text
        className="text-sm capitalize"
        style={{
          fontFamily: 'Nunito_600SemiBold',
          color: isHighlighted ? '#FFFFFF' : color,
        }}
      >
        {word}
      </Text>
    </View>
  );
}

export default function NVCVocabularyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ tab?: string }>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<VocabTab>((params.tab as VocabTab) || 'feelings-met');

  const handleClose = () => {
    router.back();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'feelings-met':
        return (
          <Animated.View entering={FadeInDown.springify()} className="px-5">
            <View
              className="p-4 rounded-2xl mb-4"
              style={{ backgroundColor: colors.sage[50] }}
            >
              <View className="flex-row items-center mb-2">
                <Sparkles size={18} color={colors.sage[600]} />
                <Text
                  className="text-sm ml-2"
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    color: colors.sage[700],
                  }}
                >
                  Feelings when needs ARE met
                </Text>
              </View>
              <Text
                className="text-sm leading-5"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.sage[600],
                }}
              >
                These feelings arise when our needs are being satisfied. They help us recognize what's working well.
              </Text>
            </View>

            <View className="flex-row flex-wrap">
              {FEELINGS.whenNeedsMet.map((feeling) => (
                <WordChip key={feeling} word={feeling} color={colors.sage[600]} />
              ))}
            </View>
          </Animated.View>
        );

      case 'feelings-unmet':
        return (
          <Animated.View entering={FadeInDown.springify()} className="px-5">
            <View
              className="p-4 rounded-2xl mb-4"
              style={{ backgroundColor: colors.coral[50] }}
            >
              <View className="flex-row items-center mb-2">
                <Heart size={18} color={colors.coral[600]} />
                <Text
                  className="text-sm ml-2"
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    color: colors.coral[700],
                  }}
                >
                  Feelings when needs are NOT met
                </Text>
              </View>
              <Text
                className="text-sm leading-5"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.coral[600],
                }}
              >
                These feelings signal that something important to us isn't being addressed. They're messengers, not problems.
              </Text>
            </View>

            <View className="flex-row flex-wrap">
              {FEELINGS.whenNeedsNotMet.map((feeling) => (
                <WordChip key={feeling} word={feeling} color={colors.coral[600]} />
              ))}
            </View>
          </Animated.View>
        );

      case 'needs':
        return (
          <Animated.View entering={FadeInDown.springify()} className="px-5">
            <View
              className="p-4 rounded-2xl mb-4"
              style={{ backgroundColor: colors.primary[50] }}
            >
              <View className="flex-row items-center mb-2">
                <Compass size={18} color={colors.primary[600]} />
                <Text
                  className="text-sm ml-2"
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    color: colors.primary[700],
                  }}
                >
                  Universal Human Needs
                </Text>
              </View>
              <Text
                className="text-sm leading-5"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.primary[600],
                }}
              >
                All humans share these fundamental needs. Understanding them helps us connect with ourselves and others more deeply.
              </Text>
            </View>

            {NEEDS_CATEGORIES.map((category) => (
              <View key={category.key} className="mb-4">
                <View className="flex-row items-center mb-2">
                  <Text className="text-lg mr-2">{category.emoji}</Text>
                  <Text
                    className="text-sm"
                    style={{
                      fontFamily: 'Nunito_700Bold',
                      color: colors.jackal[700],
                    }}
                  >
                    {category.label}
                  </Text>
                </View>
                <View className="flex-row flex-wrap">
                  {(NEEDS_BY_CATEGORY[category.key as keyof typeof NEEDS_BY_CATEGORY] || []).map((need) => (
                    <WordChip key={need} word={need} color={category.color} />
                  ))}
                </View>
              </View>
            ))}
          </Animated.View>
        );

      case 'faux':
        return (
          <Animated.View entering={FadeInDown.springify()} className="px-5">
            <View
              className="p-4 rounded-2xl mb-4"
              style={{ backgroundColor: colors.jackal[100] }}
            >
              <View className="flex-row items-center mb-2">
                <Text className="text-lg mr-2">⚠️</Text>
                <Text
                  className="text-sm"
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    color: colors.jackal[700],
                  }}
                >
                  Faux Feelings (Thoughts Disguised as Feelings)
                </Text>
              </View>
              <Text
                className="text-sm leading-5"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[600],
                }}
              >
                These words sound like feelings but actually describe what we think others are doing TO us. Try to find the true feeling underneath!
              </Text>
            </View>

            <View
              className="p-4 rounded-2xl mb-4"
              style={{ backgroundColor: colors.cream[100] }}
            >
              <Text
                className="text-sm"
                style={{
                  fontFamily: 'Nunito_700Bold',
                  color: colors.jackal[700],
                  marginBottom: 8,
                }}
              >
                Example Transformation:
              </Text>
              <View className="flex-row items-center mb-2">
                <View
                  className="px-3 py-1.5 rounded-lg mr-2"
                  style={{ backgroundColor: colors.coral[100] }}
                >
                  <Text
                    className="text-sm"
                    style={{
                      fontFamily: 'Nunito_600SemiBold',
                      color: colors.coral[600],
                    }}
                  >
                    "I feel rejected"
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.jackal[400]} />
              </View>
              <View className="flex-row items-center">
                <View
                  className="px-3 py-1.5 rounded-lg"
                  style={{ backgroundColor: colors.sage[100] }}
                >
                  <Text
                    className="text-sm"
                    style={{
                      fontFamily: 'Nunito_600SemiBold',
                      color: colors.sage[600],
                    }}
                  >
                    "I feel sad and hurt because my need for belonging isn't met"
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row flex-wrap">
              {FAUX_FEELINGS.map((feeling) => (
                <WordChip key={feeling} word={feeling} color={colors.jackal[500]} />
              ))}
            </View>
          </Animated.View>
        );
    }
  };

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
            NVC Vocabulary
          </Text>

          <View style={{ width: 44 }} />
        </View>

        {/* Tabs */}
        <View className="px-4 py-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setActiveTab(tab.id);
                  }}
                >
                  <View
                    className="px-4 py-2.5 rounded-full mr-2 flex-row items-center"
                    style={{
                      backgroundColor: isActive ? colors.primary[500] : colors.cream[200],
                    }}
                  >
                    <Text className="text-sm mr-1.5">{tab.emoji}</Text>
                    <Text
                      className="text-sm"
                      style={{
                        fontFamily: 'Nunito_600SemiBold',
                        color: isActive ? '#FFFFFF' : colors.jackal[600],
                      }}
                    >
                      {tab.label}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {renderContent()}
        </ScrollView>
      </View>
    </View>
  );
}
