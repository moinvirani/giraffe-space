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
  if (currentSession) return currentSession;

  const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    currentSession = JSON.parse(stored);
    return currentSession;
  }
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
  const data = await supabaseRequest<AuthResponse>('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      data: { name },
    }),
  });

  if (data.session) {
    await saveSession(data.session);
  }

  return data;
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await supabaseRequest<AuthResponse>('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (data.session) {
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
  const session = await loadSession();
  if (!session?.refresh_token) return null;

  const data = await supabaseRequest<AuthResponse>('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({
      refresh_token: session.refresh_token,
    }),
  });

  if (data.session) {
    await saveSession(data.session);
  }

  return data.session;
}

export async function resetPassword(email: string): Promise<void> {
  await supabaseRequest('/auth/v1/recover', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function getSession(): Promise<Session | null> {
  return loadSession();
}

export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
}
