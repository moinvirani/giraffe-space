import { View, Text, ScrollView, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  Flame,
  Target,
  BookOpen,
  Settings,
  Star,
  Zap,
  Heart,
  Play,
  GraduationCap,
  ChevronRight,
  Lock,
  CheckCircle,
} from 'lucide-react-native';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';
import { useEffect } from 'react';
import { PrimaryButton } from '@/components/Button';
import { INTRO_LESSONS } from '@/lib/intro-lessons';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Introduction Progress Card - shows lessons and gates daily practice
function IntroProgressCard({
  introProgress,
  hasCompletedIntro,
  onContinue
}: {
  introProgress: number;
  hasCompletedIntro: boolean;
  onContinue: () => void;
}) {
  const totalLessons = INTRO_LESSONS.length;

  return (
    <Animated.View entering={FadeInDown.delay(100).springify()} className="mx-5">
      {/* Softer card design - cream background with accent border */}
      <View
        style={{
          borderRadius: 24,
          padding: 20,
          backgroundColor: colors.cream[100],
          borderWidth: 1,
          borderColor: colors.cream[300],
          shadowColor: colors.jackal[400],
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center mb-4">
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: colors.primary[100],
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <GraduationCap size={26} color={colors.primary[500]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 18,
                color: colors.jackal[800],
              }}
            >
              Learn the Basics
            </Text>
            <Text
              style={{
                fontFamily: 'Nunito_500Medium',
                fontSize: 13,
                color: colors.jackal[400],
              }}
            >
              {hasCompletedIntro
                ? 'Introduction complete!'
                : `${introProgress} of ${totalLessons} lessons completed`}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View
          style={{
            height: 6,
            borderRadius: 3,
            backgroundColor: colors.cream[300],
            marginBottom: 16,
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              width: `${(introProgress / totalLessons) * 100}%`,
              backgroundColor: colors.primary[500],
              borderRadius: 3,
            }}
          />
        </View>

        {/* Lesson List */}
        <View className="gap-2">
          {INTRO_LESSONS.map((lesson, index) => {
            const isCompleted = index < introProgress;
            const isCurrent = index === introProgress && !hasCompletedIntro;
            const isLocked = index > introProgress;

            return (
              <Pressable
                key={lesson.id}
                onPress={() => {
                  if (isCurrent) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onContinue();
                  }
                }}
                disabled={!isCurrent}
              >
                <View
                  className="flex-row items-center rounded-xl p-3"
                  style={{
                    backgroundColor: isCurrent
                      ? colors.primary[50]
                      : isCompleted
                      ? colors.sage[50]
                      : colors.cream[50],
                    borderWidth: isCurrent ? 2 : 1,
                    borderColor: isCurrent
                      ? colors.primary[400]
                      : isCompleted
                      ? colors.sage[200]
                      : colors.cream[200],
                  }}
                >
                  <Text className="text-xl mr-3">{lesson.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: isCurrent ? 'Nunito_700Bold' : 'Nunito_600SemiBold',
                        fontSize: 14,
                        color: isLocked ? colors.jackal[300] : colors.jackal[700],
                      }}
                    >
                      {lesson.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Nunito_400Regular',
                        fontSize: 12,
                        color: isLocked ? colors.jackal[200] : colors.jackal[400],
                      }}
                    >
                      {lesson.subtitle}
                    </Text>
                  </View>
                  {isCompleted ? (
                    <CheckCircle size={20} color={colors.sage[500]} />
                  ) : isCurrent ? (
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: colors.primary[500],
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ChevronRight size={18} color="#FFFFFF" />
                    </View>
                  ) : (
                    <Lock size={18} color={colors.jackal[200]} />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

function StreakCard({ streak, longestStreak }: { streak: number; longestStreak: number }) {
  const flameScale = useSharedValue(1);

  useEffect(() => {
    flameScale.value = withRepeat(
      withSequence(
        withSpring(1.15, { damping: 3 }),
        withSpring(1, { damping: 3 })
      ),
      -1,
      true
    );
  }, [flameScale]);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(100).springify()} className="mx-5">
      <LinearGradient
        colors={[colors.coral[400], colors.coral[500], colors.primary[500]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 20,
          shadowColor: colors.coral[500],
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text
              style={{
                fontFamily: 'Nunito_600SemiBold',
                fontSize: 14,
                color: 'rgba(255,255,255,0.85)',
              }}
            >
              Current Streak
            </Text>
            <View className="flex-row items-baseline mt-1">
              <Text
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  fontSize: 48,
                  color: '#FFFFFF',
                }}
              >
                {streak}
              </Text>
              <Text
                style={{
                  fontFamily: 'Nunito_600SemiBold',
                  fontSize: 18,
                  color: 'rgba(255,255,255,0.85)',
                  marginLeft: 4,
                }}
              >
                days
              </Text>
            </View>
            <Text
              style={{
                fontFamily: 'Nunito_500Medium',
                fontSize: 12,
                color: 'rgba(255,255,255,0.6)',
                marginTop: 2,
              }}
            >
              Best: {longestStreak} days
            </Text>
          </View>

          <Animated.View style={flameStyle}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Flame size={44} color="#FFFFFF" fill="rgba(255,255,255,0.5)" />
            </View>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

function ActionCard({
  title,
  subtitle,
  icon: Icon,
  iconColor,
  onPress,
  delay = 0,
  disabled = false,
}: {
  title: string;
  subtitle: string;
  icon: typeof Target;
  iconColor: string;
  onPress: () => void;
  delay?: number;
  disabled?: boolean;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify()} style={{ flex: 1 }}>
      <AnimatedPressable
        onPress={() => {
          if (!disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress();
          }
        }}
        onPressIn={() => {
          if (!disabled) {
            scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
          }
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        }}
        style={animatedStyle}
      >
        <View
          style={{
            backgroundColor: colors.cream[100],
            borderRadius: 20,
            padding: 16,
            shadowColor: colors.jackal[300],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: disabled ? 0.05 : 0.1,
            shadowRadius: 12,
            elevation: disabled ? 1 : 3,
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: `${iconColor}15`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            {disabled ? (
              <Lock size={20} color={colors.jackal[300]} />
            ) : (
              <Icon size={22} color={iconColor} />
            )}
          </View>
          <Text
            style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: 15,
              color: disabled ? colors.jackal[400] : colors.jackal[800],
              marginBottom: 2,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: 'Nunito_500Medium',
              fontSize: 12,
              color: colors.jackal[400],
            }}
          >
            {disabled ? 'Complete intro first' : subtitle}
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}

function ProgressCard({ level, xp, completedExercises }: { level: number; xp: number; completedExercises: number }) {
  const nextLevelXP = Math.pow(level, 2) * 100;
  const currentLevelXP = Math.pow(level - 1, 2) * 100;
  const progressInLevel = xp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const progress = Math.min(progressInLevel / xpNeededForLevel, 1);

  return (
    <Animated.View entering={FadeInDown.delay(300).springify()} className="mx-5 mt-5">
      <View className="flex-row items-center justify-between mb-3">
        <Text
          style={{
            fontFamily: 'Nunito_700Bold',
            fontSize: 18,
            color: colors.jackal[800],
          }}
        >
          Your Progress
        </Text>
        <View className="flex-row items-center">
          <Zap size={16} color={colors.primary[500]} />
          <Text
            style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: 14,
              color: colors.primary[600],
              marginLeft: 4,
            }}
          >
            {xp} XP
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: colors.cream[100],
          borderRadius: 20,
          padding: 16,
        }}
      >
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary[100],
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Star size={22} color={colors.primary[500]} fill={colors.primary[300]} />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'Nunito_500Medium',
                  fontSize: 12,
                  color: colors.jackal[400],
                }}
              >
                Current Level
              </Text>
              <Text
                style={{
                  fontFamily: 'Nunito_700Bold',
                  fontSize: 16,
                  color: colors.jackal[800],
                }}
              >
                Level {level}
              </Text>
            </View>
          </View>

          <View className="items-end">
            <Text
              style={{
                fontFamily: 'Nunito_500Medium',
                fontSize: 12,
                color: colors.jackal[400],
              }}
            >
              Exercises
            </Text>
            <Text
              style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 16,
                color: colors.sage[600],
              }}
            >
              {completedExercises}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View
          style={{
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.cream[200],
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              height: '100%',
              borderRadius: 5,
              width: `${Math.max(progress * 100, 5)}%`,
              backgroundColor: colors.primary[500],
            }}
          />
        </View>
        <Text
          style={{
            fontFamily: 'Nunito_500Medium',
            fontSize: 12,
            color: colors.jackal[400],
            textAlign: 'center',
            marginTop: 8,
          }}
        >
          {Math.round(xpNeededForLevel - progressInLevel)} XP to level {level + 1}
        </Text>
      </View>
    </Animated.View>
  );
}

