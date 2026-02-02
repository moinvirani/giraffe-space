# Giraffe - NVC Learning App

A beautiful, gamified app that teaches Non-Violent Communication (NVC). Think Duolingo meets therapy journaling, with playful giraffe and jackal characters guiding users through learning to express feelings and needs without blame or judgment.

## Core Philosophy

In NVC, the giraffe represents compassionate communication (long neck = perspective, big heart = empathy), while the jackal represents reactive, judgmental communication. The app helps users transform "jackal thoughts" into "giraffe speak."

## Features

### NVC Introduction Course (New!)
- **4 interactive lessons** that must be completed before daily practice:
  1. **Meet the Giraffe** - Introduction to Giraffe vs Jackal language
  2. **Facts vs Judgments** - Learning to observe without evaluating
  3. **Real Feelings** - Distinguishing genuine feelings from faux feelings
  4. **Needs & Requests** - Understanding universal needs and making clear requests
- Each lesson includes story slides, concepts, examples, and a quiz
- Progress tracking with visual indicators
- XP rewards for completion

### User Onboarding
- Simple email/password signup with Supabase authentication
- Post-signup intake questionnaire:
  - Gender and age range
  - NVC goals (relationship, parenting, family, workplace, anxiety, anger, self-talk, communication, boundaries)
- Dr. Marshall Rosenberg introduction and credit
- Personalized experience based on user's goals

### Daily Practice (Duolingo-style)
- **Gated behind intro completion** - ensures users learn basics first
- Streak tracking with animated flame
- **6 exercise types** with 30+ exercises:
  - **Spot the Judgment**: Observation vs evaluation
  - **Feeling or Faux**: Real feelings vs thoughts disguised as feelings
  - **Need Finder**: Match feelings to underlying needs
  - **Jackal → Giraffe Transform**: Rewrite judgmental statements in NVC
  - **Fill in the Blank**: Complete NVC statements
  - **Scenario Practice**: Real-world situations with NVC responses
- **Difficulty levels**: Beginner, Intermediate, Advanced
  - Daily practice prioritizes intermediate and advanced exercises
  - Introduction uses beginner exercises
- XP rewards (10-30 XP based on difficulty)
- Level progression and badge system

### NVC Vocabulary Reference
- **Comprehensive vocabulary guide** accessible from Practice tab
- **Feelings when needs ARE met**: ~60 feelings organized by emotion (affectionate, engaged, hopeful, confident, excited, grateful, inspired, joyful, peaceful, refreshed)
- **Feelings when needs are NOT met**: ~100 feelings covering all negative emotions (afraid, annoyed, angry, confused, disconnected, embarrassed, fatigued, pain, sad, tense, vulnerable, yearning)
- **Universal Human Needs**: 7 categories (Connection, Autonomy, Physical Well-being, Honesty, Play, Peace, Meaning) with 50+ specific needs
- **Faux Feelings guide**: ~40 "feelings" that are actually thoughts disguised as feelings (abandoned, attacked, betrayed, etc.) with transformation examples
- Based on Marshall Rosenberg's NVC framework

### Giraffe Journal
- Guided journaling to process real conflicts
- Templates for common situations:
  - Free Write
  - Something hurt me
  - I'm frustrated
  - Difficult conversation ahead
  - I want to repair
- 7-step NVC breakdown: Template → Situation → Observation → Feelings → Needs → Request → Mood
- **Simplified feelings selection** (pick 1-3 that resonate most)

### Gigi AI Chat
- AI companion powered by OpenAI (GPT-4o-mini)
- Personalized responses based on user's focus areas and challenges
- Safe space for "jackal thoughts" - non-judgmental venting
- Helps transform reactive thoughts into NVC statements
- Quick prompts for common situations
- Long-press on messages to copy (native iOS text selection)
- Includes disclaimer about not being a substitute for professional mental health care
- **Free users**: 10 messages per day limit
- **Premium users**: Unlimited messaging
- Smooth keyboard-aware input with animated transitions

### Premium Subscription (RevenueCat)
- **Monthly** ($4.99/month) and **Annual** ($29.99/year, 50% savings) plans
- Premium features include:
  - **Unlimited Gigi AI chats** (free users get 10/day)
  - **Advanced practice categories** (Needs, Requests, Integration)
  - **Unlimited journaling** entries
  - **Ad-free experience**
