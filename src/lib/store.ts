import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, JournalEntry, DailyProgress, Badge, ChatMessage, AgeGroup } from './types';
import { signOut, deleteUserAccount } from './supabase';

const DEFAULT_BADGES: Badge[] = [
  { id: 'first-step', name: 'First Step', description: 'Complete your first exercise', icon: '🌱', unlockedAt: null, requirement: 1, type: 'exercises' },
  { id: 'week-warrior', name: 'Week Warrior', description: '7 day streak', icon: '🔥', unlockedAt: null, requirement: 7, type: 'streak' },
  { id: 'empathy-explorer', name: 'Empathy Explorer', description: 'Complete 25 exercises', icon: '🧭', unlockedAt: null, requirement: 25, type: 'exercises' },
  { id: 'feelings-finder', name: 'Feelings Finder', description: 'Reach level 5', icon: '💎', unlockedAt: null, requirement: 5, type: 'level' },
  { id: 'needs-ninja', name: 'Needs Ninja', description: 'Complete 50 exercises', icon: '🥷', unlockedAt: null, requirement: 50, type: 'exercises' },
  { id: 'month-master', name: 'Month Master', description: '30 day streak', icon: '👑', unlockedAt: null, requirement: 30, type: 'streak' },
  { id: 'request-master', name: 'Request Master', description: 'Reach level 10', icon: '🎯', unlockedAt: null, requirement: 10, type: 'level' },
  { id: 'giraffe-guru', name: 'Giraffe Guru', description: 'Complete 100 exercises', icon: '🦒', unlockedAt: null, requirement: 100, type: 'exercises' },
];

interface AppState {
  // Auth state
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  user: User | null;

  // Journal
  journalEntries: JournalEntry[];

  // Chat
  chatMessages: ChatMessage[];

  // Progress
  dailyProgress: DailyProgress[];
  todayExercisesCompleted: number;

  // Actions
  login: (name: string, email: string, ageGroup: AgeGroup) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  completeExercise: () => Promise<void>;
  updateStreak: () => Promise<void>;
  completeIntroLesson: () => Promise<void>;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  loadPersistedState: () => Promise<void>;
  setNotifications: (enabled: boolean, time?: string) => Promise<void>;
}

const STORAGE_KEYS = {
  user: '@giraffe_user',
  onboarding: '@giraffe_onboarding',
  journal: '@giraffe_journal',
  progress: '@giraffe_progress',
};

const calculateLevel = (xp: number): number => {
  // Simple level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const checkBadges = (user: User): Badge[] => {
  const now = new Date().toISOString();
  return user.badges.map(badge => {
    if (badge.unlockedAt) return badge;

    let shouldUnlock = false;
    switch (badge.type) {
      case 'streak':
        shouldUnlock = user.streak >= badge.requirement;
        break;
      case 'exercises':
        shouldUnlock = user.completedExercises >= badge.requirement;
        break;
      case 'level':
        shouldUnlock = user.level >= badge.requirement;
        break;
    }

    if (shouldUnlock) {
      return { ...badge, unlockedAt: now };
    }
    return badge;
  });
};

const isToday = (dateString: string | null): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isYesterday = (dateString: string | null): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return date.toDateString() === yesterday.toDateString();
};

