// Syncs user-provided profile data to Supabase `user_profiles` for analytics.
// Runs as the signed-in user; RLS only lets them write the row for their own
// email. App Store compliant - only syncs user-provided data.
import { getSession } from '../supabase';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

interface SyncProfileData {
  email: string;
  name?: string;
  gender?: string;
  ageRange?: string;
  goals?: string[];
  totalXP?: number;
  level?: number;
  completedExercises?: number;
  streak?: number;
  longestStreak?: number;
}

export async function syncUserProfile(data: SyncProfileData): Promise<boolean> {
  const session = await getSession();
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !session?.access_token) {
    console.log('[API] Not signed in or Supabase not configured, skipping sync');
    return false;
  }

  const now = new Date().toISOString();
  // Only send fields we have, so a partial sync never blanks out earlier answers.
  const row: Record<string, unknown> = {
    // The auth email, not the typed one, so it matches the RLS check exactly.
    email: session.user?.email ?? data.email,
    updated_at: now,
    last_active_at: now,
  };
  if (data.name !== undefined) row.name = data.name;
  if (data.gender !== undefined) row.gender = data.gender;
  if (data.ageRange !== undefined) row.age_range = data.ageRange;
  if (data.goals !== undefined) row.goals = JSON.stringify(data.goals);
  if (data.totalXP !== undefined) row.total_xp = data.totalXP;
  if (data.level !== undefined) row.level = data.level;
  if (data.completedExercises !== undefined) row.completed_exercises = data.completedExercises;
  if (data.streak !== undefined) row.streak = data.streak;
  if (data.longestStreak !== undefined) row.longest_streak = data.longestStreak;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?on_conflict=email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${session.access_token}`,
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(row),
    });

    if (!response.ok) {
      console.error('[API] Failed to sync profile:', response.status);
      return false;
    }

    console.log('[API] Profile synced successfully');
    return true;
  } catch (error) {
    console.error('[API] Error syncing profile:', error);
    return false;
  }
}
