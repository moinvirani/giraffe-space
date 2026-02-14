import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useMemo } from 'react';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Plus, BookOpen, ChevronRight, Heart, X, Sparkles, PenLine } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';
import { JournalEntry } from '@/lib/types';
import { format, isToday, isYesterday, parseISO, isSameDay } from 'date-fns';
import { CalendarStrip } from '@/components/CalendarStrip';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const MOOD_EMOJIS: Record<string, string> = {
  calm: '😌',
  frustrated: '😤',
  sad: '😢',
  anxious: '😰',
  hopeful: '🌱',
  peaceful: '🕊️',
};

const TEMPLATE_NAMES: Record<string, string> = {
  'free-write': 'Free Write',
  'hurt-by-words': 'Processing Hurt',
  'frustrated-with-someone': 'Working Through Frustration',
  'difficult-conversation': 'Preparing for Conversation',
  'repair-reaction': 'Repair & Reflection',
};

function formatEntryDate(dateString: string): string {
  const date = parseISO(dateString);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

function JournalCard({ entry, onPress }: { entry: JournalEntry; onPress: () => void }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98);
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
          backgroundColor: colors.cream[100],
          shadowColor: colors.jackal[200],
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View className="flex-row items-start justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-xl">{MOOD_EMOJIS[entry.mood]}</Text>
            <View>
              <Text
                className="text-sm"
                style={{
                  fontFamily: 'Nunito_600SemiBold',
                  color: colors.jackal[400],
                }}
              >
                {formatEntryDate(entry.createdAt)}
              </Text>
              <Text
                className="text-xs"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[300],
                }}
              >
                {TEMPLATE_NAMES[entry.template]}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={colors.jackal[300]} />
        </View>

        {entry.situation && (
          <Text
            numberOfLines={2}
            className="text-sm leading-5 mb-2"
            style={{
              fontFamily: 'Nunito_500Medium',
              color: colors.jackal[600],
            }}
          >
            {entry.situation}
          </Text>
        )}

        {entry.feelings.length > 0 && (
          <View className="flex-row flex-wrap gap-1">
            {entry.feelings.slice(0, 3).map((feeling, index) => (
              <View
                key={index}
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: colors.coral[100] }}
              >
                <Text
                  className="text-xs"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.coral[600],
                  }}
                >
                  {feeling}
                </Text>
              </View>
            ))}
            {entry.feelings.length > 3 && (
              <Text
                className="text-xs px-1"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[400],
                }}
              >
                +{entry.feelings.length - 3} more
              </Text>
            )}
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

function EmptyState({ onCreateNew }: { onCreateNew: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: colors.sage[100] }}
      >
        <BookOpen size={40} color={colors.sage[500]} />
      </View>

      <Text
        className="text-xl text-center mb-2"
        style={{
          fontFamily: 'Nunito_700Bold',
          color: colors.jackal[800],
        }}
      >
        Your Journal Awaits
      </Text>

      <Text
        className="text-base text-center mb-8"
        style={{
          fontFamily: 'Nunito_500Medium',
          color: colors.jackal[400],
        }}
      >
        Process difficult moments and discover the feelings and needs beneath the surface.
      </Text>

      <Pressable onPress={onCreateNew}>
        <LinearGradient
          colors={[colors.sage[400], colors.sage[500], colors.sage[600]]}
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
            shadowColor: colors.sage[600],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Plus size={22} color="#FFFFFF" strokeWidth={2.5} />
          <Text
            style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: 17,
              color: '#FFFFFF',
              marginLeft: 8,
            }}
          >
            Start First Entry
          </Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

