import { Language } from './exercise';

/**
 * Linguagens suportadas pelos Desafios com IA. TypeScript fica fora por enquanto:
 * o gerador/avaliador do servidor (server.ts) só conhece PHP e JavaScript.
 */
export type AiChallengeLanguage = Exclude<Language, 'typescript'>;

/** Trilha selecionada → linguagem dos Desafios IA (TS cai para JS, a mais próxima). */
export function toAiChallengeLanguage(language: Language): AiChallengeLanguage {
  return language === 'typescript' ? 'javascript' : language;
}

export type AiChallengeDifficulty =
  | 'muito_facil'
  | 'facil'
  | 'intermediario'
  | 'dificil'
  | 'muito_dificil';

export interface AiChallengeTestCase {
  description: string;
  input: string;
  expectedOutput: string;
  isEdgeCase?: boolean;
}

export interface AiChallengeUsageExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface AiChallenge {
  id: string;
  title: string;
  language: AiChallengeLanguage;
  topic: string;
  difficulty: AiChallengeDifficulty;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
  description: string;
  functionalRequirements: string[];
  technicalConstraints: string[];
  usageExamples: AiChallengeUsageExample[];
  testCases: AiChallengeTestCase[];
  hints: string[]; // Progressivas: 1 conceitual, 2 recurso da linguagem, 3 abordagem detalhada
  starterCode: string;
  solutionCode: string;
  explanation: string;
  isFallback?: boolean;
  fallbackNotice?: string;
}

export interface AiChallengeTestRunResult {
  description: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

export interface AiChallengeEvaluation {
  score: number; // 0 to 10
  passed: boolean; // score >= 7
  testsPassedPercentage: number; // 0 to 100
  requirementsMet: string[];
  requirementsUnmet: string[];
  syntaxAndErrors: string[];
  improvements: string[];
  explanation: string;
  testResults: AiChallengeTestRunResult[];
  environmentNote?: string;
  evaluatedAt: string;
}

export interface AiChallengeAttempt {
  challengeId: string;
  challenge: AiChallenge;
  userCode: string;
  evaluation?: AiChallengeEvaluation | null;
  passed: boolean;
  score: number;
  attemptsCount: number;
  lastAttemptAt: string;
  completedAt?: string | null;
  unlockedHintsCount: number;
}
