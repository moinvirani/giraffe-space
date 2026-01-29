import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  X,
  Bell,
  Clock,
  User,
  Mail,
  Trophy,
  Flame,
  LogOut,
  ChevronRight,
  Info,
  Heart,
  Crown,
  Sparkles,
} from 'lucide-react-native';
import { usePremium } from '@/lib/usePremium';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function SettingRow({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  right,
  onPress,
}: {
  icon: typeof Bell;
  iconColor: string;
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View
        className="flex-row items-center py-4 px-4 mb-2 rounded-2xl"
        style={{ backgroundColor: colors.cream[100] }}
      >
        <View
          className="w-10 h-10 rounded-xl items-center justify-center mr-3"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon size={20} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text
            className="text-base"
            style={{
              fontFamily: 'Nunito_600SemiBold',
              color: colors.jackal[700],
            }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className="text-sm"
              style={{
                fontFamily: 'Nunito_400Regular',
                color: colors.jackal[400],
              }}
            >
              {subtitle}
            </Text>
          )}
        </View>
        {right}
      </View>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAppStore(s => s.user);
  const setNotifications = useAppStore(s => s.setNotifications);
  const logout = useAppStore(s => s.logout);
  const { isPremium, isLoading: isPremiumLoading } = usePremium();

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.notificationsEnabled ?? true
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(() => {
    const [hours, minutes] = (user?.reminderTime ?? '09:00').split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    return date;
  });

  const requestNotificationPermission = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  };

  const scheduleNotification = async (time: Date) => {
    // Cancel existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();

    if (!notificationsEnabled) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time for Giraffe Practice! 🦒",
        body: "Take 5 minutes to grow your compassionate communication skills.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: time.getHours(),
        minute: time.getMinutes(),
      },
    });
  };

  const handleNotificationToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          'Notifications Disabled',
          'Please enable notifications in your device settings to receive daily reminders.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationsEnabled(value);
    await setNotifications(value);

    if (value) {
      await scheduleNotification(reminderTime);
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const handleTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');

    if (selectedDate) {
      setReminderTime(selectedDate);
      const timeString = `${selectedDate.getHours().toString().padStart(2, '0')}:${selectedDate.getMinutes().toString().padStart(2, '0')}`;
      await setNotifications(notificationsEnabled, timeString);

      if (notificationsEnabled) {
        await scheduleNotification(selectedDate);
      }
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await logout();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!user) return null;

  return (
    <View className="flex-1" style={{ backgroundColor: colors.cream[50], paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <View className="flex-1">
        {/* Header - extra top padding for Dynamic Island */}
        <View className="flex-row items-center justify-between px-5 pt-3 pb-3">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.cream[200] }}
          >
            <X size={22} color={colors.jackal[500]} />
          </Pressable>

          <Text
            className="text-lg"
            style={{
              fontFamily: 'Nunito_700Bold',
              color: colors.jackal[800],
            }}
          >
            Settings
          </Text>

          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Profile Section */}
          <Animated.View entering={FadeInDown.delay(100).springify()}>
            <View
              className="rounded-3xl p-5 mb-6 items-center"
              style={{ backgroundColor: colors.cream[100] }}
            >
              <View
                className="w-20 h-20 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: colors.primary[100] }}
              >
                <Text className="text-4xl">🦒</Text>
              </View>

              <Text
                className="text-xl mb-1"
                style={{
                  fontFamily: 'Nunito_700Bold',
                  color: colors.jackal[800],
                }}
              >
                {user.name}
              </Text>

              <Text
                className="text-sm mb-4"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.jackal[400],
                }}
              >
                {user.email}
              </Text>

              {/* Stats */}
              <View className="flex-row gap-6">
                <View className="items-center">
                  <View className="flex-row items-center gap-1">
                    <Flame size={16} color={colors.coral[500]} />
                    <Text
                      className="text-lg"
                      style={{
                        fontFamily: 'Nunito_700Bold',
                        color: colors.jackal[700],
                      }}
                    >
                      {user.streak}
                    </Text>
                  </View>
                  <Text
                    className="text-xs"
                    style={{
                      fontFamily: 'Nunito_500Medium',
                      color: colors.jackal[400],
                    }}
                  >
                    Day Streak
                  </Text>
                </View>

                <View className="items-center">
                  <View className="flex-row items-center gap-1">
                    <Trophy size={16} color={colors.primary[500]} />
                    <Text
                      className="text-lg"
                      style={{
                        fontFamily: 'Nunito_700Bold',
                        color: colors.jackal[700],
                      }}
                    >
                      {user.level}
                    </Text>
                  </View>
                  <Text
                    className="text-xs"
                    style={{
                      fontFamily: 'Nunito_500Medium',
                      color: colors.jackal[400],
                    }}
                  >
                    Level
                  </Text>
                </View>

                <View className="items-center">
                  <View className="flex-row items-center gap-1">
                    <Heart size={16} color={colors.sage[500]} />
                    <Text
                      className="text-lg"
                      style={{
                        fontFamily: 'Nunito_700Bold',
                        color: colors.jackal[700],
                      }}
                    >
                      {user.completedExercises}
                    </Text>
                  </View>
                  <Text
                    className="text-xs"
                    style={{
                      fontFamily: 'Nunito_500Medium',
                      color: colors.jackal[400],
                    }}
                  >
                    Exercises
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Subscription Section */}
          <Animated.View entering={FadeInDown.delay(150).springify()}>
            <Text
              className="text-sm uppercase tracking-wide mb-3 ml-1"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[400],
              }}
            >
              Subscription
            </Text>

            {isPremium ? (
              <View
                className="rounded-2xl p-4 mb-6"
                style={{ backgroundColor: colors.primary[50] }}
              >
                <View className="flex-row items-center">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: colors.primary[100] }}
                  >
                    <Crown size={24} color={colors.primary[500]} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text
                        className="text-lg mr-2"
                        style={{
                          fontFamily: 'Nunito_700Bold',
                          color: colors.primary[600],
                        }}
                      >
                        Premium Active
                      </Text>
                      <Sparkles size={16} color={colors.primary[500]} />
                    </View>
                    <Text
                      className="text-sm"
                      style={{
                        fontFamily: 'Nunito_500Medium',
                        color: colors.jackal[500],
                      }}
                    >
                      All features unlocked
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push('/paywall');
                }}
              >
                <View
                  className="rounded-2xl p-4 mb-6 flex-row items-center"
                  style={{
                    backgroundColor: colors.cream[100],
                    borderWidth: 2,
                    borderColor: colors.primary[300],
                    borderStyle: 'dashed',
                  }}
                >
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: colors.primary[100] }}
                  >
                    <Crown size={24} color={colors.primary[500]} />
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-base"
                      style={{
                        fontFamily: 'Nunito_700Bold',
                        color: colors.jackal[700],
                      }}
                    >
                      Upgrade to Premium
                    </Text>
                    <Text
                      className="text-sm"
                      style={{
                        fontFamily: 'Nunito_500Medium',
                        color: colors.jackal[500],
                      }}
                    >
                      Unlock unlimited features
                    </Text>
                  </View>
                  <ChevronRight size={20} color={colors.primary[500]} />
                </View>
              </Pressable>
            )}
          </Animated.View>

          {/* Notifications Section */}
          <Animated.View entering={FadeInDown.delay(200).springify()}>
            <Text
              className="text-sm uppercase tracking-wide mb-3 ml-1"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[400],
              }}
            >
              Notifications
            </Text>

            <SettingRow
              icon={Bell}
              iconColor={colors.primary[500]}
              title="Daily Reminders"
              subtitle="Get a gentle nudge to practice"
              right={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationToggle}
                  trackColor={{ false: colors.cream[300], true: colors.primary[400] }}
                  thumbColor="#FFFFFF"
                />
              }
            />

            {notificationsEnabled && (
              <SettingRow
                icon={Clock}
                iconColor={colors.sage[500]}
                title="Reminder Time"
                subtitle={formatTime(reminderTime)}
                onPress={() => setShowTimePicker(true)}
                right={<ChevronRight size={20} color={colors.jackal[300]} />}
              />
            )}

            {showTimePicker && (
              <View
                className="rounded-2xl p-4 mb-2"
                style={{ backgroundColor: colors.cream[100] }}
              >
                <DateTimePicker
                  value={reminderTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  textColor={colors.jackal[700]}
                />
                {Platform.OS === 'ios' && (
                  <Pressable
                    onPress={() => setShowTimePicker(false)}
                    className="mt-2 py-2"
                  >
                    <Text
                      className="text-center text-base"
                      style={{
                        fontFamily: 'Nunito_600SemiBold',
                        color: colors.primary[500],
                      }}
                    >
                      Done
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </Animated.View>

          {/* About Section */}
          <Animated.View entering={FadeInDown.delay(300).springify()} className="mt-4">
            <Text
              className="text-sm uppercase tracking-wide mb-3 ml-1"
              style={{
                fontFamily: 'Nunito_700Bold',
                color: colors.jackal[400],
              }}
            >
              About
            </Text>

            <SettingRow
              icon={Info}
              iconColor={colors.jackal[400]}
              title="About Giraffe"
              subtitle="Version 1.0.0"
              right={<ChevronRight size={20} color={colors.jackal[300]} />}
            />

            <SettingRow
              icon={Heart}
              iconColor={colors.sage[500]}
              title="Privacy Policy"
              subtitle="How we protect your data"
              right={<ChevronRight size={20} color={colors.jackal[300]} />}
              onPress={() => router.push('/privacy')}
            />

            <View
              className="rounded-2xl p-4 mt-2"
              style={{ backgroundColor: colors.sage[50] }}
            >
              <Text
                className="text-sm leading-5"
                style={{
                  fontFamily: 'Nunito_500Medium',
                  color: colors.sage[600],
                }}
              >
                Giraffe is inspired by Marshall Rosenberg's Nonviolent Communication.
                The giraffe symbolizes compassion — with its long neck for perspective
                and the largest heart of any land animal. 🦒💚
              </Text>
            </View>
          </Animated.View>

          {/* Sign Out */}
          <Animated.View entering={FadeInDown.delay(400).springify()} className="mt-6">
            <Pressable onPress={handleLogout}>
              <View
                className="flex-row items-center justify-center py-4 px-4 rounded-2xl"
                style={{ backgroundColor: colors.coral[50] }}
              >
                <LogOut size={20} color={colors.coral[500]} />
                <Text
                  className="text-base ml-2"
                  style={{
                    fontFamily: 'Nunito_600SemiBold',
                    color: colors.coral[500],
                  }}
                >
                  Sign Out
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </View>
    </View>
  );
}
