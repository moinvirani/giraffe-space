import { Exercise } from './types';

// ============================================================================
// TIER 1: INTRODUCTORY (0-15 exercises completed)
// Focus: Basic observations vs evaluations, simple feeling identification,
//        intro to faux feelings, fill-in-the-blank NVC basics
// ============================================================================

const TIER_1_EXERCISES: Exercise[] = [
  // Observation vs Evaluation - Varied formats
  {
    id: 't1-obs-1',
    type: 'spot-judgment',
    question: 'Which statement is a pure observation (without judgment)?',
    options: [
      'You never listen to me.',
      'You looked at your phone three times while I was talking.',
      'You\'re so rude when I\'m speaking.',
      'You clearly don\'t care about what I have to say.',
    ],
    correctAnswer: 1,
    explanation: '"You looked at your phone three times" describes what happened without adding interpretation. "Never," "rude," and assumptions about caring are all evaluations.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
    tier: 1,
  },
  {
    id: 't1-obs-2',
    type: 'spot-judgment',
    question: 'Which is an observation without evaluation?',
    options: [
      'She\'s always late.',
      'She arrived 20 minutes after the scheduled time.',
      'She doesn\'t respect other people\'s time.',
      'She\'s so inconsiderate.',
    ],
    correctAnswer: 1,
    explanation: '"Arrived 20 minutes after the scheduled time" states a specific, observable fact. Words like "always," "doesn\'t respect," and "inconsiderate" are evaluations.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
    tier: 1,
  },
  {
    id: 't1-obs-3',
    type: 'spot-judgment',
    question: 'Which statement is a pure observation?',
    options: [
      'My father is a good man.',
      'My father helped our neighbor move furniture on Saturday.',
      'My father is generous.',
      'My father cares about others.',
    ],
    correctAnswer: 1,
    explanation: '"Helped our neighbor move furniture on Saturday" is specific and observable. "Good," "generous," and "cares" are positive evaluations -- but still evaluations. Even positive judgments are not observations.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
    tier: 1,
  },
  {
    id: 't1-obs-4',
    type: 'spot-judgment',
    question: 'Select the pure observation:',
    options: [
      'She gave me a dirty look.',
      'She looked at me without smiling.',
      'She was being judgmental.',
      'She obviously disapproves of me.',
    ],
    correctAnswer: 1,
    explanation: '"Looked at me without smiling" describes observable behavior. "Dirty look," "judgmental," and "disapproves" are interpretations we add to explain what we saw.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
    tier: 1,
  },
  // Observation vs evaluation - two-option format (from the book)
  {
    id: 't1-obs-5',
    type: 'spot-judgment',
    question: 'Is this observation or evaluation? "Pam was first in line every day this week."',
    options: ['Observation', 'Evaluation'],
    correctAnswer: 0,
    explanation: 'This is an observation -- it states a specific, time-bound fact that could be verified.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
    tier: 1,
  },
  {
    id: 't1-obs-6',
    type: 'spot-judgment',
    question: 'Is this observation or evaluation? "My son often doesn\'t brush his teeth."',
    options: ['Observation', 'Evaluation'],
    correctAnswer: 1,
    explanation: 'This is an evaluation because "often" is vague. An observation would specify: "My son didn\'t brush his teeth three mornings this week."',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
    tier: 1,
  },
  // Rewrite-style observation exercises
  {
    id: 't1-obs-7',
    type: 'spot-judgment',
    question: '"You\'re lazy." How would you rewrite this as a pure observation?',
    options: [
      'You\'re not doing your share.',
      'You sat on the couch for three hours while I cleaned the kitchen.',
      'You don\'t help enough.',
      'You never do anything around here.',
    ],
    correctAnswer: 1,
    explanation: 'A pure observation is specific and time-bound, like a camera recording. "Sat on the couch for three hours while I cleaned the kitchen" is what actually happened, without labels like "lazy."',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
    tier: 1,
  },
  {
    id: 't1-obs-8',
    type: 'spot-judgment',
    question: '"He\'s so aggressive." Rewrite as a pure observation:',
    options: [
      'He has anger issues.',
      'He hit his sister when she took his toy.',
      'He\'s always violent.',
      'He can\'t control himself.',
    ],
    correctAnswer: 1,
    explanation: '"Hit his sister when she took his toy" describes specific behavior in a specific context. "Aggressive," "anger issues," and "violent" are labels, not observations.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
    tier: 1,
  },

  // Feeling identification -- mix of GENUINE and FAUX feelings
  {
    id: 't1-feel-1',
    type: 'feeling-or-faux',
    question: '"I feel happy" -- Is this a genuine feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 0,
    explanation: '"Happy" is a genuine feeling! It describes your internal emotional state without implying what anyone else did.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'feelings',
    tier: 1,
  },
  {
    id: 't1-feel-2',
    type: 'feeling-or-faux',
    question: '"I feel ignored" -- Is this a genuine feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Ignored" is a faux feeling -- it describes what you think someone is DOING to you, not your actual emotion. The real feeling underneath might be "lonely," "sad," or "hurt."',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'feelings',
    tier: 1,
  },
  {
    id: 't1-feel-3',
    type: 'feeling-or-faux',
    question: '"I feel anxious" -- Is this a genuine feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 0,
    explanation: '"Anxious" is a genuine feeling! It describes your internal emotional state without blaming others.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'feelings',
    tier: 1,
  },
  {
    id: 't1-feel-4',
    type: 'feeling-or-faux',
    question: '"I feel abandoned" -- Is this a genuine feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Abandoned" is a faux feeling -- it implies someone left or deserted you. The genuine feelings underneath might be "scared," "lonely," "sad," or "panicked."',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'feelings',
    tier: 1,
  },
  {
    id: 't1-feel-5',
    type: 'feeling-or-faux',
    question: '"I feel excited" -- Is this a genuine feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 0,
    explanation: '"Excited" is a genuine feeling! It\'s an emotion you can feel in your body.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'feelings',
    tier: 1,
  },
  {
    id: 't1-feel-6',
    type: 'feeling-or-faux',
    question: '"I feel rejected" -- Is this a genuine feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Rejected" implies someone rejected you -- it\'s a thought about their action. Genuine feelings underneath might be: hurt, sad, scared, or embarrassed.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'feelings',
    tier: 1,
  },
  {
    id: 't1-feel-7',
    type: 'feeling-or-faux',
    question: '"I feel disappointed" -- Is this a genuine feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 0,
    explanation: '"Disappointed" is a genuine feeling! It describes your emotional state when expectations aren\'t met.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'feelings',
    tier: 1,
  },
  {
    id: 't1-feel-8',
    type: 'feeling-or-faux',
    question: '"I feel let down" -- Is this a genuine feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Let down" implies someone dropped the ball on you. The genuine feelings underneath might be "disappointed," "sad," or "frustrated."',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'feelings',
    tier: 1,
  },

  // Basic Needs Introduction
  {
    id: 't1-need-1',
    type: 'need-finder',
    question: 'When someone feels lonely, which need is most likely unmet?',
    options: ['Autonomy', 'Connection', 'Achievement', 'Order'],
    correctAnswer: 1,
    explanation: 'Loneliness usually signals an unmet need for connection, belonging, or companionship.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'needs',
    tier: 1,
  },
  {
    id: 't1-need-2',
    type: 'need-finder',
    question: 'When someone feels tired and overwhelmed, which need might be unmet?',
    options: ['Rest', 'Celebration', 'Contribution', 'Creativity'],
    correctAnswer: 0,
    explanation: 'Feeling tired and overwhelmed often points to unmet needs for rest, space, or support.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'needs',
    tier: 1,
  },
  {
    id: 't1-need-3',
    type: 'need-finder',
    question: 'When someone feels bored, which need might be unmet?',
    options: ['Safety', 'Stimulation/Engagement', 'Respect', 'Mourning'],
    correctAnswer: 1,
    explanation: 'Boredom often signals unmet needs for stimulation, engagement, play, or meaning.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'needs',
    tier: 1,
  },
  {
    id: 't1-need-4',
    type: 'need-finder',
    question: 'When a child feels happy playing with friends, which need is being met?',
    options: ['Order', 'Play/Connection', 'Mourning', 'Integrity'],
    correctAnswer: 1,
    explanation: 'Playing with friends meets needs for play, connection, fun, and belonging.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'needs',
    tier: 1,
  },

  // Fill-in-the-blank NVC basics (Duolingo-style)
  {
    id: 't1-fill-1',
    type: 'fill-blank',
    question: 'Complete the sentence by choosing the correct words:',
    fillBlankData: {
      sentence: 'I feel ___ because I need ___ with you.',
      blankOptions: ['sad', 'connection', 'like you don\'t care', 'you to change', 'angry', 'attention'],
      correctBlanks: ['sad', 'connection'],
    },
    options: [
      'angry ... you to stop yelling',
      'sad ... connection with you',
      'like you don\'t care ... attention',
      'frustrated ... you to change',
    ],
    correctAnswer: 1,
    explanation: '"I feel sad because I need connection" connects a genuine feeling to a universal need. "You to stop yelling" and "you to change" are strategies, not needs. "Like you don\'t care" is a thought, not a feeling.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'integration',
    tier: 1,
  },
  {
    id: 't1-fill-2',
    type: 'fill-blank',
    question: 'What are the four components of honest expression in NVC?',
    fillBlankData: {
      sentence: 'The four components are: ___, ___, ___, and ___.',
      blankOptions: ['Observation', 'Feeling', 'Need', 'Request', 'Blame', 'Demand', 'Judgment', 'Complaint'],
      correctBlanks: ['Observation', 'Feeling', 'Need', 'Request'],
    },
    options: [
      'Observation, Feeling, Need, Request',
      'Problem, Emotion, Blame, Solution',
      'Complaint, Feeling, Demand, Consequence',
      'Situation, Reaction, Judgment, Action',
    ],
    correctAnswer: 0,
    explanation: 'The four components of NVC are: Observation (what happened), Feeling (how you feel), Need (what need is connected), and Request (what would help).',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'integration',
    tier: 1,
  },
  {
    id: 't1-fill-3',
    type: 'spot-judgment',
    question: 'Which is an example of a positive evaluation (still a judgment, not an observation)?',
    options: [
      'You wrote a 10-page report this week.',
      'You\'re such a hard worker.',
      'You submitted the report on Friday.',
      'You spent four hours on the report yesterday.',
    ],
    correctAnswer: 1,
    explanation: 'Even positive labels like "hard worker" are evaluations, not observations. In NVC, we try to describe what we see (specific actions) rather than label people, even positively.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
    tier: 1,
  },

  // 4 options for receiving negative messages - intro
  {
    id: 't1-recv-1',
    type: 'fill-blank',
    question: 'Someone says "You\'re so selfish!" What are the four ways we can receive this message?',
    fillBlankData: {
      sentence: 'We can: (1) blame ___, (2) blame ___, (3) sense our own ___, or (4) sense their ___.',
      blankOptions: ['ourselves', 'them', 'feelings and needs', 'feelings and needs', 'actions', 'words'],
      correctBlanks: ['ourselves', 'them', 'feelings and needs', 'feelings and needs'],
      interchangeableGroups: [[0, 1]], // "ourselves" and "them" can be in either blank 1 or 2
    },
    options: [
      'Agree, disagree, ignore, or leave',
      'Blame self, blame them, sense our own feelings/needs, or sense their feelings/needs',
      'Accept, reject, negotiate, or compromise',
      'Fight, flight, freeze, or fawn',
    ],
    correctAnswer: 1,
    explanation: 'NVC teaches 4 ways to receive any message: (1) blame ourselves, (2) blame the other, (3) sense our own feelings and needs, or (4) sense their feelings and needs. Ways 3 and 4 are the compassionate responses.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'integration',
    tier: 1,
  },

  // Additional fill-blank exercises for Tier 1
  {
    id: 't1-fill-4',
    type: 'fill-blank',
    question: 'Complete this observation without adding judgment:',
    fillBlankData: {
      sentence: 'When I saw ___ on the floor, I felt ___.',
      blankOptions: ['your clothes', 'a mess', 'frustrated', 'disrespected', 'annoyed', 'the laundry'],
      correctBlanks: ['your clothes', 'frustrated'],
    },
    options: [
      'a mess / disrespected',
      'your clothes / frustrated',
      'the laundry / annoyed',
      'your stuff everywhere / angry',
    ],
    correctAnswer: 1,
    explanation: '"Your clothes" is specific and observable (not "a mess" which is a judgment). "Frustrated" is a genuine feeling, while "disrespected" implies what someone is doing to you.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
    tier: 1,
  },
  {
    id: 't1-fill-5',
    type: 'fill-blank',
    question: 'Identify the genuine feeling in this sentence:',
    fillBlankData: {
      sentence: 'After waiting for an hour, I feel ___.',
      blankOptions: ['anxious', 'ignored', 'impatient', 'dismissed', 'worried', 'abandoned'],
      correctBlanks: ['anxious'],
    },
    options: [
      'ignored',
      'anxious',
      'abandoned',
      'dismissed',
    ],
    correctAnswer: 1,
    explanation: '"Anxious" is a genuine feeling that describes your internal state. "Ignored," "abandoned," and "dismissed" are faux feelings that imply someone is doing something to you.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'feelings',
    tier: 1,
  },
  {
    id: 't1-fill-6',
    type: 'fill-blank',
    question: 'Connect this feeling to a need:',
    fillBlankData: {
      sentence: 'I feel ___ because I need ___.',
      blankOptions: ['scared', 'safety', 'threatened', 'you to protect me', 'anxious', 'security'],
      correctBlanks: ['scared', 'safety'],
    },
    options: [
      'threatened / you to protect me',
      'scared / safety',
      'anxious / you to be careful',
      'worried / things to be different',
    ],
    correctAnswer: 1,
    explanation: '"Scared" is a genuine feeling and "safety" is a universal need. "Threatened" is a faux feeling, and "you to protect me" is a strategy, not a need.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'needs',
    tier: 1,
  },
  {
    id: 't1-fill-7',
    type: 'fill-blank',
    question: 'Choose words that describe what actually happened:',
    fillBlankData: {
      sentence: 'You ___ the room while I was talking.',
      blankOptions: ['left', 'rudely left', 'walked out of', 'stormed out of', 'exited', 'abandoned'],
      correctBlanks: ['left'],
    },
    options: [
      'rudely left',
      'left',
      'stormed out of',
      'abandoned',
    ],
    correctAnswer: 1,
    explanation: '"Left" is a neutral observation of what happened. "Rudely," "stormed," and "abandoned" add interpretation and judgment to the action.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
    tier: 1,
  },
];

