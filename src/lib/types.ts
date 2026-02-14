// Giraffe App Types

export type AgeGroup = 'teen' | 'young-adult' | 'adult' | 'senior';

export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+';

export type NVCGoal =
  | 'relationship'     // Strengthen my relationship with my partner
  | 'parenting'        // Be a more connected parent
  | 'family'           // Heal family dynamics
  | 'workplace'        // Navigate workplace conflicts
  | 'anxiety'          // Manage anxiety through self-compassion
  | 'anger'            // Transform anger into understanding
  | 'self-talk'        // Develop a kinder inner voice
  | 'communication'    // Become a better communicator
  | 'boundaries'       // Set healthy boundaries

// User profile for personalization
export interface UserProfile {
  gender?: Gender;
  ageRange?: AgeRange;
  goals?: NVCGoal[];
  primaryFocus?: CommunicationFocus[];
  challenges?: CommunicationChallenge[];
}

export type CommunicationFocus =
  | 'family'        // Parent-child, siblings
  | 'romantic'      // Partner, spouse
  | 'workplace'     // Colleagues, boss
  | 'friends'       // Friendships
  | 'self'          // Self-talk, inner critic

export type CommunicationChallenge =
  | 'anger'         // Managing anger/frustration
  | 'anxiety'       // Worry, nervousness
  | 'conflict'      // Resolving disagreements
  | 'boundaries'    // Setting healthy limits
  | 'expression'    // Expressing needs clearly
  | 'listening'     // Active listening

export interface User {
  id: string;
  name: string;
  email: string;
  ageGroup: AgeGroup;
  avatar?: string;
  createdAt: string;
  streak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  totalXP: number;
  level: number;
  completedExercises: number;
  badges: Badge[];
  // Legacy notification field (kept for backwards compatibility)
  notificationsEnabled: boolean;
  reminderTime: string; // HH:mm format
  // New separate notification settings
  practiceRemindersEnabled?: boolean;
  practiceReminderTime?: string; // HH:mm format
  journalRemindersEnabled?: boolean;
  journalReminderTime?: string; // HH:mm format
  hasCompletedIntro: boolean;
  hasCompletedIntake?: boolean; // Whether user completed the intake questionnaire (gender, age, goals)
  introProgress: number; // 0-4 for 4 intro lessons
  profile?: UserProfile;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  requirement: number;
  type: 'streak' | 'exercises' | 'level' | 'special';
}

export interface FillBlankData {
  sentence: string; // Sentence with ___ markers for blanks
  blankOptions: string[]; // Word chips to choose from (shuffled)
  correctBlanks: string[]; // Correct words in order of blanks
  // For blanks that can be filled in any order (e.g., "blame ourselves" and "blame them")
  // Specify which blank indices are interchangeable as groups
  // Example: [[0, 1]] means blanks 0 and 1 can be filled in either order
  interchangeableGroups?: number[][];
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  xpReward: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: NVCCategory;
  tier: 1 | 2 | 3 | 4 | 5; // Progressive tier system
  fillBlankData?: FillBlankData; // For Duolingo-style fill-in-the-blank
}

export type ExerciseType =
  | 'spot-judgment'
  | 'feeling-or-faux'
  | 'need-finder'
  | 'jackal-to-giraffe'
  | 'fill-blank'
  | 'scenario'
  | 'empathy-check' // New: Identify empathic vs non-empathic responses
  | 'self-empathy'  // New: Self-compassion exercises
  | 'anger-nvc'     // New: Expressing anger through NVC
  | 'appreciation'; // New: NVC appreciation format

export type NVCCategory =
  | 'observations'
  | 'feelings'
  | 'needs'
  | 'requests'
  | 'integration'
  | 'empathy'       // New category
  | 'self-care';    // New category