export const useAppStore = create<AppState>((set, get) => ({
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  user: null,
  journalEntries: [],
  chatMessages: [],
  dailyProgress: [],
  todayExercisesCompleted: 0,

  login: async (name: string, email: string, ageGroup: AgeGroup) => {
    // Check if there's existing user data in AsyncStorage (from previous session)
    const existingUserJson = await AsyncStorage.getItem(STORAGE_KEYS.user);

    if (existingUserJson) {
      const existingUser = JSON.parse(existingUserJson) as User;

      // Only restore if it's the SAME user (same email)
      // This prevents restoring old user data for a new signup
      if (existingUser.email === email) {
        // Same user signing back in - restore their progress AND onboarding state
        const updatedUser: User = {
          ...existingUser,
          name, // Update name in case it changed
        };
        // Also restore the onboarding state from AsyncStorage
        const onboardingDone = await AsyncStorage.getItem(STORAGE_KEYS.onboarding);
        const hasCompletedOnboarding = onboardingDone === 'true';

        await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updatedUser));
        set({ isAuthenticated: true, user: updatedUser, hasCompletedOnboarding });
        return;
      }

      // Different user - clear old data and create fresh
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.user,
        STORAGE_KEYS.onboarding,
        STORAGE_KEYS.journal,
        STORAGE_KEYS.progress,
      ]);
      set({ hasCompletedOnboarding: false, journalEntries: [], dailyProgress: [] });
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      ageGroup,
      createdAt: new Date().toISOString(),
      streak: 0,
      longestStreak: 0,
      lastPracticeDate: null,
      totalXP: 0,
      level: 1,
      completedExercises: 0,
      badges: DEFAULT_BADGES,
      notificationsEnabled: true,
      reminderTime: '09:00',
      hasCompletedIntro: false,
      introProgress: 0,
    };

    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(newUser));
    set({ isAuthenticated: true, user: newUser });
  },

  logout: async () => {
    // Only sign out from Supabase - keep local data intact
    // User's journal entries, progress, and streaks remain on device
    try {
      await signOut();
    } catch (error) {
      console.log('Error signing out from Supabase:', error);
    }
    // Only update auth state, don't clear any local data
    set({
      isAuthenticated: false,
    });
  },

  deleteAccount: async () => {
    console.log('[STORE v2] deleteAccount called');
    // First, try to delete the user from Supabase Auth via Edge Function
    const result = await deleteUserAccount();

    if (!result.success) {
      // Return the error so the UI can show it to the user
      // For Apple compliance, we should NOT proceed if the server deletion fails
      console.log('[STORE v2] Delete account failed:', result.error);
      throw new Error(result.error || 'Failed to delete account from server');
    }

    console.log('[STORE v2] Server deletion successful, clearing local data');

    // Clear all local storage - this permanently deletes all user data
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    // Also clear any other potential storage keys
    await AsyncStorage.removeItem('@giraffe_supabase_session');

    set({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      user: null,
      journalEntries: [],
      chatMessages: [],
      dailyProgress: [],
      todayExercisesCompleted: 0,
    });
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.onboarding, 'true');
    set({ hasCompletedOnboarding: true });
  },

  updateUser: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  addXP: async (amount: number) => {
    const { user, updateUser } = get();
    if (!user) return;

    const newXP = user.totalXP + amount;
    const newLevel = calculateLevel(newXP);

    await updateUser({ totalXP: newXP, level: newLevel });
  },

  completeExercise: async () => {
    const { user, updateUser, todayExercisesCompleted } = get();
    if (!user) return;

    const newCompletedExercises = user.completedExercises + 1;
    const updatedBadges = checkBadges({ ...user, completedExercises: newCompletedExercises });

    await updateUser({
      completedExercises: newCompletedExercises,
      badges: updatedBadges,
      lastPracticeDate: new Date().toISOString(),
    });

    set({ todayExercisesCompleted: todayExercisesCompleted + 1 });
  },

  updateStreak: async () => {
    const { user, updateUser } = get();
    if (!user) return;

    const now = new Date().toISOString();

    if (isToday(user.lastPracticeDate)) {
      return; // Already practiced today
    }

    let newStreak: number;
    if (isYesterday(user.lastPracticeDate)) {
      newStreak = user.streak + 1;
    } else {
      newStreak = 1; // Reset streak
    }

    const newLongestStreak = Math.max(newStreak, user.longestStreak);
    const updatedBadges = checkBadges({ ...user, streak: newStreak });

    await updateUser({
      streak: newStreak,
      longestStreak: newLongestStreak,
      lastPracticeDate: now,
      badges: updatedBadges,
    });
  },

  completeIntroLesson: async () => {
    const { user, updateUser } = get();
    if (!user) return;

    const newProgress = user.introProgress + 1;
    const hasCompletedIntro = newProgress >= 4; // 4 intro lessons total

    await updateUser({
      introProgress: newProgress,
      hasCompletedIntro,
    });
  },

  addJournalEntry: async (entry) => {
    const { journalEntries } = get();
    const now = new Date().toISOString();

    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };

    const updatedEntries = [newEntry, ...journalEntries];
    await AsyncStorage.setItem(STORAGE_KEYS.journal, JSON.stringify(updatedEntries));
    set({ journalEntries: updatedEntries });
  },

  updateJournalEntry: async (id: string, updates: Partial<JournalEntry>) => {
    const { journalEntries } = get();
    const updatedEntries = journalEntries.map(entry =>
      entry.id === id
        ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
        : entry
    );

    await AsyncStorage.setItem(STORAGE_KEYS.journal, JSON.stringify(updatedEntries));
    set({ journalEntries: updatedEntries });
  },

  deleteJournalEntry: async (id: string) => {
    const { journalEntries } = get();
    const updatedEntries = journalEntries.filter(entry => entry.id !== id);

    await AsyncStorage.setItem(STORAGE_KEYS.journal, JSON.stringify(updatedEntries));
    set({ journalEntries: updatedEntries });
  },

  addChatMessage: (message) => {
    const { chatMessages } = get();
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    set({ chatMessages: [...chatMessages, newMessage] });
  },

  clearChat: () => {
    set({ chatMessages: [] });
  },

  loadPersistedState: async () => {
    try {
      const [userJson, onboardingDone, journalJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.user),
        AsyncStorage.getItem(STORAGE_KEYS.onboarding),
        AsyncStorage.getItem(STORAGE_KEYS.journal),
      ]);

      const user = userJson ? JSON.parse(userJson) : null;
      const hasCompletedOnboarding = onboardingDone === 'true';
      const journalEntries = journalJson ? JSON.parse(journalJson) : [];

      // Check if we need to reset today's exercises count
      let todayExercisesCompleted = 0;
      if (user && isToday(user.lastPracticeDate)) {
        // We'd need to track this separately, for now just reset
        todayExercisesCompleted = 0;
      }

      set({
        isAuthenticated: !!user,
        hasCompletedOnboarding,
        user,
        journalEntries,
        todayExercisesCompleted,
      });
    } catch (error) {
      console.error('Error loading persisted state:', error);
    }
  },

  setNotifications: async (enabled: boolean, time?: string) => {
    const { user, updateUser } = get();
    if (!user) return;

    await updateUser({
      notificationsEnabled: enabled,
      reminderTime: time || user.reminderTime,
    });
  },
}));
