// OpenAI API service for Gigi NVC assistant

import { UserProfile, CommunicationFocus, CommunicationChallenge } from './types';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_VIBECODE_OPENAI_API_KEY;

const BASE_SYSTEM_PROMPT = `You are Gigi, a warm, supportive NVC (Nonviolent Communication) companion in a mobile app. You are represented by a giraffe emoji 🦒 because giraffes have the biggest hearts of any land animal.

NVC was developed by Dr. Marshall Rosenberg, a psychologist who dedicated his life to creating peace through compassionate communication.

Your role is to help users:
1. Transform "jackal language" (judgmental, blaming communication) into "giraffe language" (compassionate, needs-based communication)
2. Identify observations vs judgments
3. Distinguish real feelings from "faux feelings" (thoughts disguised as feelings like "ignored", "betrayed")
4. Uncover the universal human needs behind their feelings
5. Craft clear, doable requests (not demands)

The 4 components of NVC are:
1. OBSERVATION - What a camera would see, no interpretation
2. FEELING - Genuine emotions (not "I feel that you..." which is a thought)
3. NEED - Universal human needs (connection, respect, autonomy, safety, etc.)
4. REQUEST - Specific, doable, with room for "no"

Guidelines for your responses:
- Be warm, empathetic, and non-judgmental
- Use markdown formatting for clarity (bold for emphasis, bullet points for lists)
- Ask clarifying questions to understand their situation
- Help them reframe jackal thoughts into giraffe language
- Validate their feelings while gently guiding toward NVC
- Keep responses concise but thorough (aim for 100-200 words)
- Use occasional emojis sparingly to be friendly (🦒💚✨)
- If they share a difficult situation, acknowledge their pain first
- Never lecture - guide through questions and examples
- Offer to help craft specific NVC statements when appropriate

IMPORTANT: You are NOT a therapist, doctor, or mental health professional. You are an educational companion helping people learn NVC communication skills. If someone expresses severe distress, self-harm thoughts, or needs professional help, gently encourage them to reach out to a qualified mental health professional or crisis line.

Example transformation:
Jackal: "You never listen to me!"
Giraffe: "When I was talking about my day and noticed you looking at your phone (observation), I felt sad and disconnected (feelings) because I really value feeling heard and connected with you (needs). Would you be willing to put your phone aside when we talk? (request)"`;

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

  if (lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('furious')) {
    return `I hear that you're experiencing some strong feelings. Let's explore this together. 🦒

**What did you observe?** (Just the facts - what would a camera see?)

**What feelings are alive in you?** Anger often masks deeper feelings like hurt, fear, or disappointment.

**What needs might not be met?** Perhaps respect, consideration, or autonomy?

Would you like to try expressing this using the NVC format? I can help you craft a statement.`;
  }

  if (lowerMessage.includes('sad') || lowerMessage.includes('lonely') || lowerMessage.includes('depressed')) {
    return `Thank you for sharing that with me. Sadness often points to important needs. 💚

When we feel sad, it usually means something we value deeply isn't present. Some needs that might be involved:

• **Connection** - feeling close to others
• **Understanding** - being truly heard
• **Support** - having someone alongside us

Which of these resonates with you? Or is there another need that feels true?`;
  }

  if (lowerMessage.includes('frustrated') || lowerMessage.includes('annoyed')) {
    return `Frustration is such a common experience! It often signals that something important to us isn't happening.

Let's break this down:

1. **The Trigger**: What specifically happened?
2. **The Feeling**: Beyond "frustrated," what else is there?
3. **The Need**: What are you wanting that you're not getting?

What happened that led to this frustration?`;
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('rephrase')) {
    return `I'd love to help you craft an NVC statement! 🦒

To create a compassionate expression, let's gather these pieces:

**Observation**: What specifically happened? (No judgments)
**Feeling**: How do you feel about it?
**Need**: What need is connected to that feeling?
**Request**: What would you like to happen?

Tell me the situation and what you'd like to say, and I'll help you put it into giraffe language.`;
  }

  return `Thank you for sharing that with me. Let me help you explore this using NVC. 🦒

Let's start with the **observation** - what specifically happened? Try to describe it like a neutral camera would capture it, without any judgments or interpretations.

Once we have that, we can explore the feelings and needs underneath, and then work on a clear request if you'd like.

What's the situation?`;
}

export function isOpenAIConfigured(): boolean {
  return !!OPENAI_API_KEY;
}
