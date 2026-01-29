import { Exercise } from './types';

export const EXERCISES: Exercise[] = [
  // Spot the Judgment - Observations vs Evaluations
  {
    id: 'sj-1',
    type: 'spot-judgment',
    question: 'Which statement is a pure observation (without judgment)?',
    options: [
      'You never listen to me.',
      'You looked at your phone three times while I was talking.',
      'You\'re so rude when I\'m speaking.',
      'You clearly don\'t care about what I have to say.',
    ],
    correctAnswer: 1,
    explanation: '"You looked at your phone three times" describes what happened without adding interpretation. The other options include judgments like "never," "rude," and assumptions about caring.',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
  },
  {
    id: 'sj-2',
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
  },
  {
    id: 'sj-3',
    type: 'spot-judgment',
    question: 'Which statement is a pure observation?',
    options: [
      'He\'s being passive-aggressive.',
      'He said "fine" and then walked away.',
      'He\'s clearly upset with me.',
      'He never communicates properly.',
    ],
    correctAnswer: 1,
    explanation: '"He said \'fine\' and then walked away" describes the observable behavior. The other options interpret his intentions or use absolutes like "never."',
    xpReward: 10,
    difficulty: 'beginner',
    category: 'observations',
  },

  // Feeling or Faux Feeling
  {
    id: 'ff-1',
    type: 'feeling-or-faux',
    question: '"I feel ignored" — Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Ignored" is a faux feeling because it describes what you think someone is doing TO you, not your internal experience. A genuine feeling might be "lonely," "sad," or "disconnected."',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
  },
  {
    id: 'ff-2',
    type: 'feeling-or-faux',
    question: '"I feel anxious" — Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 0,
    explanation: '"Anxious" is a genuine feeling! It describes your internal emotional state without blaming others or describing their actions.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
  },
  {
    id: 'ff-3',
    type: 'feeling-or-faux',
    question: '"I feel unappreciated" — Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Unappreciated" is a faux feeling — it implies someone SHOULD be appreciating you. Try instead: "I feel sad" or "I feel discouraged" because you have a need for recognition.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
  },
  {
    id: 'ff-4',
    type: 'feeling-or-faux',
    question: '"I feel disappointed" — Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 0,
    explanation: '"Disappointed" is a genuine feeling! It describes your emotional state when expectations aren\'t met.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
  },
  {
    id: 'ff-5',
    type: 'feeling-or-faux',
    question: '"I feel betrayed" — Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Betrayed" is a faux feeling because it implies judgment about someone\'s actions. Genuine feelings underneath might be: hurt, shocked, scared, or devastated.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'feelings',
  },

  // Need Finder - Match feelings to needs
  {
    id: 'nf-1',
    type: 'need-finder',
    question: 'When someone feels lonely, which need is most likely unmet?',
    options: ['Autonomy', 'Connection', 'Achievement', 'Order'],
    correctAnswer: 1,
    explanation: 'Loneliness usually signals an unmet need for connection, belonging, or companionship.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'needs',
  },
  {
    id: 'nf-2',
    type: 'need-finder',
    question: 'When someone feels overwhelmed, which need might be unmet?',
    options: ['Space/Rest', 'Celebration', 'Contribution', 'Creativity'],
    correctAnswer: 0,
    explanation: 'Feeling overwhelmed often points to unmet needs for space, rest, or support.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'needs',
  },
  {
    id: 'nf-3',
    type: 'need-finder',
    question: 'When someone feels resentful about doing favors, which need might be unmet?',
    options: ['Playfulness', 'Autonomy/Choice', 'Beauty', 'Mourning'],
    correctAnswer: 1,
    explanation: 'Resentment around obligations often signals unmet needs for autonomy, choice, or freedom.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'needs',
  },
  {
    id: 'nf-4',
    type: 'need-finder',
    question: 'When someone feels hurt after being criticized, which need might be unmet?',
    options: ['Order', 'Acceptance/Understanding', 'Stimulation', 'Contribution'],
    correctAnswer: 1,
    explanation: 'Hurt from criticism often points to unmet needs for acceptance, understanding, or respect.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'needs',
  },

  // Jackal to Giraffe Transform
  {
    id: 'jg-1',
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
    difficulty: 'advanced',
    category: 'integration',
  },
  {
    id: 'jg-2',
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
    difficulty: 'advanced',
    category: 'integration',
  },
  {
    id: 'jg-3',
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
    difficulty: 'advanced',
    category: 'integration',
  },

  // Fill in the Blank - NVC Format
  {
    id: 'fb-1',
    type: 'fill-blank',
    question: 'Complete the NVC statement: "When you _____, I feel _____ because I need _____."',
    options: [
      'are late / angry / you to be on time',
      'arrived 30 minutes after we agreed / anxious / reliability',
      'disrespect me / hurt / respect',
      'don\'t care / sad / caring',
    ],
    correctAnswer: 1,
    explanation: 'A complete NVC statement needs: a specific observation (not "are late"), a genuine feeling (not "angry" which can mask deeper feelings), and a universal need (not a strategy like "you to be on time").',
    xpReward: 20,
    difficulty: 'advanced',
    category: 'integration',
  },
  {
    id: 'fb-2',
    type: 'fill-blank',
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
    difficulty: 'advanced',
    category: 'requests',
  },

  // Scenario Practice
  {
    id: 'sc-1',
    type: 'scenario',
    question: 'Your roommate left dirty dishes in the sink again. Which response follows NVC principles?',
    options: [
      '"You\'re so messy! Clean up after yourself!"',
      '"I noticed the dishes from last night are still in the sink. I feel frustrated because I value a clean shared space. Would you be willing to wash them before dinner?"',
      '"I feel like you don\'t respect our living space."',
      '"Whatever, I\'ll just do it myself like always."',
    ],
    correctAnswer: 1,
    explanation: 'This response includes all four NVC components: Observation (dishes in sink), Feeling (frustrated), Need (clean shared space), and Request (wash before dinner).',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
  },
  {
    id: 'sc-2',
    type: 'scenario',
    question: 'Your partner forgot your anniversary. Which NVC response works best?',
    options: [
      '"You obviously don\'t care about us anymore."',
      '"I feel disappointed that our anniversary wasn\'t acknowledged because celebrating our relationship matters to me. Could we plan something special this weekend?"',
      '"I feel forgotten and unimportant."',
      '"Fine. I\'ll remember this."',
    ],
    correctAnswer: 1,
    explanation: 'This response expresses disappointment (genuine feeling), the unmet need (celebrating the relationship), and makes a specific, doable request.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
  },
  {
    id: 'sc-3',
    type: 'scenario',
    question: 'A coworker takes credit for your idea in a meeting. Which is the best NVC response to say later?',
    options: [
      '"You stole my idea and that\'s not okay!"',
      '"When the idea I shared with you was presented as yours in the meeting, I felt confused and hurt because I value recognition for my contributions. Could we talk about how to handle shared ideas going forward?"',
      '"I feel backstabbed by you."',
      '"I guess I can\'t trust you anymore."',
    ],
    correctAnswer: 1,
    explanation: 'This response states the specific observation, genuine feelings (confused, hurt), the need (recognition), and makes a collaborative request.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
  },

  // MORE CHALLENGING EXERCISES - Intermediate & Advanced

  // Tricky Observations - subtle judgments
  {
    id: 'sj-4',
    type: 'spot-judgment',
    question: 'Which statement is a PURE observation without any judgment?',
    options: [
      'He spoke in a condescending tone.',
      'He said, "I already explained this to you twice."',
      'He was being patronizing.',
      'He obviously thinks I\'m stupid.',
    ],
    correctAnswer: 1,
    explanation: 'Only the exact words spoken are observable. "Condescending," "patronizing," and "thinks I\'m stupid" are all interpretations we add to what we hear.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'observations',
  },
  {
    id: 'sj-5',
    type: 'spot-judgment',
    question: 'This is tricky! Which is a pure observation?',
    options: [
      'She seemed upset.',
      'She raised her voice and left the room.',
      'She overreacted to the situation.',
      'She was clearly angry at me.',
    ],
    correctAnswer: 1,
    explanation: '"Raised her voice and left" is observable behavior. "Seemed upset," "overreacted," and "clearly angry at me" all involve interpretation.',
    xpReward: 15,
    difficulty: 'intermediate',
    category: 'observations',
  },
  {
    id: 'sj-6',
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
  },

  // Advanced Feelings - nuanced scenarios
  {
    id: 'ff-6',
    type: 'feeling-or-faux',
    question: '"I feel like you don\'t understand me" — Is this a genuine feeling or a faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: 'This is a thought, not a feeling! "I feel like..." is usually followed by a thought. The real feeling might be "frustrated," "disconnected," or "sad."',
    xpReward: 20,
    difficulty: 'advanced',
    category: 'feelings',
  },
  {
    id: 'ff-7',
    type: 'feeling-or-faux',
    question: '"I feel pressured" — Genuine feeling or faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"Pressured" implies someone is doing the pressing. Genuine feelings underneath might be "anxious," "overwhelmed," or "tense."',
    xpReward: 20,
    difficulty: 'advanced',
    category: 'feelings',
  },
  {
    id: 'ff-8',
    type: 'feeling-or-faux',
    question: '"I feel that this isn\'t fair" — Genuine feeling or faux feeling?',
    options: ['Genuine feeling', 'Faux feeling (thought disguised as feeling)'],
    correctAnswer: 1,
    explanation: '"I feel that..." is a thought, not a feeling. The genuine feelings might be "frustrated," "disappointed," or "hurt."',
    xpReward: 20,
    difficulty: 'advanced',
    category: 'feelings',
  },

  // Complex Need Identification
  {
    id: 'nf-5',
    type: 'need-finder',
    question: 'Someone says "I just want to be left alone!" What need are they likely trying to meet?',
    options: ['Connection', 'Space/Solitude', 'Understanding', 'Celebration'],
    correctAnswer: 1,
    explanation: 'While it might seem like they\'re rejecting connection, they\'re expressing a need for space, solitude, or perhaps rest and recovery.',
    xpReward: 20,
    difficulty: 'advanced',
    category: 'needs',
  },
  {
    id: 'nf-6',
    type: 'need-finder',
    question: 'A friend keeps checking their phone during dinner. What need might THEY be trying to meet?',
    options: ['Disrespect', 'Connection (with others)', 'Stimulation/Engagement', 'Order'],
    correctAnswer: 2,
    explanation: 'From their perspective, they might have unmet needs for stimulation, engagement, or perhaps connection with others via phone. Understanding this helps us respond with empathy.',
    xpReward: 20,
    difficulty: 'advanced',
    category: 'needs',
  },
  {
    id: 'nf-7',
    type: 'need-finder',
    question: 'Someone angrily says "You always do this!" What need might be unmet?',
    options: ['Consistency/Reliability', 'Submission', 'Being right', 'Revenge'],
    correctAnswer: 0,
    explanation: 'Behind the judgment "always" is often an unmet need for consistency, reliability, or trust. They want to be able to count on certain behavior.',
    xpReward: 20,
    difficulty: 'advanced',
    category: 'needs',
  },

  // Challenging Transformations
  {
    id: 'jg-4',
    type: 'jackal-to-giraffe',
    question: 'Transform: "You make me so angry when you do that!"',
    options: [
      'When you raise your voice, I feel angry because I need respect.',
      'You always make me angry.',
      'I\'m angry because of what you did.',
      'When you speak loudly, I notice tension in my chest. I\'m needing calm and understanding right now.',
    ],
    correctAnswer: 3,
    explanation: 'The best giraffe version takes full ownership of feelings (not "you make me"). It describes the physical sensation and the need without blame.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
  },
  {
    id: 'jg-5',
    type: 'jackal-to-giraffe',
    question: 'Transform: "Stop being so dramatic!"',
    options: [
      'You\'re overreacting as usual.',
      'I feel dismissed when you call me dramatic.',
      'When I hear strong emotions, I feel overwhelmed. I need some space to process. Would you be willing to pause for a moment?',
      'Could you calm down?',
    ],
    correctAnswer: 2,
    explanation: 'Instead of labeling someone "dramatic," the giraffe version owns our own overwhelm and makes a specific request for what we need.',
    xpReward: 25,
    difficulty: 'advanced',
    category: 'integration',
  },

  // Complex Scenarios
  {
    id: 'sc-4',
    type: 'scenario',
    question: 'You\'re in a heated argument and your partner says "You never listen!" What\'s the most NVC-aligned response?',
    options: [
      '"That\'s not true, I always listen!"',
      '"Are you feeling frustrated because you really want to be heard right now?"',
      '"Well, you never listen to me either!"',
      '"I feel attacked when you say that."',
    ],
    correctAnswer: 1,
    explanation: 'Reflecting their feeling and need (empathic guessing) de-escalates conflict. Even if your guess is wrong, it shows you\'re trying to understand.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
  },
  {
    id: 'sc-5',
    type: 'scenario',
    question: 'Your teenager rolls their eyes when you ask about homework. Best NVC response?',
    options: [
      '"Don\'t roll your eyes at me! That\'s disrespectful!"',
      '"I notice you rolled your eyes. I\'m curious—are you feeling frustrated? Is there something about homework that\'s stressing you out?"',
      '"I feel disrespected when you do that."',
      '"Why do you always have an attitude?"',
    ],
    correctAnswer: 1,
    explanation: 'Rather than labeling behavior as "disrespectful," showing genuine curiosity about their feelings opens dialogue and connection.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
  },
  {
    id: 'sc-6',
    type: 'scenario',
    question: 'A friend cancels plans last minute—for the third time. What\'s the NVC approach?',
    options: [
      '"You\'re so unreliable. I can\'t count on you."',
      '"The last three times we made plans, they were cancelled the day of. I feel disappointed and a bit confused. I value our friendship and want to understand—is something going on?"',
      '"I feel like you don\'t value our friendship."',
      '"Whatever. Don\'t bother making plans next time."',
    ],
    correctAnswer: 1,
    explanation: 'States the observation (three cancellations), genuine feelings (disappointed, confused), expresses care (value friendship), and opens with curiosity rather than judgment.',
    xpReward: 30,
    difficulty: 'advanced',
    category: 'integration',
  },
];

