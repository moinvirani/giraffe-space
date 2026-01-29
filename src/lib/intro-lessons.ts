// NVC Introduction Lessons
// Fun, engaging lessons that teach the basics before daily practice

export interface IntroLesson {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  slides: IntroSlide[];
  quiz: IntroQuiz;
}

export interface IntroSlide {
  type: 'story' | 'concept' | 'example' | 'comparison';
  title: string;
  content: string;
  highlight?: string;
  image?: string; // emoji for now
}

export interface IntroQuiz {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const INTRO_LESSONS: IntroLesson[] = [
  {
    id: 1,
    title: 'Meet the Giraffe',
    subtitle: 'Why giraffes speak from the heart',
    icon: '🦒',
    color: '#F4A261', // primary orange
    slides: [
      {
        type: 'story',
        title: 'Two Ways to Talk',
        content: 'Imagine two animals having a disagreement. One snaps and attacks. The other pauses, listens, and speaks from the heart.',
        image: '🦒',
      },
      {
        type: 'concept',
        title: 'A Gift from Dr. Rosenberg',
        content: 'Nonviolent Communication (NVC) was created by Dr. Marshall Rosenberg, a psychologist who dedicated his life to helping people connect through compassionate communication.',
        highlight: 'Dr. Marshall Rosenberg',
        image: '🎓',
      },
      {
        type: 'concept',
        title: 'The Giraffe Way',
        content: 'Giraffes have the biggest hearts of any land animal. In NVC, "Giraffe language" means speaking with compassion and honesty—just as Dr. Rosenberg taught.',
        highlight: 'biggest hearts',
        image: '💚',
      },
      {
        type: 'concept',
        title: 'The Jackal Way',
        content: '"Jackal language" is when we judge, blame, or criticize. It\'s not bad—it\'s just what we learned. We can learn a new way!',
        highlight: 'We can learn a new way',
        image: '🐺',
      },
      {
        type: 'example',
        title: 'Same Situation, Different Words',
        content: 'Jackal: "You never listen to me!"\n\nGiraffe: "When you look at your phone while I\'m talking, I feel sad because I need connection."',
        image: '💬',
      },
    ],
    quiz: {
      question: 'What makes "Giraffe language" different?',
      options: [
        'It\'s about winning arguments',
        'It speaks from the heart with honesty and compassion',
        'It\'s about being nice even when you\'re upset',
        'It means never expressing negative feelings',
      ],
      correctAnswer: 1,
      explanation: 'Giraffe language is about honest, heartfelt communication—expressing what\'s true for you while staying connected to others.',
    },
  },
  {
    id: 2,
    title: 'Facts vs. Judgments',
    subtitle: 'Observations: What a camera would see',
    icon: '👁️',
    color: '#2A9D8F', // sage green
    slides: [
      {
        type: 'concept',
        title: 'The First Step',
        content: 'NVC has four steps. The first is OBSERVATION—describing what happened without adding judgment or interpretation.',
        highlight: 'OBSERVATION',
        image: '1️⃣',
      },
      {
        type: 'comparison',
        title: 'Camera Test',
        content: 'Ask yourself: "Would a camera record this?"\n\n❌ "She was rude" (interpretation)\n✅ "She walked away while I was talking" (observation)',
        image: '📷',
      },
      {
        type: 'example',
        title: 'Spot the Difference',
        content: '❌ Judgment: "You\'re always late"\n✅ Observation: "The last three times we met, you arrived 15 minutes after we planned"',
        image: '🔍',
      },
      {
        type: 'story',
        title: 'Why This Matters',
        content: 'When we mix observations with judgments, people get defensive. Pure observations help others hear us without feeling attacked.',
        highlight: 'hear us without feeling attacked',
        image: '🎯',
      },
    ],
    quiz: {
      question: 'Which statement is a pure observation?',
      options: [
        '"You\'re being inconsiderate"',
        '"You left the dishes in the sink for three days"',
        '"You don\'t care about cleanliness"',
        '"You\'re so lazy about chores"',
      ],
      correctAnswer: 1,
      explanation: '"You left the dishes in the sink for three days" is something a camera could record—no interpretation added!',
    },
  },
  {
    id: 3,
    title: 'Real Feelings',
    subtitle: 'Feelings vs. Faux Feelings',
    icon: '💗',
    color: '#E76F51', // coral
    slides: [
      {
        type: 'concept',
        title: 'Step Two: Feelings',
        content: 'After observing, we check in with our FEELINGS. Real feelings are sensations in our body—not thoughts about what others did to us.',
        highlight: 'FEELINGS',
        image: '2️⃣',
      },
      {
        type: 'comparison',
        title: 'Real vs. Faux',
        content: '✅ Real feelings: sad, anxious, joyful, frustrated, peaceful\n\n❌ Faux feelings: ignored, betrayed, manipulated, rejected\n\nFaux feelings blame others!',
        image: '🎭',
      },
      {
        type: 'example',
        title: 'Transform Faux to Real',
        content: '❌ "I feel ignored"\n(This blames someone for ignoring you)\n\n✅ "I feel lonely and sad"\n(This is what\'s actually happening inside you)',
        image: '✨',
      },
      {
        type: 'story',
        title: 'Owning Your Feelings',
        content: 'When we say "I feel ignored," we make others responsible for our feelings. When we say "I feel lonely," we take ownership and open the door to connection.',
        highlight: 'open the door to connection',
        image: '🚪',
      },
    ],
    quiz: {
      question: 'Which is a REAL feeling?',
      options: [
        'Unappreciated',
        'Disappointed',
        'Abandoned',
        'Attacked',
      ],
      correctAnswer: 1,
      explanation: '"Disappointed" is a real feeling you experience in your body. The others are faux feelings that imply someone did something to you.',
    },
  },
  {
    id: 4,
    title: 'Needs & Requests',
    subtitle: 'What we need and how to ask',
    icon: '🌱',
    color: '#4A6741', // deep sage
    slides: [
      {
        type: 'concept',
        title: 'Step Three: Needs',
        content: 'Behind every feeling is a NEED. Needs are universal—everyone has them! Connection, respect, autonomy, safety, meaning, rest, play...',
        highlight: 'NEED',
        image: '3️⃣',
      },
      {
        type: 'example',
        title: 'Finding the Need',
        content: '"I feel frustrated" → I need to be heard\n"I feel anxious" → I need safety\n"I feel joyful" → My need for play is met!',
        image: '🧭',
      },
      {
        type: 'concept',
        title: 'Step Four: Requests',
        content: 'Finally, we make a clear REQUEST—a specific action someone could take. Not a demand! The other person can say no.',
        highlight: 'REQUEST',
        image: '4️⃣',
      },
      {
        type: 'comparison',
        title: 'Request vs. Demand',
        content: '❌ Demand: "Stop using your phone at dinner!" (consequences if refused)\n\n✅ Request: "Would you be willing to put your phone away during our meal?"',
        image: '🤝',
      },
    ],
    quiz: {
      question: 'What makes a request different from a demand?',
      options: [
        'Requests are more polite',
        'Requests allow the other person to say no',
        'Demands are louder',
        'Requests are for small things only',
      ],
      correctAnswer: 1,
      explanation: 'A true request gives the other person freedom to say no without punishment. That\'s what makes it different from a demand!',
    },
  },
];

export const getIntroLesson = (lessonNumber: number): IntroLesson | undefined => {
  return INTRO_LESSONS.find(lesson => lesson.id === lessonNumber);
};

export const getTotalIntroLessons = (): number => {
  return INTRO_LESSONS.length;
};