// ============================================================================
// TIER 2: FOUNDATIONS (15-40 exercises completed)
// Focus: Real feelings vs faux feelings, connecting feelings to needs,
//        NVC book scenarios, receiving negative messages, requests vs demands
// ============================================================================

const TIER_2_EXERCISES: Exercise[] = [
  // Faux Feelings - Key Distinctions (reduced from 12 to 6 faux-feeling exercises)
  {
    id: 't2-faux-1',
    type: 'feeling-or-faux',
    question: '"I feel unappreciated" -- Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Unappreciated" is a faux feeling -- it implies someone SHOULD be appreciating you. Try instead: "I feel sad" or "I feel discouraged" because you have a need for recognition.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },
  {
    id: 't2-faux-2',
    type: 'feeling-or-faux',
    question: '"I feel betrayed" -- Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Betrayed" is a faux feeling because it implies judgment about someone\'s actions. Genuine feelings underneath might be: hurt, shocked, scared, or devastated.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },
  {
    id: 't2-faux-3',
    type: 'feeling-or-faux',
    question: '"I feel frustrated" -- Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 0,
    explanation: '"Frustrated" is a genuine feeling! It describes an internal state of agitation when something isn\'t working.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },
  {
    id: 't2-faux-4',
    type: 'feeling-or-faux',
    question: '"I feel taken for granted" -- Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Taken for granted" is a thought about how others treat you. Genuine feelings might be: sad, discouraged, resentful, or hurt.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },
  {
    id: 't2-faux-5',
    type: 'feeling-or-faux',
    question: '"I feel overwhelmed" -- Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 0,
    explanation: '"Overwhelmed" is a genuine feeling! It describes an internal state when there\'s too much to handle.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },
  {
    id: 't2-faux-6',
    type: 'feeling-or-faux',
    question: '"I feel manipulated" -- Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Manipulated" implies someone is doing something TO you. Genuine feelings underneath might be: confused, uneasy, wary, or angry.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },

  // Connecting Feelings to Needs
  {
    id: 't2-need-1',
    type: 'need-finder',
    question: 'When someone feels resentful about doing favors, which need might be unmet?',
    options: ['Playfulness', 'Autonomy/Choice', 'Beauty', 'Mourning'],
    correctAnswer: 1,
    explanation: 'Resentment around obligations often signals unmet needs for autonomy, choice, or freedom.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'needs',
    tier: 2,
  },
  {
    id: 't2-need-2',
    type: 'need-finder',
    question: 'When someone feels hurt after being criticized, which need might be unmet?',
    options: ['Order', 'Acceptance/Understanding', 'Stimulation', 'Contribution'],
    correctAnswer: 1,
    explanation: 'Hurt from criticism often points to unmet needs for acceptance, understanding, or respect.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'needs',
    tier: 2,
  },
  {
    id: 't2-need-3',
    type: 'need-finder',
    question: 'When someone feels jealous of a friend\'s success, which need might be unmet?',
    options: ['Recognition/Achievement', 'Physical safety', 'Mourning', 'Order'],
    correctAnswer: 0,
    explanation: 'Jealousy often signals unmet needs for recognition, achievement, or being valued.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'needs',
    tier: 2,
  },
  {
    id: 't2-need-4',
    type: 'need-finder',
    question: 'When someone feels guilty about taking time for themselves, which need might be in conflict?',
    options: ['Self-care vs. Contribution', 'Order vs. Chaos', 'Food vs. Water', 'Play vs. Fun'],
    correctAnswer: 0,
    explanation: 'Guilt about self-care often indicates a conflict between needs for self-care/rest and needs for contribution/caring for others.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'needs',
    tier: 2,
  },

  // Taking Responsibility for Feelings ("I feel...because I need" vs "I feel...because you")
  {
    id: 't2-resp-1',
    type: 'fill-blank',
    question: 'Choose the words that take responsibility for your feelings:',
    fillBlankData: {
      sentence: 'I feel ___ because I need ___.',
      blankOptions: ['angry', 'respect', 'you yelled at me', 'you to stop', 'like you\'re mean', 'attention'],
      correctBlanks: ['angry', 'respect'],
    },
    options: [
      'I feel angry because you yelled at me.',
      'I feel angry because I need respect.',
      'You make me so angry!',
      'I feel like you\'re being mean.',
    ],
    correctAnswer: 1,
    explanation: '"I feel angry because I need respect" connects the feeling to YOUR need. The others blame the other person for your feeling.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },
  {
    id: 't2-resp-2',
    type: 'fill-blank',
    question: 'Fill in the blanks with the NVC pattern:',
    fillBlankData: {
      sentence: 'I feel ___ because I value being ___ and ___.',
      blankOptions: ['hurt', 'remembered', 'celebrated', 'you forgot', 'don\'t care', 'angry'],
      correctBlanks: ['hurt', 'remembered', 'celebrated'],
    },
    options: [
      'I feel hurt because you forgot my birthday.',
      'I feel hurt because I value being remembered and celebrated.',
      'I feel like you don\'t care about me.',
      'You hurt my feelings.',
    ],
    correctAnswer: 1,
    explanation: 'Connecting your feeling to YOUR need (being remembered/celebrated) is taking responsibility. Saying "because you forgot" blames the other person.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },
  {
    id: 't2-resp-3',
    type: 'fill-blank',
    question: 'Complete the sentence that takes ownership of the feeling:',
    fillBlankData: {
      sentence: 'I\'m sad because ___ with you matters to me.',
      blankOptions: ['connection', 'you didn\'t call', 'you made me', 'being neglected', 'talking'],
      correctBlanks: ['connection'],
    },
    options: [
      'I\'m sad because you didn\'t call.',
      'I\'m sad because connection with you matters to me.',
      'You made me sad by not calling.',
      'I feel neglected.',
    ],
    correctAnswer: 1,
    explanation: '"Because connection with you matters to me" identifies YOUR need. The others blame the other person or use a faux feeling (neglected).',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },

  // More fill-blank exercises for variety
  {
    id: 't2-fill-1',
    type: 'fill-blank',
    question: 'Complete the NVC observation:',
    fillBlankData: {
      sentence: 'When I see ___ in the sink, I feel ___ because I need ___.',
      blankOptions: ['dirty dishes', 'frustrated', 'order', 'a mess', 'annoyed', 'you to clean'],
      correctBlanks: ['dirty dishes', 'frustrated', 'order'],
    },
    options: [
      'a mess / annoyed / you to clean up',
      'dirty dishes / frustrated / order',
      'your stuff / angry / respect',
      'clutter / upset / tidiness',
    ],
    correctAnswer: 1,
    explanation: '"Dirty dishes" is specific and observable. "Frustrated" is a genuine feeling. "Order" is a universal need (not a strategy like "you to clean up").',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'observations',
    tier: 2,
  },
  {
    id: 't2-fill-2',
    type: 'fill-blank',
    question: 'Build an empathic guess for someone who says "Nobody cares about me":',
    fillBlankData: {
      sentence: 'Are you feeling ___ because you need ___?',
      blankOptions: ['lonely', 'connection', 'ignored', 'attention', 'sad', 'love'],
      correctBlanks: ['lonely', 'connection'],
    },
    options: [
      'ignored / attention',
      'lonely / connection',
      'sad / people to care',
      'hurt / love',
    ],
    correctAnswer: 1,
    explanation: '"Lonely" is a genuine feeling (unlike "ignored" which implies blame). "Connection" is a universal need.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'empathy',
    tier: 2,
  },

  // Observation work
  {
    id: 't2-obs-1',
    type: 'spot-judgment',
    question: 'Which statement is a PURE observation without any judgment?',
    options: [
      'He spoke in a condescending tone.',
      'He said, "I already explained this to you twice."',
      'He was being patronizing.',
      'He obviously thinks I\'m stupid.',
    ],
    correctAnswer: 1,
    explanation: 'Only the exact words spoken are observable. "Condescending," "patronizing," and "thinks I\'m stupid" are all interpretations we add.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'observations',
    tier: 2,
  },
  {
    id: 't2-obs-2',
    type: 'spot-judgment',
    question: 'Spot the hidden judgment. Which is a true observation?',
    options: [
      'The meeting ran 45 minutes longer than scheduled.',
      'The meeting took forever.',
      'The meeting was poorly planned.',
      'The meeting was a waste of time.',
    ],
    correctAnswer: 0,
    explanation: '"45 minutes longer than scheduled" is measurable and factual. "Forever," "poorly planned," and "waste of time" are evaluations.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'observations',
    tier: 2,
  },

  // Requests vs Demands - Tier 2 intro
  {
    id: 't2-req-1',
    type: 'scenario',
    question: 'Which of these is a REQUEST (not a demand)?',
    options: [
      'You need to call me when you\'re late.',
      'Would you be willing to send me a text if you\'re running late?',
      'I need you to always tell me where you are.',
      'Don\'t ever be late again.',
    ],
    correctAnswer: 1,
    explanation: '"Would you be willing..." is a true request because it\'s specific, actionable, and leaves room for the other person to say no. Demands use "need to," "have to," or "don\'t ever."',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'requests',
    tier: 2,
  },
  {
    id: 't2-req-2',
    type: 'scenario',
    question: 'How do you know if your "request" is actually a demand?',
    options: [
      'If you use the word "please"',
      'If you feel angry when the person says no',
      'If you ask more than once',
      'If it\'s about something important',
    ],
    correctAnswer: 1,
    explanation: 'A key test: if you would criticize, guilt-trip, or punish the person for saying no, it was a demand disguised as a request. True requests genuinely allow "no."',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'requests',
    tier: 2,
  },

  // NVC Book Scenarios -- based on real NVC stories
  {
    id: 't2-scenario-1',
    type: 'scenario',
    question: 'At an airport, a man overhears someone call a speaker "the most arrogant person I\'ve ever met." Using NVC, how could the listener understand what is really being said?',
    options: [
      'The speaker is a rude person.',
      'The listener should defend the speaker.',
      'The man calling someone "arrogant" may be feeling frustrated because his need for consideration or inclusion wasn\'t met.',
      'The "arrogant" person needs to change.',
    ],
    correctAnswer: 2,
    explanation: 'In NVC, when someone uses a label like "arrogant," they are expressing an unmet need (perhaps for consideration, equality, or being heard) through a judgment. The giraffe hears the need behind the label.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 2,
  },
  {
    id: 't2-scenario-2',
    type: 'scenario',
    question: 'A parent says to a child: "You got paint on the carpet again! What\'s wrong with you?" What is the NVC reframe?',
    options: [
      '"You\'re always so messy!"',
      '"When I see paint on the carpet, I feel frustrated because I need order in our home. Would you be willing to paint at the kitchen table?"',
      '"I feel like you don\'t care about our house."',
      '"Go to your room until you learn to be careful."',
    ],
    correctAnswer: 1,
    explanation: 'The NVC version replaces blame and labels ("what\'s wrong with you?") with observation, feeling, need, and a specific doable request.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 2,
  },
  {
    id: 't2-scenario-3',
    type: 'scenario',
    question: 'A coworker says "Nobody tells me anything around here." What might they really be expressing?',
    options: [
      'They need to be more assertive.',
      'Their coworkers are mean.',
      'They might be feeling anxious or frustrated because they need to be included and have access to information that affects their work.',
      'They should file a formal complaint.',
    ],
    correctAnswer: 2,
    explanation: '"Nobody tells me anything" is a judgment. Underneath might be feelings of anxiety or frustration, and unmet needs for inclusion, transparency, or consideration.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 2,
  },

  // 4 Ways to Receive Negative Messages
  {
    id: 't2-recv-1',
    type: 'empathy-check',
    question: 'Someone says "You\'re so inconsiderate!" Which response tries to understand what the OTHER person is feeling and needing?',
    options: [
      '"You\'re right, I\'m a terrible person."',
      '"Well, you\'re no saint either!"',
      '"I feel hurt hearing that."',
      '"Are you frustrated because you need more consideration?"',
    ],
    correctAnswer: 3,
    explanation: 'Option D demonstrates hearing the OTHER person\'s feelings and needs behind their words -- the most connecting response in NVC. Option A is blaming yourself, B is blaming them back, and C senses your own feelings (also valid, but the question asked about sensing THEIR feelings).',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 2,
  },
  {
    id: 't2-recv-2',
    type: 'empathy-check',
    question: 'Your partner says "You never help with anything!" Which response shows you tuning into YOUR OWN feelings and needs (instead of reacting)?',
    options: [
      '"That\'s not true!"',
      '"Well, you never appreciate what I do!"',
      '"Hearing that, I feel hurt because I value fairness and I want to contribute."',
      '"You\'re right, I\'m useless."',
    ],
    correctAnswer: 2,
    explanation: 'Sensing your own feelings and needs means pausing to notice what arises in you. Instead of defending or counter-attacking, you name your feeling (hurt) and your need (fairness, contribution).',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 2,
  },

  // Positive Evaluations are still judgments
  {
    id: 't2-pos-1',
    type: 'scenario',
    question: 'Your friend says "You\'re such a kind person!" In NVC, this is:',
    options: [
      'Perfect NVC -- everyone loves compliments.',
      'A positive evaluation -- still a judgment about who the person IS.',
      'An observation.',
      'A request.',
    ],
    correctAnswer: 1,
    explanation: 'In NVC, even positive labels ("kind," "smart," "generous") are evaluations. An NVC appreciation would be: "When you helped me move, I felt grateful because I needed support."',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'observations',
    tier: 2,
  },
  {
    id: 't2-pos-2',
    type: 'scenario',
    question: 'A teacher says "Good boy!" to a student. How would NVC express this differently?',
    options: [
      '"Great job!"',
      '"You\'re so well-behaved!"',
      '"When you shared your crayons with Maya, I felt delighted because I value caring."',
      '"Keep it up!"',
    ],
    correctAnswer: 2,
    explanation: 'Instead of evaluating the child ("good boy"), NVC appreciation names what they did (shared crayons), how you felt (delighted), and the need met (caring). This teaches the child about impact rather than seeking approval.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'observations',
    tier: 2,
  },

  // Empathy vs Empathy Blockers - intro
  {
    id: 't2-emp-1',
    type: 'empathy-check',
    question: 'Your friend says "I had a terrible day at work." Which response is empathic?',
    options: [
      '"You should look for a new job."',
      '"At least you have a job."',
      '"Are you feeling exhausted because you needed more support today?"',
      '"I had a bad day too, let me tell you about it."',
    ],
    correctAnswer: 2,
    explanation: 'Empathy means being present with the other person\'s feelings and needs. "You should look for a new job" is advising, "At least you have a job" is minimizing, and "I had a bad day too" is one-upping -- all empathy blockers that shift attention away from the person.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'empathy',
    tier: 2,
  },
  {
    id: 't2-emp-2',
    type: 'empathy-check',
    question: 'A child says "Nobody wants to play with me." Which is the empathic response?',
    options: [
      '"That\'s not true, lots of kids like you!"',
      '"Just go ask someone to play."',
      '"Are you feeling sad because you want to be included?"',
      '"When I was your age, the same thing happened to me."',
    ],
    correctAnswer: 2,
    explanation: 'Empathy reflects back feelings (sad) and needs (inclusion) without fixing, correcting, or making it about yourself. "That\'s not true" is correcting, "Just go ask" is advising, and "When I was your age" is one-upping.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'empathy',
    tier: 2,
  },

  // Additional fill-blank exercises for Tier 2
  {
    id: 't2-fill-3',
    type: 'fill-blank',
    question: 'Transform a faux feeling into a genuine feeling and need:',
    fillBlankData: {
      sentence: 'Instead of "I feel unappreciated," say: "I feel ___ because I need ___."',
      blankOptions: ['sad', 'recognition', 'unappreciated', 'you to thank me', 'discouraged', 'acknowledgment'],
      correctBlanks: ['sad', 'recognition'],
    },
    options: [
      'unappreciated / you to thank me',
      'sad / recognition',
      'hurt / appreciation',
      'angry / gratitude',
    ],
    correctAnswer: 1,
    explanation: '"Sad" is a genuine feeling (unlike "unappreciated" which implies what others should do). "Recognition" is a universal need (not "you to thank me" which is a strategy).',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },
  {
    id: 't2-fill-4',
    type: 'fill-blank',
    question: 'Complete this request so it is specific and doable:',
    fillBlankData: {
      sentence: 'Would you be willing to ___ when you get home?',
      blankOptions: ['text me', 'be more thoughtful', 'care about me', 'remember me', 'call me', 'think of me'],
      correctBlanks: ['text me'],
    },
    options: [
      'be more thoughtful',
      'text me',
      'care about me',
      'remember me',
    ],
    correctAnswer: 1,
    explanation: '"Text me" is specific and doable. "Be more thoughtful," "care about me," and "remember me" are vague and cannot be clearly acted upon.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'requests',
    tier: 2,
  },
  {
    id: 't2-fill-5',
    type: 'fill-blank',
    question: 'Distinguish between a need and a strategy:',
    fillBlankData: {
      sentence: '"I need you to call me every day" is a ___. The underlying need might be ___.',
      blankOptions: ['strategy', 'connection', 'need', 'phone calls', 'demand', 'communication'],
      correctBlanks: ['strategy', 'connection'],
    },
    options: [
      'need / phone calls',
      'strategy / connection',
      'demand / attention',
      'request / talking',
    ],
    correctAnswer: 1,
    explanation: '"Call me every day" is a specific strategy (one way to meet a need). The universal need underneath might be connection, reassurance, or closeness.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'needs',
    tier: 2,
  },
  {
    id: 't2-fill-6',
    type: 'fill-blank',
    question: 'Transform this blaming statement into an NVC statement:',
    fillBlankData: {
      sentence: '"You made me angry" becomes: "I feel ___ because I need ___."',
      blankOptions: ['angry', 'respect', 'mad at you', 'you to stop', 'frustrated', 'consideration'],
      correctBlanks: ['angry', 'respect'],
    },
    options: [
      'mad at you / you to stop',
      'angry / respect',
      'frustrated / you to change',
      'upset / better treatment',
    ],
    correctAnswer: 1,
    explanation: 'Taking responsibility for feelings means connecting them to YOUR needs, not to what someone else did. "Angry because I need respect" owns the feeling.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },
  {
    id: 't2-fill-7',
    type: 'fill-blank',
    question: 'Complete the empathic response:',
    fillBlankData: {
      sentence: 'It sounds like you\'re feeling ___ because you need ___?',
      blankOptions: ['overwhelmed', 'support', 'stressed out', 'help', 'tired', 'rest'],
      correctBlanks: ['overwhelmed', 'support'],
    },
    options: [
      'stressed out / help',
      'overwhelmed / support',
      'tired / rest',
      'frustrated / someone to listen',
    ],
    correctAnswer: 1,
    explanation: 'Empathic responses guess at feelings (overwhelmed) and needs (support) to help the other person feel understood.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'empathy',
    tier: 2,
  },
  {
    id: 't2-fill-8',
    type: 'fill-blank',
    question: 'Express this need as a clear request:',
    fillBlankData: {
      sentence: 'Would you be ___ to ___ when you get home?',
      blankOptions: ['willing', 'call me', 'able', 'remember', 'going', 'text'],
      correctBlanks: ['willing', 'call me'],
    },
    options: [
      'able / remember to call',
      'willing / call me',
      'going / text me',
      'ready / contact me',
    ],
    correctAnswer: 1,
    explanation: '"Would you be willing" is the classic NVC request opener - it respects autonomy and invites a genuine yes or no.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'requests',
    tier: 2,
  },
  {
    id: 't2-fill-9',
    type: 'fill-blank',
    question: 'Identify what is an observation vs an evaluation:',
    fillBlankData: {
      sentence: 'When you ___ (observation), I thought you were ___ (evaluation).',
      blankOptions: ['didn\'t respond to my text', 'ignoring me', 'were silent', 'being rude', 'left the room', 'upset'],
      correctBlanks: ['didn\'t respond to my text', 'ignoring me'],
    },
    options: [
      'were silent / upset',
      'didn\'t respond to my text / ignoring me',
      'left the room / being rude',
      'said nothing / angry',
    ],
    correctAnswer: 1,
    explanation: '"Didn\'t respond to my text" is observable behavior. "Ignoring me" is our evaluation/interpretation of that behavior.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'observations',
    tier: 2,
  },
  {
    id: 't2-fill-10',
    type: 'fill-blank',
    question: 'Transform "I feel rejected" into genuine feeling + need:',
    fillBlankData: {
      sentence: 'I feel ___ because I need ___.',
      blankOptions: ['hurt', 'acceptance', 'rejected', 'you to include me', 'sad', 'belonging'],
      correctBlanks: ['hurt', 'acceptance'],
    },
    options: [
      'rejected / you to include me',
      'hurt / acceptance',
      'sad / belonging',
      'left out / to be wanted',
    ],
    correctAnswer: 1,
    explanation: '"Rejected" is a faux feeling. The genuine feeling might be "hurt" and the need is "acceptance" - a universal human need.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 2,
  },
];

// ============================================================================
// TIER 3: BUILDING SKILLS (40-75 exercises completed)
// Focus: Jackal-to-giraffe translations, NVC sentence building, empathy,
//        receiving messages practice, request crafting
// ============================================================================

const TIER_3_EXERCISES: Exercise[] = [
  // Jackal to Giraffe Translations
  {
    id: 't3-jg-1',
    type: 'jackal-to-giraffe',
    question: 'Transform this jackal thought: "You never help around the house!"',
    options: [
      'When I see dishes in the sink after dinner, I feel frustrated because I need support.',
      'You\'re so lazy and inconsiderate!',
      'Why can\'t you just be more helpful?',
      'I feel like you don\'t care about the house.',
    ],
    correctAnswer: 0,
    explanation: 'The giraffe version states an observation (dishes in sink), a feeling (frustrated), and a need (support) without blame or judgment.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },
  {
    id: 't3-jg-2',
    type: 'jackal-to-giraffe',
    question: 'Transform this jackal thought: "You\'re being so selfish!"',
    options: [
      'Why do you always think only about yourself?',
      'When you made plans without checking with me, I felt hurt because I value being considered.',
      'You clearly don\'t care about anyone but yourself.',
      'I feel like you\'re selfish.',
    ],
    correctAnswer: 1,
    explanation: 'The giraffe version describes the specific action, the feeling (hurt), and the underlying value (being considered) without labeling the person.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },
  {
    id: 't3-jg-3',
    type: 'jackal-to-giraffe',
    question: 'Transform: "My boss is a terrible communicator."',
    options: [
      'My boss is incompetent at their job.',
      'I feel frustrated when expectations aren\'t clearly stated because I need clarity to do my best work.',
      'I feel like my boss doesn\'t know how to communicate.',
      'Why can\'t my boss just be clearer?',
    ],
    correctAnswer: 1,
    explanation: 'Instead of labeling the boss, the giraffe version expresses the situation, feeling (frustrated), and need (clarity) in a constructive way.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },
  {
    id: 't3-jg-4',
    type: 'jackal-to-giraffe',
    question: 'Transform: "You\'re always on your phone!"',
    options: [
      'Can\'t you ever put that thing down?',
      'When I see you on your phone during dinner, I feel disconnected because I value quality time together.',
      'You\'re addicted to your phone.',
      'I feel ignored when you use your phone.',
    ],
    correctAnswer: 1,
    explanation: 'The giraffe version is specific (during dinner), names the feeling (disconnected), and identifies the need (quality time) without accusations.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },
  {
    id: 't3-jg-5',
    type: 'jackal-to-giraffe',
    question: 'Transform: "You\'re so irresponsible with money!"',
    options: [
      'You need to learn how to budget.',
      'I feel anxious when I see unexpected charges because I need financial security.',
      'You always waste money on stupid things.',
      'I feel like you don\'t care about our finances.',
    ],
    correctAnswer: 1,
    explanation: 'The giraffe version states an observation (unexpected charges), feeling (anxious), and need (financial security) without attacking.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },

  // Empathy vs Non-Empathy Recognition
  {
    id: 't3-emp-1',
    type: 'empathy-check',
    question: 'Someone says "I\'m so stressed about this deadline." Which response shows empathy?',
    options: [
      '"You should have started earlier."',
      '"Are you feeling overwhelmed because you need more time?"',
      '"Don\'t worry, it\'ll be fine."',
      '"I know exactly how you feel - I had the same thing last week."',
    ],
    correctAnswer: 1,
    explanation: 'Empathy reflects back feelings and needs. Advising, consoling, and one-upping are NOT empathy.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'empathy',
    tier: 3,
  },
  {
    id: 't3-emp-2',
    type: 'empathy-check',
    question: 'A friend says "My partner forgot our anniversary." Which is the empathic response?',
    options: [
      '"That\'s terrible! They should know better."',
      '"Maybe they\'ve been stressed with work?"',
      '"Are you feeling hurt because being remembered matters to you?"',
      '"You should tell them how you feel."',
    ],
    correctAnswer: 2,
    explanation: 'Empathy connects to the person\'s feelings and needs. The others defend, advise, or join in criticism.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'empathy',
    tier: 3,
  },
  {
    id: 't3-emp-3',
    type: 'empathy-check',
    question: 'Someone says "I failed my exam." Which response demonstrates empathy?',
    options: [
      '"What happened? Did you study enough?"',
      '"You\'ll do better next time!"',
      '"Sounds like you\'re disappointed - you put a lot of effort into this?"',
      '"That professor is probably too hard anyway."',
    ],
    correctAnswer: 2,
    explanation: 'Empathy reflects the feeling (disappointed) and guesses at the need (recognition of effort). The others interrogate, console, or blame.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'empathy',
    tier: 3,
  },
  {
    id: 't3-emp-4',
    type: 'empathy-check',
    question: '"My mom is always criticizing me." Which response is empathic?',
    options: [
      '"Have you tried talking to her about it?"',
      '"Parents can be so difficult."',
      '"It sounds like you\'re hurting - you want acceptance from her?"',
      '"She probably means well."',
    ],
    correctAnswer: 2,
    explanation: 'Empathy connects to feelings (hurting) and needs (acceptance). Advising, commiserating, and defending are not empathy.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'empathy',
    tier: 3,
  },

  // NVC Sentence Building and Requests
  {
    id: 't3-build-1',
    type: 'fill-blank',
    question: 'Build a complete NVC statement by filling in the blanks:',
    fillBlankData: {
      sentence: 'When you ___, I feel ___ because I need ___.',
      blankOptions: ['arrived 30 minutes after we agreed', 'anxious', 'reliability', 'are late', 'disrespect me', 'you to be on time'],
      correctBlanks: ['arrived 30 minutes after we agreed', 'anxious', 'reliability'],
    },
    options: [
      'are late / angry / you to be on time',
      'arrived 30 minutes after we agreed / anxious / reliability',
      'disrespect me / hurt / respect',
      'don\'t care / sad / caring',
    ],
    correctAnswer: 1,
    explanation: 'A complete NVC statement needs: a specific observation (not "are late"), a genuine feeling (not blame), and a universal need (not a strategy).',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },
  {
    id: 't3-fill-1',
    type: 'fill-blank',
    question: 'Transform this jackal thought into giraffe language:',
    fillBlankData: {
      sentence: '"You never listen!" becomes: "When you ___, I feel ___ because I need ___."',
      blankOptions: ['look at your phone while I talk', 'hurt', 'to be heard', 'ignore me', 'frustrated', 'attention'],
      correctBlanks: ['look at your phone while I talk', 'hurt', 'to be heard'],
    },
    options: [
      'ignore me / frustrated / attention',
      'look at your phone while I talk / hurt / to be heard',
      'don\'t care / angry / respect',
      'tune out / sad / connection',
    ],
    correctAnswer: 1,
    explanation: 'The giraffe version uses a specific observation, a genuine feeling, and a universal need instead of the vague judgment "never listen."',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },
  {
    id: 't3-fill-2',
    type: 'fill-blank',
    question: 'Complete this request to make it truly a request (not a demand):',
    fillBlankData: {
      sentence: '___ you be ___ to let me know if you\'ll be late?',
      blankOptions: ['Would', 'willing', 'Can', 'able', 'Should', 'going'],
      correctBlanks: ['Would', 'willing'],
    },
    options: [
      'Can you be able',
      'Would you be willing',
      'Should you be going',
      'Will you be ready',
    ],
    correctAnswer: 1,
    explanation: '"Would you be willing" signals a true request because it invites a genuine yes or no, respecting the other person\'s autonomy.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'requests',
    tier: 3,
  },
  {
    id: 't3-build-2',
    type: 'scenario',
    question: 'Which is a proper request (not a demand)?',
    options: [
      'You need to stop doing that.',
      'Would you be willing to text me if you\'re running late?',
      'Just be more considerate next time.',
      'I need you to change.',
    ],
    correctAnswer: 1,
    explanation: '"Would you be willing..." is a true request because it\'s specific, actionable, and leaves room for the other person to say no.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'requests',
    tier: 3,
  },
  {
    id: 't3-build-3',
    type: 'scenario',
    question: 'Which request is specific and doable?',
    options: [
      'Be more supportive.',
      'Would you be willing to listen for five minutes while I share what\'s on my mind?',
      'Stop being so negative.',
      'I want you to care more.',
    ],
    correctAnswer: 1,
    explanation: '"Listen for five minutes" is specific and doable. "Be more supportive" and "care more" are vague. "Stop being negative" is about what NOT to do.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'requests',
    tier: 3,
  },
  {
    id: 't3-build-4',
    type: 'scenario',
    question: 'What makes this a demand rather than a request? "You have to apologize."',
    options: [
      'It\'s too short.',
      'It doesn\'t use "please."',
      'It leaves no room for "no" - it\'s telling, not asking.',
      'It\'s about feelings.',
    ],
    correctAnswer: 2,
    explanation: 'A request becomes a demand when there\'s no genuine room for the other person to decline. "You have to" commands rather than asks.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'requests',
    tier: 3,
  },

  // Advanced Faux Feelings
  {
    id: 't3-faux-1',
    type: 'feeling-or-faux',
    question: '"I feel like you don\'t understand me" -- Genuine feeling or faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: 'This is a thought, not a feeling! "I feel like..." is usually followed by a thought. The real feeling might be "frustrated," "disconnected," or "sad."',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 3,
  },
  {
    id: 't3-faux-2',
    type: 'feeling-or-faux',
    question: '"I feel pressured" -- Genuine feeling or faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Pressured" implies someone is doing the pressing. Genuine feelings underneath might be "anxious," "overwhelmed," or "tense."',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 3,
  },
  {
    id: 't3-faux-3',
    type: 'feeling-or-faux',
    question: '"I feel that this isn\'t fair" -- Genuine feeling or faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"I feel that..." is a thought, not a feeling. The genuine feelings might be "frustrated," "disappointed," or "hurt."',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 3,
  },
  {
    id: 't3-faux-4',
    type: 'feeling-or-faux',
    question: '"I feel hopeful" -- Genuine feeling or faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 0,
    explanation: '"Hopeful" is a genuine feeling! It describes an internal state of optimism and anticipation.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'feelings',
    tier: 3,
  },

  // Complex Need Identification
  {
    id: 't3-need-1',
    type: 'need-finder',
    question: 'Someone says "I just want to be left alone!" What need are they likely trying to meet?',
    options: ['Connection', 'Space/Solitude', 'Understanding', 'Celebration'],
    correctAnswer: 1,
    explanation: 'While it might seem like they\'re rejecting connection, they\'re expressing a need for space, solitude, or perhaps rest and recovery.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'needs',
    tier: 3,
  },
  {
    id: 't3-need-2',
    type: 'need-finder',
    question: 'A friend keeps checking their phone during dinner. What need might THEY be trying to meet?',
    options: ['Disrespect', 'Connection (with others)', 'Stimulation/Engagement', 'Order'],
    correctAnswer: 2,
    explanation: 'From their perspective, they might have unmet needs for stimulation, engagement, or connection with others via phone.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'needs',
    tier: 3,
  },
  {
    id: 't3-need-3',
    type: 'need-finder',
    question: 'Someone angrily says "You always do this!" What need might be unmet?',
    options: ['Consistency/Reliability', 'Submission', 'Being right', 'Revenge'],
    correctAnswer: 0,
    explanation: 'Behind the judgment "always" is often an unmet need for consistency, reliability, or trust.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'needs',
    tier: 3,
  },

  // Receiving messages practice -- deeper
  {
    id: 't3-recv-1',
    type: 'scenario',
    question: 'Your boss says "This report is terrible." You feel a sting. What is the giraffe-ears-inward response (sensing your own feelings and needs)?',
    options: [
      '"I know, I\'m not good at my job."',
      '"I feel anxious hearing that because I value doing quality work and I need clarity about what to improve."',
      '"Your feedback is terrible!"',
      '"Whatever, I don\'t care what you think."',
    ],
    correctAnswer: 1,
    explanation: 'Giraffe ears inward means tuning into YOUR feelings (anxious) and needs (quality, clarity) rather than absorbing the judgment or deflecting.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },
  {
    id: 't3-recv-2',
    type: 'scenario',
    question: 'Your boss says "This report is terrible." What is the giraffe-ears-outward response (sensing THEIR feelings and needs)?',
    options: [
      '"You\'re being harsh and unfair."',
      '"Are you frustrated because you were hoping for something different? I\'d like to understand what would work better."',
      '"Then do it yourself."',
      '"I feel attacked."',
    ],
    correctAnswer: 1,
    explanation: 'Giraffe ears outward means hearing their feelings (frustrated) and needs (quality, specific expectations) behind their judgment, then offering to connect.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },

  // Three stages of emotional development
  {
    id: 't3-stages-1',
    type: 'scenario',
    question: 'In NVC, someone who says "I can\'t go out tonight, my mom will be upset" is at which stage of emotional development?',
    options: [
      'Emotional Liberation -- taking responsibility for their own actions',
      'Emotional Slavery -- feeling responsible for others\' feelings',
      'Obnoxious Stage -- refusing to care what anyone thinks',
      'Mastery Stage -- fully integrated NVC',
    ],
    correctAnswer: 1,
    explanation: 'Emotional Slavery is when we feel responsible for other people\'s feelings. We limit our own choices because we believe we cause others\' emotions.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },
  {
    id: 't3-stages-2',
    type: 'scenario',
    question: 'Someone says "I don\'t care if my mom gets upset -- that\'s HER problem, not mine!" This is which stage?',
    options: [
      'Emotional Slavery',
      'Emotional Liberation',
      'The Obnoxious Stage',
      'Self-Empathy',
    ],
    correctAnswer: 2,
    explanation: 'The Obnoxious Stage is a common reaction to discovering we\'re not responsible for others\' feelings. People swing to "I don\'t care about anyone!" before reaching Emotional Liberation.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },

  // Additional fill-blank exercises for Tier 3
  {
    id: 't3-fill-3',
    type: 'fill-blank',
    question: 'Build a complete NVC statement for someone who keeps interrupting:',
    fillBlankData: {
      sentence: 'When you ___, I feel ___ because I need ___. Would you be willing to ___?',
      blankOptions: ['speak before I finish', 'frustrated', 'to be heard', 'let me complete my thought', 'interrupt me', 'annoyed', 'respect', 'stop talking'],
      correctBlanks: ['speak before I finish', 'frustrated', 'to be heard', 'let me complete my thought'],
    },
    options: [
      'interrupt me / annoyed / respect / stop talking',
      'speak before I finish / frustrated / to be heard / let me complete my thought',
      'cut me off / angry / attention / listen better',
      'talk over me / hurt / consideration / be quiet',
    ],
    correctAnswer: 1,
    explanation: '"Speak before I finish" is an observation (not "interrupt" which is a label). "Frustrated" is a feeling. "To be heard" is a need. "Let me complete my thought" is specific and doable.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },
  {
    id: 't3-fill-4',
    type: 'fill-blank',
    question: 'Transform "You never help me!" into giraffe language:',
    fillBlankData: {
      sentence: 'When I ___ alone, I feel ___ because I need ___.',
      blankOptions: ['do the housework', 'overwhelmed', 'support', 'am left', 'abandoned', 'help', 'tired', 'partnership'],
      correctBlanks: ['do the housework', 'overwhelmed', 'support'],
    },
    options: [
      'am left / abandoned / help',
      'do the housework / overwhelmed / support',
      'work / tired / rest',
      'struggle / alone / partnership',
    ],
    correctAnswer: 1,
    explanation: '"Do the housework alone" is specific. "Overwhelmed" is a genuine feeling (not "abandoned" which is a faux feeling). "Support" is a universal need.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },
  {
    id: 't3-fill-5',
    type: 'fill-blank',
    question: 'Create an empathic guess for someone who says "My boss hates me":',
    fillBlankData: {
      sentence: 'Are you feeling ___ because you need ___ at work?',
      blankOptions: ['anxious', 'security', 'hated', 'your boss to change', 'worried', 'appreciation', 'scared', 'recognition'],
      correctBlanks: ['anxious', 'security'],
    },
    options: [
      'hated / your boss to change',
      'anxious / security',
      'angry / respect',
      'sad / a new job',
    ],
    correctAnswer: 1,
    explanation: 'An empathic guess reflects a genuine feeling (anxious, not hated) connected to a universal need (security). We avoid reinforcing the judgment about the boss.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'empathy',
    tier: 3,
  },
  {
    id: 't3-fill-6',
    type: 'fill-blank',
    question: 'Complete this request to make it clear and positive (what TO do, not what NOT to do):',
    fillBlankData: {
      sentence: 'Instead of "Don\'t yell at me," say: "Would you be willing to ___ when you feel ___?"',
      blankOptions: ['speak more quietly', 'frustrated', 'stop yelling', 'angry', 'lower your voice', 'upset', 'calm down', 'mad'],
      correctBlanks: ['speak more quietly', 'frustrated'],
    },
    options: [
      'stop yelling / angry',
      'speak more quietly / frustrated',
      'calm down / upset',
      'be nicer / mad',
    ],
    correctAnswer: 1,
    explanation: 'Requests are clearer when they describe what we want (speak more quietly) rather than what we don\'t want (don\'t yell). "Frustrated" acknowledges their emotion.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'requests',
    tier: 3,
  },
  {
    id: 't3-fill-7',
    type: 'fill-blank',
    question: 'Transform this criticism into an observation + feeling:',
    fillBlankData: {
      sentence: '"You\'re always on your phone" becomes: "When I see you ___, I feel ___."',
      blankOptions: ['looking at your phone during dinner', 'lonely', 'ignoring me', 'hurt', 'on your phone constantly', 'disconnected'],
      correctBlanks: ['looking at your phone during dinner', 'lonely'],
    },
    options: [
      'ignoring me / hurt',
      'looking at your phone during dinner / lonely',
      'on your phone constantly / disconnected',
      'distracted / sad',
    ],
    correctAnswer: 1,
    explanation: '"Looking at your phone during dinner" is specific and observable. "Lonely" is a genuine feeling, unlike "ignored" which is a faux feeling.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'observations',
    tier: 3,
  },
  {
    id: 't3-fill-8',
    type: 'fill-blank',
    question: 'Complete this self-empathy statement:',
    fillBlankData: {
      sentence: 'I\'m noticing I feel ___ right now because I need ___.',
      blankOptions: ['anxious', 'clarity', 'worried', 'answers', 'scared', 'safety'],
      correctBlanks: ['anxious', 'clarity'],
    },
    options: [
      'worried / answers',
      'anxious / clarity',
      'scared / safety',
      'stressed / to know what\'s happening',
    ],
    correctAnswer: 1,
    explanation: 'Self-empathy means checking in with your own feelings (anxious) and connecting them to needs (clarity). This builds self-awareness.',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'self-care',
    tier: 3,
  },
  {
    id: 't3-fill-9',
    type: 'fill-blank',
    question: 'How would you express appreciation in NVC?',
    fillBlankData: {
      sentence: 'When you ___, I felt ___ because my need for ___ was met.',
      blankOptions: ['listened without interrupting', 'grateful', 'being heard', 'were nice', 'happy', 'attention'],
      correctBlanks: ['listened without interrupting', 'grateful', 'being heard'],
    },
    options: [
      'were nice / happy / attention',
      'listened without interrupting / grateful / being heard',
      'helped me / relieved / support',
      'cared / touched / love',
    ],
    correctAnswer: 1,
    explanation: 'NVC appreciation includes: what they did (specific action), how you felt, and what need it met. This is more connecting than a simple "thank you."',
    xpReward: 20,
    difficulty: 'intermediate',
    category: 'integration',
    tier: 3,
  },
];

// ============================================================================
// TIER 4: ADVANCED PRACTICE (75-120 exercises completed)
// Focus: Full scenario responses, expressing anger with NVC, self-empathy,
//        real-world workplace/family/relationship scenarios
// ============================================================================

const TIER_4_EXERCISES: Exercise[] = [
  // Full Scenario Practice
  {
    id: 't4-sc-1',
    type: 'scenario',
    question: 'Your roommate left dirty dishes in the sink again. Which response follows NVC principles?',
    options: [
      '"You\'re so messy! Clean up after yourself!"',
      '"I noticed the dishes from last night are still in the sink. I feel frustrated because I value a clean shared space. Would you be willing to wash them before dinner?"',
      '"I feel like you don\'t respect our living space."',
      '"Whatever, I\'ll just do it myself like always."',
    ],
    correctAnswer: 1,
    explanation: 'This response includes all four NVC components: Observation, Feeling, Need, and Request.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-sc-2',
    type: 'scenario',
    question: 'Your partner forgot your anniversary. Which NVC response works best?',
    options: [
      '"You obviously don\'t care about us anymore."',
      '"I feel disappointed that our anniversary wasn\'t acknowledged because celebrating our relationship matters to me. Could we plan something special this weekend?"',
      '"I feel forgotten and unimportant."',
      '"Fine. I\'ll remember this."',
    ],
    correctAnswer: 1,
    explanation: 'This response expresses disappointment (genuine feeling), the unmet need (celebrating the relationship), and makes a specific request.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-sc-3',
    type: 'scenario',
    question: 'A coworker takes credit for your idea in a meeting. Best NVC response to say later?',
    options: [
      '"You stole my idea and that\'s not okay!"',
      '"When the idea I shared with you was presented as yours in the meeting, I felt confused and hurt because I value recognition. Could we talk about how to handle shared ideas?"',
      '"I feel backstabbed by you."',
      '"I guess I can\'t trust you anymore."',
    ],
    correctAnswer: 1,
    explanation: 'States the specific observation, genuine feelings (confused, hurt), the need (recognition), and makes a collaborative request.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-sc-4',
    type: 'scenario',
    question: 'You\'re in a heated argument and your partner says "You never listen!" What\'s the most NVC-aligned response?',
    options: [
      '"That\'s not true, I always listen!"',
      '"Are you feeling frustrated because you really want to be heard right now?"',
      '"Well, you never listen to me either!"',
      '"I feel attacked when you say that."',
    ],
    correctAnswer: 1,
    explanation: 'Reflecting their feeling and need (empathic guessing) de-escalates conflict. Even if wrong, it shows you\'re trying to understand.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-sc-5',
    type: 'scenario',
    question: 'Your teenager rolls their eyes when you ask about homework. Best NVC response?',
    options: [
      '"Don\'t roll your eyes at me! That\'s disrespectful!"',
      '"I notice you rolled your eyes. I\'m curious -- are you feeling frustrated? Is there something about homework stressing you?"',
      '"I feel disrespected when you do that."',
      '"Why do you always have an attitude?"',
    ],
    correctAnswer: 1,
    explanation: 'Rather than labeling behavior as "disrespectful," showing genuine curiosity about their feelings opens dialogue.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-sc-6',
    type: 'scenario',
    question: 'A friend cancels plans last minute -- for the third time. What\'s the NVC approach?',
    options: [
      '"You\'re so unreliable. I can\'t count on you."',
      '"The last three times we made plans, they were cancelled the day of. I feel disappointed and confused. I value our friendship -- is something going on?"',
      '"I feel like you don\'t value our friendship."',
      '"Whatever. Don\'t bother making plans next time."',
    ],
    correctAnswer: 1,
    explanation: 'States the observation, genuine feelings, expresses care, and opens with curiosity rather than judgment.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },

  // Expressing Anger with NVC
  {
    id: 't4-anger-1',
    type: 'anger-nvc',
    question: 'What\'s the first step in expressing anger the NVC way?',
    options: [
      'Tell the person what they did wrong.',
      'Stop and breathe - don\'t act from the anger.',
      'Suppress the anger and calm down.',
      'Walk away and don\'t deal with it.',
    ],
    correctAnswer: 1,
    explanation: 'The first step is to STOP. Anger signals important information, but acting FROM anger often doesn\'t serve us.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-anger-2',
    type: 'anger-nvc',
    question: 'In NVC, anger is seen as:',
    options: [
      'A bad emotion to avoid.',
      'A signal that we have a judgment AND an unmet need.',
      'Something the other person caused.',
      'A manipulation tactic.',
    ],
    correctAnswer: 1,
    explanation: 'Anger tells us we have both a judgment (what SHOULD be happening) AND an unmet need underneath it.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-anger-3',
    type: 'anger-nvc',
    question: 'Transform: "I\'m furious you broke your promise!"',
    options: [
      '"You\'re untrustworthy!"',
      '"When you said you\'d call and didn\'t, I felt really hurt because trust and reliability matter deeply to me."',
      '"I feel betrayed."',
      '"You always break your promises."',
    ],
    correctAnswer: 1,
    explanation: 'Instead of attacking or using faux feelings, express the observation, genuine feeling (hurt), and need (trust, reliability).',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-anger-4',
    type: 'anger-nvc',
    question: 'You\'re angry because a colleague undermined you in a meeting. What\'s underneath the anger?',
    options: [
      'They\'re a terrible person.',
      'Unmet needs for respect, consideration, and being valued.',
      'They need to be punished.',
      'Life is unfair.',
    ],
    correctAnswer: 1,
    explanation: 'Under anger, we find unmet needs -- perhaps for respect, being valued, fairness, or trust.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-anger-5',
    type: 'jackal-to-giraffe',
    question: 'Transform: "You make me so angry when you do that!"',
    options: [
      'When you raise your voice, I feel angry because I need respect.',
      'You always make me angry.',
      'I\'m angry because of what you did.',
      'When you speak loudly, I notice tension in my chest. I\'m needing calm and understanding right now.',
    ],
    correctAnswer: 3,
    explanation: 'The best giraffe version takes FULL ownership of feelings (not "you make me"). It describes the physical sensation and the need without blame.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },

  // Self-Empathy Exercises
  {
    id: 't4-self-1',
    type: 'self-empathy',
    question: 'You made a mistake at work and think "I\'m so stupid." How would you give yourself self-empathy?',
    options: [
      'Just try harder next time.',
      'Everyone makes mistakes, no big deal.',
      'I\'m feeling embarrassed because I value competence. What need was I trying to meet when I made that choice?',
      'Stop being so hard on yourself.',
    ],
    correctAnswer: 2,
    explanation: 'Self-empathy involves connecting to your feelings and needs with compassion, not dismissing or pushing through.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 4,
  },
  {
    id: 't4-self-2',
    type: 'self-empathy',
    question: 'You snapped at your child and feel guilty. Self-empathy would be:',
    options: [
      '"I\'m a terrible parent."',
      '"I was just tired, it\'s not my fault."',
      '"I\'m feeling regret because I care deeply about being patient and kind with my child. I was trying to meet my need for ease when I was exhausted."',
      '"I\'ll just apologize and move on."',
    ],
    correctAnswer: 2,
    explanation: 'Self-empathy translates judgment into feelings and needs, and recognizes the need we were trying to meet.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 4,
  },
  {
    id: 't4-self-3',
    type: 'self-empathy',
    question: 'What\'s the NVC approach to guilt?',
    options: [
      'Feel bad so you don\'t do it again.',
      'Mourn the unmet need, learn, and move on.',
      'Blame circumstances.',
      'Punish yourself to make amends.',
    ],
    correctAnswer: 1,
    explanation: 'NVC suggests mourning (acknowledging the loss), learning (connecting to needs), and moving forward rather than self-punishment.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 4,
  },
  {
    id: 't4-self-4',
    type: 'self-empathy',
    question: 'You didn\'t get the promotion. Self-empathy sounds like:',
    options: [
      '"I\'m not good enough."',
      '"They don\'t know what they\'re missing."',
      '"I\'m feeling disappointed and sad. I was really wanting recognition for my work and growth in my career."',
      '"Whatever, I didn\'t want it anyway."',
    ],
    correctAnswer: 2,
    explanation: 'Self-empathy names the feelings (disappointed, sad) and connects to the needs (recognition, growth).',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 4,
  },

  // Challenging Transformations
  {
    id: 't4-jg-1',
    type: 'jackal-to-giraffe',
    question: 'Transform: "Stop being so dramatic!"',
    options: [
      'You\'re overreacting as usual.',
      'I feel dismissed when you call me dramatic.',
      'When I hear strong emotions, I feel overwhelmed. I need some space to process. Would you be willing to pause for a moment?',
      'Could you calm down?',
    ],
    correctAnswer: 2,
    explanation: 'Instead of labeling someone "dramatic," the giraffe version owns our own overwhelm and makes a specific request.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-jg-2',
    type: 'jackal-to-giraffe',
    question: 'Transform: "You\'re so controlling!"',
    options: [
      'You need to back off.',
      'When you check in multiple times about my plans, I feel suffocated because I need autonomy and trust.',
      'I feel controlled.',
      'Why can\'t you just trust me?',
    ],
    correctAnswer: 1,
    explanation: 'States specific behavior, genuine feeling (suffocated), and needs (autonomy, trust) without character attacks.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-jg-3',
    type: 'jackal-to-giraffe',
    question: 'Transform: "You\'re being unreasonable!"',
    options: [
      'Just be logical for once.',
      'I feel confused when your reasoning differs from mine because I need understanding. Can you help me see your perspective?',
      'You\'re not making sense.',
      'I feel like you\'re being unfair.',
    ],
    correctAnswer: 1,
    explanation: 'Instead of "unreasonable" (judgment), express confusion (feeling) and a need for understanding, with a request to connect.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },

  // Request vs Demand - advanced
  {
    id: 't4-req-1',
    type: 'scenario',
    question: 'After making a request, your partner says "No, I don\'t want to do that." What makes your next response a demand vs a request?',
    options: [
      'Repeating the request louder',
      'Saying "fine" while giving them the silent treatment',
      'Accepting their "no" and exploring what WOULD work for both of you',
      'Explaining why they should do it',
    ],
    correctAnswer: 2,
    explanation: 'A true request allows "no." If you punish, guilt-trip, or withdraw when they decline, it was a demand. The NVC approach is to stay connected and find what meets both people\'s needs.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'requests',
    tier: 4,
  },
  {
    id: 't4-req-2',
    type: 'scenario',
    question: 'Which of these is a REQUEST for connection vs. a request for action?',
    options: [
      '"Would you be willing to take out the trash?"',
      '"Would you be willing to tell me how you feel about what I just said?"',
      '"Could you drive me to the store?"',
      '"Can you call the plumber tomorrow?"',
    ],
    correctAnswer: 1,
    explanation: 'NVC distinguishes between action requests (do something) and connection requests (tell me what you feel/need). Connection requests help ensure the other person feels heard, not just compliant.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'requests',
    tier: 4,
  },

  // Workplace NVC scenarios
  {
    id: 't4-work-1',
    type: 'scenario',
    question: 'In a meeting, your manager says "This team needs to step up. The quality has been dropping." How could you respond using NVC?',
    options: [
      '"That\'s not fair, we\'ve been working overtime!"',
      '"Hearing that, I\'m feeling concerned because I value doing quality work. Could you share specific examples so we can understand what you\'d like to see differently?"',
      '"I feel attacked."',
      '"Maybe you should manage us better."',
    ],
    correctAnswer: 1,
    explanation: 'The NVC response names your feeling (concerned), your need (quality), and makes a specific request for clarity, all without being defensive.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },

  // Emotional Liberation
  {
    id: 't4-lib-1',
    type: 'scenario',
    question: 'What does "Emotional Liberation" (stage 3) mean in NVC?',
    options: [
      'Never feeling emotions.',
      'Not caring about anyone else.',
      'Accepting responsibility for our own intentions and actions, but not for other people\'s feelings.',
      'Being able to control our emotions perfectly.',
    ],
    correctAnswer: 2,
    explanation: 'Emotional Liberation means we respond to others\' needs out of compassion, not guilt. We take responsibility for our intentions and actions, while understanding we are not the cause of others\' feelings.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },

  // Additional fill-blank exercises for Tier 4
  {
    id: 't4-fill-1',
    type: 'fill-blank',
    question: 'Practice self-empathy by completing this internal dialogue:',
    fillBlankData: {
      sentence: 'I\'m noticing I feel ___ right now. What I\'m really needing is ___.',
      blankOptions: ['tense', 'peace', 'stressed out', 'to relax', 'anxious', 'calm', 'overwhelmed', 'space'],
      correctBlanks: ['tense', 'peace'],
    },
    options: [
      'stressed out / to relax',
      'tense / peace',
      'anxious / things to slow down',
      'overwhelmed / less work',
    ],
    correctAnswer: 1,
    explanation: 'Self-empathy connects to feelings (tense) and underlying needs (peace). "To relax" and "things to slow down" are strategies, not needs.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 4,
  },
  {
    id: 't4-fill-2',
    type: 'fill-blank',
    question: 'Transform angry inner dialogue into self-empathy:',
    fillBlankData: {
      sentence: 'Instead of "I\'m such an idiot," try: "I\'m feeling ___ because I value ___ and want to learn from this."',
      blankOptions: ['embarrassed', 'competence', 'stupid', 'being perfect', 'disappointed', 'growth', 'frustrated', 'doing well'],
      correctBlanks: ['embarrassed', 'competence'],
    },
    options: [
      'stupid / being perfect',
      'embarrassed / competence',
      'angry / success',
      'bad / not making mistakes',
    ],
    correctAnswer: 1,
    explanation: 'Self-empathy replaces self-judgment with genuine feelings (embarrassed) and universal needs/values (competence). "Being perfect" is a strategy, not a need.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 4,
  },
  {
    id: 't4-fill-3',
    type: 'fill-blank',
    question: 'Express anger using NVC by identifying what\'s underneath:',
    fillBlankData: {
      sentence: 'When I feel angry, I can ask myself: "What ___ do I have about this situation, and what ___ is unmet?"',
      blankOptions: ['judgment', 'need', 'thought', 'feeling', 'expectation', 'want', 'belief', 'desire'],
      correctBlanks: ['judgment', 'need'],
    },
    options: [
      'thought / feeling',
      'judgment / need',
      'expectation / want',
      'belief / desire',
    ],
    correctAnswer: 1,
    explanation: 'Anger signals both a judgment (something SHOULD be different) and an unmet need. Identifying both helps transform anger into constructive expression.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-fill-4',
    type: 'fill-blank',
    question: 'Complete this workplace NVC statement:',
    fillBlankData: {
      sentence: 'When the deadline was moved up ___, I felt ___ because I need ___ to do quality work.',
      blankOptions: ['without notice', 'anxious', 'predictability', 'unfairly', 'stressed', 'more time', 'suddenly', 'panicked', 'planning'],
      correctBlanks: ['without notice', 'anxious', 'predictability'],
    },
    options: [
      'unfairly / stressed / more time',
      'without notice / anxious / predictability',
      'suddenly / panicked / help',
      'again / frustrated / respect',
    ],
    correctAnswer: 1,
    explanation: '"Without notice" is an observation. "Anxious" is a genuine feeling. "Predictability" is a universal need (unlike "more time" which is a strategy).',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
    tier: 4,
  },
  {
    id: 't4-fill-5',
    type: 'fill-blank',
    question: 'When receiving criticism, complete the giraffe-ears response:',
    fillBlankData: {
      sentence: 'It sounds like you\'re feeling ___ because you need ___?',
      blankOptions: ['frustrated', 'more clarity', 'annoyed with me', 'me to change', 'concerned', 'understanding'],
      correctBlanks: ['frustrated', 'more clarity'],
    },
    options: [
      'annoyed with me / me to change',
      'frustrated / more clarity',
      'concerned / understanding',
      'upset / an apology',
    ],
    correctAnswer: 1,
    explanation: 'Giraffe ears turn criticism into feelings and needs. "Frustrated" (feeling) and "clarity" (need) translate their words without defensiveness.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'empathy',
    tier: 4,
  },
  {
    id: 't4-fill-6',
    type: 'fill-blank',
    question: 'Transform inner critic to self-compassion:',
    fillBlankData: {
      sentence: '"I\'m so stupid" becomes: "I\'m feeling ___ because I need ___."',
      blankOptions: ['disappointed', 'self-acceptance', 'dumb', 'to be smarter', 'frustrated', 'understanding'],
      correctBlanks: ['disappointed', 'self-acceptance'],
    },
    options: [
      'dumb / to be smarter',
      'disappointed / self-acceptance',
      'frustrated / understanding',
      'ashamed / approval',
    ],
    correctAnswer: 1,
    explanation: 'Self-empathy transforms self-judgment into feelings (disappointed) connected to needs (self-acceptance). This builds self-compassion.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 4,
  },
  {
    id: 't4-fill-7',
    type: 'fill-blank',
    question: 'Complete this mourning statement:',
    fillBlankData: {
      sentence: 'When I think about what happened, I feel ___ because ___ really mattered to me.',
      blankOptions: ['sad', 'trust', 'angry', 'fairness', 'hurt', 'honesty'],
      correctBlanks: ['sad', 'trust'],
    },
    options: [
      'angry / fairness',
      'sad / trust',
      'hurt / honesty',
      'disappointed / loyalty',
    ],
    correctAnswer: 1,
    explanation: 'Mourning in NVC means connecting sadness to unmet needs. This helps us grieve without blame and understand what really matters to us.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 4,
  },
];

// ============================================================================
// TIER 5: MASTERY (120+ exercises completed)
// Focus: Multi-party conflicts, appreciation in NVC, advanced empathic
//        listening, protective vs punitive force, mourning, complex scenarios
// ============================================================================

const TIER_5_EXERCISES: Exercise[] = [
  // Multi-party Conflict Scenarios
  {
    id: 't5-multi-1',
    type: 'scenario',
    question: 'Two friends are fighting and both want you to take their side. NVC approach?',
    options: [
      'Pick the side that seems right.',
      'Tell them both to work it out themselves.',
      'Offer to reflect each person\'s feelings and needs to the other, helping them both feel heard.',
      'Stay completely neutral and offer no input.',
    ],
    correctAnswer: 2,
    explanation: 'You can serve as an empathic translator, helping each person feel heard by reflecting their feelings and needs.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },
  {
    id: 't5-multi-2',
    type: 'scenario',
    question: 'At a family gathering, your parent criticizes your sibling in front of everyone. How might you respond?',
    options: [
      'Defend your sibling and criticize the parent.',
      'Stay quiet to avoid conflict.',
      'Acknowledge both: "Dad, sounds like you\'re worried about [sibling]. And [sibling], I imagine that felt hurtful to hear?"',
      'Change the subject immediately.',
    ],
    correctAnswer: 2,
    explanation: 'Acknowledging both people\'s feelings creates connection rather than taking sides.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },
  {
    id: 't5-multi-3',
    type: 'scenario',
    question: 'Your team is in conflict over a project direction. As a leader, what\'s the NVC approach?',
    options: [
      'Make the decision yourself to end the conflict.',
      'Let them figure it out on their own.',
      'Ensure each person\'s needs are heard and understood before seeking solutions that work for everyone.',
      'Side with the majority opinion.',
    ],
    correctAnswer: 2,
    explanation: 'NVC-based leadership ensures all needs are heard first, then seeks solutions that address those needs.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },

  // NVC Appreciation
  {
    id: 't5-app-1',
    type: 'appreciation',
    question: 'What\'s the NVC way to express appreciation?',
    options: [
      '"You\'re such a good person!"',
      '"Thanks!"',
      '"When you helped with the dishes, I felt grateful because I really needed support tonight."',
      '"You\'re the best!"',
    ],
    correctAnswer: 2,
    explanation: 'NVC appreciation includes: what they did (observation), how you feel, and what need it met.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },
  {
    id: 't5-app-2',
    type: 'appreciation',
    question: 'Transform generic praise "You\'re so smart!" into NVC appreciation:',
    options: [
      '"You have a high IQ!"',
      '"Good job!"',
      '"When you explained that concept, I felt relieved and grateful because I was really needing clarity."',
      '"Keep being smart!"',
    ],
    correctAnswer: 2,
    explanation: 'Instead of labeling ("smart"), NVC appreciation specifies action, feeling, and need met.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },
  {
    id: 't5-app-3',
    type: 'appreciation',
    question: 'Why does NVC suggest avoiding judgmental praise like "Good job!"?',
    options: [
      'Praise is always bad.',
      'It creates dependency on external validation rather than connecting to needs.',
      'It takes too long.',
      'People don\'t like hearing good things.',
    ],
    correctAnswer: 1,
    explanation: 'Judgmental praise ("good," "great," "wonderful") can create dependency on external evaluation. NVC appreciation connects to needs.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },
  {
    id: 't5-app-4',
    type: 'appreciation',
    question: 'Express appreciation for a friend who listened to you vent:',
    options: [
      '"You\'re such a good listener!"',
      '"Thanks for being there."',
      '"When you sat with me and reflected back what I said, I felt relieved and cared for. I really needed to feel heard."',
      '"You\'re the best friend ever!"',
    ],
    correctAnswer: 2,
    explanation: 'Full NVC appreciation: observation (sat with me, reflected), feelings (relieved, cared for), need (to feel heard).',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },

  // Advanced Empathic Listening
  {
    id: 't5-empathy-1',
    type: 'empathy-check',
    question: 'Someone says "Nobody understands me." The deepest empathic response:',
    options: [
      '"I understand you."',
      '"That sounds frustrating."',
      '"Are you feeling lonely and longing to really be seen and understood?"',
      '"I\'m sure people understand you more than you think."',
    ],
    correctAnswer: 2,
    explanation: 'Deep empathy names feelings (lonely) AND needs (to be seen, understood) as a question, staying curious.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'empathy',
    tier: 5,
  },
  {
    id: 't5-empathy-2',
    type: 'empathy-check',
    question: 'How do you know when someone has received enough empathy?',
    options: [
      'When they say "thank you."',
      'After reflecting back once.',
      'When you sense a release of tension - they relax, maybe sigh, or shift topics naturally.',
      'After exactly three empathic guesses.',
    ],
    correctAnswer: 2,
    explanation: 'When someone feels fully heard, there\'s often a physical release -- relaxation, sighing, or naturally moving forward.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'empathy',
    tier: 5,
  },
  {
    id: 't5-empathy-3',
    type: 'empathy-check',
    question: 'Someone is expressing pain and you\'re struggling to stay present. What\'s the NVC approach?',
    options: [
      'Push through and keep listening.',
      'Give advice to end the conversation.',
      'Acknowledge you need a break: "I want to be present with you and I\'m noticing I need a few minutes. Can we continue in a bit?"',
      'Pretend to listen while thinking about something else.',
    ],
    correctAnswer: 2,
    explanation: 'Honest self-care is part of NVC. You can\'t give empathy from an empty cup.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'empathy',
    tier: 5,
  },
  {
    id: 't5-empathy-4',
    type: 'empathy-check',
    question: 'When someone is attacking you verbally, NVC suggests:',
    options: [
      'Defend yourself.',
      'Attack back.',
      'Try to hear the feelings and needs behind their words, even if expressed as criticism.',
      'Walk away immediately.',
    ],
    correctAnswer: 2,
    explanation: 'Behind criticism are unmet needs. "You never care about me!" might mean they\'re hurting and needing connection.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'empathy',
    tier: 5,
  },

  // Protective vs Punitive Force
  {
    id: 't5-force-1',
    type: 'scenario',
    question: 'A child is about to touch a hot stove. What\'s the NVC approach?',
    options: [
      'Let them learn from the consequence.',
      'Yell "NO!" and slap their hand.',
      'Quickly and gently move them away (protective force), then explain.',
      'Give a lecture about stove safety.',
    ],
    correctAnswer: 2,
    explanation: 'NVC distinguishes protective force (preventing harm without punishment) from punitive force (causing suffering to teach).',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },
  {
    id: 't5-force-2',
    type: 'scenario',
    question: 'Your employee made a costly mistake. What\'s the NVC approach?',
    options: [
      'Punish them so they learn.',
      'Ignore it to be nice.',
      'Understand what needs led to the action, discuss what needs weren\'t met by it, and collaborate on prevention.',
      'Fire them immediately.',
    ],
    correctAnswer: 2,
    explanation: 'NVC focuses on understanding needs and learning, not punishment which breeds resentment.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },

  // Mourning vs Depression
  {
    id: 't5-mourn-1',
    type: 'self-empathy',
    question: 'What\'s the difference between mourning and depression in NVC?',
    options: [
      'They\'re the same thing.',
      'Mourning connects us to needs; depression disconnects us through self-judgment.',
      'Depression is more serious.',
      'Mourning is for death only.',
    ],
    correctAnswer: 1,
    explanation: 'Mourning connects us to what we value. Depression often involves disconnection through self-judgment.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 5,
  },
  {
    id: 't5-mourn-2',
    type: 'self-empathy',
    question: 'You lost a job opportunity. Healthy mourning looks like:',
    options: [
      '"I\'m a failure and will never succeed."',
      '"I didn\'t want that job anyway."',
      '"I\'m feeling sad and disappointed. I was really wanting that opportunity for growth and security."',
      '"I need to immediately apply somewhere else."',
    ],
    correctAnswer: 2,
    explanation: 'Mourning involves connecting to the feelings and needs, not self-judgment or avoidance.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 5,
  },

  // Advanced Observation Practice
  {
    id: 't5-obs-1',
    type: 'spot-judgment',
    question: 'Which is an observation? (Tricky!)',
    options: [
      'Luke told me I don\'t look good in yellow.',
      'Luke criticized my outfit.',
      'Luke was being mean about my appearance.',
      'Luke was trying to make me feel bad.',
    ],
    correctAnswer: 0,
    explanation: '"Luke told me I don\'t look good in yellow" quotes what was actually said -- observable. The others add interpretation.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'observations',
    tier: 5,
  },
  {
    id: 't5-obs-2',
    type: 'spot-judgment',
    question: 'Spot the observation:',
    options: [
      'My aunt complains when I talk to her.',
      'My aunt said "You never visit anymore" three times during our call.',
      'My aunt is passive-aggressive.',
      'My aunt tries to guilt-trip me.',
    ],
    correctAnswer: 1,
    explanation: 'The specific words said, with count, are observable. "Complains," "passive-aggressive," and "guilt-trip" are interpretations.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'observations',
    tier: 5,
  },

  // Ultimate Integration
  {
    id: 't5-int-1',
    type: 'scenario',
    question: 'Someone says "You\'re the most selfish person I know!" How to respond with NVC?',
    options: [
      '"No I\'m not!"',
      '"You\'re more selfish than me!"',
      '"It sounds like you\'re really hurting. Are you needing more consideration from me?"',
      '"I feel attacked."',
    ],
    correctAnswer: 2,
    explanation: 'Hearing the feeling and need behind the attack creates connection instead of escalation.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },
  {
    id: 't5-int-2',
    type: 'scenario',
    question: 'You\'ve just learned a family member has a serious illness. Which is the NVC-aligned self-care response?',
    options: [
      '"I need to be strong for everyone."',
      '"I shouldn\'t burden others with my feelings."',
      'Allow yourself to feel the fear and sadness, connect with your need for their wellbeing, and seek support.',
      '"I\'ll deal with my feelings later."',
    ],
    correctAnswer: 2,
    explanation: 'NVC includes self-empathy -- allowing feelings, connecting to needs, and getting support.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 5,
  },

  // Advanced scenario: Rosenberg airport-inspired
  {
    id: 't5-ros-1',
    type: 'scenario',
    question: 'A stranger on the street says something hurtful to you, like "Watch where you\'re going, idiot!" In NVC, the most powerful response is:',
    options: [
      'Tell them off.',
      'Ignore them completely.',
      'Briefly wonder what unmet need might be behind their harshness, then give yourself empathy for how it felt to hear that.',
      'Apologize profusely.',
    ],
    correctAnswer: 2,
    explanation: 'With strangers, you may not have the opportunity for dialogue, but you can still practice giraffe ears: wonder about their need, and attend to your own feelings.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },

  // Using NVC with yourself: "should" language
  {
    id: 't5-should-1',
    type: 'self-empathy',
    question: 'You catch yourself thinking "I should exercise more." What\'s the NVC self-empathy translation?',
    options: [
      'Just force yourself to exercise.',
      '"What need am I trying to meet with exercise? Maybe health, vitality, or self-care. Am I choosing not to, or feeling stuck?"',
      'Ignore it and watch TV.',
      '"I\'m so lazy."',
    ],
    correctAnswer: 1,
    explanation: 'NVC suggests translating "should" into the needs behind it. When we connect to the need (health, vitality), motivation comes from choice rather than obligation.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 5,
  },

  // Empathy before education
  {
    id: 't5-empfirst-1',
    type: 'empathy-check',
    question: 'A friend shares they\'re scared about a medical diagnosis. You know a lot about their condition. What does NVC suggest?',
    options: [
      'Immediately share all the information you know to help them.',
      'Offer empathy first: "That sounds really scary. Are you wanting some support right now?" -- then ask if they want information.',
      '"Don\'t worry, lots of people recover from that."',
      '"You should see Dr. Smith, they\'re the best."',
    ],
    correctAnswer: 1,
    explanation: 'NVC teaches empathy before education. People can\'t absorb information when they\'re flooded with emotion. Connect first, then offer information IF they want it.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'empathy',
    tier: 5,
  },

  // Complex: NVC with people who don\'t know NVC
  {
    id: 't5-complex-1',
    type: 'scenario',
    question: 'You\'re practicing NVC but your family thinks it\'s weird when you name feelings and needs. What\'s the NVC approach?',
    options: [
      'Stop practicing NVC around them.',
      'Lecture them about why NVC is better.',
      'Continue practicing naturally. Focus on the intention (connection) rather than the form (specific words). NVC is about the consciousness, not the vocabulary.',
      'Only practice with other NVC speakers.',
    ],
    correctAnswer: 2,
    explanation: 'NVC is a consciousness of connection, not a script. You can practice the spirit of NVC (curiosity, empathy, honesty) using natural language.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },

  // Additional fill-blank exercises for Tier 5
  {
    id: 't5-fill-1',
    type: 'fill-blank',
    question: 'Express appreciation using NVC format:',
    fillBlankData: {
      sentence: 'When you ___, I felt ___ because my need for ___ was met.',
      blankOptions: ['stayed late to help me', 'grateful', 'support', 'helped me', 'happy', 'help', 'were kind', 'relieved', 'kindness'],
      correctBlanks: ['stayed late to help me', 'grateful', 'support'],
    },
    options: [
      'helped me / happy / help',
      'stayed late to help me / grateful / support',
      'were kind / relieved / kindness',
      'did that / good / assistance',
    ],
    correctAnswer: 1,
    explanation: 'NVC appreciation includes: specific action (stayed late to help me), genuine feeling (grateful), and the need that was met (support). This is more connecting than generic praise.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },
  {
    id: 't5-fill-2',
    type: 'fill-blank',
    question: 'Practice mourning (NVC style) after a loss:',
    fillBlankData: {
      sentence: 'I\'m allowing myself to feel ___ because I deeply valued ___ and that need won\'t be met in this way anymore.',
      blankOptions: ['grief', 'connection', 'sad', 'having them', 'devastated', 'companionship', 'empty', 'their presence'],
      correctBlanks: ['grief', 'connection'],
    },
    options: [
      'sad / having them',
      'grief / connection',
      'devastated / their presence',
      'empty / their company',
    ],
    correctAnswer: 1,
    explanation: 'Mourning in NVC means connecting to feelings (grief) and the underlying needs/values (connection) rather than getting lost in thoughts about what we lost.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 5,
  },
  {
    id: 't5-fill-3',
    type: 'fill-blank',
    question: 'In a multi-party conflict, help both sides feel heard:',
    fillBlankData: {
      sentence: 'It sounds like you\'re feeling ___ because you need ___. And you\'re feeling ___ because you need ___.',
      blankOptions: ['frustrated', 'fairness', 'hurt', 'consideration', 'angry', 'respect', 'sad', 'understanding'],
      correctBlanks: ['frustrated', 'fairness', 'hurt', 'consideration'],
    },
    options: [
      'angry / respect / sad / understanding',
      'frustrated / fairness / hurt / consideration',
      'upset / to win / annoyed / to be right',
      'mad / control / ignored / attention',
    ],
    correctAnswer: 1,
    explanation: 'In conflict mediation, reflecting both parties\' feelings and needs (without taking sides) helps each person feel heard before problem-solving begins.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'empathy',
    tier: 5,
  },
  {
    id: 't5-fill-4',
    type: 'fill-blank',
    question: 'Replace "should" thinking with needs-based motivation:',
    fillBlankData: {
      sentence: 'Instead of "I should call my mother," try: "I ___ to call my mother because I ___ connection and want to contribute to her ___."',
      blankOptions: ['choose', 'value', 'well-being', 'have', 'need', 'happiness', 'want', 'like', 'joy'],
      correctBlanks: ['choose', 'value', 'well-being'],
    },
    options: [
      'have / need / happiness',
      'choose / value / well-being',
      'want / like / joy',
      'need / desire / life',
    ],
    correctAnswer: 1,
    explanation: 'Replacing "should" with "choose" and connecting to values and needs transforms obligation into willing choice. This leads to more joyful giving.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'self-care',
    tier: 5,
  },
  {
    id: 't5-fill-5',
    type: 'fill-blank',
    question: 'Complete this NVC appreciation:',
    fillBlankData: {
      sentence: 'When you ___, I felt ___ because my need for ___ was met. Thank you.',
      blankOptions: ['stayed late to help me finish', 'touched', 'support', 'helped out', 'grateful', 'teamwork'],
      correctBlanks: ['stayed late to help me finish', 'touched', 'support'],
    },
    options: [
      'helped out / grateful / teamwork',
      'stayed late to help me finish / touched / support',
      'were there for me / happy / friendship',
      'did that / good / help',
    ],
    correctAnswer: 1,
    explanation: 'Full NVC appreciation specifies the action (stayed late), the feeling it created (touched), and the need it met (support). Much more connecting than just "thanks!"',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },
  {
    id: 't5-fill-6',
    type: 'fill-blank',
    question: 'When mediating conflict, help both sides express needs:',
    fillBlankData: {
      sentence: 'So you\'re feeling ___ because you need ___, and you\'re feeling ___ because you need ___?',
      blankOptions: ['frustrated', 'fairness', 'hurt', 'consideration', 'angry', 'respect', 'sad', 'understanding'],
      correctBlanks: ['frustrated', 'fairness', 'hurt', 'consideration'],
    },
    options: [
      'angry / respect / sad / understanding',
      'frustrated / fairness / hurt / consideration',
      'upset / equality / bad / acknowledgment',
      'mad / justice / hurt / care',
    ],
    correctAnswer: 1,
    explanation: 'In mediation, reflecting both parties\' feelings and needs helps them hear each other. Once needs are clear, finding strategies that meet both becomes possible.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'empathy',
    tier: 5,
  },
  {
    id: 't5-fill-7',
    type: 'fill-blank',
    question: 'Transform punishment thinking into NVC protective use of force:',
    fillBlankData: {
      sentence: 'Instead of punishment, I\'m setting this boundary to protect ___ and meet my need for ___.',
      blankOptions: ['safety', 'peace', 'you from consequences', 'obedience', 'everyone', 'harmony'],
      correctBlanks: ['safety', 'peace'],
    },
    options: [
      'you from consequences / obedience',
      'safety / peace',
      'everyone / harmony',
      'my interests / control',
    ],
    correctAnswer: 1,
    explanation: 'Protective force (unlike punishment) aims to protect life and meet needs, not to make someone suffer. The goal is safety and peace, not control.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
    tier: 5,
  },
];

// ============================================================================
// COMBINE ALL EXERCISES
// ============================================================================

export const EXERCISES: Exercise[] = [
  ...TIER_1_EXERCISES,
  ...TIER_2_EXERCISES,
  ...TIER_3_EXERCISES,
  ...TIER_4_EXERCISES,
  ...TIER_5_EXERCISES,
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// Get exercises by tier
export const getExercisesByTier = (tier: 1 | 2 | 3 | 4 | 5): Exercise[] => {
  return EXERCISES.filter(e => e.tier === tier);
};

// Get available exercises based on completed count
export const getAvailableExercises = (completedCount: number): Exercise[] => {
  let maxTier: 1 | 2 | 3 | 4 | 5;
  if (completedCount < 15) maxTier = 1;
  else if (completedCount < 40) maxTier = 2;
  else if (completedCount < 75) maxTier = 3;
  else if (completedCount < 120) maxTier = 4;
  else maxTier = 5;

  return EXERCISES.filter(e => e.tier <= maxTier);
};

// Get user's current tier based on completed exercises
export const getUserTier = (completedCount: number): 1 | 2 | 3 | 4 | 5 => {
  if (completedCount < 15) return 1;
  if (completedCount < 40) return 2;
  if (completedCount < 75) return 3;
  if (completedCount < 120) return 4;
  return 5;
};

// Get tier name
export const getTierName = (tier: 1 | 2 | 3 | 4 | 5): string => {
  const names: Record<number, string> = {
    1: 'Introductory',
    2: 'Foundations',
    3: 'Building Skills',
    4: 'Advanced Practice',
    5: 'Mastery',
  };
  return names[tier];
};

// Get tier description
export const getTierDescription = (tier: 1 | 2 | 3 | 4 | 5): string => {
  const descriptions: Record<number, string> = {
    1: 'Basic observations vs evaluations, simple feeling identification',
    2: 'Real feelings vs faux feelings, connecting feelings to needs',
    3: 'Jackal-to-giraffe translations, NVC sentence building, empathy recognition',
    4: 'Full scenario responses, expressing anger with NVC, self-empathy',
    5: 'Multi-party conflicts, appreciation in NVC, advanced empathic listening',
  };
  return descriptions[tier];
};

// Get exercises by category
export const getExercisesByCategory = (category: string): Exercise[] => {
  return EXERCISES.filter(e => e.category === category);
};

// Get exercises by difficulty
export const getExercisesByDifficulty = (difficulty: string): Exercise[] => {
  return EXERCISES.filter(e => e.difficulty === difficulty);
};

// Get random exercises for practice - respects tier progression
// Ensures type variety within a session and prioritizes current tier
// with some previous tier exercises mixed in
// excludeIds: IDs to exclude (e.g., from last session to avoid repeats)
export const getDailyExercises = (
  count: number = 5,
  completedCount: number = 0,
  excludeIds: string[] = []
): Exercise[] => {
  const currentTier = getUserTier(completedCount);
  const currentTierExercises = getExercisesByTier(currentTier);
  const excludeSet = new Set(excludeIds);

  // Mix in some exercises from previous tier(s) for reinforcement (about 20-30%)
  let previousTierExercises: Exercise[] = [];
  if (currentTier > 1) {
    const prevTier = (currentTier - 1) as 1 | 2 | 3 | 4 | 5;
    previousTierExercises = getExercisesByTier(prevTier);
  }

  // Determine how many from each pool
  const prevCount = currentTier > 1 ? Math.max(1, Math.floor(count * 0.2)) : 0;
  const currentCount = count - prevCount;

  // Shuffle both pools, filtering out excluded IDs first
  const shuffledCurrent = [...currentTierExercises]
    .filter(e => !excludeSet.has(e.id))
    .sort(() => Math.random() - 0.5);
  const shuffledPrev = [...previousTierExercises]
    .filter(e => !excludeSet.has(e.id))
    .sort(() => Math.random() - 0.5);

  // Build initial pool: prioritize current tier, add some previous tier
  const pool = [
    ...shuffledCurrent.slice(0, currentCount + 5), // grab extras for variety filtering
    ...shuffledPrev.slice(0, prevCount + 3),
  ];

  // Select exercises ensuring:
  // 1. No duplicate exercise IDs
  // 2. No two consecutive exercises have the same type
  // 3. No duplicate questions (similar question text)
  const selected: Exercise[] = [];
  const usedIds = new Set<string>();
  const remaining = [...pool];

  while (selected.length < count && remaining.length > 0) {
    const lastType = selected.length > 0 ? selected[selected.length - 1].type : null;
    const lastCategory = selected.length > 0 ? selected[selected.length - 1].category : null;

    // Try to find an exercise with a different type AND category than the last one, and not already used
    let candidateIndex = remaining.findIndex(
      e => !usedIds.has(e.id) && e.type !== lastType && e.category !== lastCategory
    );

    // If not possible with both constraints, just avoid same type and duplicates
    if (candidateIndex === -1) {
      candidateIndex = remaining.findIndex(e => !usedIds.has(e.id) && e.type !== lastType);
    }

    // If still not possible, just avoid duplicates
    if (candidateIndex === -1) {
      candidateIndex = remaining.findIndex(e => !usedIds.has(e.id));
    }

    // If all remaining are duplicates, break
    if (candidateIndex === -1) {
      break;
    }

    const exercise = remaining[candidateIndex];
    selected.push(exercise);
    usedIds.add(exercise.id);
    remaining.splice(candidateIndex, 1);
  }

  // If we still don't have enough (unlikely), fill from the full available pool
  if (selected.length < count) {
    const available = getAvailableExercises(completedCount);
    const extras = available.filter(e => !usedIds.has(e.id) && !excludeSet.has(e.id)).sort(() => Math.random() - 0.5);
    for (const ex of extras) {
      if (selected.length >= count) break;
      selected.push(ex);
      usedIds.add(ex.id);
    }
  }

  return selected;
};

// Get exercises for introduction (tier 1 only)
export const getIntroExercises = (count: number = 3): Exercise[] => {
  const tier1 = getExercisesByTier(1);
  const shuffled = [...tier1].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get exercise type display name
export const getExerciseTypeName = (type: string): string => {
  const names: Record<string, string> = {
    'spot-judgment': 'Spot the Judgment',
    'feeling-or-faux': 'Feeling or Faux?',
    'need-finder': 'Need Finder',
    'jackal-to-giraffe': 'Jackal to Giraffe',
    'fill-blank': 'Fill in the Blank',
    'scenario': 'Real Scenario',
    'empathy-check': 'Empathy Check',
    'self-empathy': 'Self-Empathy',
    'anger-nvc': 'Expressing Anger',
    'appreciation': 'NVC Appreciation',
  };
  return names[type] || type;
};

// Get tier progress info
export const getTierProgress = (completedCount: number): { current: number; next: number; percentage: number } => {
  const tiers = [0, 15, 40, 75, 120, Infinity];
  const currentTier = getUserTier(completedCount);
  const currentThreshold = tiers[currentTier - 1];
  const nextThreshold = tiers[currentTier];

  if (nextThreshold === Infinity) {
    return { current: completedCount, next: completedCount, percentage: 100 };
  }

  const progress = completedCount - currentThreshold;
  const total = nextThreshold - currentThreshold;
  const percentage = Math.round((progress / total) * 100);

  return { current: progress, next: total, percentage };
};
