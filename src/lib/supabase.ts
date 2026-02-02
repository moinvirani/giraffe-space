import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const AUTH_STORAGE_KEY = '@giraffe_supabase_session';

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: SupabaseUser;
}

interface SupabaseUser {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
  };
  created_at: string;
}

interface AuthResponse {
  user: SupabaseUser | null;
  session: Session | null;
}

// Store session in memory and AsyncStorage
let currentSession: Session | null = null;

async function saveSession(session: Session | null) {
  currentSession = session;
  if (session) {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  } else {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

async function loadSession(): Promise<Session | null> {
  if (currentSession) {
    console.log('[SESSION] Returning cached session for user:', currentSession.user?.id);
    return currentSession;
  }

  const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    currentSession = JSON.parse(stored);
    console.log('[SESSION] Loaded session from storage for user:', currentSession?.user?.id);
    return currentSession;
  }
  console.log('[SESSION] No session found in storage');
  return null;
}

async function supabaseRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${SUPABASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_ANON_KEY,
    ...(options.headers as Record<string, string> || {}),
  };

  const session = await loadSession();
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.msg || data.message || 'Request failed');
  }

  return data;
}

// Auth functions
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> {
  const data = await supabaseRequest<any>('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      data: { name },
    }),
  });

  console.log('[SIGN UP] Response keys:', Object.keys(data));

  // Supabase signup returns access_token directly when email confirmation is disabled
  if (data.access_token) {
    const session: Session = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      user: data.user,
    };
    console.log('[SIGN UP] Saving session for user:', data.user?.id);
    await saveSession(session);
    return { user: data.user, session };
  }

  // Fallback for wrapped response
  if (data.session) {
    console.log('[SIGN UP] Saving wrapped session');
    await saveSession(data.session);
  }

  return data;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await supabaseRequest<any>('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });

  console.log('[SIGN IN] Response keys:', Object.keys(data));

  // Supabase token endpoint returns the session data directly (access_token, refresh_token, user)
  // not wrapped in a session object
  if (data.access_token) {
    const session: Session = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
      user: data.user,
    };
    console.log('[SIGN IN] Saving session for user:', data.user?.id);
    await saveSession(session);
    return { user: data.user, session };
  }

  // Fallback for wrapped response (shouldn't happen but just in case)
  if (data.session) {
    console.log('[SIGN IN] Saving wrapped session');
    await saveSession(data.session);
  }

  return data;
}

export async function signOut(): Promise<void> {
  const session = await loadSession();

  if (session?.access_token) {
    try {
      await supabaseRequest('/auth/v1/logout', {
        method: 'POST',
      });
    } catch {
      // Ignore logout errors
    }
  }

  await saveSession(null);
}

export async function getCurrentUser(): Promise<SupabaseUser | null> {
  const session = await loadSession();
  if (!session) return null;

  // Check if session is expired
  if (session.expires_at && Date.now() / 1000 > session.expires_at) {
    // Try to refresh
    try {
      await refreshSession();
      const newSession = await loadSession();
      return newSession?.user || null;
    } catch {
      await saveSession(null);
      return null;
    }
  }

  return session.user;
}

export async function refreshSession(): Promise<Session | null> {
  console.log('[REFRESH v2] Starting refresh');

  // Get refresh token from storage (not cache)
  const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) {
    console.log('[REFRESH v2] No stored session');
    return null;
  }

  const storedSession: Session = JSON.parse(stored);
  if (!storedSession?.refresh_token) {
    console.log('[REFRESH v2] No refresh token in stored session');
    return null;
  }

  console.log('[REFRESH v2] Calling Supabase token endpoint');

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        refresh_token: storedSession.refresh_token,
      }),
    });

    console.log('[REFRESH v2] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log('[REFRESH v2] Error:', JSON.stringify(errorData));
      return null;
    }

    const data = await response.json();
    console.log('[REFRESH v2] Got response with keys:', Object.keys(data));

    // Supabase returns access_token directly
    if (data.access_token) {
      const newSession: Session = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        user: data.user,
      };
      console.log('[REFRESH v2] Saving new session for user:', data.user?.id);
      await saveSession(newSession);
      return newSession;
    }

    console.log('[REFRESH v2] No access_token in response');
    return null;
  } catch (error) {
    console.log('[REFRESH v2] Exception:', error instanceof Error ? error.message : error);
    return null;
  }
}

export async function resetPassword(email: string): Promise<void> {
  // Use the app's bundle ID based URL scheme for deep linking
  // This works for both TestFlight and App Store builds
  // Format: com.vibecode.giraffespace.3zxdgq://reset-password
  const redirectTo = 'com.vibecode.giraffespace.3zxdgq://reset-password';

  await supabaseRequest('/auth/v1/recover', {
    method: 'POST',
    body: JSON.stringify({
      email,
      redirect_to: redirectTo,
    }),
  });
}

export async function deleteUserAccount(): Promise<{ success: boolean; error?: string }> {
  console.log('[DELETE USER v3] Starting account deletion flow');
  console.log('[DELETE USER v3] SUPABASE_URL:', SUPABASE_URL);

  // Clear in-memory cache to force fresh load from AsyncStorage
  currentSession = null;

  let session = await loadSession();

  if (!session?.access_token || !session?.refresh_token) {
    console.log('[DELETE USER v3] No session or missing tokens');
    return { success: false, error: 'No active session. Please sign out and sign in again.' };
  }

  console.log('[DELETE USER v3] Current user:', session.user?.id);
  console.log('[DELETE USER v3] Refreshing token (required)...');

  // Clear cache again and refresh - REQUIRED for deletion
  currentSession = null;

  try {
    const refreshedSession = await refreshSession();
    if (!refreshedSession?.access_token) {
      console.log('[DELETE USER v3] Refresh failed - no new token');
      return {
        success: false,
        error: 'Session expired. Please sign out, sign back in, then try again.'
      };
    }
    session = refreshedSession;
    console.log('[DELETE USER v3] Token refreshed successfully');
    console.log('[DELETE USER v3] Token prefix:', session.access_token.substring(0, 20) + '...');
  } catch (refreshError) {
    console.log('[DELETE USER v3] Refresh error:', refreshError);
    return {
      success: false,
      error: 'Could not refresh session. Please sign out, sign back in, then try again.'
    };
  }

  // Build the URL for the Edge Function
  const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/delete-user`;
  console.log('[DELETE USER v3] Edge Function URL:', edgeFunctionUrl);

  try {
    // Try calling with NO JWT verification (--no-verify-jwt flag in Edge Function)
    // This bypasses the gateway JWT check
    const response = await fetch(edgeFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        user_id: session.user?.id,
      }),
    });

    console.log('[DELETE USER v3] Response status:', response.status);
    console.log('[DELETE USER v3] Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

    const responseText = await response.text();
    console.log('[DELETE USER v3] Raw response:', responseText);

    let data: any = {};
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { raw: responseText };
    }

    if (!response.ok) {
      const errorMessage = data.error || data.message || `Failed with status ${response.status}`;
      console.log('[DELETE USER v3] Error:', errorMessage);
      return { success: false, error: errorMessage };
    }

    console.log('[DELETE USER v3] Successfully deleted user from Supabase');

    // Clear local session after successful deletion
    await saveSession(null);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    console.log('[DELETE USER v3] Exception:', errorMessage);
    return { success: false, error: errorMessage };
  }
}

export async function getSession(): Promise<Session | null> {
  return loadSession();
}

export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
}
