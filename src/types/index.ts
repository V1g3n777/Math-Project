export type NavSection =
  | 'home'
  | 'desmos'
  | 'algebra'
  | 'geometry'
  | 'trigonometry'
  | 'calculus'
  | 'statistics'
  | 'practice'
  | 'formulas'
  | 'progress'
  | 'settings';

export interface MathTopic {
  id: string;
  title: string;
  category: NavSection;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  icon: string;
  progress: number; // 0 to 100
  popular?: boolean;
  featuredFormula?: string;
}

export interface FormulaItem {
  id: string;
  title: string;
  category: 'Algebra' | 'Geometry' | 'Trigonometry' | 'Calculus' | 'Statistics' | 'Physics';
  latex: string;
  description: string;
  variables: { symbol: string; meaning: string }[];
  desmosExpression?: string; // Optional expression to load into Desmos
  tags: string[];
}

export interface PracticeProblem {
  id: string;
  title: string;
  category: NavSection;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  latex?: string;
  options: {
    id: string;
    text: string;
    latex?: string;
    isCorrect: boolean;
  }[];
  hint: string;
  explanation: string;
  explanationLatex?: string;
}

export interface UserProgressData {
  streak: number;
  lastActiveDate: string; // local calendar day, YYYY-MM-DD
  activeDates: string[]; // unique local days the site was actually opened
  studiedSeconds: number; // time spent with the tab visible
  completedProblems: string[]; // problem IDs
  masteredTopics: string[]; // topic IDs
  recentlyVisited: { topicId: string; visitedAt: string }[];
  visitedTopics: string[];
  xp: number;
  level: number;
  bookmarks: string[]; // formula IDs
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  angleUnit: 'radians' | 'degrees';
  fontSize: 'small' | 'medium' | 'large';
  animationsEnabled: boolean;
  soundEffects: boolean;
}