// Dr. Marshall Rosenberg YouTube videos - most popular NVC lectures
const ROSENBERG_VIDEOS = [
  {
    id: '1',
    title: 'NVC Workshop - Full Session',
    duration: '3:05:53',
    views: '4.2M views',
    description: 'Complete 3-hour workshop on Nonviolent Communication basics',
    youtubeId: 'l7TONauJGfc',
  },
  {
    id: '2',
    title: 'The Basics of NVC',
    duration: '9:13',
    views: '1.8M views',
    description: 'Introduction to the 4 components of NVC',
    youtubeId: 'M-129JLTjkQ',
  },
  {
    id: '3',
    title: 'Making Life Wonderful',
    duration: '1:30:42',
    views: '890K views',
    description: 'The essence of compassionate communication',
    youtubeId: 'GZnXBnz2kwU',
  },
  {
    id: '4',
    title: 'San Francisco Workshop',
    duration: '2:58:27',
    views: '650K views',
    description: 'Deep dive into empathy and connection',
    youtubeId: 'O4tUVqsjQ2I',
  },
];

function LearnFromSourceSection() {
  const handleOpenVideo = async (youtubeId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    try {
      await Linking.openURL(youtubeUrl);
    } catch (error) {
      console.log('Error opening YouTube:', error);
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(350).springify()} className="mt-5">
      <View className="flex-row items-center justify-between px-5 mb-3">
        <View>
          <Text
            style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: 18,
              color: colors.jackal[800],
            }}
          >
            Learn from the Source
          </Text>
          <Text
            style={{
              fontFamily: 'Nunito_400Regular',
              fontSize: 12,
              color: colors.jackal[400],
            }}
          >
            Dr. Marshall Rosenberg on YouTube
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        style={{ flexGrow: 0 }}
      >
        {ROSENBERG_VIDEOS.map((video) => (
          <Pressable
            key={video.id}
            onPress={() => handleOpenVideo(video.youtubeId)}
          >
            <View
              style={{
                width: 200,
                backgroundColor: colors.cream[100],
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              {/* YouTube thumbnail */}
              <View
                style={{
                  height: 110,
                  backgroundColor: colors.jackal[800],
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {/* YouTube play button */}
                <View
                  style={{
                    width: 56,
                    height: 40,
                    borderRadius: 8,
                    backgroundColor: '#FF0000',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Play size={22} color="#FFFFFF" fill="#FFFFFF" />
                </View>
                {/* Duration badge */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.85)',
                    paddingHorizontal: 6,
                    paddingVertical: 3,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Nunito_600SemiBold',
                      fontSize: 11,
                      color: '#FFFFFF',
                    }}
                  >
                    {video.duration}
                  </Text>
                </View>
              </View>
              <View style={{ padding: 12 }}>
                <Text
                  style={{
                    fontFamily: 'Nunito_700Bold',
                    fontSize: 14,
                    color: colors.jackal[800],
                    marginBottom: 2,
                  }}
                  numberOfLines={2}
                >
                  {video.title}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Nunito_500Medium',
                    fontSize: 11,
                    color: colors.jackal[400],
                    marginBottom: 4,
                  }}
                >
                  Marshall Rosenberg • {video.views}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Nunito_400Regular',
                    fontSize: 12,
                    color: colors.jackal[500],
                  }}
                  numberOfLines={1}
                >
                  {video.description}
                </Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Attribution */}
      <View className="px-5 mt-3">
        <Text
          style={{
            fontFamily: 'Nunito_400Regular',
            fontSize: 11,
            color: colors.jackal[400],
            textAlign: 'center',
          }}
        >
          NVC was created by Dr. Marshall Rosenberg (1934-2015)
        </Text>
      </View>
    </Animated.View>
  );
}

