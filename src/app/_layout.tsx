import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/lib/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useCallback, useEffect, useState, useRef } from 'react';
import { View, Linking } from 'react-native';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import {
  Quicksand_400Regular,
  Quicksand_500Medium,
  Quicksand_600SemiBold,
  Quicksand_700Bold,
} from '@expo-google-fonts/quicksand';
import { useAppStore } from '@/lib/store';
import { colors } from '@/lib/colors';

export const unstable_settings = {
  initialRouteName: 'index',
};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Custom theme based on our savanna palette
const GiraffeLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[500],
    background: colors.cream[50],
    card: colors.cream[100],
    text: colors.jackal[800],
    border: colors.cream[300],
    notification: colors.coral[500],
  },
};

const GiraffeDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary[400],
    background: colors.jackal[900],
    card: colors.jackal[800],
    text: colors.cream[100],
    border: colors.jackal[700],
    notification: colors.coral[400],
  },
};

function RootLayoutNav({ colorScheme }: { colorScheme: 'light' | 'dark' | null | undefined }) {
  return (
    <ThemeProvider value={colorScheme === 'dark' ? GiraffeDark : GiraffeLight}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="practice-session"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="journal-entry"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="intro-lesson"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="paywall"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="nvc-vocabulary"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="intake"
          options={{
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="privacy"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="terms"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="reset-password"
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}

// Parse tokens from a deep link URL (Supabase puts them in the fragment)
function parseDeepLinkTokens(url: string): { access_token?: string; refresh_token?: string; type?: string } | null {
  try {
    // Supabase appends tokens as fragment: vibecode://reset-password#access_token=...&refresh_token=...
    const hashIndex = url.indexOf('#');
    if (hashIndex === -1) return null;

    const fragment = url.substring(hashIndex + 1);
    const params = new URLSearchParams(fragment);
    const access_token = params.get('access_token') ?? undefined;
    const refresh_token = params.get('refresh_token') ?? undefined;
    const type = params.get('type') ?? undefined;

    if (access_token) {
      return { access_token, refresh_token, type };
    }

    // Also check query params as fallback (some Supabase versions use ? instead of #)
    const queryIndex = url.indexOf('?');
    if (queryIndex === -1) return null;

    const queryParams = new URLSearchParams(url.substring(queryIndex + 1));
    const qAccessToken = queryParams.get('access_token') ?? undefined;
    const qRefreshToken = queryParams.get('refresh_token') ?? undefined;
    const qType = queryParams.get('type') ?? undefined;

    if (qAccessToken) {
      return { access_token: qAccessToken, refresh_token: qRefreshToken, type: qType };
    }

    return null;
  } catch {
    return null;
  }
}

function DeepLinkHandler() {
  const router = useRouter();
  const handledRef = useRef(false);

  const handleDeepLink = useCallback((url: string) => {
    console.log('[DEEP LINK] Received URL:', url);

    // Check if this is a reset-password deep link
    if (!url.includes('reset-password')) return;

    const tokens = parseDeepLinkTokens(url);
    if (tokens?.access_token) {
      console.log('[DEEP LINK] Found recovery tokens, navigating to reset-password');
      // Small delay to ensure navigation is ready
      setTimeout(() => {
        router.push({
          pathname: '/reset-password',
          params: {
            access_token: tokens.access_token!,
            refresh_token: tokens.refresh_token ?? '',
          },
        });
      }, 100);
    } else {
      console.log('[DEEP LINK] No tokens found in URL');
    }
  }, [router]);

  useEffect(() => {
    // Handle URL that opened the app (cold start)
    const checkInitialUrl = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl && !handledRef.current) {
          console.log('[DEEP LINK] Initial URL:', initialUrl);
          handledRef.current = true;
          handleDeepLink(initialUrl);
        }
      } catch (e) {
        console.log('[DEEP LINK] Error getting initial URL:', e);
      }
    };
    checkInitialUrl();

    // Handle URL when app is already open (warm start)
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    return () => {
      subscription.remove();
    };
  }, [handleDeepLink]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loadPersistedState = useAppStore(s => s.loadPersistedState);
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Quicksand_400Regular,
    Quicksand_500Medium,
    Quicksand_600SemiBold,
    Quicksand_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      try {
        await loadPersistedState();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, [loadPersistedState]);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <KeyboardProvider>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <RootLayoutNav colorScheme={colorScheme} />
          <DeepLinkHandler />
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