export interface JournalEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  template: JournalTemplate;
  situation: string;
  observation: string;
  feelings: string[];
  needs: string[];
  request: string;
  reflection?: string;
  mood: 'calm' | 'frustrated' | 'sad' | 'anxious' | 'hopeful' | 'peaceful';
}

export type JournalTemplate =
  | 'free-write'
  | 'hurt-by-words'
  | 'frustrated-with-someone'
  | 'difficult-conversation'
  | 'repair-reaction';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface DailyProgress {
  date: string;
  exercisesCompleted: number;
  xpEarned: number;
  practiceMinutes: number;
}

// NVC Reference Data - Based on Marshall Rosenberg's Nonviolent Communication
// Feelings when needs ARE met (organized by category)
export const FEELINGS = {
  whenNeedsMet: [
    // Affectionate
    'affectionate', 'compassionate', 'friendly', 'loving', 'tender', 'warm',
    // Engaged
    'absorbed', 'alert', 'curious', 'engrossed', 'fascinated', 'interested', 'intrigued', 'involved',
    // Hopeful
    'expectant', 'hopeful', 'optimistic',
    // Confident
    'confident', 'empowered', 'proud', 'safe', 'secure',
    // Excited
    'amazed', 'animated', 'eager', 'energetic', 'enthusiastic', 'excited', 'exhilarated', 'passionate', 'vibrant',
    // Grateful
    'appreciative', 'grateful', 'moved', 'thankful', 'touched',
    // Inspired
    'inspired', 'awed',
    // Joyful
    'amused', 'delighted', 'glad', 'happy', 'joyful', 'pleased', 'tickled',
    // Peaceful
    'calm', 'centered', 'content', 'fulfilled', 'mellow', 'peaceful', 'quiet', 'relaxed', 'relieved', 'satisfied', 'serene', 'still', 'tranquil',
    // Refreshed
    'enlivened', 'refreshed', 'rejuvenated', 'renewed', 'rested', 'restored', 'revived',
  ],
  whenNeedsNotMet: [
    // Afraid
    'apprehensive', 'dread', 'foreboding', 'frightened', 'mistrustful', 'panicked', 'petrified', 'scared', 'suspicious', 'terrified', 'wary', 'worried',
    // Annoyed
    'aggravated', 'annoyed', 'dismayed', 'disgruntled', 'displeased', 'exasperated', 'frustrated', 'impatient', 'irritated', 'irked',
    // Angry
    'angry', 'enraged', 'furious', 'incensed', 'indignant', 'irate', 'livid', 'outraged', 'resentful',
    // Aversion
    'appalled', 'contempt', 'disgusted', 'dislike', 'hate', 'horrified', 'hostile', 'repulsed',
    // Confused
    'ambivalent', 'baffled', 'bewildered', 'dazed', 'hesitant', 'lost', 'mystified', 'perplexed', 'puzzled', 'torn',
    // Disconnected
    'alienated', 'aloof', 'apathetic', 'bored', 'cold', 'detached', 'distant', 'distracted', 'indifferent', 'numb', 'withdrawn',
    // Disquiet
    'agitated', 'alarmed', 'discombobulated', 'disturbed', 'rattled', 'restless', 'shocked', 'startled', 'surprised', 'troubled', 'turbulent', 'uncomfortable', 'uneasy', 'unnerved', 'unsettled', 'upset',
    // Embarrassed
    'ashamed', 'chagrined', 'embarrassed', 'flustered', 'guilty', 'mortified', 'self-conscious',
    // Fatigued
    'burned out', 'depleted', 'exhausted', 'fatigued', 'lethargic', 'listless', 'sleepy', 'tired', 'weary', 'worn out',
    // Pain
    'agonized', 'anguished', 'bereaved', 'devastated', 'grief', 'heartbroken', 'hurt', 'lonely', 'miserable', 'regretful', 'remorseful',
    // Sad
    'dejected', 'depressed', 'despairing', 'despondent', 'disappointed', 'discouraged', 'disheartened', 'forlorn', 'gloomy', 'heavy-hearted', 'hopeless', 'melancholy', 'sad', 'unhappy',
    // Tense
    'anxious', 'cranky', 'distressed', 'distraught', 'edgy', 'fidgety', 'frazzled', 'irritable', 'jittery', 'nervous', 'overwhelmed', 'restless', 'stressed',
    // Vulnerable
    'fragile', 'guarded', 'helpless', 'insecure', 'leery', 'reserved', 'sensitive', 'shaky',
    // Yearning
    'envious', 'jealous', 'longing', 'nostalgic', 'pining', 'wistful',
  ],
};