// Get exercises by category
export const getExercisesByCategory = (category: string): Exercise[] => {
  return EXERCISES.filter(e => e.category === category);
};

// Get exercises by difficulty
export const getExercisesByDifficulty = (difficulty: string): Exercise[] => {
  return EXERCISES.filter(e => e.difficulty === difficulty);
};

// Get random exercises for daily practice - prioritizes intermediate and advanced
export const getDailyExercises = (count: number = 5): Exercise[] => {
  // For daily practice (after intro), prioritize harder exercises
  const intermediate = EXERCISES.filter(e => e.difficulty === 'intermediate');
  const advanced = EXERCISES.filter(e => e.difficulty === 'advanced');
  const harder = [...intermediate, ...advanced];

  // Shuffle and take exercises, preferring harder ones
  const shuffledHard = [...harder].sort(() => Math.random() - 0.5);

  if (shuffledHard.length >= count) {
    return shuffledHard.slice(0, count);
  }

  // Fill with beginner if needed
  const beginner = EXERCISES.filter(e => e.difficulty === 'beginner');
  const shuffledBeginner = [...beginner].sort(() => Math.random() - 0.5);

  return [...shuffledHard, ...shuffledBeginner].slice(0, count);
};

// Get exercises for introduction (beginner only)
export const getIntroExercises = (count: number = 3): Exercise[] => {
  const beginner = EXERCISES.filter(e => e.difficulty === 'beginner');
  const shuffled = [...beginner].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Get exercise type display name
export const getExerciseTypeName = (type: string): string => {
  const names: Record<string, string> = {
    'spot-judgment': 'Spot the Judgment',
    'feeling-or-faux': 'Feeling or Faux?',
    'need-finder': 'Need Finder',
    'jackal-to-giraffe': 'Jackal → Giraffe',
    'fill-blank': 'Fill in the Blank',
    'scenario': 'Real Scenario',
  };
  return names[type] || type;
};
