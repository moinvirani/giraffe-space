// API client for syncing user data with backend
const BACKEND_URL = process.env.EXPO_PUBLIC_VIBECODE_BACKEND_URL || process.env.EXPO_PUBLIC_BACKEND_URL;

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

/**
 * Sync user profile to backend for analytics
 * This is App Store compliant - only syncs user-provided data
 */
export async function syncUserProfile(data: SyncProfileData): Promise<boolean> {
  if (!BACKEND_URL) {
    console.log('[API] No backend URL configured, skipping sync');
    return false;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/profile/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error('[API] Failed to sync profile:', response.status);
      return false;
    }

    const result = await response.json();
    console.log('[API] Profile synced successfully');
    return result.success === true;
  } catch (error) {
    console.error('[API] Error syncing profile:', error);
    return false;
  }
}