// Universal Human Needs - organized by category
export const NEEDS_BY_CATEGORY = {
  connection: [
    'acceptance', 'affection', 'appreciation', 'belonging', 'closeness', 'communication',
    'community', 'companionship', 'compassion', 'consideration', 'consistency', 'empathy',
    'inclusion', 'intimacy', 'love', 'nurturing', 'respect', 'safety', 'security',
    'stability', 'support', 'to know and be known', 'to see and be seen', 'to understand and be understood',
    'trust', 'warmth',
  ],
  physicalWellBeing: [
    'air', 'food', 'movement', 'rest', 'sleep', 'shelter', 'touch', 'water',
  ],
  honesty: [
    'authenticity', 'integrity', 'presence',
  ],
  play: [
    'joy', 'humor',
  ],
  peace: [
    'beauty', 'communion', 'ease', 'equality', 'harmony', 'inspiration', 'order',
  ],
  autonomy: [
    'choice', 'freedom', 'independence', 'space', 'spontaneity',
  ],
  meaning: [
    'awareness', 'celebration of life', 'challenge', 'clarity', 'competence', 'consciousness',
    'contribution', 'creativity', 'discovery', 'efficacy', 'effectiveness', 'growth', 'hope',
    'learning', 'mourning', 'participation', 'purpose', 'self-expression', 'stimulation',
    'to matter', 'understanding',
  ],
};

// Flat list of all needs (for simpler use cases)
export const NEEDS = [
  // Connection
  'acceptance', 'affection', 'appreciation', 'belonging', 'closeness', 'community',
  'companionship', 'compassion', 'connection', 'consideration', 'empathy', 'inclusion',
  'intimacy', 'love', 'nurturing', 'respect', 'safety', 'security', 'support', 'trust', 'warmth',
  // Autonomy
  'autonomy', 'choice', 'freedom', 'independence', 'space', 'spontaneity',
  // Physical Well-being
  'air', 'food', 'movement', 'rest', 'shelter', 'touch', 'water',
  // Honesty
  'authenticity', 'honesty', 'integrity', 'presence',
  // Play
  'humor', 'joy', 'play',
  // Peace
  'beauty', 'ease', 'equality', 'harmony', 'inspiration', 'order', 'peace',
  // Meaning
  'awareness', 'challenge', 'clarity', 'competence', 'contribution', 'creativity',
  'discovery', 'effectiveness', 'growth', 'hope', 'learning', 'meaning', 'mourning',
  'participation', 'purpose', 'self-expression', 'stimulation', 'understanding',
];

// Faux feelings (thoughts disguised as feelings - they imply someone is doing something TO you)
export const FAUX_FEELINGS = [
  'abandoned', 'abused', 'attacked', 'betrayed', 'blamed', 'bullied', 'cheated',
  'coerced', 'criticized', 'diminished', 'disrespected', 'dumped', 'ignored',
  'insulted', 'intimidated', 'invalidated', 'let down', 'manipulated', 'misunderstood',
  'neglected', 'overworked', 'patronized', 'pressured', 'provoked', 'put down',
  'rejected', 'ripped off', 'smothered', 'taken for granted', 'threatened',
  'unappreciated', 'unheard', 'unloved', 'unseen', 'unsupported', 'unwanted', 'used', 'victimized',
];
