export type Language = 'php' | 'javascript';
export type Difficulty = 'basico' | 'intermediario' | 'avancado' | 'dev';
export type ExerciseType =
  | 'lacunas'
  | 'codigo_livre'
  | 'corrigir_erros'
  | 'prever_saida'
  | 'desafio_pratico';

export interface Blank {
  id: string; // e.g. "blank_0"
  label: string; // Description of what this blank represents
  placeholder?: string;
  expectedAnswers: string[]; // List of acceptable code strings
  validationRegex?: string; // Optional regex for flexible matching
  hint: string;
}

export interface TestCase {
  description: string;
  input?: string;
  expectedOutput: string;
  testFunction?: string; // JS code evaluation snippet
}

export interface AlternativeSolution {
  title: string;
  code: string;
  explanation: string;
  isRecommended?: boolean;
}

export interface UserStory {
  asA: string;
  iWant: string;
  soThat: string;
}

export interface AcceptanceCriterion {
  id: string;
  label: string;
}

export interface ProjectBrief {
  clientName: string;
  poName: string;
  businessContext: string;
  userStories: UserStory[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  acceptanceCriteria: AcceptanceCriterion[];
  databaseSchema?: string;
  architectureNotes?: string;
}

export interface Exercise {
  id: string;
  language: Language;
  difficulty: Difficulty;
  type: ExerciseType;
  topic: string;
  title: string;
  summary: string;
  description: string;
  realWorldContext: string;
  goal: string;
  templateCode: string; // contains {{blank_0}} for lacunas, or starter code for free code/challenges
  blanks?: Blank[];
  solutionCode: string;
  hints: string[];
  testCases: TestCase[];
  explanation: string;
  alternativeSolutions?: AlternativeSolution[];
  projectBrief?: ProjectBrief; // For DEV module projects

  // Extensions for new exercise modalities:
  initialBuggyCode?: string; // For 'corrigir_erros'
  buggyLineNumbers?: number[]; // Lines where bug is located
  bugDescription?: string; // Context for what error occurs (e.g. fatal error, wrong total)
  
  codeToPredict?: string; // For 'prever_saida' (code snippet displayed for mental execution)
  expectedOutputPrediction?: string; // Expected exact or normalized stdout/return
  acceptableOutputPredictions?: string[]; // Multiple valid representations
  
  practicalRequirements?: string[]; // For 'desafio_pratico'
  validationRules?: Array<{
    id: string;
    description: string;
    type: 'contains' | 'not_contains' | 'regex' | 'custom_check';
    target: string;
  }>;
}

export interface ExerciseAttempt {
  exerciseId: string;
  passed: boolean;
  attemptsCount: number;
  completedAt?: string | null;
  lastAttemptAt: string;
  userBlanks?: Record<string, string>;
  userCode?: string;
  revealedSolution?: boolean;
  hintsUsed: number;
  checklistDone?: string[];
  outputPrediction?: string;
}

import { AiChallengeAttempt } from './aiChallenge';

export interface UserProgress {
  selectedLanguage: Language;
  completedIds: string[];
  attempts: Record<string, ExerciseAttempt>;
  aiChallenges?: Record<string, AiChallengeAttempt>;
  streak: {
    currentStreak: number;
    lastActiveDate: string;
    activeDates: string[];
  };
}