// Floating Action Button with expandable options
function JournalFAB({
  onQuickNote,
  onGuidedReflection,
}: {
  onQuickNote: () => void;
  onGuidedReflection: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const toggleExpand = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsExpanded(!isExpanded);
    rotation.value = withSpring(isExpanded ? 0 : 45);
  };

  const fabIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleQuickNote = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(false);
    rotation.value = withSpring(0);
    onQuickNote();
  };

  const handleGuidedReflection = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsExpanded(false);
    rotation.value = withSpring(0);
    onGuidedReflection();
  };

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <Pressable
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
          onPress={() => {
            setIsExpanded(false);
            rotation.value = withSpring(0);
          }}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            className="flex-1"
          />
        </Pressable>
      )}

      {/* FAB Options */}
      {isExpanded && (
        <View
          className="absolute right-5"
          style={{ bottom: 184, alignItems: 'flex-end' }}
        >
          {/* Guided Reflection Option */}
          <Animated.View
            entering={FadeInUp.delay(50).springify()}
            className="mb-3"
          >
            <Pressable
              onPress={handleGuidedReflection}
              className="flex-row items-center"
            >
              <View
                className="rounded-full px-4 py-2 mr-3"
                style={{
                  backgroundColor: colors.cream[100],
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.jackal[700],
                  }}
                >
                  Guided Reflection
                </Text>
              </View>
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{
                  backgroundColor: colors.sage[500],
                  shadowColor: colors.sage[600],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Sparkles size={22} color="#FFFFFF" />
              </View>
            </Pressable>
          </Animated.View>

          {/* Quick Note Option */}
          <Animated.View entering={FadeInUp.delay(0).springify()}>
            <Pressable
              onPress={handleQuickNote}
              className="flex-row items-center"
            >
              <View
                className="rounded-full px-4 py-2 mr-3"
                style={{
                  backgroundColor: colors.cream[100],
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.jackal[700],
                  }}
                >
                  Quick Note
                </Text>
              </View>
              <View
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{
                  backgroundColor: colors.coral[500],
                  shadowColor: colors.coral[600],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <PenLine size={22} color="#FFFFFF" />
              </View>
            </Pressable>
          </Animated.View>
        </View>
      )}

      {/* Main FAB Button */}
      <View className="absolute right-5" style={{ bottom: 110 }}>
        <Pressable onPress={toggleExpand}>
          <LinearGradient
            colors={isExpanded ? [colors.jackal[400], colors.jackal[500]] : [colors.sage[400], colors.sage[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: isExpanded ? colors.jackal[600] : colors.sage[600],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Animated.View style={fabIconStyle}>
              <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
            </Animated.View>
          </LinearGradient>
        </Pressable>
      </View>
    </>
  );
}

export default function JournalScreen() {
  const router = useRouter();
  const journalEntries = useAppStore(s => s.journalEntries);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Extract dates of all journal entries for calendar display
  const entryDates = useMemo(() => {
    return journalEntries.map(entry => entry.createdAt);
  }, [journalEntries]);

  // Filter entries by selected date
  const filteredEntries = useMemo(() => {
    if (!selectedDate) return journalEntries;
    return journalEntries.filter(entry =>
      isSameDay(parseISO(entry.createdAt), selectedDate)
    );
  }, [journalEntries, selectedDate]);

  const handleNewEntry = () => {
    router.push('/journal-entry');
  };

  const handleQuickNote = () => {
    // Quick note goes directly to free-write template
    router.push({ pathname: '/journal-entry', params: { template: 'free-write' } });
  };

  const handleGuidedReflection = () => {
    // Guided reflection shows template selection
    router.push('/journal-entry');
  };

  const handleViewEntry = (entry: JournalEntry) => {
    router.push({ pathname: '/journal-entry', params: { id: entry.id } });
  };

  if (journalEntries.length === 0) {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.cream[50] }}>
        <SafeAreaView edges={['top']} className="flex-1">
          {/* Header */}
          <View className="px-5 pt-4 pb-4">
            <Text
              className="text-2xl"
              style={{
                fontFamily: 'Nunito_800ExtraBold',
                color: colors.jackal[800],
              }}
            >
              Giraffe Journal
            </Text>
          </View>
          <EmptyState onCreateNew={handleNewEntry} />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.cream[50] }}>
      <SafeAreaView edges={['top']} className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
            <Animated.View entering={FadeIn.delay(50)}>
              <Text
                className="text-2xl"
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  color: colors.jackal[800],
                }}
              >
                Giraffe Journal
              </Text>
              <Text
                className="text-sm mt-0.5"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[400],
                }}
              >
                {journalEntries.length} {journalEntries.length === 1 ? 'entry' : 'entries'}
              </Text>
            </Animated.View>
          </View>

          {/* Calendar Strip */}
          <CalendarStrip
            entryDates={entryDates}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Filter indicator */}
          {selectedDate && (
            <Animated.View
              entering={FadeIn}
              className="mx-5 mb-3"
            >
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-sm"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.primary[600],
                  }}
                >
                  Showing entries for {format(selectedDate, 'MMM d, yyyy')}
                </Text>
                <Pressable onPress={() => setSelectedDate(null)}>
                  <Text
                    className="text-sm"
                    style={{
                      fontFamily: 'Nunito_600SemiBold',
                      color: colors.coral[500],
                    }}
                  >
                    Clear
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          )}

          {/* Tip card - only show when not filtering */}
          {!selectedDate && (
            <Animated.View
              entering={FadeInDown.delay(100).springify()}
              className="mx-5 mb-4"
            >
              <View
                className="rounded-2xl p-4 flex-row items-center gap-3"
                style={{ backgroundColor: colors.coral[50] }}
              >
                <Heart size={20} color={colors.coral[500]} />
                <Text
                  className="flex-1 text-sm"
                  style={{
                    fontFamily: 'Nunito_500Medium',
                    color: colors.coral[600],
                  }}
                >
                  Writing helps transform jackal thoughts into giraffe understanding.
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Entries list */}
          <View className="px-5">
            {filteredEntries.length === 0 && selectedDate ? (
              <View className="items-center py-8">
                <Text
                  className="text-sm"
                  style={{
                    fontFamily: 'Nunito_500Medium',
                    color: colors.jackal[400],
                  }}
                >
                  No entries on this day
                </Text>
              </View>
            ) : (
              filteredEntries.map((entry, index) => (
                <Animated.View
                  key={entry.id}
                  entering={FadeInDown.delay(150 + index * 50).springify()}
                >
                  <JournalCard
                    entry={entry}
                    onPress={() => handleViewEntry(entry)}
                  />
                </Animated.View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <JournalFAB
          onQuickNote={handleQuickNote}
          onGuidedReflection={handleGuidedReflection}
        />
      </SafeAreaView>
    </View>
  );
}