function DailyTip() {
  const tips = [
    "Observations are what a camera would see, not interpretations.",
    "Feelings are physical sensations, not thoughts about what others did.",
    "Behind every emotion is a universal human need trying to be met.",
    "Requests give others a clear path to contribute to our wellbeing.",
    "Self-empathy first: connect with your own feelings and needs.",
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <Animated.View entering={FadeInDown.delay(400).springify()} className="mx-5 mt-5 mb-28">
      <View
        style={{
          backgroundColor: colors.sage[50],
          borderRadius: 20,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.sage[100],
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Heart size={20} color={colors.sage[500]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: 14,
              color: colors.sage[700],
              marginBottom: 4,
            }}
          >
            Giraffe Wisdom
          </Text>
          <Text
            style={{
              fontFamily: 'Nunito_500Medium',
              fontSize: 14,
              color: colors.sage[600],
              lineHeight: 20,
            }}
          >
            {randomTip}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const user = useAppStore(s => s.user);

  if (!user) return null;

  const firstName = user.name.split(' ')[0];
  const hasCompletedIntro = user.hasCompletedIntro;

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream[50] }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header - extra top padding for Dynamic Island */}
          <View className="flex-row items-center justify-between px-5 pt-4 pb-5">
            <Animated.View entering={FadeIn.delay(50)}>
              <Text
                style={{
                  fontFamily: 'Nunito_500Medium',
                  fontSize: 14,
                  color: colors.jackal[400],
                }}
              >
                Welcome back,
              </Text>
              <Text
                style={{
                  fontFamily: 'Nunito_800ExtraBold',
                  fontSize: 26,
                  color: colors.jackal[800],
                }}
              >
                {firstName} 🦒
              </Text>
            </Animated.View>

            <Animated.View entering={FadeIn.delay(100)}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/settings');
                }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.cream[200],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Settings size={22} color={colors.jackal[500]} />
              </Pressable>
            </Animated.View>
          </View>

          {/* Show Introduction Progress OR Streak Card */}
          {!hasCompletedIntro ? (
            <IntroProgressCard
              introProgress={user.introProgress}
              hasCompletedIntro={hasCompletedIntro}
              onContinue={() => router.push('/intro-lesson')}
            />
          ) : (
            <StreakCard streak={user.streak} longestStreak={user.longestStreak} />
          )}

          {/* Main CTA - Start Practice (gated if intro not done) */}
          <Animated.View entering={FadeInDown.delay(150).springify()} className="mx-5 mt-5">
            {hasCompletedIntro ? (
              <PrimaryButton
                title="Start Daily Practice"
                onPress={() => router.push('/practice-session')}
                icon={Play}
              />
            ) : (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push('/intro-lesson');
                }}
              >
                <LinearGradient
                  colors={[colors.primary[400], colors.primary[500], colors.primary[600]]}
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
                    Continue Learning
                  </Text>
                  <GraduationCap size={22} color="#FFFFFF" />
                </LinearGradient>
              </Pressable>
            )}
          </Animated.View>

          {/* Quick Actions */}
          <View className="flex-row gap-3 mx-5 mt-4">
            <ActionCard
              title="By Topic"
              subtitle="Choose category"
              icon={Target}
              iconColor={colors.primary[500]}
              onPress={() => router.push('/(tabs)/practice')}
              delay={200}
              disabled={!hasCompletedIntro}
            />
            <ActionCard
              title="Journal"
              subtitle="New entry"
              icon={BookOpen}
              iconColor={colors.sage[500]}
              onPress={() => router.push('/journal-entry')}
              delay={250}
            />
          </View>

          {/* Progress Card */}
          <ProgressCard
            level={user.level}
            xp={user.totalXP}
            completedExercises={user.completedExercises}
          />

          {/* Learn from Dr. Rosenberg */}
          <LearnFromSourceSection />

          {/* Daily Tip */}
          <DailyTip />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
