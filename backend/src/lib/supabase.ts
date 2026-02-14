// Supabase client for backend analytics
// Uses service role key for admin access to user_profiles table

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;

interface SupabaseResponse<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

async function supabaseRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<SupabaseResponse<T>> {
  const url = `${SUPABASE_URL}/rest/v1${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Prefer': 'return=representation',
    ...(options.headers as Record<string, string> || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const text = await response.text();
    let data: T | null = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        // Not JSON
      }
    }

    if (!response.ok) {
      const errorData = data as any;
      return {
        data: null,
        error: {
          message: errorData?.message || errorData?.error || `Request failed with status ${response.status}`,
          code: errorData?.code,
        },
      };
    }

    return { data, error: null };
  } catch (err) {
    return {
      data: null,
      error: { message: err instanceof Error ? err.message : 'Network error' },
    };
  }
}

export interface UserProfile {
  id?: string;
  email: string;
  name?: string;
  gender?: string;
  age_range?: string;
  goals?: string; // JSON array
  total_xp?: number;
  level?: number;
  completed_exercises?: number;
  streak?: number;
  longest_streak?: number;
  created_at?: string;
  updated_at?: string;
  last_active_at?: string;
}

// Upsert user profile (insert or update)
export async function upsertUserProfile(profile: UserProfile): Promise<SupabaseResponse<UserProfile[]>> {
  const now = new Date().toISOString();

  const data = {
    email: profile.email,
    name: profile.name || null,
    gender: profile.gender || null,
    age_range: profile.age_range || null,
    goals: profile.goals || null,
    total_xp: profile.total_xp ?? 0,
    level: profile.level ?? 1,
    completed_exercises: profile.completed_exercises ?? 0,
    streak: profile.streak ?? 0,
    longest_streak: profile.longest_streak ?? 0,
    updated_at: now,
    last_active_at: now,
  };

  // Use upsert with on_conflict
  return supabaseRequest<UserProfile[]>('/user_profiles?on_conflict=email', {
    method: 'POST',
    headers: {
      'Prefer': 'resolution=merge-duplicates,return=representation',
    },
    body: JSON.stringify(data),
  });
}

// Get all user profiles
export async function getAllUserProfiles(): Promise<SupabaseResponse<UserProfile[]>> {
  return supabaseRequest<UserProfile[]>('/user_profiles?order=created_at.desc');
}

// Get user profile by email
export async function getUserProfileByEmail(email: string): Promise<SupabaseResponse<UserProfile[]>> {
  return supabaseRequest<UserProfile[]>(`/user_profiles?email=eq.${encodeURIComponent(email)}`);
}

// Get analytics summary
export async function getAnalyticsSummary(): Promise<{
  totalUsers: number;
  genderDistribution: Record<string, number>;
  ageDistribution: Record<string, number>;
  topGoals: Array<{ goal: string; count: number }>;
  averageXP: number;
  averageLevel: number;
  averageStreak: number;
  activeUsersLast7Days: number;
}> {
  const { data: profiles, error } = await getAllUserProfiles();

  if (error || !profiles) {
    return {
      totalUsers: 0,
      genderDistribution: {},
      ageDistribution: {},
      topGoals: [],
      averageXP: 0,
      averageLevel: 0,
      averageStreak: 0,
      activeUsersLast7Days: 0,
    };
  }

  const genderDistribution: Record<string, number> = {};
  const ageDistribution: Record<string, number> = {};
  const goalCounts: Record<string, number> = {};
  let totalXP = 0;
  let totalLevel = 0;
  let totalStreak = 0;
  let activeUsersLast7Days = 0;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  for (const profile of profiles) {
    // Gender distribution
    if (profile.gender) {
      genderDistribution[profile.gender] = (genderDistribution[profile.gender] || 0) + 1;
    }

    // Age distribution
    if (profile.age_range) {
      ageDistribution[profile.age_range] = (ageDistribution[profile.age_range] || 0) + 1;
    }

    // Goals
    if (profile.goals) {
      try {
        const goals = JSON.parse(profile.goals) as string[];
        for (const goal of goals) {
          goalCounts[goal] = (goalCounts[goal] || 0) + 1;
        }
      } catch {
        // Invalid JSON
      }
    }

    // Totals
    totalXP += profile.total_xp || 0;
    totalLevel += profile.level || 1;
    totalStreak += profile.streak || 0;

    // Active in last 7 days
    if (profile.last_active_at) {
      const lastActive = new Date(profile.last_active_at);
      if (lastActive >= sevenDaysAgo) {
        activeUsersLast7Days++;
      }
    }
  }

  const totalUsers = profiles.length;
  const topGoals = Object.entries(goalCounts)
    .map(([goal, count]) => ({ goal, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalUsers,
    genderDistribution,
    ageDistribution,
    topGoals,
    averageXP: totalUsers > 0 ? Math.round(totalXP / totalUsers) : 0,
    averageLevel: totalUsers > 0 ? Math.round((totalLevel / totalUsers) * 10) / 10 : 0,
    averageStreak: totalUsers > 0 ? Math.round((totalStreak / totalUsers) * 10) / 10 : 0,
    activeUsersLast7Days,
  };
}

export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_SERVICE_KEY && SUPABASE_SERVICE_KEY !== 'your_service_role_key_here';
}