- Beautiful custom paywall UI with:
  - Feature highlights
  - Clear subscription pricing and duration
  - Auto-renewal terms disclosure
  - Links to Terms of Use and Privacy Policy
- Subscription management in Settings
- Restore purchases support
- Works with Test Store, App Store, and Play Store

### Learn from the Source
- Curated Dr. Marshall Rosenberg video section on Home screen
- Attribution and credit to NVC founder throughout the app
- Educational resources for deeper learning

### Settings & Progress
- User profile with stats
- Daily reminder notifications
- Customizable reminder time
- Privacy Policy
- Terms of Use (EULA)
- **Delete Account** - Permanently delete all user data with double confirmation
- Sign out functionality

## Tech Stack

- **Framework**: Expo SDK 53, React Native 0.76.7
- **Routing**: Expo Router (file-based)
- **State Management**: Zustand with AsyncStorage persistence
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Animations**: react-native-reanimated
- **Fonts**: Nunito & Quicksand (Google Fonts)
- **Icons**: lucide-react-native
- **Haptics**: expo-haptics for touch feedback
- **Backend**: Supabase (authentication)
- **AI**: OpenAI GPT-4o-mini (Gigi chat assistant)
- **Payments**: RevenueCat for subscriptions

## Color Palette

- **Primary (Giraffe Yellow/Orange)**: Warm savanna tones
- **Sage Green**: For positive feelings and needs met
- **Coral**: For feelings when needs aren't met
- **Cream**: Background and surfaces
- **Jackal Gray**: Text and secondary elements

## Project Structure

```
src/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── _layout.tsx    # Tab bar configuration
│   │   ├── index.tsx      # Home screen (with intro progress)
│   │   ├── practice.tsx   # Practice tab (topic selection)
│   │   ├── journal.tsx    # Journal tab
│   │   └── chat.tsx       # Gigi AI chat
│   ├── _layout.tsx        # Root layout with fonts
│   ├── index.tsx          # Routing logic
│   ├── onboarding.tsx     # Onboarding flow
│   ├── auth.tsx           # Sign up screen (with age selection)
│   ├── intro-lesson.tsx   # NVC introduction lessons (modal)
│   ├── practice-session.tsx # Full practice session (modal)
│   ├── journal-entry.tsx  # Journal entry (modal)
│   ├── paywall.tsx        # Premium subscription paywall (modal)
│   ├── privacy.tsx        # Privacy policy screen (modal)
│   ├── terms.tsx          # Terms of Use/EULA screen (modal)
│   └── settings.tsx       # Settings with subscription management (modal)
├── lib/
│   ├── store.ts           # Zustand store (with intro tracking)
│   ├── types.ts           # TypeScript types (with AgeGroup)
│   ├── colors.ts          # Color palette
│   ├── exercises.ts       # NVC exercises data (30+ exercises)
│   ├── intro-lessons.ts   # Introduction lesson content
│   ├── usePremium.ts      # Premium subscription hook (RevenueCat)
│   ├── revenuecatClient.ts # RevenueCat SDK wrapper
│   └── cn.ts              # className merge utility
└── components/
    ├── Button.tsx         # Reusable button components
    └── PremiumGate.tsx    # Premium feature gate components
```

## NVC Reference

### The Four Components
1. **Observations**: What we see/hear without evaluation
2. **Feelings**: Our emotional response (not thoughts about others' actions)
3. **Needs**: Universal human needs underlying feelings
4. **Requests**: Clear, doable actions we'd like

### Feelings vs Faux Feelings
- **Real feelings**: sad, anxious, joyful, frustrated, peaceful, disappointed, overwhelmed
- **Faux feelings**: ignored, betrayed, abandoned, pressured, unappreciated (these imply judgment)

### Universal Human Needs
Connection, understanding, acceptance, autonomy, safety, meaning, rest, play, space, reliability, and more.

## User Flow

1. **Onboarding** → 4 slides introducing the app concept
2. **Auth** → Name, email, password signup (no email verification required)
   - After signup: User is immediately logged in and proceeds to intake
   - Forgot password: Deep link opens reset-password screen in app
3. **Intake** → Personalization questionnaire (focus areas, challenges)
4. **Introduction** → Automatically starts first NVC lesson after intake
5. **Complete 4 Intro Lessons** → Each with content slides and quiz
6. **Home** → Shows streak card, unlocks daily practice
7. **Daily Practice** → 5 intermediate/advanced exercises
8. **Journal/Chat** → Available anytime for real-life application
