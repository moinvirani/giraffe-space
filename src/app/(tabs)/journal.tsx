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
import { Plus, BookOpen, Calendar, ChevronRight, Heart } from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';
import { JournalEntry } from '@/lib/types';
import { format, isToday, isYesterday, parseISO } from 'date-fns';

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

export default function JournalScreen() {
  const router = useRouter();
  const journalEntries = useAppStore(s => s.journalEntries);

  const handleNewEntry = () => {
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
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-4">
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

            <AnimatedPressable
              onPress={handleNewEntry}
              entering={FadeIn.delay(100)}
            >
              <LinearGradient
                colors={[colors.sage[400], colors.sage[500]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="flex-row items-center py-2.5 px-4 rounded-full"
              >
                <Plus size={18} color="#FFFFFF" />
                <Text
                  className="text-sm ml-1"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: '#FFFFFF',
                  }}
                >
                  New
                </Text>
              </LinearGradient>
            </AnimatedPressable>
          </View>

          {/* Tip card */}
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

          {/* Entries list */}
          <View className="px-5">
            {journalEntries.map((entry, index) => (
              <Animated.View
                key={entry.id}
                entering={FadeInDown.delay(150 + index * 50).springify()}
              >
                <JournalCard
                  entry={entry}
                  onPress={() => handleViewEntry(entry)}
                />
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
