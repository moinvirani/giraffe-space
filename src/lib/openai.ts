// Gigi NVC assistant client. Chat goes through the `gigi-chat` Supabase Edge
// Function, which holds the OpenAI key, builds the system prompt and enforces
// the free daily message limit. See supabase/functions/gigi-chat.

import { UserProfile } from './types';
import { getSession, refreshSession } from './supabase';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export type GigiResult =
  | { kind: 'reply'; text: string; remaining: number | null }
  | { kind: 'limit'; limit: number };

export interface GigiStatus {
  premium: boolean;
  limit: number | null;
  remaining: number | null;
}

async function accessToken(forceRefresh = false): Promise<string | null> {
  let session = await getSession();
  const expiresSoon = !!session?.expires_at && Date.now() / 1000 > session.expires_at - 30;
  if (forceRefresh || expiresSoon) {
    session = await refreshSession();
  }
  return session?.access_token ?? null;
}

async function callGigi(body: object): Promise<Response | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  const post = (token: string) =>
    fetch(`${SUPABASE_URL}/functions/v1/gigi-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body),
    });

  const token = await accessToken();
  if (!token) return null;
  let response = await post(token);
  if (response.status === 401) {
    const fresh = await accessToken(true);
    if (fresh) response = await post(fresh);
  }
  return response;
}

// How many free messages are left today. Null when unknown (offline, signed out).
export async function getGigiStatus(): Promise<GigiStatus | null> {
  try {
    const response = await callGigi({ action: 'status' });
    if (!response?.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function sendMessageToGigi(
  messages: ChatMessage[],
  userMessage: string,
  userProfile?: UserProfile,
  userName?: string
): Promise<GigiResult> {
  const fallback: GigiResult = { kind: 'reply', text: getFallbackResponse(userMessage), remaining: null };

  try {
    const response = await callGigi({
      messages: messages.slice(-10).map(msg => ({ role: msg.role, content: msg.content })),
      userMessage,
      profile: userProfile
        ? { primaryFocus: userProfile.primaryFocus, challenges: userProfile.challenges }
        : undefined,
      userName,
    });

    if (!response) {
      console.log('Gigi unavailable: not signed in or Supabase not configured');
      return fallback;
    }

    if (response.status === 429) {
      const data = await response.json().catch(() => ({}));
      return { kind: 'limit', limit: typeof data.limit === 'number' ? data.limit : 10 };
    }

    if (!response.ok) {
      console.error('Gigi error:', response.status);
      return fallback;
    }

    const data = await response.json();
    const text = typeof data.reply === 'string' ? data.reply : '';
    if (!text) return fallback;

    return { kind: 'reply', text, remaining: typeof data.remaining === 'number' ? data.remaining : null };
  } catch (error) {
    console.error('Error calling Gigi:', error);
    return fallback;
  }
}

// Fallback responses when API is not available
function getFallbackResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Check for faux feelings first and guide toward real feelings
  const fauxFeelings = ['ignored', 'betrayed', 'abandoned', 'rejected', 'attacked', 'manipulated', 'used', 'disrespected', 'unappreciated', 'misunderstood', 'left out', 'taken for granted'];
  const foundFaux = fauxFeelings.find(f => lowerMessage.includes(f));

  if (foundFaux) {
    return `I hear that something painful happened. When you say "${foundFaux}," that's actually describing what you think someone did to you - it's a thought, not a feeling.

What's the **actual feeling** underneath? Perhaps:
- **Hurt** or **sad** - if there's a sense of loss
- **Scared** or **anxious** - if there's uncertainty
- **Angry** or **frustrated** - if something feels unfair

And what **need** isn't being met? Maybe connection, respect, trust, or understanding?

What happened specifically?`;
  }

  if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('furious')) {
    return `Anger is telling you something important - there's a judgment AND an unmet need underneath.

Let's slow down:
1. **What happened?** (Just the facts, like a camera would see)
2. **What "should" are you thinking?** (The judgment)
3. **What need is behind that?** Perhaps respect, fairness, or consideration?

When we find the need, we can express it in a way that's more likely to be heard. What triggered this anger?`;
  }

  if (lowerMessage.includes('sad') || lowerMessage.includes('lonely') || lowerMessage.includes('depressed')) {
    return `It sounds like you're carrying something heavy right now. Sadness often signals unmet needs that really matter to us.

Some needs that might be connected:
- **Connection** - closeness with others
- **Understanding** - being truly seen
- **Support** - having someone alongside you
- **Meaning** - feeling life has purpose

Which of these resonates? Or is there another need that feels more true for you?`;
  }

  if (lowerMessage.includes('frustrated') || lowerMessage.includes('annoyed')) {
    return `Frustration often shows up when something we value keeps not happening.

Let's explore:
- **What specifically happened?** (The observation)
- **Beyond frustrated, what else do you feel?** Maybe disappointed, discouraged, or impatient?
- **What need isn't being met?** Perhaps efficiency, cooperation, or respect for your time?

What's the situation?`;
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('rephrase') || lowerMessage.includes('translate')) {
    return `I'd love to help you put this into giraffe language!

Let's gather the four pieces:
1. **Observation** - What happened? (Just facts, no judgments)
2. **Feeling** - How do you genuinely feel? (Not "ignored" or "betrayed" - those are thoughts)
3. **Need** - What matters to you that isn't being met?
4. **Request** - What specific action would you like? (With room for "no")

Share the situation and what you want to say.`;
  }

  // Check for words indicating they want to share a situation
  if (lowerMessage.includes('my') || lowerMessage.includes('they') || lowerMessage.includes('he ') || lowerMessage.includes('she ') || lowerMessage.length > 50) {
    return `Thank you for sharing that with me.

Let me make sure I understand - what specifically happened? Try to describe just what you observed, like a neutral camera would capture, without interpretations.

Then we can explore what feelings and needs are alive in you.`;
  }

  return `I'm here to help you connect with your feelings and needs, and communicate in ways that are more likely to be heard.

You can:
- Share a difficult situation you're navigating
- Ask me to help translate "jackal" language into "giraffe" language
- Explore what feelings and needs are present for you

What would be most helpful right now?`;
}
