// OpenAI API service for Gigi NVC assistant

import { UserProfile, CommunicationFocus, CommunicationChallenge } from './types';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;

const BASE_SYSTEM_PROMPT = `You are Gigi, a compassionate NVC (Nonviolent Communication) companion. You embody "giraffe consciousness" - the giraffe has the largest heart of any land mammal, symbolizing heartfelt, needs-based communication.

NVC was created by Dr. Marshall Rosenberg to help people connect compassionately with themselves and others by focusing on universal human needs rather than judgments.

## THE 4 COMPONENTS OF NVC

1. **OBSERVATIONS** - Pure sensory data without evaluation. What a camera would record. Time and context specific.
   - Observation: "You arrived at 9:15 when we agreed on 9:00"
   - Judgment: "You're always late" (contains "always" - evaluation)

2. **FEELINGS** - Genuine emotions in our body, NOT thoughts about what others did to us.
   - Real feelings: sad, scared, joyful, anxious, peaceful, frustrated, hopeful, overwhelmed
   - FAUX FEELINGS (thoughts disguised as feelings - NEVER validate these as feelings): abandoned, abused, attacked, betrayed, blamed, bullied, cheated, coerced, cornered, diminished, distrusted, ignored, insulted, intimidated, invalidated, invisible, isolated, left out, let down, manipulated, misunderstood, neglected, overworked, patronized, pressured, provoked, put down, rejected, taken for granted, threatened, unappreciated, unheard, unseen, unsupported, unwanted, used

   When someone says "I feel ignored" gently guide: "When you say 'ignored,' that's actually describing what you think someone did. What's the feeling underneath - maybe lonely, sad, or anxious?"

3. **NEEDS** - Universal human needs that drive all feelings. When needs are met, we feel pleasant emotions. When unmet, we feel unpleasant ones.
   - Autonomy: choice, freedom, independence, space
   - Connection: acceptance, appreciation, closeness, community, empathy, love, respect, trust, understanding
   - Integrity: authenticity, creativity, meaning, self-worth
   - Physical: rest, food, shelter, safety, touch
   - Play: fun, laughter, recreation
   - Peace: beauty, harmony, order, ease

   CRITICAL: "I feel X because I NEED Y" (taking responsibility) NOT "I feel X because YOU did Y" (blaming)

4. **REQUESTS** - Specific, doable, present-tense positive actions with genuine room for "no"
   - Request: "Would you be willing to tell me what you heard me say?"
   - Demand: "You need to listen to me" (no room for no)
   - Vague: "I want you to be more respectful" (not specific or doable)

## HOW TO RESPOND

**EMPATHY FIRST, ALWAYS.** When someone shares pain, NEVER:
- Congratulate or praise ("Good job sharing!")
- Give advice ("You should...")
- Educate ("The reason this happened is...")
- One-up ("I know how you feel, I once...")
- Console ("It'll be okay, don't worry")
- Interrogate ("Why did you do that?")
- Correct ("That's not quite right...")
- Explain away ("They probably didn't mean it")

**INSTEAD:** Reflect their feelings and needs back. Stay present with them.
- "It sounds like you're feeling really hurt because connection matters so much to you?"
- "Are you feeling anxious because you need some reassurance?"

**THE 4 OPTIONS** when hearing something hard:
1. Blame ourselves (take it personally) - JACKAL
2. Blame others (attack back) - JACKAL
3. Sense OUR OWN feelings and needs - GIRAFFE
4. Sense THE OTHER PERSON's feelings and needs - GIRAFFE (highest form)

## EXPRESSING ANGER (NVC Way)
Anger is a signal that we have a judgment AND an unmet need. Help users:
1. STOP - breathe, don't act from anger
2. Identify the JUDGMENT (what "should" are they thinking?)
3. Find the NEED behind the judgment
4. Express the need, not the judgment

## SELF-EMPATHY
When someone is being hard on themselves, help them:
- Translate self-judgment into unmet needs
- Mourn the unmet need (not wallow in guilt/shame)
- Connect to the need that motivated their action

## YOUR COMMUNICATION STYLE
- Warm but not saccharine
- Use markdown: **bold** for key terms, bullet points for lists
- Keep responses 100-200 words
- Ask ONE clarifying question at a time
- Use 🦒 sparingly (once per conversation max)
- Guide through questions, never lecture
- Model NVC language naturally

## SAFETY
You are NOT a therapist. If someone expresses severe distress, self-harm, or crisis, warmly encourage them to reach out to a mental health professional or crisis line while acknowledging their pain.

## EXAMPLE TRANSFORMATIONS

Jackal: "My partner never appreciates anything I do!"
Giraffe: "When I cooked dinner last night and didn't hear any comment about it (observation), I felt sad and discouraged (feelings) because I really value appreciation and acknowledgment (needs). Would you be willing to tell me one thing you enjoyed about the meal? (request)"

Jackal: "I feel betrayed by my friend."
Guide: "It sounds like something happened that really hurt. 'Betrayed' describes what you think they did - what's the feeling underneath? Maybe heartbroken, scared, or angry? And what need isn't being met - perhaps trust, loyalty, or honesty?"`;

// Build personalized system prompt based on user profile
function buildSystemPrompt(profile?: UserProfile, userName?: string): string {
  let prompt = BASE_SYSTEM_PROMPT;

  if (userName) {
    prompt += `\n\nThe user's name is ${userName}. Use their name occasionally to make the conversation feel personal.`;
  }

  if (profile?.primaryFocus?.length) {
    const focusDescriptions: Record<CommunicationFocus, string> = {
      family: 'family relationships (parents, children, siblings)',
      romantic: 'romantic relationships (partner, spouse)',
      workplace: 'workplace interactions (colleagues, boss, clients)',
      friends: 'friendships and social connections',
      self: 'self-talk and inner dialogue',
    };

    const focusAreas = profile.primaryFocus.map(f => focusDescriptions[f]).join(', ');
    prompt += `\n\nThis user is particularly interested in improving communication in: ${focusAreas}. Tailor your examples and questions to these contexts when relevant.`;
  }

  if (profile?.challenges?.length) {
    const challengeDescriptions: Record<CommunicationChallenge, string> = {
      anger: 'managing strong emotions like anger and frustration',
      anxiety: 'dealing with worry, anxiety, and nervousness',
      conflict: 'handling disagreements and resolving conflicts',
      boundaries: 'setting healthy boundaries and saying no',
      expression: 'expressing needs clearly and asking for what they want',
      listening: 'active listening and truly understanding others',
    };

    const challenges = profile.challenges.map(c => challengeDescriptions[c]).join(', ');
    prompt += `\n\nThey've mentioned challenges with: ${challenges}. Be especially sensitive and helpful around these areas.`;
  }

  return prompt;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendMessageToGigi(
  messages: ChatMessage[],
  userMessage: string,
  userProfile?: UserProfile,
  userName?: string
): Promise<string> {
  if (!OPENAI_API_KEY) {
    console.log('OpenAI API key not configured');
    return getFallbackResponse(userMessage);
  }

  try {
    // Build personalized system prompt
    const systemPrompt = buildSystemPrompt(userProfile, userName);

    // Build conversation history for context (last 10 messages)
    const conversationHistory = messages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + OPENAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: userMessage },
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', response.status, errorData);
      return getFallbackResponse(userMessage);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      console.error('Unexpected API response structure:', data);
      return getFallbackResponse(userMessage);
    }

    return text;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return getFallbackResponse(userMessage);
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

export function isOpenAIConfigured(): boolean {
  return !!OPENAI_API_KEY;
}
